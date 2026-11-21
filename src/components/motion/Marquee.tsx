import { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop */
  duration?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Seamless looping band. The children are rendered twice and the track slides
 * by exactly half its width, so there is never a visible seam.
 * Hover pauses it; reduced-motion users get a static band (see index.css).
 */
export const Marquee = ({ children, duration = 40, reverse = false, className = '' }: MarqueeProps) => (
  <div className={`marquee flex overflow-hidden ${className}`}>
    <div
      className="marquee-track flex w-max shrink-0 items-center"
      style={{ ['--marquee-dur' as string]: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' } as React.CSSProperties}
    >
      <div className="flex shrink-0 items-center">{children}</div>
      <div aria-hidden className="flex shrink-0 items-center">
        {children}
      </div>
    </div>
  </div>
);
