/**
 * Thin wrapper around gtag(). The gtag function is registered by the inline
 * snippet in index.html before this module loads, so window.gtag is always
 * present in production. In dev (no GA loaded) all helpers are no-ops.
 */

const isBrowser = typeof window !== 'undefined';

const gtag = (...args) => {
  if (!isBrowser || typeof window.gtag !== 'function') return;
  try { window.gtag(...args); } catch (_) { /* swallow */ }
};

/**
 * Track a SPA page view. Called from AppShell on every pathname change.
 */
export const trackPageView = (pathname, title) => {
  gtag('event', 'page_view', {
    page_path: pathname,
    page_location: isBrowser ? window.location.href : undefined,
    page_title: title || (isBrowser ? document.title : undefined),
  });
};

/**
 * Track a custom event. Params is a flat object of properties.
 * Standard GA4 reserved params (event_category, event_label, value) are
 * supported alongside any custom params.
 */
export const trackEvent = (name, params = {}) => {
  gtag('event', name, params);
};
