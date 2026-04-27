import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { readdirSync, readFileSync } from 'node:fs'
import generateSitemap from 'vite-ssg-sitemap'
import { loadArticlesFromRaw } from './src/content/articles-parser'

/**
 * Resolves `virtual:articles` to a precompiled JSON array. Runs the markdown
 * pipeline (gray-matter-free YAML parse, markdown-it, Shiki) once in Node at
 * build time, so the client bundle ships only the rendered HTML strings — no
 * parser, no WASM, nothing eval-adjacent.
 */
function articlesPrecompile(): Plugin {
  const VIRTUAL_ID = 'virtual:articles'
  const RESOLVED_ID = '\0' + VIRTUAL_ID
  const BLOG_DIR = path.resolve(__dirname, 'content/blog')

  return {
    name: 'articles-precompile',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    async load(id) {
      if (id !== RESOLVED_ID) return
      const filenames = readdirSync(BLOG_DIR).filter(
        (f) => f.endsWith('.md') && !f.startsWith('_'),
      )
      const files = filenames.map((name) => ({
        path: `/content/blog/${name}`,
        raw: readFileSync(path.join(BLOG_DIR, name), 'utf8'),
      }))
      const articles = await loadArticlesFromRaw(files)
      return `export const articles = ${JSON.stringify(articles)};`
    },
    configureServer(server) {
      // HMR: invalidate the virtual module when any blog .md changes.
      server.watcher.add(BLOG_DIR)
      const invalidate = (file: string) => {
        if (!file.startsWith(BLOG_DIR)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('change', invalidate)
      server.watcher.on('add', invalidate)
      server.watcher.on('unlink', invalidate)
    },
  }
}

export default defineConfig({
  base: '/weinschutz/',
  plugins: [vue(), tailwindcss(), articlesPrecompile()],
  build: {
    target: 'es2022',
  },
  esbuild: {
    target: 'es2022',
  },
  optimizeDeps: {
    esbuildOptions: { target: 'es2022' },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // @ts-expect-error — vite-ssg ssgOptions
  ssgOptions: {
    includedRoutes: (paths: string[]) => {
      const dir = path.resolve(__dirname, 'content/blog')
      const slugs = readdirSync(dir)
        .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
        .map((f) => f.replace(/\.md$/, ''))
      const blogPaths = slugs.map((slug) => `/blog/${slug}`)
      return [...paths.filter((p) => !p.includes(':')), ...blogPaths]
    },
    onFinished() {
      generateSitemap({
        hostname: 'https://gpweins.github.io/weinschutz/',
      })
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    exclude: ['node_modules', 'dist', 'references/**'],
  },
})
