import type { Platform } from '@/types';
import { getTwitterPrompt } from './twitter';
import { getLinkedInPrompt } from './linkedin';
import { getRedditPrompt } from './reddit';
import { getSubstackPrompt } from './substack';

export function buildPrompt(content: string, platform: Platform): string {
  const parsedContent = parseContentString(content);
  
  switch (platform) {
    case 'twitter':
      return getTwitterPrompt(parsedContent);
    case 'linkedin':
      return getLinkedInPrompt(parsedContent);
    case 'reddit':
      return getRedditPrompt(parsedContent);
    case 'substack':
      return getSubstackPrompt(parsedContent);
    default:
      return getTwitterPrompt(parsedContent);
  }
}

interface ContentData {
  title: string;
  headings: string[];
  paragraphs: string[];
  codeBlocks: string[];
  links: string[];
  stats: string[];
  tldr?: string;
}

function parseContentString(content: string): ContentData {
  const lines = content.split('\n');
  
  const title = extractTitle(lines);
  const headings = extractHeadings(lines);
  const paragraphs = extractParagraphs(lines);
  const codeBlocks = extractCodeBlocks(content);
  const links = extractLinks(content);
  const stats = extractStats(content);
  const tldr = extractTldr(content);

  return {
    title,
    headings,
    paragraphs,
    codeBlocks,
    links,
    stats,
    tldr,
  };
}

function extractTitle(lines: string[]): string {
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      return trimmed;
    }
    if (trimmed.startsWith('# ')) {
      return trimmed.slice(2).trim();
    }
  }
  return 'Untitled Post';
}

function extractHeadings(lines: string[]): string[] {
  const headings: string[] = [];
  for (const line of lines) {
    if (line.startsWith('## ') || line.startsWith('### ')) {
      headings.push(line.replace(/^#{2,3}\s*/, '').trim());
    }
  }
  return headings;
}

function extractParagraphs(lines: string[]): string[] {
  const paragraphs: string[] = [];
  let current = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('```')) {
      if (current) {
        paragraphs.push(current);
        current = '';
      }
    } else if (!trimmed.startsWith('- ') && !trimmed.startsWith('* ')) {
      current += (current ? ' ' : '') + trimmed;
    }
  }
  
  if (current) {
    paragraphs.push(current);
  }
  
  return paragraphs.slice(0, 5);
}

function extractCodeBlocks(content: string): string[] {
  const regex = /```[\s\S]*?```/g;
  const matches = content.match(regex);
  return matches?.map(m => m.replace(/```\w*\n?/g, '').trim()) || [];
}

function extractLinks(content: string): string[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = content.matchAll(regex);
  const links: string[] = [];
  
  for (const match of matches) {
    links.push(match[2]);
  }
  
  return links;
}

function extractStats(content: string): string[] {
  const regex = /\b\d+(?:\.\d+)?%?\b/g;
  const numbers = content.match(regex) || [];
  
  return numbers.slice(0, 10);
}

function extractTldr(content: string): string | undefined {
  const tldrMatch = content.match(/tl;dr:?\s*([^\n#]+)/i);
  return tldrMatch?.[1]?.trim();
}
