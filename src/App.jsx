import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Cpu, 
  Layers, 
  ArrowRight, 
  CheckCircle, 
  Terminal, 
  Database, 
  Layout, 
  Smartphone, 
  Menu, 
  X,
  ChevronRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Loader,
  Server,
  ShieldAlert,
  Clock,
  FileText
} from 'lucide-react';
import {
  SiLaravel,
  SiPhp,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiGraphql,
  SiMysql,
  SiPostgresql,
  SiDocker,
  SiAmazon,
  SiVercel,
  SiStripe,
  SiGit,
  SiWordpress,
  SiNodedotjs,
} from 'react-icons/si';

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon, disabled = false }) => {
  const baseStyle = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border border-blue-500/50",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500",
    outline: "bg-transparent border border-slate-600 hover:border-blue-400 text-slate-400 hover:text-blue-400",
    magic: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-purple-900/20 border border-purple-500/50"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
      {Icon && <Icon size={18} />}
    </button>
  );
};

const SectionHeading = ({ badge, title, subtitle, center = true }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''}`}>
    {badge && (
      <span className="inline-block py-1 px-3 rounded-full bg-blue-900/30 text-blue-400 text-xs font-mono tracking-wider mb-4 border border-blue-800/50">
        {badge}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 tracking-tight">{title}</h2>
    {subtitle && <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
  </div>
);

const Card = ({ title, description, icon: Icon, tags = [] }) => (
  <div className="group relative bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors"></div>
    
    <div className="mb-6 inline-flex p-3 rounded-lg bg-slate-800 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    
    <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-blue-200 transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed mb-6">{description}</p>
    
    <div className="flex flex-wrap gap-2 mt-auto">
      {tags.map((tag) => (
        <span key={tag} className="text-xs font-mono py-1 px-2 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const ProjectCard = ({ title, role, description, stats, stack, imageGradient }) => (
  <div className="flex flex-col lg:flex-row gap-8 items-center bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors">
    <div className={`w-full lg:w-1/2 h-64 lg:h-full min-h-[300px] ${imageGradient} relative flex items-center justify-center group`}>
      <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
      <div className="relative w-3/4 aspect-video bg-slate-900 rounded-lg shadow-2xl border border-slate-700 transform group-hover:scale-105 transition-transform duration-500 flex flex-col overflow-hidden">
        <div className="h-6 bg-slate-800 border-b border-slate-700 flex items-center px-3 gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
        </div>
        <div className="flex-1 bg-slate-900 p-4 space-y-3">
          <div className="w-1/3 h-2 bg-slate-800 rounded"></div>
          <div className="flex gap-4">
            <div className="w-1/4 h-20 bg-slate-800/50 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="w-full h-2 bg-slate-800 rounded"></div>
              <div className="w-5/6 h-2 bg-slate-800 rounded"></div>
              <div className="w-4/6 h-2 bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="w-full lg:w-1/2 p-6 lg:p-10 lg:pl-0">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-900/30 text-blue-300 border border-blue-800/50">{role}</span>
      </div>
      <p className="text-slate-400 mb-6 text-lg leading-relaxed">{description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="border-l-2 border-slate-700 pl-4">
            <div className="text-slate-200 font-bold">{stat.value}</div>
            <div className="text-slate-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {stack.map((tech) => (
          <span key={tech} className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
            {tech}
          </span>
        ))}
      </div>

      <a href="#" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors">
        View Case Study <ArrowRight size={16} />
      </a>
    </div>
  </div>
);

// --- Gemini Tool: Blueprint Generator ---

const BlueprintGenerator = () => {
  const [idea, setIdea] = useState('');
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateBlueprint = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setError('');
    setBlueprint(null);

    const apiKey = ""; // System will inject the key
    
    const prompt = `
      Act as a pragmatic Senior Software Architect. 
      Analyze this project idea: "${idea}". 
      Provide a structured technical analysis.
      
      Return a JSON object with strictly this schema:
      {
        "stack": { 
          "frontend": "e.g. Next.js, React Native", 
          "backend": "e.g. Laravel, Node.js", 
          "database": "e.g. PostgreSQL, Redis", 
          "infra": "e.g. Vercel, AWS" 
        },
        "challenges": ["challenge 1", "challenge 2", "challenge 3"],
        "timeline": "e.g. 3-4 months for MVP",
        "verdict": "A one sentence blunt professional opinion on feasibility and complexity."
      }
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
               responseMimeType: "application/json" 
            }
          }),
        }
      );

      if (!response.ok) throw new Error("API call failed");
      
      const data = await response.json();
      const result = JSON.parse(data.candidates[0].content.parts[0].text);
      setBlueprint(result);
    } catch (err) {
      setError("System overload. Please try again in a moment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700 flex items-center gap-3">
        <Sparkles size={20} className="text-purple-400" />
        <h3 className="font-bold text-slate-100">AI Architectural Blueprint</h3>
        <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">Beta</span>
      </div>
      
      <div className="p-6 md:p-8">
        {!blueprint ? (
          <div className="space-y-6">
             <p className="text-slate-400">Describe your app idea below. Our architectural AI model will generate a recommended tech stack, identify risks, and estimate a timeline.</p>
             <div className="relative">
                <textarea 
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors resize-none h-32"
                  placeholder="e.g., A real-time marketplace for vintage watch collectors with auction functionality..."
                />
             </div>
             <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 italic">Powered by Gemini 2.5 Flash</span>
                <Button 
                  variant="magic" 
                  onClick={generateBlueprint} 
                  disabled={loading || !idea.trim()}
                  icon={loading ? Loader : Sparkles}
                  className={loading ? "opacity-80" : ""}
                >
                  {loading ? "Analyzing..." : "Generate Blueprint"}
                </Button>
             </div>
             {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        ) : (
          <div className="animate-fade-in space-y-8">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Analysis Complete</h4>
                  <p className="text-slate-400 text-sm">Based on your input requirements.</p>
                </div>
                <button 
                  onClick={() => setBlueprint(null)} 
                  className="text-sm text-slate-500 hover:text-white underline"
                >
                  Analyze Another Idea
                </button>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                   <div className="flex items-center gap-2 mb-2 text-blue-400">
                      <Layout size={16} /> <span className="text-xs font-bold uppercase">Frontend</span>
                   </div>
                   <div className="font-mono text-sm text-slate-200">{blueprint.stack.frontend}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                   <div className="flex items-center gap-2 mb-2 text-green-400">
                      <Server size={16} /> <span className="text-xs font-bold uppercase">Backend</span>
                   </div>
                   <div className="font-mono text-sm text-slate-200">{blueprint.stack.backend}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                   <div className="flex items-center gap-2 mb-2 text-yellow-400">
                      <Database size={16} /> <span className="text-xs font-bold uppercase">Database</span>
                   </div>
                   <div className="font-mono text-sm text-slate-200">{blueprint.stack.database}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                   <div className="flex items-center gap-2 mb-2 text-purple-400">
                      <Layers size={16} /> <span className="text-xs font-bold uppercase">Infra</span>
                   </div>
                   <div className="font-mono text-sm text-slate-200">{blueprint.stack.infra}</div>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-950/50 p-5 rounded-lg border-l-2 border-orange-500">
                   <div className="flex items-center gap-2 mb-2 text-orange-400">
                      <Clock size={18} /> <h5 className="font-bold">Estimated Timeline</h5>
                   </div>
                   <p className="text-slate-300 text-sm leading-relaxed">{blueprint.timeline}</p>
                </div>
                <div className="bg-slate-950/50 p-5 rounded-lg border-l-2 border-blue-500">
                   <div className="flex items-center gap-2 mb-2 text-blue-400">
                      <FileText size={18} /> <h5 className="font-bold">Architect's Verdict</h5>
                   </div>
                   <p className="text-slate-300 text-sm leading-relaxed italic">"{blueprint.verdict}"</p>
                </div>
             </div>

             <div>
                <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <ShieldAlert size={16} /> Technical Challenges
                </h5>
                <ul className="space-y-3">
                   {blueprint.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                         <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                         {challenge}
                      </li>
                   ))}
                </ul>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stack');

  const [terminalText, setTerminalText] = useState('');
  const fullText = "Initializing architect_mode...\nLoading stack: Laravel, React, Next.js...\nConnection established.";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTerminalText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center gap-3">
               <img
                  src="./public/logo.png"
                  alt="Ward Logo"
                  className="h-10 w-auto group-hover:scale-105 transition-transform filter invert brightness-0 saturate-0"
                />
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Capabilities</a>
              <a href="#process" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Process</a>
              <a href="#work" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Selected Work</a>
              <a href="#philosophy" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Philosophy</a>
              <Button variant="primary" className="px-5 py-2 text-sm" onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})}>
                Book Consultation
              </Button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300 hover:text-white p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#services" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Capabilities</a>
              <a href="#process" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Process</a>
              <a href="#work" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Selected Work</a>
              <a href="#philosophy" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Philosophy</a>
              <div className="pt-4">
                <Button variant="primary" className="w-full justify-center">Book Consultation</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-blue-400 text-sm font-medium mb-6 animate-fade-in-up">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Accepting New Projects for Q2 2026
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
                  We Engineer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Scalable Products</span> for Visionaries.
                </h1>
                
                <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Stop hiring "coders." Partner with an independent engineering studio that bridges the gap between complex business logic and high-performance execution. Specializing in Laravel, React, and Enterprise Architecture.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button variant="primary" icon={ArrowRight} onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})}>
                    Start Your Project
                  </Button>
                  <Button variant="secondary" icon={ExternalLink} onClick={() => document.getElementById('work').scrollIntoView({behavior: 'smooth'})}>
                    View Case Studies
                  </Button>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <span className="text-sm font-semibold text-slate-500">TRUSTED BY:</span>
                  <div className="h-6 w-24 bg-slate-800/50 rounded flex items-center justify-center text-xs font-bold text-slate-500">Third & Grove</div>
                  <div className="h-6 w-24 bg-slate-800/50 rounded flex items-center justify-center text-xs font-bold text-slate-500">CA Closets</div>
                </div>
              </div>

              {/* Code/Terminal Visual */}
              <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="ml-4 text-xs font-mono text-slate-500">engineer_profile.json</div>
                  </div>
                  <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                    <div className="text-slate-400">
                      <span className="text-purple-400">const</span> <span className="text-yellow-200">Studio</span> = <span className="text-blue-300">{`{`}</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-red-300">"name"</span>: <span className="text-green-300">"WARD Studio"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-red-300">"type"</span>: <span className="text-green-300">"Independent Engineering Studio"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-red-300">"core_stack"</span>: <span className="text-blue-300">[</span>
                    </div>
                    <div className="pl-8">
                      <span className="text-green-300">"Laravel"</span>, <span className="text-green-300">"React"</span>, <span className="text-green-300">"Next.js"</span>, <span className="text-green-300">"Tailwind"</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-blue-300">]</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-red-300">"focus"</span>: <span className="text-green-300">"Scalability & ROI"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-red-300">"status"</span>: <span className="text-green-300">"Accepting Clients"</span>
                    </div>
                    <div className="text-blue-300">{`}`};</div>
                    
                    <div className="mt-6 border-t border-slate-800 pt-4 text-slate-500">
                      <span className="text-green-500">➜</span> ~ <span className="animate-pulse">_</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services / Pillars */}
        <section id="services" className="py-20 lg:py-32 bg-slate-950 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading 
              badge="CAPABILITIES" 
              title="From MVP to Enterprise Scale"
              subtitle="We don't just write code. We build digital assets that grow with your business." 
            />
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card 
                icon={Layout}
                title="Custom SaaS Development"
                description="Turn your idea into a revenue-generating product. Full-cycle development using Laravel and React, focusing on multi-tenancy, subscription billing, and complex data logic."
                tags={['Laravel', 'Livewire', 'Stripe', 'MySQL']}
              />
              <Card 
                icon={Cpu}
                title="Headless Architecture"
                description="Decouple your front-end for lightning-fast performance and omnichannel content delivery. Perfect for brands that need to scale beyond a simple WordPress theme."
                tags={['Next.js', 'GraphQL', 'Vercel', 'Headless WP']}
              />
              <Card 
                icon={Database}
                title="Technical Architecture"
                description="Fractional CTO services for non-technical founders. I help map out your database schema, API strategy, and CI/CD pipelines before a single line of code is written."
                tags={['System Design', 'Consulting', 'AWS', 'Roadmapping']}
              />
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-20 lg:py-32 bg-slate-950 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="HOW WE WORK"
              title="From Concept to Execution."
              subtitle="A proven process that keeps projects on time, on budget, and on strategy."
              center
            />

            <div className="relative">
              {/* Connector line */}
              <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    step: '01',
                    title: 'Discovery',
                    description: 'We start by listening. A deep-dive into your business goals, users, and constraints before any code is considered.',
                    icon: FileText,
                    color: 'text-blue-400',
                    bg: 'bg-blue-900/20 border-blue-800/40',
                  },
                  {
                    step: '02',
                    title: 'Architecture',
                    description: 'We map the system. Database schema, API contracts, infrastructure plan, and tech stack — decided before sprint one.',
                    icon: Layers,
                    color: 'text-indigo-400',
                    bg: 'bg-indigo-900/20 border-indigo-800/40',
                  },
                  {
                    step: '03',
                    title: 'Build & Iterate',
                    description: 'Transparent, sprint-based development with regular demos. You see progress every week, not just at the finish line.',
                    icon: Code,
                    color: 'text-violet-400',
                    bg: 'bg-violet-900/20 border-violet-800/40',
                  },
                  {
                    step: '04',
                    title: 'Launch & Scale',
                    description: 'Deployment, monitoring, and handoff — with documentation your team can actually use. We don\'t disappear at launch.',
                    icon: Server,
                    color: 'text-purple-400',
                    bg: 'bg-purple-900/20 border-purple-800/40',
                  },
                ].map(({ step, title, description, icon: Icon, color, bg }) => (
                  <div key={step} className="relative flex flex-col items-center text-center group">
                    <div className={`relative z-10 w-24 h-24 rounded-2xl border ${bg} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon size={32} className={color} strokeWidth={1.5} />
                      <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold font-mono text-slate-400 flex items-center justify-center">
                        {step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-3">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Selected Work */}
        <section id="work" className="py-20 lg:py-32 bg-slate-900/30 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading 
              badge="CASE STUDIES" 
              title="Engineering in Action"
              subtitle="Real-world examples of complex problems solved through code." 
            />
            
            <div className="space-y-16">
              <ProjectCard 
                title="CropAide"
                role="Founder & Lead Architect"
                description="A data-driven SaaS platform helping agricultural growers make financial decisions based on real-time crop performance. Built from scratch to handle complex calculation engines and subscription management."
                stats={[
                  { value: "SaaS", label: "Business Model" },
                  { value: "100%", label: "Custom Engine" },
                  { value: "Real-time", label: "Data Processing" },
                  { value: "Stripe", label: "Payment Integration" }
                ]}
                stack={['Laravel', 'Tailwind', 'AlpineJS', 'MySQL']}
                imageGradient="bg-gradient-to-br from-green-900/40 to-slate-900"
              />
              
              <ProjectCard 
                title="California Closets"
                role="Lead Developer (Third & Grove)"
                description="Architected the headless rebuild of a national retail brand. Led a team of developers to migrate from legacy systems to a high-performance Next.js front-end powered by GraphQL."
                stats={[
                  { value: "Next.js", label: "Front-End" },
                  { value: "Enterprise", label: "Scale" },
                  { value: "Headless", label: "CMS Structure" },
                  { value: "GraphQL", label: "Data Layer" }
                ]}
                stack={['React', 'Next.js', 'GraphQL', 'Algolia']}
                imageGradient="bg-gradient-to-br from-slate-700 to-slate-900"
              />
            </div>
            
            <div className="mt-16 text-center">
              <Button variant="outline" className="px-8" icon={Github}>
                Review Code on GitHub
              </Button>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section id="philosophy" className="py-20 lg:py-32 bg-slate-950 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-blue-900/5 blur-3xl rounded-l-full"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  The Studio Advantage.
                </h2>
                <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                  <p>
                    <span className="text-blue-400 font-semibold">We're not an agency with a sales team and rotating junior devs.</span> WARD Studio is senior-led, intentionally small, and obsessively focused on craft.
                  </p>
                  <p>
                    Every project is led by a principal engineer from discovery through delivery. No hand-offs, no surprises. We treat your product like we own it, because our reputation depends on it.
                  </p>
                  <p>
                    When you partner with WARD Studio, you aren't just getting code. You're getting a strategic team that cares about the long-term viability of your business.
                  </p>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
                   {[
                     'Agile Methodology',
                     'CI/CD Pipelines',
                     'Automated Testing',
                     'AI-Assisted Development',
                     'Full Code Ownership',
                     'Detailed Documentation',
                   ].map((item) => (
                     <div key={item} className="flex items-center gap-2 text-slate-300">
                       <CheckCircle size={18} className="text-blue-500 flex-shrink-0" />
                       <span>{item}</span>
                     </div>
                   ))}
                </div>
                <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                  We use AI tooling to eliminate boilerplate and accelerate delivery — so our engineers spend their time on the architecture and logic that actually moves your product forward.
                </p>
              </div>
              
              <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-2xl p-8">
                 <h3 className="text-xl font-bold text-white mb-6">Our Stack</h3>
                 
                 <div className="grid grid-cols-4 gap-4">
                    {[
                      { icon: SiLaravel, label: 'Laravel', color: 'text-red-400' },
                      { icon: SiPhp, label: 'PHP', color: 'text-indigo-400' },
                      { icon: SiReact, label: 'React', color: 'text-cyan-400' },
                      { icon: SiNextdotjs, label: 'Next.js', color: 'text-slate-200' },
                      { icon: SiTypescript, label: 'TypeScript', color: 'text-blue-400' },
                      { icon: SiTailwindcss, label: 'Tailwind', color: 'text-teal-400' },
                      { icon: SiGraphql, label: 'GraphQL', color: 'text-pink-400' },
                      { icon: SiMysql, label: 'MySQL', color: 'text-orange-300' },
                      { icon: SiPostgresql, label: 'Postgres', color: 'text-sky-400' },
                      { icon: SiDocker, label: 'Docker', color: 'text-blue-400' },
                      { icon: SiAmazon, label: 'AWS', color: 'text-yellow-400' },
                      { icon: SiVercel, label: 'Vercel', color: 'text-slate-200' },
                      { icon: SiStripe, label: 'Stripe', color: 'text-violet-400' },
                      { icon: SiGit, label: 'Git', color: 'text-orange-400' },
                      { icon: SiWordpress, label: 'WordPress', color: 'text-sky-400' },
                      { icon: SiNodedotjs, label: 'Node.js', color: 'text-green-400' },
                    ].map(({ icon: Icon, label, color }) => (
                      <div key={label} className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/40 hover:bg-slate-800 transition-all duration-200">
                        <Icon size={28} className={`${color} group-hover:scale-110 transition-transform duration-200`} />
                        <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Tool Section */}
        <section className="py-20 bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Not ready to book?</h2>
              <p className="text-slate-400">Use my AI architect tool to scope your idea instantly.</p>
            </div>
            <BlueprintGenerator />
          </div>
        </section>

        {/* Contact / CTA */}
        <section id="contact" className="py-20 lg:py-32 bg-slate-900 border-t border-slate-800">
           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Scale?</h2>
                 <p className="text-xl text-slate-400">Tell us about your vision. We take on a limited number of partner projects per year to ensure every client gets our full attention.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl">
                 <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                          <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                          <input type="email" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@company.com" />
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-slate-400 mb-2">Project Stage</label>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['Just an Idea', 'MVP / Prototype', 'Live Product', 'Enterprise'].map((stage) => (
                             <label key={stage} className="cursor-pointer">
                                <input type="radio" name="stage" className="peer sr-only" />
                                <div className="text-sm text-center px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 peer-checked:bg-blue-900/30 peer-checked:border-blue-500 peer-checked:text-blue-400 hover:border-slate-600 transition-all">
                                   {stage}
                                </div>
                             </label>
                          ))}
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-slate-400 mb-2">Estimated Budget</label>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['<$5k', '$5k - $15k', '$15k - $50k', '$50k+'].map((budget) => (
                             <label key={budget} className="cursor-pointer">
                                <input type="radio" name="budget" className="peer sr-only" />
                                <div className="text-sm text-center px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 peer-checked:bg-blue-900/30 peer-checked:border-blue-500 peer-checked:text-blue-400 hover:border-slate-600 transition-all">
                                   {budget}
                                </div>
                             </label>
                          ))}
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-slate-400 mb-2">Project Details</label>
                       <textarea rows="4" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Tell me about the problem you're solving..."></textarea>
                    </div>

                    <Button variant="primary" className="w-full py-4 text-lg">
                       Submit Application
                    </Button>
                    <p className="text-xs text-center text-slate-500 mt-4">Our team reviews every application and responds within one business day.</p>
                 </form>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
               <span className="font-bold text-xl text-white tracking-tight block mb-2">
                 WARD<span className="text-slate-500 font-normal"> Studio</span>
               </span>
               <p className="text-slate-500 text-sm">© 2026 WARD Studio LLC. All rights reserved.</p>
            </div>
            
            <div className="flex gap-6">
               <a href="#" className="text-slate-500 hover:text-white transition-colors"><Github size={20} /></a>
               <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
               <a href="#" className="text-slate-500 hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
         </div>
      </footer>

    </div>
  );
}

