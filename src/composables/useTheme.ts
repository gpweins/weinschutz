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
