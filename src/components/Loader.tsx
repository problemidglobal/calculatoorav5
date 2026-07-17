import React from 'react';
import { Calculator } from 'lucide-react';
import { motion } from 'motion/react';

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(4px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(4px)' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md"
      id="global-spinner-overlay"
    >
      <div className="relative flex items-center justify-center">
        {/* Animated outer ring with blue-to-cyan gradient */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-[3.5px] border-neutral-200/40 dark:border-neutral-800/40"
          style={{
            borderTopColor: '#3b82f6',
            borderRightColor: '#00f0ff',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
          }}
        />

        {/* Floating icon at absolute center */}
        <div className="absolute flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <Calculator className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
        </div>
      </div>
      
      <span className="mt-4 text-xs font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase font-sans select-none animate-pulse">
        Optimizing Solver...
      </span>
    </motion.div>
  );
}
