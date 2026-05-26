import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { Reveal, PillButton } from '../App.jsx';
import { getStudy, getNeighbors } from '../data/caseStudies.js';
import Screenshot from '../components/Screenshot.jsx';

/* ---------- the page ---------- */

export default function CaseStudy({ type }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const study = getStudy(type, slug);
  const { prev, next } = getNeighbors(type, slug);

  // Document title for in-browser tab + history; OG meta for crawlers
  // requires SSR/prerender at deploy time — flagged separately.
  useEffect(() => {
    if (!study) return;
    const prev = document.title;
    document.title = `${study.title} — Mark Ward`;
    const meta = document.querySelector('meta[name="description"]');
    const prevMeta = meta?.getAttribute('content');
    if (meta && study.metaDescription) meta.setAttribute('content', study.metaDescription);
    return () => {
      document.title = prev;
      if (meta && prevMeta != null) meta.setAttribute('content', prevMeta);
    };
  }, [study]);

  if (!study) {
    return (
      <section className="pt-32 pb-24 lg:pt-44">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">Not found</div>
          <h1 className="font-display font-medium text-4xl lg:text-6xl leading-[1.02] tracking-tighter2">
            That case study doesn't exist.
          </h1>
          <div className="mt-8">
            <Link to={`/${type}`} className="inline-flex items-center gap-2 text-accent underline decoration-current/30 underline-offset-[6px] hover:decoration-current">
              <ArrowLeft size={16} /> Back to {type === 'apps' ? 'apps' : 'websites'}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const indexHref = `/${type}`;
  const indexLabel = type === 'apps' ? 'Apps' : 'Websites';

  return (
    <>
      {/* ---------- breadcrumb ---------- */}
      <div className="pt-28 lg:pt-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="nav" className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet flex items-center gap-2">
            <Link to="/" className="hover:text-ink-900 transition-colors">Home</Link>
            <span>/</span>
            <Link to={indexHref} className="hover:text-ink-900 transition-colors">{indexLabel}</Link>
            <span>/</span>
            <span className={study.accentClass}>{study.title}</span>
          </Reveal>
        </div>
      </div>

      {/* ---------- hero ---------- */}
      <section className="pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7 space-y-8">
              <Reveal as="div" className={`font-mono text-[10px] uppercase tracking-[0.22em] ${study.accentClass}`}>
                {study.kicker}
              </Reveal>
              <Reveal as="h1" delay={60} className="font-display font-medium text-[clamp(2.5rem,6.5vw,5.75rem)] leading-[0.95] tracking-tighter2">
                {study.title}
              </Reveal>
              <Reveal as="p" delay={120} className="font-display text-2xl lg:text-3xl leading-[1.18] text-ink-soft max-w-2xl">
                {study.subtitle}
              </Reveal>
            </div>
            <Reveal as="aside" delay={180} className="lg:col-span-5 lg:pb-3">
              <div className="border-t border-ink-900/15 pt-6 grid grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-1">Role</div>
                  <div className="text-sm font-medium text-ink-900">{study.role}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-1">Client</div>
                  <div className="text-sm font-medium text-ink-900">{study.client}</div>
                </div>
                {study.status && (
                  <div className="col-span-2">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-1">Status</div>
                    <div className="text-sm font-medium text-ink-900">{study.status}</div>
                  </div>
                )}
                <div className="col-span-2 pt-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-1">Hire me for</div>
                  <div className="text-sm font-medium text-ink-900">{study.hireFor}</div>
                </div>
              </div>
              {study.href && (
                <a
                  href={study.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-8 group inline-flex items-center gap-2 font-medium ${study.accentClass} underline decoration-current/30 decoration-1 underline-offset-[6px] hover:decoration-current transition-colors`}
                >
                  Visit live
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- the pitch line + hero screenshot ---------- */}
      <section className="pb-16 lg:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-12">
          <Reveal as="p" className="font-display text-2xl lg:text-4xl leading-[1.15] tracking-tighter2 max-w-4xl">
            {study.pitch}
          </Reveal>
          <Reveal as="div" delay={120}>
            <Screenshot src={`/screenshots/${study.slug}.jpg`} alt={`${study.title} — hero`} label={`${study.title} — hero`} tint={study.tint} aspect="aspect-[16/9]" size="large" />
          </Reveal>
        </div>
      </section>

      {/* ---------- result band ---------- */}
      <section className="bg-ink-900 text-paper-50 py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper-200/70 mb-8">
            By the numbers
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {study.stats.map((s, i) => (
              <Reveal as="div" delay={i * 60} key={s.label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-200/60 mb-2">{s.label}</div>
                <div className="font-display text-3xl lg:text-4xl font-medium leading-[1.05] tracking-tighter2">{s.value}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- the story ---------- */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-20 lg:space-y-28">
          {[study.situation, study.approach, study.outcomes].map((block, i) => (
            <div key={block.heading} className="grid lg:grid-cols-12 gap-10 lg:gap-16">
              <Reveal as="div" className="lg:col-span-4">
                <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${study.accentClass} mb-4`}>
                  0{i + 1}
                </div>
                <h2 className="font-display font-medium text-3xl lg:text-5xl leading-[1.02] tracking-tighter2">
                  {block.heading}
                </h2>
              </Reveal>
              <Reveal as="div" delay={100} className="lg:col-span-7 lg:col-start-6 space-y-5">
                {block.body.map((p, pi) => (
                  <p key={pi} className="text-lg text-ink-soft leading-relaxed">{p}</p>
                ))}
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- site tour ---------- */}
      <section className="bg-paper-200/40 py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="mb-12 lg:mb-16 max-w-3xl">
            <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${study.accentClass} mb-4`}>
              Tour
            </div>
            <h2 className="font-display font-medium text-3xl lg:text-5xl leading-[1.02] tracking-tighter2">
              {type === 'apps' ? 'Tour the product.' : 'Tour the site.'}
            </h2>
            {type === 'apps' && (
              <p className="mt-4 text-sm text-ink-quiet">
                Marketing site shown. Interior product screenshots forthcoming once access is provisioned.
              </p>
            )}
          </Reveal>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <Reveal as="div" className="lg:col-span-8">
              {/* Browser-frame around the full-page screenshot */}
              <div className="rounded-md overflow-hidden border border-ink-900/15 bg-paper shadow-[0_1px_0_rgba(0,0,0,0.04),0_20px_50px_-20px_rgba(0,0,0,0.12)]">
                {/* Faux address bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-900/10 bg-paper-100">
                  <span className="h-2.5 w-2.5 rounded-full bg-ink-300/60" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-ink-300/60" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-ink-300/60" aria-hidden="true" />
                  <div className="ml-3 flex-1 truncate font-mono text-[11px] text-ink-quiet">
                    {study.href ? study.href.replace(/^https?:\/\//, '') : study.title}
                  </div>
                </div>
                {/* Scrollable preview — data-lenis-prevent keeps Lenis from hijacking wheel events inside */}
                <div data-lenis-prevent className="h-[520px] lg:h-[640px] overflow-y-auto bg-paper">
                  <img
                    src={`/screenshots/${study.slug}-full.jpg`}
                    alt={`${study.title} — full-page tour`}
                    loading="lazy"
                    decoding="async"
                    className="block w-full"
                  />
                </div>
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
                Scroll within the frame to tour the {type === 'apps' ? 'site' : 'page'}
              </div>
            </Reveal>

            <div className="lg:col-span-4 space-y-6 lg:pt-2">
              <Reveal as="div" className={`font-mono text-[10px] uppercase tracking-[0.22em] ${study.accentClass}`}>
                What you’ll spot
              </Reveal>
              <ul className="space-y-5">
                {study.pages.map((page, i) => (
                  <Reveal as="li" delay={i * 60} key={page.name} className="space-y-1.5 pb-5 border-b border-ink-900/10 last:border-b-0">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
                      P—0{i + 1} · {page.name}
                    </div>
                    <p className="text-ink-soft leading-relaxed text-sm">{page.copy}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- stack ---------- */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal as="div" className="grid lg:grid-cols-12 gap-10 items-baseline">
            <div className="lg:col-span-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
              Built with
            </div>
            <div className="lg:col-span-9 flex flex-wrap gap-2">
              {study.stack.map((s) => (
                <span key={s} className="text-[11px] font-mono uppercase tracking-[0.15em] text-ink-quiet border border-ink-900/15 rounded-full px-3 py-1.5">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- closing CTA ---------- */}
      <section className="py-24 lg:py-32 border-t border-ink-900/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <Reveal as="div" className={`font-mono text-[10px] uppercase tracking-[0.22em] ${study.accentClass} mb-6`}>
                If this is your kind of project
              </Reveal>
              <Reveal as="h2" delay={80} className="font-display font-medium text-4xl lg:text-6xl leading-[1] tracking-tighter2 max-w-3xl">
                {study.cta.heading}
              </Reveal>
              <Reveal as="p" delay={160} className="mt-6 text-lg text-ink-soft leading-relaxed max-w-2xl">
                {study.cta.body}
              </Reveal>
              <Reveal as="div" delay={220} className="mt-10 flex flex-wrap items-center gap-4">
                <PillButton variant="accent" onClick={() => navigate('/#contact')}>
                  Start a project <ArrowRight size={16} />
                </PillButton>
                <Link
                  to={indexHref}
                  className="group inline-flex items-center gap-2 font-medium text-ink-900 underline decoration-ink-300 decoration-1 underline-offset-[6px] hover:decoration-accent hover:text-accent transition-colors"
                >
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                  Back to {indexLabel.toLowerCase()}
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- prev / next ---------- */}
      {(prev || next) && (
        <section className="bg-ink-900 text-paper-50 py-16 lg:py-20 border-t border-paper-50/10">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-8">
            {prev && (
              <Link to={`/${type}/${prev.slug}`} className="group block">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper-200/60 mb-3 flex items-center gap-2">
                  <ArrowLeft size={12} /> Previous
                </div>
                <div className="font-display text-2xl lg:text-3xl font-medium leading-[1.1] tracking-tighter2 group-hover:text-warm transition-colors">
                  {prev.title}
                </div>
                <div className="mt-2 text-sm text-paper-200/70">{prev.kicker}</div>
              </Link>
            )}
            {next && (
              <Link to={`/${type}/${next.slug}`} className="group block md:text-right">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper-200/60 mb-3 flex items-center gap-2 md:justify-end">
                  Next <ArrowRight size={12} />
                </div>
                <div className="font-display text-2xl lg:text-3xl font-medium leading-[1.1] tracking-tighter2 group-hover:text-accent transition-colors">
                  {next.title}
                </div>
                <div className="mt-2 text-sm text-paper-200/70">{next.kicker}</div>
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}
