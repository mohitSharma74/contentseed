import { Shield } from 'lucide-react';

export function PrivacyIndicator() {
  return (
    <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
      <Shield className="h-4 w-4" />
      <span>Your data stays in your browser</span>
    </div>
  );
}
