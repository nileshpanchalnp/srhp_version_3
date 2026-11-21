import { RefObject } from 'react';
import { MotionValue, useMotionValue, useReducedMotion, useScroll } from 'framer-motion';

type Offset = NonNullable<Parameters<typeof useScroll>[0]>['offset'];

/**
 * 0 → 1 progress of `ref` travelling through the viewport.
 * Visitors who prefer reduced motion get a fixed, fully-resolved value so
 * scroll-linked transitions simply show their final state.
 */
export const useScrollProgress = (
  ref: RefObject<HTMLElement>,
  offset: Offset = ['start end', 'end start']
): MotionValue<number> => {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const resolved = useMotionValue(1);
  return reduced ? resolved : scrollYProgress;
};
