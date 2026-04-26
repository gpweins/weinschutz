/**
 * Browser entry. Resolves to a precompiled JSON array via the
 * `articles-precompile` Vite plugin (see vite.config.ts), so the client
 * bundle ships zero markdown/YAML/highlighter code.
 */
export type { Article } from '@/types/article'
export { articles } from 'virtual:articles'
