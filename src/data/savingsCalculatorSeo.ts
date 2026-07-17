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
    question: "What is a Savings Calculator?",
    answer: "A Savings Calculator is a financial planning tool that helps you estimate how much money you can accumulate over a specific timeframe. By inputting factors like initial balances, regular recurring deposits, compounding intervals, expected interest rates, and inflation, you can project the future purchasing power of your nest egg entirely client-side."
  },
  {
    question: "How does compound interest differ from simple interest?",
    answer: "Simple interest is calculated solely on your initial principal amount. Compound interest is calculated on both the initial principal and the accumulated interest from previous periods. In short, compounding allows you to earn 'interest on interest,' leading to exponential growth over time."
  },
  {
    question: "How does compounding frequency impact savings growth?",
    answer: "The more frequently your savings interest compounds, the faster your balance grows. For example, daily compounding adds tiny increments of interest each day, which immediately begin earning interest themselves. Annual compounding only does this once per year. Over long periods, daily compounding yields a higher effective annual interest amount than monthly or quarterly compounding."
  },
  {
    question: "What are 'Savings Events'?",
    answer: "Savings Events are customized financial milestones that occur during your savings timeline—such as receiving a one-time inheritance deposit, planning a house down payment withdrawal, or scheduling recurring annual bonuses. Incorporating these real-world events provides a much more accurate reflection of your actual cash flow than simple flat formulas."
  },
  {
    question: "Why should I adjust my savings for inflation?",
    answer: "Inflation represents the gradual rise in prices, which erodes the purchasing power of your money. If inflation is 3% per year, a $100 basket of groceries today will cost $103 next year. Factoring in inflation helps you understand what your future savings balance will actually buy in today's terms."
  },
  {
    question: "How does the annual deposit increase option help?",
    answer: "Most people earn more as their careers progress and can afford to save more. An annual deposit increase (e.g., boosting your monthly savings by 5% or $50 each year) is one of the most powerful ways to accelerate wealth accumulation and combat inflation."
  },
  {
    question: "Can I calculate how to reach a specific financial goal?",
    answer: "Yes. By utilizing our Goal Planner, you can specify your target goal amount and the date you want to achieve it. The calculator will analyze your inputs and automatically compute the exact monthly deposit, interest rate, or annual contribution growth required to fill your savings gap."
  }
];

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: "Initial Principal",
    definition: "The starting amount of money placed into a savings vehicle before any additional recurring deposits are made or interest begins accumulating."
  },
  {
    term: "Annual Percentage Yield (APY)",
    definition: "The real rate of return earned on a savings account or investment over one year, taking the effects of compounding interest into account."
  },
  {
    term: "Compounding Frequency",
    definition: "How often interest is calculated and added back to the account principal (e.g., daily, monthly, quarterly, semi-annually, or annually)."
  },
  {
    term: "Inflation Rate",
    definition: "The percentage rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power is falling."
  },
  {
    term: "Purchasing Power",
    definition: "The value of a sum of money expressed in terms of the amount of goods or services that it can buy; inflation decreases this over time."
  },
  {
    term: "Management Fee",
    definition: "An ongoing fee charged by financial advisors, investment platforms, or banks for managing your portfolio, usually deducted as an annual percentage."
  },
  {
    term: "Tax Drag",
    definition: "The reduction in potential growth of a savings balance due to tax obligations on earned interest."
  },
  {
    term: "Savings Gap",
    definition: "The difference between your projected future savings balance and your target financial goal amount."
  },
  {
    term: "Step-Up Savings",
    definition: "The process of systematically increasing your savings contributions by a fixed percentage or absolute amount each year."
  }
];

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    title: "Example 1: Modeling Compound Interest",
    scenario: "Starting with $5,000, saving $250/month for 10 years at an annual interest rate of 5% compounded monthly.",
    calculation: "1. Initial Balance: $5,000\n2. Monthly Deposits: $250 for 120 months (Total deposits: $30,000)\n3. Monthly interest rate: 5% / 12 = 0.4167%\n4. Cumulative value with monthly compounding: Principal grows to $8,235.05 and deposits grow to $38,820.57.",
    outcome: "Ending Balance: $47,055.62 | Total Deposits: $35,000.00 | Net Interest Earned: $12,055.62"
  },
  {
    title: "Example 2: Overcoming Inflation",
    scenario: "You save $10,000 with $500 monthly additions for 15 years at 6% interest compounded daily, facing a steady 2.5% annual inflation rate.",
    calculation: "1. Nominal future value reaches $153,605.11.\n2. Total nominal deposits: $100,000.00.\n3. Deflating the nominal future value back 15 years at 2.5% annual compound discount: $153,605.11 / (1 + 0.025)^15.",
    outcome: "Nominal Balance: $153,605.11 | Real Inflation-Adjusted Value: $106,061.22 | Purchasing power preserved!"
  }
];

export const RELATED_CALCULATORS = [
  { name: "Compound Interest Calculator", slug: "compound-interest-calculator", category: "finance" },
  { name: "Investment Calculator", slug: "investment-calculator", category: "finance" },
  { name: "SIP Calculator", slug: "sip-calculator", category: "finance" },
  { name: "Retirement Calculator", slug: "retirement-calculator", category: "finance" },
  { name: "Future Value Calculator", slug: "future-value-calculator", category: "finance" },
  { name: "Budget Calculator", slug: "budget-calculator", category: "finance" },
  { name: "Emergency Fund Calculator", slug: "emergency-fund-calculator", category: "finance" }
];

export const EDUCATIONAL_CONTENT = {
  mainTitle: "How Savings Grow Over Time: The Power of Compounding",
  intro: "Understanding how savings accumulate is the cornerstone of personal financial planning. By deploying a systematic savings schedule and taking advantage of compounding frequencies, small, consistent deposits expand into substantial wealth pools. This educational guide breaks down the core concepts of savings mechanics, simple vs. compound interest, and how real-world friction like taxes, fees, and inflation shape your net savings.",
  
  sections: [
    {
      title: "1. What Is a Savings Calculator?",
      body: "A Savings Calculator is an advanced client-side framework designed to project the compound future value of your savings. By specifying parameters like principal, deposit frequency, annual yield, inflation, and customized deposit/withdrawal events, users can simulate their financial runway and evaluate scenario options safely without database tracking."
    },
    {
      title: "2. How Savings Grow: The Compound Interest Engine",
      body: "The core mechanic of savings accumulation is compound interest. Compound interest is the mathematical process where earned interest is added back to your balance, and subsequent interest calculations are applied to that larger amount. As time passes, the absolute interest generated in each period increases, producing an upward-curving J-shape growth trajectory."
    },
    {
      title: "3. Simple Interest vs. Compound Interest",
      body: "Simple interest pays interest only on your original principal balance. For example, saving $1,000 at 5% simple interest pays exactly $50 every single year. Compound interest, however, pays interest on your original principal PLUS any accrued interest. In Year 1 you earn $50, making your balance $1,050. In Year 2 you earn 5% on $1,050, which is $52.50. This small difference grows into thousands of dollars over long timelines."
    },
    {
      title: "4. The Critical Role of Compounding Frequency",
      body: "Compounding frequency specifies how often the bank calculates interest and deposits it into your account. Common frequencies include daily, monthly, quarterly, semi-annually, and annually. The formula for compound interest is:\n\nA = P * (1 + r / n)^(n * t)\n\nWhere 'A' is the final amount, 'P' is principal, 'r' is interest rate, 'n' is compounding frequency, and 't' is years. More frequent compounding (e.g., daily, n=365) means interest is earned sooner and compounds faster, raising your overall Annual Percentage Yield (APY)."
    },
    {
      title: "5. Saving for Core Financial Milestones",
      body: "A systematic savings strategy is vital for distinct lifestyle objectives:\n\n• Emergency Funds: Financial planners recommend maintaining 3 to 6 months of liquid expenses in a High-Yield Savings Account (HYSA) to weather unexpected job loss, medical costs, or car repairs.\n• Retirement Savings: Compounding requires time. Starting early allows even modest savings to expand dramatically before you transition out of the workforce.\n• Home Down Payments: Accumulating a 20% down payment prevents the burden of private mortgage insurance (PMI) and secures favorable loan rates.\n• Higher Education: Leveraging tax-advantaged college funds or interest-bearing instruments ensures tuition capital is fully prepared when enrollment dates arrive."
    },
    {
      title: "6. How Inflation Affects Savings",
      body: "Inflation is the invisible tax that erodes purchasing power. While nominal balances grow in your savings account, the goods and services you intend to buy also cost more. For instance, at 3% annual inflation, $10,000 today will only buy about $7,400 worth of goods in 10 years. To maintain real purchasing power, your savings interest rate must exceed the prevailing inflation rate. This calculator models real inflation-adjusted future values to give you an accurate view of your future wealth's true strength."
    },
    {
      title: "7. Financial Goal Planning & Gap Analysis",
      body: "Effective goal planning requires knowing where you are, where you want to be, and the path in between. By establishing a Target Savings amount and a Target Date, you can isolate the Savings Gap—the difference between your automatic projection and your goal. Our planner works backwards to reveal the required monthly deposit or interest rate needed to cross the finish line on time."
    }
  ]
};
