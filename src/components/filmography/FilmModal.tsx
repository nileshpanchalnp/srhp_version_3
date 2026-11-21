import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IFilm } from '../../types/film.types';
import { CONTENT_RATING, PLATFORM_LOGOS, getYouTubeEmbedUrl } from '../../lib/filmUtils';
import { useModalLock } from '../../hooks/useModalLock';
import { EASE } from '../../motion/language';
import imdb_logo from '../../img/imdb_logo.png';

interface FilmModalProps {
  film: IFilm | null;
  onClose: () => void;
  /** Start the trailer as soon as the dialog opens */
  autoplay?: boolean;
}

/** One line of the credit sheet: a quiet label, then the value. */
const Credit = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline justify-between gap-6 border-b border-ivory/10 py-3.5">
    <dt className="text-[0.95rem] text-mute">{label}</dt>
    <dd className="min-w-0 text-right text-[1rem] text-ivory">{children}</dd>
  </div>
);

const ModalBody = ({ film, onClose, autoplay }: { film: IFilm; onClose: () => void; autoplay: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(autoplay && !!film.trailerUrl);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useModalLock(true);

  /* focus management: move focus in, trap Tab, Esc closes, restore on exit */
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 500);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('button, a[href], iframe, [tabindex]:not([tabindex="-1"])')
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  const rating = film.contentRating ? CONTENT_RATING[film.contentRating] : null;
  const stage = film.heroPosterUrl ?? film.posterUrl;
  const released = film.status === 'Released';

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="fixed inset-0 z-[200]">
      <motion.div
        className="absolute inset-0 bg-ink/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.1 } }}
        onClick={onClose}
      />

      {/* the screening room slides up like a curtain */}
      <motion.div
        ref={panelRef}
        className="absolute inset-x-0 bottom-0 top-0 flex flex-col overflow-hidden bg-midnight ring-1 ring-ivory/10 md:inset-5 lg:inset-8"
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.8, ease: EASE.inOut } }}
        exit={{ clipPath: 'inset(100% 0% 0% 0%)', transition: { duration: 0.55, ease: EASE.inOut } }}
      >
        {/* top bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-ivory/10 px-5 py-3 md:px-8">
          <p className="text-[0.95rem] text-mute">
            {film.type ?? 'Film'} <span className="text-ivory/30">/</span> {film.year}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close film details"
            className="group flex items-center gap-3 py-1.5 font-title text-[1.1rem] font-bold uppercase tracking-[0.06em] text-ivory/85 transition-colors hover:text-champagne"
          >
            Close
            <span aria-hidden className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-px w-4 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-4 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto grid max-w-[1500px] gap-10 p-5 pb-14 md:p-8 md:pb-16 lg:grid-cols-12 lg:gap-14">
            {/* ── Screen + story ── */}
            <div className="lg:col-span-8">
              <div className="relative aspect-video w-full overflow-hidden bg-ink ring-1 ring-ivory/10">
                {film.trailerUrl && isPlaying ? (
                  <iframe
                    src={getYouTubeEmbedUrl(film.trailerUrl, true)}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    title={`${film.title} trailer`}
                  />
                ) : (
                  <>
                    <motion.img
                      src={stage}
                      alt={film.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={{ scale: 1.12, filter: 'blur(10px)' }}
                      animate={{ scale: 1, filter: 'blur(0px)', transition: { duration: 1.6, delay: 0.45, ease: EASE.lens } }}
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />
                    {film.trailerUrl ? (
                      <button
                        type="button"
                        onClick={() => setIsPlaying(true)}
                        aria-label={`Play ${film.title} trailer`}
                        className="group absolute inset-0 flex items-center justify-center"
                      >
                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-champagne text-ink transition-transform duration-500 ease-cine group-hover:scale-110 group-focus-visible:scale-110 md:h-24 md:w-24">
                          <svg className="ml-1 h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                        <span className="absolute bottom-4 left-5 font-title text-xl font-bold uppercase tracking-[0.06em] text-ivory md:bottom-6 md:left-7 md:text-2xl">
                          Play trailer
                        </span>
                      </button>
                    ) : (
                      <p className="absolute bottom-4 left-5 font-title text-xl font-bold uppercase tracking-[0.06em] text-ivory md:bottom-6 md:left-7 md:text-2xl">
                        Trailer coming soon
                      </p>
                    )}
                  </>
                )}
              </div>

              <h2
                id={titleId}
                className="mt-8 break-words font-title text-[clamp(3rem,7.5vw,7rem)] font-black uppercase leading-[0.88] text-ivory"
              >
                {film.title}
              </h2>

              {film.synopsis && (
                <p className="mt-6 max-w-[62ch] font-display text-[1.25rem] italic leading-[1.6] text-ivory/85 md:text-[1.4rem]">
                  {film.synopsis}
                </p>
              )}
            </div>

            {/* ── Credit sheet ── */}
            <aside className="lg:col-span-4">
              <div className="flex items-start gap-5 lg:block">
                <img
                  src={film.posterUrl}
                  alt={`${film.title} poster`}
                  className="aspect-[2/3] w-[34%] max-w-[180px] shrink-0 object-cover shadow-plate ring-1 ring-ivory/15 lg:w-[52%] lg:max-w-none"
                />
                {film.platform.length > 0 && (
                  <div className="flex flex-wrap gap-2 lg:mt-6">
                    {film.platform.map((p) =>
                      PLATFORM_LOGOS[p] ? (
                        <span key={p} className="flex h-8 items-center bg-ivory/90 px-2.5">
                          <img src={PLATFORM_LOGOS[p]} alt={p} className="h-[20px] w-auto object-contain" />
                        </span>
                      ) : (
                        <span key={p} className="border border-rule px-2.5 py-1.5 text-[0.9rem] text-mute">
                          {p}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>

              <dl className="mt-8 border-t border-ivory/10">
                <Credit label="Status">
                  <span className={released ? 'text-sage' : 'bg-oxblood px-2 py-0.5 text-ivory'}>{film.status}</span>
                </Credit>
                <Credit label="Year">{film.year}</Credit>
                <Credit label="Genre">{film.genre?.join(', ') || '—'}</Credit>
                {film.type && <Credit label="Format">{film.type}</Credit>}
                {rating && (
                  <Credit label="Content rating">
                    <span className={`px-2 py-0.5 text-[0.85rem] font-medium ${rating.chip}`} title={rating.label}>
                      {rating.label}
                    </span>
                  </Credit>
                )}
                {film.rating > 0 && (
                  <Credit label="Score">
                    <span className="inline-flex items-center gap-3">
                      <img src={imdb_logo} alt="IMDb" className="h-4 w-auto object-contain opacity-80" />
                      <span className="font-title text-2xl font-bold leading-none">
                        {film.rating}
                        <span className="text-base text-mute">/10</span>
                      </span>
                    </span>
                  </Credit>
                )}
              </dl>
            </aside>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/** Film-details dialog. Renders into <body> so it is never clipped. */
export const FilmModal = ({ film, onClose, autoplay = false }: FilmModalProps) =>
  createPortal(
    <AnimatePresence>{film && <ModalBody key={film.id} film={film} onClose={onClose} autoplay={autoplay} />}</AnimatePresence>,
    document.body
  );
