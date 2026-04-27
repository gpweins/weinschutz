# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Weinschutz portfolio from scratch on Astro 5 — strict-CSP, GitHub Pages deployable at `/weinschutz/`, with Home / Experience / Skills / Blog (Markdown) / Contact sections and light/dark theming.

**Architecture:** Astro 5 in `output: 'static'` mode. Every route prerendered. Tailwind v4 (CSS-first config) provides utilities; design tokens live in `@theme { … }` and dark-mode overrides in `html[data-theme="dark"]`. Content collections (Content Layer API with `glob` loader) supply blog posts. The only client-side JS is two file-based scripts (theme bootstrap + IntersectionObserver fade-up) — no inline scripts, no eval, no wasm. Cal.com is a static link, not an embedded SDK.

**Tech Stack:** Astro 5, Tailwind v4 + `@tailwindcss/vite`, TypeScript, Vitest, Node 24, GitHub Actions → GitHub Pages.

**Reference spec:** [docs/superpowers/specs/2026-04-27-portfolio-design.md](../specs/2026-04-27-portfolio-design.md)

---

## Task 1: Wipe the old Vue implementation

The repo currently holds the previous Vue + vite-ssg portfolio. Clear everything that won't carry over before scaffolding fresh. Keep `.git/`, `docs/`, and the worktree state.

**Files:**
- Delete: `src/`, `content/`, `tests/`, `public/`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `package.json`, `package-lock.json`, `README.md`, `CLAUDE.md`, `.github/workflows/` (will be recreated in Task 21).
- Keep: `.git/`, `docs/`, `.github/` (directory itself, just empty its workflows).

- [ ] **Step 1: Remove old source trees**

```bash
rm -rf src content tests public node_modules
rm -f index.html vite.config.ts tsconfig.json tsconfig.node.json package.json package-lock.json README.md CLAUDE.md
rm -rf .github/workflows
```

- [ ] **Step 2: Verify clean slate**

```bash
ls
```
Expected: only `.git`, `.github`, `docs` visible (plus `.gitignore` if present).

- [ ] **Step 3: Commit the wipe**

```bash
git add -A
git commit -m "chore: remove vue implementation in preparation for astro rebuild"
```

---

## Task 2: Scaffold Astro project (minimal, build passes)

Create `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, a stub `src/pages/index.astro`, and install dependencies. Verify `npm run build` succeeds end-to-end before any real content.

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro`, `src/env.d.ts`

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "weinschutz",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "engines": { "node": ">=24" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0",
    "happy-dom": "^15.0.0"
  }
}
```

- [ ] **Step 2: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://gpweins.github.io',
  base: '/weinschutz/',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Write `.gitignore`**

```
node_modules/
dist/
.astro/
.DS_Store
.env
.env.*
!.env.example
reference/
references/
```

- [ ] **Step 5: Write `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Step 6: Write a minimal stub `src/pages/index.astro`**

```astro
---
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Weinschutz</title>
  </head>
  <body><p>placeholder</p></body>
</html>
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`
Expected: installs Astro 5 + Tailwind v4 + vitest + happy-dom without errors.

- [ ] **Step 8: Verify build works**

Run: `npm run build`
Expected: `dist/index.html` exists, exits 0.

```bash
test -f dist/index.html && echo OK
```

- [ ] **Step 9: Verify check passes**

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 10: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json .gitignore src/
git commit -m "feat: scaffold astro project"
```

---

## Task 3: Design tokens and base CSS

Set up `src/styles/main.css` with the Tailwind v4 import, `@theme` light tokens, `[data-theme="dark"]` overrides, and the fade-up motion CSS.

**Files:**
- Create: `src/styles/main.css`

- [ ] **Step 1: Write `src/styles/main.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: #fbfaf7;
  --color-bg-sub: #f3f1ec;
  --color-ink: #18171a;
  --color-ink-muted: #6e6a63;
  --color-accent: #3f7062;
  --color-accent-2: #8a6428;
  --color-border: #e6e2d8;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

html[data-theme="dark"] {
  color-scheme: dark;
  --color-bg: #131210;
  --color-bg-sub: #1c1a17;
  --color-ink: #f7f4ed;
  --color-ink-muted: #c2bcb1;
  --color-accent: #7fb39f;
  --color-accent-2: #d4a76a;
  --color-border: #2d2a25;
}

html, body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}

a:focus-visible, button:focus-visible {
  outline: 2px solid var(--color-accent-2);
  outline-offset: 2px;
  border-radius: 2px;
}

[data-fade] {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
[data-fade].ws-in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-fade] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/main.css
git commit -m "feat: design tokens (light + dark) and motion css"
```

---

## Task 4: Theme bootstrap script with unit test

Implement `src/scripts/theme.ts`. The bootstrap reads `localStorage.theme` (else `prefers-color-scheme`) and sets `data-theme` on `<html>`. The toggle flips it and persists. Vitest covers the bootstrap logic.

**Files:**
- Create: `src/scripts/theme.ts`
- Create: `tests/theme.test.ts`
- Create: `vitest.config.ts`

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 2: Write the failing test `tests/theme.test.ts`**

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { applyInitialTheme, setTheme } from '../src/scripts/theme';

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('uses stored theme when set', () => {
    localStorage.setItem('theme', 'dark');
    applyInitialTheme();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('falls back to system preference when unset', () => {
    applyInitialTheme();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('setTheme writes attribute and persists', () => {
    setTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

- [ ] **Step 3: Run test, expect fail**

Run: `npm test`
Expected: FAIL — `theme.ts` does not exist yet.

- [ ] **Step 4: Implement `src/scripts/theme.ts`**

```ts
export type Theme = 'light' | 'dark';

export function applyInitialTheme(): void {
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.dataset.theme = stored;
    return;
  }
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}

export function toggleTheme(): void {
  const current = document.documentElement.dataset.theme as Theme;
  setTheme(current === 'dark' ? 'light' : 'dark');
}
```

- [ ] **Step 5: Run test, expect pass**

Run: `npm test`
Expected: 3 passed.

- [ ] **Step 6: Commit**

```bash
git add src/scripts/theme.ts tests/theme.test.ts vitest.config.ts
git commit -m "feat: theme bootstrap and toggle with tests"
```

---

## Task 5: Reveal-on-scroll script

Implement `src/scripts/reveal.ts`. One shared `IntersectionObserver` adds `.ws-in` to `[data-fade]` elements as they enter the viewport, honoring `data-delay` for staggered reveals, then unobserves.

**Files:**
- Create: `src/scripts/reveal.ts`
- Create: `tests/reveal.test.ts`

- [ ] **Step 1: Write the failing test `tests/reveal.test.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initReveal } from '../src/scripts/reveal';

class MockIO {
  callback: IntersectionObserverCallback;
  constructor(cb: IntersectionObserverCallback) { this.callback = cb; }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  fire(el: Element, isIntersecting: boolean) {
    this.callback([{ target: el, isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

describe('reveal', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it('adds ws-in class when element intersects', () => {
    const el = document.createElement('div');
    el.setAttribute('data-fade', '');
    document.body.appendChild(el);

    let mock!: MockIO;
    (globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
      vi.fn((cb: IntersectionObserverCallback) => { mock = new MockIO(cb); return mock as unknown as IntersectionObserver; }) as unknown as typeof IntersectionObserver;

    initReveal();
    expect(mock.observe).toHaveBeenCalledWith(el);
    mock.fire(el, true);
    expect(el.classList.contains('ws-in')).toBe(true);
    expect(mock.unobserve).toHaveBeenCalledWith(el);
  });
});
```

- [ ] **Step 2: Run test, expect fail**

Run: `npm test`
Expected: FAIL — `reveal.ts` does not exist.

- [ ] **Step 3: Implement `src/scripts/reveal.ts`**

```ts
export function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-fade]');
  if (els.length === 0) return;
  const io = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const delay = Number.parseInt(el.dataset.delay ?? '0', 10);
        if (delay > 0) {
          window.setTimeout(() => el.classList.add('ws-in'), delay);
        } else {
          el.classList.add('ws-in');
        }
        observer.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );
  els.forEach((el) => io.observe(el));
}
```

- [ ] **Step 4: Run test, expect pass**

Run: `npm test`
Expected: all passed.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/reveal.ts tests/reveal.test.ts
git commit -m "feat: reveal-on-scroll observer with test"
```

---

## Task 6: Static data — experience and skills

Lift the curated data from the design bundle's `data.jsx` into typed TypeScript modules. Add a snapshot-style test asserting counts and required fields.

**Files:**
- Create: `src/data/experience.ts`
- Create: `src/data/skills.ts`
- Create: `tests/data.test.ts`

- [ ] **Step 1: Write `src/data/experience.ts`**

```ts
export type Job = {
  company: string;
  role: string;
  range: string;
  location: string;
  summary: string;
};

export const EXPERIENCE: Job[] = [
  {
    company: 'Self-employed',
    role: 'Software Engineer (Freelance)',
    range: 'Oct 2025 — Present',
    location: 'Remote',
    summary:
      'Provide specialized full-stack engineering and consultation to four clients, building features in PHP, Laravel, and Vue.js. Drive product evolution end-to-end — from translating business requirements to resolving critical bugs in mission-critical applications.',
  },
  {
    company: 'Adeva',
    role: 'Senior Technical Lead',
    range: 'Aug 2021 — Aug 2025',
    location: 'Remote',
    summary:
      'Led a HealthTech initiative for clinical research, designing scalable Laravel/PostgreSQL APIs and HIPAA-aware data workflows. Implemented Auth0 SSO, refined microservices via GitHub Actions and Docker, and set engineering standards for testing and code review across distributed teams.',
  },
  {
    company: 'Modus Create',
    role: 'Senior Software Engineer / Team Lead',
    range: 'Oct 2016 — Aug 2021',
    location: 'Remote',
    summary:
      'Delivered scalable platforms in pharma and finance using PHP, Laravel, Vue.js, and MySQL — handling high-volume data ingestion from thousands of sites under regulatory compliance. Led Agile teams, built automated validation pipelines, and ran technical interviews for engineering hiring.',
  },
  {
    company: 'Fidelize',
    role: 'Senior Software Engineer',
    range: 'Feb 2015 — Oct 2016',
    location: 'Rio de Janeiro, Brazil',
    summary:
      'Optimized large-scale logistics software for pharmaceutical clients, redesigning architecture to support an 8× increase in data exchange capacity. Built an EDI integration tool connecting internal platforms to a global pharma logistics CRM.',
  },
  {
    company: 'Petaxxon Comunicação Online',
    role: 'Software Engineer',
    range: 'Aug 2012 — Jun 2014',
    location: 'Petrópolis, Brazil',
    summary:
      'Built and maintained the WebLetras platform and client sites with PHP, MySQL, and vanilla JS, focusing on usability, accessibility, and SEO. Strengthened full-stack and database skills through cross-functional collaboration.',
  },
  {
    company: 'Polaris Informática',
    role: 'Junior System Analyst',
    range: 'Jul 2009 — Sep 2009',
    location: 'Vitória, Brazil',
    summary:
      'Worked on enterprise authentication and IAM systems for Vale using Novell iChain, Access Manager, and Java — enabling SSO across mission-critical applications. Partnered with internal IT/security teams on integration and compliance.',
  },
  {
    company: 'Polaris Informática',
    role: 'Software Engineering Team Lead',
    range: 'Mar 2007 — Jun 2009',
    location: 'Vitória, Brazil',
    summary:
      'Led a cross-functional team delivering Java-based enterprise systems with Oracle and MS SQL Server, owning the full SDLC from requirements to deployment. Mentored developers and established Agile, code-review, and architecture standards.',
  },
  {
    company: 'LNCC',
    role: 'Software Engineer',
    range: 'Aug 2006 — Dec 2006',
    location: 'Petrópolis, Brazil',
    summary:
      'Built 3D craniofacial reconstruction software in C++/Qt/VTK for biomedical research, implementing image processing and mesh generation for prosthesis modeling. Collaborated with LNCC and USP São Carlos on CT-based reconstruction methods.',
  },
];
```

- [ ] **Step 2: Write `src/data/skills.ts`**

```ts
export type SkillGroup = { name: string; chips: string[] };

export const SKILLS: SkillGroup[] = [
  { name: 'Backend', chips: ['PHP', 'Laravel', 'Node.js', 'REST APIs', 'Microservices', 'OOP'] },
  { name: 'Frontend', chips: ['Vue.js', 'React', 'JavaScript', 'TypeScript', 'HTML/CSS'] },
  { name: 'Data & Integrations', chips: ['PostgreSQL', 'MySQL', 'Database Optimization', 'Auth0 / SSO', 'EDI'] },
  { name: 'Cloud & DevOps', chips: ['AWS', 'Docker', 'GitHub Actions', 'CI/CD', 'Unit Testing', 'Git'] },
  { name: 'Leadership & Process', chips: ['Agile / Scrum', 'Team Leadership', 'Mentorship', 'Code Review', 'Technical Interviews'] },
];
```

- [ ] **Step 3: Write `tests/data.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { EXPERIENCE } from '../src/data/experience';
import { SKILLS } from '../src/data/skills';

describe('experience', () => {
  it('has 8 entries', () => expect(EXPERIENCE).toHaveLength(8));
  it('every entry has all required fields filled', () => {
    for (const job of EXPERIENCE) {
      expect(job.company).toBeTruthy();
      expect(job.role).toBeTruthy();
      expect(job.range).toBeTruthy();
      expect(job.location).toBeTruthy();
      expect(job.summary).toBeTruthy();
    }
  });
});

describe('skills', () => {
  it('has 5 groups', () => expect(SKILLS).toHaveLength(5));
  it('every group has at least one chip', () => {
    for (const group of SKILLS) {
      expect(group.name).toBeTruthy();
      expect(group.chips.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all passed.

- [ ] **Step 5: Commit**

```bash
git add src/data tests/data.test.ts
git commit -m "feat: experience and skills data with shape tests"
```

---

## Task 7: Primitive components — Monogram, Eyebrow, Pill

Three tiny `.astro` components used throughout. Pure presentation, no client JS.

**Files:**
- Create: `src/components/Monogram.astro`
- Create: `src/components/Eyebrow.astro`
- Create: `src/components/Pill.astro`

- [ ] **Step 1: Write `src/components/Monogram.astro`**

```astro
---
type Props = { size?: number };
const { size = 28 } = Astro.props;
---
<span
  aria-hidden="true"
  style={`width:${size}px;height:${size}px;font-size:${size * 0.38}px;`}
  class="inline-flex items-center justify-center rounded-full font-semibold tracking-wide border border-[--color-accent] text-[--color-accent]"
>GW</span>
```

- [ ] **Step 2: Write `src/components/Eyebrow.astro`**

```astro
---
type Props = { color?: string };
const { color = 'var(--color-accent)' } = Astro.props;
---
<p
  style={`color:${color};`}
  class="m-0 text-[12px] font-medium uppercase tracking-[0.18em]"
><slot /></p>
```

- [ ] **Step 3: Write `src/components/Pill.astro`**

```astro
---
type Props = { primary?: boolean; href: string; external?: boolean };
const { primary = false, href, external = false } = Astro.props;
const target = external ? '_blank' : undefined;
const rel = external ? 'noopener' : undefined;
const cls = primary
  ? 'bg-[--color-ink] text-[--color-bg] border-[--color-ink]'
  : 'bg-transparent text-[--color-ink] border-[--color-border]';
---
<a
  href={href}
  target={target}
  rel={rel}
  class={`inline-flex items-center justify-center px-7 py-[14px] rounded-full text-sm font-medium no-underline transition-all border ${cls}`}
><slot /></a>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "feat: monogram, eyebrow, pill primitives"
```

---

## Task 8: ThemeToggle component

A button that flips the theme. Imports `toggleTheme` from `src/scripts/theme.ts` and wires the click handler. Astro's `<script>` tag (without `is:inline`) gets bundled and emitted as a hashed external file — CSP-clean.

**Files:**
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Write `src/components/ThemeToggle.astro`**

```astro
---
---
<button
  type="button"
  data-theme-toggle
  aria-label="Toggle theme"
  class="w-9 h-9 rounded-full border border-[--color-border] bg-transparent text-[--color-ink-muted] inline-flex items-center justify-center cursor-pointer"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
</button>

<script>
  import { toggleTheme } from '../scripts/theme';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => toggleTheme());
  });
</script>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success. The `<script>` is hoisted by Astro into a hashed `.js` file under `dist/_astro/`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ThemeToggle.astro
git commit -m "feat: theme toggle button"
```

---

## Task 9: Nav and Footer components

Sticky `Nav` (transparent → blurred-on-scroll) with internal-link list and `ThemeToggle`. `Footer` with copyright + GitHub/LinkedIn icon links.

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Nav.astro`**

```astro
---
import Monogram from './Monogram.astro';
import ThemeToggle from './ThemeToggle.astro';

const links = [
  { href: '#hero', label: 'Home' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#blog', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
];
const home = `${import.meta.env.BASE_URL}`;
---
<header data-nav class="sticky top-0 z-50 transition-all border-b border-transparent">
  <nav class="max-w-[1024px] mx-auto px-8 py-[18px] flex items-center justify-between">
    <a href={home} class="inline-flex items-center gap-[10px] text-[--color-ink] no-underline text-sm font-semibold tracking-tight">
      <Monogram size={26} />
      <span class="hidden sm:inline">Gustavo Weinschütz</span>
    </a>
    <ul class="hidden sm:flex items-center gap-8 m-0 p-0 list-none">
      {links.map((l) => (
        <li>
          <a href={l.href} class="text-sm text-[--color-ink-muted] no-underline hover:text-[--color-ink] transition-colors">{l.label}</a>
        </li>
      ))}
      <li><ThemeToggle /></li>
    </ul>
    <div class="sm:hidden"><ThemeToggle /></div>
  </nav>
</header>

<style>
  header[data-nav].is-scrolled {
    background: color-mix(in oklab, var(--color-bg) 85%, transparent);
    backdrop-filter: blur(8px);
    border-bottom-color: var(--color-border);
  }
</style>

<script>
  const nav = document.querySelector<HTMLElement>('header[data-nav]');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
</script>
```

- [ ] **Step 2: Write `src/components/Footer.astro`**

```astro
---
---
<footer class="border-t border-[--color-border] mt-24">
  <div class="max-w-[1024px] mx-auto px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-xs text-[--color-ink-muted] m-0">© 2026 Gustavo Weinschütz</p>
    <ul class="flex gap-4 list-none m-0 p-0 text-[--color-ink-muted]">
      <li>
        <a href="https://github.com/gpweins" aria-label="GitHub" class="text-current">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.97-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.95 10.95 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.02 2.81-.02 3.19 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"/>
          </svg>
        </a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/gpweins/" aria-label="LinkedIn" class="text-current">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"/>
          </svg>
        </a>
      </li>
    </ul>
  </div>
</footer>
```

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro
git commit -m "feat: nav and footer"
```

---

## Task 10: Base layout

`Base.astro` is the page wrapper for every route — `<html>`, `<head>` (CSP, meta, Inter, theme bootstrap), `<body>` containing `<Nav>`, `<slot>`, `<Footer>`, and the reveal-on-scroll bootstrap.

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Write `src/layouts/Base.astro`**

```astro
---
import '../styles/main.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

type Props = {
  title: string;
  description?: string;
  canonical?: string;
};

const { title, description = 'Senior software engineer · 15+ years building scalable systems.', canonical } = Astro.props;
const siteUrl = new URL(Astro.url.pathname, Astro.site).toString();
const canonicalUrl = canonical ?? siteUrl;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self' https://rsms.me; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    <script>
      import { applyInitialTheme } from '../scripts/theme';
      applyInitialTheme();
    </script>
  </head>
  <body>
    <Nav />
    <main><slot /></main>
    <Footer />

    <script>
      import { initReveal } from '../scripts/reveal';
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initReveal());
      } else {
        initReveal();
      }
    </script>
  </body>
</html>
```

- [ ] **Step 2: Update stub `src/pages/index.astro` to use Base**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Weinschutz">
  <p>placeholder</p>
</Base>
```

- [ ] **Step 3: Build to verify CSP meta is in output**

Run: `npm run build && grep -o "Content-Security-Policy" dist/index.html`
Expected: build succeeds; grep finds the CSP meta tag.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro src/pages/index.astro
git commit -m "feat: base layout with csp and theme bootstrap"
```

---

## Task 11: Hero section

The `stacked` variant hero — eyebrow, two-line h1, compiled tagline, two pills.

**Files:**
- Create: `src/sections/Hero.astro`

- [ ] **Step 1: Write `src/sections/Hero.astro`**

```astro
---
import Eyebrow from '../components/Eyebrow.astro';
import Pill from '../components/Pill.astro';

const resumeHref = `${import.meta.env.BASE_URL}resume.pdf`;
---
<section id="hero" class="relative min-h-[720px] flex items-center px-8">
  <div class="max-w-[1024px] mx-auto w-full" data-fade>
    <Eyebrow>Senior Software Engineer</Eyebrow>
    <h1 class="m-0 mt-6 mb-8 text-[112px] leading-[0.95] font-bold tracking-tight text-[--color-ink] max-[640px]:text-[56px]">
      Gustavo<br />Weinschütz
    </h1>
    <p class="max-w-[520px] text-[18px] leading-[1.6] text-[--color-ink-muted] m-0 mb-10">
      Senior full stack engineer with 15+ years building scalable systems across healthtech, pharma, finance, and logistics. Backend specialist in PHP and Laravel, with strong experience in Vue, PostgreSQL, and CI/CD.
    </p>
    <div class="flex gap-3 flex-col sm:flex-row">
      <Pill primary href="#contact">Book a Call</Pill>
      <Pill href={resumeHref}>Download Resume</Pill>
    </div>
  </div>
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-[--color-ink-muted] hidden sm:block">↓ Scroll</div>
</section>
```

- [ ] **Step 2: Wire into the home page**

Replace `src/pages/index.astro` with:

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../sections/Hero.astro';
---
<Base title="Weinschutz · Senior Software Engineer">
  <Hero />
</Base>
```

- [ ] **Step 3: Build and check**

Run: `npm run build && grep -c "Gustavo" dist/index.html`
Expected: build succeeds; grep returns ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/sections/Hero.astro src/pages/index.astro
git commit -m "feat: hero section"
```

---

## Task 12: Experience section

Left-rail timeline. Header is just an eyebrow + descriptor (no h2). One `<li>` per `EXPERIENCE` entry with accent dot + card.

**Files:**
- Create: `src/sections/Experience.astro`

- [ ] **Step 1: Write `src/sections/Experience.astro`**

```astro
---
import Eyebrow from '../components/Eyebrow.astro';
import { EXPERIENCE } from '../data/experience';
---
<section id="experience" class="px-8 py-32 max-[640px]:py-16 max-[640px]:px-5">
  <div class="max-w-[1024px] mx-auto">
    <header class="mb-16 max-[640px]:mb-10" data-fade>
      <Eyebrow>Experience</Eyebrow>
      <p class="mt-3 max-w-[520px] text-[--color-ink-muted] text-[15px] m-0">
        Healthtech, pharma, finance, logistics, and CRM.
      </p>
    </header>
    <ol class="relative list-none p-0 m-0 ml-4 pl-11 border-l border-[--color-border] max-[640px]:ml-2 max-[640px]:pl-7">
      {EXPERIENCE.map((entry, i) => (
        <li class="relative mb-10" data-fade data-delay={i * 60}>
          <span aria-hidden="true" class="absolute top-2 -left-[50px] w-[10px] h-[10px] rounded-full bg-[--color-accent] max-[640px]:-left-[34px]"></span>
          <p class="m-0 mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[--color-accent]">{entry.range}</p>
          <article class="rounded-2xl border border-[--color-border] bg-[--color-bg-sub] p-6 max-[640px]:p-[18px]">
            <h3 class="m-0 text-[18px] font-semibold text-[--color-ink] max-[640px]:text-[16px]">{entry.role}</h3>
            <p class="m-0 mt-1 mb-3 text-[13px] font-medium text-[--color-accent-2]">
              {entry.company}{entry.location ? ` · ${entry.location}` : ''}
            </p>
            <p class="m-0 text-[14px] leading-[1.6] text-[--color-ink-muted]">{entry.summary}</p>
          </article>
        </li>
      ))}
    </ol>
  </div>
</section>
```

- [ ] **Step 2: Add to home page**

Edit `src/pages/index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../sections/Hero.astro';
import Experience from '../sections/Experience.astro';
---
<Base title="Weinschutz · Senior Software Engineer">
  <Hero />
  <Experience />
</Base>
```

- [ ] **Step 3: Build and check**

Run: `npm run build && grep -c "Adeva" dist/index.html`
Expected: build succeeds; grep ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/sections/Experience.astro src/pages/index.astro
git commit -m "feat: experience timeline section"
```

---

## Task 13: Skills section

`bg-sub` band. Eyebrow only header (no h2). 3-col grid (1-col compact) of chip groups.

**Files:**
- Create: `src/sections/Skills.astro`

- [ ] **Step 1: Write `src/sections/Skills.astro`**

```astro
---
import Eyebrow from '../components/Eyebrow.astro';
import { SKILLS } from '../data/skills';
---
<section id="skills" class="px-8 py-32 bg-[--color-bg-sub] max-[640px]:py-16 max-[640px]:px-5">
  <div class="max-w-[1024px] mx-auto">
    <header class="mb-12 max-[640px]:mb-8" data-fade>
      <Eyebrow>Skills</Eyebrow>
    </header>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-10">
      {SKILLS.map((g, i) => (
        <div data-fade data-delay={i * 80}>
          <h3 class="m-0 mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[--color-accent-2]">{g.name}</h3>
          <ul class="flex flex-wrap gap-2 list-none p-0 m-0">
            {g.chips.map((c) => (
              <li class="rounded-full border border-[--color-border] bg-[--color-bg] px-3 py-[6px] text-xs text-[--color-ink]">{c}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to home page**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../sections/Hero.astro';
import Experience from '../sections/Experience.astro';
import Skills from '../sections/Skills.astro';
---
<Base title="Weinschutz · Senior Software Engineer">
  <Hero />
  <Experience />
  <Skills />
</Base>
```

- [ ] **Step 3: Build and check**

Run: `npm run build && grep -c "Laravel" dist/index.html`
Expected: build succeeds; grep ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/sections/Skills.astro src/pages/index.astro
git commit -m "feat: skills section"
```

---

## Task 14: Blog content collection schema

Define the `blog` collection with the Astro 5 Content Layer API + glob loader. Once defined, build will fail loud on any malformed frontmatter — that's our schema test.

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Write `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    linkedinUrl: z.string().url().optional(),
    headerImage: z.string().optional(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Verify build still works (collection is empty)**

Run: `npm run build`
Expected: success; no posts yet, but no error.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: blog content collection schema"
```

---

## Task 15: First blog post and image

Copy the post from `reference/`, fix the frontmatter quirk, put the image in `public/blog/`.

**Files:**
- Create: `src/content/blog/science-of-silence.md`
- Create: `public/blog/science-of-silence.png`

- [ ] **Step 1: Copy the image**

```bash
mkdir -p public/blog
cp /Users/gpweins/Projects/weinschutz/reference/science-of-silence.png public/blog/science-of-silence.png
```

- [ ] **Step 2: Write the corrected post `src/content/blog/science-of-silence.md`**

```markdown
---
title: "The Science of Silence: Why Your Best Ideas Might Be Stuck in 'Dead Air'"
date: 2026-04-21
excerpt: "How cultural conversational rhythms quietly silence your team's best ideas — and what introverted leadership can do about it."
linkedinUrl: "https://www.linkedin.com/pulse/science-silence-why-your-best-ideas-might-stuck-dead-air-weinsch%C3%BCtz-qtigf/"
headerImage: "science-of-silence.png"
---

It is fascinating to realize that what we often dismiss as personality or introversion is frequently a byproduct of cultural programming. I recently watched a video by Erin Meyer that put a scientific label on a feeling I have carried for years regarding the conversational gap.

She breaks down how different cultures view the silence between speakers. As a Brazilian, I grew up in a culture where overlapping speech is the norm. In many Latin American circles, speaking simultaneously is actually a sign of passion and engagement. However, she also highlights the Anglo-Saxon ping-pong style where people avoid both overlap and silence, and the pause pattern common in East Asian or Nordic cultures, where a respectful gap is required before the next person speaks.

In a global meeting, the people waiting for that pause often lose. They are waiting for an opening that never comes because the rest of the room has already filled the air.

As an introvert, I have always been a bit of an exception to the rule in my own culture. I tend to avoid trumping other people's speech, which meant that in diverse technical teams, I frequently stayed quiet. I was waiting for a polite space to jump in that simply didn't exist in the rhythm of the room. I was essentially being out-tempoed by the conversational habits of the group.

When I moved into leadership, the stakes changed. My input became a requirement, but I soon sensed a new problem. Even as an introvert, I had inadvertently become the one silencing others just by finding my own voice. Understanding now that this phenomenon is backed by communication science is a strange but validating revelation. It confirms that good communication is not a one-size-fits-all metric.

To manage this noise, I have made 1-on-1s a non-negotiable part of my leadership style. It is the best way to remove the group pressure and hear ideas that might otherwise get buried. In group settings, I now see it as my job to act as a facilitator who actively gives the floor. If I know a teammate has a brilliant perspective but is waiting for a silence that will never arrive, I step in to create that space for them.

Leadership is not about having the loudest voice in the room. It is about understanding these different conversational rhythms so that the best ideas actually make it to the table.

How do you handle these gaps in your own meetings? Have you ever realized you were accidentally silencing someone just by following your own rhythm?

---

**You can watch Erin Meyer's full explanation of these cultural communication patterns on YouTube here:** [Don't assume silence is awkward if you want inclusive international meetings](http://www.youtube.com/watch?v=9NCc0gqOfAY)
```

- [ ] **Step 3: Verify schema validates and build succeeds**

Run: `npm run build`
Expected: build succeeds. If frontmatter is invalid, Astro reports the exact field.

- [ ] **Step 4: Commit**

```bash
git add src/content/blog/science-of-silence.md public/blog/science-of-silence.png
git commit -m "feat: first blog post and header image"
```

---

## Task 16: BlogPreview section

3-card grid showing the latest 3 posts. If fewer than 3 exist, the leftover slot becomes a dashed "More on the way" card.

**Files:**
- Create: `src/sections/BlogPreview.astro`

- [ ] **Step 1: Write `src/sections/BlogPreview.astro`**

```astro
---
import Eyebrow from '../components/Eyebrow.astro';
import { getCollection } from 'astro:content';

const all = await getCollection('blog');
const sorted = all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const articles = sorted.slice(0, 3);
const fmt = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });
const fillerSpan = 3 - articles.length;
const base = import.meta.env.BASE_URL;
---
<section id="blog" class="px-8 py-32 max-[640px]:py-16 max-[640px]:px-5">
  <div class="max-w-[1024px] mx-auto">
    <header class="mb-12 flex items-end justify-between gap-6 max-[640px]:mb-8" data-fade>
      <div>
        <Eyebrow>Writing</Eyebrow>
        <h2 class="m-0 mt-3 text-[40px] font-bold tracking-tight text-[--color-ink] max-[640px]:text-[28px]">Recent articles</h2>
      </div>
      <a href={`${base}blog`} class="hidden sm:inline text-sm text-[--color-accent-2] no-underline">View all articles →</a>
    </header>
    <ul class="grid grid-cols-1 sm:grid-cols-3 gap-6 list-none p-0 m-0">
      {articles.map((a, i) => (
        <li class="rounded-2xl border border-[--color-border] bg-[--color-bg-sub] p-6 transition-colors" data-fade data-delay={i * 80}>
          <a href={`${base}blog/${a.id}`} class="block text-inherit no-underline">
            <p class="m-0 mb-3 text-[11px] uppercase tracking-[0.16em] text-[--color-accent]">{fmt.format(a.data.date)}</p>
            <h3 class="m-0 mb-2 text-[15px] font-semibold leading-snug text-[--color-ink]">{a.data.title}</h3>
            <p class="m-0 text-[13px] leading-[1.55] text-[--color-ink-muted] line-clamp-3">{a.data.excerpt}</p>
            <p class="mt-4 text-xs text-[--color-accent-2] m-0">Read →</p>
          </a>
        </li>
      ))}
      {fillerSpan > 0 && (
        <li class={`rounded-2xl border border-dashed border-[--color-border] p-6 flex items-center justify-center min-h-[160px] sm:col-span-${fillerSpan}`}>
          <a href={`${base}blog`} class="text-[13px] text-[--color-ink-muted] no-underline text-center">
            More on the way.<br />
            <span class="text-[--color-accent-2]">View archive →</span>
          </a>
        </li>
      )}
    </ul>
  </div>
</section>
```

Tailwind v4 ships `line-clamp-*` utilities by default — no plugin needed.

- [ ] **Step 2: Add to home page**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../sections/Hero.astro';
import Experience from '../sections/Experience.astro';
import Skills from '../sections/Skills.astro';
import BlogPreview from '../sections/BlogPreview.astro';
---
<Base title="Weinschutz · Senior Software Engineer">
  <Hero />
  <Experience />
  <Skills />
  <BlogPreview />
</Base>
```

- [ ] **Step 3: Build and check**

Run: `npm run build && grep -c "Science of Silence" dist/index.html`
Expected: build succeeds; grep ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/sections/BlogPreview.astro src/pages/index.astro
git commit -m "feat: blog preview section"
```

---

## Task 17: Contact section

`bg-sub` band, header copy as updated in the spec, single primary `Pill` linking to `https://cal.com/gpweins`.

**Files:**
- Create: `src/sections/Contact.astro`

- [ ] **Step 1: Write `src/sections/Contact.astro`**

```astro
---
import Eyebrow from '../components/Eyebrow.astro';
import Pill from '../components/Pill.astro';
---
<section id="contact" class="px-8 py-32 bg-[--color-bg-sub] max-[640px]:py-16 max-[640px]:px-5">
  <div class="max-w-[1024px] mx-auto">
    <header class="mb-10" data-fade>
      <Eyebrow>Contact</Eyebrow>
      <h2 class="m-0 mt-3 text-[40px] font-bold tracking-tight text-[--color-ink] max-[640px]:text-[28px]">Let's talk.</h2>
      <p class="m-0 mt-3 max-w-[520px] text-[--color-ink-muted] text-[15px]">
        Click the button below to book a 30 minute intro call on my Cal.com page.
      </p>
    </header>
    <div data-fade>
      <Pill primary href="https://cal.com/gpweins" external>Book a Call on Cal.com →</Pill>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to home page (final composition)**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../sections/Hero.astro';
import Experience from '../sections/Experience.astro';
import Skills from '../sections/Skills.astro';
import BlogPreview from '../sections/BlogPreview.astro';
import Contact from '../sections/Contact.astro';
---
<Base title="Weinschutz · Senior Software Engineer">
  <Hero />
  <Experience />
  <Skills />
  <BlogPreview />
  <Contact />
</Base>
```

- [ ] **Step 3: Build and check**

Run: `npm run build && grep -c "cal.com/gpweins" dist/index.html`
Expected: ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/sections/Contact.astro src/pages/index.astro
git commit -m "feat: contact section with cal.com cta"
```

---

## Task 18: Blog index page (`/blog`)

Chronological list of posts; max-width 768px; one row per post.

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Write `src/pages/blog/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import Eyebrow from '../../components/Eyebrow.astro';
import { getCollection } from 'astro:content';

const all = await getCollection('blog');
const articles = all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const fmt = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });
const base = import.meta.env.BASE_URL;
---
<Base title="Articles · Weinschutz" description="Notes on engineering leadership, communication, and the craft of building software.">
  <div class="max-w-[768px] mx-auto px-8 py-20 max-[640px]:py-10 max-[640px]:px-5">
    <header class="mb-14 max-[640px]:mb-8" data-fade>
      <Eyebrow>Writing</Eyebrow>
      <h1 class="m-0 mt-3 text-[48px] font-bold tracking-tight text-[--color-ink] max-[640px]:text-[32px]">Articles</h1>
      <p class="m-0 mt-4 text-base text-[--color-ink-muted] leading-[1.55]">
        Notes on engineering leadership, communication, and the craft of building software.
      </p>
    </header>
    <ul class="list-none p-0 m-0 grid gap-1">
      {articles.map((a, i) => (
        <li data-fade data-delay={i * 60}>
          <a href={`${base}blog/${a.id}`} class="block py-7 border-b border-[--color-border] no-underline text-inherit">
            <p class="m-0 mb-[10px] text-[11px] uppercase tracking-[0.16em] text-[--color-accent]">{fmt.format(a.data.date)}</p>
            <h2 class="m-0 mb-[10px] text-[24px] font-semibold leading-tight tracking-tight text-[--color-ink] max-[640px]:text-[20px]">{a.data.title}</h2>
            <p class="m-0 text-[15px] leading-[1.6] text-[--color-ink-muted] max-w-[620px]">{a.data.excerpt}</p>
          </a>
        </li>
      ))}
    </ul>
  </div>
</Base>
```

- [ ] **Step 2: Build and check**

Run: `npm run build && test -f dist/blog/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: blog index page"
```

---

## Task 19: Blog post page (`/blog/[slug]`)

Single post layout with prev/next nav, optional `headerImage`, optional LinkedIn link.

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Write `src/pages/blog/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return sorted.map((post, i) => ({
    params: { slug: post.id },
    props: {
      post,
      prev: sorted[i + 1] ?? null,
      next: sorted[i - 1] ?? null,
    },
  }));
}

type Props = {
  post: CollectionEntry<'blog'>;
  prev: CollectionEntry<'blog'> | null;
  next: CollectionEntry<'blog'> | null;
};
const { post, prev, next } = Astro.props as Props;
const { Content } = await render(post);
const fmt = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });
const base = import.meta.env.BASE_URL;
const headerImageSrc = post.data.headerImage
  ? `${base}blog/${post.data.headerImage}`
  : null;
---
<Base title={`${post.data.title} · Weinschutz`} description={post.data.excerpt}>
  <article class="max-w-[720px] mx-auto px-8 py-16 max-[640px]:py-8 max-[640px]:px-5">
    <a href={`${base}blog`} class="inline-flex items-center gap-[6px] text-[13px] text-[--color-accent-2] no-underline mb-8" data-fade>← Back to writing</a>

    <header class="mb-10" data-fade>
      <p class="m-0 mb-[14px] text-[11px] uppercase tracking-[0.16em] text-[--color-accent]">{fmt.format(post.data.date)}</p>
      <h1 class="m-0 mb-[18px] text-[40px] font-bold tracking-tight leading-tight text-[--color-ink] max-[640px]:text-[28px]">{post.data.title}</h1>
      {post.data.linkedinUrl && (
        <a href={post.data.linkedinUrl} class="inline-flex items-center gap-2 text-[13px] text-[--color-accent-2] no-underline" target="_blank" rel="noopener">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"/></svg>
          Originally on LinkedIn →
        </a>
      )}
    </header>

    {headerImageSrc && (
      <img src={headerImageSrc} alt="" class="w-full rounded-2xl mb-10" data-fade />
    )}

    <div class="prose-body text-[17px] leading-[1.75] text-[--color-ink] max-[640px]:text-[16px]" data-fade data-delay="120">
      <Content />
    </div>

    <nav class="mt-14 pt-8 border-t border-[--color-border] flex justify-between gap-4 text-[13px]">
      {prev ? (
        <a href={`${base}blog/${prev.id}`} class="text-[--color-accent-2] no-underline">← {prev.data.title}</a>
      ) : (
        <span class="text-[--color-ink-muted] opacity-40">← Previous</span>
      )}
      {next ? (
        <a href={`${base}blog/${next.id}`} class="text-[--color-accent-2] no-underline text-right">{next.data.title} →</a>
      ) : (
        <span class="text-[--color-ink-muted] opacity-40">Next →</span>
      )}
    </nav>
  </article>
</Base>

<style>
  .prose-body :global(p) { margin: 0 0 24px; }
  .prose-body :global(p:last-child) { margin-bottom: 0; }
  .prose-body :global(a) { color: var(--color-accent-2); }
  .prose-body :global(hr) {
    border: 0;
    border-top: 1px solid var(--color-border);
    margin: 32px 0;
  }
  .prose-body :global(strong) { color: var(--color-ink); }
</style>
```

- [ ] **Step 2: Build and check**

Run: `npm run build && test -f dist/blog/science-of-silence/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/\[slug\].astro
git commit -m "feat: blog post page with prev/next"
```

---

## Task 20: 404 page and public assets

Minimal `404.astro` and the static files served from `public/`.

**Files:**
- Create: `src/pages/404.astro`
- Create: `public/favicon.svg`
- Create: `public/robots.txt`

- [ ] **Step 1: Write `src/pages/404.astro`**

```astro
---
import Base from '../layouts/Base.astro';
const base = import.meta.env.BASE_URL;
---
<Base title="Not found · Weinschutz">
  <section class="max-w-[640px] mx-auto px-8 py-32 text-center">
    <p class="m-0 text-[11px] uppercase tracking-[0.18em] text-[--color-accent]">404</p>
    <h1 class="m-0 mt-3 text-[48px] font-bold tracking-tight text-[--color-ink]">Page not found</h1>
    <p class="m-0 mt-4 text-[--color-ink-muted]">The page you were looking for doesn't exist.</p>
    <a href={base} class="inline-block mt-8 text-[--color-accent-2] no-underline">← Back home</a>
  </section>
</Base>
```

- [ ] **Step 2: Write `public/favicon.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="none" stroke="#3f7062" stroke-width="2"/><text x="16" y="21" text-anchor="middle" font-family="ui-sans-serif,system-ui" font-size="12" font-weight="600" fill="#3f7062">GW</text></svg>
```

- [ ] **Step 3: Write `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://gpweins.github.io/weinschutz/sitemap-index.xml
```

- [ ] **Step 4: Build and check**

Run: `npm run build && test -f dist/404.html && test -f dist/favicon.svg && test -f dist/robots.txt && echo OK`
Expected: prints `OK`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/404.astro public/favicon.svg public/robots.txt
git commit -m "feat: 404 page, favicon, robots"
```

---

## Task 21: GitHub Actions deploy workflow

`deploy.yml` builds on push to `main` and publishes to GitHub Pages via Actions.

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm test
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: github pages deploy workflow"
```

---

## Task 22: CLAUDE.md and README.md

Lean `CLAUDE.md` (only the non-obvious bits) and a brief `README.md` with the one-time GitHub Pages setup step.

**Files:**
- Create: `CLAUDE.md`
- Create: `README.md`

- [ ] **Step 1: Write `CLAUDE.md`**

```markdown
# CLAUDE.md

Guidance for Claude Code working in this repository.

## Commands

`​`​`bash
npm run dev       # astro dev on :4321
npm run build     # static build → dist/
npm run preview   # serve dist/ on :4321
npm run check     # astro check (typecheck + content schema)
npm test          # vitest run
`​`​`

Node 24 required (CI and `engines.node` enforce this).

## Architecture (the non-obvious bits)

- **Astro 5, `output: 'static'`.** Every route prerendered at build time. No SSR adapter, no edge runtime.
- **Base path is `/weinschutz/`.** Every internal link must use `import.meta.env.BASE_URL` (e.g. `${import.meta.env.BASE_URL}blog/${slug}`). Bare `/foo` will 404 on GitHub Pages.
- **Strict CSP.** `Base.astro` ships a `<meta http-equiv="Content-Security-Policy">` tag that disallows `'unsafe-eval'`, `'wasm-unsafe-eval'`, and inline `<script>`/`<style>`. Astro's `<script>` tags (without `is:inline`) get bundled into hashed external `.js` files — safe. **Never add `is:inline` scripts.**
- **Cal.com is a static link**, not an embed. The `@calcom/embed-snippet` SDK requires loosening CSP and broke the previous attempt. Don't reintroduce it; the Contact section uses an `<a>` to `https://cal.com/gpweins`.
- **Blog posts live in `src/content/blog/*.md`.** Schema enforced by `src/content.config.ts`. Adding a post = drop a `.md` file with `title`, `date`, `excerpt` (and optionally `linkedinUrl`, `headerImage`). It auto-appears in `BlogPreview` (top 3), `/blog`, and `/blog/<slug>`.
- **Theme tokens live in `src/styles/main.css`** under `@theme { … }` and `html[data-theme="dark"]`. Tailwind v4 reads them. Don't add a JS Tailwind config.
- **Theme bootstrap** (`src/scripts/theme.ts`) runs in `<head>` to avoid FOUC. Reveal-on-scroll (`src/scripts/reveal.ts`) runs after DOMContentLoaded.

## Adding a blog article

`​`​`bash
# Create src/content/blog/<slug>.md with frontmatter:
#   title (string), date (YYYY-MM-DD), excerpt (string)
#   linkedinUrl (optional URL), headerImage (optional filename in public/blog/)
`​`​`

## Reference

- Spec: `docs/superpowers/specs/2026-04-27-portfolio-design.md`
- Plan: `docs/superpowers/plans/2026-04-27-portfolio.md`
- Original design bundle (gitignored): `reference/Weinschutz_files/*.jsx` — read at design time only; never imported at runtime.
```

(In the actual file, the placeholder ​ characters between the backticks are zero-width spaces inserted only so this nested code block displays in the plan. The actual `CLAUDE.md` should have plain triple backticks without those characters. Strip them on save.)

- [ ] **Step 2: Write `README.md`**

```markdown
# weinschutz

Portfolio site at https://gpweins.github.io/weinschutz/.

## Develop

`​`​`bash
npm install
npm run dev
`​`​`

## Build

`​`​`bash
npm run build
`​`​`

## Deploy

Pushes to `main` deploy automatically via `.github/workflows/deploy.yml`.

**One-time setup:** Repo → Settings → Pages → Source: **GitHub Actions**.

## Add a blog post

Drop a Markdown file in `src/content/blog/`. See `CLAUDE.md` for the frontmatter schema.
```

(Same note as above: strip the zero-width spaces from the backtick fences.)

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md README.md
git commit -m "docs: claude.md and readme"
```

---

## Task 23: Final verification

Build the site clean, run all checks, and grep the output for the markers that prove every section landed.

- [ ] **Step 1: Clean build**

```bash
rm -rf dist
npm run check
npm test
npm run build
```
Expected: all green; `dist/` populated.

- [ ] **Step 2: Verify all expected files**

```bash
test -f dist/index.html && \
test -f dist/blog/index.html && \
test -f dist/blog/science-of-silence/index.html && \
test -f dist/404.html && \
test -f dist/sitemap-index.xml && \
test -f dist/favicon.svg && \
test -f dist/robots.txt && \
test -f dist/blog/science-of-silence.png && \
echo OK
```
Expected: prints `OK`.

- [ ] **Step 3: Verify CSP and content markers in `dist/index.html`**

```bash
grep -q "Content-Security-Policy" dist/index.html && \
grep -q "Gustavo" dist/index.html && \
grep -q "Adeva" dist/index.html && \
grep -q "Laravel" dist/index.html && \
grep -q "Science of Silence" dist/index.html && \
grep -q "cal.com/gpweins" dist/index.html && \
echo OK
```
Expected: prints `OK`.

- [ ] **Step 4: Verify no inline scripts leaked into built HTML**

```bash
# Look for <script> tags whose opening tag has no `src=` attribute and contain content other than JSON-LD.
# Astro hoists module scripts into hashed src files; the only acceptable inline blocks are <script type="application/ld+json">.
violations=$(grep -REo '<script[^>]*>[^<]+' dist/ | grep -v 'src=' | grep -v 'application/ld+json' || true)
if [ -n "$violations" ]; then echo "FAIL: inline script(s) found:"; echo "$violations"; exit 1; fi
echo OK
```
Expected: prints `OK`.

- [ ] **Step 5: Manual smoke test**

Run: `npm run preview`
Open `http://localhost:4321/weinschutz/` in a browser.

Verify in order:
1. Hero shows "Gustavo Weinschütz" + tagline + two pills.
2. Experience section: 8 entries, each with company / role / range / location / summary.
3. Skills section: 5 chip groups.
4. Blog preview: "Science of Silence" card + dashed "More on the way" filler.
5. Contact: single "Book a Call on Cal.com →" button → opens cal.com/gpweins in a new tab.
6. Footer: GitHub + LinkedIn icons clickable.
7. Theme toggle flips light ↔ dark; refresh persists choice.
8. `/blog` lists the post; clicking opens `/blog/science-of-silence/`.
9. Browser DevTools Console: zero errors, zero CSP violations.

- [ ] **Step 6: Commit any final fixes**

If the smoke test surfaced anything to fix, fix it and commit:

```bash
git add -A
git commit -m "fix: smoke-test corrections"
```

---

## Self-Review (already performed)

**Spec coverage:** Every spec section maps to one or more tasks above — Stack/Build (T2, T21), CSP (T10), File layout (T2 + each subsequent task), Tokens (T3), Hero/Experience/Skills/BlogPreview/Contact (T11–T17), Blog schema/post/index/post-page (T14, T15, T18, T19), Theme switching (T4, T8, T10), Motion (T3, T5), SEO (T10, T20), CLAUDE.md (T22), Deployment (T21).

**Placeholder scan:** No "TBD"/"TODO"/"add appropriate X" left.

**Type consistency:** `Job`, `SkillGroup`, `Theme` are defined once and used consistently. `applyInitialTheme`/`setTheme`/`toggleTheme` names match between `theme.ts`, `theme.test.ts`, and `ThemeToggle.astro`. `initReveal` matches between `reveal.ts`, `reveal.test.ts`, and `Base.astro`.
