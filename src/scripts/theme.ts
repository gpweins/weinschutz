export type Theme = 'light' | 'dark';

export function applyInitialTheme(): void {
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.dataset.theme = stored;
    return;
  }
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}

export function toggleTheme(): void {
  const current = document.documentElement.dataset.theme as Theme;
  setTheme(current === 'dark' ? 'light' : 'dark');
}
