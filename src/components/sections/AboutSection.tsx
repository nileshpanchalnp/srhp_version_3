import { useRef } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { CineButton } from '../ui/CineButton';
import { ImageReveal } from '../motion/ImageReveal';
import { MaskText } from '../motion/MaskText';
import { FrameMarks } from '../motion/FrameMarks';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { BIO, HIGHLIGHT_WORDS, STATS } from '../../data/siteContent';
import shravanTriwari from '../../../src/img/cropped-Director-2.png';

/* ── The bio, split into words so each can be lit by scroll. Key names are picked out in gilt. ── */
const strip = (s: string) => s.replace(/[.,;:!?]+$/, '');

const TOKENS = (() => {
  const words = BIO.split(/\s+/);
  const hl: boolean[] = new Array(words.length).fill(false);
  const phrases = [...HIGHLIGHT_WORDS].sort((a, b) => b.length - a.length).map((p) => p.split(' '));
  for (let i = 0; i < words.length; i++) {
    if (hl[i]) continue;
    for (const ph of phrases) {
      const hit = ph.every((t, k) => i + k < words.length && (k === ph.length - 1 ? strip(words[i + k]) : words[i + k]) === t);
      if (hit) {
        ph.forEach((_, k) => (hl[i + k] = true));
        break;
      }
    }
  }
  return words.map((w, i) => ({ w, hl: hl[i] }));
})();

const Word = ({ w, hl, i, n, p }: { w: string; hl: boolean; i: number; n: number; p: MotionValue<number> }) => {
  const start = (i / n) * 0.8;
  const opacity = useTransform(p, [start, Math.min(start + 0.14, 1)], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={hl ? 'font-medium text-gilt' : undefined}>
      {w}{' '}
    </motion.span>
  );
};

export const AboutSection = () => {
  const navigate = useNavigate();
  const bioRef = useRef<HTMLParagraphElement>(null);
  const progress = useScrollProgress(bioRef, ['start 0.82', 'end 0.55']);

  return (
    <section id="about" className="on-paper relative bg-paper text-ink">
      <div
        aria-hidden
        className="halftone pointer-events-none absolute inset-0 opacity-[0.28] [mask-image:linear-gradient(to_bottom,black,transparent_30%,transparent_75%,black)]"
      />

      <div className="relative mx-auto max-w-[1500px] px-5 pb-24 pt-24 md:px-12 md:pt-36 lg:pb-36">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* ── Portrait: stays in frame while the story scrolls past ── */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[460px] lg:sticky lg:top-28 lg:mx-0 lg:max-w-none">
              <ImageReveal
                src={shravanTriwari}
                alt="Sandip Patel, founder and director of SRHP Films"
                direction="up"
                focus
                parallax={0.05}
                loading="eager"
                className="relative aspect-[4/5] bg-ink shadow-paper"
                imgClassName="object-[50%_20%]"
              >
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <FrameMarks inset={16} size={26} tone="border-ivory/80" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="font-title text-[2.6rem] font-extrabold uppercase leading-[0.9] text-ivory md:text-6xl">Sandip Patel</p>
                  <p className="mt-2 font-display text-lg italic text-champagne">Founder &amp; Director</p>
                </div>
              </ImageReveal>
              <span aria-hidden className="absolute -bottom-4 -right-4 -z-10 h-full w-full border border-gilt/50" />
            </div>
          </div>

          {/* ── Story ── */}
          <div className="lg:col-span-7">
            <h2 className="font-title text-[clamp(3.2rem,8.4vw,8rem)] font-black uppercase leading-[0.86] tracking-[-0.005em] text-ink">
              <MaskText text="Independent Cinema." className="block" />
              <MaskText text="Global Vision." delay={0.2} className="text-outline block [--outline:rgb(var(--c-gilt))]" />
            </h2>

            <p
              ref={bioRef}
              className="mt-10 max-w-[36ch] font-display text-[1.55rem] leading-[1.38] sm:text-[2rem] lg:mt-14 lg:text-[2.2rem]"
            >
              {TOKENS.map((t, i) => (
                <Word key={i} w={t.w} hl={t.hl} i={i} n={TOKENS.length} p={progress} />
              ))}
            </p>

            <div className="mt-12">
              <CineButton tone="paper" onClick={() => navigate('/films')}>
                Explore our films
              </CineButton>
            </div>
          </div>
        </div>

        {/* ── Ledger ── */}
        <dl className="mt-28 grid grid-cols-2 gap-y-14 border-t-2 border-ink pt-10 md:grid-cols-4 lg:mt-40">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col-reverse px-2 md:px-8 ${i > 0 ? 'md:border-l md:border-ink/20' : ''} ${i % 2 === 1 ? 'border-l border-ink/20' : ''}`}
            >
              <dt className="mt-4 font-display text-xl italic text-soft">{s.label}</dt>
              <dd className="font-title text-[clamp(4.6rem,13vw,11rem)] font-black leading-[0.82] text-ink">
                <AnimatedCounter from={0} to={s.value} />
                <span className="text-gilt">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
