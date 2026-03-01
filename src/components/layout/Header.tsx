import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { PrivacyIndicator } from './PrivacyIndicator';
import { ProviderToggle } from '../settings/ProviderToggle';
import { SpeedModeToggle } from '../settings/SpeedModeToggle';
import { Github } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const isAppRoute = location.pathname === '/app';

  return (
    <header className="flex flex-col gap-3 border-b border-[var(--border)] px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="ContentSeed" className="h-8 w-8" />
          <span className="font-semibold text-lg">ContentSeed</span>
        </Link>
        <PrivacyIndicator />
      </div>
      
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <div className="hidden sm:block">
          <ProviderToggle />
        </div>
        <div className="hidden lg:block">
          <SpeedModeToggle />
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-[var(--muted)] transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
        {!isAppRoute && (
          <Link
            to="/app"
            className="px-3 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Open App
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
