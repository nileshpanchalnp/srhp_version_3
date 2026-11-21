import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { clipIris, clipLeft, clipUp, VIEWPORT } from '../../motion/language';

const CLIPS: Record<'up' | 'left' | 'iris', Variants> = {
  up: clipUp,
  left: clipLeft,
  iris: clipIris,
};

interface ImageRevealProps {
  src: string;
  alt: string;
  /** Wrapper (the "window" the picture is revealed through) */
  className?: string;
  imgClassName?: string;
  direction?: keyof typeof CLIPS;
  /** Scroll parallax travel, as a fraction of height (0 disables) */
  parallax?: number;
  /** Start out of focus and pull sharp as it reveals */
  focus?: boolean;
  delay?: number;
  loading?: 'lazy' | 'eager';
  children?: ReactNode;
}

/**
 * Picture revealed through a moving mask with an optional focus pull and
 * restrained scroll parallax. Used for portraits, press images and heroes.
 */
export const ImageReveal = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  direction = 'up',
  parallax = 0.08,
  focus = false,
  delay = 0,
  loading = 'lazy',
  children,
}: ImageRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${parallax * 100}%`, `${-parallax * 100}%`]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      variants={CLIPS[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        draggable={false}
        className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        style={parallax ? { y, scale: 1 + parallax * 2.4 } : undefined}
        initial={focus ? { filter: 'blur(14px)' } : false}
        whileInView={focus ? { filter: 'blur(0px)' } : undefined}
        viewport={VIEWPORT}
        transition={{ duration: 1.6, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
      />
      {children}
    </motion.div>
  );
};
