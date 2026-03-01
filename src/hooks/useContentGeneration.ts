import { useState, useCallback, useRef } from 'react';
import type {
  Platform,
  PlatformOutput,
  GenerationOptions,
  ParsedContent,
  PlatformGenerationStatus,
} from '@/types';
import { createProvider } from '@/lib/providers/provider-factory';
import { extractContent } from '@/lib/parser/content-extractor';
import type { LLMProvider } from '@/lib/providers/types';
import { getApiKey, getProvider, getSpeedMode } from '@/lib/security/key-manager';

interface GenerationTimings {
  startedAt: number | null;
  firstResultAt: number | null;
  completedAt: number | null;
}

export interface GenerationState {
  isGenerating: boolean;
  outputs: Record<Platform, PlatformOutput | null>;
  platformStatus: Record<Platform, PlatformGenerationStatus>;
  timings: GenerationTimings;
  error: string | null;
}

const DEFAULT_OUTPUTS: Record<Platform, PlatformOutput | null> = {
  twitter: null,
  linkedin: null,
  reddit: null,
  substack: null,
};

const DEFAULT_STATUS: Record<Platform, PlatformGenerationStatus> = {
  twitter: 'idle',
  linkedin: 'idle',
  reddit: 'idle',
  substack: 'idle',
};

export function useContentGeneration() {
  const generationRunRef = useRef(0);

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    outputs: { ...DEFAULT_OUTPUTS },
    platformStatus: { ...DEFAULT_STATUS },
    timings: {
      startedAt: null,
      firstResultAt: null,
      completedAt: null,
    },
    error: null,
  });

  const generateForPlatform = useCallback(
    async (
      provider: LLMProvider,
      parsedContent: ParsedContent,
      platform: Platform,
      options: Partial<GenerationOptions> = {},
      onChunk?: (content: string) => void
    ): Promise<PlatformOutput | null> => {
      const contentString = formatContentForPrompt(parsedContent);
      const generationOptions: GenerationOptions = {
        platform,
        speedMode: options.speedMode ?? getSpeedMode(),
        tone: options.tone,
        length: options.length,
        includeHashtags: options.includeHashtags ?? true,
        includeEmojis: options.includeEmojis ?? false,
      };

      if (provider.generateStream && onChunk) {
        return provider.generateStream(contentString, generationOptions, onChunk);
      }

      return provider.generate(contentString, generationOptions);
    },
    []
  );

  const generateForPlatforms = useCallback(
    async (
      markdown: string,
      platforms: Platform[],
      options: Partial<GenerationOptions> = {},
      priorityPlatform?: Platform
    ) => {
      if (platforms.length === 0) {
        setState(prev => ({ ...prev, error: 'Please select at least one platform' }));
        return;
      }

      const apiKey = getApiKey();
      if (!apiKey) {
        setState(prev => ({ ...prev, error: 'No API key configured' }));
        return;
      }

      const runId = generationRunRef.current + 1;
      generationRunRef.current = runId;

      const startedAt = Date.now();
      const providerType = getProvider();
      const provider = createProvider(providerType, apiKey);
      const orderedPlatforms = prioritizePlatforms(platforms, priorityPlatform);

      setState(prev => {
        const nextOutputs = { ...prev.outputs };
        const nextStatus = { ...DEFAULT_STATUS };

        for (const platform of platforms) {
          nextOutputs[platform] = null;
          nextStatus[platform] = 'queued';
        }

        return {
          ...prev,
          isGenerating: true,
          outputs: nextOutputs,
          platformStatus: nextStatus,
          error: null,
          timings: {
            startedAt,
            firstResultAt: null,
            completedAt: null,
          },
        };
      });

      try {
        const content = await extractContent(markdown);
        const failedPlatforms: Platform[] = [];

        const runForPlatform = async (platform: Platform) => {
          setState(prev => ({
            ...prev,
            platformStatus: {
              ...prev.platformStatus,
              [platform]: 'generating',
            },
          }));

          try {
            const output = await generateForPlatform(provider, content, platform, options, (partialContent) => {
              if (generationRunRef.current !== runId) return;
              setState(prev => ({
                ...prev,
                outputs: {
                  ...prev.outputs,
                  [platform]: {
                    platform,
                    content: partialContent,
                    hashtags: [],
                  },
                },
                timings: {
                  ...prev.timings,
                  firstResultAt: prev.timings.firstResultAt ?? Date.now(),
                },
              }));
            });
            if (generationRunRef.current !== runId) return;

            setState(prev => ({
              ...prev,
              outputs: {
                ...prev.outputs,
                [platform]: output,
              },
              platformStatus: {
                ...prev.platformStatus,
                [platform]: 'done',
              },
              timings: {
                ...prev.timings,
                firstResultAt: prev.timings.firstResultAt ?? Date.now(),
              },
            }));
          } catch (err) {
            console.error(`Error generating ${platform}:`, err);
            failedPlatforms.push(platform);

            if (generationRunRef.current !== runId) return;
            setState(prev => ({
              ...prev,
              platformStatus: {
                ...prev.platformStatus,
                [platform]: 'error',
              },
            }));
          }
        };

        const [firstPlatform, ...remainingPlatforms] = orderedPlatforms;
        const firstRun = runForPlatform(firstPlatform);
        await delay(120);
        const restRuns = remainingPlatforms.map(platform => runForPlatform(platform));
        await Promise.allSettled([firstRun, ...restRuns]);

        if (generationRunRef.current !== runId) return;
        setState(prev => ({
          ...prev,
          isGenerating: false,
          error: failedPlatforms.length > 0 ? `Failed: ${failedPlatforms.join(', ')}` : null,
          timings: {
            ...prev.timings,
            completedAt: Date.now(),
          },
        }));
      } catch (err) {
        if (generationRunRef.current !== runId) return;
        setState(prev => ({
          ...prev,
          isGenerating: false,
          platformStatus: { ...DEFAULT_STATUS },
          error: err instanceof Error ? err.message : 'Generation failed',
          timings: {
            ...prev.timings,
            completedAt: Date.now(),
          },
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

      setState(prev => ({
        ...prev,
        isGenerating: true,
        error: null,
        platformStatus: {
          ...prev.platformStatus,
          [platform]: 'generating',
        },
        timings: {
          startedAt: Date.now(),
          firstResultAt: null,
          completedAt: null,
        },
      }));

      try {
        const savedOutput = state.outputs[platform];
        if (!savedOutput) {
          throw new Error('No existing output to regenerate');
        }

        const providerType = getProvider();
        const provider = createProvider(providerType, apiKey);

        const generationOptions: GenerationOptions = {
          platform,
          speedMode: options.speedMode ?? getSpeedMode(),
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
          platformStatus: {
            ...prev.platformStatus,
            [platform]: 'done',
          },
          timings: {
            ...prev.timings,
            firstResultAt: prev.timings.firstResultAt ?? Date.now(),
            completedAt: Date.now(),
          },
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          isGenerating: false,
          platformStatus: {
            ...prev.platformStatus,
            [platform]: 'error',
          },
          error: err instanceof Error ? err.message : 'Regeneration failed',
          timings: {
            ...prev.timings,
            completedAt: Date.now(),
          },
        }));
      }
    },
    [state.outputs]
  );

  const clearOutputs = useCallback(() => {
    setState(prev => ({
      ...prev,
      outputs: { ...DEFAULT_OUTPUTS },
      platformStatus: { ...DEFAULT_STATUS },
      timings: {
        startedAt: null,
        firstResultAt: null,
        completedAt: null,
      },
      error: null,
    }));
  }, []);

  const setDemoOutputs = useCallback((demoOutputs: Record<Platform, PlatformOutput>) => {
    setState(prev => ({
      ...prev,
      outputs: demoOutputs,
      platformStatus: {
        twitter: 'done',
        linkedin: 'done',
        reddit: 'done',
        substack: 'done',
      },
      timings: {
        startedAt: null,
        firstResultAt: null,
        completedAt: null,
      },
    }));
  }, []);

  return {
    ...state,
    generateForPlatforms,
    regenerate,
    clearOutputs,
    setDemoOutputs,
  };
}

function formatContentForPrompt(content: ParsedContent): string {
  const MAX_PARAGRAPH_CHARS = 420;
  const MAX_CODE_CHARS = 700;
  const MAX_HEADINGS = 8;
  const MAX_PARAGRAPHS = 8;
  const MAX_STATS = 10;
  const MAX_LINKS = 5;

  const parts: string[] = [];

  parts.push(`# ${trimText(content.title, 120)}\n`);

  if (content.tldr) {
    parts.push(`TL;DR: ${trimText(content.tldr, 240)}\n`);
  }

  if (content.headings.length > 0) {
    parts.push(
      `## Key Sections\n${content.headings.slice(0, MAX_HEADINGS).map(h => `### ${trimText(h, 120)}`).join('\n')}\n`
    );
  }

  if (content.paragraphs.length > 0) {
    parts.push(
      `## Content\n${content.paragraphs
        .slice(0, MAX_PARAGRAPHS)
        .map(paragraph => trimText(paragraph, MAX_PARAGRAPH_CHARS))
        .join('\n\n')}\n`
    );
  }

  if (content.codeBlocks.length > 0) {
    parts.push(
      `## Code\n${content.codeBlocks
        .slice(0, 2)
        .map(code => trimText(code, MAX_CODE_CHARS))
        .join('\n\n')}\n`
    );
  }

  if (content.stats.length > 0) {
    parts.push(`## Stats\n${content.stats.slice(0, MAX_STATS).join(', ')}\n`);
  }

  if (content.links.length > 0) {
    parts.push(`## Links\n${content.links.slice(0, MAX_LINKS).join('\n')}`);
  }

  return parts.join('\n');
}

function trimText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trimEnd()}...`;
}

function prioritizePlatforms(platforms: Platform[], priorityPlatform?: Platform): Platform[] {
  if (!priorityPlatform || !platforms.includes(priorityPlatform)) {
    return platforms;
  }
  return [priorityPlatform, ...platforms.filter(platform => platform !== priorityPlatform)];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
