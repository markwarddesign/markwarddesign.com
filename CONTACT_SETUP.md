# Contact form setup — Cloudflare Pages + Resend

The contact form posts to `/api/contact` (a Cloudflare Pages Function in `functions/api/contact.js`). It needs three things wired up before it works in production.

**Domain note:** This site deploys to `markward.dev`. The old `markwarddesign.com` site stays as-is (separate Pages project, separate everything). All examples below assume `markward.dev`.

## 1. Resend

1. Sign up at https://resend.com.
2. Add and verify the sending domain `markward.dev` (Resend gives you DNS records — add them in Cloudflare DNS for that domain).
3. Once the domain is `verified`, create an **API key** (Dashboard → API Keys).
4. In Cloudflare Pages: **Settings → Environment variables → Production**, add:
   - `RESEND_API_KEY` = `re_…` (the key)
   - `CONTACT_TO` = `mark@markward.dev` (optional — defaults to this)
   - `CONTACT_FROM` = `Mark Ward · markward.dev <noreply@markward.dev>` (optional — defaults to this)

The `from` address must use the verified domain. `reply_to` is set to the submitter, so when you hit **Reply** in your inbox you reply to the prospect, not to noreply.

## 2. Cloudflare Turnstile (spam wall)

1. Cloudflare dashboard → **Turnstile** → Add site.
2. Domain: `markward.dev` (and add `localhost` for dev).
3. Widget mode: **Managed** (recommended — invisible most of the time, challenges only when needed).
4. Copy both keys:
   - **Site key** (public) → add as `VITE_TURNSTILE_SITE_KEY` in Pages env (it's used by Vite at build time, so it must be present in the build environment).
   - **Secret key** → add as `TURNSTILE_SECRET_KEY` in Pages env.

Without these, the form will still render and submit, but the Turnstile widget won't appear and the server will reject every submission with `turnstile-not-configured`. So set them before going live.

## 3. Rate limiting (optional but recommended)

The server limits to **3 submissions per IP per hour** if a KV namespace is bound. Without the binding, rate limiting silently skips and the other defenses carry the load.

1. Cloudflare dashboard → **Workers & Pages → KV → Create namespace**. Name it something like `markward-rate-limit`.
2. Open your Pages project → **Settings → Functions → KV namespace bindings → Add**.
3. **Variable name:** `CONTACT_RATE_LIMIT` (exact — the function looks for this name).
4. **KV namespace:** select the one you created.
5. Redeploy.

## 4. Pages project + custom domain

1. Cloudflare Pages → **Create project → Connect to Git** (or upload). Build command: `npm run build`. Output: `dist`.
2. Once first deploy succeeds, **Custom domains → Set up a custom domain → `markward.dev`** and `www.markward.dev`.
3. The Pages Function at `functions/api/contact.js` deploys automatically — no extra config.

## What blocks spam

In order of cost-to-bot:

1. **Honeypot** — hidden `company_url` field. Bots fill it in; real users don't. Silent success for bots so they don't learn.
2. **Dwell time** — form must have been on-screen ≥ 4 seconds. Catches paste-and-submit bots.
3. **Turnstile** — Cloudflare's invisible CAPTCHA replacement. Server-side verified.
4. **Origin check** — submissions only accepted from `markward.dev` / `www` / localhost.
5. **Rate limit** — 3/hr/IP if KV is bound.
6. **Length + format checks** — name 2–120 chars, email regex, message 10–5000 chars.

If genuine human prospects are getting blocked, the most likely culprits are (a) dwell-time on a fast-typed submission or (b) Turnstile failing on a private-network IP. Both are diagnosable from the server response.

## Local dev

`npm run dev` runs Vite, which won't execute the Pages Function. To test the full flow locally, run:

```sh
npx wrangler pages dev -- npm run dev
```

That mounts the `functions/` directory and proxies Vite. You'll need a `.dev.vars` file (not committed) with the server-side env vars to test:

```
RESEND_API_KEY=re_...
TURNSTILE_SECRET_KEY=0x4...
```

For Turnstile in dev, use the test keys from Cloudflare's docs:
- Site key (always passes): `1x00000000000000000000AA`
- Secret key (always passes): `1x0000000000000000000000000000000AA`
