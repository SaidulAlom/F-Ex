'use client';

import dynamic from 'next/dynamic';
import type { HeroMotionProps } from '@/components/motion/HeroMotion';

const HeroMotion = dynamic<HeroMotionProps>(
  () => import('@/components/motion/HeroMotion').then((module) => module.HeroMotion),
  {
    loading: () => (
      <div className="gradient-mesh min-h-[640px]" aria-hidden="true" />
    ),
  },
);

const RepairProcess = dynamic(
  () => import('@/components/motion/RepairProcess').then((module) => module.RepairProcess),
  {
    loading: () => <div className="min-h-screen bg-navy" aria-hidden="true" />,
  },
);

const BrandMarquee = dynamic(
  () => import('@/components/motion/BrandMarquee').then((module) => module.BrandMarquee),
  {
    loading: () => <div className="h-[76px] border-y border-line bg-white/70" aria-hidden="true" />,
  },
);

export function LazyHero(props: HeroMotionProps) {
  return <HeroMotion {...props} />;
}

export function LazyRepairProcess() {
  return <RepairProcess />;
}

export function LazyBrandMarquee() {
  return <BrandMarquee />;
}
