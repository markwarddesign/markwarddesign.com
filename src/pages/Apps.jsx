import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Reveal } from '../App.jsx';
import { APP_STUDIES } from '../data/caseStudies.js';
import Screenshot from '../components/Screenshot.jsx';

const AppCard = ({ study, index, reverse }) => (
  <article className="border-t border-ink-900/15 py-14 lg:py-20 first:border-t-0">
    <div className={`grid lg:grid-cols-12 gap-10 lg:gap-12 items-start ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <Reveal as="div" className="lg:col-span-7">
        <Link to={`/apps/${study.slug}`} className="group block">
          <Screenshot src={`/screenshots/${study.slug}.jpg`} alt={`${study.title} — overview`} label={`${study.title} — overview`} tint={study.tint} />
        </Link>
      </Reveal>
      <div className="lg:col-span-5 space-y-5">
        <Reveal as="div" className="flex items-baseline justify-between gap-4">
          <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${study.accentClass}`}>
            App — 0{index}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
            {study.role}
          </div>
        </Reveal>
        <Reveal as="h3" delay={60} className="font-display font-medium text-3xl lg:text-5xl leading-[1.02] tracking-tighter2">
          <Link to={`/apps/${study.slug}`} className="hover:text-accent transition-colors">
            {study.title}
          </Link>
        </Reveal>
        <Reveal as="p" delay={120} className="font-display text-xl lg:text-2xl leading-[1.18] text-ink-soft">
          {study.subtitle}
        </Reveal>
        <Reveal as="div" delay={180} className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-ink-900/15">
          {study.stats.slice(0, 4).map((s) => (
            <div key={s.label}>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-1">{s.label}</div>
              <div className="text-sm font-medium text-ink-900">{s.value}</div>
            </div>
          ))}
        </Reveal>
        <Reveal as="div" delay={240} className="flex flex-wrap items-center gap-5 pt-3">
          <Link
            to={`/apps/${study.slug}`}
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

export default function Apps() {
  return (
    <>
      <section className="relative pt-32 pb-12 lg:pt-44 lg:pb-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
            Apps — co-founded & shipped
          </Reveal>
          <Reveal as="h1" delay={80} className="font-display font-medium text-[clamp(2.5rem,6.5vw,5.75rem)] leading-[0.95] tracking-tighter2 max-w-4xl">
            Three SaaS products, taken from <em className="italic font-normal text-accent">zero to production.</em>
          </Reveal>
          <Reveal as="p" delay={160} className="mt-8 max-w-2xl text-lg text-ink-soft leading-relaxed">
            If you’re building a category-defining SaaS — multi-tenant, real-time, or data-correctness
            critical — these are the projects to look at. Each one started as a blank schema; each one
            ships to paying customers today.
          </Reveal>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {APP_STUDIES.map((study, i) => (
            <AppCard key={study.slug} study={study} index={i + 1} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>
    </>
  );
}
