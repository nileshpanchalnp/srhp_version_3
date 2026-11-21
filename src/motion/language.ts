import type { Variants } from 'framer-motion';

/**
 * SRHP motion language
 * ─────────────────────
 * Every animation in the site is built from the primitives below so the
 * whole experience moves with one voice:
 *
 *   EASE.out    – "lens" settle. Used for almost every reveal.
 *   EASE.inOut  – deliberate, weighted. Used for wipes and curtains.
 *   DUR         – four speeds only.
 *   VIEWPORT    – reveal once, slightly before the element is centred.
 *
 * Variants
 *   rise        – content settles upward (text blocks, captions)
 *   maskLine    – text slides up from behind a mask (headings)
 *   focusPull   – blur → sharp, the camera finds its subject
 *   clip*       – picture revealed through a moving mask
 */
type Bezier = [number, number, number, number];

export const EASE: Record<'out' | 'inOut' | 'lens', Bezier> = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.76, 0, 0.24, 1],
  lens: [0.16, 1, 0.3, 1],
};

export const DUR = { fast: 0.35, base: 0.7, slow: 1.1, cine: 1.6 } as const;

export const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE.out } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.slow, ease: EASE.out } },
};

export const maskLine: Variants = {
  hidden: { y: '112%' },
  visible: { y: '0%', transition: { duration: DUR.slow, ease: EASE.out } },
};

export const focusPull: Variants = {
  hidden: { opacity: 0, filter: 'blur(14px)', scale: 1.06 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: DUR.cine, ease: EASE.lens },
  },
};

export const clipUp: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: DUR.cine, ease: EASE.inOut } },
};

export const clipLeft: Variants = {
  hidden: { clipPath: 'inset(0% 100% 0% 0%)' },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: DUR.cine, ease: EASE.inOut } },
};

export const clipIris: Variants = {
  hidden: { clipPath: 'circle(0% at 50% 50%)' },
  visible: { clipPath: 'circle(75% at 50% 50%)', transition: { duration: DUR.cine, ease: EASE.inOut } },
};

/** Direction-aware page slide (pagination) */
export const slideDirection: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 56, filter: 'blur(6px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: DUR.base, ease: EASE.out } },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -56,
    filter: 'blur(6px)',
    transition: { duration: DUR.fast, ease: EASE.inOut },
  }),
};
