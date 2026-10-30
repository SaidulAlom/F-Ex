'use client';

import { useCallback } from 'react';
import { trackEvent, type AnalyticsParams } from '@/lib/analytics';

export function useAnalytics() {
  return useCallback((name: string, params: AnalyticsParams = {}) => {
    trackEvent(name, params);
  }, []);
}
