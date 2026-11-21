import { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { Marquee } from '../motion/Marquee';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { GENRES } from '../../data/siteContent';

/**
 * Section-to-section transitions.
 * Each one is a short scene that hands one section's lighting to the next.
 * They never capture scroll or add delay — they only respond to where the visitor already is.
 *
 *   Hero  → About  : the About page rises over the pinned hero (see HeroSection + Home)
 *   About → Films  : two strips of film cross, carrying the genres from paper to dark
 *   Films → News   : the press sheet slides up over the last film (see NewsSection)
 *   News  → Contact: a studio lamp is switched on over the contact slate
 */

/* ── About → Films ── */
export const GenreBands = () => (
  <div
    aria-hidden
    className="relative z-10 overflow-hidden py-16 md:py-24"
    style={{ background: 'linear-gradient(to bottom, rgb(var(--c-paper)) 0 50%, rgb(var(--c-ink)) 50% 100%)' }}
  >
    <div className="relative h-[8.5rem] md:h-[11.5rem]">
      {/* champagne strip, rising to the right */}
      <div className="absolute inset-x-[-6%] top-1/2 -translate-y-1/2 -rotate-[2.4deg] bg-champagne py-3 text-ink shadow-plate md:py-4">
        <Marquee duration={42}>
          {GENRES.map((g) => (
            <span key={g} className="flex items-center gap-10 pr-10 font-title text-[2.6rem] font-extrabold uppercase leading-none md:text-[4.2rem]">
              {g}
              <span className="block h-2.5 w-2.5 rotate-45 bg-ink md:h-3 md:w-3" />
            </span>
          ))}
        </Marquee>
      </div>
      {/* dark strip, falling to the right, running the other way */}
      <div className="absolute inset-x-[-6%] top-1/2 -translate-y-1/2 rotate-[1.8deg] border-y border-champagne/60 bg-ink py-3 text-ivory shadow-plate md:py-4">
        <Marquee duration={52} reverse>
          {GENRES.map((g) => (
            <span
              key={g}
              className="text-outline flex items-center gap-10 pr-10 font-title text-[2.6rem] font-extrabold uppercase leading-none [--outline:rgb(var(--c-ivory)/0.8)] md:text-[4.2rem]"
            >
              {g}
              <span className="block h-2.5 w-2.5 rotate-45 bg-champagne md:h-3 md:w-3" />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  </div>
);

/* ── News → Contact ── */
export const LampBridge = () => {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(ref, ['start end', 'end 0.55']);

  const cable = useTransform(p, [0, 0.3], [0, 1]);
  /* the lamp stutters on, then holds */
  const lamp = useTransform(p, [0.28, 0.31, 0.34, 0.37, 0.42], [0, 0.95, 0.2, 0.95, 1]);
  const beamOpacity = useTransform(p, [0.3, 0.45, 1], [0, 0.85, 0.7]);
  const beamScale = useTransform(p, [0.3, 0.8], [0.35, 1]);
  const glow = 'radial-gradient(40% 36% at 50% 34%, rgb(var(--c-champagne) / 0.22), transparent 70%)';

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative h-[78svh] min-h-[520px] overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, rgb(var(--c-newsprint)) 0%, rgb(var(--c-newsprint)) 5%, rgb(var(--c-ink)) 58%)' }}
    >
      {/* cable */}
      <motion.span
        className="absolute left-1/2 top-0 h-[26%] w-px origin-top bg-ink/70"
        style={{ scaleY: cable }}
      />

      {/* beam */}
      <motion.div
        className="absolute left-1/2 top-[26%] h-[74%] w-[min(150vw,1400px)] origin-top -translate-x-1/2"
        style={{
          opacity: beamOpacity,
          scaleY: beamScale,
          clipPath: 'polygon(47.5% 0, 52.5% 0, 100% 100%, 0 100%)',
          background: 'linear-gradient(to bottom, rgb(var(--c-champagne) / 0.7), rgb(var(--c-champagne) / 0.14) 62%, transparent 95%)',
        }}
      />
      <motion.div className="absolute inset-0" style={{ opacity: lamp, background: glow }} />

      {/* lamp */}
      <motion.svg
        viewBox="0 0 120 70"
        className="absolute left-1/2 top-[26%] h-[clamp(52px,9vw,84px)] w-auto -translate-x-1/2"
        style={{ opacity: cable }}
      >
        <path d="M44 0h32l34 52H10z" fill="rgb(var(--c-ink))" stroke="rgb(var(--c-champagne))" strokeOpacity="0.55" strokeWidth="1.2" />
        <motion.ellipse cx="60" cy="56" rx="30" ry="9" fill="rgb(var(--c-champagne))" style={{ opacity: lamp }} />
        <ellipse cx="60" cy="52" rx="50" ry="3" fill="rgb(var(--c-ink))" />
      </motion.svg>
    </div>
  );
};
