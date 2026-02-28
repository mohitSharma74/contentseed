import { Twitter, Linkedin, MessageCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Platform, PlatformOutput } from '@/types';

interface PlatformTabsProps {
  activePlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
  output: PlatformOutput | null;
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

export function PlatformTabs({ activePlatform, onPlatformChange, output }: PlatformTabsProps) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex border-b border-[var(--border)]">
        {platforms.map((platform) => (
          <button
            type="button"
            key={platform.id}
            onClick={() => onPlatformChange(platform.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors',
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
            <span className="hidden sm:inline">{platform.label}</span>
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {output ? (
          <div className="space-y-4">
            {output.hook && (
              <div className="p-3 bg-[var(--muted)] rounded-lg">
                <p className="text-sm font-medium text-[var(--muted-foreground)]">Hook</p>
                <p className="mt-1">{output.hook}</p>
              </div>
            )}
            <div className="whitespace-pre-wrap text-sm">{output.content}</div>
            {output.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {output.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: `${platformColors[output.platform]}20`,
                      color: platformColors[output.platform],
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-[var(--muted-foreground)]">
            <p>Generate content to see output</p>
          </div>
        )}
      </div>
    </div>
  );
}
