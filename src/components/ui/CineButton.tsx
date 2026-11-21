import { ReactNode } from 'react';
import { Magnetic } from '../motion/Magnetic';

interface CineButtonProps {
  children: ReactNode;
  onClick?: () => void;
  /** 'dark' = for dark grounds (champagne), 'paper' = for light grounds (gilt) */
  tone?: 'dark' | 'paper';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  arrow?: boolean;
}

/**
 * Primary call-to-action: outlined plate that fills from below on hover/focus,
 * with a magnetic lean and an arrow that advances.
 */
export const CineButton = ({
  children,
  onClick,
  tone = 'dark',
  className = '',
  type = 'button',
  disabled,
  arrow = true,
}: CineButtonProps) => {
  const palette =
    tone === 'dark'
      ? 'border-champagne text-champagne hover:text-ink focus-visible:text-ink before:bg-champagne'
      : 'border-gilt text-gilt hover:text-ivory focus-visible:text-ivory before:bg-gilt';
  return (
    <Magnetic className={`inline-block ${className}`}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`group relative inline-flex items-center justify-center gap-4 overflow-hidden border px-9 py-4
          label text-[0.8rem] transition-colors duration-500 ease-cine disabled:opacity-60
          before:absolute before:inset-0 before:translate-y-full before:transition-transform before:duration-500 before:ease-cine
          hover:before:translate-y-0 focus-visible:before:translate-y-0 ${palette}`}
      >
        <span className="relative z-10">{children}</span>
        {arrow && (
          <svg
            className="relative z-10 transition-transform duration-500 ease-cine group-hover:translate-x-1.5"
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            aria-hidden
          >
            <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        )}
      </button>
    </Magnetic>
  );
};
