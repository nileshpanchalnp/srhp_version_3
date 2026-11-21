import { useEffect, useState } from 'react';

/** True only on devices with a hover-capable, precise pointer (mouse / trackpad). */
export const useFinePointer = () => {
  const query = '(hover: hover) and (pointer: fine)';
  const [fine, setFine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setFine(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return fine;
};
