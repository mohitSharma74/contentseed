/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL?: string;
  readonly VITE_DEFAULT_PROVIDER?: string;

  readonly VITE_ANTHROPIC_API_KEY?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_GEMINI_API_KEY?: string;

  readonly VITE_ANTHROPIC_MODEL_FAST?: string;
  readonly VITE_ANTHROPIC_MODEL_BALANCED?: string;
  readonly VITE_ANTHROPIC_MODEL_QUALITY?: string;

  readonly VITE_OPENAI_MODEL_FAST?: string;
  readonly VITE_OPENAI_MODEL_BALANCED?: string;
  readonly VITE_OPENAI_MODEL_QUALITY?: string;

  readonly VITE_GEMINI_MODEL_FAST?: string;
  readonly VITE_GEMINI_MODEL_BALANCED?: string;
  readonly VITE_GEMINI_MODEL_QUALITY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
