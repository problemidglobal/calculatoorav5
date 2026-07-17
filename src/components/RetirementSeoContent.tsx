import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Percent, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function RetirementSeoContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(p => p === idx ? null : idx);
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the 4% Safe Withdrawal Rate (SWR) or Trinity Study?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The 4% rule, derived from the Trinity Study, is a rule of thumb suggesting that retirees can withdraw 4% of their initial portfolio balance in the first year of retirement, and adjust that dollar amount for inflation every year thereafter, with a 95%+ probability that the portfolio will survive at least 30 years."
        }
      },
      {
        "@type": "Question",
        "name": "Why is a Monte Carlo simulation important in retirement planning?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While a deterministic calculation assumes a constant annual stock market return (e.g. 7% every single year), real-world markets fluctuate. A Monte Carlo simulation tests your portfolio across hundreds of randomized historical return pathways with different sequences of returns. This helps determine the risk of early-retirement market crashes, known as Sequence of Returns Risk."
        }
      },
      {
        "@type": "Question",
        "name": "How does inflation affect my retirement spending needs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Inflation reduces the purchasing power of your money. If you need $60,000 to live today, in 30 years with a 2.5% average annual inflation rate, you will need approximately $125,850 to purchase the exact same basket of goods and services."
        }
      }
    ]
  };

  const faqList = [
    {
      q: "What is the 4% Safe Withdrawal Rate (SWR) or Trinity Study?",
      a: "The 4% rule is an industry benchmark suggesting that withdrawing 4% of your portfolio in your first year of retirement, and then adjusting that dollar amount for inflation each subsequent year, ensures your nest egg survives for at least 30 years. It was published in the landmark Trinity Study based on historical US stock and bond market returns."
    },
    {
      q: "Why is a Monte Carlo simulation important in retirement planning?",
      a: "A deterministic model assumes a constant annual return (e.g., exactly 7% every year). Real markets fluctuate heavily. A Monte Carlo simulation generates 250 trial pathways using standard normal distribution (based on expected average returns and portfolio volatility) to verify if your portfolio survives volatile down-years or sequence-of-returns risks."
    },
    {
      q: "How does the annual Step-up rate impact my long-term nest egg?",
      a: "An annual contribution step-up is the percentage by which you increase your monthly savings rate each year (often aligned with salary increases or promotions). Even a modest 3% annual step-up over 30 years can more than double your final retirement savings balance compared to a flat contribution rate."
    },
    {
      q: "When should I claim Social Security or other pensions?",
      a: "In the United States, you can claim Social Security as early as age 62, but your monthly benefit increases by roughly 8% for each year you delay claiming, up to age 70. Our calculator lets you set a custom starting age for pensions or Social Security to model the ideal delay strategy."
    }
  ];

  return (
    <div className="mt-12 border-t border-neutral-150 dark:border-neutral-800 pt-8 space-y-8 font-sans text-left max-w-4xl mx-auto">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* EDUCATIONAL MASTER CLASS */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-neutral-850 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-500" /> Retirement Wealth Modeling Masterclass
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed">
          Planning for financial independence and sustainable retirement requires evaluating variables that can stretch over multiple decades. 
          To protect against the risk of outliving your wealth, a comprehensive projection model must account for the accumulation rate, compound market earnings, 
          unavoidable tax drags, cumulative inflation compounding, and localized guaranteed pensions like Social Security.
        </p>
      </div>

      {/* MATRIX DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 dark:bg-neutral-905 p-6 rounded-2xl border border-neutral-150 dark:border-neutral-800">
        
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <Percent className="w-3.5 h-3.5 text-blue-500" /> Sequence of Returns Risk (SRR)
          </h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Sequence of Returns Risk represents the danger that market down-turns or crashes occur immediately before or in the early years of your retirement. 
            If you are forced to draw down your capital during a market crash, you lock in losses and leave less capital in the market to compound when recovery occurs, 
            significantly shortening your portfolio's survival length.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Inflation Compound Erosion
          </h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Inflation is a silent erosion index that decreases purchasing power over time. While your portfolio's nominal size may keep rising, its real purchasing value 
            relative to goods and services will deteriorate. For example, at a standard 2.5% inflation rate, the purchasing power of $1,000,000 is nearly halved to $476,000 in 30 years.
          </p>
        </div>

      </div>

      {/* COMPLIANT FAQ ACCORDION */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-neutral-850 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-500" /> Frequently Asked Questions
        </h3>

        <div className="space-y-2">
          {faqList.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="border border-neutral-150 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white/50 dark:bg-neutral-900/10 transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-sans select-none cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-850/40"
                >
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-neutral-100 dark:border-neutral-850/50">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
