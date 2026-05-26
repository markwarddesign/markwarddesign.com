import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Reveal } from '../App.jsx';
import { SITE_STUDIES } from '../data/caseStudies.js';
import Screenshot from '../components/Screenshot.jsx';

const SiteCard = ({ study, index, reverse }) => (
  <article className="border-t border-ink-900/15 py-14 lg:py-20 first:border-t-0">
    <div className={`grid lg:grid-cols-12 gap-10 lg:gap-12 items-start ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <Reveal as="div" className="lg:col-span-7">
        <Link to={`/websites/${study.slug}`} className="group block">
          <Screenshot src={`/screenshots/${study.slug}.jpg`} alt={`${study.title} — screenshot`} label={`${study.title} — screenshot`} tint={study.tint} />
        </Link>
      </Reveal>
      <div className="lg:col-span-5 space-y-5">
        <Reveal as="div" className="flex items-baseline justify-between gap-4">
          <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${study.accentClass}`}>
            Site — 0{index}
          </div>
          {study.status && (
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
              {study.status}
            </div>
          )}
        </Reveal>
        <Reveal as="h3" delay={60} className="font-display font-medium text-3xl lg:text-4xl leading-[1.05] tracking-tighter2">
          <Link to={`/websites/${study.slug}`} className="hover:text-accent transition-colors">
            {study.title}
          </Link>
        </Reveal>
        <Reveal as="p" delay={100} className="text-sm text-ink-quiet">{study.role} · {study.kicker}</Reveal>
        <Reveal as="p" delay={140} className="text-ink-soft leading-relaxed">{study.subtitle}</Reveal>
        <Reveal as="div" delay={200} className="flex flex-wrap items-center gap-5 pt-3">
          <Link
            to={`/websites/${study.slug}`}
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

export default function Websites() {
  return (
    <>
      <section className="relative pt-32 pb-12 lg:pt-44 lg:pb-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
            Websites — selected
          </Reveal>
          <Reveal as="h1" delay={80} className="font-display font-medium text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] tracking-tighter2 max-w-4xl">
            Marketing sites that get out of <em className="italic font-normal text-accent">the way of the work.</em>
          </Reveal>
          <Reveal as="p" delay={160} className="mt-8 max-w-2xl text-lg text-ink-soft leading-relaxed">
            A sampling of recent client websites — artists, studios, dealerships, trades, and B2B
            services. Each one built around the single, specific job their visitors are actually
            trying to do.
          </Reveal>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {SITE_STUDIES.map((study, i) => (
            <SiteCard key={study.slug} study={study} index={i + 1} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>
    </>
  );
}
