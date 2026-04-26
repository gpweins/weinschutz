# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Vite dev server on :5173
npm run build            # vite-ssg static build → dist/
npm run preview          # serve dist/ on :4173
npm test                 # vitest run (one-shot)
npm run test:watch       # vitest watch
npm test -- <pattern>    # run a subset, e.g. `npm test -- useTheme`
npm run typecheck        # vue-tsc --noEmit
```

The build script is `vite-ssg build`, **not** `vite build` — bypassing it skips static pre-rendering and breaks deployment.

## Architecture

### Pre-rendering, not SPA-only

The site is a Vue SPA, but the production build pre-renders every route to its own HTML file via `vite-ssg`. `src/main.ts` exports `createApp = ViteSSG(App, { routes }, ({ app }) => app.use(...))` — it does **not** mount directly. To register a Vue plugin (Pinia, Motion, etc.), add it inside that setup callback so it works in both the client and SSG passes.

### Dynamic blog routes are enumerated in `vite.config.ts`

`/blog/:slug` is a parameterized route in `src/router.ts`. To prerender one HTML per article, `vite.config.ts` uses `ssgOptions.includedRoutes` to expand the parameterized path into concrete slugs.

That callback runs in **plain Node, outside Vite's module graph** — it cannot use `import.meta.glob` or `@/*` aliases. It reads `content/blog/*.md` filenames directly with `node:fs`. If you change how articles are stored, update both `src/content/articles.ts` (Vite/runtime side) and the `includedRoutes` callback (Node/build side).

### Articles are precompiled via a Vite virtual module

`src/content/articles.ts` re-exports `articles` from `'virtual:articles'`. The actual parsing (YAML frontmatter via `js-yaml`, markdown via `markdown-it`, syntax highlighting via Shiki/Oniguruma) lives in `src/content/articles-parser.ts` and runs **only in Node** — invoked by the `articlesPrecompile()` plugin in `vite.config.ts`. The plugin reads `content/blog/*.md`, runs the pipeline once at build time, and emits a single `export const articles = [...]` JSON literal.

Consequences:
- Client bundle contains **zero** parser code — no `js-yaml`, no `markdown-it`, no Shiki, no `WebAssembly.instantiate`. Strict CSPs (no `'unsafe-eval'`, no `'wasm-unsafe-eval'`) work out of the box.
- `js-yaml`, `markdown-it`, `shiki`, `@shikijs/*` are devDependencies — they never ship to users.
- Tests import `loadArticlesFromRaw` from `articles-parser.ts` directly (the parser is exercised in Node test env).
- The dev server invalidates `virtual:articles` on any `content/blog/*.md` change and triggers a full reload.
- The Vite/esbuild target is still ES2022 (some chunks use top-level await elsewhere); don't drop below it.

### Theme is a module-level singleton

`src/composables/useTheme.ts` declares `const theme = ref(readInitial())` at module scope. Every `useTheme()` call shares the same ref, and the initial read runs **once** when the module first loads.

Tests must `vi.resetModules()` and use dynamic `import()` to exercise different initial states — `beforeEach` setup of `localStorage`/`matchMedia` after the module has already loaded has no effect. See `tests/composables/useTheme.test.ts` for the pattern.

### Per-route head/SEO via @unhead/vue

Each page in `src/pages/` calls `useHead({ title, meta, link })`. vite-ssg renders these into the static HTML at build time, so each prerendered page gets unique `<title>`, OG tags, and `<link rel="canonical">`. `BlogPost.vue` wraps `useHead` in `watchEffect` so the head updates when the route param changes during client-side navigation.

### Theming via CSS custom properties + Tailwind v4

Design tokens live in `src/styles/main.css` under `@theme { ... }` (Tailwind v4 CSS-first config). Dark mode is opt-in via `[data-theme="dark"]` on `<html>`, toggled by `useTheme`. Components reference tokens through Tailwind's arbitrary-value syntax: `text-[--color-ink]`, `bg-[--color-bg-sub]`, `border-[--color-border]`. Don't add a JS Tailwind config or theme constants in TS — change tokens in the CSS file and they propagate.

### Tests exclude `references/`

The legacy React project lives in `references/` (gitignored). Vitest would otherwise pick up its `__tests__/` files and fail to resolve their `@/*` imports. `vite.config.ts` sets `test.exclude: ['node_modules', 'dist', 'references/**']` to prevent this. If you add a new top-level dir with unrelated tests, extend that list.

### Cal.com embed is client-only and lazy

`src/sections/Contact.vue` dynamically imports `@calcom/embed-snippet` inside `onMounted`. This keeps the Cal SDK out of the SSG render (where `window` doesn't exist) and out of the initial JS bundle.

## Directory layout

- `src/sections/` — full-width landing-page sections (Hero, Experience, Skills, BlogPreview, Contact)
- `src/pages/` — route components (`Home.vue` composes sections; `BlogIndex`; `BlogPost`)
- `src/components/` — small reusables (Nav, Footer, ThemeToggle)
- `src/composables/` — shared reactive state
- `src/content/` — build-time markdown loading
- `src/data/` — hand-written TS data (`experience.ts` transcribed from a LinkedIn PDF; `skills.ts`)
- `content/blog/` — markdown articles. `_template.md` is filtered out of output (filename starting with `_`).
- `references/` — local-only, gitignored: legacy project, source PDF, etc. Don't import from here.

## Design + plan documents

The site was built from:
- Spec: `docs/superpowers/specs/2026-04-25-portfolio-design.md`
- Plan: `docs/superpowers/plans/2026-04-25-portfolio.md`

Read these before adding features — they document explicit design choices (recruiter focus, no Services/Referrals sections, Minimal Warm aesthetic, left-rail experience timeline) that aren't obvious from the code alone.

## Adding a blog article

```bash
cp content/blog/_template.md content/blog/<slug>.md
# edit frontmatter (title, date required; excerpt, linkedinUrl, ogImage optional)
```

The article appears in BlogIndex, BlogPreview (top 3), and at `/blog/<slug>` automatically — no router or config changes needed.
