<p align="center">
  <img src="./public/logo.svg" alt="ContentSeed Logo" width="80" />
</p>

# ContentSeed

ContentSeed is a client-side content repurposing app built with React, TypeScript, and Vite.
It helps turn one technical post into platform-specific drafts for X/Twitter, LinkedIn, Reddit, and Substack.

## Features

- Platform-native generation for:
  - Twitter/X (thread-style output)
  - LinkedIn
  - Reddit
  - Substack
- Multi-provider support: Anthropic, OpenAI, and Gemini
- Demo mode with sample post + pre-generated outputs (no API key required)
- Quick edit controls:
  - Tone: Casual, Professional, Technical, Storytelling
  - Length: Shorter, Default, Longer
  - Hashtags: on/off
  - Emojis: on/off
- Per-platform actions:
  - Copy
  - Copy all
  - Regenerate
  - Export
- Export options:
  - PNG
  - JPG
  - PDF (single or all-platform output)
- Privacy-first architecture:
  - No backend
  - No telemetry
  - API keys stored locally (with client-side encryption)

## Demo

- In-app demo:
  - Click `Try Demo` on landing, or
  - Click `Try Sample Post` in the app
  - This loads sample content and demo outputs without calling any LLM API.
- Live demo:
  - `contentseed.vercel.app` is documented in project context as coming soon.

## How It Works

1. Parse markdown into structure (headings, paragraphs, code, key points).
2. Apply platform-specific prompt templates.
3. Generate output via selected provider.
4. Refine with quick-edit controls and export in shareable formats.

## Project Status

- Active pre-1.0 development.
- Contributions are welcome for docs, bug fixes, and tests.
- No backward compatibility guarantee before `v1.0.0` (breaking changes will be called out in release notes).

## Requirements

- Node.js `20+` (LTS recommended)
- `pnpm` `10+`

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open `http://localhost:5173`.

## Environment Variables

ContentSeed uses `.env` / `.env.example` for provider selection, model switching, and local URLs.

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_APP_URL` | App base URL used by frontend config | `http://localhost:5173` |
| `PLAYWRIGHT_BASE_URL` | Base URL for Playwright `use.baseURL` and `webServer.url` | `http://localhost:5173` |
| `VITE_DEFAULT_PROVIDER` | Provider used when no browser-stored config exists (`anthropic`, `openai`, `gemini`) | `anthropic` |
| `VITE_ANTHROPIC_MODEL_FAST` | Anthropic model for fast mode | `claude-sonnet-4-6-20250514` |
| `VITE_ANTHROPIC_MODEL_BALANCED` | Anthropic model for balanced mode | `claude-sonnet-4-6-20250514` |
| `VITE_ANTHROPIC_MODEL_QUALITY` | Anthropic model for quality mode | `claude-sonnet-4-6-20250514` |
| `VITE_OPENAI_MODEL_FAST` | OpenAI model for fast mode | `gpt-5.2` |
| `VITE_OPENAI_MODEL_BALANCED` | OpenAI model for balanced mode | `gpt-5.2` |
| `VITE_OPENAI_MODEL_QUALITY` | OpenAI model for quality mode | `gpt-5.2` |
| `VITE_GEMINI_MODEL_FAST` | Gemini model for fast mode | `gemini-3.0-pro` |
| `VITE_GEMINI_MODEL_BALANCED` | Gemini model for balanced mode | `gemini-3.0-pro` |
| `VITE_GEMINI_MODEL_QUALITY` | Gemini model for quality mode | `gemini-3.0-pro` |
| `VITE_ANTHROPIC_API_KEY` | Optional Anthropic key fallback when no saved key exists | empty |
| `VITE_OPENAI_API_KEY` | Optional OpenAI key fallback when no saved key exists | empty |
| `VITE_GEMINI_API_KEY` | Optional Gemini key fallback when no saved key exists | empty |

## Security Note for API Keys

Any `VITE_*` environment variable is exposed to the client bundle by Vite.
Use the fallback key variables only for local development convenience, not for production secrets.

## Development Commands

```bash
pnpm lint
pnpm test
pnpm test:e2e:smoke
pnpm test:e2e
```

If Playwright browsers are missing locally:

```bash
pnpm exec playwright install chromium
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for workflow, DCO signoff requirements, and review expectations.

## Current Scope

- Intended for technical content repurposing workflows.
- Best results come from well-structured markdown input.
- Pre-`v1.0.0`: prompts, output formats, and behavior can change.

## Security

See [SECURITY.md](./SECURITY.md) for responsible disclosure instructions.

## Support

See [SUPPORT.md](./SUPPORT.md) for where to ask questions and how to report issues.

## License

[MIT](./LICENSE)
