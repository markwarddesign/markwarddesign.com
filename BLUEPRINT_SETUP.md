# AI Project Scoper — "Scope your idea instantly"

The home-page widget that lets a prospect describe their project and get an instant stack + timeline + verdict + risk-list back. Powered by Gemini 2.5 Flash via a shared Cloudflare Worker proxy.

---

## Architecture (one paragraph)

The browser sends the user's idea to a **shared Cloudflare Worker** (lives in the `mwdzn` portfolio repo as `worker/gemini-proxy.js`). That Worker holds the `GEMINI_API_KEY` server-side and proxies the request to Google's Gemini `streamGenerateContent?alt=sse` endpoint. The response streams back as Server-Sent Events. The client's `BlueprintGenerator` ([src/App.jsx](src/App.jsx)) reads each SSE chunk, accumulates the text fragments, then `JSON.parse`s the assembled string (Gemini honors `responseMimeType: 'application/json'`, so the streamed chunks together form a single valid JSON blob). The parsed result renders as the editorial output (stack / timeline / verdict / challenges).

```
Browser (BlueprintGenerator)
   │
   │  POST  { contents, generationConfig: { responseMimeType: 'application/json' } }
   ▼
Cloudflare Worker (mwdzn repo · worker/gemini-proxy.js)
   │                       holds GEMINI_API_KEY as a secret
   │  POST + ?key=…
   ▼
Google Gemini API
   │  streamGenerateContent?alt=sse
   ▼
SSE stream of JSON fragments → browser concatenates → JSON.parse → render
```

**One Worker, two consumers.** Both `markward.dev` and `portfolio.markward.dev` hit the same proxy. The Worker's CORS allowlist gates which origins are allowed; the API key is shared.

---

## One-time setup

### 1. Get a Gemini API key

1. Go to <https://aistudio.google.com/apikey>.
2. **Create API key** — name it something like "Cloudflare Worker · markward".
3. Copy the key. You won't see it again.

### 2. Deploy / update the Worker (only needed once, then for CORS changes)

The Worker source lives in **the `mwdzn` portfolio repo** at `worker/gemini-proxy.js`. This site doesn't host the Worker — it just calls into the one already deployed for the portfolio.

```sh
cd /Users/markward/MWDZN/mwdzn/worker
```

Open `gemini-proxy.js`, confirm the origins allowlist includes every domain that'll call it:

```js
const ALLOWED_ORIGINS = [
  'https://portfolio.markwarddesign.com',
  'https://portfolio.markward.dev',
  'https://markward.dev',
  'https://www.markward.dev',
  'https://markwarddesign.com',     // optional, if the old site ever calls it
  'http://localhost:5173',
  'http://localhost:5177',
  'http://localhost:8788',           // wrangler dev port for markward.dev
];
```

Then deploy:

```sh
wrangler deploy
```

If the API key isn't already set as a Worker secret:

```sh
wrangler secret put GEMINI_API_KEY
# paste the key from step 1, press Enter
```

After deploy, the Worker URL looks like `https://gemini-proxy.<account>.workers.dev`. **Copy it** — that's the value you'll wire into this site.

### 3. Point this site at the Worker

The site needs the Worker URL exposed as a build-time variable to the React app.

**Local development** — add to `.env.local` (gitignored):

```
VITE_GEMINI_WORKER_URL=https://gemini-proxy.<account>.workers.dev
```

**Production** — Cloudflare dashboard → Workers & Pages → `markward-dev` worker → **Settings → Variables and Secrets**:

| Type | Name | Value |
|---|---|---|
| **Variable** (plain) | `VITE_GEMINI_WORKER_URL` | `https://gemini-proxy.<account>.workers.dev` |

Must be a **Variable**, not a Secret — Vite needs to read it during `vite build`. Secrets aren't exposed at build time.

After saving, hit **Deploy** (or push a commit) so the next build includes the new value.

---

## How it actually works at runtime

The handler is in [BlueprintGenerator](src/App.jsx) (`generateBlueprint`). Roughly:

1. **Build the prompt** — instructs Gemini to act as a Senior Architect, use the preferred stack (Laravel + React/Next + Tailwind + MySQL/Postgres + Vercel/AWS), and return JSON matching a strict schema (`stack`, `challenges`, `timeline`, `verdict`).
2. **POST to the Worker** — `{ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json' } }`. The `responseMimeType` forces Gemini to emit pure JSON instead of conversational prose.
3. **Read the SSE stream** — `response.body.getReader()`, split by newlines, look for `data: ` lines, parse each as JSON, accumulate `candidates[0].content.parts[0].text` into a single string.
4. **`JSON.parse` the assembled string** — yields `{ stack, challenges, timeline, verdict }`.
5. **Render** — editorial layout: 4-column stack grid, timeline + verdict callouts, numbered challenges list, closing CTA to `/contact`.

If the stream produces no text or the parse fails, the form surfaces the error in a warm-tinted alert and offers retry.

---

## Local development

```sh
npm run dev:full      # runs vite build --watch + wrangler dev on :8788
# OR
npm run dev           # vite only — also works since the Worker call is to an external URL, not /api/*
```

The Blueprint widget uses an **external** Worker URL (the deployed mwdzn proxy), so it works under both `npm run dev` and `npm run dev:full` — unlike the contact form, which needs Wrangler because it depends on a local Worker route.

If you see `"AI is offline in this environment (VITE_GEMINI_WORKER_URL not set)"` in the widget, your `.env.local` is missing the Worker URL.

---

## Troubleshooting

| What you see | What it means | Fix |
|---|---|---|
| "AI is offline in this environment" | `VITE_GEMINI_WORKER_URL` not set at build time | Add to `.env.local` (local) or Worker Variables (prod), rebuild |
| Browser console: `CORS error / blocked by CORS policy` | Calling origin not in the Worker's allowlist | Add `https://markward.dev` (and `localhost` ports for dev) to `ALLOWED_ORIGINS` in `mwdzn/worker/gemini-proxy.js`, redeploy |
| Widget hangs on "Analyzing…" forever | Worker reachable but Gemini key missing/expired | `wrangler tail` the Worker; you'll see Gemini 401/403 errors. Reset with `wrangler secret put GEMINI_API_KEY`. |
| Result returns but layout looks broken | Gemini returned text that wasn't valid JSON | Rare — usually a prompt issue. Check console for the parse error and the raw text. Adjusting the prompt's "Return a JSON object with strictly this schema" line usually fixes it. |
| `API error 405` | Calling the SPA root instead of the Worker | Typo or empty `VITE_GEMINI_WORKER_URL` — `fetch(undefined, …)` resolves to the current page. Re-check the env var. |
| `API error 429` | Gemini rate limit hit | Wait and retry. If frequent, request a quota bump in Google Cloud. |
| Streaming works but `fullText` is empty | Gemini returned content blocks but no text | Usually a safety filter. Try a less-edgy idea to confirm; check `wrangler tail` for `blockedReason`. |

To inspect the Worker live:

```sh
cd /Users/markward/MWDZN/mwdzn/worker
wrangler tail
```

Then trigger the widget. You'll see the request, Gemini's status, and any errors in real time.

---

## Modifying the prompt or schema

The prompt is hardcoded in [src/App.jsx](src/App.jsx) inside `generateBlueprint`. To change:

- **Stack opinions** — edit the "Preferred stack" / "Always recommend our preferred stack" lines
- **Schema** — edit the JSON template at the bottom of the prompt; the renderer expects exactly the keys it specifies (`stack.{frontend,backend,database,infra}`, `challenges[]`, `timeline`, `verdict`)
- **Tone** — adjust "Act as a Senior Software Architect"

If you change the schema, also update the render block (the four stack cards, the timeline/verdict callouts, the challenges list). Mismatched schema = `JSON.parse` succeeds but renders `undefined`s.

---

## File map

| Path | Purpose |
|---|---|
| `mwdzn/worker/gemini-proxy.js` | The Worker that proxies Gemini and holds `GEMINI_API_KEY`. Lives in the **portfolio repo**, not this one. |
| `src/App.jsx` → `BlueprintGenerator` | The widget — form, submit handler, SSE consumer, result renderer |
| `.env.local` (gitignored) | Local `VITE_GEMINI_WORKER_URL` |
| Cloudflare Worker env (`markward-dev`) | Production `VITE_GEMINI_WORKER_URL` |

---

## Security notes

- **`GEMINI_API_KEY` never reaches the browser.** It's a Cloudflare Worker secret. The browser only knows the Worker URL.
- **No PII is logged.** The Worker proxies requests without persisting the user's idea or response. Gemini may retain prompts per its data-use policy — don't put sensitive client info into the prompt.
- **CORS-locked.** The Worker rejects requests from any origin not in the allowlist. If a third-party ever embeds the form on a different domain, that domain needs to be added explicitly.
- **No auth / no rate-limit at the Worker level.** Anyone hitting the public URL from an allowed origin can use it. If this becomes an abuse vector, add a token check or Cloudflare WAF rule.
