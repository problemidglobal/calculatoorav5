import React from 'react';

interface SponsorSpaceProps {
  position: 'top-banner' | 'sidebar' | 'in-between' | 'footer-banner';
}

export default function SponsorSpace({ position }: SponsorSpaceProps) {
  const styles = {
    'top-banner': 'w-full max-w-4xl mx-auto my-6 p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs',
    'sidebar': 'w-full p-5 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/30 flex flex-col gap-3 text-xs',
    'in-between': 'w-full my-8 p-6 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 text-center flex flex-col items-center justify-center gap-1.5 min-h-[100px]',
    'footer-banner': 'w-full max-w-5xl mx-auto my-8 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-950/20 text-center text-xs'
  };

  if (position === 'top-banner') {
    return (
      <div className={styles[position]}>
        <div className="flex items-center gap-2.5 text-left">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 dark:text-cyan-400 border border-blue-500/10">
            ADVERTISEMENT
          </span>
          <p className="text-neutral-500 dark:text-neutral-400">
            Sponsor of the Month: <span className="font-semibold text-neutral-800 dark:text-neutral-200">Apex Hosting</span> — Premium high-performance web hosting.
          </p>
        </div>
        <a 
          href="#/sponsor" 
          onClick={(e) => e.preventDefault()}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs transition"
        >
          Partner with Us
        </a>
      </div>
    );
  }

  if (position === 'sidebar') {
    return (
      <div className={styles[position]}>
        <div className="flex justify-between items-center text-neutral-400 font-mono tracking-widest uppercase">
          <span>SPONSOR BOX</span>
          <span className="text-[9px] bg-neutral-200/50 dark:bg-neutral-800 px-1 py-0.2 rounded">300x250</span>
        </div>
        <div className="h-44 rounded-xl bg-neutral-200/20 dark:bg-neutral-800/20 border border-neutral-300/30 dark:border-neutral-700/30 flex flex-col items-center justify-center p-4 text-center">
          <p className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm mb-1">
            Build Better Websites
          </p>
          <p className="text-neutral-500 dark:text-neutral-400 text-[11px] mb-3">
            Fast, lightweight, and modern designs built to adapt perfectly to any device.
          </p>
          <button className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium transition">
            Learn More
          </button>
        </div>
      </div>
    );
  }

  if (position === 'in-between') {
    return (
      <div className={styles[position]}>
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-500 dark:text-cyan-400 mb-1">
          SUSTAINED BY SPONSORS
        </span>
        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Serving over 10,000 users worldwide.
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-lg">
          Support our work by visiting our featured sponsors. We never track your usage or sell your personal data. Ever.
        </p>
      </div>
    );
  }

  return (
    <div className={styles[position]}>
      <p className="text-neutral-400 dark:text-neutral-500 font-medium">
        Want your brand promoted here? Connect with millions of visitors worldwide. Check out the{' '}
        <a href="#/about" className="underline hover:text-blue-500 dark:hover:text-cyan-400 transition">Calculatoora Media Kit (2026/2027)</a>.
      </p>
    </div>
  );
}
