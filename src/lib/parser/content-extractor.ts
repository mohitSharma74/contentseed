import { parseMarkdown, extractTitle, extractHeadings, extractParagraphs, extractCodeBlocks, extractLinks, extractStats, extractTldr } from './markdown-parser';
import type { ParsedContent } from '@/types';

export async function extractContent(markdown: string): Promise<ParsedContent> {
  const ast = await parseMarkdown(markdown);
  
  return {
    title: extractTitle(ast),
    headings: extractHeadings(ast),
    paragraphs: extractParagraphs(ast),
    codeBlocks: extractCodeBlocks(ast),
    links: extractLinks(ast),
    stats: extractStats(ast),
    tldr: extractTldr(ast),
    raw: markdown,
  };
}
