'use client';

import { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';

export function CountUp({
  end,
  suffix = '',
  prefix = '',
  duration = 1.4,
  className,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const count = useMotionValue(0);
  const formatted = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString('en-IN'),
  );

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      count.set(end);
      return;
    }
    const controls = animate(count, end, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [count, duration, end, inView, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{formatted}</motion.span>
      {suffix}
    </span>
  );
}
