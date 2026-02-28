import { encryptApiKey, decryptApiKey } from './key-encryption';
import type { ProviderConfig } from '@/types';

const STORAGE_KEY = 'contentseed-provider-config';

export function saveProviderConfig(config: ProviderConfig): void {
  const encrypted = encryptApiKey(config.apiKey);
  
  if (config.rememberKey) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      provider: config.provider,
      encryptedKey: encrypted,
      rememberKey: true,
    }));
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      provider: config.provider,
      encryptedKey: encrypted,
      rememberKey: false,
    }));
  }
}

export function loadProviderConfig(): ProviderConfig | null {
  let data = localStorage.getItem(STORAGE_KEY);
  
  if (!data) {
    data = sessionStorage.getItem(STORAGE_KEY);
  }
  
  if (!data) return null;
  
  try {
    const parsed = JSON.parse(data);
    const apiKey = decryptApiKey(parsed.encryptedKey);
    
    return {
      provider: parsed.provider,
      apiKey,
      rememberKey: parsed.rememberKey,
    };
  } catch {
    return null;
  }
}

export function deleteProviderConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getApiKey(): string | null {
  const config = loadProviderConfig();
  return config?.apiKey ?? null;
}

export function getProvider(): 'anthropic' | 'openai' {
  const config = loadProviderConfig();
  return config?.provider ?? 'anthropic';
}
