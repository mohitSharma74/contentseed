import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMProvider, PlatformOutput, GenerationOptions } from './types';
import { buildPrompt } from '@/lib/prompts/platform-prompts';

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
    const systemPrompt = this.getSystemPrompt(options.platform);
    
    const model = this.client.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const text = result.response.text();
    return this.parseResponse(text, options.platform);
  }

  private getSystemPrompt(platform: string): string {
    const prompts: Record<string, string> = {
      twitter: `You are an expert Twitter content creator. Your task is to transform blog posts into engaging Twitter/X threads.

Key rules you MUST follow:
- Each tweet is MAX
- Hook firstIMUM 280 characters - the first tweet must grab attention immediately
- Thread format: "1/" through "5/" numbering
- NO links in tweets 1-4, ONLY in the final tweet (tweet 5)
- Hashtags ONLY on the final tweet (max 3)
- No emojis in the thread body, only in the final tweet if appropriate
- Make it feel native to Twitter, not a truncated blog post

Return JSON format:
{
  "content": "1/ Your hook here...\n\n2/ Key insight...",
  "hashtags": ["#topic1", "#topic2"],
  "hook": "Alternative hook for A/B testing"
}`,
      linkedin: `You are an expert LinkedIn content creator. Your task is to transform blog posts into professional LinkedIn posts.

Key rules you MUST follow:
- "Broetry" format: Single line that flows naturally (no line breaks mid-thought)
- The first line must be a "fold line" - under 140 characters to show fully in preview
- Add 1-2 engaging questions at the end to drive comments
- 3-5 relevant hashtags at the bottom
- Professional but personal tone
- No emoji overload - 1-2 max if at all
- Add subtle line breaks between paragraphs for readability

Return JSON format:
{
  "content": "Your LinkedIn post content...",
  "hashtags": ["#topic1", "#topic2", "#topic3"],
  "hook": "Alternative hook"
}`,
      reddit: `You are an expert Reddit content creator. Your task is to transform blog posts into valuable Reddit posts.

Key rules you MUST follow:
- VALUE FIRST - give away the key insights, don't just drop a link
- Start with a compelling TL;DR summary (Reddit style: "TL;DR: ...")
- Use Reddit markdown formatting (**, ##, > for quotes)
- Be authentic and helpful, not promotional
- Match the subreddit tone (usually casual, knowledgeable)
- Don't be overly salesy - Redditors hate self-promotion
- Include questions to spark discussion

Return JSON format:
{
  "content": "Your Reddit post with markdown...",
  "hashtags": [],
  "hook": "Alternative title/hook"
}`,
      substack: `You are an expert Substack Notes creator. Your task is to transform blog posts into compelling Substack Notes.

Key rules you MUST follow:
- Sweet spot: 400-550 characters
- NO hashtags - Sub them
- Createstack Notes doesn't use information gaps - tease without giving everything away
- Authentic voice over polished corporate tone
- Be conversational, like you're texting a friend about something cool you learned
- If mentioning the full post, make it feel like a preview, not a link dump
- 1-2 emojis max, only if they add meaning

Return JSON format:
{
  "content": "Your Substack Note...",
  "hashtags": [],
  "hook": "Alternative opening"
}`,
    };

    return prompts[platform] || prompts.twitter;
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
