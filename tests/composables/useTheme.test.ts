import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  it('initializes from localStorage when set', async () => {
    localStorage.setItem('theme', 'dark')
    const { useTheme } = await import('@/composables/useTheme')
    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('falls back to prefers-color-scheme when no localStorage', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
    const { useTheme } = await import('@/composables/useTheme')
    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
  })

  it('toggle flips theme and persists to localStorage', async () => {
    const { useTheme } = await import('@/composables/useTheme')
    const { theme, toggle } = useTheme()
    const initial = theme.value
    toggle()
    await Promise.resolve()
    expect(theme.value).not.toBe(initial)
    expect(localStorage.getItem('theme')).toBe(theme.value)
    expect(document.documentElement.getAttribute('data-theme')).toBe(theme.value)
  })
})
