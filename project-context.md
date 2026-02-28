<p align="center">
  <img src="./public/logo.svg" alt="ContentSeed Logo" width="80" />
</p>

<h1 align="center">ContentSeed</h1>

<p align="center">
  <strong>Write once. Distribute everywhere.</strong><br/>
  Turn any blog post into platform-native content for Twitter/X, LinkedIn, Reddit, and Substack — in one click.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-the-problem">The Problem</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-design-system">Design System</a> •
  <a href="#-privacy--trust">Privacy</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🌱 What is ContentSeed?

ContentSeed is an open-source blog post repurposing engine built by and for **technical content creators**.

You paste a blog post. ContentSeed parses it structurally, understands what makes each platform tick, and generates platform-native versions — not generic summaries, but content that *feels like it was written for that platform*.

A Twitter/X thread that hooks and threads properly. A LinkedIn post in the right "broetry" format. A Reddit post that leads with value (not self-promo). A Substack Note that teases without giving everything away.

**ContentSeed is NOT an AI wrapper.** It's a platform-aware content engine that uses Markdown AST parsing, handcrafted platform templates, and structured LLM prompting to produce output that's fundamentally better than "paste into ChatGPT and say make it shorter."

---

## 🤯 The Problem

Every technical blogger knows this pain:

1. You spend 4 hours writing a great blog post
2. You spend another 2 hours reformatting it for Twitter, LinkedIn, Reddit, and your newsletter
3. Each platform has different formatting rules, character limits, cultural norms, and engagement patterns
4. You either burn out on distribution or post a lazy link-dump that nobody engages with

The result? Great content dies on the platform it was born on.

**ContentSeed exists because distribution shouldn't take longer than creation.**

---

## 🎯 Who Is This For?

- **Technical bloggers** who write on DEV, Hashnode, Medium, or personal blogs and want to maximize reach
- **Newsletter creators** who need to promote editions across social platforms
- **DevRel professionals** who produce content at scale across multiple channels
- **Open source maintainers** who want to announce releases and updates across platforms effectively
- **Anyone** who writes once and wishes it could live everywhere

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- An API key from **Anthropic (Claude)** and/or **OpenAI** (or use Demo Mode with no key required)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/contentseed.git
cd contentseed

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and you're good to go.

### Demo Mode

Click **"Try Sample Post"** to see ContentSeed in action with pre-generated outputs — no API key needed. Perfect for exploring the tool before committing to an LLM provider.

---

## 🧠 How It Works

ContentSeed is built on three layers that work together:

### Layer 1: Markdown AST Parser

Your blog post isn't dumped raw into an LLM. It's first parsed into a structured representation using `unified` and `remark`:

```
Raw Markdown
     ↓
┌─────────────────────┐
│  Structured AST      │
│  ───────────────     │
│  • Title             │
│  • Heading hierarchy │
│  • Key paragraphs    │
│  • Code blocks       │
│  • Stats & numbers   │
│  • Links             │
│  • TL;DR extraction  │
└─────────────────────┘
```

This structured input means the LLM gets *organized context*, not a wall of text. The output quality difference is night and day.

### Layer 2: Platform Template Engine

Each platform has a handcrafted prompt template encoding **real platform DNA**:

| Platform | Key Rules Encoded |
|----------|-------------------|
| **Twitter/X** | 280 char/tweet limit, hook-first threading, no links except last tweet, hashtags only on final tweet, numbered threading format |
| **LinkedIn** | "Broetry" single-line format, 140-char fold line, professional engagement questions, 3-5 hashtags at bottom |
| **Reddit** | Value-first structure (not self-promo), subreddit-aware tone, TL;DR at top, Reddit markdown formatting |
| **Substack Notes** | 400-550 char sweet spot, no hashtags, information-gap teasers, authenticity over polish |

These aren't generic "make it shorter" instructions. They encode the unwritten rules that only someone who *actually posts* on these platforms would know.

### Layer 3: LLM Generation

The structured content + platform template are sent to your choice of:

- **Claude (Anthropic)** — via Messages API
- **OpenAI** — via Chat Completions API

The output is structured JSON (not free text), giving you clean separation of content, hashtags, hook alternatives, and metadata.

### Layer 4: Export Engine

Generated content can be exported as **branded, theme-aware assets**:

- **PNG/JPG** — Beautiful social cards using the DarkMatter theme, ready to share as images
- **PDF** — Multi-platform document with all generated outputs, perfect for team review or archival

Each export includes a **live preview** before downloading — what you see is what you get.

---

## 🖥️ Demo

> 🎬 *Video / GIF demo coming soon*

**Live Demo:** [contentseed.vercel.app](https://contentseed.vercel.app) *(coming soon)*

### Screenshots

> *Screenshots will be added after UI is complete*

---

## 🎨 Design System

ContentSeed uses the **DarkMatter** theme from [tweakcn](https://tweakcn.com) — a monospace-first, developer-native aesthetic that feels right at home for technical content creators.

### Theme Foundation

| Token | Light | Dark |
|-------|-------|------|
| **Background** | `oklch(1.0 0 0)` (Pure white) | `oklch(0.18 0.004 308.19)` (Deep space) |
| **Foreground** | `oklch(0.21 0.032 264.66)` (Dark ink) | `oklch(0.81 0 0)` (Soft white) |
| **Primary** | `oklch(0.67 0.137 48.51)` (Warm amber) | `oklch(0.72 0.134 49.98)` (Bright amber) |
| **Secondary** | `oklch(0.54 0.040 196.03)` (Cool teal) | `oklch(0.59 0.044 196.02)` (Soft teal) |
| **Muted** | `oklch(0.97 0.003 264.54)` (Light gray) | `oklch(0.25 0 0)` (Dark gray) |
| **Border** | `oklch(0.93 0.006 264.53)` | `oklch(0.25 0 0)` |
| **Destructive** | `oklch(0.64 0.208 25.33)` (Red) | `oklch(0.59 0.044 196.02)` (Teal) |

### Typography

| Font | Stack | Usage |
|------|-------|-------|
| **Sans (Primary)** | `Geist Mono, ui-monospace, monospace` | All body text, headings, UI elements |
| **Mono (Code)** | `JetBrains Mono, monospace` | Code blocks, inline code, technical content |

### Design Tokens

- **Border radius:** `0.75rem` — softly rounded, not bubbly
- **Spacing unit:** `0.25rem` base
- **Letter spacing:** `0rem` (normal tracking)
- **Shadows:** Subtle, functional — not decorative

### Dark Mode First

The DarkMatter theme is designed dark-mode-first. The app defaults to dark mode, with a light mode toggle available. Both modes are fully designed — not just an inverted afterthought.

### Export Theming

Exported images (PNG/JPG) and PDFs use the DarkMatter theme to produce branded, consistent assets. The export renderer applies:

- DarkMatter background and foreground colors
- Geist Mono typography
- ContentSeed branding (subtle logo + "Generated by ContentSeed" footer)
- Platform-specific accent colors (Twitter blue, LinkedIn blue, Reddit orange, Substack orange)

This means your exported content looks like it came from a polished product, not a screenshot of a dev tool.

---

## 🔒 Privacy & Trust

ContentSeed is built with a **zero-trust, privacy-first** architecture. We understand that asking developers to enter API keys requires earning trust first.

### No Backend. Period

ContentSeed runs **entirely in your browser**. There is no server, no database, no analytics that touch your content or keys. LLM API calls go directly from your browser to Anthropic/OpenAI. Your blog posts and generated content never pass through any intermediary.

**Don't trust us — verify it yourself.** The entire codebase is open source. Check the network tab. Read every line.

### API Key Security

| Concern | How We Handle It |
|---------|-----------------|
| **Where are keys stored?** | Encrypted with AES-256 in your browser's localStorage. Never transmitted anywhere. |
| **Can I avoid storing keys?** | Yes. Uncheck "Remember my key" and it lives only in sessionStorage — gone when you close the tab. |
| **Do keys persist across visits?** | Only if you choose to. The "Remember my key" toggle gives you full control. |
| **Can I delete my stored key?** | One-click "Forget my key" button in settings. Instantly removed from localStorage. |
| **What about Demo Mode?** | Demo Mode uses pre-generated outputs. Zero API calls, zero keys needed. |

### Architecture Trust Signals

- **Open source** — Full codebase on GitHub, MIT licensed
- **No backend** — Verifiable via source code and browser network tab
- **No telemetry** — No analytics, no tracking, no error reporting that phones home
- **Client-side encryption** — API keys encrypted before localStorage with AES-256
- **Minimal permissions** — No cookies, no service workers, no filesystem access

### The Privacy Banner

The tool displays a persistent, non-dismissible privacy indicator:

> 🔒 **Your data stays in your browser.** No backend. No tracking. [Verify on GitHub →]

This isn't hidden in a settings page — it's visible in the tool header at all times.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React 18 + Vite | Fast dev server, you know it, it works |
| **Styling** | Tailwind CSS + shadcn/ui | DarkMatter theme via CSS variables, component library for rapid development |
| **Theme** | DarkMatter (tweakcn) | Monospace-first developer aesthetic, dark mode default |
| **Markdown Parsing** | unified + remark-parse + mdast-util-to-string | Battle-tested AST parsing, full structural access |
| **LLM Providers** | Anthropic SDK + OpenAI SDK | Dual provider support, user picks their preference |
| **Export: Images** | html2canvas | Renders themed previews to PNG/JPG from DOM |
| **Export: PDF** | jsPDF + html2canvas | Multi-page PDF generation with DarkMatter styling |
| **Encryption** | crypto-js (AES-256) | Client-side API key encryption for localStorage |
| **State Management** | React useState + useReducer | No Redux overhead for a focused app |
| **Deployment** | Vercel | Zero-config, free tier, instant deploys |

### Architecture Decision: No Backend

ContentSeed runs entirely in the browser. LLM API calls are made client-side with the user's own API key. This means:

- Zero server costs
- No API key management headaches
- No rate limiting infrastructure needed
- Deploy anywhere static sites can live
- Privacy: your content never touches our servers
- Trust: verifiable by anyone via source code and devtools

---

## 📍 Roadmap

### Current Version: v0.1.0 (Weekend Challenge MVP)

The foundation — a landing page, a fully functional repurposing engine for 4 platforms, themed exports, and privacy-first key management.

---

### 🏁 Milestone 1: Project Foundation
>
> *Estimated: 2-3 hours*

**Goal:** Scaffold the project, integrate DarkMatter theme, and build the Markdown parser.

| Step | Task | Agent-Executable? |
|------|------|:-:|
| 1.1 | Initialize Vite + React + TypeScript project | ✅ |
| 1.2 | Install and configure shadcn/ui | ✅ |
| 1.3 | Integrate DarkMatter theme — CSS variables for light/dark, Geist Mono + JetBrains Mono font imports | ✅ |
| 1.4 | Configure Tailwind CSS with DarkMatter tokens (colors, radius, spacing, shadows) | ✅ |
| 1.5 | Set up dark mode toggle with system preference detection, default to dark | ✅ |
| 1.6 | Set up ESLint + Prettier with consistent config | ✅ |
| 1.7 | Create project folder structure (see below) | ✅ |
| 1.8 | Build Markdown parser module using `unified` + `remark-parse` | ✅ |
| 1.9 | Implement content extractor (title, headings, key paragraphs, code blocks, stats, links, TL;DR) | ✅ |
| 1.10 | Write unit tests for parser with sample blog post fixtures | ✅ |
| 1.11 | Create sample blog post fixture for Demo Mode | ✅ |

<details>
<summary>📁 Target folder structure</summary>

```
contentseed/
├── public/
│   ├── logo.svg
│   └── og-image.png
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── PrivacyBadge.tsx
│   │   │   └── CTASection.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── SplitPane.tsx
│   │   │   ├── PrivacyIndicator.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── input/
│   │   │   ├── MarkdownEditor.tsx
│   │   │   └── SamplePostButton.tsx
│   │   ├── output/
│   │   │   ├── PlatformTabs.tsx
│   │   │   ├── PlatformPreview.tsx
│   │   │   ├── previews/
│   │   │   │   ├── TwitterPreview.tsx
│   │   │   │   ├── LinkedInPreview.tsx
│   │   │   │   ├── RedditPreview.tsx
│   │   │   │   └── SubstackPreview.tsx
│   │   │   ├── QuickEditBar.tsx
│   │   │   └── ActionButtons.tsx
│   │   ├── export/
│   │   │   ├── ExportButton.tsx
│   │   │   ├── ExportPreviewModal.tsx
│   │   │   ├── ImageExporter.tsx
│   │   │   └── PDFExporter.tsx
│   │   └── settings/
│   │       ├── ProviderToggle.tsx
│   │       ├── ApiKeyModal.tsx
│   │       └── RememberKeyToggle.tsx
│   ├── lib/
│   │   ├── parser/
│   │   │   ├── markdown-parser.ts
│   │   │   └── content-extractor.ts
│   │   ├── prompts/
│   │   │   ├── platform-prompts.ts
│   │   │   ├── twitter.ts
│   │   │   ├── linkedin.ts
│   │   │   ├── reddit.ts
│   │   │   └── substack.ts
│   │   ├── providers/
│   │   │   ├── types.ts
│   │   │   ├── anthropic.ts
│   │   │   ├── openai.ts
│   │   │   └── provider-factory.ts
│   │   ├── export/
│   │   │   ├── image-renderer.ts
│   │   │   ├── pdf-renderer.ts
│   │   │   └── theme-config.ts
│   │   ├── security/
│   │   │   ├── key-encryption.ts
│   │   │   └── key-manager.ts
│   │   ├── theme/
│   │   │   ├── darkmatter.ts
│   │   │   └── theme-provider.tsx
│   │   └── demo/
│   │       ├── sample-post.md
│   │       └── sample-outputs.json
│   ├── hooks/
│   │   ├── useContentGeneration.ts
│   │   ├── useMarkdownParser.ts
│   │   ├── useProviderConfig.ts
│   │   ├── useExport.ts
│   │   └── useTheme.ts
│   ├── pages/
│   │   ├── Landing.tsx
│   │   └── App.tsx
│   ├── types/
│   │   └── index.ts
│   ├── main.tsx
│   └── index.css
├── tests/
│   ├── parser.test.ts
│   └── prompts.test.ts
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

</details>

---

### 🏁 Milestone 2: Landing Page
>
> *Estimated: 1-2 hours*

**Goal:** Build a high-converting landing page that establishes trust and drives users to the tool.

| Step | Task | Agent-Executable? |
|------|------|:-:|
| 2.1 | Set up React Router with `/` (landing) and `/app` (tool) routes | ✅ |
| 2.2 | Build Hero section — headline, subheadline, primary CTA "Start Repurposing →", secondary CTA "Try Demo" | ✅ |
| 2.3 | Build Features section — 4 platform cards showing what ContentSeed generates for each | ✅ |
| 2.4 | Build "How It Works" section — 3-step visual: Paste → Generate → Distribute | ✅ |
| 2.5 | Build Privacy/Trust section — "No backend", "Open source", "Your keys stay local", GitHub badge | ✅ |
| 2.6 | Build CTA section at bottom — repeat primary CTA with social proof (if available) | ✅ |
| 2.7 | Add responsive design — landing must look great on mobile (judges may check on phone) | ✅ |
| 2.8 | Add OG meta tags + social card image for link sharing | ✅ |

**Landing Page Structure:**

```
┌──────────────────────────────────────┐
│  Header: Logo + "Try Demo" + GitHub  │
├──────────────────────────────────────┤
│  Hero:                               │
│  "Write once. Distribute everywhere."│
│  [Start Repurposing →] [Try Demo]    │
├──────────────────────────────────────┤
│  Platform Cards:                     │
│  Twitter | LinkedIn | Reddit | Sub.  │
├──────────────────────────────────────┤
│  How It Works:                       │
│  Paste → Parse → Generate            │
├──────────────────────────────────────┤
│  Privacy First:                      │
│  No backend · Open source · Local    │
├──────────────────────────────────────┤
│  CTA: "Ready to stop reformatting?"  │
│  [Open ContentSeed →]                │
└──────────────────────────────────────┘
```

---

### 🏁 Milestone 3: LLM Integration Layer
>
> *Estimated: 2-3 hours*

**Goal:** Build the dual-provider abstraction, platform prompt engine, and secure key management.

| Step | Task | Agent-Executable? |
|------|------|:-:|
| 3.1 | Define TypeScript interfaces for provider abstraction (`LLMProvider`, `GenerationResult`, `GenerationOptions`) | ✅ |
| 3.2 | Implement Anthropic provider (`providers/anthropic.ts`) using Messages API | ✅ |
| 3.3 | Implement OpenAI provider (`providers/openai.ts`) using Chat Completions API | ✅ |
| 3.4 | Build provider factory with runtime switching | ✅ |
| 3.5 | Port platform prompt templates into modular files (twitter.ts, linkedin.ts, reddit.ts, substack.ts) | ✅ |
| 3.6 | Build `useContentGeneration` hook — orchestrates parsing → prompting → generation → state | ✅ |
| 3.7 | Add JSON response parsing with error handling and retry logic | ✅ |
| 3.8 | Build `key-encryption.ts` — AES-256 encrypt/decrypt using crypto-js | ✅ |
| 3.9 | Build `key-manager.ts` — save (encrypted localStorage), load, delete, session-only mode | ✅ |
| 3.10 | Build API key modal with "Remember my key" toggle and "Forget my key" button | ✅ |
| 3.11 | Add validation ping — test API key on entry before saving | ✅ |
| 3.12 | Add persistent privacy indicator in tool header: "🔒 Your data stays in your browser" | ✅ |
| 3.13 | Test end-to-end: sample post → parsed AST → prompt → LLM → structured output | ✅ |

---

### 🏁 Milestone 4: UI — Input & Output Panels
>
> *Estimated: 2-3 hours*

**Goal:** Build the full split-pane interface with platform-styled previews.

| Step | Task | Agent-Executable? |
|------|------|:-:|
| 4.1 | Build app shell — Header with privacy indicator, SplitPane layout, responsive breakpoints | ✅ |
| 4.2 | Build MarkdownEditor component (textarea with paste support, monospace font) | ✅ |
| 4.3 | Build "Try Sample Post" button that loads demo fixture | ✅ |
| 4.4 | Build "Generate All Platforms" CTA with loading state | ✅ |
| 4.5 | Build PlatformTabs component (Twitter, LinkedIn, Reddit, Substack) using DarkMatter accent colors | ✅ |
| 4.6 | Build TwitterPreview — thread-style card with avatar, numbering, char counts, engagement icons | ✅ |
| 4.7 | Build LinkedInPreview — LinkedIn-blue styling, reaction bar, professional card layout | ✅ |
| 4.8 | Build RedditPreview — upvote sidebar, subreddit badge, Reddit markdown rendering | ✅ |
| 4.9 | Build SubstackPreview — clean serif typography, heart icon, restack button | ✅ |
| 4.10 | Build ActionButtons — Copy to Clipboard (per platform), Regenerate, Copy All | ✅ |
| 4.11 | Add toast notifications for copy confirmation | ✅ |
| 4.12 | Build Provider toggle (Claude / OpenAI) in header | ✅ |

---

### 🏁 Milestone 5: Export System
>
> *Estimated: 1.5-2 hours*

**Goal:** Build the preview-first export pipeline for images and PDFs, themed with DarkMatter.

| Step | Task | Agent-Executable? |
|------|------|:-:|
| 5.1 | Install `html2canvas` and `jsPDF` dependencies | ✅ |
| 5.2 | Build `theme-config.ts` — export-specific DarkMatter color/font tokens for the renderer | ✅ |
| 5.3 | Build `ExportPreviewModal.tsx` — full-screen modal showing exactly what will be exported | ✅ |
| 5.4 | Build `ImageExporter.tsx` — renders a single platform output as a themed social card (PNG/JPG) | ✅ |
| 5.5 | Design export card layout: DarkMatter background, platform icon, content, ContentSeed branding footer | ✅ |
| 5.6 | Build `PDFExporter.tsx` — multi-page PDF with all platform outputs, cover page with blog title | ✅ |
| 5.7 | Add export format selector in preview modal: PNG / JPG / PDF | ✅ |
| 5.8 | Add "Export All" button that generates PDF with all platforms | ✅ |
| 5.9 | Add per-platform "Export as Image" button in the output tab | ✅ |
| 5.10 | Test export output quality — fonts rendering, colors matching theme, content not clipped | ✅ |

**Export Preview Flow:**

```
User clicks "Export" 
     → Preview Modal opens (full-screen)
     → Shows exactly what the export will look like
     → User picks format: PNG | JPG | PDF
     → Downloads themed, branded asset
```

**Export Card Anatomy:**

```
┌──────────────────────────────────────┐
│  ┌─ DarkMatter Background ────────┐ │
│  │                                 │ │
│  │  [Platform Icon]  Twitter/X     │ │
│  │  ─────────────────────────      │ │
│  │                                 │ │
│  │  1/ Your hook tweet here...     │ │
│  │                                 │ │
│  │  2/ Key insight from the post   │ │
│  │                                 │ │
│  │  3/ Code example highlight      │ │
│  │                                 │ │
│  │  4/ The takeaway...             │ │
│  │                                 │ │
│  │  5/ Read more: [link]           │ │
│  │                                 │ │
│  │  ─────────────────────────      │ │
│  │  🌱 Generated by ContentSeed   │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

---

### 🏁 Milestone 6: Quick Edit & Polish
>
> *Estimated: 1-2 hours*

**Goal:** Add the tweak-without-regenerate layer and ship.

| Step | Task | Agent-Executable? |
|------|------|:-:|
| 6.1 | Build QuickEditBar — tone chips (Casual/Professional/Technical/Storytelling) | ✅ |
| 6.2 | Add length toggle (Shorter/Default/Longer) that re-prompts with adjusted params | ✅ |
| 6.3 | Add hashtag toggle (on/off) and emoji toggle (on/off) | ✅ |
| 6.4 | Add per-platform Regenerate (keep other platforms, redo just one) | ✅ |
| 6.5 | Wire up Demo Mode — pre-generated outputs for sample post (zero API calls) | ✅ |
| 6.6 | Skeleton loading UI while LLM generates | ✅ |
| 6.7 | Error states — invalid API key, rate limit, generation failure | ✅ |
| 6.8 | Responsive design pass — mobile layout (stacked panels), landing page mobile | ✅ |
| 6.9 | Final Vercel deploy with environment check | ✅ |
| 6.10 | Record demo GIF / video | 🙋 Manual |

---

### 🏁 Milestone 7: DEV Submission
>
> *Estimated: 1 hour*

| Step | Task | Agent-Executable? |
|------|------|:-:|
| 7.1 | Write DEV submission post using challenge template | Partial |
| 7.2 | Add screenshots and demo GIF to post | 🙋 Manual |
| 7.3 | Proofread and publish | 🙋 Manual |

---

## 🔮 Future Vision (Post-Challenge)

ContentSeed has legs beyond a weekend project. Here's the long-term vision:

### v0.2 — Browser Extension

- Right-click any blog post on the web → "Repurpose with ContentSeed"
- Popup shows all 4 platform outputs instantly
- One-click copy to clipboard

### v0.3 — More Platforms

- **Hacker News** — title optimizer + comment-style summary
- **DEV.to** — frontmatter generation + tag suggestions + series linking
- **Hashnode** — cover image prompt + SEO metadata
- **Medium** — subtitle generation + publication formatting
- **YouTube Community** — video promotion post from blog content
- **Mastodon** — Fediverse-native formatting with CW support

### v0.4 — Content Analytics

- Track which platform versions drive the most engagement
- A/B test hooks — ContentSeed generates 3 alternatives, you pick the winner
- "Best time to post" suggestions per platform

### v0.5 — Team & Workflow

- Team accounts with shared style guides
- Approval workflows for brand-managed content
- Bulk processing — feed an RSS, get all platforms for every new post
- Zapier/Make integration for automated distribution

### v0.6 — Bring Your Own Brand Voice

- Upload 10+ past posts → ContentSeed learns your writing style
- Generated content matches YOUR voice, not generic AI tone
- Per-platform voice calibration (your Twitter voice ≠ your LinkedIn voice)

### v1.0 — The Content OS

- Full editorial calendar with multi-platform scheduling
- Content performance dashboard across all platforms
- AI-assisted content ideation from your existing body of work
- "Write once, distribute everywhere" fully automated pipeline

---

## 🤝 Contributing

ContentSeed is open source and welcomes contributions! Whether it's a new platform template, a UI improvement, or a bug fix — all PRs are appreciated.

### Getting Started

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/contentseed.git
cd contentseed
npm install
npm run dev
```

### Areas We'd Love Help With

- **New platform templates** — Know a platform well? Write a prompt template for it
- **Preview components** — Make the platform previews more accurate and beautiful
- **Parser improvements** — Better extraction of key points, stats, code blocks
- **Export themes** — Additional export card designs beyond DarkMatter
- **Accessibility** — Screen reader support, keyboard navigation
- **Internationalization** — Multi-language support for prompts and UI

### Guidelines

- Keep PRs focused and small
- Add tests for parser and prompt changes
- Follow the existing code style (Prettier handles formatting)
- Platform templates should encode REAL platform knowledge, not generic instructions
- All UI must work with both light and dark DarkMatter themes

---

## 📄 License

MIT — use it, fork it, build on it, make it yours.

---

## 💡 Origin Story

> I run a newsletter called **Coffee, Code & AI** and blog across DEV, Hashnode, and Medium. Every time I publish a post, I'd spend almost as much time *repurposing* it as I did writing it. Not because the content needed to change — but because every platform has its own language, format, and culture.
>
> ContentSeed was born from that frustration. A great blog post isn't one piece of content — it's six pieces of content waiting to happen. ContentSeed makes that effortless.

---

<p align="center">
  Built with ☕ and code by <a href="https://github.com/YOUR_USERNAME">YOUR_NAME</a>
  <br/>
  <sub>A <a href="https://dev.to/challenges/weekend-2026-02-28">DEV Weekend Challenge</a> submission</sub>
</p>
