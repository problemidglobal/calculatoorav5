import React from 'react';
import { 
  HelpCircle, 
  Info, 
  BookOpen, 
  CheckCircle, 
  Percent, 
  Scale, 
  Layers, 
  DollarSign, 
  Lightbulb, 
  ArrowRight 
} from 'lucide-react';

interface SeoContentProps {
  onNavigate?: (slug: string) => void;
}

export default function SeoContent({ onNavigate }: SeoContentProps) {
  const faqs = [
    {
      question: "How do extra payments shorten my car loan?",
      answer: "When you make an extra payment, the entire amount goes directly toward reducing the principal balance of the loan, rather than being split between interest and principal. A lower principal means less interest is calculated in all subsequent months, shortening the overall loan term and saving hundreds of dollars."
    },
    {
      question: "What is the 20/4/10 rule for car buying?",
      answer: "The 20/4/10 is a classic financial guideline: 1) Make a down payment of at least 20%. 2) Limit the loan term to no more than 4 years (48 months). 3) Keep your total monthly vehicle costs (payment, insurance, fuel, maintenance) under 10% of your gross monthly income."
    },
    {
      question: "What is the difference between APR and interest rate?",
      answer: "The interest rate is the base cost of borrowing the principal balance. APR (Annual Percentage Rate) is a broader measure that includes both the interest rate AND other dealer fees, finance fees, or prepaid items. For car loans, APR gives a truer picture of the yearly cost of borrowing."
    },
    {
      question: "Should I buy or lease my next vehicle?",
      answer: "Leasing offers lower monthly payments, manufacturer warranty coverage, and the ability to drive a new car every few years with zero resale hassle. Buying has higher initial payments but leads to complete ownership, zero mileage limits, no wear-and-tear charges, and long-term equity."
    },
    {
      question: "How do dealer fees affect my monthly payment?",
      answer: "Fees like document fees, dealer preparation fees, and advertising charges are usually added directly onto the loan principal rather than paid upfront. This means you will pay compounding interest on those fees over the full term of the loan."
    }
  ];

  const glossary = [
    { term: "Amortization", definition: "The gradual reduction of a debt over a specified period through regular payments of principal and interest." },
    { term: "Depreciation", definition: "The decline in a vehicle's value over time. New cars typically lose 20% of their value in the first year alone." },
    { term: "Gap Insurance", definition: "Insurance that covers the 'gap' between what the vehicle is worth and what you still owe on the loan in case of a total loss." },
    { term: "Residual Value", definition: "The estimated value of a leased car at the end of the lease term, used to calculate monthly lease payments." },
    { term: "Trade-In Equity", definition: "The value of your trade-in vehicle minus any outstanding loan balance still owed on it." }
  ];

  return (
    <div className="mt-16 space-y-12 border-t border-neutral-200 dark:border-neutral-800 pt-12 text-neutral-800 dark:text-neutral-300">
      
      {/* Educational Article Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider rounded-full">
          <BookOpen className="w-3.5 h-3.5" />
          Ultimate Finance Guide
        </div>
        <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
          How Car Payments Are Calculated: Formulas & Strategies
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-4xl text-sm sm:text-base">
          Navigating auto financing can be overwhelming. Understanding how amortization, sales tax, trade-ins, and dealer fees compile into your monthly car payment empowers you to negotiate the best dealership deal.
        </p>
      </div>

      {/* Grid of Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Box 1: The Loan Formula */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
            <Percent className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="font-bold text-neutral-950 dark:text-white">The Amortization Formula</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Standard auto loans use a fixed-rate compounding monthly formula:
          </p>
          <div className="bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl font-mono text-[11px] text-center text-red-600 dark:text-red-400">
            PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
          </div>
          <p className="text-[11px] text-neutral-400">
            Where <strong>P</strong> is Principal, <strong>r</strong> is monthly interest rate, and <strong>n</strong> is total monthly payments.
          </p>
        </div>

        {/* Box 2: Down Payments */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="font-bold text-neutral-950 dark:text-white">Down Payments Explained</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Putting cash down on day one is the single best way to lower your monthly obligation. A 20% down payment prevents your loan from going "upside down" due to rapid initial depreciation.
          </p>
        </div>

        {/* Box 3: Lease vs Buy */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center">
            <Scale className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="font-bold text-neutral-950 dark:text-white">Lease vs Buy Comparison</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Leasing guarantees lower payments but grants zero vehicle ownership or equity. Buying builds equity over time, allows customization, and eliminates strict annual mileage restrictions.
          </p>
        </div>

      </div>

      {/* Structured Worked Example Section */}
      <div className="p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 space-y-6">
        <h3 className="text-xl font-black text-neutral-950 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Step-by-Step Worked Example
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Suppose you buy a car for <strong>$35,000</strong>. You provide a <strong>$5,000</strong> down payment and trade in your old car for <strong>$3,000</strong>. You secure a <strong>60-month</strong> term at <strong>6.5% APR</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 dark:text-white">1. Calculating Net Principal (P)</h4>
            <ul className="list-disc list-inside space-y-1 text-neutral-500">
              <li>Vehicle Price: $35,000</li>
              <li>Minus Down Payment: -$5,000</li>
              <li>Minus Trade-In Value: -$3,000</li>
              <li><strong>Net Loan Principal (P): $27,000</strong></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 dark:text-white">2. Computing Monthly Payment</h4>
            <ul className="list-disc list-inside space-y-1 text-neutral-500">
              <li>Monthly rate (r): 6.5% / 12 / 100 = 0.005417</li>
              <li>Term in months (n): 60</li>
              <li>Monthly payment: $27,000 * [0.005417 * (1.005417)^60] / [(1.005417)^60 - 1]</li>
              <li><strong>Monthly Car Payment: $528.27</strong></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6">
        <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-500" />
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 space-y-2">
              <h4 className="font-bold text-neutral-950 dark:text-white text-sm sm:text-base">
                {faq.question}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Glossary */}
      <div className="space-y-6">
        <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-purple-500" />
          Car Finance Glossary
        </h3>
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {glossary.map((g, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row gap-2 sm:gap-6 items-start text-xs sm:text-sm">
              <span className="font-bold text-neutral-900 dark:text-white sm:w-48 shrink-0">
                {g.term}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">
                {g.definition}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Calculators Links */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/10 space-y-4">
        <h4 className="font-bold text-neutral-900 dark:text-white text-sm uppercase tracking-wider">
          Explore Related Financial Calculators
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { name: "Car Loan Calculator", slug: "car-loan-calculator" },
            { name: "EMI Calculator", slug: "emi-calculator" },
            { name: "Gas Mileage Calculator", slug: "gas-mileage-calculator" },
            { name: "BMICalculator", slug: "bmi-calculator" },
            { name: "Savings Calculator", slug: "savings-calculator" }
          ].map((calc, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate && onNavigate(calc.slug)}
              className="px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 rounded-lg hover:border-blue-500 dark:hover:border-cyan-400 transition flex items-center gap-1"
            >
              {calc.name}
              <ArrowRight className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
