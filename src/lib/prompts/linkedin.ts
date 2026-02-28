interface ContentData {
  title: string;
  headings: string[];
  paragraphs: string[];
  codeBlocks: string[];
  links: string[];
  stats: string[];
  tldr?: string;
}

export function getLinkedInPrompt(content: ContentData): string {
  const parts: string[] = [];

  parts.push(`# Blog Post: ${content.title}`);

  if (content.tldr) {
    parts.push(`\n## TL;DR: ${content.tldr}`);
  }

  if (content.headings.length > 0) {
    parts.push(`\n## Key Points:\n${content.headings.map(h => `- ${h}`).join('\n')}`);
  }

  if (content.paragraphs.length > 0) {
    parts.push(`\n## Content:\n${content.paragraphs.join('\n\n')}`);
  }

  if (content.stats.length > 0) {
    parts.push(`\n## Key Data: ${content.stats.join(', ')}`);
  }

  parts.push(`
## Task
Transform this blog post into a professional LinkedIn post.

Requirements:
1. "Broetry" format - flowing single lines, not wall of text
2. First line under 140 chars (fold line)
3. Add 1-2 questions to drive engagement
4. 3-5 hashtags at end
5. Professional but personal tone
6. No emoji spam (1-2 max if needed)

Return ONLY valid JSON:
{
  "content": "Your LinkedIn post...",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "hook": "Alternative opening"
}`);
  return parts.join('\n');
}
