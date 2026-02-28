import type { Platform, PlatformOutput, GenerationOptions } from '@/types';

export interface LLMProvider {
  generate(prompt: string, options: GenerationOptions): Promise<PlatformOutput>;
  validateKey(apiKey: string): Promise<boolean>;
}

export interface ProviderConfig {
  provider: 'anthropic' | 'openai' | 'gemini';
  apiKey: string;
  rememberKey: boolean;
}

export type { Platform, PlatformOutput, GenerationOptions };
