import { describe, it, expect } from 'vitest'
import { loadArticlesFromRaw } from '@/content/articles'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
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
