/**
 * Case study content. The shape is intentionally repetitive so the detail
 * template can render every study the same way — content edits here, not
 * across nine JSX files.
 *
 * Copy is written for *prospects*, not recruiters: every page is a sales
 * argument for hiring me to build something similar.
 */

export const APP_STUDIES = [
  {
    slug: 'miles',
    type: 'apps',
    kicker: 'Enterprise SaaS · Automotive',
    title: 'MILES',
    subtitle: 'A real-time offer engine that replaced a generation of dealership spreadsheets.',
    role: 'Co-founder & lead developer',
    client: 'Dealer Transparency',
    href: 'https://miles.dealertransparency.com',
    accentClass: 'text-warm',
    tint: 'warm',
    hireFor: 'Multi-tenant SaaS · Real-time data pipelines · Financial calculations',
    pitch:
      'A penny-perfect, real-time SaaS replacing the most expensive spreadsheet in the dealership — the one that decides what every customer pays.',
    metaDescription:
      'MILES — a real-time, multi-tenant offer engine I co-founded and built for automotive dealerships. 99.9% uptime, five active rooftops, sub-24-hour hotfix cycle.',
    stats: [
      { label: 'Active rooftops', value: '5' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Hotfix cycle', value: '< 24h' },
      { label: 'Calculation accuracy', value: 'Penny-perfect' },
    ],
    situation: {
      heading: 'The situation',
      body: [
        'Dealerships run on a spreadsheet — the one that holds every car\'s price, every incentive, every regional tax, and every lender quirk. When the math is wrong, customers walk. When the math is right but slow, customers still walk.',
        'The category was full of legacy tools that were either too slow to use at the desk or too rigid to handle real-world deal structures. Dealer Transparency hired me to build the alternative — and to co-found the company around it.',
      ],
    },
    approach: {
      heading: 'What I built',
      body: [
        'A reactive offer engine in Laravel and React with WebSocket pipelines that keep inventory, pricing, and incentives current across every connected desk. The calculation core uses the Strategy pattern so regional rules, lender programs, and dealer-specific overrides can be composed instead of forked.',
        'Every change a desk manager makes propagates to the deal screen in milliseconds — and to every other connected desk through Laravel Reverb broadcasting. That removes the entire class of "stale spreadsheet" mistakes that used to cost dealerships real money.',
        'Multi-rooftop dealers get tenant-isolated configuration with per-store overrides, role-based access, and audit logs. The corporate office and the floor staff each see exactly what they should — and nothing they shouldn\'t.',
      ],
    },
    outcomes: {
      heading: 'What it does',
      body: [
        'Live at five active dealerships with 99.9% uptime since launch. Sub-24-hour hotfix cycle on the rare day something breaks.',
        'Penny-perfect financial calculations across every tax jurisdiction and incentive stack we\'ve thrown at it. No more "the spreadsheet said $X but the contract says $Y."',
        'Desk-to-deal time measured in seconds instead of minutes — which compounds into more deals closed per day per desk.',
      ],
    },
    pages: [
      {
        name: 'Inventory dashboard',
        screenshotLabel: 'MILES · Inventory dashboard',
        copy: 'A live read on what\'s in stock, what\'s in motion, and what needs attention — pulled fresh from the DMS without a manual export in sight.',
      },
      {
        name: 'Offer builder',
        screenshotLabel: 'MILES · Offer builder',
        copy: 'Walk a customer from interest to paperwork without leaving the screen. Strategy-pattern calculations handle every regional tax, lender quirk, and incentive stack.',
      },
      {
        name: 'Live sync engine',
        screenshotLabel: 'MILES · Sync engine',
        copy: 'WebSocket pipelines and scheduled syncs keep DMS data current without anyone clicking refresh. Reverb broadcasting keeps every desk in agreement.',
      },
      {
        name: 'Multi-rooftop admin',
        screenshotLabel: 'MILES · Rooftop admin',
        copy: 'Tenant-isolated configuration, per-store overrides, and role-based access — corporate sees corporate, the floor sees the floor.',
      },
    ],
    stack: ['Laravel 12', 'React 18', 'TypeScript', 'Zustand', 'MySQL', 'Laravel Reverb', 'Laravel Cloud'],
    cta: {
      heading: 'Building something like this?',
      body: 'If you\'re sitting on a category-defining SaaS idea — especially one with hard data correctness requirements — this is the kind of work I take on.',
    },
  },
  {
    slug: 'cropaide',
    type: 'apps',
    kicker: 'Multi-tenant SaaS · Agriculture',
    title: 'CropAide',
    subtitle: 'A three-sided agricultural platform taken from zero to public beta.',
    role: 'Co-founder & lead architect',
    client: 'CropAide',
    href: 'https://cropaide.com',
    accentClass: 'text-sage',
    tint: 'sage',
    hireFor: 'Multi-tenant SaaS · Row-level authorization · CDN-scale media',
    pitch:
      'Growers, advisors, and dealers — three audiences with different permissions on the same data. Built from a blank schema to public beta without a permission bug shipped to production.',
    metaDescription:
      'CropAide — a multi-tenant agricultural SaaS I co-founded and architected. Row-level policy authorization, CDN-offloaded media, Stripe-billed tiers.',
    stats: [
      { label: 'Tenant isolation', value: '100%' },
      { label: 'Permission tiers', value: '3' },
      { label: 'Media', value: 'CDN-offloaded' },
      { label: 'Status', value: 'Public beta' },
    ],
    situation: {
      heading: 'The situation',
      body: [
        'Agriculture is a three-sided business: growers run the fields, advisors recommend treatments, dealers sell the inputs. The existing tools all picked one side and treated the other two as second-class — which meant nobody actually used them together.',
        'CropAide needed a single platform where the same field could be viewed by all three roles, with each role seeing exactly what they\'re allowed to and nothing else. No leaks. No "oops, the dealer saw the advisor\'s private notes."',
      ],
    },
    approach: {
      heading: 'What I built',
      body: [
        'Row-level policy-based authorization built into the data model from day one. Every query carries the user\'s role and tenant; the database enforces what the application code requests. No "check the permission in the controller" leaks possible.',
        'Media — the scouting photos, the field maps, the high-res aerials — gets offloaded to Cloudflare R2 so the app stays fast no matter how many seasons of data accumulate. Growers don\'t pay for storage they\'re not using.',
        'End-to-end Stripe billing handles trials, upgrades, and proration with per-tenant invoicing. Finance can stop chasing receipts; each tenant has a clean dashboard of their own usage.',
      ],
    },
    outcomes: {
      heading: 'What it does',
      body: [
        'Public beta with zero permission bugs shipped to production — because the permission model is enforced at the database, not the UI.',
        'Three-role workflows that actually work as one product: a grower\'s field, an advisor\'s recommendation, a dealer\'s order — all stitched together without any party seeing what they shouldn\'t.',
        'A media pipeline that handles thousands of high-res scouting photos per tenant per season without making the app slow.',
      ],
    },
    pages: [
      {
        name: 'Field overview',
        screenshotLabel: 'CropAide · Field overview',
        copy: 'A grower-first map and list view that puts last week\'s scouting notes, this week\'s recommendations, and next week\'s plan side-by-side.',
      },
      {
        name: 'Advisor recommendations',
        screenshotLabel: 'CropAide · Advisor view',
        copy: 'Advisors push recommendations directly into a grower\'s field context — not a PDF, not an email. Growers see the why next to the what.',
      },
      {
        name: 'In-field scouting',
        screenshotLabel: 'CropAide · Scouting',
        copy: 'Mobile-first scouting captures notes, photos, and pest pressure tied to GPS — uploaded direct to Cloudflare R2 to keep the app fast.',
      },
      {
        name: 'Billing & tenancy',
        screenshotLabel: 'CropAide · Billing',
        copy: 'Stripe-powered trials, upgrades, and proration with tenant-isolated invoicing. No spreadsheets, no shared accounts, no surprises.',
      },
    ],
    stack: ['Laravel 11', 'PHP 8.2', 'MySQL', 'Cloudflare R2', 'Stripe'],
    cta: {
      heading: 'Building a multi-sided platform?',
      body: 'If your product has more than one type of user looking at the same data with different permissions, get the authorization model right from day one. That\'s what this kind of work is for.',
    },
  },
  {
    slug: 'projectaire',
    type: 'apps',
    kicker: 'Construction SaaS · Real-time collaboration',
    title: 'ProjectAire',
    subtitle: 'A construction-management SaaS with live plan markup and three-tier plan gating.',
    role: 'Co-founder & lead engineer',
    client: 'ProjectAire',
    href: 'https://projectaire.app',
    accentClass: 'text-accent',
    tint: 'paper',
    hireFor: 'Real-time collaboration · Document/PDF tooling · Plan-gated SaaS',
    pitch:
      'A construction PM platform where the plan viewer is the product — multi-user XFDF annotations broadcast in real time, three pricing tiers gated at the middleware, fourteen-day trial with no credit card.',
    metaDescription:
      'ProjectAire — a construction project-management SaaS I co-founded. Real-time plan markup via Apryse + Reverb, middleware-enforced plan gating, pre-aggregated metrics.',
    stats: [
      { label: 'Pricing tiers', value: '3 + trial' },
      { label: 'Collaboration', value: 'Real-time WS' },
      { label: 'Annotations', value: 'XFDF · multi-user' },
      { label: 'Trial', value: '14d · no card' },
    ],
    situation: {
      heading: 'The situation',
      body: [
        'Construction project management has a hundred tools and most of them email PDFs back and forth. The plans become "plans v7 FINAL FINAL.pdf" within a week of any project starting.',
        'ProjectAire needed to be the place where the plans actually live — markups, revisions, RFIs, and tasks all tied to the same drawing, all visible to everyone with permission, all in real time.',
      ],
    },
    approach: {
      heading: 'What I built',
      body: [
        'Apryse WebViewer integrated end-to-end in three weeks, including multi-user annotation sync via Laravel Reverb broadcasting XFDF deltas. A superintendent in the field and a PM at the desk see each other\'s markups as they happen.',
        'A pre-aggregated metrics engine surfaces real numbers — open RFIs, late tasks, plan revisions — without forcing a PM to chase status updates from five inboxes.',
        'Three pricing tiers enforced by middleware, not by hiding UI. A trial user gets the full product for fourteen days with no credit card — and the upgrade path is honest about what each tier unlocks.',
      ],
    },
    outcomes: {
      heading: 'What it does',
      body: [
        'A live plan viewer that has finally killed "plans v7 FINAL FINAL.pdf" for the teams using it.',
        'A trial flow that converts because the product is real — fourteen days, full features, no upgrade prompts mid-task.',
        'A metrics dashboard that surfaces project bottlenecks the day they happen instead of the week after.',
      ],
    },
    pages: [
      {
        name: 'Project dashboard',
        screenshotLabel: 'ProjectAire · Dashboard',
        copy: 'Pre-aggregated metrics show open RFIs, late tasks, and plan revisions in one view — no chasing status from five inboxes.',
      },
      {
        name: 'Live plan viewer',
        screenshotLabel: 'ProjectAire · Plan viewer',
        copy: 'Apryse WebViewer with Reverb-broadcast annotations means field markups and desk markups merge in real time.',
      },
      {
        name: 'Tasks & schedule',
        screenshotLabel: 'ProjectAire · Tasks',
        copy: 'Tasks tied to drawings, drawings tied to phases, phases tied to schedule. The data model holds it together.',
      },
      {
        name: 'Trial & pricing',
        screenshotLabel: 'ProjectAire · Pricing',
        copy: 'Middleware-enforced tiers. Fourteen-day trial. No card. No dark-pattern paywalls mid-task.',
      },
    ],
    stack: ['Laravel', 'React', 'MySQL', 'Stripe', 'Apryse WebViewer', 'Laravel Reverb'],
    cta: {
      heading: 'Need real-time collaboration done right?',
      body: 'If your product depends on multiple people working on the same document at the same time, the architecture has to be right before the UI gets pretty. This is that kind of work.',
    },
  },
];

export const SITE_STUDIES = [
  {
    slug: 'dustin-edwards-fine-art',
    type: 'websites',
    kicker: 'Fine art portfolio',
    title: 'Dustin Edwards Fine Art',
    subtitle: 'A quiet, monochromatic showcase built so the brushwork arrives first.',
    role: 'Design & build',
    client: 'Dustin Edwards',
    href: 'https://dustinedwardsfineart.com/',
    accentClass: 'text-accent',
    tint: 'paper',
    hireFor: 'Artist portfolios · Editorial gallery sites · Collector inquiry flows',
    pitch:
      'A working fine artist needed a portfolio that lets the work do the talking — and a low-friction path for collectors to reach out without ever feeling sold to.',
    metaDescription:
      'Dustin Edwards Fine Art — a custom artist portfolio site built around the work itself. Editorial gallery, collection grouping, and a quiet collector inquiry flow.',
    stats: [
      { label: 'Focus', value: 'Editorial gallery' },
      { label: 'Built for', value: 'Collectors' },
      { label: 'Type', value: 'Custom WordPress' },
    ],
    situation: {
      heading: 'The situation',
      body: [
        'Most artist portfolio sites are either drag-and-drop template sites that look like everyone else\'s, or custom builds so heavy the artist can\'t update them without calling someone. Dustin needed something in the middle — bespoke design, easy upkeep.',
      ],
    },
    approach: {
      heading: 'What I built',
      body: [
        'A custom WordPress theme designed around the work — typography-led, monochromatic, every page composed so the painting is the loudest thing on it. Collections, individual works, and a collector inquiry path that feels like a conversation, not a checkout.',
      ],
    },
    outcomes: {
      heading: 'What it does',
      body: [
        'A portfolio Dustin can update himself, that looks like nobody else\'s, and that gives collectors a quiet, dignified path to reach out.',
      ],
    },
    pages: [
      {
        name: 'Home / hero',
        screenshotLabel: 'Dustin Edwards · Home',
        copy: 'The first thing a visitor sees is the painting. Everything else is in service to that.',
      },
      {
        name: 'Gallery',
        screenshotLabel: 'Dustin Edwards · Gallery',
        copy: 'Collections grouped by series, with deliberate pacing — no infinite scroll, no aggressive grids.',
      },
      {
        name: 'Inquiry',
        screenshotLabel: 'Dustin Edwards · Inquiry',
        copy: 'A collector inquiry path that feels like a conversation, not a transaction.',
      },
    ],
    stack: ['WordPress', 'Custom theme', 'PHP'],
    cta: {
      heading: 'Working artist? Studio?',
      body: 'A portfolio site shouldn\'t look like the painting\'s frame — it should disappear. If that\'s the kind of site you need, this is the kind of work I do.',
    },
  },
  {
    slug: 'sculpting-time',
    type: 'websites',
    kicker: 'Artisan · Kinetic clocks',
    title: 'Sculpting Time',
    subtitle: 'A showcase for one-of-a-kind kinetic clocks built by a master finish carpenter.',
    role: 'Design & build',
    client: 'Sculpting Time',
    href: 'https://sculpting-time.com/',
    accentClass: 'text-warm',
    tint: 'warm',
    hireFor: 'Artisan & maker sites · Craft brand showcases · Provenance-led storytelling',
    pitch:
      'Forty-plus years of finish carpentry behind every clock — and a website that finally honors the craft. A gallery-first site where the work, the wood, and the maker’s hand are the loudest things on the page.',
    metaDescription:
      'Sculpting Time — a portfolio site for a master finish carpenter turned kinetic-clock maker. Gallery-first design, deliberate pacing, and a maker’s story.',
    stats: [
      { label: 'Focus', value: 'Kinetic clocks' },
      { label: 'Built for', value: 'Collectors' },
      { label: 'Type', value: 'Custom WordPress' },
    ],
    situation: {
      heading: 'The situation',
      body: [
        'A craftsman with four decades of finish carpentry experience, now building one-of-a-kind kinetic clocks. The work was extraordinary; the existing online presence was treating each piece like a product listing instead of a sculpture.',
      ],
    },
    approach: {
      heading: 'What I built',
      body: [
        'A gallery-first site with editorial typography, deliberate pacing, and room for each piece to breathe. The maker’s story — the carpentry roots, the moving parts, the patience of the craft — is woven into the structure, not buried in an "About" tab.',
      ],
    },
    outcomes: {
      heading: 'What it does',
      body: [
        'A site that presents each clock as a sculpture, not a SKU — and gives serious collectors a quiet, dignified path to make contact.',
      ],
    },
    pages: [
      {
        name: 'Gallery',
        screenshotLabel: 'Sculpting Time · Gallery',
        copy: 'Each piece presented like a sculpture, not a product card.',
      },
      {
        name: 'Maker’s story',
        screenshotLabel: 'Sculpting Time · About',
        copy: 'Forty years of finish carpentry, woven into the brand — not buried in About.',
      },
      {
        name: 'Inquiry',
        screenshotLabel: 'Sculpting Time · Inquiry',
        copy: 'A quiet path for serious collectors to start a conversation.',
      },
    ],
    stack: ['WordPress', 'Custom theme', 'PHP'],
    cta: {
      heading: 'Maker, artisan, craftsperson?',
      body: 'If your work deserves a website that treats it as work — not inventory — this is the kind of build that does.',
    },
  },
  {
    slug: 'dealer-transparency',
    type: 'websites',
    kicker: 'B2B SaaS marketing',
    title: 'Dealer Transparency',
    subtitle: 'The public face of an automotive SaaS company — credibility on every page.',
    role: 'Design & build',
    client: 'Dealer Transparency',
    href: 'https://dealertransparency.com/',
    accentClass: 'text-accent',
    tint: 'ink',
    hireFor: 'B2B marketing sites · SaaS positioning · Lead conversion',
    pitch:
      'A SaaS company\'s marketing site has one job: get the right dealership on the phone with sales. Built to convert, designed to look like the people behind it actually care.',
    metaDescription:
      'Dealer Transparency — a B2B SaaS marketing site built to convert qualified dealerships into sales conversations.',
    stats: [
      { label: 'Focus', value: 'B2B credibility' },
      { label: 'Built for', value: 'Sales conversion' },
      { label: 'Type', value: 'React SPA' },
    ],
    situation: {
      heading: 'The situation',
      body: [
        'When a dealership operator is evaluating SaaS, they\'re ten minutes on the website before they decide whether to book the demo. That site has to do a lot in those ten minutes — explain the product, prove the team is credible, and make the next step obvious.',
      ],
    },
    approach: {
      heading: 'What I built',
      body: [
        'A React + Tailwind marketing site with a sharp positioning hero, a product walkthrough that mirrors how the buyer evaluates, social proof in the right places, and a single, well-placed CTA. No dark patterns, no fake countdowns, no "limited time" nonsense — that\'s not how enterprise dealerships buy.',
      ],
    },
    outcomes: {
      heading: 'What it does',
      body: [
        'A site that does the qualifying work before the sales call — so the calls that do happen are with the right dealerships, ready to move.',
      ],
    },
    pages: [
      {
        name: 'Hero & positioning',
        screenshotLabel: 'Dealer Transparency · Hero',
        copy: 'The product\'s value proposition in the first 200 pixels.',
      },
      {
        name: 'Product walkthrough',
        screenshotLabel: 'Dealer Transparency · Product',
        copy: 'A walkthrough that mirrors how the buyer evaluates the category.',
      },
      {
        name: 'Demo request',
        screenshotLabel: 'Dealer Transparency · Demo',
        copy: 'A single, well-placed CTA. No dark patterns.',
      },
    ],
    stack: ['React', 'Tailwind', 'Vite'],
    cta: {
      heading: 'B2B SaaS positioning?',
      body: 'If your marketing site looks like a template and your conversion rate shows it, this is the kind of redesign I do.',
    },
  },
  {
    slug: 'conley-auto',
    type: 'websites',
    kicker: 'Industry consulting',
    title: 'Conley Auto',
    subtitle: 'Forty years in the auto industry, finally on a website that earns the credibility.',
    role: 'Design & build',
    client: 'Conley Auto',
    href: 'https://markwarddesign.github.io/conleyauto/',
    status: 'Pre-launch · conleyauto.com',
    accentClass: 'text-warm',
    tint: 'warm',
    hireFor: 'Solo-expert sites · Consulting practices · Authority positioning',
    pitch:
      'A site for a forty-year auto-industry veteran moving into consulting. The job: convey "this person has seen it all" in the first thirty seconds — and make booking a conversation feel like the only logical next step.',
    metaDescription:
      'Conley Auto — a solo-expert consulting site that turns forty years of auto-industry experience into instantly legible credibility, with a clear path to a first call.',
    stats: [
      { label: 'Focus', value: 'Auto-industry consulting' },
      { label: 'Built for', value: 'Booking conversations' },
      { label: 'Type', value: 'Static site' },
    ],
    situation: {
      heading: 'The situation',
      body: [
        'A veteran with forty years of auto-industry experience, stepping out on his own as a consultant. Decades of credibility, but no website to carry it — and no clear way for prospective clients to find the work or start a conversation.',
      ],
    },
    approach: {
      heading: 'What I built',
      body: [
        'A focused, authority-led site that puts the forty-year track record front-and-center, breaks the consulting offer into language a dealer principal or operator actually uses, and gives every page a single, obvious next step: get on a call.',
      ],
    },
    outcomes: {
      heading: 'What it does',
      body: [
        'A site that does the credibility-building work before the first conversation — so the calls that do happen are with operators who already know who they’re hiring.',
      ],
    },
    pages: [
      {
        name: 'Hero & positioning',
        screenshotLabel: 'Conley Auto · Hero',
        copy: 'Forty years of experience, said plainly. No buzzwords, no stock imagery.',
      },
      {
        name: 'Consulting offer',
        screenshotLabel: 'Conley Auto · Services',
        copy: 'What the engagement looks like, in language operators actually use.',
      },
      {
        name: 'Book a call',
        screenshotLabel: 'Conley Auto · Contact',
        copy: 'One obvious next step on every page. No forms competing for attention.',
      },
    ],
    stack: ['Static site', 'Tailwind'],
    cta: {
      heading: 'Solo expert? Veteran going independent?',
      body: 'If you’ve got decades of experience and need a website that says so without bragging, this is the kind of build that does.',
    },
  },
  {
    slug: 'tbone-construction',
    type: 'websites',
    kicker: 'Trades business',
    title: 'T-Bone Construction',
    subtitle: 'A trades site that does the three things trades sites actually need to do.',
    role: 'Design & build',
    client: 'T-Bone Construction',
    href: 'https://markw1124.sg-host.com/',
    status: 'Pre-launch · tboneconstruction.org',
    accentClass: 'text-sage',
    tint: 'sage',
    hireFor: 'Trades & contractor sites · Quote-request funnels · Mobile-first builds',
    pitch:
      'Trades sites don\'t need to be clever — they need to show the work, explain the services, and make calling for a quote take one tap. Built one that does exactly that, with nothing else in the way.',
    metaDescription:
      'T-Bone Construction — a trades business website built around the three jobs trades sites actually have: show the work, explain the services, make quote requests easy.',
    stats: [
      { label: 'Focus', value: 'Trade services' },
      { label: 'Built for', value: 'Quote requests' },
      { label: 'Type', value: 'Custom WordPress' },
    ],
    situation: {
      heading: 'The situation',
      body: [
        'A construction business with great work and a website that didn\'t show it. The competitors all had the same drag-and-drop template; the differentiator had to come from the work itself.',
      ],
    },
    approach: {
      heading: 'What I built',
      body: [
        'A focused trades site: a project gallery that lets the work speak, a clear service breakdown for the homeowner who doesn\'t know construction jargon, and a quote request flow that takes one tap on mobile.',
      ],
    },
    outcomes: {
      heading: 'What it does',
      body: [
        'A site that turns visitors into quote requests — without making them work to do it.',
      ],
    },
    pages: [
      {
        name: 'Home',
        screenshotLabel: 'T-Bone · Home',
        copy: 'Work, services, quote. Nothing else competing for attention.',
      },
      {
        name: 'Project gallery',
        screenshotLabel: 'T-Bone · Projects',
        copy: 'Every project a proof point.',
      },
      {
        name: 'Quote request',
        screenshotLabel: 'T-Bone · Quote',
        copy: 'One tap on mobile from "interested" to "in your inbox."',
      },
    ],
    stack: ['WordPress', 'Custom theme'],
    cta: {
      heading: 'Trades, contractor, service business?',
      body: 'If your site doesn\'t turn visitors into quote requests, that\'s the only metric that matters. This is the build that fixes it.',
    },
  },
];

export const ALL_STUDIES = [...APP_STUDIES, ...SITE_STUDIES];

export const getStudy = (type, slug) =>
  ALL_STUDIES.find((s) => s.type === type && s.slug === slug);

export const getNeighbors = (type, slug) => {
  const list = type === 'apps' ? APP_STUDIES : SITE_STUDIES;
  const idx = list.findIndex((s) => s.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const prev = idx > 0 ? list[idx - 1] : list[list.length - 1];
  const next = idx < list.length - 1 ? list[idx + 1] : list[0];
  return { prev, next };
};
