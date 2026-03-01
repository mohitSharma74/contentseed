import type { LLMProvider } from './types';
import { AnthropicProvider } from './anthropic';
import { OpenAIProvider } from './openai';
import { GeminiProvider } from './gemini';

export function createProvider(
  provider: 'anthropic' | 'openai' | 'gemini',
  apiKey: string
): LLMProvider {
  switch (provider) {
    case 'anthropic':
      return new AnthropicProvider(apiKey);
    case 'openai':
      return new OpenAIProvider(apiKey);
    case 'gemini':
      return new GeminiProvider(apiKey);
    default:
      return new AnthropicProvider(apiKey);
  }
}

export { AnthropicProvider, OpenAIProvider, GeminiProvider };
export type { LLMProvider } from './types';
