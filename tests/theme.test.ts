import { beforeEach, describe, expect, it } from 'vitest';
import { applyInitialTheme, setTheme } from '../src/scripts/theme';

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('uses stored theme when set', () => {
    localStorage.setItem('theme', 'dark');
    applyInitialTheme();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('falls back to system preference when unset', () => {
    applyInitialTheme();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('setTheme writes attribute and persists', () => {
    setTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
