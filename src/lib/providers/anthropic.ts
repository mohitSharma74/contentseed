import Anthropic from '@anthropic-ai/sdk';
import type { LLMProvider, PlatformOutput, GenerationOptions } from './types';
import { buildPrompt } from '@/lib/prompts/platform-prompts';
import { getModelFor } from '@/lib/config/env';

interface AnthropicModelConfig {
  model: string;
  maxTokens: number;
  temperature: number;
}

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey,
    });
  }

  async validateKey(apiKey: string): Promise<boolean> {
    try {
      const testClient = new Anthropic({ apiKey });
      await testClient.messages.create({
        model: getModelFor('anthropic', 'fast'),
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }],
      });
      return true;
    } catch {
      return false;
    }
  }

  async generate(prompt: string, options: GenerationOptions): Promise<PlatformOutput> {
    const fullPrompt = buildPrompt(prompt, options.platform);
    const systemPrompt = this.getSystemPrompt();
    const config = this.getModelConfig(options.speedMode);

    const response = await this.client.messages.create({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return this.parseResponse(text, options.platform);
  }

  private getModelConfig(mode: GenerationOptions['speedMode']): AnthropicModelConfig {
    switch (mode) {
      case 'quality':
        return {
          model: getModelFor('anthropic', 'quality'),
          maxTokens: 1800,
          temperature: 0.8,
        };
      case 'balanced':
        return {
          model: getModelFor('anthropic', 'balanced'),
          maxTokens: 1300,
          temperature: 0.7,
        };
      default:
        return {
          model: getModelFor('anthropic', 'fast'),
          maxTokens: 900,
          temperature: 0.5,
        };
    }
  }

  private getSystemPrompt(): string {
    return `You are a platform-native social writer.
Always return valid JSON with keys: content (string), hashtags (string[]), hook (string).
Do not include extra keys, markdown fences, or explanations outside JSON.`;
  }

  private parseResponse(text: string, platform: string): PlatformOutput {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          platform: platform as PlatformOutput['platform'],
          content: parsed.content || text,
          hashtags: parsed.hashtags || [],
          hook: parsed.hook,
        };
      }
    } catch {
      // Fall back to raw text
    }

    return {
      platform: platform as PlatformOutput['platform'],
      content: text,
      hashtags: [],
    };
  }
}
