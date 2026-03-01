import OpenAI from 'openai';
import type { LLMProvider, PlatformOutput, GenerationOptions, StreamChunkHandler } from './types';
import { buildPrompt } from '@/lib/prompts/platform-prompts';

interface OpenAIModelConfig {
  model: string;
  maxTokens: number;
  temperature: number;
}

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async validateKey(apiKey: string): Promise<boolean> {
    try {
      const testClient = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });
      await testClient.models.list();
      return true;
    } catch {
      return false;
    }
  }

  async generate(prompt: string, options: GenerationOptions): Promise<PlatformOutput> {
    const fullPrompt = buildPrompt(prompt, options.platform);
    const systemPrompt = this.getSystemPrompt();
    const config = this.getModelConfig(options.speedMode);

    const response = await this.client.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: config.maxTokens,
      temperature: config.temperature,
    });

    const text = response.choices[0]?.message?.content || '';
    return this.parseResponse(text, options.platform);
  }

  async generateStream(
    prompt: string,
    options: GenerationOptions,
    onChunk: StreamChunkHandler
  ): Promise<PlatformOutput> {
    const fullPrompt = buildPrompt(prompt, options.platform);
    const systemPrompt = this.getSystemPrompt();
    const config = this.getModelConfig(options.speedMode);

    const stream = await this.client.chat.completions.create({
      model: config.model,
      stream: true,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: config.maxTokens,
      temperature: config.temperature,
    });

    let buffer = '';
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? '';
      if (!delta) continue;

      buffer += delta;
      const partialContent = extractContentFromPartialJson(buffer);
      if (partialContent) {
        onChunk(partialContent);
      }
    }

    return this.parseResponse(buffer, options.platform);
  }

  private getModelConfig(mode: GenerationOptions['speedMode']): OpenAIModelConfig {
    switch (mode) {
      case 'quality':
        return {
          model: 'gpt-5',
          maxTokens: 1700,
          temperature: 0.8,
        };
      case 'balanced':
        return {
          model: 'gpt-5',
          maxTokens: 1200,
          temperature: 0.7,
        };
      default:
        return {
          model: 'gpt-5',
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
      const parsed = JSON.parse(text);
      return {
        platform: platform as PlatformOutput['platform'],
        content: parsed.content || text,
        hashtags: parsed.hashtags || [],
        hook: parsed.hook,
      };
    } catch {
      return {
        platform: platform as PlatformOutput['platform'],
        content: text,
        hashtags: [],
      };
    }
  }
}

function extractContentFromPartialJson(raw: string): string | null {
  const markerMatch = raw.match(/"content"\s*:\s*"/);
  if (!markerMatch || markerMatch.index === undefined) {
    return null;
  }

  const start = markerMatch.index + markerMatch[0].length;
  let content = '';
  let escaped = false;

  for (let i = start; i < raw.length; i += 1) {
    const char = raw[i];

    if (escaped) {
      switch (char) {
        case 'n':
          content += '\n';
          break;
        case 't':
          content += '\t';
          break;
        case 'r':
          content += '\r';
          break;
        case '\\':
          content += '\\';
          break;
        case '"':
          content += '"';
          break;
        default:
          content += char;
      }
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      return content;
    }

    content += char;
  }

  return content || null;
}
