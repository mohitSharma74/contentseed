import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MarkdownEditor } from '@/components/input/MarkdownEditor';
import { PlatformSelector } from '@/components/input/PlatformSelector';
import { PlatformTabs } from '@/components/output/PlatformTabs';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { ExportPreviewModal } from '@/components/export/ExportPreviewModal';
import { useContentGeneration } from '@/hooks/useContentGeneration';
import samplePost from '@/lib/demo/sample-post.md?raw';
import sampleOutputs from '@/lib/demo/sample-outputs.json';
import type { Platform, PlatformOutput } from '@/types';
import { getApiKey, getSpeedMode } from '@/lib/security/key-manager';
import { ApiKeyModal } from '@/components/settings/ApiKeyModal';

export function App() {
  const [markdown, setMarkdown] = useState('');
  const [activePlatform, setActivePlatform] = useState<Platform>('twitter');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPlatform, setExportPlatform] = useState<Platform | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter', 'linkedin', 'reddit', 'substack']);
  const {
    generateForPlatforms,
    regenerate,
    isGenerating,
    outputs,
    error,
    platformStatus,
    timings,
    clearOutputs,
    setDemoOutputs,
  } = useContentGeneration();

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
    if (selectedPlatforms.length === 0) return;
    
    const apiKey = getApiKey();
    
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    
    await generateForPlatforms(
      markdown,
      selectedPlatforms,
      { speedMode: getSpeedMode() },
      activePlatform
    );
  };

  const handleDemoMode = () => {
    setIsDemoMode(true);
    setMarkdown(samplePost);
    setSelectedPlatforms(['twitter', 'linkedin', 'reddit', 'substack']);
  };

  const handleRegenerate = () => {
    regenerate(activePlatform);
  };

  const handleExport = (platform?: Platform) => {
    setExportPlatform(platform || null);
    setShowExportModal(true);
  };

  const handleExportAll = () => {
    setExportPlatform(null);
    setShowExportModal(true);
  };

  const hasOutputs = Object.values(outputs).some((o) => o !== null);
  const firstResultReady = Boolean(timings.firstResultAt);
  const firstResultMs = timings.firstResultAt && timings.startedAt
    ? timings.firstResultAt - timings.startedAt
    : null;
  const totalMs = timings.completedAt && timings.startedAt
    ? timings.completedAt - timings.startedAt
    : null;

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
          <div className="p-4 border-t border-[var(--border)] space-y-3">
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <div className="flex items-center gap-3">
              <PlatformSelector
                selectedPlatforms={selectedPlatforms}
                onChange={setSelectedPlatforms}
                statuses={platformStatus}
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!markdown.trim() || selectedPlatforms.length === 0 || isGenerating}
                className="flex-1 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {timings.startedAt && (
              <p className="text-xs text-[var(--muted-foreground)] text-center">
                {isGenerating && !firstResultReady && 'Working on first platform...'}
                {firstResultReady && firstResultMs !== null && `First result in ${(firstResultMs / 1000).toFixed(2)}s`}
                {!isGenerating && totalMs !== null && ` • Total ${(totalMs / 1000).toFixed(2)}s`}
              </p>
            )}
            {import.meta.env.DEV && timings.startedAt && (
              <div className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/40 rounded-md p-2">
                <p>Started: {new Date(timings.startedAt).toLocaleTimeString()}</p>
                <p>First result: {timings.firstResultAt ? `${timings.firstResultAt - timings.startedAt}ms` : 'pending'}</p>
                <p>Completed: {timings.completedAt ? `${timings.completedAt - timings.startedAt}ms` : 'pending'}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <PlatformTabs
            activePlatform={activePlatform}
            onPlatformChange={setActivePlatform}
            output={outputs[activePlatform]}
            isDemoMode={isDemoMode}
            onRegenerate={handleRegenerate}
            isRegenerating={isGenerating}
            onExport={handleExport}
            onExportAll={handleExportAll}
            hasOutputs={hasOutputs}
            platformStatus={platformStatus}
          />
        </div>
      </main>
      
      <ApiKeyModal open={showApiKeyModal} onOpenChange={setShowApiKeyModal} />
      <ExportPreviewModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        outputs={outputs}
        title={markdown.split('\n')[0]?.replace(/^#+\s*/, '')}
        singlePlatform={exportPlatform || undefined}
      />
      <ToastContainer />
    </div>
  );
}
