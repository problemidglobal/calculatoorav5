import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, HelpCircle, DollarSign, Activity, Percent, Calculator, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CALCULATORS, CATEGORIES } from '../data/calculatorsPool';
import { Calculator as CalcType } from '../types';

interface HeroProps {
  onSelectCalculator: (slug: string) => void;
}

const POPULAR_SEARCHES = [
  { name: 'Loan Calculator', slug: 'loan-calculator' },
  { name: 'BMI Calculator', slug: 'bmi-calculator' },
  { name: 'Compound Growth Calculator', slug: 'compound-growth-calculator' },
  { name: 'Wallpaper Calculator', slug: 'wallpaper-calculator' },
  { name: 'Subnet Mask Calculator', slug: 'subnet-mask-calculator' }
];

export default function Hero({ onSelectCalculator }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close search completions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync recent tools from localStorage when dropdown opens or on mount
  useEffect(() => {
    try {
      const recents = JSON.parse(localStorage.getItem('calculatoora_recents') || '[]');
      if (Array.isArray(recents)) {
        setRecentSlugs(recents);
      }
    } catch (e) {}
  }, [isOpen]);

  const handleSelectCalculator = (slug: string) => {
    try {
      const recents = JSON.parse(localStorage.getItem('calculatoora_recents') || '[]');
      const updated = [slug, ...recents.filter((s: string) => s !== slug)].slice(0, 4);
      localStorage.setItem('calculatoora_recents', JSON.stringify(updated));
    } catch (e) {}
    onSelectCalculator(slug);
    setSearchQuery('');
    setIsOpen(false);
  };

  const filtered = CALCULATORS.filter(
    (calc) =>
      calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentCalculators = recentSlugs
    .map(slug => CALCULATORS.find(c => c.slug === slug))
    .filter((c): c is CalcType => !!c);

  return (
    <div className="relative py-16 lg:py-24 overflow-x-clip overflow-y-visible bg-transparent mb-4" id="hero-section">
      
      {/* Background system: Deep blue ambient glow in dark, subtle blue in light */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-sky-500/10 dark:bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left / Center: Large typography, big search inputs */}
          <div className="lg:col-span-7 text-left space-y-6 relative z-[10]">
            
            {/* Sparkle micro badge - Blue neon themed */}
            <motion.div 
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/5 text-blue-600 dark:text-cyan-400 border border-blue-500/15 tracking-wide uppercase select-none"
              id="hero-badge"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 animate-pulse" />
              Calculatoora Hub V7
            </motion.div>
     
            {/* Headings - Smooth staggering fade and reveal */}
            <motion.h1 
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black text-neutral-950 dark:text-white tracking-tight leading-none font-sans"
              id="hero-title"
            >
              Calculate Anything.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400">
                Instantly.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="text-[15px] sm:text-[17px] text-neutral-500 dark:text-neutral-400 max-w-xl font-medium leading-relaxed"
              id="hero-subtitle"
            >
              Thousands of powerful free calculators for everyday decisions, business, science and technology. Clean. Private. Fast.
            </motion.p>
     
            {/* Massive Interactive Search Completer - Slides in beautiful viewport */}
            <motion.div 
              initial={{ opacity: 0, y: 25, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="max-w-xl relative pt-2 z-[100]" 
              ref={dropdownRef}
              id="hero-search-wrapper"
            >
              <div className="group relative flex items-center bg-white/55 dark:bg-neutral-900/40 backdrop-blur-md rounded-2xl border border-neutral-200 dark:border-neutral-800/80 focus-within:border-blue-500 dark:focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/10 focus-within:shadow-[0_0_35px_rgba(0,240,255,0.18)] transition-all duration-300">
                <Search className="absolute left-4 w-5 h-5 text-neutral-400 group-focus-within:text-blue-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                
                <input
                  type="text"
                  placeholder="Search calculator (e.g., Loan, BMI, Average, CAGR...)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 font-sans font-semibold hover:placeholder-neutral-500 dark:hover:placeholder-neutral-400 focus:outline-none text-sm sm:text-base"
                />
              </div>

              {/* Autocomplete Panel */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-3 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 shadow-2xl z-[999] text-left max-h-[440px] overflow-y-auto backdrop-blur-xl space-y-4"
                  >
                    {searchQuery.trim() === '' ? (
                      /* Focused empty query panel state */
                      <>
                        {recentCalculators.length > 0 && (
                          <div className="space-y-1.5">
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1 leading-none select-none">
                              Recently Visited Calculators
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {recentCalculators.map((calc) => (
                                <button
                                  key={calc.id}
                                  onClick={() => handleSelectCalculator(calc.slug)}
                                  className="w-full p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/80 border border-neutral-200/50 dark:border-neutral-800/50 hover:border-blue-500 dark:hover:border-cyan-400 transition text-left cursor-pointer flex items-center justify-between group"
                                >
                                  <div className="truncate max-w-[85%]">
                                    <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200 group-hover:text-blue-500 dark:group-hover:text-cyan-400 truncate block">
                                      {calc.name}
                                    </span>
                                    <span className="text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-tight block">
                                      {calc.category}
                                    </span>
                                  </div>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 leading-none select-none">
                            Popular Calculations
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {POPULAR_SEARCHES.map((item) => (
                              <button
                                key={item.slug}
                                onClick={() => handleSelectCalculator(item.slug)}
                                className="px-3 py-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 text-xs font-bold hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-cyan-400 transition cursor-pointer"
                              >
                                {item.name.replace(' Calculator', '')}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 leading-none select-none">
                            Explore Collections
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {CATEGORIES.slice(0, 6).map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => {
                                  setSearchQuery(cat.id);
                                  setIsOpen(true);
                                }}
                                className="p-2 border border-neutral-200/50 dark:border-neutral-800 rounded-xl text-xs font-bold text-left text-neutral-700 dark:text-neutral-300 hover:border-blue-500 dark:hover:border-cyan-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400 inline-block" />
                                {cat.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Active text searching result mapping */
                      <>
                        <div className="px-1.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-neutral-900/60 flex justify-between items-center select-none">
                          <span>Search Results ({filtered.length})</span>
                          <span>Calculations</span>
                        </div>

                        {filtered.length > 0 ? (
                          <div className="space-y-0.5">
                            {filtered.slice(0, 15).map((calc) => (
                              <button
                                key={calc.id}
                                onClick={() => handleSelectCalculator(calc.slug)}
                                className="w-full px-3.5 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/80 flex items-center justify-between transition-colors text-left group/item cursor-pointer"
                              >
                                <div className="max-w-[80%]">
                                  <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex flex-wrap items-center gap-1.5">
                                    <span className="group-hover/item:text-blue-500 dark:group-hover/item:text-cyan-400 transition-colors">{calc.name}</span>
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 uppercase tracking-tight">
                                      {calc.category}
                                    </span>
                                  </div>
                                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                                    {calc.description}
                                  </p>
                                </div>
                                <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-500/5 dark:bg-cyan-500/10 px-2.5 py-1 rounded-md group-hover/item:bg-blue-600 group-hover/item:text-white transition">
                                  Open
                                </span>
                              </button>
                            ))}
                            {filtered.length > 15 && (
                              <p className="text-center text-[10px] text-neutral-400 dark:text-neutral-500 pt-1 font-mono italic select-none">
                                Showing top 15 results. Refine search parameters for more.
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="p-8 text-center text-neutral-500 dark:text-neutral-400 text-sm">
                            No calculators found for &quot;<span className="font-semibold">{searchQuery}</span>&quot;.
                            <p className="text-xs text-neutral-400 mt-1">Try seeking &quot;Loan&quot;, &quot;BMI&quot;, or &quot;Average&quot;.</p>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Suggestion tags */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap items-center gap-2 text-xs pt-1"
              id="hero-suggestions"
            >
              <span className="text-neutral-400 dark:text-neutral-500 flex items-center gap-1 font-mono uppercase tracking-wider text-[10px] select-none">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" /> Hot Keys:
              </span>
              {['Loan Calculator', 'BMI Calculator', 'Calorie Calculator', 'Average Calculator'].map((name) => {
                const matched = CALCULATORS.find(c => c.name === name);
                return (
                  <button
                    key={name}
                    onClick={() => matched && handleSelectCalculator(matched.slug)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100/80 dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-400 font-semibold hover:text-blue-500 dark:hover:text-cyan-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition active:scale-95 cursor-pointer"
                  >
                    {name.replace(' Calculator', '')}
                  </button>
                );
              })}
            </motion.div>

          </div>

          {/* Right: Floating grid representing interactive calculated nodes */}
          <div className="hidden md:flex lg:col-span-5 relative mt-6 lg:mt-0 h-[380px] w-full items-center justify-center select-none z-[1]" id="hero-floating-view">
            
            {/* Background geometric design lines */}
            <div className="absolute inset-0 border border-dashed border-blue-500/5 dark:border-blue-500/2 rounded-full pointer-events-none" />
            <div className="absolute inset-10 border border-dashed border-cyan-500/5 dark:border-cyan-500/2 rounded-full pointer-events-none" />

            {/* Card 1: Loan Solver */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              onClick={() => onSelectCalculator('loan-calculator')}
              className="absolute top-2 left-6 w-[200px] text-left p-4 rounded-2xl glass-panel-light dark:glass-panel-dark text-neutral-950 dark:text-white hover:-translate-y-1 hover:border-blue-500/80 hover:shadow-cyan-500/10 cursor-pointer transition-all duration-300 pointer-events-auto group animate-float-slow z-[1]"
              id="float-card-1"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-neutral-400 font-bold">Mortgage</span>
              </div>
              <h4 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase leading-none">Loan Estimate</h4>
              <div className="text-lg font-black tracking-tight text-neutral-900 dark:text-white mt-1 group-hover:text-blue-500 dark:group-hover:text-cyan-300 transition-colors">
                $400,000 <span className="text-[10px] text-blue-500 font-mono font-bold">@6.5%</span>
              </div>
            </motion.button>

            {/* Card 2: BMI Inspector */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              onClick={() => onSelectCalculator('bmi-calculator')}
              className="absolute bottom-4 left-0 w-[200px] text-left p-4 rounded-2xl glass-panel-light dark:glass-panel-dark text-neutral-950 dark:text-white hover:-translate-y-1 hover:border-blue-500/80 hover:shadow-cyan-500/10 cursor-pointer transition-all duration-300 pointer-events-auto group animate-float-reverse z-[1]"
              id="float-card-2"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 text-cyan-500">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-neutral-400 font-bold">Health Guide</span>
              </div>
              <h4 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase leading-none">Body Mass index</h4>
              <div className="text-lg font-black tracking-tight text-neutral-900 dark:text-white mt-1 group-hover:text-blue-500 dark:group-hover:text-cyan-300 transition-colors">
                22.4 BMI <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-blue-500/5 text-blue-500 font-mono">OPTIMAL</span>
              </div>
            </motion.button>

            {/* Card 3: Investment CAGR */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              onClick={() => onSelectCalculator('investment-calculator')}
              className="absolute top-16 right-0 w-[210px] text-left p-4 rounded-2xl glass-panel-light dark:glass-panel-dark text-neutral-950 dark:text-white hover:-translate-y-1 hover:border-blue-500/80 hover:shadow-cyan-500/10 cursor-pointer transition-all duration-300 pointer-events-auto group animate-float-reverse z-[1]"
              id="float-card-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-500">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-neutral-400 font-bold">Invest</span>
              </div>
              <h4 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase leading-none">Compound Growth</h4>
              <div className="text-lg font-black tracking-tight text-neutral-900 dark:text-white mt-1 group-hover:text-blue-500 dark:group-hover:text-cyan-300 transition-colors">
                $1,250,500 <span className="text-[9px] text-blue-400 font-mono font-bold">+12% ARR</span>
              </div>
            </motion.button>

            {/* Card 4: Scientific calculation */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              onClick={() => onSelectCalculator('scientific-calculator')}
              className="absolute bottom-8 right-4 w-[190px] text-left p-4 rounded-2xl glass-panel-light dark:glass-panel-dark text-neutral-950 dark:text-white hover:-translate-y-1 hover:border-blue-500/80 hover:shadow-cyan-500/10 cursor-pointer transition-all duration-300 pointer-events-auto group animate-float-slow z-[1]"
              id="float-card-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 dark:text-cyan-300">
                  <Calculator className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-neutral-400 font-bold">Sci</span>
              </div>
              <h4 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase leading-none">Fourier Sine</h4>
              <div className="text-base font-black tracking-tight text-neutral-900 dark:text-white mt-1 group-hover:text-blue-500 dark:group-hover:text-cyan-300 transition-colors">
                sin(π/4) = 0.7071
              </div>
            </motion.button>

          </div>

        </div>
      </div>
    </div>
  );
}
