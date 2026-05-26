# Contact form — Resend + Turnstile + Cloudflare Worker

Everything the contact form on `markward.dev` needs to go from "user clicks submit" to "email lands in mark@markward.dev". Set up once, then it's hands-off.

---

## Architecture (one paragraph)

The form lives on the React SPA. On submit it `POST`s JSON to `/api/contact`. That path is intercepted by a Cloudflare **Worker** ([src/worker.js](src/worker.js)) before the request hits static assets — the worker hands the request to [handleContact()](functions/api/contact.js) which validates, hits Cloudflare Turnstile to check the spam token, calls the Resend API to send the email, and returns JSON. The Worker also serves the static SPA via its `ASSETS` binding (`wrangler.jsonc` → `assets.directory: ./dist`). Single Worker, two jobs.

```
Browser ──► POST /api/contact ──► Worker (src/worker.js)
                                    │
                                    ├─► handleContact()
                                    │     ├─ Origin check
                                    │     ├─ Honeypot check
                                    │     ├─ Dwell-time check
                                    │     ├─ Turnstile verify  (Cloudflare API)
                                    │     ├─ Optional KV rate-limit
                                    │     └─ Resend send       (Resend API)
                                    │
                                    └─► (fallthrough) env.ASSETS.fetch()
```

This is a **Workers + Assets** project, NOT a Pages project. Means env vars live on the Worker, not on Pages.

---

## One-time setup

### 1. Resend — sending domain + API key

Resend won't send mail from a domain it hasn't verified.

1. Sign up at <https://resend.com>.
2. **Domains → Add Domain → `markward.dev`** (the apex — not `noreply.` or any subdomain).
3. Resend gives you 3–4 DNS records to add. Typical set:
   - **SPF** (TXT) — `v=spf1 include:amazonses.com ~all`
   - **DKIM** (CNAME or TXT) — `resend._domainkey.markward.dev` → some Resend value
   - **DMARC** (TXT) — `v=DMARC1; p=none;` to start
   - Possibly an **MX** record for return-path
4. In Cloudflare DNS (`markward.dev` zone), add each record. **Proxy status: DNS only (gray cloud)** — proxied records break Resend's verification.
5. Back in Resend, click **Verify domain**. SPF/DKIM go green within a minute; DMARC may take longer.
6. **API Keys → Create API Key** — name it something like "markward.dev production". Scope **Sending access**, restrict to `markward.dev` if available. Copy the `re_…` value once. Resend won't show it again.

### 2. Turnstile — spam wall

1. Cloudflare dashboard → **Turnstile → Add site**.
2. Site name: `markward.dev`. Hostnames: `markward.dev`, `www.markward.dev`, plus `localhost` for dev.
3. Widget mode: **Managed** (invisible most of the time; challenges only when needed).
4. Cloudflare hands you **two keys**:
   - **Site key** (public, `0x4AAA…`) — used by the browser to render the widget
   - **Secret key** (private, `0x4AAA…`) — used server-side to verify tokens

Keep both — they go in different places (see next step).

### 3. Cloudflare Worker env vars

> The Worker's project name is `markward-dev` (set in `wrangler.jsonc`).

**Cloudflare dashboard → Workers & Pages → `markward-dev` → Settings → Variables and Secrets**

| Type | Name | Value | Why |
|---|---|---|---|
| **Secret** | `RESEND_API_KEY` | `re_…` (from Resend) | Server uses to call the Resend API |
| **Secret** | `TURNSTILE_SECRET_KEY` | `0x4AAA…` (private) | Server uses to verify Turnstile tokens |
| **Variable** | `VITE_TURNSTILE_SITE_KEY` | `0x4AAA…` (public) | Build-time variable; Vite inlines it so the browser can render the widget |
| **Variable** (optional) | `CONTACT_TO` | `mark@markward.dev` | Override default recipient |
| **Variable** (optional) | `CONTACT_FROM` | `Mark Ward · markward.dev <noreply@markward.dev>` | Override default sender (must use a verified Resend domain) |

Two important details:

- **`VITE_TURNSTILE_SITE_KEY` must be a plain Variable, not a Secret.** Secrets aren't available during `vite build`. Without it, the build outputs a site with no Turnstile widget and submissions get rejected by the server with `turnstile-missing`.
- **Hit Deploy** (or push any commit) after adding vars. Existing deployments don't pick them up automatically.

### 4. (Optional) KV rate-limit binding

Limits to 3 form submissions per IP per hour. Without this binding the function silently skips rate-limiting; the other defenses (Turnstile, honeypot, dwell-time, origin check) carry the load.

1. Cloudflare dashboard → **Workers & Pages → KV → Create namespace**, name it `markward-rate-limit`.
2. **Worker → Settings → Variables and Secrets → Add KV namespace binding**:
   - **Variable name:** `CONTACT_RATE_LIMIT` (exact — function looks for this name)
   - **KV namespace:** the one you just created
3. Redeploy.

---

## Local development

```sh
npm run dev:full
```

This runs `vite build --watch` and `wrangler dev --port 8788` together. Open <http://localhost:8788> (NOT 5173 — that's Vite without the Worker).

### Local secrets — `.dev.vars`

A `.dev.vars` file (gitignored) at the project root supplies env vars to Wrangler's local Worker. Copy from `.dev.vars.example` to start:

```sh
cp .dev.vars.example .dev.vars
```

For local testing you can use Cloudflare's documented Turnstile **test keys** which always pass:

| Key | Use locally |
|---|---|
| Site key (always passes) | `1x00000000000000000000AA` |
| Secret key (always passes) | `1x0000000000000000000000000000000AA` |
| Site key (always fails) | `2x00000000000000000000AB` |
| Secret key (always fails) | `2x0000000000000000000000000000000AA` |

For Resend you have three options locally:

1. **No real key** — use `re_REPLACE_ME`. Function returns `Resend 401`. Confirms the entire path except actual mail sending.
2. **Real key + Resend sandbox sender** — set `CONTACT_FROM=Mark Ward <onboarding@resend.dev>` in `.dev.vars`. Real send, no DNS verification needed. Useful before the domain is verified.
3. **Real key + verified domain** — full production behavior, including a real email landing in your inbox.

Restart `npm run dev:full` after editing `.dev.vars` — Wrangler reads it at boot.

---

## Deploy

```sh
npm run deploy
```

= `vite build && wrangler deploy`. Pushes the built SPA + Worker code to Cloudflare. Env vars must already be set on the Worker; deploy doesn't migrate them from local.

You can also push to git — Cloudflare's git integration runs the same build/deploy pipeline.

---

## How spam protection layers stack

In order of cost-to-bot:

1. **Honeypot** — hidden `company_url` field. Bots fill it; humans don't. Server silently returns success so bots don't learn.
2. **Dwell time** — form must have been on-screen ≥ 4 seconds. Catches paste-and-submit bots.
3. **Origin check** — only `https://markward.dev`, `https://www.markward.dev`, and `localhost` are accepted.
4. **Turnstile** — Cloudflare's invisible CAPTCHA. Server-side verifies the token with Cloudflare's API.
5. **Length + format checks** — name 2–120 chars, valid email regex, message 10–5000 chars.
6. **Rate limit** — 3 submissions/hour/IP if KV is bound (optional).

A genuine prospect blasting through the form in 3 seconds will get silently dropped by the dwell check — rare in practice but worth knowing if anyone complains about the form "not working" for them.

---

## Troubleshooting

| What you see | What it means | Fix |
|---|---|---|
| Form returns `Spam protection is not configured` | `TURNSTILE_SECRET_KEY` missing on Worker | Add the secret in Worker Settings → Variables and Secrets, redeploy |
| Form returns `Challenge failed` (reason: `invalid-input-response`) | `VITE_TURNSTILE_SITE_KEY` site key is wrong or doesn't match the secret | Verify both keys are from the same Turnstile site in Cloudflare |
| Form returns `Resend 401: invalid_api_key` | `RESEND_API_KEY` missing/wrong | Re-copy key from Resend → API Keys; ensure secret is set on the Worker |
| Form returns `Resend 422: from address not authorized` | Sending domain not verified in Resend | Re-check Resend → Domains; DNS records must be propagated and exact |
| Visiting `/api/contact` in a browser returns the SPA HTML | Worker not deployed, or routing isn't intercepting | Confirm latest `wrangler deploy` succeeded; check `wrangler.jsonc` has `main: src/worker.js` |
| 405 Method Not Allowed when submitting | Hitting Vite dev server (`:5173`) instead of Wrangler (`:8788`) | Make sure you're on `:8788` locally, or run `npm run dev:full` not `npm run dev` |
| Email "delivered" in Resend log but never arrives | Likely landed in spam; or `CONTACT_TO` recipient blocking | Check spam folder, then verify SPF/DKIM/DMARC are aligned in Resend |

To inspect what actually happened on a failed submission, check the browser console — the contact form logs the full server response under `[contact] submit failed`.

To inspect the Worker side, run `npx wrangler tail` to stream live logs from the deployed Worker.

---

## File map

| Path | Purpose |
|---|---|
| `wrangler.jsonc` | Worker + Assets config |
| `src/worker.js` | Worker entry — route `/api/contact`, fall through to ASSETS |
| `functions/api/contact.js` | The actual contact handler (`handleContact`) |
| `src/App.jsx` → `Contact` component | The form + client-side validation + Turnstile widget |
| `.dev.vars` (gitignored) | Local Wrangler secrets |
| `.dev.vars.example` | Template, committed |
| `.env.local` (gitignored) | Local Vite client-side env (incl. `VITE_TURNSTILE_SITE_KEY`) |
| `.env.example` | Template, committed |
