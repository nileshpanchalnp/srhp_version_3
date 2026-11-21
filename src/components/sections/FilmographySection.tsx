import { useRef, useState } from 'react';
import { motion, MotionValue, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FilmModal } from '../filmography/FilmModal';
import { MaskText } from '../motion/MaskText';
import { Tilt } from '../motion/Tilt';
import { CineButton } from '../ui/CineButton';
import { useFilms } from '../../hooks/useFilms';
import { FILM_TINTS, PLATFORM_LOGOS, pad } from '../../lib/filmUtils';
import { VIEWPORT } from '../../motion/language';
import { IFilm } from '../../types/film.types';
import imdb_logo from '../../img/imdb_logo.png';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

interface PanelProps {
  film: IFilm;
  i: number;
  n: number;
  /** 0 → 1 across the whole stack */
  p: MotionValue<number>;
  onOpen: (film: IFilm, autoplay: boolean) => void;
}

/**
 * One film = one scene. Panels are pinned to the top of the screen; the next film
 * slides up over the current one, which recedes and dims as it is covered.
 */
const FilmScene = ({ film, i, n, p, onOpen }: PanelProps) => {
  const reduced = useReducedMotion();
  const still = useMotionValue(0);

  /* how far this scene has been covered / how far it has arrived (0 → 1) */
  const coveredRaw = useTransform(p, (v) => clamp(v * (n - 1) - i, 0, 1));
  const arrivedRaw = useTransform(p, (v) => (i === 0 ? 1 : clamp(v * (n - 1) - (i - 1), 0, 1)));
  const covered = reduced ? still : coveredRaw;
  const arrived = reduced ? still : arrivedRaw;

  const scale = useTransform(covered, [0, 1], [1, 0.92]);
  const dim = useTransform(covered, [0, 1], [0, 0.8]);
  const bgScale = useTransform(arrived, [0, 1], [i === 0 ? 1 : 1.18, 1]);
  const posterY = useTransform(arrived, [0, 1], [i === 0 ? 0 : 90, 0]);
  const textY = useTransform(arrived, [0, 1], [i === 0 ? 0 : 150, 0]);
  const yearY = useTransform(arrived, [0, 1], [i === 0 ? 0 : -60, 0]);

  const tint = FILM_TINTS[i % FILM_TINTS.length];
  const released = film.status === 'Released';

  return (
    <div className="sticky top-0 h-[100svh]" style={{ zIndex: i + 1 }}>
      <motion.article
        className="relative h-full w-full origin-top overflow-hidden bg-ink shadow-[0_-30px_70px_-20px_rgb(0_0_0/0.8)]"
        style={{ scale }}
        aria-label={film.title}
      >
        {/* picture: portrait on phones, wide still on larger screens */}
        <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
          <img src={film.posterUrl} alt="" draggable={false} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top md:hidden" />
          <img
            src={film.heroPosterUrl ?? film.posterUrl}
            alt=""
            draggable={false}
            loading="lazy"
            className="absolute inset-0 hidden h-full w-full object-cover object-top md:block"
          />
        </motion.div>
        {/* each film has its own light */}
        <div aria-hidden className="absolute inset-0 mix-blend-soft-light" style={{ background: `linear-gradient(150deg, ${tint}, transparent 70%)` }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/35 md:via-ink/55" />
        <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-r from-ink/90 via-ink/45 to-transparent md:block" />
        <div aria-hidden className="grain absolute inset-0" />

        {/* the year, as a huge outline behind the title */}
        <motion.span
          aria-hidden
          className="text-outline pointer-events-none absolute -right-[2vw] top-[14%] select-none font-title text-[clamp(9rem,34vw,34rem)] font-black leading-none opacity-[0.22] [--outline:rgb(var(--c-ivory))]"
          style={{ y: yearY }}
        >
          {film.year}
        </motion.span>

        <div className="relative z-10 mx-auto grid h-full max-w-[1500px] grid-cols-1 items-end gap-10 px-5 pb-14 pt-24 md:px-12 md:pb-16 lg:grid-cols-12 lg:items-center lg:pb-16 lg:pt-28">
          {/* one-sheet */}
          <motion.div className="hidden lg:col-span-4 lg:block" style={{ y: posterY }}>
            <Tilt max={6} className="group mx-auto w-[min(100%,340px)]">
              <button
                type="button"
                onClick={() => onOpen(film, false)}
                aria-haspopup="dialog"
                aria-label={`Open details for ${film.title}`}
                className="relative block w-full overflow-hidden shadow-plate ring-1 ring-ivory/20"
              >
                <img src={film.posterUrl} alt={`${film.title} poster`} draggable={false} className="aspect-[2/3] w-full object-cover" />
              </button>
            </Tilt>
          </motion.div>

          {/* story */}
          <motion.div className="lg:col-span-8" style={{ y: textY }}>
            <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[1rem] text-ivory/80">
              {!released && <span className="bg-oxblood px-2.5 py-1 text-[0.85rem] font-medium text-ivory">{film.status}</span>}
              <span>{film.year}</span>
              <span>{film.genre.join(', ')}</span>
              {film.type && <span className="text-champagne">{film.type}</span>}
            </div>

            <h3 className="font-title text-[clamp(3.3rem,10.5vw,10rem)] font-black uppercase leading-[0.86] text-ivory">{film.title}</h3>

            <p className="mt-6 line-clamp-4 max-w-[58ch] font-display text-[1.1rem] italic leading-relaxed text-ivory/85 md:line-clamp-5 md:text-[1.2rem] xl:line-clamp-none">
              {film.synopsis}
            </p>

            {(film.platform.length > 0 || film.rating > 0) && (
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                {film.platform.map((pl) =>
                  PLATFORM_LOGOS[pl] ? (
                    <span key={pl} className="flex h-7 items-center bg-ivory/90 px-2">
                      <img src={PLATFORM_LOGOS[pl]} alt={pl} className="h-[18px] w-auto object-contain" />
                    </span>
                  ) : (
                    <span key={pl} className="border border-ivory/25 px-2 py-1 text-[0.9rem] text-ivory/80">
                      {pl}
                    </span>
                  )
                )}
                {film.rating > 0 && (
                  <span className="inline-flex items-center gap-2.5">
                    <img src={imdb_logo} alt="IMDb" className="h-4 w-auto object-contain opacity-85" />
                    <span className="font-title text-2xl font-bold leading-none text-ivory">
                      {film.rating}
                      <span className="text-base text-mute">/10</span>
                    </span>
                  </span>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpen(film, false)}
                aria-haspopup="dialog"
                className="bg-champagne px-7 py-3.5 font-title text-[1.15rem] font-bold uppercase tracking-[0.06em] text-ink transition-colors duration-300 hover:bg-ivory"
              >
                View film
              </button>
              {film.trailerUrl && (
                <button
                  type="button"
                  onClick={() => onOpen(film, true)}
                  aria-haspopup="dialog"
                  className="flex items-center gap-3 border border-ivory/35 px-6 py-3.5 font-title text-[1.15rem] font-bold uppercase tracking-[0.06em] text-ivory transition-colors duration-300 hover:border-champagne hover:text-champagne"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch trailer
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* position in the programme */}
        <p className="absolute bottom-4 right-5 z-10 font-mono text-[0.78rem] tabular-nums text-ivory/70 md:right-12">
          {pad(i + 1)}
          <span className="text-ivory/35"> / {pad(n)}</span>
        </p>

        {/* dims as the next film covers it */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-ink" style={{ opacity: dim }} />
      </motion.article>
    </div>
  );
};

export const FilmographySection = () => {
  const { films, loading } = useFilms();
  const [selected, setSelected] = useState<{ film: IFilm; autoplay: boolean } | null>(null);
  const navigate = useNavigate();
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

  return (
    <section id="films" className="relative bg-ink">
      <div aria-hidden className="grain pointer-events-none absolute inset-x-0 top-0 h-[70vh]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
        style={{ background: 'radial-gradient(70% 60% at 50% 0%, rgb(var(--c-bronze) / 0.16), transparent 70%)' }}
      />

      <header className="relative mx-auto max-w-[1500px] px-5 pb-16 pt-24 md:px-12 md:pb-24 md:pt-32">
        <MaskText as="h2" text="Filmography" className="block font-title text-[clamp(4.4rem,17vw,16rem)] font-black uppercase leading-[0.84] text-ivory" />
        <div className="mt-8 flex flex-col gap-6 border-t border-ivory/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl italic text-mute md:text-2xl">Selected Works</p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT} transition={{ delay: 0.4 }}>
            <CineButton onClick={() => navigate('/films')}>Explore All Films</CineButton>
          </motion.div>
        </div>
      </header>

      {loading ? (
        <div className="relative py-24 text-center text-lg text-mute" role="status">
          Loading archive…
        </div>
      ) : films.length === 0 ? (
        <p className="relative px-4 py-24 text-center font-display text-2xl italic text-mute">No films found.</p>
      ) : (
        <div ref={stackRef} className="relative">
          {films.map((film, i) => (
            <FilmScene key={film.id} film={film} i={i} n={films.length} p={scrollYProgress} onOpen={(f, autoplay) => setSelected({ film: f, autoplay })} />
          ))}
        </div>
      )}

      <FilmModal film={selected?.film ?? null} autoplay={selected?.autoplay} onClose={() => setSelected(null)} />
    </section>
  );
};
