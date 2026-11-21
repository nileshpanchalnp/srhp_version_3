import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

interface Props {
  from: number;
  to: number;
  duration?: number;
}

/** Counts up once when scrolled into view. Cleans up its animation on unmount. */
export const AnimatedCounter = ({ from, to, duration = 2 }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduced) {
      node.textContent = String(to);
      return;
    }
    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, from, to, duration, reduced]);

  return <span ref={ref}>{from}</span>;
};
