interface ContentData {
  title: string;
  headings: string[];
  paragraphs: string[];
  codeBlocks: string[];
  links: string[];
  stats: string[];
  tldr?: string;
}

export function getRedditPrompt(content: ContentData): string {
  const parts: string[] = [];

  parts.push(`# Blog Post: ${content.title}`);

  if (content.tldr) {
    parts.push(`\n## TL;DR: ${content.tldr}`);
  }

  if (content.headings.length > 0) {
    parts.push(`\n## Sections:\n${content.headings.join('\n')}`);
  }

  if (content.paragraphs.length > 0) {
    parts.push(`\n## Key Insights:\n${content.paragraphs.join('\n\n')}`);
  }

  if (content.codeBlocks.length > 0) {
    parts.push(`\n## Code Examples:\n${content.codeBlocks.slice(0, 2).join('\n\n')}`);
  }

  if (content.links.length > 0) {
    parts.push(`\n## Original Post: ${content.links[0]}`);
  }

  parts.push(`
## Task
Transform this blog post into a helpful Reddit post.

Requirements:
1. Value first - give insights, don't just link
2. Start with "TL;DR:" summary
3. Use Reddit markdown (**, ##, >)
4. Be authentic and helpful
5. Include questions to spark discussion
6. Don't be salesy - Redditors hate self-promotion

Return ONLY valid JSON:
{
  "content": "Your Reddit post with markdown...",
  "hashtags": [],
  "hook": "Alternative title"
}`);
  return parts.join('\n');
}
