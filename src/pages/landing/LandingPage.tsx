import React from 'react';
import { 
  motion 
} from 'motion/react';
import { 
  Sprout, CloudSun, TrendingUp, Landmark, 
  LifeBuoy, ShieldCheck, ArrowRight, CheckCircle2, 
  Globe, Sparkles, Layers, Users, Zap, BookOpen, 
  Leaf, Sun, Droplets, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RegionAgriExplorer } from '../../components/recommendations/RegionAgriExplorer';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { switchDemoRole, isAuthenticated } = useAuth();

  const handleQuickDemo = async (role: 'farmer' | 'officer' | 'admin') => {
    await switchDemoRole(role);
    onNavigate('/dashboard');
  };

  const featureCards = [
    {
      title: 'Crop Sowing & Lifecycle Registry',
      desc: 'Track planting dates, calculate harvest windows, and manage irrigation schedules with 1-click regional presets.',
      icon: Sprout,
      color: 'from-emerald-500 to-emerald-700',
      tag: 'Core Management',
      path: '/crops',
    },
    {
      title: 'Hyperlocal Climate & Spray Advisory',
      desc: 'Real-time weather telemetry, precipitation probability, and wind-speed based pesticide application warnings.',
      icon: CloudSun,
      color: 'from-sky-500 to-sky-700',
      tag: 'Weather Engine',
      path: '/weather',
    },
    {
      title: 'Mandi Market Prices & Analytics',
      desc: 'Live commodity spot rates across regional mandis with 30-day interactive price trend visualization.',
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-700',
      tag: 'Price Discovery',
      path: '/market',
    },
    {
      title: 'Government Schemes & Subsidies',
      desc: 'Central & state agricultural support programs, financial grants, PMFBY insurance claims, and paperless filing.',
      icon: Landmark,
      color: 'from-purple-500 to-purple-700',
      tag: 'Direct Benefits',
      path: '/schemes',
    },
    {
      title: 'Expert Officer Assistance Desk',
      desc: 'Connect directly with certified district agriculture officers for pest attack mitigation, soil health, and plant pathology.',
      icon: LifeBuoy,
      color: 'from-rose-500 to-rose-700',
      tag: 'Rapid Triage',
      path: '/assistance',
    },
    {
      title: 'Global Regional Agronomy Protocols',
      desc: 'Scientific crop protection guidelines tailored by country, province, and climate zone for maximum yield efficiency.',
      icon: Globe,
      color: 'from-teal-500 to-teal-700',
      tag: 'Worldwide Agronomy',
      path: '/recommendations',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Floating Mini-Nav */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-emerald-900 dark:text-emerald-400">
                AgroAssist
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 ml-1.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Worldwide
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-3 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-emerald-600 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('/register')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Framer Motion */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Digital Agriculture Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.15]"
            >
              Empowering Farmers Worldwide with{' '}
              <span className="text-emerald-700 dark:text-emerald-400">
                Precision Agronomy & Smart Governance
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed"
            >
              From the paddy deltas of Tamil Nadu to the corn belts of Iowa and the grain fields of Victoria: 
              seamlessly manage crops, monitor hyperlocal weather, track mandi spot rates, access government grants, 
              and resolve pest challenges with agriculture officers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <button
                onClick={() => onNavigate(isAuthenticated ? '/dashboard' : '/login')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sprout className="w-4 h-4" />
                <span>Launch Farmer Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('region-explorer-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Explore Worldwide Regions</span>
              </button>
            </motion.div>

            {/* Quick 1-Click Demo Personas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="pt-4 border-t border-stone-200/60 dark:border-stone-800/80"
            >
              <p className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2">
                1-Click Instant Role Preview:
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => handleQuickDemo('farmer')}
                  className="px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  🌾 Farmer Demo
                </button>
                <button
                  onClick={() => handleQuickDemo('officer')}
                  className="px-3 py-1.5 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 text-xs font-semibold hover:bg-sky-100 transition-colors"
                >
                  🔬 Agriculture Officer Demo
                </button>
                <button
                  onClick={() => handleQuickDemo('admin')}
                  className="px-3 py-1.5 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 transition-colors"
                >
                  🏛️ System Admin Demo
                </button>
              </div>
            </motion.div>
          </div>

          {/* KPI Stat Cards Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-16 max-w-5xl mx-auto">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center shadow-2xs">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">100%</p>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-0.5">Adaptable Globally</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center shadow-2xs">
              <p className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">25+</p>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-0.5">Agronomic Crop Presets</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center shadow-2xs">
              <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">24/7</p>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-0.5">Officer Assistance Triage</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center shadow-2xs">
              <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">Zero</p>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-0.5">Paperwork Direct Schemes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-16 bg-white dark:bg-stone-900/50 border-y border-stone-200/80 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Complete Agricultural Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
              End-to-End Tools for Modern Farming
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2">
              Everything farmers and agricultural extension officers need in a unified, accessible workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                  onClick={() => onNavigate(f.path)}
                  className="p-6 rounded-3xl bg-stone-50/80 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/40 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-xs`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {f.tag}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-stone-900 dark:text-white mb-1.5">
                      {f.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <span>Explore Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Region-Based Agriculture System Section */}
      <section id="region-explorer-section" className="py-16 bg-stone-50 dark:bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Worldwide Agricultural Adaptation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
              Dynamic Region-Based Farming System
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2">
              Select any country, province, and agro-climatic district below to view benchmark crops, seasonal calendars, and agronomic guidelines.
            </p>
          </div>

          {/* Interactive RegionAgriExplorer Component */}
          <RegionAgriExplorer standalone={true} />
        </div>
      </section>

      {/* Roles & Security Architecture */}
      <section className="py-16 bg-white dark:bg-stone-900 border-t border-stone-200/80 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Role-Based Access Control
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
              Tailored Experiences for Every Stakeholder
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold mb-4">
                🌾
              </div>
              <h3 className="font-bold text-base text-stone-900 dark:text-white mb-2">
                Farmer Workspace
              </h3>
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Register and monitor crop sowing & harvest milestones</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Receive precipitation and spray timing alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Track nearby mandi modal rates and historical charts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>File support tickets for pest attack triage</span>
                </li>
              </ul>
              <button
                onClick={() => handleQuickDemo('farmer')}
                className="mt-6 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
              >
                Log In as Farmer
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400 flex items-center justify-center font-bold mb-4">
                🔬
              </div>
              <h3 className="font-bold text-base text-stone-900 dark:text-white mb-2">
                Agriculture Officer
              </h3>
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Review district-wide crop health and pest outbreaks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Diagnose tickets with chemical & bio recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Broadcast meteorological emergency alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Verify PMFBY and state grant subsidy claims</span>
                </li>
              </ul>
              <button
                onClick={() => handleQuickDemo('officer')}
                className="mt-6 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors"
              >
                Log In as Officer
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center font-bold mb-4">
                🏛️
              </div>
              <h3 className="font-bold text-base text-stone-900 dark:text-white mb-2">
                System Administrator
              </h3>
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Monitor national crop registries and acreage metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Manage officer assignments and farmer account directory</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Publish new government subsidy schemes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>System audit logs and platform security controls</span>
                </li>
              </ul>
              <button
                onClick={() => handleQuickDemo('admin')}
                className="mt-6 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors"
              >
                Log In as Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Accelerate Agricultural Productivity?
          </h2>
          <p className="text-sm sm:text-base text-emerald-200 max-w-2xl mx-auto">
            Join thousands of farmers, officers, and agricultural institutions leveraging AgroAssist for smarter crop decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-white text-emerald-900 hover:bg-emerald-50 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-700 transition-all flex items-center justify-center"
            >
              <span>Sign In to Existing Account</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
