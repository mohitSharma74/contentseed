import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown, Twitter, Linkedin, MessageCircle, Mail } from 'lucide-react';
import type { Platform } from '@/types';
import { cn } from '@/lib/utils';

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onChange: (platforms: Platform[]) => void;
}

const PLATFORMS: { id: Platform; label: string; icon: typeof Twitter }[] = [
  { id: 'twitter', label: 'Twitter/X', icon: Twitter },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'reddit', label: 'Reddit', icon: MessageCircle },
  { id: 'substack', label: 'Substack', icon: Mail },
];

const PLATFORM_COLORS: Record<Platform, string> = {
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  reddit: '#FF4500',
  substack: '#FF6719',
};

export function PlatformSelector({ selectedPlatforms, onChange }: PlatformSelectorProps) {
  const [open, setOpen] = useState(false);

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      onChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };

  const selectAll = () => {
    onChange(PLATFORMS.map(p => p.id));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm',
            'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80',
            'border border-[var(--border)] transition-colors'
          )}
        >
          <span>
            {selectedPlatforms.length === 0
              ? 'Select platforms'
              : selectedPlatforms.length === PLATFORMS.length
              ? 'All platforms'
              : `${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}`}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg p-2 z-50"
          sideOffset={5}
        >
          <div className="flex flex-col gap-1">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => togglePlatform(platform.id)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  'hover:bg-[var(--muted)]'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center',
                    selectedPlatforms.includes(platform.id)
                      ? 'bg-[var(--primary)] border-[var(--primary)]'
                      : 'border-[var(--border)]'
                  )}
                >
                  {selectedPlatforms.includes(platform.id) && (
                    <Check className="h-3 w-3 text-[var(--primary-foreground)]" />
                  )}
                </div>
                <platform.icon
                  className="h-4 w-4"
                  style={{ color: PLATFORM_COLORS[platform.id] }}
                />
                <span className="flex-1 text-left">{platform.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={selectAll}
              className="flex-1 px-3 py-1.5 text-xs text-[var(--primary)] hover:bg-[var(--muted)] rounded transition-colors"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="flex-1 px-3 py-1.5 text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)] rounded transition-colors"
            >
              Clear
            </button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
