# CLAUDE.md

Guidance for Claude Code working in this repository.

## Commands

```bash
npm run dev       # astro dev on :4321
npm run build     # static build → dist/
npm run preview   # serve dist/ on :4321
npm run check     # astro check (typecheck + content schema)
npm test          # vitest run
```

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

Create `src/content/blog/<slug>.md` with frontmatter:

- `title` (string, required)
- `date` (YYYY-MM-DD, required)
- `excerpt` (string, required)
- `linkedinUrl` (URL, optional)
- `headerImage` (filename in `public/blog/`, optional)

## Reference

- Spec: `docs/superpowers/specs/2026-04-27-portfolio-design.md`
- Plan: `docs/superpowers/plans/2026-04-27-portfolio.md`
- Original design bundle (gitignored): `reference/Weinschutz_files/*.jsx` — read at design time only; never imported at runtime.
