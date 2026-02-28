import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Key, Check, AlertCircle } from 'lucide-react';
import { saveProviderConfig, deleteProviderConfig, getApiKey } from '@/lib/security/key-manager';
import { createProvider } from '@/lib/providers/provider-factory';
import type { ProviderConfig } from '@/types';

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyModal({ open, onOpenChange }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'anthropic' | 'openai' | 'gemini'>('anthropic');
  const [rememberKey, setRememberKey] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const existingKey = getApiKey();

  const handleSave = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    setValidationError(null);

    try {
      const providerInstance = createProvider(provider, apiKey);
      const isValid = await providerInstance.validateKey(apiKey);

      if (!isValid) {
        setValidationError('Invalid API key. Please check and try again.');
        setIsValidating(false);
        return;
      }

      const config: ProviderConfig = {
        provider,
        apiKey,
        rememberKey,
      };

      saveProviderConfig(config);
      setIsSaved(true);
      setIsValidating(false);
      
      setTimeout(() => {
        onOpenChange(false);
        setIsSaved(false);
      }, 1000);
    } catch {
      setValidationError('Failed to validate API key. Please try again.');
      setIsValidating(false);
    }
  };

  const handleForget = () => {
    deleteProviderConfig();
    setApiKey('');
    setIsSaved(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-xl z-50 p-6">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Configuration
            </Dialog.Title>
            <Dialog.Close className="p-1 hover:bg-[var(--muted)] rounded">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {existingKey ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-md">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">API key is configured</span>
              </div>
              <button
                type="button"
                onClick={handleForget}
                className="w-full py-2 px-4 border border-[var(--destructive)] text-[var(--destructive)] rounded-md hover:bg-[var(--destructive)] hover:text-white transition-colors"
              >
                Forget My Key
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium block">Provider</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProvider('anthropic')}
                    className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                      provider === 'anthropic'
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]'
                        : 'border-[var(--border)] hover:bg-[var(--muted)]'
                    }`}
                  >
                    Claude
                  </button>
                  <button
                    type="button"
                    onClick={() => setProvider('openai')}
                    className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                      provider === 'openai'
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]'
                        : 'border-[var(--border)] hover:bg-[var(--muted)]'
                    }`}
                  >
                    GPT-5
                  </button>
                  <button
                    type="button"
                    onClick={() => setProvider('gemini')}
                    className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                      provider === 'gemini'
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]'
                        : 'border-[var(--border)] hover:bg-[var(--muted)]'
                    }`}
                  >
                    Gemini
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="api-key">
                  {provider === 'anthropic' ? 'Anthropic' : provider === 'openai' ? 'OpenAI' : 'Google'} API Key
                </label>
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={provider === 'anthropic' ? 'sk-ant-...' : provider === 'openai' ? 'sk-...' : 'AIza...'}
                  className="w-full px-3 py-2 bg-[var(--muted)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-mono text-sm"
                />
                <p className="text-xs text-[var(--muted-foreground)]">
                  Your key stays in your browser. We never see it.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberKey}
                  onChange={(e) => setRememberKey(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border)]"
                />
                <span className="text-sm">Remember my key</span>
              </label>

              {validationError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">{validationError}</span>
                </div>
              )}

              {isSaved && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-md">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">API key saved successfully!</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={!apiKey.trim() || isValidating}
                className="w-full py-2 px-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? 'Validating...' : 'Save API Key'}
              </button>
            </div>
          )}

          <Dialog.Description className="mt-4 text-xs text-[var(--muted-foreground)]">
            Your API key is encrypted with AES-256 and stored only in your browser's{' '}
            {rememberKey ? 'localStorage' : 'sessionStorage'}.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
