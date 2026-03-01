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
import { getProviderApiKeyFallback } from '@/lib/config/env';

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

      const providerType = getProvider();
      const apiKey = getApiKey() ?? getProviderApiKeyFallback(providerType);
      if (!apiKey) {
        setState(prev => ({ ...prev, error: 'No API key configured. Add a valid key in settings to continue.' }));
        return;
      }

      const runId = generationRunRef.current + 1;
      generationRunRef.current = runId;

      const startedAt = Date.now();
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
        const failedPlatforms: Array<{ platform: Platform; message: string }> = [];

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
            failedPlatforms.push({
              platform,
              message: mapGenerationError(err, 'generate'),
            });

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
          error: failedPlatforms.length > 0 ? buildBatchFailureMessage(failedPlatforms) : null,
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
          error: mapGenerationError(err, 'generate'),
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
    async (platform: Platform, markdown: string, options: Partial<GenerationOptions> = {}) => {
      const providerType = getProvider();
      const apiKey = getApiKey() ?? getProviderApiKeyFallback(providerType);
      if (!apiKey) {
        setState(prev => ({
          ...prev,
          error: 'No API key configured. Add a valid key in settings to continue.',
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
        const provider = createProvider(providerType, apiKey);
        let newOutput: PlatformOutput | null = null;

        if (markdown.trim()) {
          const parsedContent = await extractContent(markdown);
          newOutput = await generateForPlatform(provider, parsedContent, platform, options);
        } else {
          const savedOutput = state.outputs[platform];
          if (!savedOutput) {
            throw new Error('No existing output to regenerate');
          }

          const generationOptions: GenerationOptions = {
            platform,
            speedMode: options.speedMode ?? getSpeedMode(),
            tone: options.tone,
            length: options.length,
            includeHashtags: options.includeHashtags ?? true,
            includeEmojis: options.includeEmojis ?? false,
          };

          newOutput = await provider.generate(
            `Regenerate this ${platform} content with improved quality:\n\n${savedOutput.content}`,
            generationOptions
          );
        }

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
          error: mapGenerationError(err, 'regenerate'),
          timings: {
            ...prev.timings,
            completedAt: Date.now(),
          },
        }));
      }
    },
    [generateForPlatform, state.outputs]
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

type GenerationAction = 'generate' | 'regenerate';

function mapGenerationError(error: unknown, action: GenerationAction): string {
  const fallback = action === 'regenerate' ? 'Regeneration failed. Please try again.' : 'Generation failed. Please try again.';
  const raw = extractErrorText(error);
  const message = raw.toLowerCase();

  if (
    message.includes('invalid api key') ||
    message.includes('incorrect api key') ||
    message.includes('authentication') ||
    message.includes('unauthorized') ||
    message.includes('401')
  ) {
    return 'Invalid API key. Update your key in settings and try again.';
  }

  if (
    message.includes('rate limit') ||
    message.includes('too many requests') ||
    message.includes('429') ||
    message.includes('quota')
  ) {
    return 'Rate limit reached. Wait a moment and retry, or switch provider/speed mode.';
  }

  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error while contacting the provider. Check your connection and try again.';
  }

  return raw || fallback;
}

function buildBatchFailureMessage(failures: Array<{ platform: Platform; message: string }>): string {
  if (failures.length === 0) return '';

  if (failures.length === 1) {
    return `${failures[0].platform} failed: ${failures[0].message}`;
  }

  const invalidKeyFailures = failures.every(item => item.message.toLowerCase().includes('invalid api key'));
  if (invalidKeyFailures) {
    return 'Generation failed for all selected platforms: invalid API key.';
  }

  const rateLimitFailures = failures.every(item => item.message.toLowerCase().includes('rate limit'));
  if (rateLimitFailures) {
    return 'Rate limit reached for all selected platforms. Retry shortly.';
  }

  return `Failed platforms: ${failures.map(item => item.platform).join(', ')}`;
}

function extractErrorText(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const candidate = error as {
      message?: string;
      error?: { message?: string };
      status?: number;
    };

    if (candidate.message) return candidate.message;
    if (candidate.error?.message) return candidate.error.message;
    if (typeof candidate.status === 'number') return `Request failed with status ${candidate.status}`;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown provider error';
}
