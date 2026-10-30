'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { REPAIR_STEPS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function RepairProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.04, 1]);
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const next = Math.min(REPAIR_STEPS.length - 1, Math.floor(latest * REPAIR_STEPS.length));
    setActive(next);
  });

  return (
    <div ref={ref} className="relative h-[230vh] lg:h-[280vh]">
      <div className="sticky top-16 z-10 flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-navy py-12 text-white sm:top-20">
        <div className="container-content">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">Repair journey</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl">
                From a cracked screen to a working phone.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-blue-100">
              Scroll to follow our four-step process. Diagnosis comes before any repair approval.
            </p>
          </div>

          <div className="relative mt-10 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full w-full origin-left rounded-full bg-orange"
              style={{ scaleX: reduced ? 1 : scaleX }}
            />
          </div>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REPAIR_STEPS.map((step, index) => (
              <motion.li
                key={step.number}
                animate={{ opacity: reduced || active === index ? 1 : 0.52 }}
                transition={{ duration: reduced ? 0 : 0.25 }}
                className={cn(
                  'rounded-2xl border p-5',
                  active === index
                    ? 'border-orange/50 bg-white/10 shadow-glow'
                    : 'border-white/10 bg-white/5',
                )}
              >
                <span className="text-sm font-extrabold text-orange">{step.number}</span>
                <h3 className="mt-7 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-blue-100">{step.description}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
