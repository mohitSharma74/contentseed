interface ContentData {
  title: string;
  headings: string[];
  paragraphs: string[];
  codeBlocks: string[];
  links: string[];
  stats: string[];
  tldr?: string;
}

export function getSubstackPrompt(content: ContentData): string {
  const parts: string[] = [];

  parts.push(`# Topic: ${content.title}`);

  if (content.tldr) {
    parts.push(`\n## Quick Take: ${content.tldr}`);
  }

  if (content.headings.length > 0) {
    parts.push(`\n## I'll cover:\n${content.headings.slice(0, 3).map(h => `- ${h}`).join('\n')}`);
  }

  if (content.paragraphs.length > 0) {
    parts.push(`\n## The key insight:\n${content.paragraphs[0]}`);
  }

  if (content.links.length > 0) {
    parts.push(`\n## Full post: ${content.links[0]}`);
  }

  parts.push(`
## Task
Transform this into a Substack Note (400-550 characters).

Requirements:
1. 400-550 characters sweet spot
2. NO hashtags
3. Create curiosity gaps - tease, don't give everything
4. Conversational, like texting a friend
5. 1-2 emojis max if they add value
6. Be authentic, not polished

Return ONLY valid JSON:
{
  "content": "Your Substack Note...",
  "hashtags": [],
  "hook": "Alternative opening"
}`);
  return parts.join('\n');
}
