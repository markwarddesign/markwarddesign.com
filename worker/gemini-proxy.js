/**
 * Cloudflare Worker — Gemini API Proxy
 *
 * Keeps the GEMINI_API_KEY secret server-side.
 * The client sends the full Gemini request body; this worker
 * injects the key and proxies the response.
 *
 * Deploy:
 *   1. npm install -g wrangler
 *   2. wrangler login
 *   3. wrangler deploy  (from the /worker directory)
 *   4. wrangler secret put GEMINI_API_KEY   ← paste your key
 *   5. Add the deployed worker URL as VITE_GEMINI_WORKER_URL
 *      in GitHub Secrets and in .env.local
 */

const ALLOWED_ORIGINS = [
  'https://markwarddesign.com',
  'http://localhost:5173',
  'http://localhost:4173',
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_ORIGINS[0];

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.text();

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        }
      );

      const responseBody = await geminiRes.text();

      return new Response(responseBody, {
        status: geminiRes.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
