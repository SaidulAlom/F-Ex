'use client';

import { useSyncExternalStore } from 'react';
import { siteConfig } from '@/lib/config';

const subscribe = () => () => {};

export function useOrigin(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => siteConfig.url,
  );
}
