import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal } from '../App.jsx';
import { APP_STUDIES, SITE_STUDIES } from '../data/caseStudies.js';
import Screenshot from '../components/Screenshot.jsx';

const WorkCard = ({ study, index, indexPrefix, reverse, variant }) => (
  <article className="border-t border-ink-900/15 py-14 lg:py-20 first:border-t-0">
    <div className={`grid lg:grid-cols-12 gap-10 lg:gap-12 items-start ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <Reveal as="div" className="lg:col-span-7">
        <Link to={`/${study.type}/${study.slug}`} className="group block">
          <Screenshot src={`/screenshots/${study.slug}.jpg`} alt={`${study.title} — overview`} label={`${study.title} — overview`} tint={study.tint} />
        </Link>
      </Reveal>
      <div className="lg:col-span-5 space-y-5">
        <Reveal as="div" className="flex items-baseline justify-between gap-4">
          <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${study.accentClass}`}>
            {indexPrefix} — 0{index}
          </div>
          {study.status && (
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
              {study.status}
            </div>
          )}
        </Reveal>
        <Reveal as="h3" delay={60} className={`font-display font-medium ${variant === 'app' ? 'text-3xl lg:text-5xl' : 'text-3xl lg:text-4xl'} leading-[1.02] tracking-tighter2`}>
          <Link to={`/${study.type}/${study.slug}`} className="hover:text-accent transition-colors">
            {study.title}
          </Link>
        </Reveal>
        <Reveal as="div" delay={100} className="text-sm text-ink-quiet">
          {study.role} · {study.kicker}
        </Reveal>
        <Reveal as="p" delay={140} className={`text-ink-soft leading-relaxed ${variant === 'app' ? 'font-display text-xl lg:text-2xl leading-[1.18]' : ''}`}>
          {study.subtitle}
        </Reveal>
        {variant === 'app' && (
          <Reveal as="div" delay={180} className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-ink-900/15">
            {study.stats.slice(0, 4).map((s) => (
              <div key={s.label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-1">{s.label}</div>
                <div className="text-sm font-medium text-ink-900">{s.value}</div>
              </div>
            ))}
          </Reveal>
        )}
        <Reveal as="div" delay={220} className="flex flex-wrap items-center gap-5 pt-3">
          <Link
            to={`/${study.type}/${study.slug}`}
            className={`group inline-flex items-center gap-2 font-medium ${study.accentClass} underline decoration-current/30 decoration-1 underline-offset-[6px] hover:decoration-current transition-colors`}
          >
            Read the case study
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          {study.href && (
            <a
              href={study.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-ink-quiet hover:text-ink-900 transition-colors"
            >
              Visit live <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </Reveal>
      </div>
    </div>
  </article>
);

export default function Work() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Work — Mark Ward';
    const meta = document.querySelector('meta[name="description"]');
    const prevMeta = meta?.getAttribute('content');
    if (meta) meta.setAttribute('content', 'Selected work by Mark Ward — three co-founded SaaS products and a curated set of client websites. Each one shipped to paying customers.');
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
            Work — selected
          </Reveal>
          <Reveal as="h1" delay={80} className="font-display font-medium text-[clamp(2.5rem,6.5vw,5.75rem)] leading-[0.95] tracking-tighter2 max-w-4xl">
            A selected slice of <em className="italic font-normal text-accent">fifteen years shipping.</em>
          </Reveal>
          <Reveal as="p" delay={160} className="mt-8 max-w-2xl text-lg text-ink-soft leading-relaxed">
            A curated cross-section, not the full archive. The apps were co-founded and built
            from a blank schema. The websites were custom-coded for clients across art, trades,
            B2B, and automotive. Pick a story.
          </Reveal>
        </div>
      </section>

      {/* ---------- apps ---------- */}
      <section className="pb-12 lg:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="mb-10 lg:mb-14 flex items-baseline justify-between gap-6 border-b border-ink-900/15 pb-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">
                Apps — co-founded & shipped
              </div>
              <h2 className="font-display font-medium text-3xl lg:text-5xl leading-[1.02] tracking-tighter2">
                SaaS, shipped to real customers.
              </h2>
            </div>
            <Link
              to="/apps"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-accent underline decoration-accent/30 underline-offset-[6px] hover:decoration-accent transition-colors group"
            >
              See only apps
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
          <div>
            {APP_STUDIES.map((study, i) => (
              <WorkCard
                key={study.slug}
                study={study}
                index={i + 1}
                indexPrefix="App"
                reverse={i % 2 === 1}
                variant="app"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- websites ---------- */}
      <section className="bg-paper-200/40 py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="mb-10 lg:mb-14 flex items-baseline justify-between gap-6 border-b border-ink-900/15 pb-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm mb-3">
                Websites — selected
              </div>
              <h2 className="font-display font-medium text-3xl lg:text-5xl leading-[1.02] tracking-tighter2">
                Sites for working businesses.
              </h2>
            </div>
            <Link
              to="/websites"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-warm underline decoration-warm/30 underline-offset-[6px] hover:decoration-warm transition-colors group"
            >
              See only websites
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
          <div>
            {SITE_STUDIES.map((study, i) => (
              <WorkCard
                key={study.slug}
                study={study}
                index={i + 1}
                indexPrefix="Site"
                reverse={i % 2 === 1}
                variant="site"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
