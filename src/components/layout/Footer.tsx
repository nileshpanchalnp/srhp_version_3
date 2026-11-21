import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MaskText } from '../motion/MaskText';
import { EASE, rise, stagger, VIEWPORT } from '../../motion/language';
import { scrollToTop } from '../../lib/scroll';
import { SOCIAL_LINKS } from '../../data/siteContent';
import Company_Logo from '../../img/sattvion_logo_one.png';

/** One credit line: the role on the left, the name on the right, joined by a dotted leader. */
const Credit = ({ role, children }: { role: string; children: React.ReactNode }) => (
  <motion.div variants={rise} className="flex items-baseline gap-4 py-4 md:gap-6 md:py-5">
    <dt className="shrink-0 font-display text-[1.15rem] italic text-mute md:text-[1.3rem]">{role}</dt>
    <span aria-hidden className="mb-[0.35em] min-w-6 flex-1 self-end border-b border-dotted border-ivory/30" />
    <dd className="flex flex-wrap items-center justify-end gap-x-7 gap-y-2 text-right text-[1rem] text-ivory md:text-[1.1rem]">{children}</dd>
  </motion.div>
);

const creditLink = 'group relative transition-colors duration-300 hover:text-champagne';

/** End credits: the wordmark resolves, the credits roll up, and the frame fades to black. */
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const roll = useTransform(scrollYProgress, [0, 1], [110, 0]);

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink px-5 pb-12 pt-28 md:px-12 md:pt-40">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/40 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(60% 40% at 50% 0%, rgb(var(--c-champagne) / 0.08), transparent 70%)' }}
      />
      <div aria-hidden className="grain absolute inset-0" />

      <motion.div className="relative mx-auto max-w-[1500px]" style={{ y: roll }}>
        <div className="flex flex-col items-center text-center">
          <MaskText
            as="h2"
            text="SRHP Films"
            className="block font-title text-[clamp(5rem,26vw,25rem)] font-black uppercase leading-[0.8] tracking-[-0.01em] text-champagne"
          />
          <motion.p
            className="mt-10 font-display text-[1.4rem] italic text-mute md:text-[1.8rem]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.5, duration: 1.2 }}
          >
            Crafting stories since 2016
          </motion.p>
        </div>

        <motion.dl
          className="mx-auto mt-20 max-w-[860px] divide-y divide-ivory/10 border-y border-ivory/10"
          variants={stagger(0.14)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <Credit role="Follow">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className={creditLink}>
                {s.name}
              </a>
            ))}
          </Credit>

          <Credit role="Read">
            <Link to="/terms" className={creditLink}>
              Terms &amp; Conditions
            </Link>
            <Link to="/privacy" className={creditLink}>
              Privacy Policy
            </Link>
          </Credit>

          <Credit role="Powered by">
            <a href="https://digi.sattvion.com/" target="_blank" rel="noopener noreferrer" className={`${creditLink} inline-flex items-center gap-3`}>
              Sattvion Digi Solutions
              <img src={Company_Logo} alt="Sattvion" className="h-6 w-auto object-contain" />
            </a>
          </Credit>

          <Credit role="Copyright">
            <span>© {currentYear} SRHP Films</span>
          </Credit>
        </motion.dl>

        {/* title card */}
        <div className="mt-20 flex flex-col items-center gap-6">
          <motion.p
            className="font-title text-[3.4rem] font-black uppercase leading-none text-ivory/90 md:text-[5rem]"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.2, ease: EASE.out }}
          >
            The End
          </motion.p>
          <button
            type="button"
            onClick={() => scrollToTop()}
            aria-label="Back to top"
            className="group flex items-center gap-3 border border-ivory/20 px-6 py-3 font-title text-[1.1rem] font-bold uppercase tracking-[0.06em] text-ivory/80 transition-colors hover:border-champagne hover:text-champagne"
          >
            <span aria-hidden className="transition-transform duration-500 ease-cine group-hover:-translate-y-1">
              ↑
            </span>
            Back to top
          </button>
        </div>
      </motion.div>

      {/* fade to black */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent" />
    </footer>
  );
};
