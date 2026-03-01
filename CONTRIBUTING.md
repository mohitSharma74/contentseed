# Contributing to ContentSeed

Thanks for contributing.

## Scope for Initial Contributions

Current priority is:

- documentation improvements
- bug fixes
- test coverage and reliability

Feature proposals are welcome, but open an issue or Discussion first for alignment.

## Development Setup

Requirements:

- Node.js `20+`
- `pnpm` `10+`

Setup:

```bash
pnpm install
cp .env.example .env
```

Run locally:

```bash
pnpm dev
```

## Validation Before Opening a PR

Run:

```bash
pnpm lint
pnpm test
pnpm test:e2e:smoke
```

If Playwright browsers are missing:

```bash
pnpm exec playwright install chromium
```

## Pull Request Process

1. Create a focused branch.
2. Keep changes scoped and test-backed.
3. Update docs when behavior or developer workflow changes.
4. Open a PR with context, linked issue, and test evidence.

## DCO Signoff Required

All commits must be signed off using DCO:

```bash
git commit -s -m "Your commit message"
```

Each commit message must include:

```text
Signed-off-by: Your Name <you@example.com>
```

PRs with commits missing signoff will fail CI.

## Coding Standards

- Use existing TypeScript and React patterns in the codebase.
- Keep changes small and composable.
- Prefer adding or updating tests for behavior changes.

## Code of Conduct

By participating, you agree to follow [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
