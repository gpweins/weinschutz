# Weinschutz Portfolio — Design Spec

**Date:** 2026-04-25
**Author:** Gustavo Weinschütz (with Claude)
**Status:** Approved, ready for implementation plan

---

## Goal

Build a personal portfolio site for Gustavo Weinschütz targeted at **technical recruiters**, replacing the prior Next.js project in `references/weinschutz_react/`. Site must be simple enough for the owner to maintain independently, deployable to GitHub Pages on a custom domain, and visually warm/considered (not generic developer-template).

## Non-goals

- Freelance services / lead-gen funnel (deferred — recruiter focus only)
- Testimonials / referrals section (deferred — content not ready)
- Multi-language support (English only)
- CMS or admin UI (markdown-in-repo is the publishing flow)
- Comments, email signup, or any form of user state
- Server-side anything (fully static)

## Audience & success criteria

A recruiter lands on the homepage and within ~30 seconds:

1. Knows Gustavo's name, seniority, and headline value prop
2. Can scan 15+ years of experience top-to-bottom
3. Can grab a resume PDF for their ATS
4. Can book a call without leaving the site

If those four happen, the site is doing its job.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Vue 3 (`<script setup>`, Composition API) |
| Language | TypeScript |
| Build tool | Vite |
| Pre-rendering | `vite-ssg` (static HTML for every route at build time) |
| Sitemap | `vite-ssg-sitemap` |
| Routing | Vue Router 4, history mode |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Motion | `@vueuse/motion` |
| Markdown | `markdown-it` + `gray-matter` (build-time) |
| Syntax highlighting | Shiki (build-time, zero client weight) |
| Fonts | Inter, self-hosted via `@fontsource/inter` |
| Cal.com embed | `@calcom/embed-snippet`, lazy-loaded |
| Tests | Vitest + `@vue/test-utils` |
| Hosting | GitHub Pages, custom domain `weinschutz.com.br` |
| CI/CD | GitHub Actions → `actions/deploy-pages` |
| Analytics | Umami Cloud (free tier) |

## Architecture

A Vue SPA pre-rendered at build time. Each route emits a static HTML file; the JS bundle hydrates the page for client-side navigation. Blog posts are crawlable by search engines because they exist as static HTML, not just JS-rendered routes.

The markdown pipeline runs at build time (no server, no runtime parsing): `import.meta.glob` discovers all `.md` files in `content/blog/`, `gray-matter` splits frontmatter, `markdown-it` (with Shiki for code blocks) renders the body, and the result is a typed `Article[]` array consumed by Vue components.

---

## Site structure

5 sections, single-page scroll on home, dedicated routes for blog:

| Route | Purpose |
|---|---|
| `/` | Hero → Experience → Skills → Blog preview → Contact |
| `/blog` | Chronological list of all articles |
| `/blog/:slug` | Individual article |

### Hero (`/` top)

- Full viewport height
- Eyebrow: `SENIOR SOFTWARE ENGINEER` (uppercase, tracked, accent color)
- Headline: `Gustavo Weinschütz` (large sans, tight letter spacing)
- Sub: **"I build web applications that are fast, scalable, and a pleasure to use."**
- Two CTAs:
  - **Book a Call** → `https://app.cal.com/gpweins/`
  - **Download Resume** → `/resume.pdf`
- Subtle scroll indicator at bottom

### Experience (`/#experience`)

- Section heading + one-line subtitle
- **Left rail timeline:** vertical line on the left, dot per role, full-width card on the right
- Each card: date range eyebrow, role, company · location, summary paragraph
- Source: hand-written `src/data/experience.ts`, transcribed once from `references/LinkedIn_Profile_2026_04_24.pdf`
- Mobile: rail collapses to a thinner left border, cards stack full-width

### Skills (`/#skills`)

- 5 grouped chip rows: **Backend / Frontend / Data & Integrations / Cloud & DevOps / Leadership & Process**
- Chips are styled `<span>`s with subtle border — no skill bars, no percentages
- Source: hand-written `src/data/skills.ts` (revisable structure based on prior project's groupings)

### Blog preview (`/#blog` on home)

- Latest 3 articles as cards: title, date, 2-line excerpt, "Read →" link
- Bottom link: "View all articles →" → `/blog`

### Blog index (`/blog`)

- Chronological list (most recent first), one row per article: title, date, excerpt
- No tags, no search — YAGNI for current article volume

### Blog post (`/blog/:slug`)

- Top: back link to `/blog`, title, formatted date, optional "Originally on LinkedIn →" if `linkedinUrl` set in frontmatter
- Body: rendered HTML wrapped in Tailwind `prose` styles (with custom overrides for the warm palette)
- Bottom: previous/next article navigation

### Contact (`/#contact`)

- Section heading: "Let's talk."
- One line aimed at recruiters (placeholder: "Open to senior backend and full-stack roles. Pick a slot below.")
- **Cal.com inline embed** via `@calcom/embed-snippet`, lazy-loaded so it doesn't bloat the initial bundle
- Fallback: direct link to `app.cal.com/gpweins` if embed fails

### Nav + Footer

- **Nav:** sticky top; transparent over hero, becomes solid (with backdrop-blur) on scroll. Links: Home / Experience / Skills / Blog / Contact. Right side: theme toggle. Mobile: hamburger drawer.
- **Footer:** name, year, GitHub + LinkedIn icons, optional "Built with Vue + Vite" link to repo

---

## Content pipeline

### Article frontmatter schema

```yaml
---
title: "The Science of Silence: Why Your Best Ideas Might Be Stuck in 'Dead Air'"
date: 2026-04-21              # ISO format, used for sort + display
excerpt: "..."                # optional — first paragraph used if absent
linkedinUrl: "https://..."    # optional — shown as "Originally on LinkedIn"
ogImage: "/images/blog/.../cover.png"  # optional — overrides default OG
---
```

### Slug

Derived from filename in kebab-case. `science-of-silence.md` → `/blog/science-of-silence`.

### Build-time loader (`src/content/articles.ts`)

```
1. import.meta.glob('/content/blog/*.md', { eager: true, query: '?raw', import: 'default' })
2. for each .md file:
     - gray-matter() → { data: frontmatter, content: body }
     - markdown-it (with Shiki plugin) → rendered HTML
     - normalize into Article object
3. sort by date desc
4. export const articles: Article[]
```

### Article type

```ts
type Article = {
  slug: string
  title: string
  date: string           // ISO
  excerpt: string        // 2-line summary
  html: string           // rendered body
  linkedinUrl?: string
  ogImage?: string
}
```

### Images

- Stored in `public/images/blog/<slug>/`
- Referenced from markdown as `/images/blog/<slug>/foo.png`
- No Vite asset pipeline indirection — works identically in dev and prod

### Existing article migration

`example_article.md` has the title encoded as a markdown link in the H1. Migration:

- Move the title text to frontmatter `title`
- Move the LinkedIn URL to frontmatter `linkedinUrl`
- Drop the H1 from the body
- Add `date: 2026-04-21` to frontmatter

### Adding a new article (documented in README)

```
1. cp content/blog/_template.md content/blog/<your-slug>.md
2. Edit frontmatter (title, date required; excerpt, linkedinUrl, ogImage optional)
3. Write markdown body
4. (Optional) drop images in public/images/blog/<your-slug>/
5. git commit -m "post: <slug>" && git push
6. GitHub Actions builds + deploys (~2 min)
```

---

## Theming

### Palette (warm in both modes)

```css
/* Light */
--color-bg:        #faf7f1   /* main canvas */
--color-bg-sub:    #f4ede2   /* cards, raised surfaces */
--color-ink:       #1f1b16   /* primary text */
--color-ink-muted: #6a5d4f   /* secondary text */
--color-accent:    #a8896c   /* wood/copper — eyebrows, dates, dot markers */
--color-accent-2:  #6b8a5a   /* sage — links, active nav */
--color-border:    #e8dfd0

/* Dark — warm-dark, not blue-dark */
--color-bg:        #1c1815
--color-bg-sub:    #252019
--color-ink:       #f0e9dc
--color-ink-muted: #a8967e
--color-accent:    #c5a888
--color-accent-2:  #8eaa78
--color-border:    #3a312a
```

Tokens declared in `src/styles/main.css` via Tailwind v4 `@theme` directive. Toggle implemented via `[data-theme="dark"]` on `<html>`, persisted in `localStorage`. Default: `prefers-color-scheme`.

### Typography

- Single family: **Inter**, self-hosted via `@fontsource/inter`
- Scale:
  - Hero: `text-7xl md:text-8xl`
  - Section heading: `text-4xl`
  - Subhead: `text-lg`
  - Body: `text-base`
  - Eyebrow: `text-xs uppercase tracking-[0.18em]`
- Tight letter spacing on display text (`-tracking-[0.02em]`)

### Spacing & layout

- Max content width: `max-w-5xl` for sections, `max-w-3xl` for blog prose
- Section padding: `py-24 md:py-32`
- Mobile-first; Tailwind default breakpoints (`sm/md/lg/xl`)

---

## Motion

- Single reusable directive pattern: `v-motion-fade-visible-once` on each card/section
- 300ms duration, 12px upward translate, ease-out
- Stagger via per-child `:delay` for the experience timeline (60ms steps)
- `prefers-reduced-motion: reduce` honored automatically — motion disabled, content shown immediately

---

## Accessibility

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>` (blog posts)
- Visible focus rings: `focus-visible:ring-2 focus-visible:ring-[--color-accent-2]`
- "Skip to content" link as first focusable element
- All markdown images require `alt` text
- WCAG AA contrast verified for both themes

---

## File layout

```
weinschutz/
├── .github/workflows/deploy.yml
├── public/
│   ├── CNAME                          # weinschutz.com.br
│   ├── resume.pdf
│   ├── og-image.png
│   └── images/blog/<slug>/...
├── content/
│   └── blog/
│       ├── science-of-silence.md
│       └── _template.md
├── src/
│   ├── main.ts                        # vite-ssg entry
│   ├── App.vue                        # nav + outlet + footer
│   ├── router.ts
│   ├── styles/main.css                # tailwind + @theme tokens + custom utilities
│   ├── components/
│   │   ├── Nav.vue
│   │   ├── Footer.vue
│   │   ├── ThemeToggle.vue
│   │   └── motion/FadeUp.vue
│   ├── sections/
│   │   ├── Hero.vue
│   │   ├── Experience.vue
│   │   ├── Skills.vue
│   │   ├── BlogPreview.vue
│   │   └── Contact.vue
│   ├── pages/
│   │   ├── Home.vue
│   │   ├── BlogIndex.vue
│   │   └── BlogPost.vue
│   ├── data/
│   │   ├── experience.ts              # transcribed from LinkedIn PDF
│   │   └── skills.ts
│   └── content/
│       └── articles.ts                # build-time markdown loader
├── tests/
│   ├── articles.test.ts
│   └── smoke.test.ts
├── index.html                         # contains Umami snippet
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Deployment

### `.gitignore`

```
# Dependencies
node_modules/

# Build output
dist/
.vite/

# Environment
.env
.env.local

# Editor / OS
.DS_Store
.vscode/
.idea/

# Brainstorming session artifacts (local only)
.superpowers/

# Local-only reference materials (PDF, illustration, prior project, etc.)
references/
```

The `references/` folder is local-only — source materials (LinkedIn PDF, illustration, prior project) used during development but not published to GitHub.

### GitHub Actions workflow

```
on push to main:
  - checkout
  - setup-node 20
  - npm ci
  - npm test            (vitest, fail-fast)
  - npm run build       (vite-ssg → dist/)
  - actions/upload-pages-artifact path=dist
  - actions/deploy-pages
```

GitHub Pages source: **GitHub Actions** (not branch-based). No `gh-pages` branch.

### Custom domain DNS (one-time)

Apex `weinschutz.com.br` → A records:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

`www.weinschutz.com.br` → CNAME to `gpweins.github.io`.

HTTPS auto-issued by GitHub once DNS propagates.

### Analytics

Umami snippet in `index.html`:

```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="a02de2cc-7989-4178-84ab-bd400ba45bf7"></script>
```

Loads on every pre-rendered page.

### SEO

- Per-route `<head>` config via `vite-ssg` head helper: title, description, canonical, `og:image`
- Default OG image: `public/og-image.png`
- Blog posts: per-post overrides via frontmatter `ogImage`, description from `excerpt`
- `sitemap.xml` generated at build by `vite-ssg-sitemap`

### Resume PDF

Stored as `public/resume.pdf`. To update: drop a new export over the file, commit, push.

---

## Testing

Light by design — enough to catch a broken markdown pipeline or Tailwind misconfig before deploy:

- **`articles.test.ts`** — parses `_template.md` plus at least one real article; asserts frontmatter shape; asserts rendered HTML contains expected tags
- **`smoke.test.ts`** — `mount(App)` renders without error

Vitest runs in CI before the build; failures block deploy.

---

## Local development

Documented in README:

```
npm install
npm run dev      # localhost:5173, hot reload
npm run build    # vite-ssg → dist/
npm run preview  # serve dist/ at localhost:4173
npm test         # vitest
```

---

## Open items / future

- **OG image design:** placeholder for v1; design later
- **Sub-headline copy:** placeholder is the prior project's line; revisable
- **Skills `data/skills.ts` content:** structure carried over from prior project; Gustavo to revise the chips inside each group as needed
- **Experience transcription:** content/copy comes from `references/LinkedIn_Profile_2026_04_24.pdf`, written to `src/data/experience.ts` as part of implementation
- **Future content sections to consider** (out of scope for v1): services / freelance positioning, testimonials, case studies
