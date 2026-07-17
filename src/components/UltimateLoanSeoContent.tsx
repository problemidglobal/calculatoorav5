import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Compass, 
  ArrowRight,
  Info
} from 'lucide-react';

interface FAQState {
  [key: number]: boolean;
}

export default function UltimateLoanSeoContent() {
  const [faqOpen, setFaqOpen] = useState<FAQState>({
    0: true, // leave first open by default
  });

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const faqs = [
    {
      question: "What is a Loan Amortization Schedule?",
      answer: "An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that make up each payment until the loan is paid off at the end of its term. Early in the term, most of each payment goes toward interest. Late in the term, the payment goes almost entirely toward principal. Our scheduler is dynamic, recalculating when you model variable rate shifts or add extra principal payments."
    },
    {
      question: "How does the Loan Compounding Frequency affect my payments?",
      answer: "Compounding frequency determines how often interest is calculated and added to the principal balance. More frequent compounding (e.g. Daily compounding instead of Monthly compounding) means interest builds up faster, slightly increasing your overall financing costs. Standard mortgages compound monthly or semi-annually depending on regional legal codes (such as Canadian mortgages compounded semi-annually)."
    },
    {
      question: "What are the benefits of making Bi-weekly instead of Monthly payments?",
      answer: "Making bi-weekly payments means you complete 26 half-payments per year, which equates to 13 full payments—effectively one extra full month's payment each year. This accelerated schedule reduces your principal faster, compounding massive interest savings and shaving years off long-term mortgages without impacting your baseline lifestyle cash flows."
    },
    {
      question: "What is the difference between APR and the Nominal Interest Rate?",
      answer: "The nominal interest rate is the base percentage charged by lenders on your outstanding principal. The Annual Percentage Rate (APR) represents the true yearly cost of capital, combining the nominal rate with upfront administrative fees, origination charges, and mandatory mortgage insurance. Comparing APR across lenders is the most accurate way to evaluate financing options."
    },
    {
      question: "What does Negative Amortization mean?",
      answer: "Negative amortization occurs when your scheduled periodic payment is smaller than the interest accrued during that period. Instead of decreasing, your outstanding loan principal balance increases, as the unpaid interest is 'capitalized' (added to the principal balance). This often occurs during deferred payment grace periods or under specific adjust-rate mortgages."
    }
  ];

  const glossaryTerms = [
    { term: "Amortization", definition: "The systematic repayment of a debt balance over a designated schedule, dividing installments into interest and principal portions." },
    { term: "Annual Percentage Rate (APR)", definition: "The true annual cost of borrowing, incorporating the nominal interest rate along with upfront origination fees, closing charges, and insurance premiums." },
    { term: "Balloon Payment", definition: "A disproportionately large final payment scheduled at the end of a loan term, typically used to lower intermediate monthly payments." },
    { term: "Capitalized Interest", definition: "Accrued interest that is unpaid and subsequently added to the principal loan balance, which thereafter compounds and increases debt." },
    { term: "Closing Costs", definition: "Administrative and legal fees paid at the final execution of a real estate or mortgage transaction, typically ranging from 2% to 5% of the loan amount." },
    { term: "Compounding Frequency", definition: "The rate at which accrued interest is calculated and capitalized. Frequencies include daily, weekly, bi-weekly, monthly, quarterly, or annually." },
    { term: "Debt-to-Income (DTI)", definition: "A personal finance ratio matching your monthly debt liabilities to gross monthly earnings, used by lenders to assess risk limits." },
    { term: "Down Payment", definition: "An upfront cash contribution provided toward an asset purchase, reducing the initial principal balance required for commercial financing." },
    { term: "Effective Annual Rate (EAR)", definition: "The true annual rate of interest calculated after compounding interest multiple times per year." },
    { term: "Grace Period", definition: "A designated initial window during which no payments are required, or payments are limited strictly to interest charges." },
    { term: "Loan-to-Value (LTV)", definition: "An investment risk ratio dividing outstanding loan principal by the market value of the underlying asset." },
    { term: "Mortgage Insurance (PMI)", definition: "Lender-protection insurance required when financing more than 80% of an asset's purchase price, paid by the borrower." },
    { term: "Principal Balance", definition: "The core sum of money originally borrowed on a loan, or the portion remaining unpaid, excluding interest or administrative fees." },
    { term: "Refinancing", definition: "The process of replacing an active credit obligation with a new debt structure, usually to secure a lower interest rate or better terms." },
    { term: "Stamp Duty", definition: "A state or provincial tax levied on the formal transfer of property, contracts, or mortgage documents." }
  ];

  return (
    <div className="space-y-12 py-8 px-4 max-w-4xl mx-auto border-t border-neutral-100 dark:border-neutral-850 text-left font-sans print:hidden">
      
      {/* 1. COMPREHENSIVE TEXT GUIDE */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 bg-blue-500/5 text-blue-600 dark:text-cyan-400 border border-blue-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase select-none">
          <BookOpen className="w-3.5 h-3.5" /> Mathematical Reference Guide
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
          How Amortization &amp; Compound Interest Work
        </h2>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300 space-y-4 leading-relaxed text-sm">
          <p>
            Understanding the math behind your loan structure is the single most important step in protecting your personal wealth. Most retail financing—whether a home mortgage, a personal loan, or a commercial credit facility—employs <strong>amortizing interest structures</strong>.
          </p>
          <p>
            Unlike simple credit agreements, where interest is calculated strictly on the initial capital, amortized compounds determine interest based on the <strong>remaining outstanding principal</strong> at the start of each period.
          </p>
          
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white pt-2">The Standard Amortization Formula</h3>
          <p>
            To resolve a standard recurring payment installment (such as a monthly mortgage payment), commercial institutions use the following compound equation:
          </p>
          
          <div className="my-5 p-5 bg-neutral-50 dark:bg-neutral-905 rounded-2xl border border-neutral-150 dark:border-neutral-800 text-center font-mono text-sm sm:text-base text-blue-600 dark:text-cyan-400 font-bold overflow-x-auto">
            PMT = P &times; [ r(1 + r)<sup>n</sup> ] / [ (1 + r)<sup>n</sup> - 1 ]
          </div>
          
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>PMT</strong> = Recurring payment amount per compounding period</li>
            <li><strong>P</strong> = Outstanding principal sum (Asset value minus your down payment)</li>
            <li><strong>r</strong> = Periodic interest rate (Annual rate divided by payment frequency)</li>
            <li><strong>n</strong> = Total number of payment periods over the term life</li>
          </ul>

          <p className="pt-2">
            By analyzing this formula, it becomes clear that early payments are dominated by the interest multiplier (since principal <em>P</em> is at its maximum). As you chip away at the debt, <em>P</em> shrinks, causing the portion of your payment allocated to interest to decrease and the portion applied to principal to expand.
          </p>
        </div>
      </section>

      {/* 2. WALKTHROUGH EXAMPLE SECTION */}
      <section className="p-6 sm:p-8 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/10 rounded-3xl space-y-5">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-blue-600 dark:text-cyan-400 tracking-wider">
          <Sparkles className="w-4 h-4" /> concrete loan example
        </div>
        <h3 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">Walkthrough: Financing a $300,000 Home</h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Suppose you buy a home for <strong>$300,000</strong>. You provide a <strong>20% down payment ($60,000)</strong>, leaving an initial loan principal of <strong>$240,000</strong>. Your lender charges a <strong>6.5% interest rate</strong> on a <strong>30-year fixed term</strong> compounded monthly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-blue-500/10 space-y-1 text-left">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">First Payment Installment</span>
            <p className="text-sm font-black text-neutral-800 dark:text-white font-mono">Total PMT: $1,516.94</p>
            <p className="text-[11px] text-neutral-500">Interest Split: $1,300.00 (85.7%)</p>
            <p className="text-[11px] text-emerald-500 font-bold">Principal Split: $216.94 (14.3%)</p>
          </div>

          <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-blue-500/10 space-y-1 text-left">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">Payment #300 (Year 25)</span>
            <p className="text-sm font-black text-neutral-800 dark:text-white font-mono">Total PMT: $1,516.94</p>
            <p className="text-[11px] text-neutral-500">Interest Split: $436.43 (28.8%)</p>
            <p className="text-[11px] text-emerald-500 font-bold">Principal Split: $1,080.51 (71.2%)</p>
          </div>
        </div>

        <p className="text-[11px] text-neutral-400 italic leading-relaxed pt-2">
          * Notice how the principal portion grows exponentially as the outstanding balance decays. By prepaying an extra $150 per month from day one, you would shave 5 years off this 30-year loan and save $45,830 in total interest!
        </p>
      </section>

      {/* 3. INTERACTIVE FAQ ACCORDION */}
      <section className="space-y-6">
        <div className="flex items-center gap-1.5 text-xs font-black text-neutral-850 dark:text-white uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-blue-500" /> Frequently Asked Questions
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = !!faqOpen[idx];
            return (
              <div 
                key={idx} 
                className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900/40"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-neutral-850 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-850/20 transition cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-550 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-850/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. GLOSSARY */}
      <section className="space-y-6">
        <div className="flex items-center gap-1.5 text-xs font-black text-neutral-850 dark:text-white uppercase tracking-wider">
          <Info className="w-4 h-4 text-blue-500" /> Financial Glossary
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {glossaryTerms.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-150 dark:border-neutral-800 space-y-1.5">
              <span className="font-bold text-xs text-neutral-900 dark:text-white font-sans">{item.term}</span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.definition}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
