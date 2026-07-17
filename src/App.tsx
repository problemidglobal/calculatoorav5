import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Briefcase, 
  Percent, 
  Heart, 
  Activity, 
  GraduationCap, 
  Compass, 
  Cpu, 
  Terminal, 
  Calendar, 
  Search, 
  ArrowRight, 
  Lock, 
  Check, 
  ChevronRight, 
  RefreshCw,
  Sparkles,
  TrendingUp,
  FileText,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  Flower,
  Wrench,
  Hammer,
  Factory,
  ShoppingBag,
  Utensils,
  Building,
  Truck,
  Sprout,
  Globe,
  Scale,
  BookOpen,
  MessageSquare,
  Database,
  Shield,
  Gamepad2,
  Trophy,
  Shirt,
  ShieldAlert,
  FileCheck,
  Timer,
  Coins,
  Smartphone,
  Server,
  Camera,
  Video,
  Music,
  Zap,
  Leaf,
  Car,
  UserCheck,
  Orbit,
  CloudRain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CalculatorCard from './components/CalculatorCard';
import SponsorSpace from './components/SponsorSpace';
import Loader from './components/Loader';
import { CATEGORIES, CALCULATORS } from './data/calculatorsPool';
import { CategoryType, Calculator } from './types';
import { CATEGORY_SEO_DATA } from './data/v8CategorySeo';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? 'dark' : 'light';
  });

  // State router path: 'home' | 'categories' | 'all-calculators' | 'search' | 'about' | 'privacy' | 'terms' | 'category:{id}' | 'calculator:{slug}'
  const [page, setPage] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedCalcSlug, setSelectedCalcSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Decoupled category landing page states for rich search-filtering & FAQ interactivity
  const [catSearchQuery, setCatSearchQuery] = useState<string>('');
  const [catActiveFilter, setCatActiveFilter] = useState<'all' | 'base' | 'region' | 'profession'>('all');
  const [catSelectedFAQIndex, setCatSelectedFAQIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Helper effect to cleanly reset query parameters when changing categories
  useEffect(() => {
    setCatSearchQuery('');
    setCatActiveFilter('all');
    setCatSelectedFAQIndex(null);
    setVisibleCount(12);
  }, [selectedCategory]);

  // Synchronize path and theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync hash changes so back/forward browser buttons work!
  useEffect(() => {
    const handleHashChange = () => {
      setLoading(true);
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        if (!hash || hash === '#/') {
          setPage('home');
          setLoading(false);
          return;
        }

        const paths = hash.replace('#/', '').split('/');
        const rawSection = paths[0];

        if (rawSection === 'calculators') {
          if (paths[1]) {
            const calc = CALCULATORS.find(c => c.slug === paths[1]);
            if (calc) {
              setSelectedCalcSlug(calc.slug);
              setPage(`calculator:${calc.slug}`);
            } else {
              setPage('404');
            }
          } else {
            setPage('all-calculators');
          }
          setLoading(false);
          return;
        }

        // Match both raw id (e.g. "finance") and SEO-landing (e.g. "finance-calculators")
        const isCategoryLanding = rawSection.endsWith('-calculators') || 
          CATEGORIES.some(c => c.id === rawSection);
        const section = isCategoryLanding ? rawSection.replace('-calculators', '') : rawSection;

        if (section === 'categories') {
          setPage('categories');
        } else if (section === 'all-calculators') {
          setPage('all-calculators');
        } else if (section === 'search') {
          setPage('search');
        } else if (section === 'about') {
          setPage('about');
        } else if (section === 'privacy') {
          setPage('privacy');
        } else if (section === 'terms') {
          setPage('terms');
        } else if (isCategoryLanding && CATEGORIES.some(c => c.id === section)) {
          setSelectedCategory(section as CategoryType);
          if (paths[1]) {
            const calc = CALCULATORS.find(c => c.slug === paths[1]);
            if (calc) {
              setSelectedCalcSlug(calc.slug);
              setPage(`calculator:${calc.slug}`);
            } else {
              setPage('404');
            }
          } else {
            setPage(`category-landing:${section}`);
          }
        } else if (CATEGORIES.some(c => c.id === section)) {
          setSelectedCategory(section as CategoryType);
          if (paths[1]) {
            const calc = CALCULATORS.find(c => c.slug === paths[1]);
            if (calc) {
              setSelectedCalcSlug(calc.slug);
              setPage(`calculator:${calc.slug}`);
            } else {
              setPage('404');
            }
          } else {
            setPage(`category:${section}`);
          }
        } else {
          const calc = CALCULATORS.find(c => c.slug === rawSection);
          if (calc) {
            setSelectedCalcSlug(calc.slug);
            setPage(`calculator:${calc.slug}`);
          } else {
            setPage('404');
          }
        }
        setLoading(false);
      }, 250); // Fast, snappy, ultra-responsive loading simulation

      return () => clearTimeout(timer);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (targetPage: string) => {
    if (targetPage === 'home') {
      window.location.hash = '#/';
    } else if (targetPage === 'categories') {
      window.location.hash = '#/categories';
    } else if (targetPage === 'all-calculators') {
      window.location.hash = '#/all-calculators';
    } else if (targetPage === 'search') {
      window.location.hash = '#/search';
    } else if (targetPage === 'about') {
      window.location.hash = '#/about';
    } else if (targetPage === 'privacy') {
      window.location.hash = '#/privacy';
    } else if (targetPage === 'terms') {
      window.location.hash = '#/terms';
    } else if (targetPage.startsWith('category:')) {
      const id = targetPage.replace('category:', '');
      const hasLanding = ['finance', 'health', 'math', 'business', 'science', 'programming', 'engineering', 'construction'].includes(id);
      window.location.hash = hasLanding ? `#/${id}-calculators` : `#/${id}`;
    } else if (targetPage.startsWith('category-landing:')) {
      const id = targetPage.replace('category-landing:', '');
      window.location.hash = `#/${id}-calculators`;
    } else if (targetPage.startsWith('calculator:')) {
      const slug = targetPage.replace('calculator:', '');
      const calc = CALCULATORS.find(c => c.slug === slug);
      if (calc) {
        if (slug === 'car-loan-calculator') {
          window.location.hash = `#/calculators/car-loan-calculator`;
        } else if (slug === 'age-calculator') {
          window.location.hash = `#/calculators/age-calculator`;
        } else if (slug === 'paycheck-calculator') {
          window.location.hash = `#/calculators/paycheck-calculator`;
        } else if (slug === 'cumulative-interest-calculator') {
          window.location.hash = `#/calculators/cumulative-interest-calculator`;
        } else if (slug === 'graphing-calculator') {
          window.location.hash = `#/calculators/graphing-calculator`;
        } else if (slug === 'gpa-calculator') {
          window.location.hash = `#/calculators/gpa-calculator`;
        } else {
          window.location.hash = `#/${calc.category}/${calc.slug}`;
        }
      }
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign': return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'Percent': return <Percent className="w-5 h-5 text-violet-500" />;
      case 'Heart': return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Activity': return <Activity className="w-5 h-5 text-cyan-500" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-amber-500" />;
      case 'Compass': return <Compass className="w-5 h-5 text-teal-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-indigo-500" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-cyan-500" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-violet-500" />;
      case 'FileText': return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5 text-sky-500" />;
      case 'Flower': return <Flower className="w-5 h-5 text-green-500" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-orange-500" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-amber-500" />;
      case 'Factory': return <Factory className="w-5 h-5 text-slate-500" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-indigo-500" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-orange-500" />;
      case 'Building': return <Building className="w-5 h-5 text-emerald-500" />;
      case 'Truck': return <Truck className="w-5 h-5 text-sky-500" />;
      case 'Sprout': return <Sprout className="w-5 h-5 text-green-500" />;
      case 'Globe': return <Globe className="w-5 h-5 text-blue-500" />;
      case 'Scale': return <Scale className="w-5 h-5 text-violet-500" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-emerald-500" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-rose-500" />;
      case 'Database': return <Database className="w-5 h-5 text-cyan-500" />;
      case 'Shield': return <Shield className="w-5 h-5 text-red-500" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-orange-500" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'Shirt': return <Shirt className="w-5 h-5 text-fuchsia-500" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'FileCheck': return <FileCheck className="w-5 h-5 text-sky-500" />;
      case 'Timer': return <Timer className="w-5 h-5 text-indigo-500" />;
      case 'Coins': return <Coins className="w-5 h-5 text-yellow-500" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-cyan-500" />;
      case 'Server': return <Server className="w-5 h-5 text-indigo-500" />;
      case 'Camera': return <Camera className="w-5 h-5 text-violet-500" />;
      case 'Video': return <Video className="w-5 h-5 text-rose-500" />;
      case 'Music': return <Music className="w-5 h-5 text-fuchsia-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-lime-500" />;
      case 'Leaf': return <Leaf className="w-5 h-5 text-green-500" />;
      case 'Car': return <Car className="w-5 h-5 text-orange-500" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-amber-500" />;
      case 'Orbit': return <Orbit className="w-5 h-5 text-indigo-500" />;
      case 'CloudRain': return <CloudRain className="w-5 h-5 text-sky-500" />;
      default: return <Percent className="w-5 h-5 text-blue-500" />;
    }
  };

  // Resolve current active calculator if on calculator page
  const activeCalc = CALCULATORS.find(c => c.slug === selectedCalcSlug);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-800 dark:text-neutral-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 relative overflow-hidden">
      
      {/* Top Floating Glow Light for Frosted Glass Theme */}
      <div className="absolute top-0 left-0 w-full h-[320px] bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent pointer-events-none z-0" />
      
      {/* Premium Screen Loader Overlay */}
      <AnimatePresence>
        {loading && <Loader />}
      </AnimatePresence>

      {/* Styled Glassmorphic Floating Header */}
      <Navbar 
        currentTheme={theme} 
        onToggleTheme={() => setTheme(p => p === 'light' ? 'dark' : 'light')} 
        onNavigate={handleNavigate}
        currentPage={page}
      />

      {/* Main Container - Wraps all routes in smooth page reveals */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* ==================== HOMEPAGE LAYOUT ==================== */}
          {page === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              {/* Top Wide Banner Ad Slot */}
              <SponsorSpace position="top-banner" />

              {/* Dynamic Search Hero Section */}
              <Hero onSelectCalculator={(slug) => handleNavigate(`calculator:${slug}`)} />

              {/* Grid of 10 Core Categories */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="categories-section">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
                      Browse Categories
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Explore our comprehensive collections of business, math, and daily tools
                    </p>
                  </div>
                  <button 
                    onClick={() => handleNavigate('categories')}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition cursor-pointer"
                  >
                    See all categories <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {CATEGORIES.map((cat, idx) => (
                    <motion.button
                      key={cat.id}
                      onClick={() => handleNavigate(`category:${cat.id}`)}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.4, delay: Math.min(0.2, idx * 0.04) }}
                      whileHover={{ y: -6, scale: 1.025, boxShadow: '0 12px 30px rgba(0, 240, 255, 0.12)' }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative rounded-3xl border border-white/50 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md p-5 text-left hover:border-blue-500 dark:hover:border-cyan-400 transition-all overflow-hidden cursor-pointer"
                    >
                      {/* Hover Glow Light Bar */}
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center mb-4 transition-all group-hover:scale-105 group-hover:bg-blue-500/10">
                        {getCategoryIcon(cat.icon)}
                      </div>
                      
                      <h3 className="font-extrabold text-sm text-neutral-950 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 line-clamp-2">
                        {cat.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Popular/Trending Dynamic Estimators */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="popular-section">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-cyan-400 animate-ping inline-block" />
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
                    Popular &amp; Trending Tools
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CALCULATORS.slice(0, 6).map((calc, idx) => (
                    <motion.div
                      key={calc.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.45, delay: Math.min(0.25, idx * 0.05) }}
                      whileHover={{ y: -6, scale: 1.015, boxShadow: '0 15px 35px rgba(0, 240, 255, 0.08)' }}
                      className="group rounded-3xl border border-white/50 dark:border-neutral-800/65 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-md p-6 flex flex-col justify-between hover:border-blue-500 dark:hover:border-cyan-400 transition-all shadow-xl"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
                            {calc.category}
                          </span>
                          <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-bold tracking-widest font-mono">
                            ACCURATE
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-300 transition-colors">
                          {calc.name}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                          {calc.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-900 flex justify-between items-center">
                        <span className="text-[10px] text-neutral-400 font-mono tracking-wider">
                          Ready in browser
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleNavigate(`calculator:${calc.slug}`)}
                          className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 dark:bg-neutral-800 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer hover:shadow-[0_4px_12px_rgba(0,240,255,0.2)]"
                        >
                          Activate <ArrowRight className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Recently Added Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="recently-added-section">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 dark:bg-fuchsia-450 animate-pulse inline-block" />
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
                    Recently Added (V22 Suite)
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CALCULATORS.slice(-6).map((calc, idx) => (
                    <motion.div
                      key={calc.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.45, delay: Math.min(0.25, idx * 0.05) }}
                      whileHover={{ y: -6, scale: 1.015, boxShadow: '0 15px 35px rgba(236, 72, 153, 0.08)' }}
                      className="group rounded-3xl border border-pink-500/10 dark:border-pink-500/15 bg-white/75 dark:bg-neutral-900/40 backdrop-blur-md p-6 flex flex-col justify-between hover:border-pink-500 dark:hover:border-pink-400 transition-all shadow-xl"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/5 text-pink-600 dark:text-pink-400 uppercase tracking-wider font-mono">
                            {calc.category}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-[4px] text-[8px] font-extrabold text-white bg-pink-500 dark:bg-pink-600 tracking-wider font-mono uppercase animate-pulse">
                            NEW
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-300 transition-colors">
                          {calc.name}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed truncate-2-lines">
                          {calc.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-900 flex justify-between items-center">
                        <span className="text-[10px] text-neutral-400 font-mono tracking-wider">
                          V22 Standard
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleNavigate(`calculator:${calc.slug}`)}
                          className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-gradient-to-r hover:from-pink-600 hover:to-pink-400 dark:bg-neutral-800 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer hover:shadow-[0_4px_12px_rgba(236,72,153,0.2)]"
                        >
                          Launch <ArrowRight className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ==================== CATEGORIES OVERVIEW PAGE ==================== */}
          {page === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 dark:text-white mb-2">
                System Categories
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-2xl text-sm leading-relaxed">
                Browse our diverse mathematical portfolio sorted across 10 functional divisions. Locate financial tables, physical calculations, health matrices, and scheduling estimators.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CATEGORIES.map((cat, idx) => {
                  const count = CALCULATORS.filter(c => c.category === cat.id).length;
                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-25px' }}
                      transition={{ duration: 0.4, delay: Math.min(0.2, idx * 0.05) }}
                      whileHover={{ y: -4, scale: 1.01, boxShadow: '0 12px 30px rgba(0, 240, 255, 0.06)' }}
                      className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:border-blue-500 dark:hover:border-cyan-400 transition-all duration-300"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                          {getCategoryIcon(cat.icon)}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-neutral-950 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                            {cat.name}
                          </h2>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 lines-clamp-2">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleNavigate(`category:${cat.id}`)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 dark:bg-neutral-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Browse {count} tools <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ==================== DYNAMIC ALL CALCULATORS DIRECTORY ==================== */}
          {page === 'all-calculators' && (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 dark:text-white mb-2">
                All Available Calculators
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-2xl text-sm">
                Full directory of our pre-built high-accuracy interactive calculators.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {CALCULATORS.map((calc, idx) => (
                  <motion.div
                    key={calc.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.4, delay: Math.min(0.2, idx * 0.03) }}
                    whileHover={{ y: -4, scale: 1.02, boxShadow: '0 12px 30px rgba(0, 240, 255, 0.05)' }}
                    className="rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md p-5 flex flex-col justify-between hover:border-blue-500 dark:hover:border-cyan-400 transition-all"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-neutral-100 dark:bg-neutral-900 text-neutral-500 uppercase tracking-widest font-mono">
                        {calc.category}
                      </span>
                      <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white mt-3">
                        {calc.name}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {calc.description}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigate(`calculator:${calc.slug}`)}
                      className="w-full mt-4 py-2.5 bg-neutral-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 hover:text-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-bold transition text-center cursor-pointer"
                    >
                      Open Calculator
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==================== CATEGORY SEARCH-FIRST SEO LANDING PAGES ==================== */}
          {page.startsWith('category-landing:') && (
            <motion.div
              key="cat-landing"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12"
            >
              {/* Main Landing Page Header Banner info */}
              {(() => {
                const categoryId = page.replace('category-landing:', '');
                const matchedCategory = CATEGORIES.find(c => c.id === categoryId);
                const seoDetail = CATEGORY_SEO_DATA[categoryId] || {
                  id: categoryId as CategoryType,
                  seoTitle: `${matchedCategory?.name || categoryId} Calculators | Calculatoora`,
                  seoHeading: `Premium ${matchedCategory?.name || categoryId} Calculators`,
                  seoSubtitle: matchedCategory?.description || 'Free interactive calculation utilities.',
                  paragraphs: [
                    'Our comprehensive interactive computational engines deliver high-precision results for daily mathematical validation, and modeling.',
                    'Optimized mathematically to compute complex inputs securely inside your primary web browser client-side.'
                  ],
                  faqs: [
                    {
                      question: 'How are the scientific calculations calculated?',
                      answer: 'All numerical products are calculated in real-time in your browser based on industry standard algorithms and formulas.'
                    }
                  ]
                };

                // Filter calculators by category and map search/filtering states!
                const categoryCalculators = CALCULATORS.filter(c => c.category === categoryId);

                const countAll = categoryCalculators.length;
                const countBase = categoryCalculators.filter(c => !c.slug.includes('-us') && !c.slug.includes('-uk') && !c.slug.includes('-ca') && !c.slug.includes('-au') && !c.slug.includes('-in') && !c.slug.includes('-eu')).length;
                const countRegion = categoryCalculators.filter(c => c.slug.includes('-us') || c.slug.includes('-uk') || c.slug.includes('-ca') || c.slug.includes('-au') || c.slug.includes('-in') || c.slug.includes('-eu')).length;
                const countProfession = categoryCalculators.filter(c => c.slug.includes('freelancer') || c.slug.includes('contractor') || c.slug.includes('doctor') || c.slug.includes('student') || c.slug.includes('veteran') || c.slug.includes('business') || c.slug.includes('senior') || c.slug.includes('teacher')).length;

                // Apply active subcategory filters
                let filteredCalculators = categoryCalculators;
                if (catActiveFilter === 'base') {
                  filteredCalculators = categoryCalculators.filter(c => !c.slug.includes('-us') && !c.slug.includes('-uk') && !c.slug.includes('-ca') && !c.slug.includes('-au') && !c.slug.includes('-in') && !c.slug.includes('-eu'));
                } else if (catActiveFilter === 'region') {
                  filteredCalculators = categoryCalculators.filter(c => c.slug.includes('-us') || c.slug.includes('-uk') || c.slug.includes('-ca') || c.slug.includes('-au') || c.slug.includes('-in') || c.slug.includes('-eu'));
                } else if (catActiveFilter === 'profession') {
                  filteredCalculators = categoryCalculators.filter(c => c.slug.includes('freelancer') || c.slug.includes('contractor') || c.slug.includes('doctor') || c.slug.includes('student') || c.slug.includes('veteran') || c.slug.includes('business') || c.slug.includes('senior') || c.slug.includes('teacher'));
                }

                // Apply interactive text search query
                if (catSearchQuery) {
                  const query = catSearchQuery.toLowerCase();
                  filteredCalculators = filteredCalculators.filter(c => 
                    c.name.toLowerCase().includes(query) || 
                    c.description.toLowerCase().includes(query) ||
                    ((c as any).keywords && (c as any).keywords.some((k: string) => k.toLowerCase().includes(query)))
                  );
                }

                return (
                  <>
                    {/* SEO Landing Hero Header with rich layout and dark glassmorphic accent */}
                    <div className="relative rounded-3xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/60 bg-gradient-to-br from-blue-600/5 via-cyan-500/5 to-transparent p-8 sm:p-12 mb-8">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="max-w-3xl space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 font-mono uppercase tracking-widest">
                          {matchedCategory?.name || categoryId} Ecosystem
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white tracking-tight leading-tight">
                          {seoDetail.seoHeading}
                        </h1>
                        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-medium">
                          {seoDetail.seoSubtitle}
                        </p>
                      </div>

                      {/* Display key advantages grid as required */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-neutral-200/60 dark:border-neutral-800/60">
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 text-blue-600 dark:text-cyan-400 text-[10px] font-bold text-center leading-5 font-mono">✓</div>
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Pure Client-side Calculation</h4>
                            <p className="text-[11px] text-neutral-500">Inputs and outputs are strictly private nearby you.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 text-blue-600 dark:text-cyan-400 text-[10px] font-bold text-center leading-5 font-mono">✓</div>
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Compliant Equations</h4>
                            <p className="text-[11px] text-neutral-500">Uses standard formulas verified programmatically.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 text-blue-600 dark:text-cyan-400 text-[10px] font-bold text-center leading-5 font-mono">✓</div>
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Mobile Ready Inputs</h4>
                            <p className="text-[11px] text-neutral-500">Tap, slide, or type with fluid slider parameters.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Highly Targeted SEO Paragraph Blocks for Search Intent Valuation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      <div className="space-y-4">
                        <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                          Why compute using Calculatoora's interactive engines?
                        </h3>
                        <p>{seoDetail.paragraphs[0]}</p>
                        {seoDetail.paragraphs[2] && <p>{seoDetail.paragraphs[2]}</p>}
                      </div>
                      <div className="bg-neutral-50 dark:bg-neutral-900/20 rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-800/40 space-y-4">
                        <h4 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider font-mono">
                          Computational Specifications
                        </h4>
                        <p className="text-xs">{seoDetail.paragraphs[1]}</p>
                        <div className="text-xs space-y-2 mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/40">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Execution Timeout:</span>
                            <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold font-mono">0ms (Immediate)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Encryption Method:</span>
                            <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold font-mono">Local-Only Memory Sandbox</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Precision Standard:</span>
                            <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold font-mono">IEEE 754 Floating-Point</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sponsor Space Widget */}
                    <SponsorSpace position="in-between" />

                    {/* Interactive Intelligent Filter & Search Ecosystem Console */}
                    <div className="space-y-6 pt-6">
                      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                            Interactive Category Explorer
                          </h2>
                          <p className="text-xs text-neutral-500">
                            Search or filter between the {countAll} tailored computational models within this category.
                          </p>
                        </div>

                        {/* Snappy Text search in-category */}
                        <div className="relative max-w-sm w-full">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            type="text"
                            placeholder="Search tools inside this category..."
                            value={catSearchQuery}
                            onChange={(e) => {
                              setCatSearchQuery(e.target.value);
                              setVisibleCount(12); // Reset page size on search!
                            }}
                            className="w-full text-xs py-2.5 pl-10 pr-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>

                      {/* Filter Sub-Groupings Pills */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => { setCatActiveFilter('all'); setVisibleCount(12); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            catActiveFilter === 'all' 
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          All Tools ({countAll})
                        </button>
                        <button
                          onClick={() => { setCatActiveFilter('base'); setVisibleCount(12); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            catActiveFilter === 'base' 
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          Base Utilities ({countBase})
                        </button>
                        <button
                          onClick={() => { setCatActiveFilter('region'); setVisibleCount(12); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            catActiveFilter === 'region' 
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          By Region ({countRegion})
                        </button>
                        <button
                          onClick={() => { setCatActiveFilter('profession'); setVisibleCount(12); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            catActiveFilter === 'profession' 
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          By Profession ({countProfession})
                        </button>
                      </div>

                      {/* Calculators grid */}
                      {filteredCalculators.length === 0 ? (
                        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/10">
                          <p className="text-sm font-bold text-neutral-500">No calculators match your current search query or filter grouping.</p>
                          <button 
                            onClick={() => { setCatSearchQuery(''); setCatActiveFilter('all'); }} 
                            className="mt-3 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                          >
                            Reset filters &amp; query
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {filteredCalculators.slice(0, visibleCount).map((calc, idx) => (
                            <motion.div
                              key={calc.id}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.35, delay: Math.min(0.2, idx * 0.03) }}
                              whileHover={{ y: -5, scale: 1.02, boxShadow: '0 12px 30px rgba(0, 240, 255, 0.05)' }}
                              className="rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md p-6 flex flex-col justify-between hover:border-blue-500 dark:hover:border-cyan-400 transition-all group"
                            >
                              <div>
                                <div className="flex justify-between items-center mb-2.5">
                                  <span className="text-[9px] font-bold text-blue-600 dark:text-cyan-400 font-mono uppercase tracking-widest bg-blue-100/50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                                    {calc.category ? calc.category.replace(/-/g, ' ').toUpperCase() : 'FEATURED'}
                                  </span>
                                  {(calc as any).keywords && (calc as any).keywords[0] && (
                                    <span className="text-[9px] font-mono text-neutral-400 font-sans">
                                      #{(calc as any).keywords[0]}
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-base font-extrabold text-neutral-950 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                                  {calc.name}
                                </h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed line-clamp-2">
                                  {calc.description}
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleNavigate(`calculator:${calc.slug}`)}
                                className="w-full mt-6 py-2.5 bg-neutral-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition text-center cursor-pointer"
                              >
                                Launch Calculator
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Load More Button */}
                      {filteredCalculators.length > visibleCount && (
                        <div className="flex justify-center pt-4">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setVisibleCount(p => p + 12)}
                            className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                          >
                            Show More Calculators ({filteredCalculators.length - visibleCount} hidden)
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Integrated Rich Accordion FAQs block */}
                    <div className="pt-10 border-t border-neutral-200/50 dark:border-neutral-800/60 font-sans">
                      <div className="flex items-center gap-2 mb-6">
                        <HelpCircle className="w-5 h-5 text-blue-500 dark:text-cyan-400" />
                        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                          Frequently Asked Questions (FAQs)
                        </h2>
                      </div>

                      <div className="space-y-4 max-w-4xl">
                        {seoDetail.faqs.map((faq, fIdx) => {
                          const isOpen = catSelectedFAQIndex === fIdx;
                          return (
                            <div 
                              key={fIdx} 
                              className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md overflow-hidden transition-all duration-300"
                            >
                              <button
                                onClick={() => setCatSelectedFAQIndex(isOpen ? null : fIdx)}
                                className="w-full px-6 py-4 flex justify-between items-center text-left text-sm font-bold text-neutral-900 dark:text-white hover:bg-neutral-100/40 dark:hover:bg-neutral-800/10 transition cursor-pointer"
                              >
                                <span className="pr-4">{faq.question}</span>
                                {isOpen 
                                  ? <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                                  : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                                }
                              </button>
                              
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-6 pb-5 pt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/50">
                                      {faq.answer}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}

          {/* ==================== CATEGORIES DETAIL PAGE ==================== */}
          {page.startsWith('category:') && (
            <motion.div
              key="cat-detail"
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 dark:text-white capitalize mb-2">
                {selectedCategory} Calculators
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-2xl text-sm">
                Showing all premium interactive tools for the <span className="font-semibold text-blue-600 dark:text-cyan-400">{selectedCategory}</span> category.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CALCULATORS.filter(c => c.category === selectedCategory).map((calc, idx) => (
                  <motion.div
                    key={calc.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    whileHover={{ y: -5, scale: 1.02, boxShadow: '0 12px 30px rgba(0, 240, 255, 0.06)' }}
                    className="rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md p-6 flex flex-col justify-between hover:border-blue-500 dark:hover:border-cyan-400 transition-all"
                  >
                    <div>
                      <h3 className="text-base font-extrabold text-neutral-950 dark:text-white">
                        {calc.name}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                        {calc.description}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigate(`calculator:${calc.slug}`)}
                      className="w-full mt-6 py-2.5 bg-neutral-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition text-center cursor-pointer"
                    >
                      Launch Calculator
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==================== INDIVIDUAL CALCULATOR VIEW ==================== */}
          {page.startsWith('calculator:') && activeCalc && (
            <motion.div
              key="calc-view"
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <CalculatorCard calculator={activeCalc} onNavigate={handleNavigate} />
            </motion.div>
          )}

          {/* ==================== GLOBAL SEARCH PAGE VIEW ==================== */}
          {page === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-[50vh]"
            >
              <Hero onSelectCalculator={(slug) => handleNavigate(`calculator:${slug}`)} />
            </motion.div>
          )}

          {/* ==================== STATIC COPYWRITE ABOUT PAGE ==================== */}
          {page === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto px-4 py-16 space-y-10"
            >
              <h1 className="text-4xl sm:text-5xl font-black text-neutral-950 dark:text-white tracking-tight">
                About Calculatoora
              </h1>
              <div className="p-1 px-3 rounded-full text-[11px] font-bold bg-blue-500/5 text-blue-600 dark:text-cyan-400 border border-blue-500/15 max-w-max uppercase select-none">
                Free Mathematical Utility Hub
              </div>
              
              <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300 space-y-6 leading-relaxed">
                <p>
                  Calculatoora was founded with a singular conviction: raw computational software should exist as highly optimized, public-access infrastructure. Just as water flows from taps, tools to calculate mortgage rates, calorie splits, standard deviation sums, and hydrological balances should act as a free local utility.
                </p>
                
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white pt-4">Our Privacy Promise</h2>
                <p>
                  We believe using a calculator should be private, instantaneous, and simple. All your inputs are resolved right here, without logging or sending data to external servers.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 dark:text-white pt-4">Media Kit (2026/2027)</h2>
                <p>
                  Advertisers who support our platform choose native, non-tracking ad placements that never block, interrupt, or degrade core usability rules. For direct partnerships, access our developer media kits by reaching out to our regional web hosting groups.
                </p>
              </div>
            </motion.div>
          )}

          {/* ==================== PRIVACY POLICY PAGE ==================== */}
          {page === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto px-4 py-16 space-y-8"
            >
              <h1 className="text-4xl font-black text-neutral-950 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-xs font-mono text-neutral-400 select-none">
                Published: June 15, 2026 &mdash; Privacy Guidelines
              </p>

              <div className="space-y-6 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                <h2 className="text-lg font-bold text-neutral-950 dark:text-white">1. Private Calculation</h2>
                <p>
                  All calculations are completed directly inside your browser. No entered rates, weights, ages, or datasets are sent to our or any third-party servers.
                </p>

                <h2 className="text-lg font-bold text-neutral-950 dark:text-white">2. No Cookie Policy</h2>
                <p>
                  We do not use browser tracking cookies or analytics trackers. Your theme preferences are saved locally on your device for a seamless experience.
                </p>

                <h2 className="text-lg font-bold text-neutral-950 dark:text-white">3. Sponsor Advertising Integrations</h2>
                <p>
                  Display ad slots featured across Calculatoora represent static link placements or privacy-friendly sponsor units that do not perform behavioral tracking.
                </p>
              </div>
            </motion.div>
          )}

          {/* ==================== TERMS OF USE PAGE ==================== */}
          {page === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto px-4 py-16 space-y-8"
            >
              <h1 className="text-4xl font-black text-neutral-950 dark:text-white">
                Terms &amp; General Disclaimer
              </h1>
              <p className="text-xs font-mono text-neutral-400 select-none">
                Published: June 15, 2026 &mdash; Educational Integrity Mandate
              </p>

              <div className="space-y-6 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                <h2 className="text-lg font-bold text-neutral-950 dark:text-white">1. Accuracy of Content</h2>
                <p>
                  The outputs served across our 23+ active calculator engines represent mathematical models compiled from public documentation (such as WHO BMI benchmarks, Mifflin-St Jeor metabolic equations, and global loan amortization standards). All outcomes are served exclusively for educational simulation and statistical estimates purposes.
                </p>

                <h2 className="text-lg font-bold text-neutral-950 dark:text-white">2. No Clinical or Professional Representation</h2>
                <p>
                  Calculatoora does not offer clinical medical declarations, legal counseling, certified accounting summaries, or official tax preparation files. Consult certified medical, legal, and financial professionals before committing large-scale capital or beginning critical dietary regressions.
                </p>

                <h2 className="text-lg font-bold text-neutral-950 dark:text-white">3. Third Party Links</h2>
                <p>
                  Users acknowledge that clicking on featured sponsor banners transits off-platform to designated external pages governed by independent terms of use rules.
                </p>
              </div>
            </motion.div>
          )}

          {/* ==================== 404 NOT FOUND PAGE ==================== */}
          {page === '404' && (
            <motion.div
              key="404"
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md mx-auto px-4 py-24 text-center space-y-6"
            >
              <div className="inline-flex p-4 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
                Page Not Found
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                The calculation node or path you are looking for does not exist or has been relocated. Let's get you back to resolving formulas.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => handleNavigate('home')}
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition cursor-pointer dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950"
                >
                  Return Home
                </button>
                <button
                  onClick={() => handleNavigate('search')}
                  className="px-6 py-3 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Search Calculators
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Persistent Global Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
