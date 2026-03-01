import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMProvider, PlatformOutput, GenerationOptions } from './types';
import { buildPrompt } from '@/lib/prompts/platform-prompts';

interface GeminiModelConfig {
  model: string;
  maxTokens: number;
  temperature: number;
}

export class GeminiProvider implements LLMProvider {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async validateKey(apiKey: string): Promise<boolean> {
    try {
      const testClient = new GoogleGenerativeAI(apiKey);
      const model = testClient.getGenerativeModel({ model: 'gemini-2.5-pro' });
      await model.generateContent('test');
      return true;
    } catch {
      return false;
    }
  }

  async generate(prompt: string, options: GenerationOptions): Promise<PlatformOutput> {
    const fullPrompt = buildPrompt(prompt, options.platform);
    const systemPrompt = this.getSystemPrompt();
    const config = this.getModelConfig(options.speedMode);
    
    const model = this.client.getGenerativeModel({ 
      model: config.model,
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      },
    });

    const text = result.response.text();
    return this.parseResponse(text, options.platform);
  }

  private getModelConfig(mode: GenerationOptions['speedMode']): GeminiModelConfig {
    switch (mode) {
      case 'quality':
        return {
          model: 'gemini-2.5-pro',
          maxTokens: 1700,
          temperature: 0.8,
        };
      case 'balanced':
        return {
          model: 'gemini-2.5-pro',
          maxTokens: 1200,
          temperature: 0.7,
        };
      default:
        return {
          model: 'gemini-2.5-pro',
          maxTokens: 800,
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
