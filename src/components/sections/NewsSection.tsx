import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getFeaturedNews, INewsData, NEWS } from '../../data/newsData';
import { Marquee } from '../motion/Marquee';
import { MaskText } from '../motion/MaskText';
import { EASE, VIEWPORT } from '../../motion/language';

/** Press photos start in black-and-white, like a newsprint halftone, and warm up on hover. */
const PRESS_FILTER =
  'grayscale-[0.55] sepia-[0.2] contrast-[1.05] transition-[filter,transform] duration-700 ease-cine group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-[1.03]';

/** The lead: a full-width banner with the headline set over the photograph. */
const LeadStory = ({ news }: { news: INewsData }) => (
  <motion.a
    href={news.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative mt-12 block overflow-hidden bg-ink"
    initial={{ clipPath: 'inset(0 0 100% 0)' }}
    whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
    viewport={VIEWPORT}
    transition={{ duration: 1.3, ease: EASE.inOut }}
  >
    <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]">
      {news.img ? (
        <img src={news.img} alt="" loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${PRESS_FILTER}`} />
      ) : (
        <div className="halftone absolute inset-0 bg-ink" />
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
      <div className="absolute inset-x-0 bottom-0 max-w-[1050px] p-6 md:p-10 lg:p-14">
        <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-ivory/80">
          <span className="font-title text-[2.2rem] font-bold leading-none text-champagne">{news.year}</span>
          <span className="text-[1rem]">{news.publication}</span>
          {news.tag && <span className="border border-champagne/60 px-2.5 py-1 text-[0.82rem] text-champagne">{news.tag}</span>}
        </div>
        <h3 className="break-words font-display text-[1.7rem] font-medium leading-[1.1] text-ivory sm:text-4xl lg:text-[3rem]">
          <span className="draw-underline [box-decoration-break:clone] pb-0.5">{news.title}</span>
        </h3>
        <span className="sr-only"> (opens in a new tab)</span>
      </div>
    </div>
  </motion.a>
);

/** A headline row: thumbnail, where and when it ran, then the headline. */
const HeadlineRow = ({ news }: { news: INewsData }) => (
  <a
    href={news.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group grid grid-cols-[96px_minmax(0,1fr)] items-start gap-5 border-b border-ink/20 py-6 md:grid-cols-[132px_minmax(0,1fr)]"
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-ink/10">
      {news.img ? (
        <img src={news.img} alt="" loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${PRESS_FILTER}`} />
      ) : (
        <div className="halftone flex h-full w-full items-center justify-center">
          <span aria-hidden className="font-display text-4xl text-ink/30">
            {news.publication.charAt(0)}
          </span>
        </div>
      )}
    </div>
    <div className="min-w-0">
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-title text-[1.7rem] font-bold leading-none text-bronze transition-colors duration-300 group-hover:text-gilt">{news.year}</span>
        <span className="text-[0.95rem] text-soft">{news.publication}</span>
        {news.tag && <span className="border border-gilt/55 px-2 py-0.5 text-[0.78rem] text-gilt">{news.tag}</span>}
      </div>
      <h3 className="line-clamp-3 break-words font-display text-[1.2rem] font-medium leading-[1.25] text-ink md:text-[1.35rem]">
        <span className="draw-underline [box-decoration-break:clone] pb-0.5">{news.title}</span>
      </h3>
      <span className="sr-only"> (opens in a new tab)</span>
    </div>
  </a>
);

export const NewsSection = () => {
  const [items, setItems] = useState<INewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedNews(6)
      .then(({ data }) => setItems(data.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const publications = useMemo(() => Array.from(new Set(NEWS.map((n) => n.publication))), []);
  const [lead, ...rest] = items;

  return (
    <section
      id="news"
      className="on-paper relative z-20 -mt-10 rounded-t-[2.75rem] bg-newsprint pb-24 pt-20 text-ink shadow-[0_-40px_80px_-20px_rgb(0_0_0/0.7)] md:pt-28"
    >
      <div aria-hidden className="halftone pointer-events-none absolute inset-0 rounded-t-[2.75rem] opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_40%)]" />

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-12">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <MaskText as="h2" text="News & Events" className="block font-title text-[clamp(3.8rem,12.5vw,11.5rem)] font-black uppercase leading-[0.84] text-ink" />
          <p className="font-display text-xl italic text-soft md:pb-3 md:text-2xl">Press Archive</p>
        </header>

        {/* the publications that have run the story */}
        <div aria-hidden className="mt-10 border-y border-ink/70 py-4">
          <Marquee duration={70}>
            {publications.map((p) => (
              <span key={p} className="flex items-center gap-8 pr-8 font-display text-[1.6rem] italic text-ink/70">
                {p}
                <span className="block h-1.5 w-1.5 rotate-45 bg-gilt" />
              </span>
            ))}
          </Marquee>
        </div>

        {loading && (
          <div role="status" aria-label="Loading press archive" className="mt-12 aspect-[16/10] animate-pulse bg-ink/10 lg:aspect-[21/9]" />
        )}

        {!loading && lead && (
          <>
            <LeadStory news={lead} />

            <div className="mt-6 grid gap-x-16 lg:grid-cols-2">
              {rest.map((n) => (
                <HeadlineRow key={n.id} news={n} />
              ))}
              <button
                type="button"
                onClick={() => navigate('/newsandevent')}
                className="group flex items-center justify-between gap-6 border-b border-ink py-6 text-left"
              >
                <span className="font-title text-[clamp(2.2rem,4.4vw,3.4rem)] font-black uppercase leading-none text-ink transition-colors duration-300 group-hover:text-gilt">
                  Full Press Directory
                </span>
                <span
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ink text-ink transition-all duration-500 ease-cine group-hover:border-gilt group-hover:bg-gilt group-hover:text-ivory"
                >
                  <svg width="22" height="14" viewBox="0 0 16 10" fill="none">
                    <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
