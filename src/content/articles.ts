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

export const articles: Article[] = await loadArticlesFromRaw(files)
