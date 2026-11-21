import { useEffect } from 'react';
import { pauseScroll, resumeScroll } from '../lib/scroll';

/** Locks page scroll (body + Lenis) while a modal / drawer is open. */
export const useModalLock = (open: boolean) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    pauseScroll();
    return () => {
      document.body.style.overflow = prev;
      resumeScroll();
    };
  }, [open]);
};
