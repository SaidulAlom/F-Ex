import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export function SmartImage({ src, className, alt, unoptimized, ...props }: ImageProps) {
  const isSvg = typeof src === 'string' && src.startsWith('/') && src.toLowerCase().endsWith('.svg');
  return (
    <Image
      src={src}
      alt={alt}
      {...props}
      className={cn(className)}
      // Vector logos and explicitly unoptimized assets are served directly; local WebP photos and Cloudinary images use the optimizer by default.
      unoptimized={isSvg || unoptimized}
    />
  );
}
