import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';
import type { Root, Heading, Paragraph, RootContent } from 'mdast';

export async function parseMarkdown(markdown: string): Promise<Root> {
  const processor = unified().use(remarkParse, { fragment: true });
  const result = await processor.parse(markdown);
  return result as Root;
}

export function extractTitle(ast: Root): string {
  const firstHeading = ast.children.find(
    (node): node is Heading => node.type === 'heading' && node.depth === 1
  );
  
  if (firstHeading) {
    return toString(firstHeading);
  }
  
  const firstParagraph = ast.children.find(
    (node): node is Paragraph => node.type === 'paragraph'
  );
  
  if (firstParagraph) {
    const text = toString(firstParagraph);
    return text.slice(0, 100);
  }
  
  return 'Untitled';
}

export function extractHeadings(ast: Root): string[] {
  const headings: string[] = [];
  
  for (const node of ast.children) {
    if (node.type === 'heading' && node.depth >= 1 && node.depth <= 3) {
      headings.push(toString(node));
    }
  }
  
  return headings;
}

export function extractParagraphs(ast: Root): string[] {
  const paragraphs: string[] = [];
  
  for (const node of ast.children) {
    if (node.type === 'paragraph') {
      const text = toString(node);
      if (text.length > 50) {
        paragraphs.push(text);
      }
    }
  }
  
  return paragraphs;
}

export function extractCodeBlocks(ast: Root): string[] {
  const codeBlocks: string[] = [];
  
  for (const node of ast.children) {
    if (node.type === 'code' && node.value) {
      codeBlocks.push(node.value);
    }
  }
  
  return codeBlocks;
}

export function extractLinks(ast: Root): string[] {
  const links: string[] = [];
  
  function walk(node: RootContent) {
    if (node.type === 'link' && 'url' in node && node.url) {
      links.push(node.url);
    }
    if ('children' in node && node.children) {
      for (const child of node.children as RootContent[]) {
        walk(child);
      }
    }
  }
  
  for (const node of ast.children) {
    walk(node);
  }
  
  return [...new Set(links)];
}

export function extractStats(ast: Root): string[] {
  const stats: string[] = [];
  const statsRegex = /\b\d+(\.\d+)?(%|x|k|m|b|倍|个|万)?\b/gi;
  
  for (const node of ast.children) {
    if (node.type === 'paragraph') {
      const text = toString(node);
      const matches = text.match(statsRegex);
      if (matches) {
        stats.push(...matches);
      }
    }
  }
  
  return [...new Set(stats)];
}

export function extractTldr(ast: Root): string | undefined {
  for (const node of ast.children) {
    if (node.type === 'heading') {
      const text = toString(node).toLowerCase();
      if (text.includes('tldr') || text.includes('tl;dr') || text === 'summary') {
        const nextIndex = ast.children.indexOf(node) + 1;
        if (nextIndex < ast.children.length) {
          const nextNode = ast.children[nextIndex];
          if (nextNode.type === 'paragraph') {
            return toString(nextNode);
          }
        }
      }
    }
  }
  
  return undefined;
}
