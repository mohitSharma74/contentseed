import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MarkdownEditor } from '@/components/input/MarkdownEditor';
import { PlatformTabs } from '@/components/output/PlatformTabs';
import { useMarkdownParser } from '@/hooks/useMarkdownParser';
import { useContentGeneration } from '@/hooks/useContentGeneration';
import samplePost from '@/lib/demo/sample-post.md?raw';
import sampleOutputs from '@/lib/demo/sample-outputs.json';
import type { Platform, PlatformOutput } from '@/types';
import { getApiKey } from '@/lib/security/key-manager';
import { ApiKeyModal } from '@/components/settings/ApiKeyModal';

export function App() {
  const [markdown, setMarkdown] = useState('');
  const [activePlatform, setActivePlatform] = useState<Platform>('twitter');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { parse, isParsing: isParsingMarkdown } = useMarkdownParser();
  const { generateAll, isGenerating, outputs, error, clearOutputs, setDemoOutputs } = useContentGeneration();

  useEffect(() => {
    const handleLoadSample = () => {
      setMarkdown(samplePost);
    };
    window.addEventListener('loadSamplePost', handleLoadSample);
    return () => window.removeEventListener('loadSamplePost', handleLoadSample);
  }, []);

  useEffect(() => {
    if (isDemoMode) {
      clearOutputs();
      const demoOutputs: Record<Platform, PlatformOutput> = {
        twitter: {
          platform: 'twitter',
          content: sampleOutputs.twitter.content,
          hashtags: sampleOutputs.twitter.hashtags,
          hook: sampleOutputs.twitter.hook,
        },
        linkedin: {
          platform: 'linkedin',
          content: sampleOutputs.linkedin.content,
          hashtags: sampleOutputs.linkedin.hashtags,
          hook: sampleOutputs.linkedin.hook,
        },
        reddit: {
          platform: 'reddit',
          content: sampleOutputs.reddit.content,
          hashtags: sampleOutputs.reddit.hashtags,
          hook: sampleOutputs.reddit.hook,
        },
        substack: {
          platform: 'substack',
          content: sampleOutputs.substack.content,
          hashtags: sampleOutputs.substack.hashtags,
          hook: sampleOutputs.substack.hook,
        },
      };
      setDemoOutputs(demoOutputs);
    }
  }, [isDemoMode, clearOutputs, setDemoOutputs]);

  const handleGenerate = async () => {
    if (!markdown.trim()) return;
    
    const apiKey = getApiKey();
    
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    
    await parse(markdown);
    await generateAll(markdown);
  };

  const handleDemoMode = () => {
    setIsDemoMode(true);
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
              onClick={handleDemoMode}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Try Sample Post
            </button>
          </div>
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
          <div className="p-4 border-t border-[var(--border)] space-y-2">
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!markdown.trim() || isGenerating || isParsingMarkdown}
              className="w-full py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate for All Platforms'}
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <PlatformTabs
            activePlatform={activePlatform}
            onPlatformChange={setActivePlatform}
            output={outputs[activePlatform]}
            isDemoMode={isDemoMode}
          />
        </div>
      </main>
      
      <ApiKeyModal open={showApiKeyModal} onOpenChange={setShowApiKeyModal} />
    </div>
  );
}
