import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { PrivacyIndicator } from './PrivacyIndicator';
import { ProviderToggle } from '../settings/ProviderToggle';
import { SpeedModeToggle } from '../settings/SpeedModeToggle';
import { Github } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)]">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="ContentSeed" className="h-8 w-8" />
          <span className="font-semibold text-lg">ContentSeed</span>
        </Link>
        <PrivacyIndicator />
      </div>
      
      <div className="flex items-center gap-3">
        <ProviderToggle />
        <SpeedModeToggle />
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-[var(--muted)] transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
        <Link
          to="/app"
          className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Open App
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
