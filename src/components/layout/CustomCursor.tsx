import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '../../hooks/useFinePointer';

/**
 * Lens-ring cursor.
 *  • Only mounts on devices with a precise hover pointer (never touch).
 *  • The native cursor is hidden only while the mouse is in use; any key press
 *    (Tab navigation) brings it straight back.
 *  • Listeners are attached once and removed on unmount.
 */
export const CustomCursor = () => {
  const fine = useFinePointer();
  const ringRef = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(-100), { stiffness: 420, damping: 32 });
  const y = useSpring(useMotionValue(-100), { stiffness: 420, damping: 32 });

  useEffect(() => {
    if (!fine) return;
    const root = document.documentElement;
    const ring = ringRef.current;

    const onMove = (e: MouseEvent) => {
      root.classList.add('cursor-custom');
      x.set(e.clientX);
      y.set(e.clientY);
      if (ring) ring.style.opacity = '1';
    };
    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest(
        'a, button, [role="button"], input, textarea, label, [data-cursor="view"]'
      );
      ring?.setAttribute('data-active', el ? 'true' : 'false');
    };
    const onKey = () => {
      root.classList.remove('cursor-custom');
      if (ring) ring.style.opacity = '0';
    };
    const onLeave = () => {
      if (ring) ring.style.opacity = '0';
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('keydown', onKey);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('keydown', onKey);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      root.classList.remove('cursor-custom');
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <motion.div
      ref={ringRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[400] opacity-0 transition-opacity duration-300 data-[active=true]:[&>span:first-child]:scale-[2.2] data-[active=true]:[&>span:first-child]:bg-champagne/15"
      style={{ x, y }}
    >
      <span className="block h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/70 transition-transform duration-300 ease-cine" />
      <span className="absolute left-0 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne" />
    </motion.div>
  );
};
