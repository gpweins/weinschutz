# Portfolio Site — Design Spec

**Date:** 2026-04-27
**Owner:** gpweins
**Status:** approved (rebuild from scratch; supersedes `2026-04-25-portfolio-design.md`)

## Goal

Recruiter-facing portfolio site at `https://gpweins.github.io/weinschutz/`, deployed via GitHub Actions to GitHub Pages. Five sections — Home, Experience, Skills, Blog (Markdown), Contact — rendered as fully static HTML, compatible with a strict CSP that disallows `'unsafe-eval'`, `'wasm-unsafe-eval'`, and inline `<script>`/`<style>`.

## Non-goals

- Server-side rendering at request time (everything prerendered at build).
- Embedded Cal.com widget (the `@calcom/embed-snippet` SDK requires loosening CSP and was the failure mode of the prior attempt). Replaced by a static link CTA.
- Frameworks beyond what the static site needs (no Vue, no React on the served pages).
- Comments, analytics, search.

## Stack

- **Astro 5** (`output: 'static'`) — file-based routing, content collections for blog posts, every route prerendered.
- **Tailwind v4** via `@tailwindcss/vite`, CSS-first config in `src/styles/main.css`.
- **Node 24** (CI and `engines.node`).
- **TypeScript** via `astro check`.
- **No JS frameworks** on the page. The only client-side JS shipped:
  - `theme.ts` — read `localStorage.theme` ∪ `prefers-color-scheme`, set `data-theme` on `<html>`, expose toggle handler.
  - `reveal.ts` — single shared `IntersectionObserver` adding `.ws-in` to `[data-fade]`.
  Both are file-based (`<script src>`), not inline.

## Deployment

- GitHub Pages, source = "GitHub Actions" (set once in repo settings).
- `base: '/weinschutz/'`, `site: 'https://gpweins.github.io/weinschutz/'` in `astro.config.mjs`.
- Workflow: `.github/workflows/deploy.yml`, triggers on push to `main` and manual dispatch. Build job uses `actions/setup-node@v4` with `node-version: 24`. Deploy job uses `actions/deploy-pages@v4`.
- No CNAME, no `gh-pages` branch.

## CSP

Set via `<meta http-equiv="Content-Security-Policy">` in `Base.astro`:

```
default-src 'self';
img-src 'self' data:;
style-src 'self';
script-src 'self';
font-src 'self' https://rsms.me;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

Inter loaded via `<link rel="stylesheet" href="https://rsms.me/inter/inter.css">` (no `@font-face` inline). Future option: self-host Inter to drop the `font-src` exception.

## File layout

```
weinschutz/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── .gitignore                 # includes reference/ and references/
├── .github/workflows/deploy.yml
├── public/
│   ├── favicon.svg
│   ├── resume.pdf             # user provides later
│   ├── robots.txt
│   └── blog/
│       └── science-of-silence.png
├── src/
│   ├── styles/main.css        # @theme tokens, motion, base
│   ├── scripts/
│   │   ├── theme.ts           # data-theme bootstrap + toggle
│   │   └── reveal.ts          # IntersectionObserver fade-up
│   ├── content/
│   │   ├── config.ts          # blog collection schema
│   │   └── blog/science-of-silence.md
│   ├── data/
│   │   ├── experience.ts      # 8 entries
│   │   └── skills.ts          # 5 groups
│   ├── components/
│   │   ├── Monogram.astro
│   │   ├── Eyebrow.astro
│   │   ├── Pill.astro
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   └── ThemeToggle.astro
│   ├── sections/
│   │   ├── Hero.astro         # 'stacked' variant
│   │   ├── Experience.astro
│   │   ├── Skills.astro
│   │   ├── BlogPreview.astro
│   │   └── Contact.astro
│   ├── layouts/Base.astro     # <html>, <head>, CSP, theme bootstrap, Nav, Footer
│   └── pages/
│       ├── index.astro
│       ├── blog/index.astro
│       ├── blog/[slug].astro
│       └── 404.astro
└── docs/superpowers/specs/2026-04-27-portfolio-design.md
```

`reference/` and `references/` are gitignored. The design source bundle (`reference/Weinschutz_files/*.jsx`) is read once during implementation; nothing is imported from it at runtime.

## Design tokens

Light mode (`@theme`):

```
--color-bg:        #fbfaf7
--color-bg-sub:    #f3f1ec
--color-ink:       #18171a
--color-ink-muted: #6e6a63
--color-accent:    #3f7062
--color-accent-2:  #8a6428
--color-border:    #e6e2d8
--font-sans:       'Inter', ui-sans-serif, system-ui, sans-serif
```

Dark mode (`html[data-theme="dark"]` — selector applied to the root, not a wrapper class; the design bundle's `.ws-scope` was a sandbox artifact and is dropped):

```
--color-bg:        #131210
--color-bg-sub:    #1c1a17
--color-ink:       #f7f4ed
--color-ink-muted: #c2bcb1
--color-accent:    #7fb39f
--color-accent-2:  #d4a76a
--color-border:    #2d2a25
```

All text/accent pairings audited to WCAG AA in both modes (deeper sage in light, lighter sage in dark — the original deep-forest dark-mode accent failed AA at small sizes and is reserved for fill-only use).

## Sections (Home page)

Wrapper: each section uses `max-width: 1024px`, centered, with vertical padding `128px` desktop / `64px` compact.

### Nav

Sticky, top: 0, z-index: 50. Transparent at scroll-top; switches to `color-mix(in oklab, var(--color-bg) 85%, transparent)` + `backdrop-filter: blur(8px)` + 1px bottom border once scrolled. Left: `Monogram` + "Gustavo Weinschütz" (collapsed to monogram on mobile). Right: links to `#hero`/`#experience`/`#skills`/`#blog`/`#contact` + `ThemeToggle`. Mobile: hamburger button (currently visual; menu deferred — links collapse into a simple inline list).

### Hero (`stacked` variant)

```
[ eyebrow: SENIOR SOFTWARE ENGINEER ]
[ h1: Gustavo \n Weinschütz  — 112px / 56px compact, weight 700, line-height 0.95, letter-spacing -0.02em ]
[ p:  I build web applications that are fast, scalable, and a pleasure to use.  — max-w 520, 18px, ink-muted ]
[ Pill primary → #contact: "Book a Call" ]  [ Pill ghost → /weinschutz/resume.pdf: "Download Resume" ]
[ ↓ Scroll  — desktop only, absolutely positioned bottom-32 ]
```

### Experience

Header: eyebrow "Experience", h2 "15+ years building software", subtitle "Healthtech, pharma, finance, logistics, and CRM."

Body: ordered list, `border-left: 1px solid var(--color-border)` rail, padding-left 44px (28px compact). Each entry:

- Accent dot (`width: 10`, `height: 10`, `border-radius: 999`, `background: var(--color-accent)`) absolutely positioned at `left: -50px` (`-34px` compact).
- Eyebrow date range in accent color.
- Card: rounded-16, `bg-sub`, 1px border, padding 24 (18 compact).
  - h3 role (16/18px, weight 600).
  - Sub-line: `company · location` in `accent-2`.
  - Summary in `ink-muted`.

Data: `EXPERIENCE` array of 8 entries from `src/data/experience.ts`, lifted verbatim from the design's `data.jsx`. Each entry has `company`, `role`, `range`, `location`, `summary`. Order = reverse-chronological.

### Skills

`bg-sub` band. Header: eyebrow "Skills", h2 "Tools I reach for".

Body: 3-col grid (1-col compact), gap 40. Each group:

- Group name as accent-2 eyebrow.
- Chips: rounded-999, `bg`, 1px border, 12px text, padding `6px 12px`.

Data: `SKILLS` array of 5 groups from `src/data/skills.ts`:

```
Backend                — PHP, Laravel, Node.js, REST APIs, Microservices, OOP
Frontend               — Vue.js, React, JavaScript, TypeScript, HTML/CSS
Data & Integrations    — PostgreSQL, MySQL, Database Optimization, Auth0 / SSO, EDI
Cloud & DevOps         — AWS, Docker, GitHub Actions, CI/CD, Unit Testing, Git
Leadership & Process   — Agile / Scrum, Team Leadership, Mentorship, Code Review, Technical Interviews
```

### BlogPreview

Header: eyebrow "Writing", h2 "Recent articles", right-aligned "View all articles →" (hidden on compact).

Body: 3-col grid (1-col compact), gap 24. Each card:

- Rounded-16, `bg-sub`, 1px border, padding 24.
- Eyebrow date in accent.
- h3 title (15px, weight 600, line-height 1.35), 2-line clamp not enforced.
- 3-line clamped excerpt in `ink-muted`.
- "Read →" footer in `accent-2`.

Data: `getCollection('blog')` sorted desc by `date`, sliced to 3. If fewer than 3, fill remaining cells with a single dashed-border "More on the way" card spanning the leftover columns.

### Contact

`bg-sub` band. Header: eyebrow "Contact", h2 "Let's talk.", subtitle "Open to senior backend and full-stack roles. Pick a slot below — or reach out on LinkedIn."

Body: a single primary `Pill` "Book a Call on Cal.com →" linking to `https://cal.com/gpweins` with `target="_blank" rel="noopener"`. No mock calendar; the JSX `CalEmbedMock` was a design-canvas placeholder, not a deliverable.

### Footer

`border-top: 1px solid var(--color-border)`, padding `40px 32px`. Left: `© 2026 Gustavo Weinschütz`. Right: GitHub + LinkedIn icon links (existing SVGs lifted from `chrome.jsx`).

## Blog

### Collection schema (`src/content/config.ts`)

```ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    linkedinUrl: z.string().url().optional(),
    headerImage: z.string().optional(),
  }),
})
```

`dateLabel` is computed at build time via `Intl.DateTimeFormat('en-US', { dateStyle: 'long' })` — not a frontmatter field.

### `/blog` (index)

Max-width 768px. Header: eyebrow "Writing", h1 "Articles" (48px desktop / 32px compact), intro paragraph. List of `<a>` rows, each `padding: 28px 0` with bottom border, containing eyebrow date, h2 title (24/20px), excerpt. Sorted desc by `date`.

### `/blog/[slug]` (post)

Max-width 720px. `← Back to writing` link → `/blog`. Header: eyebrow date, h1 title (40/28px), optional "Originally on LinkedIn →" link with LinkedIn glyph. Optional `headerImage` rendered above the body. Body: prose styled at 17px (16px compact), line-height 1.75. Prev/next nav at footer (showing adjacent post titles when available, dimmed placeholders otherwise).

### Adding a post

```bash
# Create a new file in src/content/blog/<slug>.md
# Required frontmatter: title, date, excerpt
# Optional: linkedinUrl, headerImage
```

The post appears in `BlogPreview` (top 3), `/blog`, and at `/blog/<slug>` automatically. No router or config changes.

### First post

`src/content/blog/science-of-silence.md`, copied from `reference/science-of-silence.md` with one fix:

- `headerImage:science-of-silence.png` → `headerImage: "science-of-silence.png"` (missing space + quotes).

Image copied to `public/blog/science-of-silence.png` and referenced as `/weinschutz/blog/science-of-silence.png`.

## Theme switching

`<html>` carries `data-theme="light"` or `data-theme="dark"`. Bootstrap script (`src/scripts/theme.ts`, loaded synchronously in `<head>` via `<script src>` — file-based, hashed by Astro, allowed by `script-src 'self'`):

```ts
const stored = localStorage.getItem('theme');
const prefers = matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.dataset.theme = stored ?? (prefers ? 'dark' : 'light');
```

`ThemeToggle.astro` renders a button. Its click handler lives in `src/scripts/theme.ts` (alongside the bootstrap), which Astro bundles and emits as a hashed `.js` file referenced via `<script src>`. No `<script>` blocks contain inline source.

No FOUC: bootstrap runs before `<body>`. `prefers-reduced-motion` honored by motion CSS.

## Motion

`[data-fade]` elements default to `opacity: 0; transform: translateY(12px)` and animate in once `.ws-in` is added. `src/scripts/reveal.ts` instantiates one `IntersectionObserver`, processes `data-delay` for staggered reveals, and disconnects per-element on first intersection. `@media (prefers-reduced-motion: reduce)` removes the transition and the offset.

## SEO / head

`Base.astro` accepts `title`, `description`, `canonical`, `ogImage` props. Each page sets them. Astro's `astro-sitemap` integration generates `/sitemap-index.xml` automatically.

## Out of scope (this spec)

- 404 polish beyond a minimal "page not found" link back home.
- Per-post OG image generation.
- RSS feed.
- Search.
- Self-hosted Inter (currently `rsms.me` — switch is a one-liner if needed).

## Approval gates

1. Spec written to this file (done).
2. User reviews and approves before plan is written.
3. Implementation plan written to `docs/superpowers/plans/2026-04-27-portfolio.md`.
4. User reviews and approves before code is changed.
