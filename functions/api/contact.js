/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Stack the deck against spam:
 *  1. Honeypot field (`company_url`) — must be empty
 *  2. Dwell time — form must have been on-screen ≥ 4 seconds before submit
 *  3. Cloudflare Turnstile token — server-side verify
 *  4. Rate limit — 3 submissions / hour / IP via KV (if `CONTACT_RATE_LIMIT` binding exists)
 *  5. Required-field + length checks
 *
 * Env required:
 *   RESEND_API_KEY        — from resend.com dashboard
 *   TURNSTILE_SECRET_KEY  — from Cloudflare Turnstile (the SECRET, not site key)
 *   CONTACT_TO            — optional override; defaults to mark@markward.dev
 *   CONTACT_FROM          — optional override; defaults to noreply@markward.dev
 *
 * Optional KV binding:
 *   CONTACT_RATE_LIMIT    — KV namespace for per-IP rate-limit counters
 */

const DEFAULTS = {
  to: 'mark@markward.dev',
  from: 'Mark Ward · markward.dev <noreply@markward.dev>',
};

const MIN_DWELL_MS = 4000;
const MAX_DWELL_MS = 1000 * 60 * 60 * 6; // 6h — beyond this, treat as stale page
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_SEC = 3600;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

const escapeHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || '');

async function verifyTurnstile(token, secret, ip) {
  if (!secret) return { ok: false, reason: 'turnstile-not-configured' };
  if (!token) return { ok: false, reason: 'turnstile-missing' };
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: !!data.success, reason: data['error-codes']?.join(',') || 'turnstile-failed' };
}

async function checkRateLimit(kv, ip) {
  if (!kv || !ip) return { ok: true };
  const key = `rl:${ip}`;
  const current = parseInt((await kv.get(key)) || '0', 10);
  if (current >= RATE_LIMIT_MAX) return { ok: false, retryAfter: RATE_LIMIT_WINDOW_SEC };
  await kv.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW_SEC });
  return { ok: true };
}

async function sendViaResend({ apiKey, from, to, replyTo, subject, html, text }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo ? [replyTo] : undefined,
      subject,
      html,
      text,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 200)}`);
  }
  return res.json();
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // Origin check — only accept submissions from the deployed site or local dev.
  const origin = request.headers.get('origin') || '';
  const allowed = [
    'https://markward.dev',
    'https://www.markward.dev',
  ];
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  if (origin && !isLocal && !allowed.includes(origin)) {
    return json({ error: 'Origin not allowed' }, 403);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const {
    name = '',
    email = '',
    stage = '',
    budget = '',
    message = '',
    company_url: honeypot = '',
    loaded_at: loadedAt = 0,
    turnstile_token: turnstileToken = '',
  } = payload || {};

  // ----- 1. Honeypot -----
  if (honeypot && honeypot.trim() !== '') {
    // Silent success so bots don't learn.
    return json({ ok: true });
  }

  // ----- 2. Dwell time -----
  const now = Date.now();
  const dwell = now - Number(loadedAt || 0);
  if (!loadedAt || dwell < MIN_DWELL_MS || dwell > MAX_DWELL_MS) {
    return json({ ok: true }); // silent for bots; humans rarely submit in < 4s
  }

  // ----- 3. Basic validation -----
  const errors = {};
  if (!name || name.length < 2 || name.length > 120) errors.name = 'Please add your name.';
  if (!isEmail(email) || email.length > 200) errors.email = 'Please add a valid email.';
  if (!message || message.length < 10 || message.length > 5000) {
    errors.message = 'A few sentences about what you\'re building helps me write back faster.';
  }
  if (Object.keys(errors).length) {
    return json({ error: 'Validation failed', errors }, 400);
  }

  // ----- 4. Turnstile -----
  const clientIp =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '';
  const ts = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, clientIp);
  if (!ts.ok) {
    return json({ error: 'Challenge failed', reason: ts.reason }, 400);
  }

  // ----- 5. Rate limit (optional KV) -----
  const rl = await checkRateLimit(env.CONTACT_RATE_LIMIT, clientIp);
  if (!rl.ok) {
    return json({ error: 'Too many submissions. Try again later.' }, 429, {
      'Retry-After': String(rl.retryAfter),
    });
  }

  // ----- 6. Compose & send -----
  if (!env.RESEND_API_KEY) {
    return json({ error: 'Email not configured' }, 500);
  }

  const subject = `New project inquiry — ${name}`;
  const lines = [
    ['Name', name],
    ['Email', email],
    stage && ['Stage', stage],
    budget && ['Budget', budget],
  ].filter(Boolean);

  const text = [
    ...lines.map(([k, v]) => `${k}: ${v}`),
    '',
    'Message:',
    message,
    '',
    `— Submitted from markward.dev (${clientIp || 'unknown ip'})`,
  ].join('\n');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #0a0a0b;">
      <h2 style="font-size: 20px; margin: 0 0 16px;">New project inquiry</h2>
      <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
        ${lines.map(([k, v]) => `
          <tr>
            <td style="padding: 6px 12px 6px 0; color: #71717a; vertical-align: top; white-space: nowrap;">${escapeHtml(k)}</td>
            <td style="padding: 6px 0; color: #0a0a0b;">${escapeHtml(v)}</td>
          </tr>
        `).join('')}
      </table>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <div style="font-size: 12px; color: #71717a; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em;">Message</div>
        <div style="font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>
      </div>
      <div style="margin-top: 24px; font-size: 12px; color: #a1a1aa;">
        Submitted from markward.dev · ${escapeHtml(clientIp || 'unknown')}
      </div>
    </div>
  `;

  try {
    await sendViaResend({
      apiKey: env.RESEND_API_KEY,
      from: env.CONTACT_FROM || DEFAULTS.from,
      to: env.CONTACT_TO || DEFAULTS.to,
      replyTo: email,
      subject,
      html,
      text,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('Resend send failed:', err);
    return json({ error: 'Could not send. Try again in a moment.' }, 502);
  }
}

// Pages Functions auto-returns 405 for other methods when only onRequestPost is exported.
