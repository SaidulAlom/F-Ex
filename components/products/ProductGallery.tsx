'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/lib/types';

export function ProductGallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollTo = (index: number) => {
    const next = (index + images.length) % images.length;
    setActive(next);
    const child = trackRef.current?.children[next] as HTMLElement | undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    child?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          aria-label={`${title} image gallery`}
          onScroll={(event) => {
            const element = event.currentTarget;
            const index = Math.round(element.scrollLeft / Math.max(element.clientWidth, 1));
            setActive(Math.min(images.length - 1, Math.max(0, index)));
          }}
        >
          {images.map((image, index) => (
            <button
              type="button"
              key={`${image.url}-${index}`}
              onClick={() => setZoom((value) => !value)}
              aria-label={`${zoom ? 'Zoom out of' : 'Zoom into'} image ${index + 1} of ${images.length}`}
              aria-pressed={zoom}
              className="relative aspect-square w-full shrink-0 snap-center overflow-hidden bg-cloud sm:aspect-[4/3]"
            >
              <SmartImage
                src={image.url}
                alt={image.alt || `${title} — image ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 560px"
                className={cn(
                  'object-contain p-6 transition-transform duration-300',
                  zoom && 'scale-[1.55]',
                )}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setZoom((value) => !value)}
          className="focus-ring absolute right-3 top-3 rounded-xl bg-white/95 p-2.5 text-navy shadow-soft"
          aria-label={zoom ? 'Disable image zoom' : 'Enable image zoom'}
          aria-pressed={zoom}
        >
          {zoom ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
        </button>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => scrollTo(active - 1)}
              className="focus-ring absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-navy shadow-soft"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo(active + 1)}
              className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-navy shadow-soft"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Choose product image">
          {images.map((image, index) => (
            <button
              type="button"
              key={`${image.url}-thumb-${index}`}
              onClick={() => scrollTo(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={active === index ? 'true' : undefined}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white',
                active === index ? 'border-electric' : 'border-line',
              )}
            >
              <SmartImage src={image.url} alt="" fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-center text-xs text-ink">
        Swipe the gallery on mobile · tap an image to {zoom ? 'zoom out' : 'zoom in'}
      </p>
    </div>
  );
}
