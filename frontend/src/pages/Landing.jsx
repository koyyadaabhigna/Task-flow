import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

const featureItems = [
  {
    title: 'Smart Task Organization',
    description: 'Group, filter, and automate work with intelligent task workflows and visual boards.',
    Icon: CheckCircle2,
  },
  {
    title: 'Priority Management',
    description: 'Assign priorities, stay focused on what matters, and remove decision fatigue from every day.',
    Icon: Sparkles,
  },
  {
    title: 'Real-time Updates',
    description: 'See project changes instantly with live activity feeds and team-sync notifications.',
    Icon: Activity,
  },
  {
    title: 'Team Collaboration',
    description: 'Share updates, assign tasks, and coordinate every deliverable from one central hub.',
    Icon: Users,
  },
  {
    title: 'Progress Tracking',
    description: 'Track milestones, view burn down charts, and measure progress at a glance.',
    Icon: BarChart3,
  },
  {
    title: 'Secure & Private',
    description: 'Enterprise-grade security, encrypted data, and privacy controls for your team.',
    Icon: ShieldCheck,
  },
];

const testimonialItems = [
  {
    name: 'Avery Morgan',
    role: 'Product Lead',
    copy: 'TaskFlow turned our workflow into something truly effortless. The real-time updates and priority views keep the whole team in sync.',
    accent: 'indigo',
  },
  {
    name: 'Jordan Lee',
    role: 'Operations Manager',
    copy: 'The interface feels premium and the team collaboration tools are fantastic. We launched faster and never lost track of priorities.',
    accent: 'cyan',
  },
  {
    name: 'Sofia Grant',
    role: 'Marketing Director',
    copy: 'TaskFlow helps us cut through the noise. The dashboard preview and task automation save us hours every week.',
    accent: 'rose',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    frequency: null,
    details: ['Up to 5 projects', 'Basic task boards', 'Team chat'],
    buttonText: 'Start Free',
  },
  {
    name: 'Pro',
    price: '$9',
    frequency: '/mo',
    details: ['Unlimited projects', 'Priority workflows', 'Real-time sync'],
    buttonText: 'Choose Pro',
    featured: true,
  },
  {
    name: 'Team',
    price: '$29',
    frequency: '/mo',
    details: ['Team permissions', 'Advanced reporting', 'Priority support'],
    buttonText: 'Get Team',
  },
];

const Landing = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const fadeRefs = useRef([]);
  const counterRefs = useRef([]);

  const addFadeRef = useCallback((node) => {
    if (node && !fadeRefs.current.includes(node)) {
      fadeRefs.current.push(node);
    }
  }, []);

  const addCounterRef = useCallback((node) => {
    if (node && !counterRefs.current.includes(node)) {
      counterRefs.current.push(node);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-5');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    fadeRefs.current.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const target = parseFloat(element.dataset.target || '0');
            let current = 0;
            const steps = 60;
            const duration = 1200;
            const increment = target / steps;
            const decimals = String(target).includes('.') ? 1 : 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              element.textContent = target >= 1000 ? Math.round(current).toLocaleString() : current.toFixed(decimals);
            }, duration / steps);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.3 },
    );

    counterRefs.current.forEach((counter) => {
      observer.observe(counter);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative overflow-x-hidden bg-[#07070f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_16%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.2),_transparent_18%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-bold text-slate-950 shadow-[0_30px_80px_rgba(99,102,241,0.32)]">
              TF
            </div>
            <span className="text-lg font-semibold tracking-tight">TaskFlow</span>
          </Link>

          <nav className="hidden items-center gap-8 text-slate-300 lg:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <a href="#about" className="transition hover:text-white">About</a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/login" className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-white">
              Sign In
            </Link>
            <Link to="/register" className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-105">
              Get Started Free
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-full border border-slate-700 p-3 text-slate-300 transition hover:border-cyan-300 hover:text-white lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden">
            <div className="mx-6 mb-4 rounded-3xl border border-slate-700/80 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-slate-200 transition hover:text-white">
                  Features
                </a>
                <a href="#pricing" className="text-slate-200 transition hover:text-white">
                  Pricing
                </a>
                <a href="#about" className="text-slate-200 transition hover:text-white">
                  About
                </a>
                <Link
                  to="/login"
                  className="rounded-full border border-slate-700 px-5 py-3 text-center text-slate-200 transition hover:border-cyan-300 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-3 text-center font-semibold text-slate-950"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="home" className="relative overflow-hidden">
        <section className="relative overflow-hidden px-6 py-16 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.25),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.18),_transparent_22%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-1 lg:items-center">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-sm text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
                <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                Built for modern teams and fast-moving product squads
              </div>

              <div className="space-y-6">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Organize Your Work, <span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">Amplify Your Focus</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
                  TaskFlow gives your team a premium workspace for task planning, real-time progress updates, and priority-driven execution—all in one sleek, secure dashboard.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-8 py-4 text-base font-semibold text-slate-950 transition hover:brightness-105"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-white/5 px-8 py-4 text-base font-semibold text-slate-100 transition hover:border-cyan-300 hover:text-white"
                >
                  Watch Demo
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-center">
                  <p className="text-3xl font-semibold text-cyan-300">10K+</p>
                  <p className="mt-2 text-sm text-slate-400">Active users</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-center">
                  <p className="text-3xl font-semibold text-indigo-400">50K+</p>
                  <p className="mt-2 text-sm text-slate-400">Tasks completed</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-center">
                  <p className="text-3xl font-semibold text-emerald-400">99.9%</p>
                  <p className="mt-2 text-sm text-slate-400">Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={addFadeRef} id="features" className="opacity-0 translate-y-5 px-6 py-20 transition duration-700 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl">
              <span className="text-xs uppercase tracking-[0.35em] text-cyan-300">Packed with premium tools</span>
              <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Everything your team needs to stay ahead.</h2>
              <p className="mt-4 text-slate-400">Six powerful modules designed to simplify task management and keep your entire organization aligned.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {featureItems.map(({ title, description, Icon }) => (
                <article key={title} className="rounded-[2rem] border border-slate-700/70 bg-slate-950/80 p-8 backdrop-blur-xl">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-300 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-slate-400">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section ref={addFadeRef} id="about" className="opacity-0 translate-y-5 border-t border-slate-800/80 px-6 py-20 transition duration-700 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="rounded-[2rem] bg-slate-950/80 p-10 text-white shadow-[0_30px_90px_rgba(0,0,0,0.3)]">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">How it works</p>
                <h2 className="mt-6 text-4xl font-semibold">From signup to streamlined workflows in minutes.</h2>
                <p className="mt-4 text-slate-400">A simple, polished experience designed to help busy teams move faster without missing a beat.</p>
              </div>
              <div className="space-y-6">
                {['Create an account', 'Add your tasks', 'Stay organized'].map((step, index) => (
                  <div key={step} className="rounded-[2rem] border border-slate-700/70 bg-slate-950/80 p-8">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[rgba(99,102,241,0.1)] text-indigo-300">{index + 1}</div>
                    <h3 className="text-xl font-semibold text-white">{step}</h3>
                    <p className="mt-3 text-slate-400">
                      {index === 0 && 'Sign up in seconds and launch your workspace with zero setup friction.'}
                      {index === 1 && 'Organize every project, deadline, and priority in one flexible task board.'}
                      {index === 2 && 'Track team progress, collaborate instantly, and keep deliverables on schedule.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section ref={addFadeRef} className="opacity-0 translate-y-5 px-6 py-20 transition duration-700 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-slate-700/80 bg-slate-950/80 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.28)] lg:grid-cols-4">
            {[
              { label: 'Users', target: '10000', color: 'text-cyan-300' },
              { label: 'Tasks Completed', target: '50000', color: 'text-indigo-300' },
              { label: 'Uptime', target: '99.9', color: 'text-emerald-300' },
              { label: 'Rating', target: '4.9', color: 'text-rose-300' },
            ].map(({ label, target, color }) => (
              <div key={label} className="space-y-3">
                <p
                  ref={addCounterRef}
                  data-target={target}
                  className={`text-3xl font-semibold ${color}`}
                >
                  0
                </p>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section ref={addFadeRef} className="opacity-0 translate-y-5 px-6 py-20 transition duration-700 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-700/70 bg-slate-950/80 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-cyan-300">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Trusted</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Modern workflow intelligence</h3>
              <p className="mt-3 text-slate-400">Designed for teams that demand speed, clarity, and beautiful productivity tools.</p>
            </div>
            <div className="rounded-[2rem] bg-gradient-to-br from-indigo-500/15 via-slate-950 to-cyan-500/10 p-8 shadow-[0_30px_90px_rgba(34,211,238,0.12)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-500/20 text-cyan-300">
                <Sparkles className="h-7 w-7" />
              </div>
              <p className="text-sm uppercase tracking-[0.35em] text-rose-300">Customer love</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Sleek teamwork without the clutter</h3>
              <p className="mt-3 text-slate-400">A polished experience that feels premium from the moment your team signs in.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-700/70 bg-slate-950/80 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-400/20 text-cyan-300">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Built secure</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Privacy and control</h3>
              <p className="mt-3 text-slate-400">Keep your data protected with encrypted workspaces and role-based access.</p>
            </div>
          </div>
        </section>

        <section ref={addFadeRef} className="opacity-0 translate-y-5 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_22%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.12),_transparent_20%)] px-6 py-20 transition duration-700 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-4xl font-semibold text-white sm:text-5xl">What customers are saying</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonialItems.map(({ name, role, copy, accent }) => (
                <article
                  key={name}
                  className={`rounded-[2rem] border border-slate-700/70 bg-slate-950/80 p-8 ${accent === 'cyan' ? 'bg-gradient-to-br from-slate-950/80 to-cyan-950/70 border-cyan-300/20' : ''}`}
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold ${
                        accent === 'indigo' ? 'bg-indigo-500/15 text-indigo-300' : accent === 'cyan' ? 'bg-cyan-400/15 text-cyan-300' : 'bg-rose-400/15 text-rose-300'
                      }`}
                    >
                      {name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{name}</p>
                      <p className="text-sm text-slate-400">{role}</p>
                    </div>
                  </div>
                  <p className="text-slate-300">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section ref={addFadeRef} id="pricing" className="opacity-0 translate-y-5 px-6 py-20 transition duration-700 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <span className="text-xs uppercase tracking-[0.35em] text-cyan-300">Pricing plans</span>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Simple pricing for every team.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">Get unlimited users, collaboration features, and powerful insights with a plan that fits your growth.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[2rem] p-8 ${plan.featured ? 'relative overflow-hidden border border-cyan-300 bg-gradient-to-br from-indigo-500/10 via-slate-950 to-cyan-400/10 shadow-[0_40px_120px_rgba(34,211,238,0.12)]' : 'border border-slate-700/70 bg-slate-950/80'}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">{plan.name}</p>
                </div>
                <h3 className="mt-6 text-3xl font-semibold text-white">
                  {plan.price}
                  {plan.frequency && <span className="text-base font-medium text-slate-400">{plan.frequency}</span>}
                </h3>
                <p className="mt-2 text-sm text-slate-300">{plan.name === 'Free' ? 'For individuals getting started' : plan.name === 'Pro' ? 'Best for growing teams who need speed and visibility.' : 'Perfect for collaborative teams and full-scale execution.'}</p>
                <ul className="mt-8 space-y-4 text-slate-400">
                  {plan.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`mt-10 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${plan.featured ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 hover:brightness-110' : 'border border-slate-700 text-white hover:border-cyan-300 hover:bg-slate-900/90'}`}
                >
                  {plan.buttonText}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section ref={addFadeRef} className="opacity-0 translate-y-5 px-6 py-24 transition duration-700 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 rounded-[2rem] border border-cyan-300/20 bg-gradient-to-r from-indigo-500/10 via-slate-950/90 to-cyan-500/10 p-10 text-center shadow-[0_40px_90px_rgba(34,211,238,0.12)] lg:flex-row lg:text-left">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Start organizing today</p>
              <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Everything your team needs to ship faster and stay focused.</h2>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-8 py-4 text-base font-semibold text-slate-950 transition hover:brightness-105"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:border-cyan-300 hover:text-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/90 px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-bold text-slate-950">
              TF
            </div>
            <div>
              <p className="font-semibold">TaskFlow</p>
              <p className="text-sm text-slate-400">Premium task management for modern teams.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <a href="#about" className="transition hover:text-white">About</a>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-slate-500">© 2026 TaskFlow. Crafted for high-performing teams.</p>
      </footer>
    </div>
  );
};

export default Landing;
