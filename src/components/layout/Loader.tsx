import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../../motion/language';
import srhpLogo from '../../img/srhp_logo.webp';

const SEEN_KEY = 'srhp_loader_seen';
const FAILSAFE_MS = 9000;
const SLATS = 9;

interface LoaderProps {
  /** Fired the moment the shutter starts opening, so the page can begin its own intro. */
  onReveal: () => void;
  /** Fired after the shutter is fully open, so the loader can be unmounted. */
  onDone: () => void;
}

type Phase = 'count' | 'title' | 'open';

/** 00:00:SS:FF — the running timecode printed on a film leader. */
const leaderTimecode = (progress: number) => {
  const total = progress * 3;
  const s = Math.floor(total);
  const f = Math.floor((total - s) * 24);
  return `00:00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
};

/**
 * Opening title: an academy countdown leader (3 · 2 · 1) driven by real load progress.
 * When the page is ready the count resolves into the SRHP logo, and a
 * venetian-blind shutter opens onto the hero.
 */
export const Loader = ({ onReveal, onDone }: LoaderProps) => {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>('count');

  const returning = useRef(typeof window !== 'undefined' && !!sessionStorage.getItem(SEEN_KEY));
  const minMs = reduced ? 900 : returning.current ? 2300 : 3900;

  /* lock scroll while the leader plays */
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prev;
    };
  }, []);

  /* real readiness (window load + fonts) combined with a minimum show time */
  useEffect(() => {
    let raf = 0;
    let ready = false;
    let finished = false;
    const start = performance.now();

    const markReady = () => {
      ready = true;
    };
    const loaded = new Promise<void>((res) => {
      if (document.readyState === 'complete') res();
      else window.addEventListener('load', () => res(), { once: true });
    });
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.all([loaded, fonts]).then(markReady).catch(markReady);

    const tick = (now: number) => {
      const t = now - start;
      const timed = Math.min(t / minMs, 1);
      const eased = 1 - Math.pow(1 - timed, 2);
      /* hold at 94% until the page is genuinely ready */
      const target = ready || t > FAILSAFE_MS ? eased : Math.min(eased, 0.94);
      setProgress(target);
      if (target >= 0.999 && !finished) {
        finished = true;
        setProgress(1);
        setPhase('title');
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [minMs]);

  /* title card → shutter → unmount */
  useEffect(() => {
    if (phase === 'title') {
      sessionStorage.setItem(SEEN_KEY, '1');
      const t = setTimeout(() => setPhase('open'), reduced ? 200 : returning.current ? 800 : 1300);
      return () => clearTimeout(t);
    }
    if (phase === 'open') {
      onReveal();
      const t = setTimeout(onDone, reduced ? 300 : 1500);
      return () => clearTimeout(t);
    }
  }, [phase, onReveal, onDone, reduced]);

  const digit = progress < 0.34 ? 3 : progress < 0.67 ? 2 : 1;
  const pct = Math.round(progress * 100);
  const counting = phase === 'count';
  const opening = phase === 'open';

  return (
    <div role="status" aria-live="polite" aria-label="Loading SRHP Films" className="fixed inset-0 z-[500] overflow-hidden">
      {/* ── Shutter slats: the whole background, they collapse to open ── */}
      {Array.from({ length: SLATS }).map((_, i) => (
        <motion.div
          key={i}
          aria-hidden
          className="absolute inset-x-0 bg-ink"
          style={{ top: `${(i * 100) / SLATS}%`, height: `calc(${100 / SLATS}% + 1px)` }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: opening ? 0 : 1 }}
          transition={{ duration: reduced ? 0.01 : 0.85, delay: reduced ? 0 : i * 0.05, ease: EASE.inOut }}
        />
      ))}

      {/* ── Scene ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: reduced ? 0.01 : 0.45 }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(55% 55% at 50% 50%, rgb(var(--c-champagne) / 0.1), transparent 70%)' }}
        />
        <div aria-hidden className="grain absolute inset-0" />

        {/* leader */}
        <motion.div
          className="relative aspect-square w-[min(74vw,54svh,460px)]"
          animate={{ opacity: counting ? 1 : 0, scale: counting ? 1 : 1.12 }}
          transition={{ duration: reduced ? 0.01 : 0.5, ease: EASE.out }}
        >
          {/* crosshair runs past the ring */}
          <span aria-hidden className="absolute -inset-x-[16%] top-1/2 h-px bg-champagne/30" />
          <span aria-hidden className="absolute -inset-y-[16%] left-1/2 w-px bg-champagne/30" />
          {/* ring + sweep */}
          <span aria-hidden className="absolute inset-0 rounded-full border border-ivory/25" />
          <span aria-hidden className="absolute inset-[13%] rounded-full border border-ivory/15" />
          <span aria-hidden className="leader-sweep absolute inset-0 rounded-full" />
          <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-ivory/50">
            <circle cx="50" cy="50" r="48.6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeDasharray="0.3 4.78" />
          </svg>

          {/* the count */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={digit}
                className="font-title text-[clamp(6rem,24vmin,15rem)] font-black leading-none text-ivory"
                initial={reduced ? false : { opacity: 0, scale: 1.3, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.86 }}
                transition={{ duration: 0.28, ease: EASE.out }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* logo card */}
        <motion.img
          src={srhpLogo}
          alt="SRHP Films"
          draggable={false}
          className="absolute left-1/2 top-1/2 h-[clamp(84px,20vw,210px)] w-auto max-w-[80vw] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_8px_30px_rgb(0_0_0_/_0.55)]"
          initial={{ opacity: 0, filter: 'blur(22px)', scale: 1.12 }}
          animate={counting ? { opacity: 0, filter: 'blur(22px)', scale: 1.12 } : { opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: reduced ? 0.01 : 0.9, ease: EASE.lens }}
        />

        {/* flash frame at the cut from count to title */}
        <AnimatePresence>
          {phase === 'title' && !reduced && (
            <motion.span
              key="flash"
              aria-hidden
              className="absolute inset-0 bg-ivory"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* progress */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-6 pb-7 sm:px-10 sm:pb-10">
          <span className="font-mono text-[0.72rem] tabular-nums tracking-wider text-champagne/80">{leaderTimecode(progress)}</span>
          <div className="relative mx-2 h-px flex-1 bg-champagne/20 sm:mx-6">
            <span className="absolute inset-y-0 left-0 bg-champagne" style={{ width: `${pct}%` }} />
          </div>
          <span className="font-title text-3xl font-bold leading-none tabular-nums text-champagne sm:text-4xl">
            {String(pct).padStart(2, '0')}
            <span className="ml-0.5 text-base text-champagne/70">%</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
