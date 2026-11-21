import { motion, Variants } from 'framer-motion';
import { maskLine, stagger, VIEWPORT } from '../../motion/language';

const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

interface MaskTextProps {
  text: string;
  as?: keyof typeof TAGS;
  className?: string;
  /** Seconds before the first word starts */
  delay?: number;
  /** Seconds between words */
  gap?: number;
  /** 'mount' animates immediately, 'view' waits until scrolled into view */
  trigger?: 'mount' | 'view';
  /** Per-word class resolver, e.g. to italicise or tint one word */
  wordClass?: (word: string, index: number) => string | undefined;
}

/**
 * Typographic reveal: each word rises out from behind a mask.
 * The DOM text stays one continuous readable string.
 */
export const MaskText = ({
  text,
  as = 'span',
  className,
  delay = 0,
  gap = 0.07,
  trigger = 'view',
  wordClass,
}: MaskTextProps) => {
  const Comp = TAGS[as];
  const words = text.split(' ');
  const container: Variants = stagger(gap, delay);

  const viewProps =
    trigger === 'view'
      ? { initial: 'hidden', whileInView: 'visible', viewport: VIEWPORT }
      : { initial: 'hidden', animate: 'visible' };

  return (
    <Comp className={className} variants={container} {...viewProps}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em] pr-[0.04em]">
            <motion.span variants={maskLine} className={`inline-block ${wordClass?.(word, i) ?? ''}`}>
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Comp>
  );
};
