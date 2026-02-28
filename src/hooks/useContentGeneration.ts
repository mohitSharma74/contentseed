import { useState, useCallback } from 'react';
import type { Platform, PlatformOutput, GenerationOptions, ParsedContent } from '@/types';
import { createProvider } from '@/lib/providers/provider-factory';
import { extractContent } from '@/lib/parser/content-extractor';
import { getApiKey, getProvider } from '@/lib/security/key-manager';

export interface GenerationState {
  isGenerating: boolean;
  outputs: Record<Platform, PlatformOutput | null>;
  error: string | null;
}

export function useContentGeneration() {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    outputs: {
      twitter: null,
      linkedin: null,
      reddit: null,
      substack: null,
    },
    error: null,
  });

  const generateForPlatform = useCallback(
    async (
      parsedContent: ParsedContent,
      platform: Platform,
      options: Partial<GenerationOptions> = {}
    ): Promise<PlatformOutput | null> => {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('No API key configured');
      }

      const providerType = getProvider();
      const provider = createProvider(providerType, apiKey);

      const contentString = formatContentForPrompt(parsedContent);
      const generationOptions: GenerationOptions = {
        platform,
        tone: options.tone,
        length: options.length,
        includeHashtags: options.includeHashtags ?? true,
        includeEmojis: options.includeEmojis ?? false,
      };

      return provider.generate(contentString, generationOptions);
    },
    []
  );

  const generateAll = useCallback(
    async (markdown: string, options: Partial<GenerationOptions> = {}) => {
      setState(prev => ({ ...prev, isGenerating: true, error: null }));

      try {
        const content = await extractContent(markdown);

        const platforms: Platform[] = ['twitter', 'linkedin', 'reddit', 'substack'];
        const results = await Promise.all(
          platforms.map(platform =>
            generateForPlatform(content, platform, options).catch(err => {
              console.error(`Error generating ${platform}:`, err);
              return null;
            })
          )
        );

        const outputs = platforms.reduce(
          (acc, platform, index) => {
            acc[platform] = results[index];
            return acc;
          },
          {} as Record<Platform, PlatformOutput | null>
        );

        setState(prev => ({ ...prev, isGenerating: false, outputs }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          isGenerating: false,
          error: err instanceof Error ? err.message : 'Generation failed',
        }));
      }
    },
    [generateForPlatform]
  );

  const regenerate = useCallback(
    async (platform: Platform, options: Partial<GenerationOptions> = {}) => {
      const apiKey = getApiKey();
      if (!apiKey) {
        setState(prev => ({
          ...prev,
          error: 'No API key configured',
        }));
        return;
      }

      setState(prev => ({ ...prev, isGenerating: true, error: null }));

      try {
        const savedOutput = state.outputs[platform];
        if (!savedOutput) {
          throw new Error('No existing output to regenerate');
        }

        const providerType = getProvider();
        const provider = createProvider(providerType, apiKey);

        const generationOptions: GenerationOptions = {
          platform,
          tone: options.tone,
          length: options.length,
          includeHashtags: options.includeHashtags ?? true,
          includeEmojis: options.includeEmojis ?? false,
        };

        const newOutput = await provider.generate(
          `Regenerate this ${platform} content with improved quality:\n\n${savedOutput.content}`,
          generationOptions
        );

        setState(prev => ({
          ...prev,
          isGenerating: false,
          outputs: {
            ...prev.outputs,
            [platform]: newOutput,
          },
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          isGenerating: false,
          error: err instanceof Error ? err.message : 'Regeneration failed',
        }));
      }
    },
    [state.outputs]
  );

  const clearOutputs = useCallback(() => {
    setState(prev => ({
      ...prev,
      outputs: {
        twitter: null,
        linkedin: null,
        reddit: null,
        substack: null,
      },
      error: null,
    }));
  }, []);

  const setDemoOutputs = useCallback((demoOutputs: Record<Platform, PlatformOutput>) => {
    setState(prev => ({ ...prev, outputs: demoOutputs }));
  }, []);

  return {
    ...state,
    generateAll,
    regenerate,
    clearOutputs,
    setDemoOutputs,
  };
}

function formatContentForPrompt(content: ParsedContent): string {
  const parts: string[] = [];

  parts.push(`# ${content.title}\n`);

  if (content.tldr) {
    parts.push(`TL;DR: ${content.tldr}\n`);
  }

  if (content.headings.length > 0) {
    parts.push(`## Key Sections\n${content.headings.map(h => `### ${h}`).join('\n')}\n`);
  }

  if (content.paragraphs.length > 0) {
    parts.push(`## Content\n${content.paragraphs.join('\n\n')}\n`);
  }

  if (content.codeBlocks.length > 0) {
    parts.push(`## Code\n${content.codeBlocks.join('\n\n')}\n`);
  }

  if (content.stats.length > 0) {
    parts.push(`## Stats\n${content.stats.join(', ')}\n`);
  }

  if (content.links.length > 0) {
    parts.push(`## Links\n${content.links.join('\n')}`);
  }

  return parts.join('\n');
}
