import React from 'react';
import SponsorSpace from './SponsorSpace';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-black/80 transition-all duration-300">
      
      {/* Top Footer Banner Ad container */}
      <div className="px-4">
        <SponsorSpace position="footer-banner" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-widest text-neutral-900 dark:text-white">
                CALCULATOORA
              </span>
              <span className="px-2 py-0.5 rounded font-mono text-[9px] font-bold bg-blue-500/10 text-blue-500 dark:text-cyan-400 border border-blue-500/20">
                V5
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              The World&apos;s Largest Calculation Hub. A free public utility platform with hundreds of calculators solving finance, health, science, and daily calculations instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Core Categories
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              <li>
                <a 
                  href="#/finance" 
                  onClick={(e) => { e.preventDefault(); onNavigate('category:finance'); }}
                  className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
                >
                  Finance Calculators
                </a>
              </li>
              <li>
                <a 
                  href="#/health" 
                  onClick={(e) => { e.preventDefault(); onNavigate('category:health'); }}
                  className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
                >
                  Health &amp; Metabolism
                </a>
              </li>
              <li>
                <a 
                  href="#/math" 
                  onClick={(e) => { e.preventDefault(); onNavigate('category:math'); }}
                  className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
                >
                  Mathematics &amp; Statistics
                </a>
              </li>
              <li>
                <a 
                  href="#/daily-life" 
                  onClick={(e) => { e.preventDefault(); onNavigate('category:daily-life'); }}
                  className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
                >
                  Scheduling &amp; Daily Life
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Platform Utilities
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              <li>
                <a 
                  href="#/all-calculators" 
                  onClick={(e) => { e.preventDefault(); onNavigate('all-calculators'); }}
                  className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
                >
                  Discovery Hub (All Tools)
                </a>
              </li>
              <li>
                <a 
                  href="#/about" 
                  onClick={(e) => { e.preventDefault(); onNavigate('about'); }}
                  className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
                >
                  The Media Kit
                </a>
              </li>
              <li>
                <a 
                  href="#/terms" 
                  onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}
                  className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
                >
                  Accuracy Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Public Utility Manifesto */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              MANIFESTO
            </h4>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Calculatoora guarantees zero subscriptions, zero tracking, and zero hidden fees. All your computations run instantly on your browser. Truly free.
            </p>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200/50 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            &copy; {currentYear} CALCULATOORA. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a 
              href="#/privacy" 
              onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}
              className="hover:text-blue-500 dark:hover:text-cyan-400 transition underline decoration-neutral-300"
            >
              Privacy Policy
            </a>
            <a 
              href="#/terms" 
              onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}
              className="hover:text-blue-500 dark:hover:text-cyan-400 transition underline decoration-neutral-300"
            >
              Terms of Use
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

