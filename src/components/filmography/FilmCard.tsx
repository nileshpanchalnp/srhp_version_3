import { motion } from 'framer-motion';
import { IFilm } from '../../types/film.types';
import { CONTENT_RATING, FILM_TINTS, PLATFORM_LOGOS } from '../../lib/filmUtils';

interface FilmCardProps {
  film: IFilm;
  onOpenModal: (film: IFilm) => void;
  /** Position in the archive — drives the per-film light tint */
  index?: number;
  /** The lead title on the poster wall: larger type, fills the tile it is given */
  featured?: boolean;
}

/**
 * A poster on the wall. The picture runs edge to edge; the title is set over it
 * in film-title type. On hover or keyboard focus the synopsis and platforms slide up.
 */
export const FilmCard = ({ film, onOpenModal, index = 0, featured = false }: FilmCardProps) => {
  const isReleased = film.status === 'Released';
  const rating = film.contentRating ? CONTENT_RATING[film.contentRating] : null;
  const tint = FILM_TINTS[index % FILM_TINTS.length];

  return (
    <motion.button
      type="button"
      onClick={() => onOpenModal(film)}
      aria-haspopup="dialog"
      className={`group relative block w-full overflow-hidden bg-surface text-left ring-1 ring-ivory/10 transition-shadow duration-500 hover:ring-champagne/60 focus-visible:ring-champagne ${
        featured ? 'h-full min-h-[30rem]' : 'aspect-[2/3]'
      }`}
      whileTap={{ scale: 0.985 }}
    >
      <img
        src={film.posterUrl}
        alt={`${film.title} poster`}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-top saturate-[0.85] transition-all duration-[1100ms] ease-cine group-hover:scale-[1.08] group-hover:saturate-100 group-focus-visible:scale-[1.08]"
      />
      {/* colour gel: each film has its own light */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ background: `linear-gradient(160deg, ${tint}, transparent 75%)` }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/30" />

      {/* year + status */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <span className="font-title text-[1.6rem] font-bold leading-none text-ivory">{film.year}</span>
        {!isReleased && <span className="bg-oxblood px-2.5 py-1 text-[0.8rem] font-medium text-ivory">{film.status}</span>}
      </div>

      {/* title block */}
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <p className="mb-1.5 text-[0.95rem] text-champagne">
          {film.genre.join(', ')}
          {film.type && <span className="text-ivory/60"> &nbsp;/&nbsp; {film.type}</span>}
        </p>
        <h3
          className={`font-title font-black uppercase leading-[0.88] text-ivory transition-colors duration-500 group-hover:text-champagne ${
            featured ? 'text-[clamp(3.2rem,6vw,6rem)]' : 'text-[clamp(2.3rem,3.2vw,3.1rem)]'
          }`}
        >
          {film.title}
        </h3>

        {/* hover reveal */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-cine group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className={`mt-3 font-display italic leading-snug text-ivory/90 ${featured ? 'line-clamp-5 text-[1.15rem]' : 'line-clamp-4 text-[1rem]'}`}>
              {film.synopsis}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {rating && (
                <span className={`px-1.5 py-0.5 text-[0.78rem] font-medium ${rating.chip}`} title={rating.label}>
                  {film.contentRating}
                </span>
              )}
              {film.platform.map((p) =>
                PLATFORM_LOGOS[p] ? (
                  <span key={p} className="flex h-6 items-center bg-ivory/90 px-1.5">
                    <img src={PLATFORM_LOGOS[p]} alt={p} className="h-4 w-auto object-contain" />
                  </span>
                ) : (
                  <span key={p} className="border border-ivory/30 px-2 py-0.5 text-[0.8rem] text-ivory/80">
                    {p}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};
