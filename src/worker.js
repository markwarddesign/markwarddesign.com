/**
 * Cloudflare Worker entry — markward.dev
 *
 * Architecture:
 *   - Static SPA assets served from ./dist via the ASSETS binding
 *     (configured in wrangler.jsonc with not_found_handling: "single-page-application"
 *     so deep React-Router routes resolve to index.html)
 *   - Custom API routes intercepted here before falling through to ASSETS
 *
 * Add new API routes by adding a branch in fetch() that delegates to
 * a handler module — keep the worker entry thin.
 */

import { handleContact } from '../functions/api/contact.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ---- API routes ----
    if (url.pathname === '/api/contact') {
      if (request.method === 'POST') {
        return handleContact(request, env);
      }
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: 'POST' },
      });
    }

    // ---- Everything else: static assets (SPA fallback handled by ASSETS) ----
    return env.ASSETS.fetch(request);
  },
};
