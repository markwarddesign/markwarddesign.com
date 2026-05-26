import React, { useState, useEffect, useRef, useLayoutEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import AppsPage from './pages/Apps.jsx';
import WebsitesPage from './pages/Websites.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import ServicesPage from './pages/Services.jsx';
import ContactPage from './pages/Contact.jsx';
import WorkPage from './pages/Work.jsx';
import AboutPage from './pages/About.jsx';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Loader,
  Layout,
  Server,
  Database,
  Layers,
  Clock,
  FileText,
  ShieldAlert,
  Github,
  Linkedin,
  Mail,
  Sun,
  Moon,
} from 'lucide-react';

/* ---------- theme (light / dark) ---------- */

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Briefly suppress transitions so toggling doesn't animate every element.
    root.classList.add('theme-transitioning');
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem('theme', theme); } catch (e) {}
    const t = setTimeout(() => root.classList.remove('theme-transitioning'), 30);
    return () => clearTimeout(t);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return { theme, toggle };
};

const ThemeToggle = ({ theme, onToggle, className = '' }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    className={`relative z-10 inline-flex items-center justify-center h-9 w-9 rounded-full border border-ink-900/15 text-ink-700 hover:text-ink-900 hover:border-ink-900/30 transition-colors ${className}`}
  >
    {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
  </button>
);

/* ---------- smooth scroll (Lenis) ---------- */

export const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

const useLenisInit = () => {
  const [lenis, setLenis] = useState(null);
  useEffect(() => {
    const l = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    let raf;
    const tick = (time) => {
      l.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    setLenis(l);
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
    };
  }, []);
  return lenis;
};

const scrollToId = (lenis, id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.1 });
  else el.scrollIntoView({ behavior: 'smooth' });
};

/* ---------- active section tracking ---------- */

// Active section = the last section whose top has crossed a threshold from the viewport top.
// Returns null when no section qualifies (e.g., at the top of the page) so the indicator
// can hide rather than flash to the first nav item.
const useActiveSection = (ids) => {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const elements = ids
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((x) => x.el);
    if (!elements.length) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      const threshold = 140; // px below the nav
      let current = null;
      for (const { id, el } of elements) {
        const top = el.getBoundingClientRect().top;
        if (top - threshold <= 0) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids.join('|')]);
  return active;
};

/* ---------- primitives ---------- */

const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

export const Reveal = ({ children, as: Tag = 'div', className = '', delay = 0 }) => {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
};

export const PrimaryLink = ({ href, onClick, children }) => (
  <a
    href={href}
    onClick={onClick}
    className="group inline-flex items-center gap-2 font-medium text-ink-900 underline decoration-ink-300 decoration-1 underline-offset-[6px] hover:decoration-accent hover:text-accent transition-colors"
  >
    {children}
    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </a>
);

export const PillButton = ({ children, variant = 'solid', onClick, type = 'button', className = '' }) => {
  const base = 'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium tracking-tightish transition-all duration-200 active:scale-[0.98]';
  const styles =
    variant === 'solid'
      ? 'bg-ink-900 text-paper hover:bg-accent text-paper-50'
      : variant === 'accent'
      ? 'bg-accent text-paper hover:bg-accent-700'
      : 'border border-ink-900/15 text-ink-900 hover:border-ink-900/40 hover:bg-paper-200/60';
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
};

/* ---------- nav ---------- */

// In page-scroll order — this is what the eye reads top-to-bottom, so the nav
// should read left-to-right in the same order to avoid backward indicator slides.
const NAV_ITEMS = [
  { id: 'services', label: 'Services', type: 'route', path: '/services' },
  { id: 'work', label: 'Work', type: 'route', path: '/work' },
  { id: 'about', label: 'About', type: 'route', path: '/about' },
  { id: 'contact', label: 'Contact', type: 'route', path: '/contact' },
];

const Nav = ({ onCta, theme, onToggleTheme }) => {
  const lenis = useLenis();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const anchorIds = NAV_ITEMS.filter((i) => i.type === 'anchor').map((i) => i.id);
  const activeAnchor = useActiveSection(isHome ? anchorIds : []);
  const routeMatch = NAV_ITEMS.find((i) => i.type === 'route' && i.path === location.pathname);
  const active = !isHome && routeMatch ? routeMatch.id : activeAnchor;
  const wrapRef = useRef(null);
  const itemRefs = useRef({});
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Position the sliding pill behind the active nav item
  useLayoutEffect(() => {
    const el = itemRefs.current[active];
    const wrap = wrapRef.current;
    if (!el || !wrap) {
      setPill((p) => ({ ...p, opacity: 0 }));
      return;
    }
    const w = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPill({ left: r.left - w.left, width: r.width, opacity: 1 });
  }, [active]);

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    if (isHome) {
      scrollToId(lenis, id);
      history.replaceState(null, '', `#${id}`);
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleLogoClick = (e) => {
    if (isHome) {
      e.preventDefault();
      scrollToId(lenis, 'top');
      history.replaceState(null, '', '#top');
    }
    // else: let <Link> navigate home
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-paper/85 backdrop-blur-md border-b border-ink-900/5' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="group inline-flex items-center"
          aria-label="WARD — home"
        >
          <span
            aria-hidden="true"
            className="block h-7 w-[100px] bg-ink-900 group-hover:bg-accent-700 transition-colors duration-200"
            style={{
              WebkitMaskImage: 'url(/logo.png)',
              maskImage: 'url(/logo.png)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'left center',
              maskPosition: 'left center',
            }}
          />
        </Link>

        <div ref={wrapRef} className="relative hidden sm:flex items-center">
          {/* Sliding active pill */}
          <span
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 h-8 rounded-full bg-accent-50 transition-all duration-[400ms]"
            style={{
              left: pill.left,
              width: pill.width,
              opacity: pill.opacity,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            const className = `relative z-10 text-sm px-3 py-1.5 transition-colors duration-200 ${
              isActive ? 'text-accent-700 dark:text-paper-50' : 'text-ink-700 hover:text-ink-900'
            }`;
            if (item.type === 'route') {
              return (
                <Link
                  key={item.id}
                  ref={(el) => (itemRefs.current[item.id] = el)}
                  to={item.path}
                  onClick={() => {
                    // Same-route click should still return to top.
                    if (location.pathname === item.path) {
                      if (lenis) lenis.scrollTo(0);
                      else window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={className}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <a
                key={item.id}
                ref={(el) => (itemRefs.current[item.id] = el)}
                href={`#${item.id}`}
                onClick={(e) => handleAnchorClick(e, item.id)}
                className={className}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-3">
          {onToggleTheme && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}
          <PillButton variant="solid" onClick={onCta} className="!py-2 !px-4 !text-sm">
            Start a project
          </PillButton>
        </div>
      </div>
    </header>
  );
};

/* ---------- hero ---------- */

const Hero = ({ onCta, onWorkCta }) => (
  <section id="top" className="relative pt-32 pb-24 lg:pt-44 lg:pb-32">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
      <div className="grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-9">
          <Reveal as="div" className="inline-flex items-center gap-2 mb-8 text-xs font-mono uppercase tracking-[0.18em] text-ink-quiet">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Available · Q3 booking
          </Reveal>
          <h1 className="font-display font-medium text-[clamp(2.75rem,7vw,6.25rem)] leading-[0.95] tracking-tighter2 text-ink-900">
            {[
              ['I', 'build', 'things'],
              ['that', 'last', '—', '*and', '*lead'],
              ['*teams', 'that', 'do', 'too.'],
            ].flatMap((line, li, lines) => {
              const prevCount = lines.slice(0, li).reduce((n, l) => n + l.length, 0);
              return [
                <span key={`line-${li}`} className="block overflow-hidden pb-[0.05em]">
                  {line.map((word, wi) => {
                    const italic = word.startsWith('*');
                    const text = italic ? word.slice(1) : word;
                    const delay = (prevCount + wi) * 60 + 120;
                    return (
                      <span
                        key={wi}
                        className="word-rise"
                        style={{ animationDelay: `${delay}ms` }}
                      >
                        {italic ? <em className="italic font-normal text-accent">{text}</em> : text}
                        {wi < line.length - 1 ? ' ' : ''}
                      </span>
                    );
                  })}
                </span>,
              ];
            })}
          </h1>
          <Reveal as="p" delay={120} className="mt-10 max-w-xl text-lg leading-relaxed text-ink-soft">
            I'm Mark Ward — Lead Developer at Third &amp; Grove and co-founder of three SaaS
            products (CropAide, MILES, ProjectAire). Fifteen-plus years of production work
            has given me a pretty clear sense of what matters and what's just noise.
          </Reveal>
          <Reveal as="div" delay={200} className="mt-10 flex flex-wrap items-center gap-4">
            <PillButton variant="accent" onClick={onCta}>
              Start a project <ArrowRight size={16} />
            </PillButton>
            <PrimaryLink href="#work" onClick={(e) => { e.preventDefault(); onWorkCta(); }}>
              See recent work
            </PrimaryLink>
          </Reveal>
        </div>
        <Reveal as="aside" delay={280} className="lg:col-span-3 lg:pb-3">
          <div className="border-t border-ink-900/15 pt-5 space-y-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-1">Shipping since</div>
              <div className="text-ink-900 font-medium">15+ years · 100% remote</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-1">Co-founded</div>
              <div className="text-ink-900 font-medium">3 SaaS products</div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ---------- triptych: three offer paths ---------- */

const PathPanel = ({ kicker, title, who, body, timeline, starting, tags, ctaLabel, onCta, slots, dark, tint, accentClass = 'text-accent', serviceId }) => {
  const bg = dark
    ? 'bg-ink-900 text-paper-50'
    : tint === 'warm'
    ? 'bg-warm-50 text-ink-900'
    : tint === 'sage'
    ? 'bg-sage-50 text-ink-900'
    : 'bg-paper-200/60 text-ink-900';
  return (
  <article className={`group relative px-6 lg:px-10 py-12 lg:py-16 flex flex-col h-full ${bg}`}>
    <div className={`flex items-center justify-between mb-10 text-[10px] font-mono uppercase tracking-[0.2em] ${dark ? 'text-paper-200/70' : 'text-ink-quiet'}`}>
      <span className={dark ? '' : accentClass}>{kicker}</span>
      {slots != null && (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${dark ? 'bg-paper-50/10 text-paper-50' : 'bg-warm/10 text-warm'}`}>
          <span className="h-1 w-1 rounded-full bg-current" />
          {slots} slots open
        </span>
      )}
    </div>

    <h3 className={`font-display font-medium text-4xl lg:text-5xl leading-[1] tracking-tighter2 mb-4 ${dark ? 'text-paper-50' : 'text-ink-900'}`}>
      {serviceId ? (
        <Link to={`/services#${serviceId}`} className={`transition-colors hover:${accentClass}`}>
          {title}
        </Link>
      ) : title}
    </h3>
    <p className={`text-sm mb-6 ${dark ? 'text-paper-200/70' : 'text-ink-quiet'}`}>For {who}</p>
    <p className={`leading-relaxed mb-10 ${dark ? 'text-paper-200/90' : 'text-ink-soft'}`}>{body}</p>

    <div className={`grid grid-cols-2 gap-x-6 gap-y-4 pt-6 mb-10 border-t ${dark ? 'border-paper-50/15' : 'border-ink-900/15'}`}>
      <div>
        <div className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-1 ${dark ? 'text-paper-200/60' : 'text-ink-quiet'}`}>Timeline</div>
        <div className="font-medium">{timeline}</div>
      </div>
      <div>
        <div className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-1 ${dark ? 'text-paper-200/60' : 'text-ink-quiet'}`}>Starting</div>
        <div className="font-medium">{starting}</div>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-10">
      {tags.map((t) => (
        <span
          key={t}
          className={`text-[11px] font-mono px-2 py-1 rounded ${dark ? 'border border-paper-50/20 text-paper-200/80' : 'border border-ink-900/15 text-ink-quiet'}`}
        >
          {t}
        </span>
      ))}
    </div>

    <button
      onClick={onCta}
      className={`mt-auto inline-flex items-center justify-between gap-2 text-sm font-medium pt-5 border-t ${
        dark
          ? 'border-paper-50/15 text-paper-50 hover:text-white'
          : `border-ink-900/15 text-ink-900 hover:${accentClass.replace('text-', 'text-')}`
      } group/cta transition-colors`}
    >
      {ctaLabel}
      <ArrowUpRight size={18} className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
    </button>
  </article>
  );
};

const Triptych = ({ onSelect }) => (
  <section id="engage" className="relative">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-24 lg:pt-32 pb-10">
      <Reveal as="div" className="max-w-3xl">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-4">Five ways to work together</div>
        <h2 className="font-display font-medium text-4xl lg:text-6xl leading-[1.02] tracking-tighter2">
          Pick the one that fits<br />
          <em className="italic font-normal text-ink-soft">where you actually are.</em>
        </h2>
        <div className="mt-6">
          <Link
            to="/services"
            className="group inline-flex items-center gap-2 text-sm font-medium text-accent underline decoration-accent/30 decoration-1 underline-offset-[6px] hover:decoration-accent transition-colors"
          >
            See the full breakdown
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
    </div>

    <Reveal>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-3 border-y border-ink-900/15">
          <div className="border-r-0 lg:border-r border-ink-900/15">
            <PathPanel
              serviceId="website"
              tint="warm"
              accentClass="text-warm"
              kicker="01 · Fixed slot"
              title="Website"
              who="founders, brands, creatives"
              body="A design-forward marketing site in about two weeks. No page builders, no bloated themes — custom code built to convert. Need it client-editable? I specialize in Gutenberg WordPress builds that are actually easy to update."
              timeline="~2 weeks"
              starting="From $4k"
              tags={['Next.js', 'WordPress', 'Gutenberg', 'Tailwind']}
              ctaLabel="Claim a slot"
              slots={3}
              onCta={() => onSelect('Website Build', '<$5k')}
            />
          </div>
          <div className="border-r-0 lg:border-r border-ink-900/15 border-t lg:border-t-0">
            <PathPanel
              serviceId="mvp"
              tint="sage"
              accentClass="text-sage"
              kicker="02 · Fixed scope"
              title="MVP"
              who="pre-seed founders & first-time builders"
              body="Turn a validated idea into a shippable product in six to eight weeks. Fixed scope, fixed price, fixed timeline. Everything you need to demo, raise, or launch — nothing you don't."
              timeline="6–8 weeks"
              starting="From $10k"
              tags={['Next.js', 'Laravel', 'Stripe', 'Demo-ready']}
              ctaLabel="Start an MVP"
              onCta={() => onSelect('MVP to Life', '$5k - $15k')}
            />
          </div>
          <div className="border-t lg:border-t-0">
            <PathPanel
              serviceId="application"
              dark
              kicker="03 · Partnership"
              title="Application"
              who="funded startups & scaling operators"
              body="Complex platforms, SaaS products, and data-intensive apps built right the first time. Senior-led from architecture through deployment — no handoffs, no surprises. When scope demands it, I bring on trusted collaborators I've worked with for years."
              timeline="3–6+ months"
              starting="By proposal"
              tags={['Laravel', 'React', 'System design', 'Reverb']}
              ctaLabel="Apply for a project"
              onCta={() => onSelect('Full Application', '$15k - $50k')}
            />
          </div>
        </div>
      </div>
    </Reveal>

    <EngagementStrip onSelect={onSelect} />
  </section>
);

/* ---------- ongoing engagement strip ---------- */

const OngoingCard = ({ kicker, title, who, body, format, starting, tags, ctaLabel, onCta }) => (
  <article className="group flex flex-col h-full p-8 lg:p-10">
    <div className="flex items-center justify-between mb-6 text-[10px] font-mono uppercase tracking-[0.2em] text-ink-quiet">
      <span className="text-accent">{kicker}</span>
      <span>Ongoing</span>
    </div>
    <h3 className="font-display font-medium text-3xl lg:text-4xl leading-[1] tracking-tighter2 mb-3 text-ink-900">
      {title}
    </h3>
    <p className="text-sm text-ink-quiet mb-5">For {who}</p>
    <p className="text-ink-soft leading-relaxed mb-8">{body}</p>

    <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-5 mb-6 border-t border-ink-900/15">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1 text-ink-quiet">Format</div>
        <div className="font-medium text-sm">{format}</div>
      </div>
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1 text-ink-quiet">Starting</div>
        <div className="font-medium text-sm">{starting}</div>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-8">
      {tags.map((t) => (
        <span key={t} className="text-[11px] font-mono px-2 py-1 rounded border border-ink-900/15 text-ink-quiet">
          {t}
        </span>
      ))}
    </div>

    <button
      onClick={onCta}
      className="mt-auto inline-flex items-center justify-between gap-2 text-sm font-medium pt-5 border-t border-ink-900/15 text-ink-900 hover:text-accent group/cta transition-colors"
    >
      {ctaLabel}
      <ArrowUpRight size={18} className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
    </button>
  </article>
);

const EngagementStrip = ({ onSelect }) => (
  <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 lg:pt-20 pb-24 lg:pb-32">
    <Reveal as="div" className="flex items-baseline gap-6 mb-10">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet whitespace-nowrap">
        Or — ongoing
      </span>
      <span className="h-px flex-1 bg-ink-900/15" />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet whitespace-nowrap">
        04 · 05
      </span>
    </Reveal>

    <Reveal>
      <div className="grid lg:grid-cols-2 border border-ink-900/15 bg-paper">
        <div className="border-b lg:border-b-0 lg:border-r border-ink-900/15">
          <OngoingCard
            kicker="04 · Advisory"
            title="Advisory"
            who="CTOs, founders, teams needing a second opinion"
            body="Architecture reviews, technical due diligence, and second-opinion calls. Bring me in when you're stuck on a hard decision or want a senior set of eyes before you commit. No long engagement required."
            format="Hourly or sprint"
            starting="From $2k / review"
            tags={['Architecture', 'Due diligence', 'Code review']}
            ctaLabel="Book a session"
            onCta={() => onSelect('Advisory', '<$5k')}
          />
        </div>
        <div>
          <OngoingCard
            kicker="05 · Retainer"
            title="Retainer"
            who="funded teams who want me in their corner"
            body="Reserved hours each month, async Slack access, code reviews, roadmap input, and occasional implementation. The right fit when you don't need a full project but want senior engineering on tap."
            format="Monthly · 3-mo min."
            starting="By engagement"
            tags={['Reserved hours', 'Async access', 'Roadmap']}
            ctaLabel="Start a retainer"
            onCta={() => onSelect('Retainer', '$5k - $15k')}
          />
        </div>
      </div>
    </Reveal>
  </div>
);

/* ---------- selected work ---------- */

const WorkRow = ({ index, title, role, description, stats, stack, href, accentClass = 'text-accent' }) => (
  <Reveal as="article" className="grid lg:grid-cols-12 gap-8 lg:gap-12 py-12 lg:py-16 border-t border-ink-900/15 first:border-t-0">
    <div className="lg:col-span-2">
      <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${accentClass}`}>{index}</div>
    </div>
    <div className="lg:col-span-6">
      <h3 className="font-display font-medium text-3xl lg:text-5xl tracking-tighter2 leading-[1] mb-3">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="group inline-flex items-baseline gap-3 hover:text-accent transition-colors">
            {title}
            <ArrowUpRight size={22} className="text-ink-quiet group-hover:text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        ) : title}
      </h3>
      <div className="text-sm font-mono uppercase tracking-[0.18em] text-accent mb-6">{role}</div>
      <p className="text-ink-soft leading-relaxed text-lg max-w-xl">{description}</p>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {stack.map((t) => (
          <span key={t} className="text-[11px] font-mono px-2 py-1 rounded border border-ink-900/15 text-ink-quiet">{t}</span>
        ))}
      </div>
    </div>
    <div className="lg:col-span-4">
      <dl className="space-y-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-baseline justify-between gap-4 border-b border-ink-900/10 pb-3">
            <dt className="text-sm text-ink-quiet">{s.label}</dt>
            <dd className="font-display text-xl font-medium text-ink-900 tracking-tightish">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </Reveal>
);

const Work = () => (
  <section id="work" className="py-24 lg:py-32 bg-paper">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
      <Reveal as="div" className="mb-12 lg:mb-16 max-w-3xl">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-4">Selected work</div>
        <h2 className="font-display font-medium text-4xl lg:text-6xl leading-[1.02] tracking-tighter2">
          Four projects, shipped.
        </h2>
      </Reveal>

      <div>
        <WorkRow
          accentClass="text-accent"
          index="W—01"
          title="California Closets"
          role="Technical architect · Third & Grove"
          href="https://www.californiaclosets.com"
          description="Migrated a high-traffic WordPress instance to a headless Next.js front end with multilingual support and a component-first design system. Led a team of up to 7 engineers through the rebuild, established CI/CD with branch previews, and shipped in September 2025."
          stats={[
            { label: 'Components', value: '200+ Storybook' },
            { label: 'Locales', value: 'EN + ES' },
            { label: 'Compliance', value: 'WCAG / ADA' },
            { label: 'Team', value: 'Up to 7 eng.' },
          ]}
          stack={['Next.js', 'TypeScript', 'GraphQL', 'Algolia', 'Storybook', 'WordPress', 'Salesforce']}
        />
        <WorkRow
          accentClass="text-warm"
          index="W—02"
          title="Dealer Transparency MILES"
          role="Co-founder & lead developer"
          href="https://miles.dealertransparency.com"
          description="An enterprise SaaS replacing legacy spreadsheets with a real-time, reactive offer engine. Architected WebSocket data pipelines, automated third-party API syncs, and penny-perfect financial calculations using the Strategy pattern. Live with five active dealerships at 99.9% uptime."
          stats={[
            { label: 'Dealerships', value: '5 active' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Sync engine', value: 'Laravel Reverb' },
            { label: 'Hotfix cycle', value: '< 24h' },
          ]}
          stack={['Laravel 12', 'React 18', 'TypeScript', 'Zustand', 'MySQL', 'Laravel Cloud']}
        />
        <WorkRow
          accentClass="text-sage"
          index="W—03"
          title="CropAide"
          role="Co-founder & lead architect"
          href="https://cropaide.com"
          description="A multi-tenant agricultural SaaS taken from zero to public beta. Designed row-level policy-based authorization for Grower/Advisor/Dealer hierarchies, decoupled media via Cloudflare R2 for infinite scalability, and integrated Stripe billing end-to-end."
          stats={[
            { label: 'Tenant isolation', value: '100%' },
            { label: 'Permission tiers', value: '3' },
            { label: 'Media', value: 'CDN-offloaded' },
            { label: 'Status', value: 'Public beta' },
          ]}
          stack={['Laravel 11', 'PHP 8.2', 'MySQL', 'Cloudflare', 'Stripe']}
        />
        <WorkRow
          accentClass="text-accent"
          index="W—04"
          title="ProjectAire"
          role="Co-founder & lead engineer"
          href="https://projectaire.app"
          description="A construction project-management SaaS with real-time collaboration, three-tier plan gating via middleware, and a pre-aggregated metrics engine. Also home to a 3-week Apryse WebViewer integration with multi-user annotation sync via Reverb broadcasting."
          stats={[
            { label: 'Pricing tiers', value: '3 + trial' },
            { label: 'Collaboration', value: 'Real-time WS' },
            { label: 'Annotations', value: 'XFDF · multi-user' },
            { label: 'Trial', value: '14d · no card' },
          ]}
          stack={['Laravel', 'React', 'MySQL', 'Stripe', 'Apryse']}
        />
      </div>
    </div>
  </section>
);

/* ---------- how I work ---------- */

const HowIWork = () => {
  const steps = [
    { n: '01', title: 'Discovery', body: 'A deep listen on business goals, users, and the constraints. No code is considered yet.' },
    { n: '02', title: 'Architecture', body: 'Schema, API contracts, infrastructure, stack. The hard decisions get made before sprint one.' },
    { n: '03', title: 'Build & iterate', body: 'Transparent sprints with weekly demos. You see progress every Friday, not just at the finish.' },
    { n: '04', title: 'Launch & scale', body: 'Deploy, monitor, hand off with docs your team can actually read. I don\'t disappear at launch.' },
  ];
  return (
    <section className="py-24 lg:py-32 bg-ink-900 text-paper-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <Reveal as="div" className="mb-16 max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-200/70 mb-4">How I work</div>
          <h2 className="font-display font-medium text-4xl lg:text-6xl leading-[1.02] tracking-tighter2 text-paper-50">
            Four steps. <em className="italic font-normal text-paper-200/70">No theatre.</em>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80} as="div" className="border-t border-paper-50/15 pt-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-200/60 mb-3">Step {s.n}</div>
              <h3 className="font-display text-2xl font-medium tracking-tightish mb-3 text-paper-50">{s.title}</h3>
              <p className="text-paper-200/80 leading-relaxed text-sm">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- philosophy ---------- */

const Philosophy = () => (
  <section className="py-24 lg:py-32">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12">
      <Reveal as="div" className="lg:col-span-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-6">About</div>
        <figure className="relative">
          <div className="absolute -inset-3 bg-accent/8 -z-10 rounded-sm" aria-hidden="true" />
          <img
            src="/mark-headshot.jpg"
            alt="Mark Ward"
            className="block w-full max-w-[260px] aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-500 rounded-sm"
          />
          <figcaption className="mt-4 text-xs text-ink-quiet font-mono">
            Mark Ward<span className="text-accent"> · </span>principal engineer
          </figcaption>
        </figure>
      </Reveal>
      <div className="lg:col-span-9 space-y-8">
        <Reveal as="h2" className="font-display font-medium text-3xl lg:text-5xl leading-[1.08] tracking-tighter2 max-w-3xl">
          I care about my clients, and I treat their products
          <em className="italic font-normal text-accent"> like they're my own.</em>
        </Reveal>
        <Reveal as="div" delay={100} className="grid md:grid-cols-2 gap-x-12 gap-y-6 text-ink-soft leading-relaxed max-w-3xl">
          <p>
            As Lead Developer at Third &amp; Grove, I've shipped production systems for national
            brands — and on the side I've co-founded three SaaS products (CropAide, MILES,
            ProjectAire), taking each from concept to production.
          </p>
          <p>
            Fifteen-plus years of production work has given me a pretty clear sense of what
            matters and what's just noise. AI tooling handles the boilerplate so my hours go
            to the architecture and logic that actually moves the product forward.
          </p>
        </Reveal>
        <Reveal as="ul" delay={180} className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 max-w-3xl pt-4 border-t border-ink-900/15">
          {[
            'Lead Developer · Third & Grove',
            'Co-founder · 3 SaaS products',
            'CI/CD & automated tests',
            'Multi-tenant SaaS architecture',
            'Real-time WebSocket systems',
            'Team lead · up to 7 engineers',
          ].map((item) => (
            <li key={item} className="text-sm text-ink-soft flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </Reveal>
      </div>
    </div>
  </section>
);

/* ---------- AI blueprint tool (restyled, same logic) ---------- */

const BlueprintGenerator = () => {
  const [idea, setIdea] = useState('');
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const generateBlueprint = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setError('');
    setBlueprint(null);

    const workerUrl = import.meta.env.VITE_GEMINI_WORKER_URL;
    if (!workerUrl) {
      setError("AI is offline in this environment (VITE_GEMINI_WORKER_URL not set).");
      setLoading(false);
      return;
    }

    const prompt = `
      Act as a Senior Software Architect working directly with founders.
      Preferred stack: Laravel (PHP) for backend, React or Next.js for frontend,
      Tailwind CSS for styling, MySQL or PostgreSQL for databases, and Vercel or AWS for infrastructure.
      We specialize exclusively in web applications — not native mobile apps.
      Always recommend our preferred stack and a web-based solution unless the project idea is
      fundamentally impossible as a web app. If a user describes something that could be a mobile
      app, recommend a responsive Progressive Web App (PWA) built with Next.js instead.
      If you do deviate from the preferred stack, briefly note why in the verdict.

      Analyze this project idea: "${idea}".
      Provide a structured technical analysis.

      Return a JSON object with strictly this schema:
      {
        "stack": {
          "frontend": "e.g. Next.js / React",
          "backend": "e.g. Laravel (PHP)",
          "database": "e.g. MySQL / PostgreSQL",
          "infra": "e.g. Vercel / AWS"
        },
        "challenges": ["challenge 1", "challenge 2", "challenge 3"],
        "timeline": "e.g. 3-4 months for MVP",
        "verdict": "A one sentence blunt professional opinion on feasibility and complexity."
      }
    `;

    try {
      // Worker is the shared Gemini proxy (same one used by the portfolio).
      // It returns an SSE stream from streamGenerateContent?alt=sse — accumulate
      // text chunks then JSON.parse the final result (Gemini honors
      // responseMimeType: 'application/json' so the assembled text is valid JSON).
      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`API error ${response.status}${errText ? `: ${errText.slice(0, 120)}` : ''}`);
      }
      if (!response.body) throw new Error('Empty response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            fullText += chunk;
          } catch (_) {}
        }
      }

      if (!fullText) throw new Error('No content returned');
      const result = JSON.parse(fullText);
      setBlueprint(result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-paper-200/40 border-y border-ink-900/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* ---------- section header ---------- */}
        <Reveal as="div" className="mb-12 lg:mb-16 max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4 inline-flex items-center gap-2">
            <Sparkles size={12} /> Not ready to book? · Beta
          </div>
          <h2 className="font-display font-medium text-4xl lg:text-6xl leading-[1.02] tracking-tighter2">
            Scope your idea <em className="italic font-normal text-accent">instantly.</em>
          </h2>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-2xl">
            Describe your project. An AI architect drafts a recommended stack, flags real risks,
            and estimates a timeline. No email gate.
          </p>
        </Reveal>

        {!blueprint ? (
          /* ---------- form ---------- */
          <Reveal as="div" className="border-t border-ink-900/15 pt-10 lg:pt-12">
            <form onSubmit={generateBlueprint} className="space-y-8 max-w-3xl">
              <div>
                <label htmlFor="bp-idea" className="block text-[10px] font-mono uppercase tracking-[0.22em] text-ink-quiet mb-3">
                  Project idea
                </label>
                <textarea
                  id="bp-idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="w-full bg-transparent border-b border-ink-900/20 py-3 text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-accent transition-colors resize-none"
                  rows={4}
                  placeholder="e.g., A real-time marketplace for vintage watch collectors with auction functionality…"
                />
              </div>

              {error && (
                <div role="alert" className="rounded-md border border-warm/40 bg-warm/5 px-4 py-3 text-sm text-warm">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
                  Powered by Gemini 2.5 Flash
                </span>
                <PillButton variant="accent" type="submit" className={loading ? 'opacity-70 pointer-events-none' : ''}>
                  {loading ? <><Loader size={16} className="animate-spin" /> Analyzing…</> : <>Generate blueprint <ArrowRight size={16} /></>}
                </PillButton>
              </div>
            </form>
          </Reveal>
        ) : (
          /* ---------- output ---------- */
          <div className="border-t border-ink-900/15 pt-10 lg:pt-12 space-y-14 lg:space-y-20">
            {/* result header */}
            <Reveal as="div" className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">
                  Blueprint · 01
                </div>
                <h3 className="font-display font-medium text-3xl lg:text-5xl leading-[1.02] tracking-tighter2">
                  Here’s how I’d build it.
                </h3>
              </div>
              <button
                onClick={() => { setBlueprint(null); setIdea(''); setError(''); }}
                className="group inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-accent underline decoration-ink-300 decoration-1 underline-offset-[6px] hover:decoration-accent transition-colors self-start sm:self-end"
              >
                Try another idea <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </Reveal>

            {/* stack */}
            <Reveal as="div">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
                Recommended stack
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4">
                {[
                  { Icon: Layout, label: 'Frontend', value: blueprint.stack.frontend },
                  { Icon: Server, label: 'Backend', value: blueprint.stack.backend },
                  { Icon: Database, label: 'Database', value: blueprint.stack.database },
                  { Icon: Layers, label: 'Infra', value: blueprint.stack.infra },
                ].map(({ Icon, label, value }, i) => (
                  <div
                    key={label}
                    className={`py-5 px-5 lg:px-6 ${i > 0 ? 'border-l border-ink-900/15' : ''} ${i >= 2 ? 'md:border-l border-l border-ink-900/15' : ''}`}
                  >
                    <div className="flex items-center gap-2 text-accent mb-3">
                      <Icon size={14} />
                      <span className="text-[10px] font-mono uppercase tracking-[0.22em]">{label}</span>
                    </div>
                    <div className="font-display text-lg lg:text-xl font-medium leading-[1.15] tracking-tightish text-ink-900">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* timeline + verdict */}
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <Reveal as="div" className="space-y-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent inline-flex items-center gap-2">
                  <Clock size={12} /> Estimated timeline
                </div>
                <p className="font-display text-2xl lg:text-3xl font-medium leading-[1.15] tracking-tighter2 text-ink-900">
                  {blueprint.timeline}
                </p>
              </Reveal>
              <Reveal as="div" delay={80} className="space-y-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm inline-flex items-center gap-2">
                  <FileText size={12} /> Architect’s verdict
                </div>
                <p className="font-display text-xl lg:text-2xl leading-[1.2] tracking-tighter2 text-ink-900 italic">
                  “{blueprint.verdict}”
                </p>
              </Reveal>
            </div>

            {/* challenges */}
            <Reveal as="div">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm mb-6 inline-flex items-center gap-2">
                <ShieldAlert size={12} /> Technical challenges
              </div>
              <ul className="divide-y divide-ink-900/10 border-y border-ink-900/15">
                {blueprint.challenges.map((challenge, i) => (
                  <li key={i} className="flex items-start gap-6 py-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet shrink-0 pt-1">
                      0{i + 1}
                    </span>
                    <span className="text-ink-soft leading-relaxed">{challenge}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* closing CTA */}
            <Reveal as="div" className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pt-2">
              <div className="max-w-xl">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">
                  Want me to build this?
                </div>
                <p className="font-display text-xl lg:text-2xl leading-[1.2] tracking-tighter2 text-ink-900">
                  The AI gave you a rough shape. <em className="italic font-normal text-ink-soft">I’ll give you a real proposal.</em>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <PillButton variant="accent" onClick={() => navigate('/contact')}>
                  Start a project <ArrowRight size={16} />
                </PillButton>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
};

/* ---------- contact ---------- */

/* ---------- Turnstile hook ---------- */

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

const useTurnstile = (containerRef) => {
  const [token, setToken] = useState('');
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !TURNSTILE_SITE_KEY) return;

    let cancelled = false;
    const render = () => {
      if (cancelled || !window.turnstile || !el) return;
      // Avoid double-render in dev StrictMode
      if (widgetIdRef.current != null) return;
      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'auto',
        appearance: 'always', // always show small widget so users see the protection
        callback: (t) => setToken(t),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      });
    };

    if (window.turnstile) render();
    else {
      const t = setInterval(() => {
        if (window.turnstile) { clearInterval(t); render(); }
      }, 100);
      // Safety timeout
      setTimeout(() => clearInterval(t), 8000);
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current != null && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch (e) {}
      }
      widgetIdRef.current = null;
    };
  }, [containerRef]);

  const reset = () => {
    if (widgetIdRef.current != null && window.turnstile) {
      try { window.turnstile.reset(widgetIdRef.current); } catch (e) {}
    }
    setToken('');
  };

  return { token, reset, configured: !!TURNSTILE_SITE_KEY };
};

/* ---------- contact form ---------- */

export const Contact = ({ selectedStage, setSelectedStage, selectedBudget, setSelectedBudget }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const loadedAtRef = useRef(Date.now());
  const turnstileRef = useRef(null);
  const { token: turnstileToken, reset: resetTurnstile, configured: turnstileOn } = useTurnstile(turnstileRef);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setFieldErrors({});
    setErrorMessage('');

    // Quick client-side guards
    const errs = {};
    if (!name || name.trim().length < 2) errs.name = 'Please add your name.';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please add a valid email.';
    if (!message || message.trim().length < 10) errs.message = 'A few sentences helps me write back faster.';
    if (turnstileOn && !turnstileToken) errs.turnstile = 'Please complete the verification.';
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    const form = e.currentTarget;
    const honeypot = form.elements.company_url?.value || '';

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          stage: selectedStage,
          budget: selectedBudget,
          message: message.trim(),
          company_url: honeypot,
          loaded_at: loadedAtRef.current,
          turnstile_token: turnstileToken,
        }),
      });

      // Parse — capture JSON when possible, raw text otherwise (helps diagnose
      // when the request didn't hit the Pages Function at all, e.g. Vite dev).
      const contentType = res.headers.get('content-type') || '';
      let data = {};
      let rawText = '';
      if (contentType.includes('application/json')) {
        try { data = await res.json(); } catch (_) { /* swallow */ }
      } else {
        rawText = await res.text().catch(() => '');
      }

      if (!res.ok || !data.ok) {
        if (data.errors) setFieldErrors(data.errors);

        // Build the most useful error message we can.
        let msg = data.error;
        if (!msg && rawText && rawText.length < 200) msg = `${res.status}: ${rawText}`;
        if (!msg) {
          // Common failure: hit Vite dev server with no Function route.
          if (res.status === 405 || res.status === 404) {
            msg = `Endpoint not reachable (status ${res.status}). ` +
              'If you\'re testing locally, `npm run dev` only runs Vite — Pages Functions need `npx wrangler pages dev` instead.';
          } else {
            msg = `Something went wrong (status ${res.status}).`;
          }
        }
        // Surface Turnstile-specific reason
        if (data.reason === 'turnstile-not-configured') {
          msg = 'Spam protection is not configured on the server (TURNSTILE_SECRET_KEY missing).';
        }

        setErrorMessage(msg);
        setStatus('error');
        // Log full response for deeper diagnosis
        // eslint-disable-next-line no-console
        console.error('[contact] submit failed', { status: res.status, data, rawText });
        resetTurnstile();
        return;
      }
      setStatus('sent');
      setName(''); setEmail(''); setMessage('');
      setSelectedStage(''); setSelectedBudget('');
      resetTurnstile();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[contact] network error', err);
      setErrorMessage(`Network error: ${err?.message || 'request failed'}`);
      setStatus('error');
      resetTurnstile();
    }
  };

  const fieldBase = 'w-full bg-transparent border-b py-2.5 text-ink-900 placeholder:text-ink-300 focus:outline-none transition-colors';
  const fieldOk = 'border-ink-900/20 focus:border-accent';
  const fieldErr = 'border-warm focus:border-warm';

  return (
  <section id="contact" className="py-24 lg:py-32">
    <div className="max-w-[1100px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12">
      <Reveal as="div" className="lg:col-span-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-4">Contact</div>
        <h2 className="font-display font-medium text-4xl lg:text-6xl leading-[1] tracking-tighter2 mb-6">
          Tell me<br />
          what you're<br />
          <em className="italic font-normal text-accent">building.</em>
        </h2>
        <p className="text-ink-soft leading-relaxed max-w-sm">
          I take on a limited number of projects per year so every client gets the time they're paying for.
          One business day for a response, no exceptions.
        </p>
      </Reveal>

      <Reveal as="div" delay={100} className="lg:col-span-7">
        {status === 'sent' ? (
          <div className="border border-ink-900/15 rounded-md p-8 bg-paper-100/60">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">Message received</div>
            <h3 className="font-display font-medium text-2xl lg:text-3xl leading-[1.15] tracking-tighter2 mb-4">
              Thanks for reaching out — I'll reply within one business day.
            </h3>
            <p className="text-ink-soft leading-relaxed">
              No auto-responder. I read every message personally. Watch your inbox for a real reply from <span className="text-ink-900">mark@markwarddesign.com</span>.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent underline decoration-accent/30 underline-offset-[6px] hover:decoration-accent transition-colors"
            >
              Send another <ArrowRight size={14} />
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Honeypot — visible to bots, invisible to humans */}
          <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
            <label>
              Company URL (leave blank)
              <input
                type="text"
                name="company_url"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cf-name" className="block text-[10px] font-mono uppercase tracking-[0.2em] text-ink-quiet mb-2">Name</label>
              <input
                id="cf-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${fieldBase} ${fieldErrors.name ? fieldErr : fieldOk}`}
                placeholder="Your name"
              />
              {fieldErrors.name && <p className="mt-1 text-xs text-warm">{fieldErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="cf-email" className="block text-[10px] font-mono uppercase tracking-[0.2em] text-ink-quiet mb-2">Email</label>
              <input
                id="cf-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${fieldBase} ${fieldErrors.email ? fieldErr : fieldOk}`}
                placeholder="you@company.com"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-warm">{fieldErrors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-ink-quiet mb-3">Project stage</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Website Build', 'MVP to Life', 'Full Application', 'Advisory', 'Retainer', 'Enterprise'].map((stage) => (
                <label key={stage} className="cursor-pointer">
                  <input type="radio" name="stage" className="peer sr-only" checked={selectedStage === stage} onChange={() => setSelectedStage(stage)} />
                  <div className="text-xs text-center px-3 py-2.5 border border-ink-900/15 rounded-full text-ink-soft peer-checked:bg-ink-900 peer-checked:text-paper-50 peer-checked:border-ink-900 hover:border-ink-900/40 transition-all">
                    {stage}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-ink-quiet mb-3">Budget</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['<$5k', '$5k - $15k', '$15k - $50k', '$50k+'].map((budget) => (
                <label key={budget} className="cursor-pointer">
                  <input type="radio" name="budget" className="peer sr-only" checked={selectedBudget === budget} onChange={() => setSelectedBudget(budget)} />
                  <div className="text-xs text-center px-3 py-2.5 border border-ink-900/15 rounded-full text-ink-soft peer-checked:bg-ink-900 peer-checked:text-paper-50 peer-checked:border-ink-900 hover:border-ink-900/40 transition-all">
                    {budget}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="cf-message" className="block text-[10px] font-mono uppercase tracking-[0.2em] text-ink-quiet mb-2">What are you building?</label>
            <textarea
              id="cf-message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${fieldBase} ${fieldErrors.message ? fieldErr : fieldOk} resize-none`}
              placeholder="The problem you're solving, who it's for, and where you're stuck..."
            />
            {fieldErrors.message && <p className="mt-1 text-xs text-warm">{fieldErrors.message}</p>}
          </div>

          {/* Turnstile widget */}
          {turnstileOn && (
            <div>
              <div ref={turnstileRef} className="cf-turnstile inline-block" />
              {fieldErrors.turnstile && <p className="mt-1 text-xs text-warm">{fieldErrors.turnstile}</p>}
            </div>
          )}

          {status === 'error' && errorMessage && (
            <div role="alert" className="rounded-md border border-warm/40 bg-warm/5 px-4 py-3 text-sm text-warm">
              {errorMessage}
            </div>
          )}

          <div className="pt-2">
            <PillButton variant="accent" type="submit" className={status === 'sending' ? 'opacity-70 pointer-events-none' : ''}>
              {status === 'sending' ? 'Sending…' : 'Send application'} <ArrowRight size={16} />
            </PillButton>
            <p className="mt-4 text-xs text-ink-quiet">
              I read every message personally. One business day to reply.
              {turnstileOn ? ' Spam protection by Cloudflare Turnstile.' : ''}
            </p>
          </div>
        </form>
        )}
      </Reveal>
    </div>
  </section>
  );
};

/* ---------- footer (Ft5 statement) ---------- */

const Footer = () => (
  <footer className="bg-ink-900 text-paper-50">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <div className="font-display text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tighter2 max-w-4xl">
        One engineer. Fifteen years shipping. Always open to new projects, creative ideas,
        and <em className="italic font-normal text-warm">ambitious teams.</em>
      </div>
      <div className="mt-16 pt-8 border-t border-paper-50/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm text-paper-200/70">
        <div>© {new Date().getFullYear()} Mark Ward. All rights reserved.</div>
        <div className="flex items-center gap-6 flex-wrap">
          <a href="https://portfolio.markward.dev/" target="_blank" rel="noreferrer" className="hover:text-paper-50 transition-colors inline-flex items-center gap-2">Writing <ArrowUpRight size={14} /></a>
          <a href="#" className="hover:text-paper-50 transition-colors inline-flex items-center gap-2"><Github size={16} /> GitHub</a>
          <a href="#" className="hover:text-paper-50 transition-colors inline-flex items-center gap-2"><Linkedin size={16} /> LinkedIn</a>
          <Link to="/contact" className="hover:text-paper-50 transition-colors inline-flex items-center gap-2"><Mail size={16} /> Contact</Link>
        </div>
      </div>
    </div>
  </footer>
);

/* ---------- home page ---------- */

function Home() {
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  const lenis = useLenis();
  const scrollTo = (id) => scrollToId(lenis, id);
  const location = useLocation();

  // Handle hash scrolling when arriving from another route (e.g. /#contact)
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    // Defer until layout + Lenis are ready
    const t = setTimeout(() => scrollToId(lenis, id), 80);
    return () => clearTimeout(t);
  }, [location.hash, lenis]);

  const handleServiceCta = (stage, budget) => {
    setSelectedStage(stage);
    setSelectedBudget(budget);
    scrollTo('contact');
  };

  return (
    <>
      <Hero onCta={() => scrollTo('contact')} onWorkCta={() => scrollTo('work')} />
      <Triptych onSelect={handleServiceCta} />
      <Work />
      <SeeAllWorkLink />
      <AboutTeaser />
      <BlueprintGenerator />
      <Contact
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        selectedBudget={selectedBudget}
        setSelectedBudget={setSelectedBudget}
      />
    </>
  );
}

/* ---------- home teaser blocks ---------- */

const SeeAllWorkLink = () => (
  <section className="bg-paper pb-20 lg:pb-28 -mt-8">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
      <Reveal as="div" className="flex items-center justify-end">
        <Link
          to="/work"
          className="group inline-flex items-center gap-2 text-sm font-medium text-accent underline decoration-accent/30 decoration-1 underline-offset-[6px] hover:decoration-accent transition-colors"
        >
          See all work
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </div>
  </section>
);

const AboutTeaser = () => (
  <section className="py-24 lg:py-32 bg-paper-200/40 border-y border-ink-900/10">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      <Reveal as="div" className="lg:col-span-4">
        <figure className="relative max-w-[280px]">
          <div className="absolute -inset-3 bg-accent/8 -z-10 rounded-sm" aria-hidden="true" />
          <img
            src="/mark-headshot.jpg"
            alt="Mark Ward"
            className="block w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-500 rounded-sm"
          />
          <figcaption className="mt-4 text-xs text-ink-quiet font-mono">
            Mark Ward<span className="text-accent"> · </span>principal engineer
          </figcaption>
        </figure>
      </Reveal>
      <div className="lg:col-span-8 space-y-6">
        <Reveal as="div" className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          About
        </Reveal>
        <Reveal as="h2" delay={80} className="font-display font-medium text-3xl lg:text-5xl leading-[1.05] tracking-tighter2 max-w-3xl">
          I care about my clients, and I treat their products
          <em className="italic font-normal text-accent"> like they’re my own.</em>
        </Reveal>
        <Reveal as="p" delay={140} className="text-lg text-ink-soft leading-relaxed max-w-2xl">
          Fifteen years of production work. Three co-founded SaaS products. Senior judgment on
          every hour you pay for — because the work I take on is the work I’d want done right
          if it were my own company.
        </Reveal>
        <Reveal as="div" delay={200}>
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 text-sm font-medium text-accent underline decoration-accent/30 decoration-1 underline-offset-[6px] hover:decoration-accent transition-colors"
          >
            More about how I work
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ---------- app shell ---------- */

function AppShell() {
  const lenis = useLenis();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle: toggleTheme } = useTheme();
  const goToContact = () => {
    if (location.pathname === '/') scrollToId(lenis, 'contact');
    else navigate('/#contact');
  };

  // Scroll to top on route change (unless arriving with a hash; hash handling
  // belongs to the destination page so it can wait for layout).
  useEffect(() => {
    if (location.hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [location.pathname, location.hash, lenis]);

  return (
    <div className="bg-paper text-ink-900 min-h-screen">
      <Nav onCta={goToContact} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <div key={location.pathname} className="page-fade">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/apps" element={<AppsPage />} />
            <Route path="/apps/:slug" element={<CaseStudy type="apps" />} />
            <Route path="/websites" element={<WebsitesPage />} />
            <Route path="/websites/:slug" element={<CaseStudy type="websites" />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const lenis = useLenisInit();
  return (
    <LenisContext.Provider value={lenis}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </LenisContext.Provider>
  );
}

