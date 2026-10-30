'use client';

import { MotionConfig } from 'framer-motion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  // Framer Motion automatically honours the OS prefers-reduced-motion setting.
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.5 }}>
      {children}
    </MotionConfig>
  );
}
