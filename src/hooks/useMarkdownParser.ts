import { useState, useCallback } from 'react';
import { extractContent } from '@/lib/parser/content-extractor';
import type { ParsedContent } from '@/types';

export function useMarkdownParser() {
  const [parsedContent, setParsedContent] = useState<ParsedContent | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parse = useCallback(async (markdown: string) => {
    setIsParsing(true);
    setError(null);
    
    try {
      const result = await extractContent(markdown);
      setParsedContent(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to parse markdown';
      setError(message);
      return null;
    } finally {
      setIsParsing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setParsedContent(null);
    setError(null);
  }, []);

  return {
    parsedContent,
    isParsing,
    error,
    parse,
    reset,
  };
}
