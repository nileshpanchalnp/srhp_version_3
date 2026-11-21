import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { scrollToElement, scrollToTop } from '../../lib/scroll';

const SCENES = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'films', label: 'Films' },
  { id: 'news', label: 'News' },
  { id: 'contact', label: 'Contact' },
];

/** The whole page is one feature: scrolling scrubs a 90-minute running time. */
const RUNTIME_SECONDS = 90 * 60;
const FPS = 24;

const timecode = (progress: number) => {
  const total = Math.max(0, Math.min(1, progress)) * RUNTIME_SECONDS;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const f = Math.floor((total % 1) * FPS);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
};

/**
 * Fixed scene indicator. A running timecode scrubs with the scroll position and
 * the current section is announced as a scene. Ticks jump between scenes.
 */
export const SceneHud = () => {
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll();
  const tc = useTransform(scrollYProgress, timecode);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const line = window.innerHeight * 0.4;
      let current = 0;
      SCENES.forEach(({ id }, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const jump = (id: string) => {
    if (id === 'home') scrollToTop();
    else scrollToElement(document.getElementById(id));
  };

  return (
    <nav
      aria-label="Page scenes"
      className="pointer-events-none fixed bottom-6 left-6 z-[90] hidden text-white mix-blend-difference lg:block"
    >
      <motion.p className="font-mono text-[0.78rem] tabular-nums tracking-wider">{tc}</motion.p>
      <p className="mt-1 text-[0.82rem]">
        Scene {active + 1}
        <span className="ml-2 opacity-70">{SCENES[active].label}</span>
      </p>
      <ul className="pointer-events-auto mt-3 flex items-end gap-1.5">
        {SCENES.map(({ id, label }, i) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => jump(id)}
              aria-label={`Go to ${label}`}
              aria-current={i === active ? 'true' : undefined}
              className="group flex h-6 items-end"
            >
              <span
                className={`block w-6 bg-white transition-all duration-500 ease-cine ${
                  i === active ? 'h-[3px] opacity-100' : 'h-px opacity-50 group-hover:opacity-90'
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
