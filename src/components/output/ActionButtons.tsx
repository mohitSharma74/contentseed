import { Copy, RefreshCw, Download } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import type { Platform, PlatformOutput } from '@/types';
import { cn } from '@/lib/utils';

interface ActionButtonsProps {
  platform: Platform;
  output: PlatformOutput | null;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onExport?: () => void;
}

export function ActionButtons({
  platform,
  output,
  onRegenerate,
  isRegenerating,
  onExport,
}: ActionButtonsProps) {
  const { addToast } = useToast();

  if (!output) return null;

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(output.content);
      addToast(`Copied ${platform} content to clipboard`);
    } catch {
      addToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleCopyAll = async () => {
    const hashtagsText = output.hashtags.length > 0 ? `\n\n${output.hashtags.join(' ')}` : '';
    const text = output.hook
      ? `${output.hook}\n\n${output.content}${hashtagsText}`
      : `${output.content}${hashtagsText}`;
    
    try {
      await navigator.clipboard.writeText(text);
      addToast('Copied content with hashtags');
    } catch {
      addToast('Failed to copy to clipboard', 'error');
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t border-[var(--border)] bg-[var(--muted)]/30">
      <button
        type="button"
        onClick={handleCopyContent}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
          'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity'
        )}
      >
        <Copy className="h-4 w-4" />
        Copy
      </button>

      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
            'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <RefreshCw className={cn('h-4 w-4', isRegenerating && 'animate-spin')} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      )}

      <button
        type="button"
        onClick={handleCopyAll}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
          'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80 transition-colors'
        )}
      >
        <Copy className="h-4 w-4" />
        Copy All
      </button>

      {onExport && (
        <button
          type="button"
          onClick={onExport}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
            'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-90 transition-opacity'
          )}
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      )}
    </div>
  );
}
