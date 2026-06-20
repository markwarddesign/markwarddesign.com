import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { Reveal, PillButton } from '../App.jsx';

const STEPS = [
  {
    n: '01',
    title: 'Discovery',
    pitch: 'A deep listen, not a sales pitch.',
    body:
      'We talk through your business goals, your users, and the constraints — budget, timeline, team, technical debt. No code is considered yet. You leave with a clearer picture of the project; I leave with enough to scope it honestly.',
  },
  {
    n: '02',
    title: 'Architecture',
    pitch: 'Hard decisions, made before sprint one.',
    body:
      'Schema, API contracts, infrastructure, stack — written down before I write any feature code. Multi-tenancy, auth, billing, scaling: the stuff that\'s expensive to change later gets locked in now.',
  },
  {
    n: '03',
    title: 'Build & iterate',
    pitch: 'Weekly demos. No hidden progress.',
    body:
      'Transparent sprints with a working demo every Friday. You see what\'s built, what\'s next, and what\'s blocked. No "we\'ll show you at the end" — that\'s how projects go off the rails.',
  },
  {
    n: '04',
    title: 'Launch & scale',
    pitch: 'I don\'t disappear at launch.',
    body:
      'Deployment, monitoring, runbooks, and documentation your team can read. Plus a post-launch window for hotfixes — because the first two weeks in production are when you actually learn what\'s broken.',
  },
];

const DONT = [
  'Junior team work — every hour you pay for is senior-led',
  'Body-shop staffing — I\'m a partner, not a contractor seat',
  '$500 sites — there are better fits at that price',
  'Cookie-cutter agency processes — small teams need a different cadence',
  'Disappearing after launch — handoff is part of the engagement, not an upsell',
];

const CREDENTIALS = [
  { value: '15+', label: 'Years shipping production' },
  { value: '150+', label: 'Websites built' },
  { value: '3', label: 'SaaS products co-founded' },
  { value: '2011', label: 'Remote since' },
];

const WHAT_I_BUILD = [
  'Multi-tenant SaaS architecture',
  'Real-time WebSocket systems',
  'Headless CMS + Next.js front ends',
  'Penny-perfect financial calculation engines',
  'Document & PDF tooling with multi-user sync',
  'CI/CD, observability, and runbooks',
  'Custom WordPress + Gutenberg builds',
  'Stripe billing end-to-end',
];

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    const prev = document.title;
    document.title = 'About — Mark Ward';
    const meta = document.querySelector('meta[name="description"]');
    const prevMeta = meta?.getAttribute('content');
    if (meta) meta.setAttribute('content', 'Who Mark Ward is and how he works — 15+ years of production engineering, three co-founded SaaS products, and a process built around your business, not his.');
    return () => {
      document.title = prev;
      if (meta && prevMeta != null) meta.setAttribute('content', prevMeta);
    };
  }, []);

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="pt-32 pb-12 lg:pt-44 lg:pb-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
            About — who you’re hiring
          </Reveal>
          <Reveal as="h1" delay={80} className="font-display font-medium text-[clamp(2.5rem,6.5vw,5.75rem)] leading-[0.95] tracking-tighter2 max-w-4xl">
            One engineer. Fifteen years shipping. <em className="italic font-normal text-accent">Skin in the game.</em>
          </Reveal>
          <Reveal as="p" delay={160} className="mt-8 max-w-2xl text-lg text-ink-soft leading-relaxed">
            I built this practice because I got tired of watching projects fail for predictable
            reasons — junior engineers learning on the client’s dime, agencies optimizing for
            their own utilization, and "we’ll figure that out later" promises that always cost
            more than they would have up front.
          </Reveal>
        </div>
      </section>

      {/* ---------- bio ---------- */}
      <section className="py-20 lg:py-28 bg-paper-200/40 border-t border-ink-900/15">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-14 lg:space-y-20">
          {/* Centered quote */}
          <Reveal as="blockquote" className="text-center max-w-2xl mx-auto">
            <p className="font-display font-normal italic text-2xl lg:text-[2rem] leading-[1.2] tracking-tighter2 text-ink-900">
              &ldquo;Whatever is worth doing at all is worth doing well.&rdquo;
            </p>
            <footer className="mt-5 font-mono text-xs text-ink-quiet uppercase tracking-[0.2em]">
              — Philip Stanhope
            </footer>
          </Reveal>
          {/* h2 + body */}
          <div className="border-t border-ink-900/10 pt-14 lg:pt-20 grid lg:grid-cols-12 gap-10 lg:gap-16">
            <Reveal as="h2" className="lg:col-span-5 font-display font-medium text-3xl lg:text-5xl leading-[1.05] tracking-tighter2">
              I care about my clients, and I treat their products
              <em className="italic font-normal text-accent"> like they’re my own.</em>
            </Reveal>
            <Reveal as="div" delay={100} className="lg:col-span-7 space-y-5 text-ink-soft leading-relaxed text-lg">
              <p>
                I’m Mark — Lead Developer at Third &amp; Grove, where I’ve shipped production
                systems for national brands and led teams of up to seven engineers. On the side,
                I’ve co-founded three SaaS products (CropAide, MILES, ProjectAire), taking each
                from a blank schema to paying customers.
              </p>
              <p>
                Fifteen years of production work has given me a pretty clear sense of what
                matters and what’s just noise. The work I take on is the work I’d want done
                right if it were my own company — because in three cases, it actually is.
              </p>
              <p>
                AI tooling handles the boilerplate so my hours go to the architecture and logic
                that actually move the product forward. I bring the senior judgment; the
                automation handles the typing.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- credentials band ---------- */}
      <section className="bg-ink-900 text-paper-50 py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper-200/70 mb-8">
            Track record
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {CREDENTIALS.map((c, i) => (
              <Reveal as="div" delay={i * 60} key={c.label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-200/60 mb-2">{c.label}</div>
                <div className="font-display text-4xl lg:text-5xl font-medium leading-[1.05] tracking-tighter2">{c.value}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- how I work ---------- */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="mb-14 lg:mb-20 max-w-3xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">
              How I work
            </div>
            <h2 className="font-display font-medium text-4xl lg:text-6xl leading-[1.02] tracking-tighter2">
              Four steps. <em className="italic font-normal text-ink-soft">No theatre.</em>
            </h2>
          </Reveal>
          <div className="space-y-14 lg:space-y-20">
            {STEPS.map((s, i) => (
              <div key={s.n} className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                <Reveal as="div" className="lg:col-span-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">
                    Step {s.n}
                  </div>
                  <h3 className="font-display font-medium text-3xl lg:text-5xl leading-[1.02] tracking-tighter2">
                    {s.title}
                  </h3>
                </Reveal>
                <Reveal as="div" delay={80} className="lg:col-span-7 lg:col-start-6 space-y-4">
                  <p className="font-display text-2xl lg:text-3xl leading-[1.18] tracking-tighter2">
                    {s.pitch}
                  </p>
                  <p className="text-lg text-ink-soft leading-relaxed">{s.body}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- what I build ---------- */}
      <section className="bg-paper-200/40 py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal as="div" className="lg:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">
              What I build
            </div>
            <h2 className="font-display font-medium text-3xl lg:text-5xl leading-[1.02] tracking-tighter2">
              The technical surface area I work across.
            </h2>
          </Reveal>
          <Reveal as="ul" delay={100} className="lg:col-span-8 grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {WHAT_I_BUILD.map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink-soft leading-relaxed">
                <Check size={16} className="mt-1 text-accent flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- what I don't do ---------- */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal as="div" className="lg:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm mb-4">
              What I don’t do
            </div>
            <h2 className="font-display font-medium text-3xl lg:text-5xl leading-[1.02] tracking-tighter2">
              Honest about the fit.
            </h2>
            <p className="mt-5 text-ink-soft leading-relaxed max-w-md">
              I’d rather refer you to someone who fits than take a project that doesn’t. Saying
              this out loud saves both of us a discovery call.
            </p>
          </Reveal>
          <Reveal as="ul" delay={100} className="lg:col-span-8 space-y-5">
            {DONT.map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink-soft leading-relaxed text-lg">
                <X size={18} className="mt-1.5 text-warm flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- closing CTA (light, bridges into the global footer) ---------- */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-10 border-b border-ink-900/15">
            <div className="max-w-2xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">
                Now you know who
              </div>
              <h2 className="font-display font-medium text-3xl lg:text-5xl leading-[1.05] tracking-tighter2">
                Tell me what you’re building. <em className="italic font-normal text-ink-soft">I’ll be honest about the fit.</em>
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <PillButton variant="accent" onClick={() => navigate('/contact')}>
                Start a project <ArrowRight size={16} />
              </PillButton>
              <button
                onClick={() => navigate('/services')}
                className="group inline-flex items-center gap-2 text-sm font-medium text-ink-900 underline decoration-ink-300 decoration-1 underline-offset-[6px] hover:decoration-accent hover:text-accent transition-colors"
              >
                See the engagement paths
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
