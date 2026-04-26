/**
 * Pure markdown/frontmatter parsing pipeline. Used at build time by the
 * `virtual:articles` Vite plugin (see vite.config.ts) and by the test suite.
 *
 * Intentionally NOT imported by anything in the client bundle — that would
 * pull js-yaml, markdown-it, and Shiki/Oniguruma into the browser, where
 * WASM instantiation is treated as eval by strict CSPs.
 */
import yaml from 'js-yaml'
import MarkdownIt from 'markdown-it'
import { fromHighlighter } from '@shikijs/markdown-it/core'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import type { Article } from '@/types/article'

export type RawFile = { path: string; raw: string }

type Frontmatter = Record<string, unknown>

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fromHighlighter(highlighter as any, {
      themes: { light: 'github-light', dark: 'github-dark' },
    }),
  )
  mdInstance = md
  return md
}

// JSON_SCHEMA accepts only null/bool/number/string/array/object — no risky tags.
function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) return { data: {}, content: raw }
  const [, fm, body] = match
  const data = (yaml.load(fm, { schema: yaml.JSON_SCHEMA }) ?? {}) as Frontmatter
  return { data, content: body }
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
    const { data, content } = parseFrontmatter(file.raw)
    const slug = slugFromPath(file.path)
    const excerpt = (data.excerpt as string | undefined) ?? firstParagraph(content)
    const html = md.render(content)
    const date = String(data.date ?? '')
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
