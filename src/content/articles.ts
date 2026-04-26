import yaml from 'js-yaml'
import MarkdownIt from 'markdown-it'
import { fromHighlighter } from '@shikijs/markdown-it/core'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import type { Article } from '@/types/article'

type RawFile = { path: string; raw: string }

type Frontmatter = Record<string, unknown>

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

/**
 * Tiny frontmatter parser. Replaces gray-matter to keep eval-using code paths
 * (gray-matter's JS engine, js-yaml's !!js/function tag) out of the client
 * bundle — both are flagged by strict CSPs even when never executed.
 *
 * Uses js-yaml's JSON_SCHEMA which only accepts null/bool/int/float/string/
 * array/object — no function or timestamp tags. Dates are kept as strings
 * (which is what we want anyway).
 */
function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) return { data: {}, content: raw }
  const [, fm, body] = match
  const data = (yaml.load(fm, { schema: yaml.JSON_SCHEMA }) ?? {}) as Frontmatter
  return { data, content: body }
}

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

const modules = import.meta.glob('/content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const files: RawFile[] = Object.entries(modules)
  .filter(([path]) => !path.endsWith('/_template.md'))
  .map(([path, raw]) => ({ path, raw }))

export const articles: Article[] = await loadArticlesFromRaw(files)
