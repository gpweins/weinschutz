import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { readdirSync } from 'node:fs'
import generateSitemap from 'vite-ssg-sitemap'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
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
        hostname: 'https://weinschutz.com.br/',
      })
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    exclude: ['node_modules', 'dist', 'references/**'],
  },
})
