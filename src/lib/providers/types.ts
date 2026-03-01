import type { Platform, PlatformOutput, GenerationOptions } from '@/types';

export type StreamChunkHandler = (content: string) => void;

export interface LLMProvider {
  generate(prompt: string, options: GenerationOptions): Promise<PlatformOutput>;
  generateStream?(
    prompt: string,
    options: GenerationOptions,
    onChunk: StreamChunkHandler
  ): Promise<PlatformOutput>;
  validateKey(apiKey: string): Promise<boolean>;
}

export interface ProviderConfig {
  provider: 'anthropic' | 'openai' | 'gemini';
  apiKey: string;
  rememberKey: boolean;
  speedMode?: GenerationOptions['speedMode'];
}

export type { Platform, PlatformOutput, GenerationOptions };
