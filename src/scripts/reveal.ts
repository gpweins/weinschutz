export function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-fade]');
  if (els.length === 0) return;
  const io = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const delay = Number.parseInt(el.dataset.delay ?? '0', 10);
        if (delay > 0) {
          window.setTimeout(() => el.classList.add('ws-in'), delay);
        } else {
          el.classList.add('ws-in');
        }
        observer.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );
  els.forEach((el) => io.observe(el));
}
