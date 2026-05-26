import React, { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { Reveal, PillButton, useLenis } from '../App.jsx';
import { ALL_STUDIES } from '../data/caseStudies.js';

/* ---------- data ---------- */

const PATHS = [
  {
    id: 'website',
    number: '01',
    kind: 'Fixed slot',
    title: 'Website',
    who: 'Founders, brands, creatives',
    pitch:
      'A design-forward marketing site in about two weeks. Custom-coded, conversion-aware, and built to make your business look like the people behind it actually care.',
    rightFor: [
      'You\'re launching something and the site needs to ship in weeks, not months',
      'Your current site is a template that\'s holding you back',
      'You want client-editable WordPress without the page-builder bloat',
      'You\'re a creative or brand whose work deserves to be the loudest thing on the page',
    ],
    notRightFor: [
      'You need a sprawling CMS migration or e-commerce platform — that\'s an Application',
      'You\'re looking for the cheapest possible site — there are better options for that',
    ],
    included: [
      'Custom design (no template kits)',
      'Mobile-first, accessibility-aware build',
      'CMS or Gutenberg WordPress when needed',
      'Performance budget — fast on real devices',
      'SEO foundations: schema, OG, sitemap',
      'Two rounds of revisions',
    ],
    timeline: 'About 2 weeks',
    timelineDetail: 'Discovery and design in week 1, build and launch in week 2. Faster if scope is tight.',
    pricing: 'Starting at $4k',
    pricingDetail: 'Most marketing sites land $4k–$8k depending on page count, content needs, and CMS complexity.',
    caseStudies: ['dustin-edwards-fine-art', 'dealer-transparency', 'conley-auto'],
    tags: ['Next.js', 'WordPress', 'Gutenberg', 'Tailwind'],
    ctaLabel: 'Claim a slot',
    formStage: 'Website Build',
    formBudget: '<$5k',
    tint: 'warm',
    accentClass: 'text-warm',
    accentBg: 'bg-warm-50',
  },
  {
    id: 'mvp',
    number: '02',
    kind: 'Fixed scope',
    title: 'MVP',
    who: 'Pre-seed founders & first-time builders',
    pitch:
      'A validated idea, turned into a shippable product, in six to eight weeks. Fixed scope, fixed price, fixed timeline — so you can demo, raise, or launch without scope drift eating your runway.',
    rightFor: [
      'You have a validated idea and need to ship the first real version',
      'You\'re fundraising and need a product to demo, not a deck',
      'You can commit to a fixed scope and trust the trade-offs that come with it',
      'You\'d rather ship one thing well than three things half-built',
    ],
    notRightFor: [
      'Your scope is still moving — that\'s a discovery problem, not a build problem',
      'You need a long-term technical partner — start with an Application engagement instead',
    ],
    included: [
      'Architecture and schema design',
      'Auth, billing (Stripe), and core workflows',
      'Production deployment with CI/CD',
      'Documentation your team can read',
      'Two weeks of post-launch hotfix support',
      'A clean handoff or path to retainer',
    ],
    timeline: '6–8 weeks',
    timelineDetail: 'Week 1 is architecture and scope lock. Weeks 2–6 are build. Weeks 7–8 are polish, launch, and handoff.',
    pricing: 'Starting at $10k',
    pricingDetail: 'Most MVPs land $10k–$20k. Multi-tenant, real-time, or payment-heavy scope pushes higher.',
    caseStudies: ['cropaide', 'projectaire'],
    tags: ['Next.js', 'Laravel', 'Stripe', 'Demo-ready'],
    ctaLabel: 'Start an MVP',
    formStage: 'MVP to Life',
    formBudget: '$5k - $15k',
    tint: 'sage',
    accentClass: 'text-sage',
    accentBg: 'bg-sage-50',
  },
  {
    id: 'application',
    number: '03',
    kind: 'Partnership',
    title: 'Application',
    who: 'Funded startups & scaling operators',
    pitch:
      'Complex platforms, SaaS products, and data-intensive applications built right the first time. Senior-led from architecture through deployment — no handoffs, no surprises, no junior engineer learning on your dime.',
    rightFor: [
      'You\'re building something category-defining and the architecture has to be right',
      'Your domain has real complexity: multi-tenancy, real-time, financial correctness, etc.',
      'You\'ve been burned by an agency before and want a senior partner this time',
      'You can spend three-plus months getting it right instead of three weeks getting it shipped',
    ],
    notRightFor: [
      'You need a marketing site or simple MVP — those are Website and MVP engagements',
      'You want body-shop staffing — I\'m not that',
    ],
    included: [
      'System design and architecture review before any code',
      'Senior-led implementation, optional trusted collaborators when scope demands',
      'Weekly demos — you see progress every Friday',
      'Production infrastructure, CI/CD, observability',
      'Documentation, runbooks, and a real handoff plan',
      'Post-launch support window',
    ],
    timeline: '3–6+ months',
    timelineDetail: 'No two applications are alike. Discovery defines scope; scope defines timeline. I\'ll be honest if it\'s longer than you hoped.',
    pricing: 'By proposal',
    pricingDetail: 'Proposals come in after a paid discovery week so the number you see reflects the actual scope, not a guess. Most applications land $50k+.',
    caseStudies: ['miles', 'cropaide', 'projectaire'],
    tags: ['Laravel', 'React', 'System design', 'Reverb', 'Multi-tenant'],
    ctaLabel: 'Apply for a project',
    formStage: 'Full Application',
    formBudget: '$50k+',
    tint: 'ink',
    accentClass: 'text-accent',
    accentBg: 'bg-ink-900',
    dark: true,
  },
  {
    id: 'advisory',
    number: '04',
    kind: 'Ongoing',
    title: 'Advisory',
    who: 'CTOs, founders, teams needing a second opinion',
    pitch:
      'Architecture reviews, technical due diligence, and second-opinion calls. Bring me in when you\'re stuck on a hard decision or want a senior set of eyes before you commit a quarter to a direction.',
    rightFor: [
      'You\'re a CTO or technical founder facing a high-stakes architectural decision',
      'You\'re evaluating an acquisition target and want technical due diligence',
      'Your team needs a second opinion before a major refactor or platform choice',
      'You want a senior sounding board on a per-session basis, not a long engagement',
    ],
    notRightFor: [
      'You need implementation hours — that\'s Application or Retainer',
      'You want a tutor — I\'m not that',
    ],
    included: [
      'Architecture review with written findings',
      'Technical due-diligence reports for M&A',
      'Code review against a specific concern',
      'Hard-decision sounding-board calls',
      'Optional follow-up implementation sprint',
    ],
    timeline: 'Hourly or sprint',
    timelineDetail: 'Most engagements are a single review (1–5 days) or a short sprint (1–2 weeks).',
    pricing: 'From $2k / review',
    pricingDetail: 'Single reviews are flat-priced based on scope. Sprints are billed weekly.',
    caseStudies: [],
    tags: ['Architecture', 'Due diligence', 'Code review'],
    ctaLabel: 'Book a session',
    formStage: 'Advisory',
    formBudget: '<$5k',
    tint: 'paper',
    accentClass: 'text-accent',
    accentBg: 'bg-paper-200/60',
  },
  {
    id: 'retainer',
    number: '05',
    kind: 'Ongoing',
    title: 'Retainer',
    who: 'Funded teams who want me in their corner',
    pitch:
      'Reserved hours each month, async Slack access, code reviews, roadmap input, and occasional implementation. The right fit when you don\'t need a full project but want senior engineering on tap.',
    rightFor: [
      'You\'re a funded team without a senior engineering presence in the room',
      'You want a long-term technical partner instead of a procurement event every six months',
      'You have a steady drumbeat of work that doesn\'t justify a full-time hire',
      'You value continuity — same person, same context, every month',
    ],
    notRightFor: [
      'You need a project shipped on a deadline — that\'s an Application or MVP',
      'You\'re looking for the lowest hourly rate available',
    ],
    included: [
      'Reserved monthly hours (configurable)',
      'Async Slack access during business hours',
      'Code reviews and architecture input',
      'Roadmap and prioritization input',
      'Occasional implementation, within hours',
      'Quarterly business reviews',
    ],
    timeline: 'Monthly · 3-month minimum',
    timelineDetail: 'Three-month minimum ensures the context stays warm. Renewals are by mutual agreement.',
    pricing: 'By engagement',
    pricingDetail: 'Priced per reserved hours per month. Most retainers land $4k–$10k/mo.',
    caseStudies: [],
    tags: ['Reserved hours', 'Async access', 'Roadmap'],
    ctaLabel: 'Start a retainer',
    formStage: 'Retainer',
    formBudget: '$5k - $15k',
    tint: 'paper',
    accentClass: 'text-accent',
    accentBg: 'bg-paper-200/40',
  },
];

const FAQ = [
  {
    q: 'How do you handle scope changes?',
    a: 'On fixed-scope work (Website, MVP), changes get logged as a change order with a price and timeline impact you approve before I start. On Application work, scope changes are part of the engagement — we re-prioritize at the next weekly demo. No surprise invoices, either way.',
  },
  {
    q: 'Do you do design too?',
    a: 'Yes. Every project I deliver includes design — typography, layout, interaction. For Application engagements with complex UI, I sometimes bring in a trusted product designer I\'ve worked with for years. You\'ll never see a "we\'ll figure out design later" line in a proposal.',
  },
  {
    q: 'Do you work with existing teams?',
    a: 'Often. Application and Retainer engagements are usually inside an existing team. I\'m comfortable in someone else\'s codebase, someone else\'s Slack, and someone else\'s sprint cadence — and I\'ll defer to your team\'s conventions, not impose mine.',
  },
  {
    q: 'Why fixed scope and timeline on Website and MVP?',
    a: 'Because hourly engagements punish the client for the engineer\'s velocity. Fixed scope means I have the same incentive you do: get it right, ship it, move on. If something takes me longer than estimated, that\'s my problem to solve.',
  },
  {
    q: 'Where are you based? Do you work in our timezone?',
    a: 'US-based, fully remote. I work across all US timezones and have regular client overlap with Europe. Anything outside that, we talk through it before the engagement starts.',
  },
  {
    q: 'How fast can you start?',
    a: 'Depends on what slots are open. Website slots typically book 2–4 weeks out. MVP and Application engagements start with a 1-week paid discovery, which we can usually schedule within 2 weeks of the first conversation.',
  },
  {
    q: 'Payment terms?',
    a: '50% on signed proposal, 50% on delivery for fixed-scope work. Application engagements bill monthly. Retainers are paid in advance for the month. I use Stripe, not net-60 invoicing.',
  },
  {
    q: 'What if it doesn\'t work out?',
    a: 'You can cancel a fixed-scope engagement at any time. Work completed is invoiced; work not started is refunded. On Application and Retainer engagements, the agreement spells out exit terms. The goal is alignment, not lock-in.',
  },
];

/* ---------- page ---------- */

const Bullet = ({ icon: Icon, iconClass, children, textClass = 'text-ink-soft' }) => (
  <li className="flex items-start gap-3">
    <Icon size={16} className={`mt-1 flex-shrink-0 ${iconClass}`} />
    <span className={`leading-relaxed ${textClass}`}>{children}</span>
  </li>
);

const PathSection = ({ path, related, onCta }) => {
  const dark = path.dark;
  const bgClass = dark ? 'bg-ink-900 text-paper-50' : path.id === 'website' ? 'bg-warm-50/40' : path.id === 'mvp' ? 'bg-sage-50/40' : path.id === 'retainer' ? 'bg-paper-200/40' : '';
  const textMuted = dark ? 'text-paper-200/80' : 'text-ink-soft';
  const textQuiet = dark ? 'text-paper-200/60' : 'text-ink-quiet';
  const borderClass = dark ? 'border-paper-50/15' : 'border-ink-900/15';
  const titleClass = dark ? 'text-paper-50' : 'text-ink-900';

  return (
    <section id={path.id} className={`scroll-mt-24 py-20 lg:py-28 ${bgClass}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-14 lg:space-y-20">
        {/* ---------- header ---------- */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal as="div" className="lg:col-span-5 space-y-6">
            <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${dark ? 'text-paper-200/70' : path.accentClass}`}>
              {path.number} · {path.kind}
            </div>
            <h2 className={`font-display font-medium text-5xl lg:text-7xl leading-[0.98] tracking-tighter2 ${titleClass}`}>
              {path.title}
            </h2>
            <div className={`text-sm ${textQuiet}`}>For {path.who}</div>
          </Reveal>
          <Reveal as="div" delay={100} className="lg:col-span-7 lg:col-start-6 space-y-6">
            <p className={`font-display text-2xl lg:text-3xl leading-[1.18] tracking-tighter2 ${titleClass}`}>
              {path.pitch}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {path.tags.map((t) => (
                <span key={t} className={`text-[11px] font-mono px-2 py-1 rounded border ${dark ? 'border-paper-50/20 text-paper-200/80' : 'border-ink-900/15 text-ink-quiet'}`}>
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ---------- fit ---------- */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <Reveal as="div" className="space-y-5">
            <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${dark ? 'text-paper-200/70' : path.accentClass}`}>
              Right for you if
            </div>
            <ul className="space-y-3">
              {path.rightFor.map((r) => (
                <Bullet key={r} icon={Check} iconClass={dark ? 'text-paper-50' : path.accentClass} textClass={textMuted}>
                  {r}
                </Bullet>
              ))}
            </ul>
          </Reveal>
          <Reveal as="div" delay={80} className="space-y-5">
            <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${textQuiet}`}>
              Not right for you if
            </div>
            <ul className="space-y-3">
              {path.notRightFor.map((r) => (
                <Bullet key={r} icon={X} iconClass={textQuiet} textClass={textMuted}>
                  {r}
                </Bullet>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ---------- included + meta ---------- */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal as="div" className="lg:col-span-7 space-y-5">
            <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${dark ? 'text-paper-200/70' : path.accentClass}`}>
              What’s included
            </div>
            <ul className="space-y-3">
              {path.included.map((i) => (
                <Bullet key={i} icon={Check} iconClass={dark ? 'text-paper-50' : path.accentClass} textClass={textMuted}>
                  {i}
                </Bullet>
              ))}
            </ul>
          </Reveal>
          <div className={`lg:col-span-5 space-y-6 lg:pl-10 lg:border-l ${borderClass}`}>
            <Reveal as="div">
              <div className={`font-mono text-[10px] uppercase tracking-[0.22em] mb-2 ${textQuiet}`}>Timeline</div>
              <div className={`text-xl font-display font-medium tracking-tighter2 ${titleClass}`}>{path.timeline}</div>
              <p className={`mt-2 text-sm leading-relaxed ${textMuted}`}>{path.timelineDetail}</p>
            </Reveal>
            <Reveal as="div" delay={80}>
              <div className={`font-mono text-[10px] uppercase tracking-[0.22em] mb-2 ${textQuiet}`}>Pricing</div>
              <div className={`text-xl font-display font-medium tracking-tighter2 ${titleClass}`}>{path.pricing}</div>
              <p className={`mt-2 text-sm leading-relaxed ${textMuted}`}>{path.pricingDetail}</p>
            </Reveal>
          </div>
        </div>

        {/* ---------- related work ---------- */}
        {related.length > 0 && (
          <Reveal as="div" className={`pt-10 border-t ${borderClass}`}>
            <div className={`font-mono text-[10px] uppercase tracking-[0.22em] mb-5 ${textQuiet}`}>
              Recent {path.title.toLowerCase()} work
            </div>
            <div className="flex flex-wrap gap-3">
              {related.map((cs) => (
                <Link
                  key={cs.slug}
                  to={`/${cs.type}/${cs.slug}`}
                  className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border ${
                    dark ? 'border-paper-50/20 text-paper-50 hover:bg-paper-50/10' : 'border-ink-900/20 text-ink-900 hover:border-ink-900/40 hover:bg-paper-200/60'
                  } transition-colors text-sm font-medium`}
                >
                  {cs.title}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {/* ---------- CTA ---------- */}
        <Reveal as="div" className={`pt-10 border-t ${borderClass}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p className={`font-display text-2xl lg:text-3xl tracking-tighter2 leading-[1.15] max-w-2xl ${titleClass}`}>
              Sounds like the right fit?
            </p>
            <PillButton
              variant={dark ? 'accent' : 'solid'}
              onClick={() => onCta(path)}
            >
              {path.ctaLabel} <ArrowRight size={16} />
            </PillButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------- the page ---------- */

export default function Services() {
  const navigate = useNavigate();
  const lenis = useLenis();
  const location = useLocation();

  // Scroll to hash target when navigating from a Triptych card
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -72 });
      else el.scrollIntoView({ behavior: 'smooth' });
    }, 120);
    return () => clearTimeout(t);
  }, [location.hash, lenis]);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Services — Mark Ward';
    const meta = document.querySelector('meta[name="description"]');
    const prevMeta = meta?.getAttribute('content');
    if (meta) meta.setAttribute('content', 'Five ways to work with Mark Ward — websites, MVPs, full applications, advisory, and retainers. Fixed-scope where it counts, senior-led throughout.');
    return () => {
      document.title = prev;
      if (meta && prevMeta != null) meta.setAttribute('content', prevMeta);
    };
  }, []);

  const handleCta = (path) => {
    navigate('/contact', { state: { stage: path.formStage, budget: path.formBudget } });
  };

  const scrollToPath = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -72 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="pt-32 pb-12 lg:pt-44 lg:pb-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
            Services — five ways to work together
          </Reveal>
          <Reveal as="h1" delay={80} className="font-display font-medium text-[clamp(2.5rem,6.5vw,5.75rem)] leading-[0.95] tracking-tighter2 max-w-4xl">
            Pick the path that fits <em className="italic font-normal text-accent">where you actually are.</em>
          </Reveal>
          <Reveal as="p" delay={160} className="mt-8 max-w-2xl text-lg text-ink-soft leading-relaxed">
            Each path below is a real engagement model — with a fixed scope where it counts,
            a senior engineer running it from start to finish, and a price you can plan around.
            No mystery agency rate cards.
          </Reveal>
        </div>
      </section>

      {/* ---------- in-page nav ---------- */}
      <section className="pb-12 lg:pb-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="flex flex-wrap gap-2 border-t border-ink-900/15 pt-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet mr-4 mt-2">
              Jump to
            </div>
            {PATHS.map((p) => (
              <button
                key={p.id}
                onClick={() => scrollToPath(p.id)}
                className="text-sm px-4 py-2 rounded-full border border-ink-900/15 text-ink-900 hover:border-ink-900/40 hover:bg-paper-200/60 transition-colors"
              >
                <span className="font-mono text-[10px] text-ink-quiet mr-2">{p.number}</span>
                {p.title}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- paths ---------- */}
      {PATHS.map((path) => {
        const related = path.caseStudies
          .map((slug) => ALL_STUDIES.find((s) => s.slug === slug))
          .filter(Boolean);
        return <PathSection key={path.id} path={path} related={related} onCta={handleCta} />;
      })}

      {/* ---------- FAQ ---------- */}
      <section className="py-24 lg:py-32 border-t border-ink-900/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <Reveal as="div" className="lg:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">
                Common questions
              </div>
              <h2 className="font-display font-medium text-4xl lg:text-5xl leading-[1] tracking-tighter2">
                Answered before you <em className="italic font-normal text-ink-soft">have to ask.</em>
              </h2>
            </Reveal>
            <Reveal as="div" delay={100} className="lg:col-span-8 space-y-8">
              {FAQ.map((f) => (
                <div key={f.q} className="pb-8 border-b border-ink-900/10 last:border-b-0">
                  <h3 className="font-display text-xl lg:text-2xl font-medium leading-[1.2] tracking-tighter2 mb-3">
                    {f.q}
                  </h3>
                  <p className="text-ink-soft leading-relaxed">{f.a}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- closing CTA (light, bridges into the global footer) ---------- */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-10 border-b border-ink-900/15">
            <div className="max-w-2xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">
                Ready when you are
              </div>
              <h2 className="font-display font-medium text-3xl lg:text-5xl leading-[1.05] tracking-tighter2">
                None of these fit exactly? <em className="italic font-normal text-ink-soft">Tell me anyway.</em>
              </h2>
              <p className="mt-5 text-ink-soft leading-relaxed max-w-xl">
                If your project sits between paths or somewhere else entirely, send a message
                — I’ll tell you honestly whether I’m the right person, and who is if I’m not.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <PillButton variant="accent" onClick={() => navigate('/contact')}>
                Start a project <ArrowRight size={16} />
              </PillButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
