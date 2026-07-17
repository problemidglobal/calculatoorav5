export interface FaqItem {
  question: string;
  answer: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface WorkedExample {
  title: string;
  scenario: string;
  calculation: string;
  outcome: string;
}

export const FAQ_ARTICLES: FaqItem[] = [
  {
    question: "What is the difference between Marginal Tax and Effective Tax?",
    answer: "Your marginal tax rate is the rate of tax applied to your highest tier of earnings (the rate paid on the absolute last dollar of income). Your effective tax rate is the actual percentage of your total gross income paid in taxes (calculated as Total Tax divided by Gross Income). In progressive tax systems, the effective tax rate is almost always lower than the marginal tax rate."
  },
  {
    question: "What is the difference between a tax deduction and a tax credit?",
    answer: "A tax deduction reduces your Taxable Income (for example, a $1,000 deduction reduces taxable income by $1,000, saving you $200 if you are in the 20% bracket). A tax credit, on the other hand, reduces your actual Tax Liability dollar-for-dollar (a $1,000 credit saves you exactly $1,000 in taxes)."
  },
  {
    question: "How does a Progressive Tax system work?",
    answer: "In a progressive tax system, your income is divided into segments (brackets). Each segment is taxed at its corresponding rate. Your entire income is NOT taxed at the highest bracket rate; rather, only the amount falling within each bracket's boundaries is taxed at that bracket's rate."
  },
  {
    question: "How is Capital Gains Tax calculated in this tool?",
    answer: "This global tool separates your general taxable income from capital gains. It applies regular income tax brackets (or a flat tax rate) to your ordinary income, and isolates capital gains tax using standard default rate incentives (often 15% or a customized capital gains rate) to accurately simulate multi-asset portfolios."
  },
  {
    question: "Can I use this tool for any country?",
    answer: "Yes, this tool is fully country-agnostic. It does not hardcode any country's specific tax codes. You can manually input your local tax brackets, deductions, credits, and surcharges to model the tax policy of any country, region, or state worldwide."
  }
];

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: "Gross Income",
    definition: "The total amount of individual or business earnings accumulated before subtracting any tax deductions, retirement savings, or exemptions."
  },
  {
    term: "Taxable Income",
    definition: "The adjusted portion of your gross income that is subject to taxation after taking standard deductions, retirement contributions, and personal exemptions into account."
  },
  {
    term: "Effective Tax Rate",
    definition: "The true percentage of your gross earnings paid to the government, computed by dividing your final Net Tax by your Gross Income."
  },
  {
    term: "Marginal Tax Rate",
    definition: "The tax bracket percentage that applies to the last or highest dollar of taxable income earned."
  },
  {
    term: "Tax Deduction",
    definition: "An expense that can be subtracted from your gross income to lower your overall taxable income base."
  },
  {
    term: "Tax Credit",
    definition: "A direct, dollar-for-dollar reduction of your computed final tax liability."
  },
  {
    term: "Tax Rebate",
    definition: "A return of part of a payment, or a reduction of tax liability granted retroactively."
  },
  {
    term: "Surcharge",
    definition: "An additional fee, tax, or penalty added onto your baseline computed income tax liability."
  },
  {
    term: "Tax Withheld",
    definition: "The portion of employee wages withheld directly by employers as prepayment towards estimated annual taxes."
  }
];

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    title: "Scenario 1: Simple Flat Tax Calculation",
    scenario: "A user earns $80,000 in base salary and is subject to a flat tax rate of 20% with an optional standard deduction of $10,000.",
    calculation: "1. Gross Income = $80,000\n2. Deductions = $10,000\n3. Taxable Income = $70,000\n4. Flat Tax = $70,000 * 20% = $14,000",
    outcome: "Total Tax: $14,000 | Effective Tax Rate: 17.50% | Net Income: $66,000"
  },
  {
    title: "Scenario 2: Progressive Bracket Tax Calculation",
    scenario: "An individual earns $120,000 and standard deductions of $15,000 apply. They configure progressive brackets: 10% up to $20,000, 15% up to $50,000, and 25% for everything above.",
    calculation: "1. Gross Income = $120,000\n2. Deductions = $15,000\n3. Taxable Income = $105,000\n4. Bracket 1 (10% on first $20k) = $2,000\n5. Bracket 2 (15% on next $30k) = $4,500\n6. Bracket 3 (25% on remaining $55k) = $13,750\n7. Total Tax = $2,000 + $4,500 + $13,750 = $20,250",
    outcome: "Total Tax: $20,250 | Effective Tax Rate: 16.88% | Net Income: $99,750"
  }
];

export const RELATED_CALCULATORS = [
  { name: "Income Tax Calculator", slug: "income-tax-calculator", category: "finance" },
  { name: "Salary Calculator", slug: "salary-tax-calculator", category: "finance" },
  { name: "Payroll Calculator", slug: "payroll-calculator", category: "business" },
  { name: "Paycheck Calculator", slug: "payroll-calculator", category: "business" },
  { name: "Mortgage Calculator", slug: "mortgage-calculator", category: "finance" },
  { name: "Capital Gains Calculator", slug: "capital-gains-tax-calculator", category: "finance" },
  { name: "VAT Calculator", slug: "vat-calculator", category: "finance" },
  { name: "Sales Tax Calculator", slug: "sales-tax-calculator", category: "finance" },
  { name: "GST Calculator", slug: "gst-calculator", category: "finance" }
];
