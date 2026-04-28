import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initReveal } from '../src/scripts/reveal';

class MockIO {
  callback: IntersectionObserverCallback;
  constructor(cb: IntersectionObserverCallback) { this.callback = cb; }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  fire(el: Element, isIntersecting: boolean) {
    this.callback([{ target: el, isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

describe('reveal', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it('adds ws-in class when element intersects', () => {
    const el = document.createElement('div');
    el.setAttribute('data-fade', '');
    document.body.appendChild(el);

    let mock!: MockIO;
    (globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
      vi.fn((cb: IntersectionObserverCallback) => { mock = new MockIO(cb); return mock as unknown as IntersectionObserver; }) as unknown as typeof IntersectionObserver;

    initReveal();
    expect(mock.observe).toHaveBeenCalledWith(el);
    mock.fire(el, true);
    expect(el.classList.contains('ws-in')).toBe(true);
    expect(mock.unobserve).toHaveBeenCalledWith(el);
  });
});
