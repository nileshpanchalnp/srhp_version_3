import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllNews, INewsData } from '../data/newsData';
import { MaskText } from '../components/motion/MaskText';
import { useFinePointer } from '../hooks/useFinePointer';
import { EASE, slideDirection } from '../motion/language';
import { scrollToTop } from '../lib/scroll';

const ITEMS_PER_PAGE = 10;

const getPageNumbers = (currentPage: number, totalPages: number): (number | '...')[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  if (currentPage <= 4) {
    pages.push(2, 3, 4, 5, '...', totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push('...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
  }
  return pages;
};

const PRESS_FILTER =
  'grayscale-[0.55] sepia-[0.2] transition-[filter,transform] duration-700 ease-cine group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-[1.04]';

/** The page's lead story: photograph with the headline set over it. */
const LeadStory = ({ news }: { news: INewsData }) => (
  <a href={news.link} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden bg-surface">
    <div className="relative aspect-[4/5] sm:aspect-[16/9]">
      {news.img ? (
        <img src={news.img} alt="" loading="eager" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${PRESS_FILTER}`} />
      ) : (
        <div className="halftone absolute inset-0" />
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
        <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-ivory/80">
          <span className="font-title text-[2rem] font-bold leading-none text-champagne">{news.year}</span>
          <span>{news.publication}</span>
          {news.tag && <span className="border border-champagne/60 px-2.5 py-1 text-[0.82rem] text-champagne">{news.tag}</span>}
        </div>
        <h2 className="break-words font-display text-[1.6rem] font-medium leading-[1.12] text-ivory sm:text-4xl lg:text-[2.8rem]">
          <span className="draw-underline [box-decoration-break:clone] pb-0.5">{news.title}</span>
        </h2>
        <span className="sr-only"> (opens in a new tab)</span>
      </div>
    </div>
  </a>
);

/** A line in the archive index. On desktop the photo follows the cursor; on touch it sits inline. */
const NewsRow = ({
  news,
  index,
  onHover,
}: {
  news: INewsData;
  index: number;
  onHover: (n: INewsData | null) => void;
}) => (
  <motion.li
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { delay: 0.1 + index * 0.04, duration: 0.6, ease: EASE.out } }}
    className="border-b border-ivory/12"
  >
    <a
      href={news.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => onHover(news)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(news)}
      onBlur={() => onHover(null)}
      className="group grid grid-cols-[72px_minmax(0,1fr)] items-start gap-x-5 gap-y-2 py-6 transition-colors duration-300 hover:bg-champagne/[0.05] focus-visible:bg-champagne/[0.05] md:grid-cols-[6rem_minmax(0,1fr)_auto] md:px-3 md:py-7 lg:[&:hover_h3]:text-champagne"
    >
      <span className="font-title text-[2.6rem] font-bold leading-[0.9] text-ivory/35 transition-colors duration-300 group-hover:text-champagne md:text-[3.6rem]">
        {news.year}
      </span>
      <div className="min-w-0">
        <p className="mb-1.5 text-[0.98rem] text-mute">{news.publication}</p>
        <h3 className="break-words font-display text-[1.25rem] font-medium leading-[1.22] text-ivory transition-colors duration-300 md:text-[1.6rem]">
          {news.title}
        </h3>
        {news.img && (
          <img src={news.img} alt="" loading="lazy" decoding="async" className="mt-4 aspect-[16/9] w-full max-w-[320px] object-cover grayscale-[0.5] lg:hidden" />
        )}
        <span className="sr-only"> (opens in a new tab)</span>
      </div>
      <div className="col-start-2 flex items-center gap-4 md:col-start-auto md:self-center">
        {news.tag && (
          <span className="border border-champagne/45 px-2.5 py-1 text-[0.82rem] text-champagne transition-colors duration-300 group-hover:bg-champagne group-hover:text-ink">
            {news.tag}
          </span>
        )}
        <span aria-hidden className="hidden text-champagne opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 md:block">→</span>
      </div>
    </a>
  </motion.li>
);

const NewsAndEventPage = () => {
  const navigate = useNavigate();
  const fine = useFinePointer();
  const [newsItems, setNewsItems] = useState<INewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(1);
  const [tag, setTag] = useState('All');
  const [hovered, setHovered] = useState<INewsData | null>(null);

  /* cursor-following preview */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 30 });
  const sy = useSpring(my, { stiffness: 260, damping: 30 });
  useEffect(() => {
    if (!fine) return;
    const move = (e: MouseEvent) => {
      mx.set(e.clientX + 28);
      my.set(e.clientY - 110);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [fine, mx, my]);

  useEffect(() => {
    getAllNews()
      .then(({ data }) => setNewsItems(data.data))
      .catch(() => setNewsItems([]))
      .finally(() => setLoading(false));
  }, []);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    newsItems.forEach((n) => n.tag && counts.set(n.tag, (counts.get(n.tag) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [newsItems]);

  const visible = useMemo(() => (tag === 'All' ? newsItems : newsItems.filter((n) => n.tag === tag)), [newsItems, tag]);

  const totalPages = Math.ceil(visible.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = visible.slice(start, start + ITEMS_PER_PAGE);
  const [leadItem, ...restItems] = paginatedItems;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
    scrollToTop();
  };

  const pickTag = (t: string) => {
    setTag(t);
    setCurrentPage(1);
    setHovered(null);
  };

  const goBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate('/');
  };

  return (
    <main id="main" className="grain relative min-h-screen bg-midnight text-ivory">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 35% at 15% 0%, rgb(var(--c-champagne) / 0.12), transparent 70%)' }}
      />

      <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 pb-32 pt-28 md:px-12 md:pt-36 lg:grid-cols-12 lg:gap-16">
        {/* ── Masthead: stays in view while the archive scrolls ── */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <button type="button" onClick={goBack} className="group mb-10 flex items-center gap-3 text-[1rem] text-mute transition-colors hover:text-champagne">
              <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
              Back to Site
            </button>

            <h1 className="font-title text-[clamp(4rem,12vw,10rem)] font-black uppercase leading-[0.84] text-ivory">
              <MaskText text="Full Press" trigger="mount" delay={0.15} className="block" />
              <MaskText text="Directory" trigger="mount" delay={0.35} className="text-outline block [--outline:rgb(var(--c-champagne))]" />
            </h1>
            <p className="mt-6 font-display text-xl italic text-mute">Complete Press Archive</p>

            {tags.length > 0 && (
              <div role="group" aria-label="Filter articles by topic" className="mt-10 flex flex-wrap gap-2">
                {[['All', newsItems.length] as [string, number], ...tags].map(([t, count]) => {
                  const on = tag === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => pickTag(t)}
                      aria-pressed={on}
                      className={`border px-3.5 py-2 text-[0.95rem] transition-colors duration-300 ${
                        on ? 'border-champagne bg-champagne text-ink' : 'border-ivory/20 text-ivory/75 hover:border-champagne hover:text-champagne'
                      }`}
                    >
                      {t} <span className={on ? 'text-ink/60' : 'text-ivory/40'}>{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ── Archive ── */}
        <div className="lg:col-span-8">
          {loading && (
            <div role="status" aria-label="Loading press archive" className="flex flex-col">
              <div className="aspect-[16/9] animate-pulse bg-surface" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-6 border-b border-ivory/10 py-7">
                  <div className="h-10 w-16 animate-pulse bg-surface" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="h-4 w-3/5 animate-pulse bg-surface" />
                    <div className="h-3 w-1/4 animate-pulse bg-surface" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && visible.length === 0 && <p className="py-16 text-center font-display text-2xl italic text-mute">No news items found.</p>}

          {!loading && visible.length > 0 && (
            <>
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div key={`${tag}-${currentPage}`} custom={direction} variants={slideDirection} initial="enter" animate="center" exit="exit">
                  {leadItem && <LeadStory news={leadItem} />}
                  <ol className="mt-2">
                    {restItems.map((news, i) => (
                      <NewsRow key={news.id} news={news} index={i} onHover={fine ? setHovered : () => undefined} />
                    ))}
                  </ol>
                </motion.div>
              </AnimatePresence>

              {totalPages > 1 && (
                <nav aria-label="Press archive pages" className="mt-14 flex flex-wrap items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex h-11 min-w-11 items-center justify-center border border-ivory/20 px-2 text-ivory/80 transition-colors hover:border-champagne hover:text-champagne disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ←
                  </button>
                  {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                    page === '...' ? (
                      <span key={`dots-${idx}`} aria-hidden className="flex h-11 min-w-8 items-center justify-center text-ivory/40">
                        ···
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`flex h-11 min-w-11 items-center justify-center border px-2 font-title text-xl font-bold transition-colors ${
                          currentPage === page ? 'border-champagne bg-champagne text-ink' : 'border-ivory/20 text-ivory/80 hover:border-champagne hover:text-champagne'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="flex h-11 min-w-11 items-center justify-center border border-ivory/20 px-2 text-ivory/80 transition-colors hover:border-champagne hover:text-champagne disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    →
                  </button>
                </nav>
              )}

              <p className="mt-6 text-center text-[0.98rem] text-mute" aria-live="polite">
                {totalPages > 1 ? `Page ${currentPage} of ${totalPages} · ` : ''}
                {visible.length} {visible.length === 1 ? 'article' : 'articles'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* cursor-following photo preview (mouse only) */}
      {fine && (
        <AnimatePresence>
          {hovered?.img && (
            <motion.div
              key={hovered.id}
              aria-hidden
              className="pointer-events-none fixed left-0 top-0 z-[150] hidden h-[170px] w-[250px] overflow-hidden shadow-plate ring-1 ring-champagne/40 lg:block"
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE.out } }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
            >
              <img src={hovered.img} alt="" className="h-full w-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </main>
  );
};

export default NewsAndEventPage;
