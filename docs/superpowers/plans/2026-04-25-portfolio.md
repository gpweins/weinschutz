# Weinschutz Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a recruiter-targeted personal portfolio SPA for Gustavo Weinschütz, deployed to GitHub Pages on `weinschutz.com.br`.

**Architecture:** Vue 3 SPA pre-rendered to static HTML at build time via `vite-ssg`. Markdown blog posts loaded at build time via `import.meta.glob` + `gray-matter` + `markdown-it` (with Shiki). Tailwind v4 with CSS-first theming. Light + warm-dark mode toggle. Subtle motion via `@vueuse/motion`. Cal.com inline embed for booking. Umami Cloud analytics. GitHub Actions deploy.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-ssg, Vue Router 4, Tailwind CSS v4, @vueuse/motion, markdown-it, gray-matter, Shiki, @fontsource/inter, @calcom/embed-snippet, Vitest, @vue/test-utils.

**Spec:** [docs/superpowers/specs/2026-04-25-portfolio-design.md](../specs/2026-04-25-portfolio-design.md)

---

## Phase 1 — Foundation

### Task 1: Initialize repository, gitignore, README skeleton

**Files:**
- Create: `.gitignore`
- Create: `README.md`
- Create: `LICENSE` (optional MIT)
- Run: `git init`

- [ ] **Step 1: Initialize git**

```bash
cd /Users/gpweins/Projects/weinschutz
git init
git branch -M main
```

- [ ] **Step 2: Create `.gitignore`**

```
# Dependencies
node_modules/

# Build output
dist/
.vite/

# Environment
.env
.env.local
.env.*.local

# Editor / OS
.DS_Store
.vscode/
.idea/
*.swp

# Brainstorming session artifacts (local only)
.superpowers/

# Local-only reference materials (PDF, illustration, prior project, etc.)
references/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Testing
coverage/
```

- [ ] **Step 3: Create README skeleton**

```markdown
# weinschutz.com.br

Personal portfolio site for Gustavo Weinschütz — Senior Software Engineer.

## Stack

Vue 3 + TypeScript + Vite + Tailwind v4, pre-rendered to static HTML via `vite-ssg`, deployed to GitHub Pages.

## Local development

\`\`\`bash
npm install
npm run dev      # localhost:5173, hot reload
npm run build    # vite-ssg → dist/
npm run preview  # serve dist/ at localhost:4173
npm test         # vitest
\`\`\`

## Adding a blog article

1. \`cp content/blog/_template.md content/blog/<your-slug>.md\`
2. Edit frontmatter (title, date required; excerpt, linkedinUrl, ogImage optional)
3. Write markdown body
4. (Optional) drop images in \`public/images/blog/<your-slug>/\`
5. \`git commit -m "post: <slug>" && git push\`
6. GitHub Actions deploys (~2 min)

## Deployment

Auto-deployed via GitHub Actions on push to `main`. See `.github/workflows/deploy.yml`.

DNS for `weinschutz.com.br`: A records → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153.
```

- [ ] **Step 4: Initial commit**

```bash
git add .gitignore README.md docs/
git commit -m "chore: initial repo setup with spec and plan"
```

---

### Task 2: Bootstrap Vue 3 + TypeScript + Vite project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/env.d.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "weinschutz",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite-ssg build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.5.0",
    "vue-router": "^4.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.1.0",
    "@vue/test-utils": "^2.4.6",
    "happy-dom": "^15.0.0",
    "typescript": "^5.6.0",
    "vite": "^5.4.0",
    "vite-ssg": "^0.24.0",
    "vitest": "^2.1.0",
    "vue-tsc": "^2.1.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created; no errors.

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client", "vitest/globals"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", "src/**/*.vue", "tests/**/*"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "composite": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

- [ ] **Step 6: Create `src/env.d.ts`**

```ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

- [ ] **Step 7: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gustavo Weinschütz — Senior Software Engineer</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 8: Create minimal `src/App.vue`**

```vue
<script setup lang="ts">
</script>

<template>
  <main>
    <h1>Weinschutz Portfolio</h1>
    <p>Coming soon.</p>
  </main>
</template>
```

- [ ] **Step 9: Create `src/main.ts` (will be replaced in Task 3 with vite-ssg entry)**

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 10: Verify dev server runs**

```bash
npm run dev
```

Expected: Vite prints `Local: http://localhost:5173/`. Open in browser, see "Weinschutz Portfolio / Coming soon." Stop the server (Ctrl-C).

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: bootstrap Vue 3 + TS + Vite"
```

---

### Task 3: Wire vite-ssg with Vue Router placeholder routes

**Files:**
- Modify: `src/main.ts`
- Create: `src/router.ts`
- Create: `src/pages/Home.vue`
- Create: `src/pages/BlogIndex.vue`
- Create: `src/pages/BlogPost.vue`
- Modify: `package.json` (add `ssgify` step if needed)

- [ ] **Step 1: Replace `src/main.ts` with vite-ssg entry**

```ts
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'

export const createApp = ViteSSG(App, { routes })
```

- [ ] **Step 2: Create `src/router.ts`**

```ts
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/blog',
    name: 'blog-index',
    component: () => import('@/pages/BlogIndex.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('@/pages/BlogPost.vue'),
    props: true,
  },
]
```

- [ ] **Step 3: Create placeholder `src/pages/Home.vue`**

```vue
<script setup lang="ts">
</script>

<template>
  <div>
    <h1>Home</h1>
    <p>Hero, Experience, Skills, Blog Preview, Contact will live here.</p>
  </div>
</template>
```

- [ ] **Step 4: Create placeholder `src/pages/BlogIndex.vue`**

```vue
<script setup lang="ts">
</script>

<template>
  <div>
    <h1>Blog</h1>
    <p>Article list will live here.</p>
  </div>
</template>
```

- [ ] **Step 5: Create placeholder `src/pages/BlogPost.vue`**

```vue
<script setup lang="ts">
defineProps<{ slug: string }>()
</script>

<template>
  <div>
    <h1>Blog post: {{ slug }}</h1>
    <p>Article body will live here.</p>
  </div>
</template>
```

- [ ] **Step 6: Update `src/App.vue` to render router outlet**

```vue
<script setup lang="ts">
</script>

<template>
  <RouterView />
</template>
```

- [ ] **Step 7: Verify dev + build + preview**

```bash
npm run dev
```

Open `localhost:5173/`, see Home placeholder. Navigate to `localhost:5173/blog`, see Blog placeholder. Navigate to `localhost:5173/blog/test`, see "Blog post: test". Stop server.

```bash
npm run build
```

Expected: `dist/` created with `index.html`, `blog/index.html`, and a placeholder `blog/[slug].html` (or vite-ssg may emit only crawlable routes — that's fine; we'll wire dynamic routes in Task 19).

```bash
npm run preview
```

Expected: serves `dist/`, navigation works without JS errors.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add vite-ssg with router and placeholder pages"
```

---

### Task 4: Install Tailwind v4 with @theme tokens

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/styles/main.css`
- Modify: `src/main.ts`

- [ ] **Step 1: Install Tailwind v4 + Vite plugin**

```bash
npm install -D tailwindcss@next @tailwindcss/vite@next @tailwindcss/typography@next
```

(Use `@latest` if `@next` is no longer the v4 channel.)

- [ ] **Step 2: Add Tailwind plugin to `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

- [ ] **Step 3: Create `src/styles/main.css` with @theme tokens**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-bg: #faf7f1;
  --color-bg-sub: #f4ede2;
  --color-ink: #1f1b16;
  --color-ink-muted: #6a5d4f;
  --color-accent: #a8896c;
  --color-accent-2: #6b8a5a;
  --color-border: #e8dfd0;

  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  :root {
    color-scheme: light;
  }

  [data-theme="dark"] {
    color-scheme: dark;
    --color-bg: #1c1815;
    --color-bg-sub: #252019;
    --color-ink: #f0e9dc;
    --color-ink-muted: #a8967e;
    --color-accent: #c5a888;
    --color-accent-2: #8eaa78;
    --color-border: #3a312a;
  }

  html {
    background: var(--color-bg);
    color: var(--color-ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  body {
    min-height: 100vh;
  }

  ::selection {
    background: var(--color-accent);
    color: var(--color-bg);
  }

  *:focus-visible {
    outline: 2px solid var(--color-accent-2);
    outline-offset: 2px;
    border-radius: 2px;
  }
}
```

- [ ] **Step 4: Import stylesheet in `src/main.ts`**

```ts
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import '@/styles/main.css'

export const createApp = ViteSSG(App, { routes })
```

- [ ] **Step 5: Smoke test the styling — replace `src/App.vue` template**

```vue
<script setup lang="ts">
</script>

<template>
  <RouterView />
  <div class="fixed bottom-2 right-2 text-xs uppercase tracking-[0.18em] text-[--color-accent]">
    tailwind ok
  </div>
</template>
```

- [ ] **Step 6: Run dev server and verify**

```bash
npm run dev
```

Expected: page renders with warm cream background (`#faf7f1`), dark warm text, "tailwind ok" badge in bottom-right with copper accent color. Stop server.

- [ ] **Step 7: Revert smoke test in App.vue**

```vue
<script setup lang="ts">
</script>

<template>
  <RouterView />
</template>
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add Tailwind v4 with warm palette tokens"
```

---

### Task 5: Self-host Inter font

**Files:**
- Modify: `package.json`
- Modify: `src/main.ts`

- [ ] **Step 1: Install `@fontsource/inter`**

```bash
npm install @fontsource/inter
```

- [ ] **Step 2: Import font weights in `src/main.ts`**

```ts
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'

import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@/styles/main.css'

export const createApp = ViteSSG(App, { routes })
```

- [ ] **Step 3: Verify font loads**

```bash
npm run dev
```

Open `localhost:5173/`. Inspect any text element — `font-family` should resolve to `Inter`. Stop server.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: self-host Inter font via @fontsource"
```

---

## Phase 2 — Theme system + app shell

### Task 6: Theme composable with localStorage + prefers-color-scheme

**Files:**
- Create: `src/composables/useTheme.ts`
- Create: `tests/composables/useTheme.test.ts`

- [ ] **Step 1: Write failing test**

Create `tests/composables/useTheme.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from '@/composables/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('initializes from localStorage when set', () => {
    localStorage.setItem('theme', 'dark')
    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('falls back to prefers-color-scheme when no localStorage', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
  })

  it('toggle flips theme and persists to localStorage', () => {
    const { theme, toggle } = useTheme()
    const initial = theme.value
    toggle()
    expect(theme.value).not.toBe(initial)
    expect(localStorage.getItem('theme')).toBe(theme.value)
    expect(document.documentElement.getAttribute('data-theme')).toBe(theme.value)
  })
})
```

- [ ] **Step 2: Run test to verify failure**

```bash
npm test -- useTheme
```

Expected: FAIL with "Cannot find module '@/composables/useTheme'".

- [ ] **Step 3: Implement `src/composables/useTheme.ts`**

```ts
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function readInitial(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(readInitial())

if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', theme.value)
}

watch(theme, (next) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', next)
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, next)
  }
})

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme, toggle }
}
```

- [ ] **Step 4: Run test to verify pass**

```bash
npm test -- useTheme
```

Expected: PASS, all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add useTheme composable with localStorage persistence"
```

---

### Task 7: ThemeToggle component

**Files:**
- Create: `src/components/ThemeToggle.vue`

- [ ] **Step 1: Implement `src/components/ThemeToggle.vue`**

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    @click="toggle"
    :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
    class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[--color-border] text-[--color-ink-muted] hover:text-[--color-accent] hover:border-[--color-accent] transition-colors"
  >
    <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>
```

- [ ] **Step 2: Manual verification (will wire into Nav in Task 8)**

The component is self-contained; test integration in the next task.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add ThemeToggle component"
```

---

### Task 8: Nav component (sticky, scroll-aware, mobile drawer)

**Files:**
- Create: `src/components/Nav.vue`

- [ ] **Step 1: Implement `src/components/Nav.vue`**

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

const scrolled = ref(false)
const drawerOpen = ref(false)

const links = [
  { href: '/#hero', label: 'Home' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
]

function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function closeDrawer() {
  drawerOpen.value = false
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-colors"
    :class="scrolled ? 'bg-[--color-bg]/85 backdrop-blur border-b border-[--color-border]' : 'bg-transparent'"
  >
    <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
      <RouterLink to="/" class="text-sm font-semibold tracking-tight text-[--color-ink]">
        Gustavo Weinschütz
      </RouterLink>

      <ul class="hidden md:flex items-center gap-8">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="text-sm text-[--color-ink-muted] hover:text-[--color-ink] transition-colors"
          >
            {{ link.label }}
          </a>
        </li>
        <li><ThemeToggle /></li>
      </ul>

      <div class="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          @click="drawerOpen = !drawerOpen"
          :aria-expanded="drawerOpen"
          aria-label="Toggle navigation"
          class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[--color-border] text-[--color-ink]"
        >
          <svg v-if="!drawerOpen" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </nav>

    <div
      v-if="drawerOpen"
      class="md:hidden border-t border-[--color-border] bg-[--color-bg]"
    >
      <ul class="flex flex-col gap-1 px-6 py-4">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            @click="closeDrawer"
            class="block py-2 text-sm text-[--color-ink-muted] hover:text-[--color-ink]"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add sticky Nav with scroll-aware background and mobile drawer"
```

---

### Task 9: Footer component

**Files:**
- Create: `src/components/Footer.vue`

- [ ] **Step 1: Implement `src/components/Footer.vue`**

```vue
<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-[--color-border] mt-24">
    <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
      <p class="text-xs text-[--color-ink-muted]">
        © {{ year }} Gustavo Weinschütz
      </p>
      <ul class="flex items-center gap-4 text-[--color-ink-muted]">
        <li>
          <a href="https://github.com/gpweins" target="_blank" rel="noreferrer noopener" aria-label="GitHub" class="hover:text-[--color-ink]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.97-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.95 10.95 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.02 2.81-.02 3.19 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"/></svg>
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/gpweins/" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" class="hover:text-[--color-ink]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"/></svg>
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add Footer with GitHub and LinkedIn links"
```

---

### Task 10: App.vue shell with skip link

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Wire shell**

```vue
<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-[--color-bg] focus:px-3 focus:py-2 focus:text-sm focus:text-[--color-ink] focus:shadow"
  >
    Skip to content
  </a>
  <Nav />
  <main id="main" class="pt-16">
    <RouterView />
  </main>
  <Footer />
</template>
```

- [ ] **Step 2: Verify shell renders**

```bash
npm run dev
```

Expected: sticky nav at top with name + links + theme toggle, page content below, footer at bottom. Tab from address bar — first focus is "Skip to content" link. Toggle theme — colors swap warm-light ↔ warm-dark and persist on reload. Stop server.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: wire app shell with skip link, nav, footer"
```

---

## Phase 3 — Data files + content pipeline

### Task 11: Create `src/data/experience.ts` from LinkedIn PDF

**Files:**
- Create: `src/data/experience.ts`

**Source:** Read `references/LinkedIn_Profile_2026_04_24.pdf` and transcribe entries.

- [ ] **Step 1: Read the LinkedIn PDF**

```bash
# Use the Read tool on the PDF
```

Capture: company, role, start/end dates (ISO month format like `2025-10`), location, summary (2-3 sentence).

- [ ] **Step 2: Implement `src/data/experience.ts`**

```ts
export type ExperienceEntry = {
  company: string
  role: string
  startDate: string         // ISO YYYY-MM
  endDate: string | 'Present'
  location?: string
  summary: string
}

export const experience: ExperienceEntry[] = [
  // Transcribe from the PDF, most recent first.
  // Example shape (replace with PDF content):
  // {
  //   company: 'Self-employed',
  //   role: 'Software Engineer (Freelance)',
  //   startDate: '2025-10',
  //   endDate: 'Present',
  //   location: 'Remote',
  //   summary: '...'
  // },
]
```

After transcription, the array MUST contain at least the entries visible in the PDF (Self-employed → Adeva → Modus Create → Fidelize → Petaxxon → Polaris → LNCC and any others). Use the prior project's `references/weinschutz_react/data/experience.ts` only to cross-check structure — facts must match the PDF.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add experience data transcribed from LinkedIn PDF"
```

---

### Task 12: Create `src/data/skills.ts`

**Files:**
- Create: `src/data/skills.ts`

- [ ] **Step 1: Implement `src/data/skills.ts`**

```ts
export type SkillGroup = {
  name: string
  chips: string[]
}

export const skills: SkillGroup[] = [
  {
    name: 'Backend',
    chips: ['PHP', 'Laravel', 'Node.js', 'REST APIs', 'Microservices', 'OOP'],
  },
  {
    name: 'Frontend',
    chips: ['Vue.js', 'React', 'JavaScript', 'TypeScript', 'HTML/CSS'],
  },
  {
    name: 'Data & Integrations',
    chips: ['PostgreSQL', 'MySQL', 'Database Optimization', 'Auth0 / SSO', 'EDI'],
  },
  {
    name: 'Cloud & DevOps',
    chips: ['AWS', 'Docker', 'GitHub Actions', 'CI/CD', 'Unit Testing', 'Git'],
  },
  {
    name: 'Leadership & Process',
    chips: ['Agile / Scrum', 'Team Leadership', 'Mentorship', 'Code Review', 'Technical Interviews'],
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add skills data with grouped chips"
```

---

### Task 13: Migrate example article and create template

**Files:**
- Create: `content/blog/_template.md`
- Create: `content/blog/science-of-silence.md`

- [ ] **Step 1: Create `content/blog/_template.md`**

```markdown
---
title: "Your Article Title Here"
date: 2026-04-25
excerpt: "A 1-2 sentence summary used on the blog list and OG description."
linkedinUrl: "https://www.linkedin.com/pulse/your-post-slug/"
# ogImage: "/images/blog/your-slug/cover.png"   # optional
---

Write your article body here as standard markdown.

## Section heading

Paragraphs, **bold**, *italic*, [links](https://example.com), and code:

\`\`\`ts
const example = 'syntax highlighting via Shiki'
\`\`\`

End with a question or call to action that invites discussion.
```

- [ ] **Step 2: Create `content/blog/science-of-silence.md` (migrated from example_article.md)**

```markdown
---
title: "The Science of Silence: Why Your Best Ideas Might Be Stuck in 'Dead Air'"
date: 2026-04-21
linkedinUrl: "https://www.linkedin.com/pulse/science-silence-why-your-best-ideas-might-stuck-dead-air-weinsch%C3%BCtz-qtigf/?trackingId=E%2FxBb3mgTJGUhoe2khgPGA%3D%3D"
excerpt: "How cultural conversational rhythms quietly silence your team's best ideas — and what introverted leadership can do about it."
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

- [ ] **Step 3: Commit**

```bash
git add content/
git commit -m "feat: migrate example article to frontmatter format and add _template"
```

---

### Task 14: Articles loader with TDD

**Files:**
- Modify: `package.json`
- Create: `src/types/article.ts`
- Create: `src/content/articles.ts`
- Create: `tests/content/articles.test.ts`
- Create: `tests/fixtures/blog/sample.md`

- [ ] **Step 1: Install markdown libs**

```bash
npm install -D markdown-it gray-matter shiki @shikijs/markdown-it
npm install -D @types/markdown-it
```

- [ ] **Step 2: Define Article type — create `src/types/article.ts`**

```ts
export type Article = {
  slug: string
  title: string
  date: string         // ISO
  excerpt: string
  html: string
  linkedinUrl?: string
  ogImage?: string
}
```

- [ ] **Step 3: Create test fixture `tests/fixtures/blog/sample.md`**

```markdown
---
title: "Sample Post"
date: 2026-01-15
linkedinUrl: "https://www.linkedin.com/pulse/sample/"
---

This is the first paragraph used as fallback excerpt.

## Section

Body content here with **bold** and *italic*.

\`\`\`ts
const x: number = 42
\`\`\`
```

- [ ] **Step 4: Write failing test `tests/content/articles.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { loadArticlesFromRaw } from '@/content/articles'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sample = readFileSync(resolve(__dirname, '../fixtures/blog/sample.md'), 'utf-8')

describe('loadArticlesFromRaw', () => {
  it('parses frontmatter into Article fields', async () => {
    const articles = await loadArticlesFromRaw([
      { path: '/content/blog/sample.md', raw: sample },
    ])
    expect(articles).toHaveLength(1)
    const a = articles[0]
    expect(a.slug).toBe('sample')
    expect(a.title).toBe('Sample Post')
    expect(a.date).toBe('2026-01-15')
    expect(a.linkedinUrl).toBe('https://www.linkedin.com/pulse/sample/')
  })

  it('renders markdown body to HTML with code highlighting', async () => {
    const articles = await loadArticlesFromRaw([
      { path: '/content/blog/sample.md', raw: sample },
    ])
    const html = articles[0].html
    expect(html).toContain('<h2')
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<em>italic</em>')
    // Shiki wraps code in <pre class="shiki ...">
    expect(html).toMatch(/<pre[^>]*class="[^"]*shiki/)
  })

  it('falls back to first paragraph as excerpt when frontmatter excerpt absent', async () => {
    const articles = await loadArticlesFromRaw([
      { path: '/content/blog/sample.md', raw: sample },
    ])
    expect(articles[0].excerpt).toBe('This is the first paragraph used as fallback excerpt.')
  })

  it('sorts articles by date desc', async () => {
    const newer = sample.replace('2026-01-15', '2026-03-10').replace('Sample Post', 'Newer')
    const older = sample.replace('2026-01-15', '2025-12-01').replace('Sample Post', 'Older')
    const articles = await loadArticlesFromRaw([
      { path: '/content/blog/older.md', raw: older },
      { path: '/content/blog/newer.md', raw: newer },
    ])
    expect(articles.map((a) => a.title)).toEqual(['Newer', 'Older'])
  })

  it('derives slug from filename in kebab-case', async () => {
    const articles = await loadArticlesFromRaw([
      { path: '/content/blog/science-of-silence.md', raw: sample },
    ])
    expect(articles[0].slug).toBe('science-of-silence')
  })
})
```

- [ ] **Step 5: Run test to verify failure**

```bash
npm test -- articles
```

Expected: FAIL with "Cannot find module '@/content/articles'".

- [ ] **Step 6: Implement `src/content/articles.ts`**

```ts
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { fromHighlighter } from '@shikijs/markdown-it/core'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import type { Article } from '@/types/article'

type RawFile = { path: string; raw: string }

let mdInstance: MarkdownIt | null = null

async function getMd(): Promise<MarkdownIt> {
  if (mdInstance) return mdInstance
  const highlighter = await createHighlighterCore({
    themes: [
      import('@shikijs/themes/github-light'),
      import('@shikijs/themes/github-dark'),
    ],
    langs: [
      import('@shikijs/langs/typescript'),
      import('@shikijs/langs/javascript'),
      import('@shikijs/langs/bash'),
      import('@shikijs/langs/php'),
      import('@shikijs/langs/json'),
      import('@shikijs/langs/yaml'),
      import('@shikijs/langs/html'),
      import('@shikijs/langs/css'),
    ],
    engine: createOnigurumaEngine(import('shiki/wasm')),
  })
  const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
  md.use(
    fromHighlighter(highlighter, {
      themes: { light: 'github-light', dark: 'github-dark' },
    }),
  )
  mdInstance = md
  return md
}

function slugFromPath(path: string): string {
  const base = path.split('/').pop() ?? ''
  return base.replace(/\.md$/, '')
}

function firstParagraph(body: string): string {
  const trimmed = body.trim()
  const para = trimmed.split(/\n\s*\n/, 1)[0] ?? ''
  return para.replace(/^#+\s*/, '').replace(/\s+/g, ' ').trim()
}

export async function loadArticlesFromRaw(files: RawFile[]): Promise<Article[]> {
  const md = await getMd()
  const articles: Article[] = files.map((file) => {
    const { data, content } = matter(file.raw)
    const slug = slugFromPath(file.path)
    const excerpt = (data.excerpt as string | undefined) ?? firstParagraph(content)
    const html = md.render(content)
    const date =
      data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date ?? '')
    return {
      slug,
      title: String(data.title ?? slug),
      date,
      excerpt,
      html,
      linkedinUrl: data.linkedinUrl as string | undefined,
      ogImage: data.ogImage as string | undefined,
    }
  })
  articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  return articles
}

const modules = import.meta.glob('/content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const files: RawFile[] = Object.entries(modules)
  .filter(([path]) => !path.endsWith('/_template.md'))
  .map(([path, raw]) => ({ path, raw }))

// Top-level await: resolves at module load (works in dev, SSG build, and prod
// because we target ES2022 and Vite supports it). Downstream consumers can
// import `articles` synchronously.
export const articles: Article[] = await loadArticlesFromRaw(files)
```

- [ ] **Step 7: Run test to verify pass**

```bash
npm test -- articles
```

Expected: PASS, all 5 tests green.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add markdown article loader with Shiki highlighting"
```

---

## Phase 4 — Sections

### Task 15: Hero section

**Files:**
- Create: `src/sections/Hero.vue`

- [ ] **Step 1: Implement `src/sections/Hero.vue`**

```vue
<script setup lang="ts">
</script>

<template>
  <section id="hero" class="relative flex min-h-[calc(100vh-4rem)] items-center px-6">
    <div class="mx-auto w-full max-w-5xl">
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-6">
        Senior Software Engineer
      </p>
      <h1 class="text-6xl md:text-8xl font-bold leading-[0.95] -tracking-[0.02em] text-[--color-ink] mb-8">
        Gustavo<br />Weinschütz
      </h1>
      <p class="max-w-xl text-lg text-[--color-ink-muted] leading-relaxed mb-10">
        I build web applications that are fast, scalable, and a pleasure to use.
      </p>
      <div class="flex flex-col sm:flex-row gap-3">
        <a
          href="https://app.cal.com/gpweins/"
          target="_blank"
          rel="noreferrer noopener"
          class="inline-flex items-center justify-center rounded-full bg-[--color-ink] px-7 py-3.5 text-sm font-medium text-[--color-bg] hover:opacity-90 transition-opacity"
        >
          Book a Call
        </a>
        <a
          href="/resume.pdf"
          download
          class="inline-flex items-center justify-center rounded-full border border-[--color-border] px-7 py-3.5 text-sm font-medium text-[--color-ink] hover:border-[--color-accent] transition-colors"
        >
          Download Resume
        </a>
      </div>
    </div>
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-[--color-ink-muted]">
      ↓ Scroll
    </div>
  </section>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add Hero section"
```

---

### Task 16: Experience section (left rail timeline)

**Files:**
- Create: `src/sections/Experience.vue`

- [ ] **Step 1: Implement `src/sections/Experience.vue`**

```vue
<script setup lang="ts">
import { experience, type ExperienceEntry } from '@/data/experience'

function formatRange(entry: ExperienceEntry): string {
  return `${entry.startDate} — ${entry.endDate}`
}
</script>

<template>
  <section id="experience" class="px-6 py-24 md:py-32">
    <div class="mx-auto max-w-5xl">
      <header class="mb-16">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-3">
          Experience
        </p>
        <h2 class="text-4xl font-bold -tracking-[0.02em] text-[--color-ink]">
          15+ years building software
        </h2>
        <p class="mt-3 max-w-xl text-[--color-ink-muted]">
          Healthtech, pharma, finance, logistics, and CRM.
        </p>
      </header>

      <ol class="relative ml-3 border-l border-[--color-border] pl-8 md:ml-6 md:pl-10">
        <li
          v-for="(entry, i) in experience"
          :key="`${entry.company}-${i}`"
          class="relative mb-10 last:mb-0"
        >
          <span
            aria-hidden="true"
            class="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-[--color-accent] md:-left-[45px]"
          />
          <p class="text-xs font-medium uppercase tracking-[0.16em] text-[--color-accent] mb-2">
            {{ formatRange(entry) }}
          </p>
          <article class="rounded-2xl border border-[--color-border] bg-[--color-bg-sub] p-6">
            <h3 class="text-lg font-semibold text-[--color-ink]">
              {{ entry.role }}
            </h3>
            <p class="text-sm font-medium text-[--color-accent-2] mb-3">
              {{ entry.company }}<span v-if="entry.location"> · {{ entry.location }}</span>
            </p>
            <p class="text-sm leading-relaxed text-[--color-ink-muted]">
              {{ entry.summary }}
            </p>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add Experience section with left rail timeline"
```

---

### Task 17: Skills section

**Files:**
- Create: `src/sections/Skills.vue`

- [ ] **Step 1: Implement `src/sections/Skills.vue`**

```vue
<script setup lang="ts">
import { skills } from '@/data/skills'
</script>

<template>
  <section id="skills" class="px-6 py-24 md:py-32 bg-[--color-bg-sub]">
    <div class="mx-auto max-w-5xl">
      <header class="mb-12">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-3">
          Skills
        </p>
        <h2 class="text-4xl font-bold -tracking-[0.02em] text-[--color-ink]">
          Tools I reach for
        </h2>
      </header>

      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="group in skills" :key="group.name">
          <h3 class="text-xs font-medium uppercase tracking-[0.16em] text-[--color-accent-2] mb-4">
            {{ group.name }}
          </h3>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="chip in group.chips"
              :key="chip"
              class="rounded-full border border-[--color-border] bg-[--color-bg] px-3 py-1.5 text-xs text-[--color-ink]"
            >
              {{ chip }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add Skills section with grouped chips"
```

---

### Task 18: BlogPreview section

**Files:**
- Create: `src/sections/BlogPreview.vue`

- [ ] **Step 1: Implement `src/sections/BlogPreview.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { articles as allArticles } from '@/content/articles'

const articles = computed(() => allArticles.slice(0, 3))

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <section id="blog" class="px-6 py-24 md:py-32">
    <div class="mx-auto max-w-5xl">
      <header class="mb-12 flex items-end justify-between gap-6">
        <div>
          <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-3">
            Writing
          </p>
          <h2 class="text-4xl font-bold -tracking-[0.02em] text-[--color-ink]">
            Recent articles
          </h2>
        </div>
        <RouterLink
          to="/blog"
          class="hidden sm:inline text-sm text-[--color-accent-2] hover:underline"
        >
          View all articles →
        </RouterLink>
      </header>

      <ul class="grid gap-6 md:grid-cols-3">
        <li
          v-for="article in articles"
          :key="article.slug"
          class="rounded-2xl border border-[--color-border] bg-[--color-bg-sub] p-6 hover:border-[--color-accent] transition-colors"
        >
          <RouterLink :to="`/blog/${article.slug}`" class="block">
            <p class="text-xs uppercase tracking-[0.16em] text-[--color-accent] mb-3">
              {{ formatDate(article.date) }}
            </p>
            <h3 class="text-base font-semibold text-[--color-ink] mb-2 line-clamp-2">
              {{ article.title }}
            </h3>
            <p class="text-sm text-[--color-ink-muted] line-clamp-3">
              {{ article.excerpt }}
            </p>
            <p class="mt-4 text-xs text-[--color-accent-2]">Read →</p>
          </RouterLink>
        </li>
      </ul>

      <p class="mt-8 sm:hidden">
        <RouterLink to="/blog" class="text-sm text-[--color-accent-2] hover:underline">
          View all articles →
        </RouterLink>
      </p>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add BlogPreview section with latest 3 articles"
```

---

### Task 19: Contact section with Cal.com inline embed

**Files:**
- Modify: `package.json`
- Create: `src/sections/Contact.vue`

- [ ] **Step 1: Install Cal.com embed**

```bash
npm install @calcom/embed-snippet
```

- [ ] **Step 2: Implement `src/sections/Contact.vue`**

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const calRef = ref<HTMLDivElement | null>(null)
const embedFailed = ref(false)

onMounted(async () => {
  try {
    const Cal = (await import('@calcom/embed-snippet')).default
    Cal('init', { origin: 'https://app.cal.com' })
    Cal('inline', {
      elementOrSelector: calRef.value!,
      calLink: 'gpweins',
      config: { theme: 'auto' },
    })
  } catch (e) {
    console.error('Cal.com embed failed', e)
    embedFailed.value = true
  }
})
</script>

<template>
  <section id="contact" class="px-6 py-24 md:py-32 bg-[--color-bg-sub]">
    <div class="mx-auto max-w-5xl">
      <header class="mb-10">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-3">
          Contact
        </p>
        <h2 class="text-4xl font-bold -tracking-[0.02em] text-[--color-ink]">
          Let's talk.
        </h2>
        <p class="mt-3 max-w-xl text-[--color-ink-muted]">
          Open to senior backend and full-stack roles. Pick a slot below — or reach out on LinkedIn.
        </p>
      </header>

      <div
        v-if="!embedFailed"
        ref="calRef"
        class="rounded-2xl border border-[--color-border] bg-[--color-bg] overflow-hidden"
        style="min-height: 600px;"
      />
      <div v-else class="rounded-2xl border border-[--color-border] bg-[--color-bg] p-10 text-center">
        <p class="text-[--color-ink-muted] mb-4">
          Could not load the booking widget.
        </p>
        <a
          href="https://app.cal.com/gpweins/"
          target="_blank"
          rel="noreferrer noopener"
          class="inline-flex items-center justify-center rounded-full bg-[--color-ink] px-7 py-3 text-sm font-medium text-[--color-bg]"
        >
          Open Cal.com
        </a>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add Contact section with Cal.com inline embed"
```

---

## Phase 5 — Pages

### Task 20: Home page composing all sections

**Files:**
- Modify: `src/pages/Home.vue`

- [ ] **Step 1: Compose Home page**

```vue
<script setup lang="ts">
import Hero from '@/sections/Hero.vue'
import Experience from '@/sections/Experience.vue'
import Skills from '@/sections/Skills.vue'
import BlogPreview from '@/sections/BlogPreview.vue'
import Contact from '@/sections/Contact.vue'
</script>

<template>
  <Hero />
  <Experience />
  <Skills />
  <BlogPreview />
  <Contact />
</template>
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Open `localhost:5173/`. Scroll through: Hero → Experience timeline → Skills chips → Blog preview cards → Contact (Cal.com loading). Toggle theme — all sections should swap palette cleanly. Stop server.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: compose Home page from all sections"
```

---

### Task 21: BlogIndex page

**Files:**
- Modify: `src/pages/BlogIndex.vue`

- [ ] **Step 1: Implement `src/pages/BlogIndex.vue`**

```vue
<script setup lang="ts">
import { articles } from '@/content/articles'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <section class="px-6 py-24 md:py-32">
    <div class="mx-auto max-w-3xl">
      <header class="mb-16">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-[--color-accent] mb-3">
          Writing
        </p>
        <h1 class="text-5xl font-bold -tracking-[0.02em] text-[--color-ink]">
          Articles
        </h1>
      </header>

      <ul class="space-y-10">
        <li
          v-for="article in articles"
          :key="article.slug"
          class="border-b border-[--color-border] pb-10 last:border-0"
        >
          <RouterLink :to="`/blog/${article.slug}`" class="block group">
            <p class="text-xs uppercase tracking-[0.16em] text-[--color-accent] mb-3">
              {{ formatDate(article.date) }}
            </p>
            <h2 class="text-2xl font-semibold text-[--color-ink] mb-3 group-hover:text-[--color-accent-2] transition-colors">
              {{ article.title }}
            </h2>
            <p class="text-[--color-ink-muted] leading-relaxed">
              {{ article.excerpt }}
            </p>
            <p class="mt-4 text-sm text-[--color-accent-2]">Read article →</p>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add BlogIndex page with chronological article list"
```

---

### Task 22: BlogPost page with prev/next nav

**Files:**
- Modify: `src/pages/BlogPost.vue`
- Modify: `src/main.ts` (register dynamic routes for SSG)

- [ ] **Step 1: Implement `src/pages/BlogPost.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { articles } from '@/content/articles'

const props = defineProps<{ slug: string }>()

const current = computed(() => articles.find((a) => a.slug === props.slug))
const currentIndex = computed(() => articles.findIndex((a) => a.slug === props.slug))
const prev = computed(() =>
  currentIndex.value > 0 ? articles[currentIndex.value - 1] : null,
)
const next = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < articles.length - 1
    ? articles[currentIndex.value + 1]
    : null,
)

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <article class="px-6 py-16 md:py-24" v-if="current">
    <div class="mx-auto max-w-3xl">
      <RouterLink to="/blog" class="text-sm text-[--color-accent-2] hover:underline">
        ← All articles
      </RouterLink>

      <header class="mt-8 mb-12">
        <p class="text-xs uppercase tracking-[0.16em] text-[--color-accent] mb-4">
          {{ formatDate(current.date) }}
        </p>
        <h1 class="text-4xl md:text-5xl font-bold -tracking-[0.02em] text-[--color-ink] leading-tight">
          {{ current.title }}
        </h1>
        <p v-if="current.linkedinUrl" class="mt-4 text-sm">
          <a
            :href="current.linkedinUrl"
            target="_blank"
            rel="noreferrer noopener"
            class="text-[--color-accent-2] hover:underline"
          >
            Originally on LinkedIn →
          </a>
        </p>
      </header>

      <div
        class="prose prose-neutral max-w-none prose-headings:text-[--color-ink] prose-p:text-[--color-ink] prose-strong:text-[--color-ink] prose-a:text-[--color-accent-2] prose-blockquote:border-l-[--color-accent] prose-code:text-[--color-accent]"
        v-html="current.html"
      />

      <nav class="mt-20 grid gap-4 border-t border-[--color-border] pt-10 sm:grid-cols-2">
        <RouterLink
          v-if="prev"
          :to="`/blog/${prev.slug}`"
          class="block rounded-2xl border border-[--color-border] p-5 hover:border-[--color-accent] transition-colors"
        >
          <p class="text-xs uppercase tracking-[0.16em] text-[--color-ink-muted] mb-1">← Previous</p>
          <p class="text-sm font-semibold text-[--color-ink]">{{ prev.title }}</p>
        </RouterLink>
        <span v-else />
        <RouterLink
          v-if="next"
          :to="`/blog/${next.slug}`"
          class="block rounded-2xl border border-[--color-border] p-5 sm:text-right hover:border-[--color-accent] transition-colors"
        >
          <p class="text-xs uppercase tracking-[0.16em] text-[--color-ink-muted] mb-1">Next →</p>
          <p class="text-sm font-semibold text-[--color-ink]">{{ next.title }}</p>
        </RouterLink>
      </nav>
    </div>
  </article>

  <div v-else class="px-6 py-32 text-center">
    <p class="text-[--color-ink-muted]">Article not found.</p>
    <RouterLink to="/blog" class="mt-4 inline-block text-[--color-accent-2] hover:underline">
      ← Back to all articles
    </RouterLink>
  </div>
</template>
```

- [ ] **Step 2: Tell vite-ssg which dynamic blog paths to pre-render — modify `vite.config.ts`**

Add `ssgOptions.includedRoutes` to `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // @ts-expect-error — vite-ssg ssgOptions
  ssgOptions: {
    includedRoutes: async (paths: string[]) => {
      const { articles } = await import('./src/content/articles')
      const blogPaths = articles.map((a) => `/blog/${a.slug}`)
      // strip the parameterized blog route, replace with concrete slug paths
      return [...paths.filter((p) => !p.includes(':')), ...blogPaths]
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

`src/main.ts` is unchanged from Task 5. The dynamic `/blog/:slug` route is already declared in `src/router.ts` from Task 3.

- [ ] **Step 3: Verify build prerenders all blog routes**

```bash
npm run build
```

Expected: build output lists `/`, `/blog`, and `/blog/science-of-silence` (one for each article). `dist/blog/science-of-silence/index.html` exists.

```bash
npm run preview
```

Open `localhost:4173/blog/science-of-silence` — article renders with formatted prose, syntax highlighting on the (sample) code, prev/next links if multiple articles exist. Stop server.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add BlogPost page with prev/next nav and SSG route generation"
```

---

## Phase 6 — Polish

### Task 23: Subtle motion via @vueuse/motion

**Files:**
- Modify: `package.json`
- Modify: `src/main.ts`
- Modify: `src/sections/Experience.vue`
- Modify: `src/sections/Skills.vue`
- Modify: `src/sections/BlogPreview.vue`

- [ ] **Step 1: Install `@vueuse/motion`**

```bash
npm install @vueuse/motion
```

- [ ] **Step 2: Register plugin in `src/main.ts` setup hook**

Update `src/main.ts` to pass a setup callback to `ViteSSG` that registers the motion plugin:

```ts
import { ViteSSG } from 'vite-ssg'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import { routes } from './router'

import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@/styles/main.css'

export const createApp = ViteSSG(App, { routes }, ({ app }) => {
  app.use(MotionPlugin)
})
```

(Dynamic `/blog/:slug` routes are handled by `ssgOptions.includedRoutes` in `vite.config.ts` from Task 22 — `main.ts` does not need to know about them.)

- [ ] **Step 3: Apply `v-motion-fade-visible-once` directive to Experience timeline cards — replace `<li>` block in `src/sections/Experience.vue`**

```vue
<li
  v-for="(entry, i) in experience"
  :key="`${entry.company}-${i}`"
  class="relative mb-10 last:mb-0"
  v-motion-fade-visible-once
  :delay="i * 60"
>
```

- [ ] **Step 4: Apply directive to Skills group columns — replace group `<div>` in `src/sections/Skills.vue`**

```vue
<div
  v-for="(group, i) in skills"
  :key="group.name"
  v-motion-fade-visible-once
  :delay="i * 80"
>
```

- [ ] **Step 5: Apply directive to BlogPreview cards — replace card `<li>` in `src/sections/BlogPreview.vue`**

```vue
<li
  v-for="(article, i) in articles"
  :key="article.slug"
  class="rounded-2xl border border-[--color-border] bg-[--color-bg-sub] p-6 hover:border-[--color-accent] transition-colors"
  v-motion-fade-visible-once
  :delay="i * 80"
>
```

- [ ] **Step 6: Verify motion in browser**

```bash
npm run dev
```

Scroll the home page. Cards should fade up subtly on entering viewport. Test with macOS System Settings → Accessibility → Display → Reduce Motion enabled — animations should be skipped, content visible immediately. Stop server.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add subtle fade-up motion to scrolled sections"
```

---

### Task 24: Per-route head config (vite-ssg)

**Files:**
- Modify: `src/pages/Home.vue`
- Modify: `src/pages/BlogIndex.vue`
- Modify: `src/pages/BlogPost.vue`
- Modify: `package.json`

- [ ] **Step 1: Install `@unhead/vue` (vite-ssg's head dependency)**

```bash
npm install @unhead/vue
```

- [ ] **Step 2: Add head config to `src/pages/Home.vue`**

```vue
<script setup lang="ts">
import { useHead } from '@unhead/vue'
import Hero from '@/sections/Hero.vue'
import Experience from '@/sections/Experience.vue'
import Skills from '@/sections/Skills.vue'
import BlogPreview from '@/sections/BlogPreview.vue'
import Contact from '@/sections/Contact.vue'

useHead({
  title: 'Gustavo Weinschütz — Senior Software Engineer',
  meta: [
    {
      name: 'description',
      content:
        'Senior Software Engineer with 15+ years across healthtech, pharma, finance, and logistics. Open to senior backend and full-stack roles.',
    },
    { property: 'og:title', content: 'Gustavo Weinschütz — Senior Software Engineer' },
    {
      property: 'og:description',
      content: 'Senior Software Engineer with 15+ years building scalable backends and full-stack systems.',
    },
    { property: 'og:image', content: 'https://weinschutz.com.br/og-image.png' },
    { property: 'og:url', content: 'https://weinschutz.com.br/' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [{ rel: 'canonical', href: 'https://weinschutz.com.br/' }],
})
</script>

<template>
  <Hero />
  <Experience />
  <Skills />
  <BlogPreview />
  <Contact />
</template>
```

- [ ] **Step 3: Add head config to `src/pages/BlogIndex.vue` — add inside `<script setup>`**

```ts
import { useHead } from '@unhead/vue'

useHead({
  title: 'Articles — Gustavo Weinschütz',
  meta: [
    { name: 'description', content: 'Writing on engineering, leadership, and team communication.' },
    { property: 'og:title', content: 'Articles — Gustavo Weinschütz' },
    { property: 'og:url', content: 'https://weinschutz.com.br/blog' },
  ],
  link: [{ rel: 'canonical', href: 'https://weinschutz.com.br/blog' }],
})
```

- [ ] **Step 4: Add per-post head config to `src/pages/BlogPost.vue` — add inside `<script setup>`, after `current` computed**

```ts
import { useHead } from '@unhead/vue'
import { watchEffect } from 'vue'

watchEffect(() => {
  if (!current.value) return
  const url = `https://weinschutz.com.br/blog/${current.value.slug}`
  const ogImage = current.value.ogImage
    ? new URL(current.value.ogImage, 'https://weinschutz.com.br').href
    : 'https://weinschutz.com.br/og-image.png'
  useHead({
    title: `${current.value.title} — Gustavo Weinschütz`,
    meta: [
      { name: 'description', content: current.value.excerpt },
      { property: 'og:title', content: current.value.title },
      { property: 'og:description', content: current.value.excerpt },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [{ rel: 'canonical', href: url }],
  })
})
```

- [ ] **Step 5: Verify head injection**

```bash
npm run build
```

Inspect `dist/index.html`, `dist/blog/index.html`, and `dist/blog/science-of-silence/index.html` — each should contain unique `<title>`, `og:title`, `og:url`, and canonical link. Use `grep` or open the files.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: per-route head config with OG meta and canonical URLs"
```

---

### Task 25: Sitemap generation

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`

- [ ] **Step 1: Install `vite-ssg-sitemap`**

```bash
npm install -D vite-ssg-sitemap
```

- [ ] **Step 2: Add `onFinished` hook alongside the existing `includedRoutes` in `vite.config.ts`**

Extend the `ssgOptions` block from Task 22 to also call `generateSitemap` after the build finishes:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import generateSitemap from 'vite-ssg-sitemap'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // @ts-expect-error — vite-ssg ssgOptions
  ssgOptions: {
    includedRoutes: async (paths: string[]) => {
      const { articles } = await import('./src/content/articles')
      const blogPaths = articles.map((a) => `/blog/${a.slug}`)
      return [...paths.filter((p) => !p.includes(':')), ...blogPaths]
    },
    onFinished() {
      generateSitemap({
        hostname: 'https://weinschutz.com.br/',
      })
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

- [ ] **Step 3: Verify sitemap is generated**

```bash
npm run build
```

Expected: `dist/sitemap.xml` exists, contains entries for `/`, `/blog`, and `/blog/<slug>` for each article.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: generate sitemap.xml at build time"
```

---

## Phase 7 — Public assets, analytics, deploy

### Task 26: Public assets (CNAME, resume placeholder, og-image placeholder, favicon)

**Files:**
- Create: `public/CNAME`
- Create: `public/resume.pdf` (placeholder)
- Create: `public/og-image.png` (placeholder)
- Create: `public/favicon.svg`
- Create: `public/robots.txt`

- [ ] **Step 1: Create `public/CNAME`**

File content (single line, no trailing newline matters for some setups but GitHub accepts both):

```
weinschutz.com.br
```

- [ ] **Step 2: Add resume placeholder**

For now, drop a placeholder PDF at `public/resume.pdf`. The owner replaces this file with the real resume export before deploy. If no PDF is available right now, create a 1-page placeholder:

```bash
# macOS quick way: print any document → save as PDF, name it resume.pdf
# or copy any existing PDF as a placeholder
cp references/LinkedIn_Profile_2026_04_24.pdf public/resume.pdf
```

(The owner is expected to overwrite `public/resume.pdf` with a polished export.)

- [ ] **Step 3: Add OG image placeholder**

For v1, create a 1200x630 PNG placeholder with the warm palette and the name. Quickest path: design later, ship a placeholder now. Either:

- Use any 1200x630 PNG in the repo as `public/og-image.png` for now, OR
- Generate one with a simple script later

For initial commit, copy or create any 1200x630 PNG into `public/og-image.png`. Note in README "OG image placeholder — replace with designed version".

- [ ] **Step 4: Create `public/favicon.svg` (warm-palette monogram)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#a8896c"/>
  <text x="50%" y="58%" text-anchor="middle" font-family="Inter, sans-serif" font-size="32" font-weight="700" fill="#faf7f1">W</text>
</svg>
```

- [ ] **Step 5: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://weinschutz.com.br/sitemap.xml
```

- [ ] **Step 6: Verify build copies them**

```bash
npm run build
```

Expected: `dist/CNAME`, `dist/resume.pdf`, `dist/og-image.png`, `dist/favicon.svg`, `dist/robots.txt` all present.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add CNAME, favicon, robots.txt, resume and OG placeholders"
```

---

### Task 27: Umami analytics snippet

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add Umami snippet to `index.html` `<head>`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gustavo Weinschütz — Senior Software Engineer</title>
    <script defer src="https://cloud.umami.is/script.js" data-website-id="a02de2cc-7989-4178-84ab-bd400ba45bf7"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 2: Verify snippet appears in built HTML**

```bash
npm run build
```

Check `dist/index.html` and `dist/blog/science-of-silence/index.html` — both should contain the Umami `<script defer ...>` tag.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add Umami Cloud analytics snippet"
```

---

### Task 28: Smoke test for App.vue

**Files:**
- Create: `tests/App.test.ts`

- [ ] **Step 1: Write smoke test**

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createHead } from '@unhead/vue'
import App from '@/App.vue'
import { routes } from '@/router'

describe('App', () => {
  it('mounts without errors', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    router.push('/')
    await router.isReady()
    const wrapper = mount(App, {
      global: {
        plugins: [router, createHead()],
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Skip to content')
  })
})
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: PASS — both `articles` (5 tests), `useTheme` (3 tests), and `App` (1 test) green.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "test: add App smoke test"
```

---

### Task 29: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Build & Deploy

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
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Typecheck
        run: npm run typecheck

      - name: Build
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "ci: add GitHub Actions deploy workflow for Pages"
```

- [ ] **Step 3: One-time post-push setup notes (document in README)**

After pushing to GitHub:

1. Create the GitHub repo (e.g. `gpweins/weinschutz`) and push: `git remote add origin git@github.com:gpweins/weinschutz.git && git push -u origin main`.
2. In repo Settings → Pages → Source: select **"GitHub Actions"**.
3. In repo Settings → Pages → Custom domain: enter `weinschutz.com.br`. Wait for the DNS check.
4. At the DNS registrar for `weinschutz.com.br`, set apex A records:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
5. (Optional) `www` CNAME → `gpweins.github.io`.
6. Once DNS propagates, enable "Enforce HTTPS" in repo Settings → Pages.

Append this to README under a "Deployment" section.

- [ ] **Step 4: Append to README**

Add to `README.md`:

```markdown
## Deployment (one-time setup)

After the initial push to GitHub:

1. **Repo Settings → Pages → Source:** select "GitHub Actions"
2. **Repo Settings → Pages → Custom domain:** enter `weinschutz.com.br`
3. **DNS at registrar (apex A records for `weinschutz.com.br`):**
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
4. **Optional `www` CNAME** → `gpweins.github.io`
5. After DNS propagates, enable **"Enforce HTTPS"** in Pages settings.

After this, every push to `main` triggers `.github/workflows/deploy.yml`, which runs tests, typecheck, build (vite-ssg), and deploys to Pages.
```

- [ ] **Step 5: Commit README update**

```bash
git add README.md
git commit -m "docs: add deployment one-time setup notes"
```

---

## Self-review

This plan covers each spec section:

| Spec section | Tasks |
|---|---|
| Stack | T1–T5 |
| Architecture (vite-ssg + SPA + markdown pipeline) | T3, T14, T22 |
| Site structure (5 sections + routes) | T15–T22 |
| Hero | T15 |
| Experience (left rail timeline) | T11, T16 |
| Skills | T12, T17 |
| Blog (preview, index, post) | T13, T14, T18, T21, T22 |
| Contact (Cal.com inline) | T19 |
| Nav + Footer | T8, T9 |
| Content pipeline (frontmatter, loader, slug, images) | T13, T14 |
| Theming (palette, dark mode, Inter) | T4, T5, T6, T7 |
| Motion (`@vueuse/motion`) | T23 |
| Accessibility (skip link, focus rings, semantic) | T4, T10, T16, T22 |
| File layout | T1–T29 (matches spec layout) |
| Deployment (CI, CNAME, DNS) | T26, T29 |
| Analytics (Umami) | T27 |
| SEO (head, sitemap, OG) | T24, T25, T26 |
| Resume PDF | T26 |
| Testing | T6, T14, T28 |
| .gitignore (incl. references/) | T1 |
| Local dev | README in T1, verified throughout |
| Adding new article | README in T1, T13 |

No spec gaps.

---

## Notes for the implementer

- TDD is enforced strictly only on the markdown loader (T14) and theme composable (T6). Visual sections are verified manually in the browser per the spec's "light by design" testing strategy.
- If any package version above doesn't resolve (e.g. Tailwind v4 channel changes), use `@latest` and adjust syntax to match the installed version's docs. Tailwind v4's `@theme` directive and CSS-first config are the load-bearing API choice.
- Vue 3.5+ provides `<script setup>` features used throughout. Don't downgrade.
- The `vite-ssg` `includedRoutes` API may require small adjustments depending on the installed version. The principle is: enumerate `/blog/<slug>` paths from `articlesPromise` and feed them to vite-ssg's route inclusion hook.
