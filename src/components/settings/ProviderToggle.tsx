import { useState } from 'react';
import { Bot } from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';
import { getApiKey, getProvider } from '@/lib/security/key-manager';

export function ProviderToggle() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasApiKey = !!getApiKey();
  const currentProvider = getProvider();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] transition-colors text-sm"
      >
        <Bot className="h-4 w-4" />
        <span>{currentProvider === 'anthropic' ? 'Claude' : currentProvider === 'openai' ? 'GPT-5' : 'Gemini'}</span>
        {hasApiKey && (
          <span className="w-2 h-2 rounded-full bg-green-500" />
        )}
      </button>
      
      <ApiKeyModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
