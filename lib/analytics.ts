export type AnalyticsValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: AnalyticsValue };

export type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: 'config' | 'event' | 'js' | 'set', name: string, params?: AnalyticsParams) => void;
  }
}

export const GA_EVENTS = {
  callClick: 'call_click',
  whatsappClick: 'whatsapp_click',
  directionsClick: 'directions_click',
  formSubmit: 'form_submit',
  search: 'search',
  selectItem: 'select_item',
} as const;

export function trackEvent(name: string, params: AnalyticsParams = {}): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
}

export function trackFormSubmission(formName: string, params: AnalyticsParams = {}): void {
  trackEvent(GA_EVENTS.formSubmit, {
    form_name: formName,
    ...params,
  });
}
