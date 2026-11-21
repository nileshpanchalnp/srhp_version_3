import type Lenis from '@studio-freight/lenis';

/**
 * Single source of truth for programmatic scrolling.
 * App.tsx registers the Lenis instance; everything else (navbar, hero,
 * pagination, modals) goes through these helpers so smooth scrolling never
 * fights the browser's native scrollIntoView.
 */
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const scrollToTop = (immediate = false) => {
  if (instance) instance.scrollTo(0, { immediate, duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
};

export const scrollToElement = (el: HTMLElement | null, offset = 0) => {
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const pauseScroll = () => instance?.stop();
export const resumeScroll = () => instance?.start();
