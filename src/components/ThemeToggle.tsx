import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ThemeToggleProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function ThemeToggle({ currentTheme, onToggleTheme }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggleTheme}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggleTheme();
        }
      }}
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
      className="relative p-2.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black transition-colors duration-200 active:scale-95 cursor-pointer overflow-hidden flex items-center justify-center w-10 h-10 select-none"
      id="theme-switcher-btn"
    >
      <AnimatePresence mode="wait" initial={false}>
        {currentTheme === 'light' ? (
          <motion.div
            key="moon-icon"
            initial={{ rotate: -90, scale: 0.3, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.3, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center justify-center text-neutral-700 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun-icon"
            initial={{ rotate: 90, scale: 0.3, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.3, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center justify-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
