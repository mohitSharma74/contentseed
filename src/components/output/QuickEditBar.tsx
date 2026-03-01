import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GenerationLength, GenerationTone, QuickEditSettings } from '@/types';

interface QuickEditBarProps {
  settings: QuickEditSettings;
  onChange: (next: QuickEditSettings) => void;
  onApply: () => void;
  isApplying?: boolean;
  canApply?: boolean;
}

const TONE_OPTIONS: { id: GenerationTone; label: string }[] = [
  { id: 'casual', label: 'Casual' },
  { id: 'professional', label: 'Professional' },
  { id: 'technical', label: 'Technical' },
  { id: 'storytelling', label: 'Storytelling' },
];

const LENGTH_OPTIONS: { id: GenerationLength; label: string }[] = [
  { id: 'shorter', label: 'Shorter' },
  { id: 'default', label: 'Default' },
  { id: 'longer', label: 'Longer' },
];

export function QuickEditBar({
  settings,
  onChange,
  onApply,
  isApplying = false,
  canApply = false,
}: QuickEditBarProps) {
  return (
    <div className="border-b border-[var(--border)] bg-[var(--muted)]/20 px-4 py-3">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Tone</span>
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone.id}
                type="button"
                onClick={() => onChange({ ...settings, tone: tone.id })}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                  settings.tone === tone.id
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                )}
              >
                {tone.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onApply}
            disabled={!canApply || isApplying}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <RefreshCw className={cn('h-4 w-4', isApplying && 'animate-spin')} />
            {isApplying ? 'Applying...' : 'Regenerate with Edits'}
          </button>
        </div>

        <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Length</span>
            {LENGTH_OPTIONS.map((length) => (
              <button
                key={length.id}
                type="button"
                onClick={() => onChange({ ...settings, length: length.id })}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                  settings.length === length.id
                    ? 'border-[var(--secondary)] bg-[var(--secondary)] text-[var(--secondary-foreground)]'
                    : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                )}
              >
                {length.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...settings, includeHashtags: !settings.includeHashtags })}
              className={cn(
                'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                settings.includeHashtags
                  ? 'border-[var(--primary)] text-[var(--foreground)]'
                  : 'border-[var(--border)] text-[var(--muted-foreground)]'
              )}
            >
              Hashtags {settings.includeHashtags ? 'On' : 'Off'}
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...settings, includeEmojis: !settings.includeEmojis })}
              className={cn(
                'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                settings.includeEmojis
                  ? 'border-[var(--primary)] text-[var(--foreground)]'
                  : 'border-[var(--border)] text-[var(--muted-foreground)]'
              )}
            >
              Emojis {settings.includeEmojis ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
