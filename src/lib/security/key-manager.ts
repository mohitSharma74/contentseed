import { encryptApiKey, decryptApiKey } from './key-encryption';
import type { ProviderConfig, SpeedMode } from '@/types';

const STORAGE_KEY = 'contentseed-provider-config';
const SPEED_MODE_KEY = 'contentseed-speed-mode';

interface StoredProviderConfig {
  provider: 'anthropic' | 'openai' | 'gemini';
  encryptedKey: string;
  rememberKey: boolean;
  speedMode?: SpeedMode;
}

function readStoredConfig(): { value: StoredProviderConfig; storage: Storage } | null {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      return { value: JSON.parse(local) as StoredProviderConfig, storage: localStorage };
    } catch {
      // ignore malformed config and try the fallback storage
    }
  }

  const session = sessionStorage.getItem(STORAGE_KEY);
  if (!session) return null;

  try {
    return { value: JSON.parse(session) as StoredProviderConfig, storage: sessionStorage };
  } catch {
    return null;
  }
}

export function saveProviderConfig(config: ProviderConfig): void {
  const encrypted = encryptApiKey(config.apiKey);

  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);

  const payload: StoredProviderConfig = {
    provider: config.provider,
    encryptedKey: encrypted,
    rememberKey: config.rememberKey,
    speedMode: config.speedMode ?? getSpeedMode(),
  };

  if (config.rememberKey) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  localStorage.setItem(SPEED_MODE_KEY, payload.speedMode ?? 'fast');
}

export function loadProviderConfig(): ProviderConfig | null {
  const stored = readStoredConfig();
  if (!stored) return null;

  try {
    const apiKey = decryptApiKey(stored.value.encryptedKey);
    const speedMode = stored.value.speedMode ?? getSpeedMode();

    return {
      provider: stored.value.provider,
      apiKey,
      rememberKey: stored.value.rememberKey,
      speedMode,
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

export function getProvider(): 'anthropic' | 'openai' | 'gemini' {
  const config = loadProviderConfig();
  return config?.provider ?? 'anthropic';
}

export function getSpeedMode(): SpeedMode {
  const stored = readStoredConfig();
  if (stored?.value.speedMode) {
    return stored.value.speedMode;
  }

  const persistedMode = localStorage.getItem(SPEED_MODE_KEY);
  if (persistedMode === 'fast' || persistedMode === 'balanced' || persistedMode === 'quality') {
    return persistedMode;
  }

  return 'fast';
}

export function saveSpeedMode(mode: SpeedMode): void {
  const stored = readStoredConfig();
  if (stored) {
    stored.storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...stored.value,
        speedMode: mode,
      } satisfies StoredProviderConfig)
    );
  }

  localStorage.setItem(SPEED_MODE_KEY, mode);
}
