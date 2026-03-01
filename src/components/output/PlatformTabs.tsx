import { Twitter, Linkedin, MessageCircle, Mail, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Platform, PlatformOutput, PlatformGenerationStatus } from '@/types';
import { TwitterPreview, LinkedInPreview, RedditPreview, SubstackPreview } from './previews';
import { ActionButtons } from './ActionButtons';

interface PlatformTabsProps {
  activePlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
  output: PlatformOutput | null;
  isDemoMode?: boolean;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  disableRegenerate?: boolean;
  onExport?: (platform: Platform) => void;
  onExportAll?: () => void;
  hasOutputs?: boolean;
  platformStatus?: Record<Platform, PlatformGenerationStatus>;
}

const platforms: { id: Platform; label: string; icon: typeof Twitter }[] = [
  { id: 'twitter', label: 'Twitter/X', icon: Twitter },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'reddit', label: 'Reddit', icon: MessageCircle },
  { id: 'substack', label: 'Substack', icon: Mail },
];

const platformColors: Record<Platform, string> = {
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  reddit: '#FF4500',
  substack: '#FF6719',
};

const platformPreviews = {
  twitter: TwitterPreview,
  linkedin: LinkedInPreview,
  reddit: RedditPreview,
  substack: SubstackPreview,
};

const statusColor: Record<PlatformGenerationStatus, string> = {
  idle: 'bg-gray-500',
  queued: 'bg-amber-500',
  generating: 'bg-blue-500',
  done: 'bg-green-500',
  error: 'bg-red-500',
};

export function PlatformTabs({
  activePlatform,
  onPlatformChange,
  output,
  isDemoMode,
  onRegenerate,
  isRegenerating,
  disableRegenerate,
  onExport,
  onExportAll,
  hasOutputs,
  platformStatus,
}: PlatformTabsProps) {
  const PreviewComponent = output ? platformPreviews[activePlatform] : null;
  const currentStatus = platformStatus?.[activePlatform] ?? 'idle';
  const isLoading = currentStatus === 'queued' || currentStatus === 'generating';

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--muted)]/10">
        <div>
          {isDemoMode && (
            <p className="text-sm text-[var(--primary)]">
              Demo Mode — Pre-generated output
            </p>
          )}
          {!isDemoMode && !output && (
            <p className="text-sm text-[var(--muted-foreground)]">
              Generate content to see output
            </p>
          )}
          {!isDemoMode && platformStatus && (
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <span className={cn('w-2 h-2 rounded-full', statusColor[currentStatus])} />
              <span className="capitalize">{currentStatus}</span>
            </div>
          )}
        </div>
        {hasOutputs && onExportAll && (
          <button
            type="button"
            onClick={onExportAll}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-md hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" />
            Export All
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:flex border-b border-[var(--border)]">
        {platforms.map((platform) => (
          <button
            type="button"
            key={platform.id}
            onClick={() => onPlatformChange(platform.id)}
            className={cn(
              'flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors sm:flex-1',
              activePlatform === platform.id
                ? 'border-b-2 border-[var(--primary)] text-[var(--foreground)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            )}
            style={activePlatform === platform.id ? { borderColor: platformColors[platform.id] } : undefined}
          >
            <platform.icon
              className="h-4 w-4"
              style={{ color: activePlatform === platform.id ? platformColors[platform.id] : undefined }}
            />
            <span>{platform.label}</span>
            {platformStatus && (
              <span
                className={cn(
                  'ml-1 inline-block h-2 w-2 rounded-full',
                  statusColor[platformStatus[platform.id]]
                )}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[var(--muted)]/20">
        {isLoading && !output ? (
          <OutputSkeleton platform={activePlatform} />
        ) : output && PreviewComponent ? (
          <PreviewComponent output={output} />
        ) : (
          <div className="text-[var(--muted-foreground)] text-center">
            <p className="mb-2">Generate content to see output</p>
            <p className="text-sm">Paste your blog post and click &quot;Generate&quot;</p>
          </div>
        )}
      </div>

      {output && (
        <ActionButtons
          platform={activePlatform}
          output={output}
          onRegenerate={onRegenerate}
          isRegenerating={isRegenerating}
          disableRegenerate={disableRegenerate}
          onExport={() => onExport?.(activePlatform)}
        />
      )}
    </div>
  );
}

interface OutputSkeletonProps {
  platform: Platform;
}

function OutputSkeleton({ platform }: OutputSkeletonProps) {
  return (
    <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="mb-3 h-5 w-1/2 animate-pulse rounded bg-[var(--muted)]" />
      <div className="mb-4 h-3 w-1/3 animate-pulse rounded bg-[var(--muted)]/80" />
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-[var(--muted)]" />
        <div className="h-3 w-11/12 animate-pulse rounded bg-[var(--muted)]" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-[var(--muted)]" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--muted)]" />
      </div>
      <p className="mt-4 text-xs text-[var(--muted-foreground)]">
        Generating {platform} output...
      </p>
    </div>
  );
}
