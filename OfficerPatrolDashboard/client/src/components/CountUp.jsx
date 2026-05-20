import { useEffect, useRef, useState } from 'react';

/**
 * Animates a numeric value from its previous value up to `value`.
 * Uses requestAnimationFrame for smooth per-frame interpolation.
 */
export default function CountUp({ value = 0, duration = 700, format = (n) => n.toLocaleString() }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = Number(value) || 0;
    if (from === to) return;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      setDisplay(t === 1 ? to : current);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  useEffect(() => { fromRef.current = display; }, [display]);

  const rounded = Math.round(display);
  return <span>{format(rounded)}</span>;
}
