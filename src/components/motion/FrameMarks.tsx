interface FrameMarksProps {
  /** Tailwind border colour class, e.g. "border-champagne/70" */
  tone?: string;
  size?: number;
  inset?: number;
  className?: string;
}

/** Viewfinder corner brackets — the site's shared framing motif. */
export const FrameMarks = ({
  tone = 'border-champagne/70',
  size = 22,
  inset = 0,
  className = '',
}: FrameMarksProps) => {
  const base = `absolute border-solid ${tone}`;
  const s = { width: size, height: size };
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${base} border-t border-l`} style={{ ...s, top: inset, left: inset }} />
      <span className={`${base} border-t border-r`} style={{ ...s, top: inset, right: inset }} />
      <span className={`${base} border-b border-l`} style={{ ...s, bottom: inset, left: inset }} />
      <span className={`${base} border-b border-r`} style={{ ...s, bottom: inset, right: inset }} />
    </span>
  );
};
