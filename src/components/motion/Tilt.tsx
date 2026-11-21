import { ReactNode, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees */
  max?: number;
  /** Moving specular highlight that follows the pointer */
  glare?: boolean;
}

/**
 * Interactive poster tilt built on CSS 3D transforms.
 * Responds to mouse only; touch and reduced-motion users get a flat card.
 */
export const Tilt = ({ children, className = '', max = 9, glare = true }: TiltProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 22 });
  const sy = useSpring(py, { stiffness: 180, damping: 22 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgb(255 244 220 / 0.22), transparent 55%)`;

  const move = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className={`[perspective:1100px] ${className}`} onPointerMove={move} onPointerLeave={leave}>
      <motion.div
        ref={ref}
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={reduced ? undefined : { rotateX, rotateY }}
      >
        {children}
        {glare && !reduced && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
};
