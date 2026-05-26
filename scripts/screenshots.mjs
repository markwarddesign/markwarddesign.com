#!/usr/bin/env node
/**
 * Capture screenshots of the live client sites + app marketing pages.
 *
 * Output: public/screenshots/<slug>.png (above-the-fold desktop)
 *
 * Re-run anytime a site updates:
 *   node scripts/screenshots.mjs
 *
 * Capture just one slug:
 *   node scripts/screenshots.mjs --only=dealer-transparency
 *
 * Each capture is a 1440×900 viewport above-the-fold shot. Full-page shots
 * are sometimes worse for editorial cards because they squash detail; we
 * use viewport-only and let the card crop with object-cover.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'screenshots');

const TARGETS = [
  { slug: 'dustin-edwards-fine-art', url: 'https://dustinedwardsfineart.com/' },
  { slug: 'sculpting-time', url: 'https://sculpting-time.com/' },
  { slug: 'dealer-transparency', url: 'https://dealertransparency.com/' },
  { slug: 'conley-auto', url: 'https://markwarddesign.github.io/conleyauto/' },
  { slug: 'tbone-construction', url: 'https://markw1124.sg-host.com/' },
  { slug: 'miles', url: 'https://miles.dealertransparency.com/', wait: 'domcontentloaded' },
  { slug: 'cropaide', url: 'https://cropaide.com/' },
  { slug: 'projectaire', url: 'https://projectaire.app/' },
];

const args = process.argv.slice(2);
const onlyArg = args.find((a) => a.startsWith('--only='));
const onlySlug = onlyArg ? onlyArg.split('=')[1] : null;
const targets = onlySlug ? TARGETS.filter((t) => t.slug === onlySlug) : TARGETS;

if (!targets.length) {
  console.error(`No targets match --only=${onlySlug}`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1, // 1x — JPEGs at this size land ~150–400KB, plenty for editorial cards
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
});

let ok = 0;
let failed = [];

for (const t of targets) {
  const heroOut = join(OUT_DIR, `${t.slug}.jpg`);
  const fullOut = join(OUT_DIR, `${t.slug}-full.jpg`);
  try {
    console.log(`→ ${t.slug}  ${t.url}`);
    const page = await context.newPage();
    await page.goto(t.url, { waitUntil: t.wait || 'networkidle', timeout: 45_000 });
    // Give late-loading hero imagery/animations a beat to settle.
    await page.waitForTimeout(t.wait === 'domcontentloaded' ? 3500 : 1200);
    // Above-the-fold hero capture
    await page.screenshot({ path: heroOut, fullPage: false, type: 'jpeg', quality: 82 });
    // Full-page capture — scroll once first so lazy-loaded media kicks in
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const step = 600;
        const interval = setInterval(() => {
          window.scrollTo(0, y);
          y += step;
          if (y >= document.body.scrollHeight) {
            clearInterval(interval);
            window.scrollTo(0, 0);
            setTimeout(resolve, 400);
          }
        }, 80);
      });
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: fullOut, fullPage: true, type: 'jpeg', quality: 78 });
    await page.close();
    ok += 1;
    console.log(`  ✓ saved ${heroOut}`);
    console.log(`  ✓ saved ${fullOut}`);
  } catch (err) {
    failed.push({ slug: t.slug, url: t.url, error: err.message });
    console.log(`  ✗ ${err.message}`);
  }
}

await browser.close();

console.log(`\nCaptured ${ok}/${targets.length}.`);
if (failed.length) {
  console.log('\nFailures:');
  for (const f of failed) console.log(`  - ${f.slug} (${f.url}) — ${f.error}`);
  process.exit(1);
}
