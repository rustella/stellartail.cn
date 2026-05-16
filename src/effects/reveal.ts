export const initReveal = (): void => {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
  );

  elements.forEach((element) => observer.observe(element));
};
