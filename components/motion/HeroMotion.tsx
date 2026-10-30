'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { OpenStatusPill } from '@/components/branches/OpenStatusPill';
import { WhatsAppLink } from '@/components/analytics/ContactLinks';
import { buttonStyles } from '@/components/ui/button-styles';
import { siteConfig } from '@/lib/config';
import type { Banner, Branch } from '@/lib/types';

export interface HeroMotionProps {
  banner: Banner;
  branches: Branch[];
}

const wordVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const phoneShadow = 'drop-shadow(0 28px 28px rgba(0, 0, 0, 0.45))';

export function HeroMotion({ banner, branches }: HeroMotionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  // Subtle parallax range; tune these numbers for more/less movement.
  const phoneOneY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const phoneTwoY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const words = banner.title.split(/\s+/);

  return (
    <section ref={ref} className="relative overflow-hidden gradient-mesh text-white">
      <div className="hero-orb hero-orb-a -left-24 top-2 h-72 w-72 bg-electric/45 sm:h-96 sm:w-96" />
      <div className="hero-orb hero-orb-b -right-20 bottom-0 h-80 w-80 bg-orange/30" />
      <div className="container-content relative grid min-h-[640px] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="relative z-10">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-100"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange" aria-hidden="true" />
            {banner.badge || siteConfig.tagline}
          </motion.div>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.06] sm:text-5xl lg:text-6xl">
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="mr-[0.24em] inline-block"
                variants={wordVariants}
                initial={reduced ? false : 'hidden'}
                animate="visible"
                transition={{
                  duration: 0.45,
                  delay: reduced ? 0 : 0.12 + index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.55, duration: 0.5 }}
            className="mt-6 max-w-xl text-base leading-7 text-blue-100 sm:text-lg"
          >
            {banner.subtitle}
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.7, duration: 0.5 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href={banner.ctaHref} className={buttonStyles({ variant: 'orange', size: 'lg' })}>
              {banner.ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <WhatsAppLink
              branchSlug="lokhra"
              message={siteConfig.whatsapp.defaultMessage}
              label="Chat on WhatsApp"
              location="hero"
              className={buttonStyles({ variant: 'white', size: 'lg' })}
            />
          </motion.div>

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {branches.map((branch) => (
              <OpenStatusPill key={branch.slug} branch={branch} inverse showDetail />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-blue-100">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              Clear condition grades
            </span>
            <span>Same-day delivery available</span>
            <span>Open daily till 10 PM</span>
          </div>
        </div>

        <div
          className="relative mx-auto h-[430px] w-full max-w-lg overflow-visible sm:h-[540px]"
          aria-hidden="true"
        >
          <div className="absolute left-[14%] top-[20%] h-44 w-44 rounded-full bg-electric/20 blur-3xl" />
          <div className="absolute bottom-[14%] right-[14%] h-44 w-44 rounded-full bg-orange/20 blur-3xl" />

          <motion.div
            className="absolute left-[7%] top-[6%] z-10 w-[40%] sm:left-[8%]"
            style={{ y: reduced ? 0 : phoneOneY }}
            animate={reduced ? undefined : { rotate: -7 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <SmartImage
              src="/images/hero/phone-blue.webp?v=8"
              alt=""
              width={600}
              height={1400}
              sizes="(max-width: 1024px) 40vw, 205px"
              className="h-auto w-full"
              style={{ filter: phoneShadow }}
              priority
              unoptimized
            />
          </motion.div>

          <motion.div
            className="absolute bottom-[6%] right-[7%] z-20 w-[38%] sm:right-[8%]"
            style={{ y: reduced ? 0 : phoneTwoY }}
            animate={reduced ? undefined : { rotate: 7 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            <SmartImage
              src="/images/hero/phone-red.webp?v=8"
              alt=""
              width={600}
              height={1400}
              sizes="(max-width: 1024px) 38vw, 195px"
              className="h-auto w-full"
              style={{ filter: phoneShadow }}
              unoptimized
            />
          </motion.div>

          <div className="absolute bottom-4 left-[2%] z-30 rounded-2xl border border-white/20 bg-navy/70 px-4 py-3 text-xs shadow-2xl backdrop-blur-md">
            <span className="flex items-center gap-2 font-bold text-white">
              <MessageCircle className="h-4 w-4 text-orange" aria-hidden="true" />
              Live stock · 2 branches
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
