import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Compass, 
  Lightbulb, 
  Calculator, 
  TrendingUp, 
  Coins,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface EMIEducationalContentProps {
  onNavigate?: (page: string) => void;
}

export default function EMIEducationalContent({ onNavigate }: EMIEducationalContentProps) {
  const glossary = [
    { term: 'Principal', desc: 'The base capital sum borrowed from a lender before compounding interest charges are added.' },
    { term: 'Amortization', desc: 'The systematic gradual payoff of a debt via scheduled equal installments over a designated timeline.' },
    { term: 'Down Payment', desc: 'An initial upfront contribution submitted towards an asset purchase, reducing the total final loan balance needed.' },
    { term: 'Prepayment (Recasting)', desc: 'Submitting extra money beyond standard periodic EMIs. It either reduces your future tenure or recalculates lower monthly EMIs.' },
    { term: 'Refinancing', desc: 'Settling an active loan by transferring the outstanding principal balance to a new lender offering lower interest rates or better terms.' },
    { term: 'Grace Period', desc: 'A preliminary temporary pause (interest-only or zero-payment) granted before regular principal amortization begins.' },
  ];

  const FAQs = [
    {
      q: 'What is the standard reducing balance method?',
      a: 'The reducing balance method calculates interest charges solely against the remaining outstanding principal balance at each cycle. As your periodic payments systematically decrease the principal, your periodic interest cost falls too, maximizing principal clearance.'
    },
    {
      q: 'How does a down payment lower my total EMI?',
      a: 'A down payment reduces the total principal amount you need to borrow from the outset. Since interest compounds against a smaller principal base, both your monthly EMI and overall interest cost decline proportionally.'
    },
    {
      q: 'Can extra payments save money even on fixed rate loans?',
      a: 'Yes! Prepayments directly target the outstanding principal balance. By wiping out principal earlier than scheduled, you block future compounding cycles of interest, resulting in significant savings and an earlier payoff date.'
    },
    {
      q: 'What is the difference between Flat Interest Rate and Reducing Balance?',
      a: 'Flat rates calculate interest against the initial loan amount across the entire term, completely ignoring that you are paying back principal over time. Reducing balance is mathematically fair and significantly cheaper in terms of true interest paid.'
    },
  ];

  const workedExamples = [
    {
      title: 'Worked Example 1: Home Purchase',
      details: 'Principal: $300,000 | Interest Rate: 6.5% | Tenure: 30 Years',
      calc: 'Monthly periodic interest rate (r) = 6.5 / 12 / 100 = 0.005417. Number of periods (n) = 30 * 12 = 360 payments. Monthly EMI = $1,896.20. Over 30 years, you pay a total of $682,633.20 ($382,633.20 purely in interest).'
    },
    {
      title: 'Worked Example 2: Vehicle Purchase with Prepayments',
      details: 'Principal: $45,000 | Interest Rate: 5.0% | Tenure: 5 Years',
      calc: 'Base EMI is $849.21. If you pay an extra $150 monthly starting from Month 1, your loan closes 10 months early, saving $1,055.40 in cumulative interest.'
    }
  ];

  const relatedCalcs = [
    { name: 'Loan Calculator', slug: 'ultimate-loan-calculator', desc: 'Flexible general loan amortization with customizable fees.' },
    { name: 'Mortgage Calculator', slug: 'mortgage-calculator', desc: 'Advanced property taxes, escrow charges, and PMI solver.' },
    { name: 'Car Loan Calculator', slug: 'car-loan-calculator', desc: 'Autofilled dealer options, trade-in value, and taxes.' },
    { name: 'Interest Calculator', slug: 'cumulative-interest-calculator', desc: 'Simple versus compound compounding comparison tool.' },
    { name: 'Compound Interest Calculator', slug: 'savings-calculator', desc: 'Growth simulation with regular annual deposits.' },
    { name: 'Retirement Calculator', slug: 'retirement-calculator', desc: 'Evaluate nest eggs, inflation margins, and payout ratios.' },
  ];

  return (
    <div className="space-y-8 mt-12 border-t border-neutral-200/60 dark:border-neutral-800/80 pt-10 text-left">
      
      {/* Intro and Formula */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-neutral-900 dark:to-neutral-950 border border-blue-100/50 dark:border-neutral-850 rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          <h3 className="text-xl font-bold text-neutral-800 dark:text-white">What is an Equated Monthly Installment (EMI)?</h3>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
          An **EMI (Equated Monthly Installment)** is a fixed, recurring payment submitted by a borrower to a financial institution at a specified date every calendar month. Each EMI payment is split into two parts: settling the interest accrued for the month, and clearing a portion of the original outstanding loan balance.
        </p>

        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-3">Core Mathematical Equation</span>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 p-4 rounded-2xl mb-6 text-center shadow-inner">
          <code className="text-sm md:text-base font-mono font-bold text-blue-600 dark:text-cyan-400">
            EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ - 1)
          </code>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-neutral-500">
          <div className="p-3 bg-white/60 dark:bg-neutral-900/60 rounded-xl border border-neutral-200/40 dark:border-neutral-800">
            <span className="text-neutral-800 dark:text-white font-bold">P = Principal</span>
            <p className="font-medium text-[10px] text-neutral-400 mt-1">The base amount borrowed from the lender.</p>
          </div>
          <div className="p-3 bg-white/60 dark:bg-neutral-900/60 rounded-xl border border-neutral-200/40 dark:border-neutral-800">
            <span className="text-neutral-800 dark:text-white font-bold">r = Periodic Interest Rate</span>
            <p className="font-medium text-[10px] text-neutral-400 mt-1">Annual Rate divided by payment frequency per year.</p>
          </div>
          <div className="p-3 bg-white/60 dark:bg-neutral-900/60 rounded-xl border border-neutral-200/40 dark:border-neutral-800">
            <span className="text-neutral-800 dark:text-white font-bold">n = Total Payments</span>
            <p className="font-medium text-[10px] text-neutral-400 mt-1">The total number of payment cycles (e.g. 360 for 30 years).</p>
          </div>
        </div>
      </div>

      {/* Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h4 className="text-lg font-bold text-neutral-800 dark:text-white">Pro Tips to Lower Your Overall EMI Cost</h4>
          </div>
          <ul className="space-y-3.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold shrink-0">•</span>
              <p><strong>Optimize Down Payments:</strong> Submit as much down payment as is financially viable. Borrowing less principal drastically drops the baseline interest compounding over decades.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold shrink-0">•</span>
              <p><strong>Prepay Whenever Possible:</strong> Even minor, non-regular prepayments (e.g., year-end bonuses) directly hit your principal balance, compounding dramatic overall savings and shortening your timeline.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold shrink-0">•</span>
              <p><strong>Negotiate Refinancing:</strong> If interest rates fall or your credit score improves, look into refinancing with alternate lenders to slash your rate by 0.5% - 1%.</p>
            </li>
          </ul>
        </div>

        {/* Worked Examples */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h4 className="text-lg font-bold text-neutral-800 dark:text-white">Practical Worked Examples</h4>
          </div>
          <div className="space-y-4">
            {workedExamples.map((ex, i) => (
              <div key={i} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850">
                <span className="text-xs font-bold text-neutral-800 dark:text-white block mb-1">{ex.title}</span>
                <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-mono font-bold block mb-2">{ex.details}</span>
                <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">{ex.calc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          <h4 className="text-lg font-bold text-neutral-800 dark:text-white">Frequently Asked Questions</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAQs.map((faq, i) => (
            <div key={i} className="space-y-1.5 text-left">
              <h5 className="text-xs font-bold text-neutral-800 dark:text-white flex items-center gap-2">
                <span className="p-1 bg-blue-500/10 rounded-lg text-blue-600 dark:text-cyan-400 font-mono text-[10px]">Q</span>
                {faq.q}
              </h5>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed pl-6 font-medium">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Glossary */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Coins className="w-5 h-5 text-indigo-500" />
          <h4 className="text-lg font-bold text-neutral-800 dark:text-white">Glossary of Financial Terms</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {glossary.map((g, i) => (
            <div key={i} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/45 border border-neutral-100 dark:border-neutral-850">
              <span className="text-xs font-bold text-neutral-800 dark:text-white block mb-1.5">{g.term}</span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Calculators Card index */}
      {onNavigate && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Compass className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h4 className="text-lg font-bold text-neutral-800 dark:text-white">Explore Related Financial Calculators</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedCalcs.map((calc, i) => (
              <a
                key={i}
                href={`#/${calc.slug}`}
                onClick={(e) => { e.preventDefault(); onNavigate(`slug:${calc.slug}`); }}
                className="p-4 rounded-2xl bg-neutral-50 hover:bg-blue-500/5 dark:bg-neutral-950 dark:hover:bg-cyan-400/5 border border-neutral-100 dark:border-neutral-850 hover:border-blue-500/25 dark:hover:border-cyan-400/25 transition group text-left block"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    {calc.name}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-700 group-hover:translate-x-1 transition shrink-0" />
                </div>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium leading-relaxed">
                  {calc.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
