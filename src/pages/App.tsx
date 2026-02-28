import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MarkdownEditor } from '@/components/input/MarkdownEditor';
import { PlatformTabs } from '@/components/output/PlatformTabs';
import { useMarkdownParser } from '@/hooks/useMarkdownParser';
import samplePost from '@/lib/demo/sample-post.md?raw';
import type { Platform, PlatformOutput } from '@/types';

export function App() {
  const [markdown, setMarkdown] = useState('');
  const [activePlatform, setActivePlatform] = useState<Platform>('twitter');
  const [outputs, setOutputs] = useState<Record<Platform, PlatformOutput | null>>({
    twitter: null,
    linkedin: null,
    reddit: null,
    substack: null,
  });
  const { parse, isParsing } = useMarkdownParser();

  useEffect(() => {
    const handleLoadSample = () => {
      setMarkdown(samplePost);
    };
    window.addEventListener('loadSamplePost', handleLoadSample);
    return () => window.removeEventListener('loadSamplePost', handleLoadSample);
  }, []);

  const handleGenerate = async () => {
    if (!markdown.trim()) return;
    await parse(markdown);
    
    const demoOutputs = await import('@/lib/demo/sample-outputs.json');
    setOutputs({
      twitter: {
        platform: 'twitter',
        content: demoOutputs.twitter.content,
        hashtags: demoOutputs.twitter.hashtags,
        hook: demoOutputs.twitter.hook,
      },
      linkedin: {
        platform: 'linkedin',
        content: demoOutputs.linkedin.content,
        hashtags: demoOutputs.linkedin.hashtags,
        hook: demoOutputs.linkedin.hook,
      },
      reddit: {
        platform: 'reddit',
        content: demoOutputs.reddit.content,
        hashtags: demoOutputs.reddit.hashtags,
        hook: demoOutputs.reddit.hook,
      },
      substack: {
        platform: 'substack',
        content: demoOutputs.substack.content,
        hashtags: demoOutputs.substack.hashtags,
        hook: demoOutputs.substack.hook,
      },
    });
  };

  const handleLoadSample = () => {
    setMarkdown(samplePost);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col border-r border-[var(--border)] min-h-0">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-semibold">Input</h2>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Load Sample Post
            </button>
          </div>
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
          <div className="p-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!markdown.trim() || isParsing}
              className="w-full py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isParsing ? 'Generating...' : 'Generate for All Platforms'}
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <PlatformTabs
            activePlatform={activePlatform}
            onPlatformChange={setActivePlatform}
            output={outputs[activePlatform]}
          />
        </div>
      </main>
    </div>
  );
}
