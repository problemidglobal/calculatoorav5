import React, { useState } from 'react';
import { Percent, Activity, DollarSign, Search, Calculator, Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navbar({ currentTheme, onToggleTheme, onNavigate, currentPage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePopularClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById('popular-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleLinkClick = (page: string) => {
    setIsOpen(false);
    onNavigate(page);
  };

  return (
    <div className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none" id="navbar-main">
      <header className="pointer-events-auto max-w-7xl mx-auto rounded-[24px] border border-white/40 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-950/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] dark:shadow-[0_12px_45px_rgba(0,240,255,0.04)] backdrop-blur-xl transition-all duration-300 relative">
        <div className="px-5 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo and Title */}
          <a 
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="flex items-center gap-3 group group-active:scale-98 transition select-none"
            id="nav-logo"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-400 to-cyan-300 p-[1.5px] shadow-[0_0_20px_rgba(0,240,255,0.15)] dark:shadow-[0_0_25px_rgba(0,240,255,0.25)]">
              <div className="w-full h-full bg-white dark:bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                  <path d="M9 9h6M9 13h6M9 17h2" />
                  <circle cx="15" cy="17" r="1.5" fill="currentColor" />
                </svg>
              </div>
              {/* Glowing neon ring on hover */}
              <div className="absolute -inset-1 rounded-xl bg-cyan-400/20 opacity-0 group-hover:opacity-100 blur transition duration-350" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 dark:from-white dark:to-neutral-100 font-sans block leading-none">
                CALCULATOORA
              </span>
              <span className="text-[9px] font-bold tracking-wider text-blue-600 dark:text-cyan-400 uppercase mt-1 block">
                Premium Ecosystem
              </span>
            </div>
          </a>

          {/* Navigation Items - Center Align */}
          <nav className="hidden md:flex items-center gap-2 text-[13px] font-bold">
            {[
              { label: 'Home', path: 'home' },
              { label: 'Categories', path: 'categories' },
              { label: 'Popular', path: 'popular', isScroll: true },
              { label: 'All Calculators', path: 'all-calculators' }
            ].map((link) => {
              const isActive = currentPage === link.path || (link.path === 'home' && currentPage === 'home');
              return link.isScroll ? (
                <a
                  key={link.label}
                  href="#/"
                  onClick={handlePopularClick}
                  className="relative transition-all duration-250 py-2 px-3.5 rounded-xl hover:text-blue-500 hover:bg-blue-500/5 dark:hover:text-cyan-300 dark:hover:bg-cyan-500/5 text-neutral-600 dark:text-neutral-300"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={`#/${link.path}`}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.path); }}
                  className={`relative transition-all duration-250 py-2 px-3.5 rounded-xl ${
                    isActive 
                      ? 'text-blue-600 dark:text-cyan-400 bg-blue-500/5 dark:bg-cyan-500/10 border border-blue-500/10 dark:border-cyan-400/10 shadow-[inner_0_1px_4px_rgba(0,0,0,0.02)]' 
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-blue-500 hover:bg-blue-500/5 dark:hover:text-cyan-300 dark:hover:bg-cyan-500/5'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Utility Items: Search, Theme Toggle, Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleLinkClick('search')}
              aria-label="Search"
              className="p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900/60 transition group active:scale-95 cursor-pointer"
            >
              <Search className="w-4.5 h-4.5 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition" />
            </button>

            <ThemeToggle currentTheme={currentTheme} onToggleTheme={onToggleTheme} />

            {/* Mobile Menu Button - Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900/60 md:hidden transition active:scale-95 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5 text-blue-500 dark:text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile menu panel using slide-reveal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, scaleY: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
              exit={{ opacity: 0, height: 0, scaleY: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="absolute top-[72px] left-0 right-0 overflow-hidden rounded-[20px] border border-white/40 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-950/95 shadow-2xl backdrop-blur-2xl md:hidden z-50 p-4 space-y-2 origin-top"
            >
              {[
                { label: 'Home', path: 'home' },
                { label: 'Categories', path: 'categories' },
                { label: 'Popular', path: 'popular', isScroll: true },
                { label: 'All Calculators', path: 'all-calculators' }
              ].map((link) => {
                const isActive = currentPage === link.path;
                return link.isScroll ? (
                  <button
                    key={link.label}
                    onClick={handlePopularClick}
                    className="w-full text-left py-3 px-4 rounded-xl text-sm font-semibold hover:bg-blue-500/5 hover:text-blue-500 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300 text-neutral-700 dark:text-neutral-300 transition"
                  >
                    {link.label}
                  </button>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link.path)}
                    className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold transition ${
                      isActive 
                        ? 'bg-blue-500/5 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 font-bold border-l-2 border-blue-500 dark:border-cyan-400 pl-3.5' 
                        : 'hover:bg-blue-500/5 hover:text-blue-500 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
