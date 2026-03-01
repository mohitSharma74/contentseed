# ContentSeed

Client-side content repurposing app built with React + TypeScript + Vite.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open `http://localhost:5173`.

## Environment Variables

`ContentSeed` now uses `.env` / `.env.example` for provider selection, model switching, and local URLs.

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_APP_URL` | App base URL used by frontend config | `http://localhost:5173` |
| `PLAYWRIGHT_BASE_URL` | Base URL for Playwright `use.baseURL` and `webServer.url` | `http://localhost:5173` |
| `VITE_DEFAULT_PROVIDER` | Provider used when no browser-stored config exists (`anthropic`, `openai`, `gemini`) | `anthropic` |
| `VITE_ANTHROPIC_MODEL_FAST` | Anthropic model for fast mode | `claude-sonnet-4-6-20250514` |
| `VITE_ANTHROPIC_MODEL_BALANCED` | Anthropic model for balanced mode | `claude-sonnet-4-6-20250514` |
| `VITE_ANTHROPIC_MODEL_QUALITY` | Anthropic model for quality mode | `claude-sonnet-4-6-20250514` |
| `VITE_OPENAI_MODEL_FAST` | OpenAI model for fast mode | `gpt-5` |
| `VITE_OPENAI_MODEL_BALANCED` | OpenAI model for balanced mode | `gpt-5` |
| `VITE_OPENAI_MODEL_QUALITY` | OpenAI model for quality mode | `gpt-5` |
| `VITE_GEMINI_MODEL_FAST` | Gemini model for fast mode | `gemini-2.5-pro` |
| `VITE_GEMINI_MODEL_BALANCED` | Gemini model for balanced mode | `gemini-2.5-pro` |
| `VITE_GEMINI_MODEL_QUALITY` | Gemini model for quality mode | `gemini-2.5-pro` |
| `VITE_ANTHROPIC_API_KEY` | Optional Anthropic key fallback when no stored key exists | empty |
| `VITE_OPENAI_API_KEY` | Optional OpenAI key fallback when no stored key exists | empty |
| `VITE_GEMINI_API_KEY` | Optional Gemini key fallback when no stored key exists | empty |

## API Key Security Note

`VITE_*` variables are exposed to client bundles by Vite. Use these fallback key vars for local/dev convenience only, not for production secrets.
