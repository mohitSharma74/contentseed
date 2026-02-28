import { describe, it, expect } from 'vitest';
import { parseMarkdown, extractTitle, extractHeadings, extractParagraphs, extractCodeBlocks, extractLinks, extractStats, extractTldr } from '@/lib/parser/markdown-parser';

const sampleMarkdown = `# Building a Real-Time Collaborative Editor

A practical guide to implementing CRDTs

## TL;DR

CRDTs enable real-time collaboration without a central server.

## Introduction

Every developer faces the nightmare of conflict resolution.

### The Problem

When two users edit the same document simultaneously.

## Code Example

\`\`\`typescript
const ydoc = new Y.Doc();
const ytext = ydoc.getText('content');
\`\`\`

## Key Takeaways

- CRDTs are conflict-free by design
- They work without a central server
- Used by Figma, Google Docs, and Notion

Check out [Yjs Documentation](https://docs.yjs.dev/) for more.

This app handles 10k concurrent users with 99.9% uptime.
`;

describe('Markdown Parser', () => {
  it('should parse markdown into AST', async () => {
    const ast = await parseMarkdown(sampleMarkdown);
    expect(ast).toBeDefined();
    expect(ast.type).toBe('root');
  });

  it('should extract title from first h1', async () => {
    const ast = await parseMarkdown(sampleMarkdown);
    const title = extractTitle(ast);
    expect(title).toBe('Building a Real-Time Collaborative Editor');
  });

  it('should extract headings', async () => {
    const ast = await parseMarkdown(sampleMarkdown);
    const headings = extractHeadings(ast);
    expect(headings).toContain('TL;DR');
    expect(headings).toContain('Introduction');
    expect(headings).toContain('The Problem');
    expect(headings).toContain('Code Example');
    expect(headings).toContain('Key Takeaways');
  });

  it('should extract paragraphs', async () => {
    const ast = await parseMarkdown(sampleMarkdown);
    const paragraphs = extractParagraphs(ast);
    expect(paragraphs.length).toBeGreaterThan(0);
    expect(paragraphs.some(p => p.includes('conflict resolution'))).toBe(true);
  });

  it('should extract code blocks', async () => {
    const ast = await parseMarkdown(sampleMarkdown);
    const codeBlocks = extractCodeBlocks(ast);
    expect(codeBlocks.length).toBe(1);
    expect(codeBlocks[0]).toContain('const ydoc = new Y.Doc()');
  });

  it('should extract links', async () => {
    const ast = await parseMarkdown(sampleMarkdown);
    const links = extractLinks(ast);
    expect(links).toContain('https://docs.yjs.dev/');
  });

  it('should extract stats', async () => {
    const ast = await parseMarkdown(sampleMarkdown);
    const stats = extractStats(ast);
    expect(stats).toContain('10k');
    expect(stats).toContain('99.9');
  });

  it('should extract TL;DR', async () => {
    const ast = await parseMarkdown(sampleMarkdown);
    const tldr = extractTldr(ast);
    expect(tldr).toBeDefined();
    expect(tldr).toContain('CRDTs enable real-time collaboration');
  });
});

describe('Content Extraction', () => {
  it('should extract all content components', async () => {
    const { extractContent } = await import('@/lib/parser/content-extractor');
    const content = await extractContent(sampleMarkdown);
    
    expect(content.title).toBe('Building a Real-Time Collaborative Editor');
    expect(content.headings.length).toBeGreaterThan(0);
    expect(content.paragraphs.length).toBeGreaterThan(0);
    expect(content.codeBlocks.length).toBe(1);
    expect(content.links).toContain('https://docs.yjs.dev/');
    expect(content.tldr).toBeDefined();
  });
});
