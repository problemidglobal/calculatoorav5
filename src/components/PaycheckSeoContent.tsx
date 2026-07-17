import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Bookmark, 
  Lightbulb, 
  Info, 
  TrendingUp, 
  ChevronDown 
} from 'lucide-react';

export default function PaycheckSeoContent() {
  const faqList = [
    {
      question: "What is the difference between Gross Pay and Net Pay?",
      answer: "Gross Pay is the total amount of money earned before any tax withholdings, medical contributions, or retirement funds are subtracted. Net Pay is the actual 'take-home' pay that you receive in your bank account after all pre-tax and post-tax deductions are processed."
    },
    {
      question: "What is a pre-tax deduction?",
      answer: "A pre-tax deduction is an amount subtracted from your gross pay before income taxes are calculated. Examples include traditional 401(k) contributions, health insurance premiums, and health savings account (HSA) allocations. These reduce your total taxable income, saving you money on taxes."
    },
    {
      question: "How does overtime affect my paycheck?",
      answer: "Overtime is typically earned by hourly employees who work more than 40 hours in a standard workweek. Under federal law (such as the FLSA in the US), overtime must be paid at a rate of at least 1.5 times the regular hourly wage. Double or triple overtime can be applied depending on company policy or local state laws."
    },
    {
      question: "Are bonuses taxed differently than standard wages?",
      answer: "In many tax jurisdictions, bonuses are considered supplemental wages. Lenders or governments may withhold taxes on bonuses at a flat supplemental tax rate (e.g., 22% federally in the US) which might differ from your regular marginal tax bracket. However, when you file your annual tax return, bonuses are treated as standard ordinary income."
    },
    {
      question: "What is the standard number of hours worked annually?",
      answer: "Assuming a standard full-time work week of 40 hours for 52 weeks, a full-time employee works exactly 2,080 hours per year. This constant is used by payroll departments to convert annual salaries into hourly rates."
    }
  ];

  const relatedCalculators = [
    { name: 'Salary Calculator', hash: '#/finance/salary-converter-calculator' },
    { name: 'Hourly Wage Calculator', hash: '#/finance/hourly-wage-calculator' },
    { name: 'Overtime Calculator', hash: '#/all-calculators' },
    { name: 'Tax Calculator', hash: '#/all-calculators' },
    { name: 'Payroll Calculator', hash: '#/all-calculators' },
    { name: 'Take Home Pay Calculator', hash: '#/all-calculators' }
  ];

  return (
    <article className="mt-12 pt-12 border-t border-neutral-100 dark:border-neutral-800 space-y-12 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
      
      {/* 1. Core Introduction Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-neutral-950 dark:text-white">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <h2 className="text-2xl font-black tracking-tight">Paycheck Calculator: Ultimate Personal Finance Guide</h2>
        </div>
        <p className="text-base text-neutral-500 dark:text-neutral-400">
          Understanding the details of your paystub is vital for smart financial planning. The **Paycheck Calculator** is designed to provide high-fidelity, client-side simulations of your paycheck, factoring in base pay, overtime premium schedules, discretionary bonuses, commissions, pre-tax deductions, and post-tax deductions. Learn exactly how your net take-home salary is computed, and compare different workplace scenarios with absolute precision.
        </p>
      </section>

      {/* 2. Gross vs Net Pay */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h3 className="text-lg font-black text-neutral-900 dark:text-white">Gross Pay vs. Net Pay Explained</h3>
          <p>
            The difference between gross and net pay is often the biggest surprise on an employee's first paycheck:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Gross Pay:</strong> The total raw earnings accumulated before any withholdings. This includes base wage, overtime, bonus incentives, commission, and other cash allowances.</li>
            <li><strong>Net Pay:</strong> Often referred to as take-home pay, this is the final sum deposited into your bank account. It is computed as Gross Pay minus all taxes and benefits.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-black text-neutral-900 dark:text-white">How Paychecks Are Calculated</h3>
          <p>
            Payroll departments execute calculations in structured stages:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Sum all gross earnings sources (Regular + Overtime + Bonuses).</li>
            <li>Subtract pre-tax deductions (reducing the overall taxable base).</li>
            <li>Calculate and subtract income tax withholdings from the remaining taxable base.</li>
            <li>Subtract all post-tax deductions.</li>
            <li>The final remaining value is your net take-home pay.</li>
          </ol>
        </div>
      </section>

      {/* 3. Hourly vs Salary Employees */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h3 className="text-lg font-black text-neutral-900 dark:text-white">Hourly vs. Salary Employees</h3>
          <p>
            The legal and financial classification of your employment drastically affects how your wages are processed:
          </p>
          <p>
            <strong>Hourly Employees:</strong> Paid a fixed rate for every hour worked. Under federal labor laws, non-exempt hourly employees are eligible for overtime multipliers (1.5x) when exceeding 40 hours per workweek.
          </p>
          <p>
            <strong>Salary Employees:</strong> Compensated with a fixed periodic rate based on an annual contract, regardless of how many hours they work. Exempt salary workers are typically excluded from overtime benefits.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-black text-neutral-900 dark:text-white">Overtime & Supplemental Earnings</h3>
          <p>
            Overtime calculations can involve multiple tiers:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Regular Overtime (Time and a Half):</strong> 1.5x the hourly base.</li>
            <li><strong>Double Time:</strong> 2.0x base, common on holidays or consecutive working days.</li>
            <li><strong>Triple Time:</strong> 3.0x base, applied in extreme emergency conditions or union agreements.</li>
          </ul>
        </div>
      </section>

      {/* 4. Pre-Tax vs Post-Tax Deductions */}
      <section className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-800 space-y-3">
        <h3 className="text-lg font-black text-neutral-900 dark:text-white">Pre-Tax vs. Post-Tax Deductions</h3>
        <p className="text-sm">
          Understanding the tax treatment of your deductions is crucial for tax efficiency:
        </p>
        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          <strong>Pre-Tax Deductions:</strong> Withdrawn from gross pay before income taxes are computed. This lowers your taxable income, reducing the amount of income tax you owe today. Common examples include 410(k) retirement contributions, dental/health premiums, and HSA balances.
        </p>
        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          <strong>Post-Tax Deductions:</strong> Taken out of your paycheck after taxes have been calculated. These do not reduce your current tax liability. Common examples include Roth 401(k) allocations, union fees, charity contributions, or court-ordered garnishments.
        </p>
      </section>

      {/* 5. Real Examples */}
      <section className="space-y-3">
        <h3 className="text-lg font-black text-neutral-900 dark:text-white">Real-World Paycheck Calculation Example</h3>
        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-800 space-y-2">
          <p className="font-bold text-neutral-850 dark:text-neutral-200">Hourly Wage Scenario:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Regular Earnings: 40 hours worked at $25.00/hour = $1,000.00</li>
            <li>Overtime Earnings: 5 hours worked at $37.50/hour (1.5x) = $187.50</li>
            <li>Total Gross Earnings: $1,187.50</li>
            <li>Pre-Tax Health Insurance Deduction: $50.00 (Taxable Income falls to $1,137.50)</li>
            <li>Estimated Income Tax Withholding (15%): $170.63</li>
            <li>Post-Tax Retirement Contribution: $40.00</li>
            <li><strong>Net Take-Home Pay: $926.87</strong></li>
          </ul>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-neutral-950 dark:text-white">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-black tracking-tight">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-neutral-150 dark:divide-neutral-800 border-t border-b border-neutral-150 dark:border-neutral-800">
          {faqList.map((item, index) => (
            <div key={index} className="py-4 space-y-1.5">
              <span className="font-extrabold text-neutral-900 dark:text-white block">{item.question}</span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Glossary Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-neutral-950 dark:text-white">
          <Bookmark className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-black">Glossary of Auto Payroll & Paycheck Terms</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Withholding:</strong> The portion of employee wages withheld by an employer and paid directly to the government as tax payment.</p>
          <p><strong>Supplemental Wage:</strong> Non-regular compensation like bonuses, tips, commissions, or overtime premiums.</p>
          <p><strong>FLSA (Fair Labor Standards Act):</strong> US federal law establishing minimum wage, overtime pay eligibility, recordkeeping, and child labor rules.</p>
          <p><strong>Take-Home Pay:</strong> The net salary remaining after taxes and deductions are removed from your gross salary.</p>
        </div>
      </section>

      {/* 8. Related Calculators */}
      <section className="space-y-3">
        <h3 className="text-lg font-black text-neutral-900 dark:text-white">Related Financial Calculators</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {relatedCalculators.map((calc, idx) => (
            <a
              key={idx}
              href={calc.hash}
              className="p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-150 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-cyan-400 text-neutral-800 dark:text-neutral-300 transition text-center font-bold text-xs"
            >
              {calc.name}
            </a>
          ))}
        </div>
      </section>

      {/* 9. JSON-LD Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "@id": "https://calculatoora.com/calculators/paycheck-calculator#webapp",
                "url": "https://calculatoora.com/calculators/paycheck-calculator",
                "name": "Ultimate Paycheck Calculator | Calculatoora",
                "applicationCategory": "FinanceApplication",
                "operatingSystem": "All",
                "browserRequirements": "Requires HTML5, CSS3, ES6 support",
                "description": "Calculate gross paycheck earnings, pre-tax benefits, post-tax deductions, and estimated tax allocations entirely on the client side.",
                "offers": {
                  "@type": "Offer",
                  "price": "0.00",
                  "priceCurrency": "USD"
                }
              },
              {
                "@type": "FAQPage",
                "@id": "https://calculatoora.com/calculators/paycheck-calculator#faq",
                "mainEntity": faqList.map(item => ({
                  "@type": "Question",
                  "name": item.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                  }
                }))
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Calculatoora",
                    "item": "https://calculatoora.com/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Finance",
                    "item": "https://calculatoora.com/finance"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Paycheck Calculator",
                    "item": "https://calculatoora.com/calculators/paycheck-calculator"
                  }
                ]
              }
            ]
          })
        }}
      />
    </article>
  );
}
