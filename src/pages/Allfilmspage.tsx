import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FilmCard } from '../components/filmography/FilmCard';
import { FilmModal } from '../components/filmography/FilmModal';
import { MaskText } from '../components/motion/MaskText';
import { useFilms } from '../hooks/useFilms';
import { EASE } from '../motion/language';
import { IFilm } from '../types/film.types';

type FilterType = 'all' | 'Released' | 'Upcoming';

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'Released', label: 'Released' },
  { key: 'Upcoming', label: 'Upcoming' },
];

/**
 * The full archive as a poster wall. The first title on the wall takes a double-size
 * tile, the rest tile around it. Filtering re-lays the wall with a shared-layout animation.
 */
export const AllFilmsPage = () => {
  const { films, loading } = useFilms();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedFilm, setSelectedFilm] = useState<IFilm | null>(null);
  const navigate = useNavigate();

  const filteredFilms = films.filter((f) => activeFilter === 'all' || f.status === activeFilter);
  const hasLead = filteredFilms.length >= 5;

  const goBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate('/');
  };

  return (
    <main id="main" className="grain relative min-h-screen overflow-hidden bg-midnight pb-28 pt-28 md:pt-36">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(70% 40% at 50% 0%, rgb(var(--c-bronze) / 0.18), transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 md:px-12">
        <button type="button" onClick={goBack} className="group flex items-center gap-3 text-[1rem] text-mute transition-colors hover:text-champagne">
          <span aria-hidden className="text-lg leading-none transition-transform duration-300 group-hover:-translate-x-1">←</span>
          Back
        </button>

        {/* title */}
        <header className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <h1 className="font-title text-[clamp(4.6rem,18vw,17rem)] font-black uppercase leading-[0.82] text-ivory">
            <MaskText text="Filmography" trigger="mount" delay={0.15} />
          </h1>
          <motion.p
            className="font-display text-xl italic text-mute md:pb-4 md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.9 } }}
            aria-live="polite"
          >
            {loading ? 'Loading titles…' : `${filteredFilms.length} ${filteredFilms.length === 1 ? 'title' : 'titles'}`}
          </motion.p>
        </header>

        {/* filters */}
        <motion.div
          className="mb-12 mt-12 border-y border-ivory/15 md:mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.8, ease: EASE.out } }}
        >
          <div role="group" aria-label="Filter films by status" className="flex">
            {filters.map(({ key, label }) => {
              const on = activeFilter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFilter(key)}
                  aria-pressed={on}
                  className="relative px-5 py-4 sm:px-8"
                >
                  <span className={`font-title text-[1.3rem] font-bold uppercase tracking-[0.06em] transition-colors duration-200 ${on ? 'text-champagne' : 'text-ivory/55 hover:text-ivory'}`}>
                    {label}
                  </span>
                  {on && (
                    <motion.span
                      layoutId="filter-mark"
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-[3px] bg-champagne"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" role="status" aria-label="Loading films">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse bg-surface" />
            ))}
          </div>
        )}

        {!loading && filteredFilms.length === 0 && (
          <p className="py-24 text-center font-display text-2xl italic text-mute">No films found.</p>
        )}

        {!loading && filteredFilms.length > 0 && (
          <motion.ul layout className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            <AnimatePresence mode="popLayout" initial>
              {filteredFilms.map((film, i) => {
                const lead = hasLead && i === 0;
                return (
                  <motion.li
                    key={film.id}
                    layout
                    initial={{ opacity: 0, y: 36 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.06 * i, ease: EASE.out } }}
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
                    className={lead ? 'col-span-2 row-span-2' : ''}
                  >
                    <FilmCard film={film} index={i} featured={lead} onOpenModal={setSelectedFilm} />
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        )}

        {!loading && filteredFilms.length > 0 && (
          <motion.div
            className="mt-24 flex items-center gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span aria-hidden className="sprockets h-[10px] flex-1 opacity-[0.12]" />
            <span className="font-display text-xl italic text-mute">End of archive</span>
            <span aria-hidden className="sprockets h-[10px] flex-1 opacity-[0.12]" />
          </motion.div>
        )}
      </div>

      <FilmModal film={selectedFilm} onClose={() => setSelectedFilm(null)} />
    </main>
  );
};
