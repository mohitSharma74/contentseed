import type { SpeedMode } from '@/types';

export type ProviderId = 'anthropic' | 'openai' | 'gemini';

const DEFAULT_APP_URL = 'http://localhost:5173';
const DEFAULT_PROVIDER: ProviderId = 'anthropic';

const MODEL_DEFAULTS: Record<ProviderId, Record<SpeedMode, string>> = {
  anthropic: {
    fast: 'claude-sonnet-4-6-20250514',
    balanced: 'claude-sonnet-4-6-20250514',
    quality: 'claude-sonnet-4-6-20250514',
  },
  openai: {
    fast: 'gpt-5.2',
    balanced: 'gpt-5.2',
    quality: 'gpt-5.2',
  },
  gemini: {
    fast: 'gemini-3.0-pro',
    balanced: 'gemini-3.0-pro',
    quality: 'gemini-3.0-pro',
  },
};

function nonEmpty(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readString(value: string | undefined, fallback: string): string {
  return nonEmpty(value) ?? fallback;
}

function normalizeProvider(value: string | undefined): ProviderId {
  switch (value?.toLowerCase()) {
    case 'anthropic':
      return 'anthropic';
    case 'openai':
      return 'openai';
    case 'gemini':
      return 'gemini';
    default:
      return DEFAULT_PROVIDER;
  }
}

const MODEL_ENV: Record<ProviderId, Record<SpeedMode, string | undefined>> = {
  anthropic: {
    fast: import.meta.env.VITE_ANTHROPIC_MODEL_FAST,
    balanced: import.meta.env.VITE_ANTHROPIC_MODEL_BALANCED,
    quality: import.meta.env.VITE_ANTHROPIC_MODEL_QUALITY,
  },
  openai: {
    fast: import.meta.env.VITE_OPENAI_MODEL_FAST,
    balanced: import.meta.env.VITE_OPENAI_MODEL_BALANCED,
    quality: import.meta.env.VITE_OPENAI_MODEL_QUALITY,
  },
  gemini: {
    fast: import.meta.env.VITE_GEMINI_MODEL_FAST,
    balanced: import.meta.env.VITE_GEMINI_MODEL_BALANCED,
    quality: import.meta.env.VITE_GEMINI_MODEL_QUALITY,
  },
};

const API_KEY_ENV: Record<ProviderId, string | undefined> = {
  anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY,
  openai: import.meta.env.VITE_OPENAI_API_KEY,
  gemini: import.meta.env.VITE_GEMINI_API_KEY,
};

export function getAppUrl(): string {
  return readString(import.meta.env.VITE_APP_URL, DEFAULT_APP_URL);
}

export function getDefaultProvider(): ProviderId {
  return normalizeProvider(import.meta.env.VITE_DEFAULT_PROVIDER);
}

export function getModelFor(provider: ProviderId, mode: SpeedMode | undefined): string {
  const resolvedMode = mode ?? 'fast';
  const fromEnv = MODEL_ENV[provider][resolvedMode];
  return readString(fromEnv, MODEL_DEFAULTS[provider][resolvedMode]);
}

export function getProviderApiKeyFallback(provider: ProviderId): string | null {
  return nonEmpty(API_KEY_ENV[provider]);
}
