interface ContentData {
  title: string;
  headings: string[];
  paragraphs: string[];
  codeBlocks: string[];
  links: string[];
  stats: string[];
  tldr?: string;
}

export function getTwitterPrompt(content: ContentData): string {
  const parts: string[] = [];

  parts.push(`# Blog Post Title: ${content.title}`);

  if (content.tldr) {
    parts.push(`\n## TL;DR: ${content.tldr}`);
  }

  if (content.headings.length > 0) {
    parts.push(`\n## Key Sections:\n${content.headings.map((h, i) => `${i + 1}. ${h}`).join('\n')}`);
  }

  if (content.paragraphs.length > 0) {
    parts.push(`\n## Main Content:\n${content.paragraphs.join('\n\n')}`);
  }

  if (content.codeBlocks.length > 0) {
    parts.push(`\n## Code Highlights:\n${content.codeBlocks.slice(0, 2).join('\n\n')}`);
  }

  if (content.stats.length > 0) {
    parts.push(`\n## Key Stats:\n${content.stats.join(', ')}`);
  }

  if (content.links.length > 0) {
    parts.push(`\n## Links: ${content.links[0]}`);
  }

  parts.push(`
## Task
Transform this blog post into a 5-tweet Twitter/X thread. 

Requirements:
1. Hook first - make the first tweet grab attention
2. Each tweet max 280 characters
3. Number tweets 1/ through 5/
4. NO links in tweets 1-4, only in final tweet
5. Hashtags only on final tweet (max 3)
6. Make it valuable, not a teaser

Return ONLY valid JSON:
{
  "content": "1/ Hook tweet...\n\n2/ Key insight...",
  "hashtags": ["#hashtag1", "#hashtag2"],
  "hook": "Alternative hook"
}`);

  return parts.join('\n');
}
