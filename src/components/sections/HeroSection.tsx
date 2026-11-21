import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { FilmModal } from '../filmography/FilmModal';
import { useFilms } from '../../hooks/useFilms';
import { useFinePointer } from '../../hooks/useFinePointer';
import { useIntroReady } from '../../context/IntroContext';
import { pad } from '../../lib/filmUtils';
import { scrollToElement } from '../../lib/scroll';
import { EASE } from '../../motion/language';
import { IFilm } from '../../types/film.types';

/** How long each film is highlighted when nobody is pointing at the list. */
const AUTOPLAY_MS = 6500;
const COUNT = 5;

const vh = () => (typeof window === 'undefined' ? 800 : window.innerHeight);

/**
 * Hero: the film titles ARE the navigation.
 * A full-bleed still sits behind a stacked list of titles; pointing at (or tabbing to)
 * a title brings its still forward. The section pins to the top of the page and the
 * About section rises over it like a curtain.
 */
export const HeroSection = () => {
  const { films: allFilms } = useFilms();
  const films = allFilms.slice(0, COUNT);
  const count = films.length;

  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const [selected, setSelected] = useState<{ film: IFilm; autoplay: boolean } | null>(null);

  const ready = useIntroReady();
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);

  /* ── scroll: the hero is covered, not scrolled away ── */
  const { scrollY } = useScroll();
  const coveredRef = useRef(false);
  useMotionValueEvent(scrollY, 'change', (v) => {
    coveredRef.current = v > vh() * 0.9;
  });
  const contentOpacity = useTransform(scrollY, (v) => 1 - Math.min(1, v / (vh() * 0.75)));
  const contentLift = useTransform(scrollY, (v) => -Math.min(v, vh()) * 0.2);
  const stageScale = useTransform(scrollY, (v) => 1 + Math.min(v / vh(), 1) * 0.1);
  const veil = useTransform(scrollY, (v) => Math.min(1, v / (vh() * 0.95)) * 0.85);

  const go = useCallback(
    (next: number) => {
      if (!count) return;
      progress.set(0);
      setIndex(((next % count) + count) % count);
    },
    [count, progress]
  );

  /* ── autoplay: one clock drives the highlight and the underline ── */
  const indexRef = useRef(index);
  indexRef.current = index;
  const paused = hold || selected !== null;
  useEffect(() => {
    if (!ready || count < 2 || paused || reduced) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      if (!document.hidden && !coveredRef.current) {
        const next = progress.get() + dt / AUTOPLAY_MS;
        if (next >= 1) go(indexRef.current + 1);
        else progress.set(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, count, paused, reduced, go, progress]);

  const film = films[index] ?? null;

  const onRowClick = (i: number) => {
    if (fine || i === index) setSelected({ film: films[i], autoplay: false });
    else go(i);
  };

  return (
    <>
      <section
        id="home"
        aria-label="Featured films"
        className="sticky top-0 isolate h-[100svh] w-full overflow-hidden bg-ink"
      >
        {/* ── Stage: every still is mounted, the active one is brought forward ── */}
        <motion.div className="absolute inset-0 z-0" style={{ scale: reduced ? 1 : stageScale }}>
          {films.map((f, i) => {
            const on = i === index;
            return (
              <motion.div
                key={f.id}
                aria-hidden
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 1.08 }}
                transition={{ duration: reduced ? 0.01 : 1.3, ease: EASE.lens }}
              >
                <img
                  src={f.posterUrl}
                  alt=""
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="absolute inset-0 h-full w-full object-cover object-top md:hidden"
                />
                <img
                  src={f.heroPosterUrl ?? f.posterUrl}
                  alt=""
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="absolute inset-0 hidden h-full w-full object-cover object-top md:block"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* lighting: keeps the list legible without flattening the picture */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-ink/90 via-ink/40 to-transparent" />
        <div aria-hidden className="grain pointer-events-none absolute inset-0 z-[1]" />
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-[3] bg-ink" style={{ opacity: veil }} />

        {/* ── Content ── */}
        <motion.div
          className="relative z-[2] mx-auto flex h-full w-full max-w-[1600px] flex-col justify-end px-5 pb-16 pt-28 md:px-12 md:pb-20 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:px-16"
          style={{ opacity: contentOpacity, y: reduced ? 0 : contentLift }}
        >
          {/* the title index */}
          <ul
            className="w-full lg:max-w-[880px]"
            onMouseEnter={() => setHold(true)}
            onMouseLeave={() => setHold(false)}
          >
            {films.map((f, i) => {
              const active = i === index;
              return (
                <li key={f.id} className="relative overflow-hidden border-b border-ivory/12 first:border-t">
                  <button
                    type="button"
                    onMouseEnter={() => fine && go(i)}
                    onFocus={() => go(i)}
                    onClick={() => onRowClick(i)}
                    aria-haspopup="dialog"
                    aria-current={active}
                    className="group flex w-full items-baseline justify-between gap-6 py-[clamp(0.3rem,1.2svh,0.9rem)] text-left"
                  >
                    <span className="block overflow-hidden pb-[0.04em]">
                      <motion.span
                        className={`block font-title text-[clamp(2.3rem,min(8.2vw,10.5svh),6.6rem)] font-black uppercase leading-[0.9] tracking-[0.005em] transition-[color,padding] duration-500 ease-cine ${
                          active ? 'pl-4 text-ivory' : 'pl-0 text-ivory/25 group-hover:text-ivory/60'
                        }`}
                        initial={{ y: '112%' }}
                        animate={ready ? { y: '0%' } : { y: '112%' }}
                        transition={{ delay: 0.35 + i * 0.09, duration: 1, ease: EASE.out }}
                      >
                        {f.title}
                      </motion.span>
                    </span>
                    <span
                      className={`hidden shrink-0 text-right text-[0.95rem] leading-snug transition-opacity duration-500 sm:block ${
                        active ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span className="block text-ivory">{f.year}</span>
                      <span className="block text-ivory/60">{f.genre.join(', ')}</span>
                    </span>
                  </button>
                  {active && count > 1 && !reduced && (
                    <motion.span
                      aria-hidden
                      className="absolute bottom-0 left-0 h-px w-full origin-left bg-champagne"
                      style={{ scaleX: progress }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* the one-sheet for the highlighted film */}
          <div className="mt-6 hidden w-[clamp(220px,19vw,300px)] shrink-0 lg:mt-0 lg:block">
            <AnimatePresence mode="wait" initial={false}>
              {film && (
                <motion.div
                  key={film.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: ready ? 1 : 0, y: 0, transition: { duration: 0.8, delay: ready ? 0.1 : 0, ease: EASE.out } }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                >
                  <div className="relative mb-5 aspect-[2/3] w-[58%] overflow-hidden shadow-plate ring-1 ring-ivory/15">
                    <img src={film.posterUrl} alt={`${film.title} poster`} draggable={false} className="h-full w-full object-cover" />
                    {film.status !== 'Released' && (
                      <span className="absolute left-0 top-0 bg-oxblood px-2.5 py-1 text-[0.72rem] font-medium text-ivory">{film.status}</span>
                    )}
                  </div>
                  <p className="line-clamp-4 font-display text-[1.05rem] italic leading-relaxed text-ivory/85">{film.synopsis}</p>
                  <button
                    type="button"
                    onClick={() => setSelected({ film, autoplay: false })}
                    aria-haspopup="dialog"
                    className="group mt-5 inline-flex items-center gap-4 font-title text-[1.15rem] font-bold uppercase tracking-[0.06em] text-champagne transition-colors hover:text-ivory"
                  >
                    View film
                    <span aria-hidden className="h-px w-10 bg-current transition-all duration-500 ease-cine group-hover:w-16" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* mobile: details for the highlighted film */}
          {film && (
            <div className="mt-5 flex items-center justify-between gap-4 lg:hidden">
              <p className="min-w-0 text-[0.95rem] text-ivory/75">
                {film.year} <span className="text-ivory/40">/</span> {film.genre.join(', ')}
              </p>
              <button
                type="button"
                onClick={() => setSelected({ film, autoplay: false })}
                aria-haspopup="dialog"
                className="shrink-0 bg-champagne px-5 py-2.5 font-title text-base font-bold uppercase tracking-[0.06em] text-ink"
              >
                View film
              </button>
            </div>
          )}
        </motion.div>

        {/* ── Bottom bar: position, scroll cue, manual controls ── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-[4] flex items-center justify-between px-5 pb-4 md:px-12 lg:px-16"
          style={{ opacity: contentOpacity }}
        >
          <p className="font-mono text-[0.78rem] tabular-nums text-ivory/70">
            {pad(index + 1)}
            <span className="text-ivory/35"> / {pad(Math.max(count, 1))}</span>
          </p>

          <button
            type="button"
            onClick={() => scrollToElement(document.getElementById('about'))}
            className="group hidden items-center gap-3 text-[0.9rem] text-ivory/70 transition-colors hover:text-champagne md:flex"
          >
            Scroll
            <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-ivory/25">
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-champagne"
                animate={reduced ? undefined : { y: ['-100%', '280%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </button>

          {count > 1 && (
            <div className="flex items-center gap-2">
              {(['prev', 'next'] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => go(index + (dir === 'next' ? 1 : -1))}
                  aria-label={dir === 'next' ? 'Next film' : 'Previous film'}
                  className="flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory/80 transition-colors hover:border-champagne hover:text-champagne"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d={dir === 'next' ? 'M5 2l5 5-5 5' : 'M9 2 4 7l5 5'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      <FilmModal film={selected?.film ?? null} autoplay={selected?.autoplay} onClose={() => setSelected(null)} />
    </>
  );
};
