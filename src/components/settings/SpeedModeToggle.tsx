import { useState } from 'react';
import { Gauge } from 'lucide-react';
import type { SpeedMode } from '@/types';
import { getSpeedMode, saveSpeedMode } from '@/lib/security/key-manager';

interface SpeedModeToggleProps {
  onChange?: (mode: SpeedMode) => void;
}

const SPEED_MODES: SpeedMode[] = ['fast', 'balanced', 'quality'];

const MODE_LABEL: Record<SpeedMode, string> = {
  fast: 'Fast',
  balanced: 'Balanced',
  quality: 'Quality',
};

export function SpeedModeToggle({ onChange }: SpeedModeToggleProps) {
  const [currentMode, setCurrentMode] = useState<SpeedMode>(getSpeedMode);

  return (
    <div className="flex items-center gap-1 rounded-md border border-[var(--border)] p-1">
      <div className="px-2 text-[var(--muted-foreground)]" title="Generation speed mode">
        <Gauge className="h-4 w-4" />
      </div>
      {SPEED_MODES.map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => {
            saveSpeedMode(mode);
            setCurrentMode(mode);
            onChange?.(mode);
          }}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            mode === currentMode
              ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
              : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
          }`}
        >
          {MODE_LABEL[mode]}
        </button>
      ))}
    </div>
  );
}
