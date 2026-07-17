import { Calculator } from '../types';

export const V12_PART1_CALCULATORS: Calculator[] = [
  // ==================== PERSONAL SAFETY & SECURITY ====================
  {
    id: 'password-entropy',
    name: 'Password Entropy Calculator',
    slug: 'password-entropy-calculator',
    category: 'personal-safety',
    description: 'Calculate password strength in bits of entropy and estimate real-world brute-force crack time.',
    seoTitle: 'Password Entropy Strength & Crack Time Calculator',
    seoDescription: 'Obtain precise bits of entropy and calculate brute-force resistance for any passkey.',
    inputs: [
      { id: 'length', label: 'Password Length (Characters)', type: 'number', defaultValue: 12, min: 1, max: 128 },
      { id: 'hasLowercase', label: 'Includes Lowercase letters (a-z)', type: 'select', defaultValue: 'yes', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { id: 'hasUppercase', label: 'Includes Uppercase letters (A-Z)', type: 'select', defaultValue: 'yes', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { id: 'hasDigits', label: 'Includes Digits (0-9)', type: 'select', defaultValue: 'yes', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { id: 'hasSymbols', label: 'Includes Special Symbols (!@#$ etc.)', type: 'select', defaultValue: 'no', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] }
    ],
    formula: 'Pool Size (L) = 26 (lower) + 26 (upper) + 10 (digits) + 33 (symbols)\nEntropy = Length * log2(Pool Size)',
    explanation: 'Entropy measures the unpredictable complexity of a sequence. A higher entropy count exponentially expands the time a computer needs to guess your secret.',
    example: 'A 12-character password using lowercase, uppercase, and numbers has a pool size of 62. Its entropy is 71.4 bits, taking months to brute-force under optimal setup.',
    faq: [
      { question: 'What is a secure entropy range?', answer: 'Under 50 bits is weak, 50-79 is moderate, and 80+ bits is very secure.' }
    ],
    relatedSlugs: ['password-combination-calculator', 'privacy-score-calculator'],
    keywords: ['password entropy bits', 'brute force crack time', 'cyber hygiene score', 'passkey complexity tool'],
    calculate: (inputs) => {
      const len = Math.max(1, Number(inputs.length || 12));
      let pool = 0;
      if (inputs.hasLowercase === 'yes') pool += 26;
      if (inputs.hasUppercase === 'yes') pool += 26;
      if (inputs.hasDigits === 'yes') pool += 10;
      if (inputs.hasSymbols === 'yes') pool += 32;
      if (pool === 0) pool = 1;

      const entropy = len * (Math.log(pool) / Math.log(2));
      const totalCombinations = Math.pow(pool, len);
      // Assume a high-speed cracking array doing 100 Billion guesses/sec
      const guessesPerSec = 100_000_000_000;
      const secondsToCrack = totalCombinations / guessesPerSec;
      
      let crackTimeStr = '';
      if (secondsToCrack < 1) crackTimeStr = 'Instantaneous';
      else if (secondsToCrack < 60) crackTimeStr = `${secondsToCrack.toFixed(1)} Seconds`;
      else if (secondsToCrack < 3600) crackTimeStr = `${(secondsToCrack/60).toFixed(1)} Minutes`;
      else if (secondsToCrack < 86400) crackTimeStr = `${(secondsToCrack/3600).toFixed(1)} Hours`;
      else if (secondsToCrack < 31_536_000) crackTimeStr = `${(secondsToCrack/86400).toFixed(1)} Days`;
      else if (secondsToCrack < 3_153_600_000) crackTimeStr = `${(secondsToCrack/31_536_000).toFixed(1)} Years`;
      else crackTimeStr = 'Centuries/Millennia';

      return {
        results: [
          { label: 'Entropy Strength', value: `${entropy.toFixed(1)} Bits`, isPrimary: true },
          { label: 'Brute-Force Attack Window', value: crackTimeStr },
          { label: 'Complexity Pool Scale', value: pool.toString(10) }
        ],
        chartData: [
          { name: 'Entropy Bits', value: Math.round(entropy) },
          { name: 'Target Safe Barrier', value: 80 }
        ]
      };
    }
  },
  {
    id: 'password-combination',
    name: 'Password Combination Calculator',
    slug: 'password-combination-calculator',
    category: 'personal-safety',
    description: 'Determine the total possible unique password combinations based on selected character options.',
    seoTitle: 'Total Password Combinations Math Solver',
    seoDescription: 'Input password length and options to calculate total permutations and complexity indicators.',
    inputs: [
      { id: 'length', label: 'Password Length', type: 'number', defaultValue: 8, min: 1 },
      { id: 'poolSize', label: 'Character Set Size (e.g., 62 for alphanumeric)', type: 'number', defaultValue: 62 }
    ],
    formula: 'Combinations = PoolSize ^ Length',
    explanation: 'Demonstrates mathematically how small increments in character variety and length yield massive increases in absolute uniqueness.',
    example: 'An 8-character password with a 62-character pool has 2.18 x 10^14 possible combinations.',
    faq: [{ question: 'How does length affect combinations?', answer: 'Length scales combinations exponentially, while pool size scales them polynomially.' }],
    relatedSlugs: ['password-entropy-calculator'],
    keywords: ['password combinations metric', 'permutations exponent', 'character set pool size'],
    calculate: (inputs) => {
      const len = Math.max(1, Number(inputs.length || 8));
      const pool = Math.max(1, Number(inputs.poolSize || 62));
      const combs = Math.pow(pool, len);

      return {
        results: [
          { label: 'Total Combinations', value: combs.toExponential(2), isPrimary: true },
          { label: 'Length Weight', value: `${len} characters` }
        ],
        chartData: [
          { name: 'Pool Size', value: pool }
        ]
      };
    }
  },
  {
    id: 'security-risk',
    name: 'Security Risk Calculator',
    slug: 'security-risk-calculator',
    category: 'personal-safety',
    description: 'Evaluate physical or digital risk levels based on hazard likelihood and business impact indicators.',
    seoTitle: 'Standard Security Risk Matrix & Level Calculator',
    seoDescription: 'Assess likelihood and impact parameters to calculate your risk severity classification.',
    inputs: [
      { id: 'likelihood', label: 'Likelihood score (1 to 5)', type: 'number', defaultValue: 3, min: 1, max: 5 },
      { id: 'impact', label: 'Consequence Impact score (1 to 5)', type: 'number', defaultValue: 4, min: 1, max: 5 }
    ],
    formula: 'Risk Score = Likelihood * Impact (Scale of 1-25)',
    explanation: 'Risk evaluation aids in identifying priorities. Scores from 1 to 25 categorize risk as Low, Medium, High, or Critical.',
    example: 'A scenario with a likelihood of 3 and impact of 4 results in a Risk Score of 12 (Medium-High Risk).',
    faq: [{ question: 'What is the risk matrix threshold?', answer: 'Scores under 5 are low, 6-12 medium, 15-20 high, and 25 critical.' }],
    relatedSlugs: ['data-breach-risk-calculator', 'privacy-score-calculator'],
    keywords: ['security risk index', 'likelihood vs impact matrix', 'threat level score'],
    calculate: (inputs) => {
      const l = Math.min(5, Math.max(1, Number(inputs.likelihood || 3)));
      const i = Math.min(5, Math.max(1, Number(inputs.impact || 4)));
      const score = l * i;
      
      let level = 'Low';
      if (score >= 15) level = 'High / Critical';
      else if (score >= 8) level = 'Medium';

      return {
        results: [
          { label: 'System Risk Rating', value: `${score} / 25`, isPrimary: true },
          { label: 'Severity Classification', value: level }
        ],
        chartData: [
          { name: 'Your Score', value: score },
          { name: 'Critical Threshold', value: 15 }
        ]
      };
    }
  },
  {
    id: 'data-breach-risk',
    name: 'Data Breach Risk Calculator',
    slug: 'data-breach-risk-calculator',
    category: 'personal-safety',
    description: 'Estimate the probability and financial impact risk of data leakage based on defense posture.',
    seoTitle: 'Information Data Breach Risk Assessment Calculator',
    seoDescription: 'Analyze your company defense vectors to estimate the statistical probability of a breach.',
    inputs: [
      { id: 'employees', label: 'Total Company Employees count', type: 'number', defaultValue: 45, min: 1 },
      { id: 'hasMfa', label: 'Is Multi-Factor Auth enforced?', type: 'select', defaultValue: 'yes', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { id: 'hasTraining', label: 'Annual Cybersecurity Training?', type: 'select', defaultValue: 'no', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] }
    ],
    formula: 'Estimated Risk = Base Coefficient adjusted by multi-factor mitigation offsets',
    explanation: 'Human factors represent the single largest breach risk. Missing simple defense items like MFA or team hygiene training can double exposure probabilities.',
    example: 'A 45-employee office without safety training carries an elevated annual breach probability of 34%.',
    faq: [{ question: 'Does MFA block all breaches?', answer: 'MFA blocks up to 99% of bulk automated credential stuffing attacks, making it essential.' }],
    relatedSlugs: ['security-risk-calculator', 'account-security-calculator'],
    keywords: ['data leak risk statistic', 'mfa safety factors', 'cyber threat mitigation index'],
    calculate: (inputs) => {
      const emp = Number(inputs.employees || 45);
      let prob = 10 + Math.min(45, emp * 0.2);

      if (inputs.hasMfa === 'no') prob += 30;
      if (inputs.hasTraining === 'no') prob += 15;
      prob = Math.min(95, prob);

      return {
        results: [
          { label: 'Estimated Annual Breach Incident Risk', value: `${prob.toFixed(1)}%`, isPrimary: true },
          { label: 'Threat Index Level', value: prob > 50 ? 'High Risk' : prob > 25 ? 'Moderate' : 'Low' }
        ],
        chartData: [
          { name: 'Breach Likelihood', value: Math.round(prob) },
          { name: 'Safety Margin', value: 100 - Math.round(prob) }
        ]
      };
    }
  },
  {
    id: 'privacy-score',
    name: 'Privacy Score Calculator',
    slug: 'privacy-score-calculator',
    category: 'personal-safety',
    description: 'Rate your personal metadata privacy footprint based on active setups and software habits.',
    seoTitle: 'Online Footprint & Personal Privacy Score Calculator',
    seoDescription: 'Grade your online identity protection status out of 100 with actionable feedback points.',
    inputs: [
      { id: 'vpn', label: 'Use secondary secure dynamic networks (VPN)?', type: 'select', defaultValue: 'no', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { id: 'browser', label: 'Default client browser setup type', type: 'select', defaultValue: 'chrome', options: [{ label: 'Standard Chrome/Edge', value: 'chrome' }, { label: 'Privacy Hardened (Brave/Firefox)', value: 'privacy' }] },
      { id: 'adblock', label: 'Active Ad-Tracker block tools?', type: 'select', defaultValue: 'yes', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] }
    ],
    formula: 'Internal Grade = Base Score minus tracking penalties and metadata exposure coefficients.',
    explanation: 'Most modern ad systems profile device characteristics. Blocking trackers and choosing privacy-focused browsers reduces metadata tracking.',
    example: 'A user with ad blockers enabled but using standard browsers without encrypted connections scores approximately 55 out of 100.',
    faq: [{ question: 'What is a browser fingerprint?', answer: 'A browser fingerprint is a unique identifier generated by tracking scripts based on screen details, loaded fonts, and hardware.' }],
    relatedSlugs: ['account-security-calculator', 'password-entropy-calculator'],
    keywords: ['privacy footprint index', 'ad tracker block rate', 'personal security audit'],
    calculate: (inputs) => {
      let score = 40;
      if (inputs.vpn === 'yes') score += 20;
      if (inputs.browser === 'privacy') score += 20;
      if (inputs.adblock === 'yes') score += 20;

      return {
        results: [
          { label: 'Identity Protection Score', value: `${score} / 100`, isPrimary: true },
          { label: 'Estimated Tracker Block Adequacy', value: score >= 80 ? 'Excellent' : score >= 60 ? 'Satisfactory' : 'Poor' }
        ],
        chartData: [
          { name: 'Score', value: score },
          { name: 'Missing Protections', value: 100 - score }
        ]
      };
    }
  },
  {
    id: 'account-security',
    name: 'Account Security Calculator',
    slug: 'account-security-calculator',
    category: 'personal-safety',
    description: 'Perform a checklist audit scoring your personal cloud and email sign-in configurations.',
    seoTitle: 'Cloud Account Security Checklist & Grade Tool',
    seoDescription: 'Benchmark your credential configurations with standardized parameters for security profiles.',
    inputs: [
      { id: 'uniquePass', label: 'Do you use unique passwords for everything?', type: 'select', defaultValue: 'no', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { id: 'hasMfa', label: 'Is app-based MFA active on core emails?', type: 'select', defaultValue: 'yes', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] }
    ],
    formula: 'Calculated safety score = Sum of security weights assigned to unique credentials and multi-factor authentication.',
    explanation: 'Credential recycling represents a major entry pathway for hackers. If one minor forum leaks a recycled key, your secondary banking and email portals are compromised.',
    example: 'Using the same password across platforms reduces security posture to critical warning states, even with primary MFA enabled.',
    faq: [{ question: 'Why is SMS MFA considered less secure?', answer: 'SMS is vulnerable to SIM-swap attacks, so app-based codes are highly recommended.' }],
    relatedSlugs: ['password-entropy-calculator', 'privacy-score-calculator'],
    keywords: ['account protection grade', 'password recycling safety', 'credential security profile'],
    calculate: (inputs) => {
      let coreScore = 15;
      if (inputs.uniquePass === 'yes') coreScore += 45;
      if (inputs.hasMfa === 'yes') coreScore += 40;

      return {
        results: [
          { label: 'Security Grade Index', value: `${coreScore} %`, isPrimary: true },
          { label: 'Safety Appraisal', value: coreScore >= 80 ? 'Secure' : 'Critical Action Required' }
        ],
        chartData: [
          { name: 'Security Grade', value: coreScore }
        ]
      };
    }
  },

  // ==================== INSURANCE CALCULATORS ====================
  {
    id: 'life-insurance',
    name: 'Life Insurance Calculator',
    slug: 'life-insurance-calculator',
    category: 'insurance',
    description: 'Calculate recommended life insurance policy amounts using the standard DIME method.',
    seoTitle: 'Life Insurance Coverage Needs Estimator (DIME Method)',
    seoDescription: 'Utilize the standardized DIME method to calculate recommended death benefits and timeline coverages.',
    inputs: [
      { id: 'debt', label: 'Total Outstanding Debts (Excluding Mortgage) ($)', type: 'number', defaultValue: 15000 },
      { id: 'income', label: 'Annual Income to Replace ($)', type: 'number', defaultValue: 65000 },
      { id: 'years', label: 'Years of Income Replacement needed', type: 'number', defaultValue: 10, min: 1 },
      { id: 'mortgage', label: 'Mortgage Payoff Balance ($)', type: 'number', defaultValue: 250000 },
      { id: 'college', label: 'Future Tuition Savings Goals ($)', type: 'number', defaultValue: 80000 }
    ],
    formula: 'Required Coverage = Debt + (Income * Years) + Mortgage + College Costs',
    explanation: 'The DIME method (Debt, Income, Mortgage, Education) provides a structured baseline to calculate the life insurance policy coverage you need to secure your family.',
    example: 'With $15k debt, $65k income replaced for 10 years ($650k), $250k mortgage, and $80k college fund, the recommended coverage is $995,000.',
    faq: [{ question: 'What is Term versus Whole Life?', answer: 'Term covers a specific age range (e.g. 20 years), while Whole life covers you permanently and builds cash value.' }],
    relatedSlugs: ['insurance-premium-calculator', 'insurance-comparison-calculator'],
    keywords: ['life insurance needs dime', 'income replacement coverage', 'term life benefit solver'],
    calculate: (inputs) => {
      const d = Number(inputs.debt || 0);
      const inc = Number(inputs.income || 65000);
      const yrs = Number(inputs.years || 10);
      const m = Number(inputs.mortgage || 0);
      const col = Number(inputs.college || 0);

      const totalCoverage = d + (inc * yrs) + m + col;

      return {
        results: [
          { label: 'Recommended Policy Coverage', value: totalCoverage.toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Income Replacement Portion', value: (inc * yrs).toLocaleString(), unit: '$' },
          { label: 'Major Liabilities Payoff', value: (d + m).toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Income Replacement', value: inc * yrs },
          { name: 'Mortgage & Debt', value: d + m },
          { name: 'Education Goals', value: col }
        ]
      };
    }
  },
  {
    id: 'health-insurance-calculator',
    name: 'Health Insurance Cost Calculator',
    slug: 'health-insurance-calculator',
    category: 'insurance',
    description: 'Tally combined health insurance premium costs, co-pays, OOP maximums, and deductibles.',
    seoTitle: 'Health Insurance Total Annual Expense Calculator',
    seoDescription: 'Determine total out-of-pocket health insurance spending based on usage projections.',
    inputs: [
      { id: 'premium', label: 'Monthly Premium Cost ($)', type: 'number', defaultValue: 350 },
      { id: 'deductible', label: 'Annual Medical Deductible ($)', type: 'number', defaultValue: 1500 },
      { id: 'copay', label: 'Average Medical Actions Co-Pay ($)', type: 'number', defaultValue: 45 },
      { id: 'visits', label: 'Projected Annual Doctor Visits', type: 'number', defaultValue: 6 }
    ],
    formula: 'Total Minimum Cost = Monthly Premium * 12\nExpected Out of Pocket = Deductible + (Co-Pay * Visits)',
    explanation: 'Health insurance costs are more than just premiums. Understanding deductibles and doctor co-pays helps you budget for your actual medical expenses.',
    example: 'With a $350 premium and 6 doctor visits at a $45 co-pay, your total annual health insurance expenditure is at least $4,470.',
    faq: [{ question: 'What is a deductible?', answer: 'The amount you must pay out-of-pocket before your insurance provider begins covering medical costs.' }],
    relatedSlugs: ['insurance-premium-calculator'],
    keywords: ['health insurance out of pocket', 'deductible plan comparison', 'annual premium cost tracker'],
    calculate: (inputs) => {
      const prem = Number(inputs.premium || 350);
      const ded = Number(inputs.deductible || 1500);
      const copay = Number(inputs.copay || 45);
      const visits = Number(inputs.visits || 6);

      const annualPrem = prem * 12;
      const oopServiceCost = visits * copay;
      const totalExpected = annualPrem + oopServiceCost;

      return {
        results: [
          { label: 'Minimum Projected Cost', value: totalExpected.toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Annual Premium Total', value: annualPrem.toLocaleString(), unit: '$' },
          { label: 'Co-pay Outlays', value: oopServiceCost.toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Premiums', value: annualPrem },
          { name: 'Direct service cost', value: oopServiceCost }
        ]
      };
    }
  },
  {
    id: 'car-insurance-calculator',
    name: 'Car Insurance Cost Calculator',
    slug: 'car-insurance-calculator',
    category: 'insurance',
    description: 'Estimate your average annual and monthly auto insurance expenditures.',
    seoTitle: 'Car & Auto Insurance Cost Estimate Calculator',
    seoDescription: 'Estimate standard car insurance premiums based on history multipliers and plan scopes.',
    inputs: [
      { id: 'baseRate', label: 'Base Plan Rate ($/Month)', type: 'number', defaultValue: 120 },
      { id: 'cleanRecord', label: 'Clean Driving Record?', type: 'select', defaultValue: 'yes', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { id: 'ageBracket', label: 'Driver Age bracket', type: 'select', defaultValue: 'matured', options: [{ label: 'Under 25 years old', value: 'young' }, { label: '25 to 65 years old', value: 'matured' }] }
    ],
    formula: 'Adjusted Rate = Base Rate * Driver Age Factor * Record Multipliers',
    explanation: 'Auto insurance companies calculate your individual crash risk based on statistics. Younger drivers and those with moving violations face significantly higher premiums.',
    example: 'A base plan of $120/month increases to $192/month for drivers under 25 due to statistical accident risks.',
    faq: [{ question: 'How can I lower my car insurance rate?', answer: 'Maintain a clean driving record, opt for higher deductibles, and ask about bundled package discounts.' }],
    relatedSlugs: ['insurance-premium-calculator', 'insurance-comparison-calculator'],
    keywords: ['auto insurance calculator cost', 'car insurance premium age factors', 'driving history insurance rates'],
    calculate: (inputs) => {
      const base = Number(inputs.baseRate || 120);
      let factor = 1.0;

      if (inputs.cleanRecord === 'no') factor += 0.3;
      if (inputs.ageBracket === 'young') factor += 0.6;

      const monthly = base * factor;
      const annual = monthly * 12;

      return {
        results: [
          { label: 'Adjusted Monthly Premium', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Annual Total Outlay', value: annual.toFixed(2), unit: '$' },
          { label: 'Risk Factor Multiplier', value: factor.toFixed(2) }
        ],
        chartData: [
          { name: 'Base Cost', value: base },
          { name: 'Risk Markup', value: monthly - base }
        ]
      };
    }
  },
  {
    id: 'home-insurance-calculator',
    name: 'Home Insurance Calculator',
    slug: 'home-insurance-calculator',
    category: 'insurance',
    description: 'Estimate property insurance premium averages based on replacement value and safety options.',
    seoTitle: 'Homeowner Insurance Replacement Value & Cost Calculator',
    seoDescription: 'Estimate homeowner insurance coverages based on regional construction costs and fire risk levels.',
    inputs: [
      { id: 'homeValue', label: 'Estimated Structural Replacement Cost ($)', type: 'number', defaultValue: 320000 },
      { id: 'fireRisk', label: 'Local Fire Safety Risk class', type: 'select', defaultValue: 'low', options: [{ label: 'Low (Within 5mi of station)', value: 'low' }, { label: 'High (Remote areas)', value: 'high' }] },
      { id: 'deductible', label: 'Selected Plan Deductible ($)', type: 'number', defaultValue: 1000 }
    ],
    formula: 'Premium = (Replacement Cost * 0.0035) * Fire Risk Factor * Deductible Discount Rate',
    explanation: 'Home insurance premiums are heavily influenced by your property\'s rebuilding costs and local fire risks. Opting for a higher policy deductible can help lower your annual premiums.',
    example: 'A home with a $320,000 rebuilding cost and a standard deductible of $1,000 averages approximately $1,120 in annual insurance expenses.',
    faq: [{ question: 'Does home insurance cover flood damages?', answer: 'Standard policies typically exclude flood damage, which requires a separate policy through the National Flood Insurance Program.' }],
    relatedSlugs: ['insurance-premium-calculator', 'life-insurance-calculator'],
    keywords: ['homeowner insurance premium cost', 'property replacement valuation', 'fire risk class rates'],
    calculate: (inputs) => {
      const val = Number(inputs.homeValue || 320000);
      const fire = inputs.fireRisk || 'low';
      const ded = Number(inputs.deductible || 1000);

      let basePrem = val * 0.0035;
      if (fire === 'high') basePrem *= 1.4;
      if (ded >= 2500) basePrem *= 0.9; // Deductible discount

      return {
        results: [
          { label: 'Estimated Annual Premium', value: basePrem.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Suggested Structural Coverage', value: val.toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Est Premium', value: Math.round(basePrem) }
        ]
      };
    }
  },
  {
    id: 'insurance-premium',
    name: 'Insurance Premium Calculator',
    slug: 'insurance-premium-calculator',
    category: 'insurance',
    description: 'Calculate average personal property and risk insurance premiums across user profiles.',
    seoTitle: 'General Insurance Premium Adjusted Rate Calculator',
    seoDescription: 'Determine generic premium adjustments based on coverages and active risk offsets.',
    inputs: [
      { id: 'targetCoverage', label: 'Policy Coverage Limit ($)', type: 'number', defaultValue: 100000 },
      { id: 'riskPct', label: 'Base Risk Level / Category (%)', type: 'number', defaultValue: 1.2 }
    ],
    formula: 'Premium = Coverage * (Risk % / 100)',
    explanation: 'Insurance premiums are calculated based on your personal risk profile and policy coverage limit. Lowering your coverage limit reduces your premium costs.',
    example: 'A policy with a $100,000 coverage limit and a 1.2% risk profile averages $1,200 in annual premium costs.',
    faq: [{ question: 'What is subrogation?', answer: 'The legal process where an insurance company recovers paid claims from the at-fault party.' }],
    relatedSlugs: ['insurance-comparison-calculator', 'insurance-coverage-calculator'],
    keywords: ['insurance premium risk factor', 'annual premium pricing rates', 'liability coverage cost solver'],
    calculate: (inputs) => {
      const cov = Number(inputs.targetCoverage || 100000);
      const risk = Number(inputs.riskPct || 1.2);
      const premium = cov * (risk / 100);

      return {
        results: [
          { label: 'Annual Premium Rate', value: premium.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Equivalent Monthly Charge', value: (premium / 12).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Premium Cost', value: Math.round(premium) },
          { name: 'Unused Coverage Limit', value: cov - premium }
        ]
      };
    }
  },
  {
    id: 'insurance-coverage-calculator',
    name: 'Insurance Coverage Calculator',
    slug: 'insurance-coverage-calculator',
    category: 'insurance',
    description: 'Calculate asset insurance coverage gaps by auditing your existing liability setups.',
    seoTitle: 'Asset Value Protection & Insurance Coverage Gap Estimator',
    seoDescription: 'Identify coverage gaps by comparing your existing policy limits with the actual value of your assets.',
    inputs: [
      { id: 'assetsVal', label: 'Total Physical Assets Market Value ($)', type: 'number', defaultValue: 180000 },
      { id: 'existingCover', label: 'Current Active Policy Coverage ($)', type: 'number', defaultValue: 120000 }
    ],
    formula: 'Coverage Gap = Asset Value - Existing Policy Limit',
    explanation: 'Being underinsured leaves you personally liable for major financial losses. Re-evaluating your coverage limits helps protect your assets.',
    example: 'If your assets are valued at $180,000 but your policy limit is $120,000, you have a $60,000 coverage gap.',
    faq: [{ question: 'What is guaranteed replacement cost?', answer: 'An insurance policy option that pays to rebuild your home to its original standard, even if the cost exceeds your policy limit.' }],
    relatedSlugs: ['insurance-comparison-calculator', 'home-insurance-calculator'],
    keywords: ['insurance coverage gap index', 'underinsured assets risk', 'liability protection level'],
    calculate: (inputs) => {
      const val = Number(inputs.assetsVal || 180000);
      const ext = Number(inputs.existingCover || 120000);
      const gap = Math.max(0, val - ext);

      return {
        results: [
          { label: 'Uncovered Asset Value GAP', value: gap.toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Asset Protection Level', value: `${((ext / (val || 1)) * 100).toFixed(0)}%` }
        ],
        chartData: [
          { name: 'Covered Assets', value: ext },
          { name: 'Uncovered Risk Gap', value: gap }
        ]
      };
    }
  },
  {
    id: 'insurance-comparison',
    name: 'Insurance Comparison Calculator',
    slug: 'insurance-comparison-calculator',
    category: 'insurance',
    description: 'Compare high-deductible versus low-deductible health or property insurance plans side-by-side.',
    seoTitle: 'Insurance Plan Multi-Tier Comparison Tool',
    seoDescription: 'Compare your out-of-pocket costs across up to three insurance tiers side-by-side.',
    inputs: [
      { id: 'prem1', label: 'Plan A Monthly Premium ($)', type: 'number', defaultValue: 220 },
      { id: 'ded1', label: 'Plan A Annual Deductible ($)', type: 'number', defaultValue: 3000 },
      { id: 'prem2', label: 'Plan B Monthly Premium ($)', type: 'number', defaultValue: 410 },
      { id: 'ded2', label: 'Plan B Annual Deductible ($)', type: 'number', defaultValue: 1000 }
    ],
    formula: 'Annual Absolute Cost = (Monthly Premium * 12) + Deductible (assuming limit is met)',
    explanation: 'Comparing plans side-by-side helps identify the most cost-effective option for your coverage needs and health risk profile.',
    example: 'Plan A (low premium, high deductible) saves you money when medical usage is low, but Plan B scales better for chronic health needs.',
    faq: [{ question: 'What is an HSA-eligible plan?', answer: 'A plan with a higher deductible that allows you to contribute pre-tax dollars to a health savings account.' }],
    relatedSlugs: ['insurance-premium-calculator', 'insurance-coverage-calculator'],
    keywords: ['insurance cost comparison', 'high deductible health plan comparison', 'premium versus coverage savings'],
    calculate: (inputs) => {
      const p1 = Number(inputs.prem1 || 220);
      const d1 = Number(inputs.ded1 || 3000);
      const p2 = Number(inputs.prem2 || 410);
      const d2 = Number(inputs.ded2 || 1000);

      const yr1NoUse = p1 * 12;
      const yr1MaxUse = yr1NoUse + d1;

      const yr2NoUse = p2 * 12;
      const yr2MaxUse = yr2NoUse + d2;

      return {
        results: [
          { label: 'Plan A (Low Risk Cost)', value: yr1NoUse.toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Plan A (Max Deductible)', value: yr1MaxUse.toLocaleString(), unit: '$' },
          { label: 'Plan B (Low Risk Cost)', value: yr2NoUse.toLocaleString(), unit: '$' },
          { label: 'Plan B (Max Deductible)', value: yr2MaxUse.toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Plan A Min Cost', value: yr1NoUse },
          { name: 'Plan B Min Cost', value: yr2NoUse }
        ]
      };
    }
  },

  // ==================== RETIREMENT & LIFE PLANNING ====================
  {
    id: 'retirement-savings',
    name: 'Retirement Savings Calculator',
    slug: 'retirement-savings-calculator',
    category: 'retirement',
    description: 'Calculate estimated nested retirement savings progress using continuous interest compound curves.',
    seoTitle: 'Retirement Nest Egg Capital Savings Calculator',
    seoDescription: 'Forecast your future retirement nest egg size based on initial capital, contributions, and interest compound curves.',
    inputs: [
      { id: 'currAge', label: 'Current Biological Age', type: 'number', defaultValue: 30, min: 1, max: 100 },
      { id: 'retireAge', label: 'Planned Retirement Age', type: 'number', defaultValue: 65, min: 1, max: 100 },
      { id: 'currSavings', label: 'Initial Nest Egg Balance ($)', type: 'number', defaultValue: 45000 },
      { id: 'monthlyContrib', label: 'Monthly Future Savings ($)', type: 'number', defaultValue: 500 },
      { id: 'annualReturn', label: 'Assumed Annual Yield (%)', type: 'number', defaultValue: 7, min: 0, max: 20 }
    ],
    formula: 'A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]',
    explanation: 'Monthly savings compound over decades. An earlier start helps your retirement accounts grow dramatically through compound interest.',
    example: 'Starting at age 30 and retirement at 65, saving $500 monthly with $45k initial capital at 7% compound interest yields a nest egg of over $1,348,000.',
    faq: [{ question: 'What return rate is safe to assume?', answer: 'The historical S&P 500 average is ~10% annually, but choosing 6% to 8% accounts for inflation over time.' }],
    relatedSlugs: ['retirement-income-calculator', 'long-term-savings-calculator'],
    keywords: ['retirement compound calculator', 'nest egg target savings', 'future value active asset growth'],
    calculate: (inputs) => {
      const curAge = Number(inputs.currAge || 30);
      const retAge = Number(inputs.retireAge || 65);
      const startBal = Number(inputs.currSavings || 45000);
      const contrib = Number(inputs.monthlyContrib || 500);
      const interest = Number(inputs.annualReturn || 7) / 100;

      const yrs = Math.max(0, retAge - curAge);
      let total = startBal;
      const ratePerMonth = interest / 12;
      const months = yrs * 12;

      for (let m = 0; m < months; m++) {
        total = total * (1 + ratePerMonth) + contrib;
      }

      const rawContributions = startBal + (contrib * months);
      const interestEarned = Math.max(0, total - rawContributions);

      return {
        results: [
          { label: 'Forecasted Nest Egg Balance', value: Math.round(total).toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Direct Personal Contributions', value: Math.round(rawContributions).toLocaleString(), unit: '$' },
          { label: 'Compound Interest Earned', value: Math.round(interestEarned).toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Contributions', value: Math.round(rawContributions) },
          { name: 'Interest Gain', value: Math.round(interestEarned) }
        ]
      };
    }
  },
  {
    id: 'retirement-income-calculator',
    name: 'Retirement Income Calculator',
    slug: 'retirement-income-calculator',
    category: 'retirement',
    description: 'Calculate sustainable monthly retirement withdrawals using the traditional 4% safe withdrawal rate.',
    seoTitle: 'Sustainable Retirement Income & 4% Withdrawal Solver',
    seoDescription: 'Calculate your annual income starting with the traditional 4% safe withdrawal rate.',
    inputs: [
      { id: 'nestEgg', label: 'Accumulated Retirement Net Value ($)', type: 'number', defaultValue: 1000000 },
      { id: 'rate', label: 'Target Withdrawal Rate (%)', type: 'number', defaultValue: 4 }
    ],
    formula: 'Annual Income = Nest Egg * (Rate / 100)',
    explanation: 'The 4% rule provides a sustainable baseline for retirement withdrawals, helping ensure your portfolio survives for at least 30 years.',
    example: 'A $1,000,000 portfolio supporting a 4% annual withdrawal rate provides $40,000 in yearly retirement income.',
    faq: [{ question: 'Does the 4% rule include inflation?', answer: 'The traditional rule adjusts subsequently upward each year by inflation rates to maintain your purchasing power.' }],
    relatedSlugs: ['retirement-savings-calculator', 'pension-calculator'],
    keywords: ['nest egg withdrawal safe rate', '4 percent rule retirement income', 'annual cash distributions'],
    calculate: (inputs) => {
      const egg = Number(inputs.nestEgg || 1000000);
      const r = Number(inputs.rate || 4);

      const yrIncome = egg * (r / 100);
      const moIncome = yrIncome / 12;

      return {
        results: [
          { label: 'Annual Retirement Income', value: Math.round(yrIncome).toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Monthly Cash Distribution', value: Math.round(moIncome).toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Income Output', value: Math.round(yrIncome) },
          { name: 'Remaining Nest Portfolio', value: Math.round(egg - yrIncome) }
        ]
      };
    }
  },
  {
    id: 'retirement-age-calculator',
    name: 'Retirement Age Calculator',
    slug: 'retirement-age-calculator',
    category: 'retirement',
    description: 'Calculate when you can retire based on your annual savings rate and cost of living.',
    seoTitle: 'Expected Retirement Age & Financial Independence Year Finder',
    seoDescription: 'Find your target retirement year based on your savings rate and cost of living expectations.',
    inputs: [
      { id: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 32 },
      { id: 'annualIncome', label: 'Annual Post-Tax Net Income ($)', type: 'number', defaultValue: 75000 },
      { id: 'annualSavings', label: 'Current Annual Savings ($)', type: 'number', defaultValue: 15000 }
    ],
    formula: 'Target Portfolio = (Income - Savings) * 25\nCalculates years to accrue balance at 6% real market returns.',
    explanation: 'Your retirement timeline is determined by your savings rate. High savings rates dramatically reduce the years required to fund retirement.',
    example: 'With $75k net income and $15k in annual savings, a user can retire in approximately 31 years by maintaining their standard of living.',
    faq: [{ question: 'What is the FIRE movement?', answer: 'Financial Independence, Retire Early - advocates for high savings rates (50%+) to enable early retirement.' }],
    relatedSlugs: ['retirement-savings-calculator', 'long-term-savings-calculator'],
    keywords: ['retirement eligibility years', 'financial independence index', 'savings rate timeline finder'],
    calculate: (inputs) => {
      const age = Number(inputs.currentAge || 32);
      const inc = Number(inputs.annualIncome || 75000);
      const sav = Number(inputs.annualSavings || 15000);

      const expenses = Math.max(1000, inc - sav);
      const targetEgg = expenses * 25; // 4% rule inversion

      // Solve for years assuming 6% net returns
      let years = 0;
      let balance = 0;
      while (balance < targetEgg && years < 100) {
        balance = balance * 1.06 + sav;
        years++;
      }

      return {
        results: [
          { label: 'Retirement Age Target', value: `${age + years} Years old`, isPrimary: true },
          { label: 'Years of Saving Remaining', value: `${years} Years` },
          { label: 'Nest Egg Goal Target', value: Math.round(targetEgg).toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Expenses', value: expenses },
          { name: 'Savings Outlay', value: sav }
        ]
      };
    }
  },
  {
    id: 'pension-calculator',
    name: 'Pension Calculator',
    slug: 'pension-calculator',
    category: 'retirement',
    description: 'Calculate projected pension benefits based on service length and final average salary.',
    seoTitle: 'Define Benefit Pension Annual Payout Calculator',
    seoDescription: 'Calculate defined-benefit government and corporate pension plans based on service years.',
    inputs: [
      { id: 'salary', label: 'Final Projected Annual Salary ($)', type: 'number', defaultValue: 85000 },
      { id: 'yearsOfService', label: 'Total Years of Service count', type: 'number', defaultValue: 25 },
      { id: 'multiplier', label: 'Pension Benefit Multiplier per Year (%)', type: 'number', defaultValue: 2 }
    ],
    formula: 'Annual Payout = Salary * Years of Service * (Multiplier % / 100)',
    explanation: 'Traditional defined-benefit pension plans calculate your retirement payout as a percentage of your final salary, scaled by your years of service work.',
    example: 'A final salary of $85,000 with 25 years of service and a 2% pension multiplier provides $42,500 in annual retirement benefits.',
    faq: [{ question: 'Is a pension guaranteed?', answer: 'Defined-benefit pensions are legally protected, often guaranteed by federal corporations like the PBGC.' }],
    relatedSlugs: ['retirement-income-calculator', 'retirement-savings-calculator'],
    keywords: ['pension annual payout', 'defined benefit plan calculation', 'final average salary rates'],
    calculate: (inputs) => {
      const sal = Number(inputs.salary || 85000);
      const yrs = Number(inputs.yearsOfService || 25);
      const mult = Number(inputs.multiplier || 2) / 100;

      const annualBenefit = sal * yrs * mult;
      const monthlyBenefit = annualBenefit / 12;

      return {
        results: [
          { label: 'Annual Pension Benefit', value: Math.round(annualBenefit).toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Monthly Pension Benefit', value: Math.round(monthlyBenefit).toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Pension Benefit', value: Math.round(annualBenefit) },
          { name: 'Salary Baseline Difference', value: Math.max(0, Math.round(sal - annualBenefit)) }
        ]
      };
    }
  },
  {
    id: 'life-expectancy',
    name: 'Life Expectancy Calculator',
    slug: 'life-expectancy-calculator',
    category: 'retirement',
    description: 'Estimate statistical remaining lifespan milestones based on gender and general health choices.',
    seoTitle: 'Statistical Life Expectancy & Longevity Calculator',
    seoDescription: 'Estimate your active living lifespan using public actuarial table trends.',
    inputs: [
      { id: 'gender', label: 'Biological Sex at Birth', type: 'select', defaultValue: 'female', options: [{ label: 'Female', value: 'female' }, { label: 'Male', value: 'male' }] },
      { id: 'age', label: 'Current Chronological Age', type: 'number', defaultValue: 30 },
      { id: 'smoker', label: 'Tobacco usage habits?', type: 'select', defaultValue: 'no', options: [{ label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }] }
    ],
    formula: 'Base Lifespan adjusted down for smoking habits and modified by active survival curves.',
    explanation: 'Actuarial life expectancy tables use demographic averages. Positive choices like regular exercise and avoiding tobacco improve your longevity outlook.',
    example: 'A health-focused 30-year-old female has a statistical life expectancy of 84 years, whereas smoker status can reduce this timeline by up to 10 years.',
    faq: [{ question: 'Are these absolute spans?', answer: 'No, these are statistical averages. Personal health history and choices significantly influence individual longevity.' }],
    relatedSlugs: ['retirement-age-calculator', 'future-expense-calculator'],
    keywords: ['expected lifespan statistical table', 'actuarial age milestone', 'longevity prediction tool'],
    calculate: (inputs) => {
      const isFemale = inputs.gender === 'female';
      const age = Number(inputs.age || 30);
      let base = isFemale ? 82 : 77;

      if (inputs.smoker === 'yes') base -= 9;
      const expectedSpan = Math.max(age + 2, base);

      return {
        results: [
          { label: 'Estimated Lifespan', value: `${expectedSpan} Years old`, isPrimary: true },
          { label: 'Remaining Life Horizon', value: `${expectedSpan - age} Years` }
        ]
      };
    }
  },
  {
    id: 'future-expense-calculator',
    name: 'Future Expense Calculator',
    slug: 'future-expense-calculator',
    category: 'retirement',
    description: 'Estimate future business or personal cost allocations adjusted for average multi-year inflation.',
    seoTitle: 'Future Value of Expenses & Inflation Impact Calculator',
    seoDescription: 'Calculate the impact of multi-year inflation on your future cost of living.',
    inputs: [
      { id: 'currExpense', label: 'Current Cost of Expense ($)', type: 'number', defaultValue: 1200 },
      { id: 'years', label: 'Years in the future', type: 'number', defaultValue: 15 },
      { id: 'inflation', label: 'Expected Annual Inflation Rate (%)', type: 'number', defaultValue: 3.2 }
    ],
    formula: 'Future Cost = Current Cost * (1 + InflationRate)^Years',
    explanation: 'Inflation quietly erodes your purchasing power. Understanding how future prices rise helps you plan more reliable long-term retirement budgets.',
    example: 'A baseline expense of $1,200/month rising at 3.2% annually will cost approximately $1,921/month in 15 years.',
    faq: [{ question: 'What is the target inflation rate?', answer: 'The Federal Reserve targets a stable 2% annual inflation rate over the medium term.' }],
    relatedSlugs: ['long-term-savings-calculator', 'retirement-savings-calculator'],
    keywords: ['inflation adjusted future expense', 'purchasing power erosion', 'future pricing estimator'],
    calculate: (inputs) => {
      const exp = Number(inputs.currExpense || 1200);
      const yrs = Number(inputs.years || 15);
      const inf = Number(inputs.inflation || 3.2) / 100;

      const futCost = exp * Math.pow(1 + inf, yrs);

      return {
        results: [
          { label: 'Future Value Price Cost', value: futCost.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Absolute Currency Increase', value: (futCost - exp).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Present Value Cost', value: exp },
          { name: 'Inflation Surcharge Raise', value: Math.round(futCost - exp) }
        ]
      };
    }
  },
  {
    id: 'long-term-savings',
    name: 'Long Term Savings Calculator',
    slug: 'long-term-savings-calculator',
    category: 'retirement',
    description: 'Project compound interest growth pathways for index funds and certificates of deposit over multi-year horizons.',
    seoTitle: 'Long Term Treasury & High-Yield Savings Compound Planner',
    seoDescription: 'Forecast the multi-decade growth of your investments using monthly compound interest models.',
    inputs: [
      { id: 'principal', label: 'Starting Investment Principal ($)', type: 'number', defaultValue: 10000 },
      { id: 'years', label: 'Horizon Duration length (Years)', type: 'number', defaultValue: 20 },
      { id: 'apy', label: 'Annual Percentage Yield (APY) (%)', type: 'number', defaultValue: 5.5 }
    ],
    formula: 'Balance = Principal * (1 + APY/100)^Years',
    explanation: 'Starting with a secure cash base lets multi-year compounding increase your savings, especially during periods of higher interest rates.',
    example: 'A $10,000 principal earning a 5.5% APY grows to over $29,177 in 20 years through the power of compound interest.',
    faq: [{ question: 'How is APY of CDs secured?', answer: 'CDs are fully backed by federal depository insurance (FDIC) up to legal coverage thresholds.' }],
    relatedSlugs: ['retirement-savings-calculator', 'future-expense-calculator'],
    keywords: ['long term yield cd rates', 'fixed deposit compounded values', 'federal insured growth solver'],
    calculate: (inputs) => {
      const p = Number(inputs.principal || 10000);
      const y = Number(inputs.years || 20);
      const a = Number(inputs.apy || 5.5) / 100;

      const total = p * Math.pow(1 + a, y);
      const gains = total - p;

      return {
        results: [
          { label: 'Future Total Balance', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Net Interest Return Earned', value: gains.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Deposit', value: p },
          { name: 'Interest Yield Added', value: Math.round(gains) }
        ]
      };
    }
  },

  // ==================== CRYPTO & DIGITAL ASSETS ====================
  {
    id: 'crypto-profit',
    name: 'Crypto Profit Calculator',
    slug: 'crypto-profit-calculator',
    category: 'crypto',
    description: 'Calculate net cryptocurrency transaction profits, accounting for exchange broker commission margins.',
    seoTitle: 'Crypto Coin Profit & Trading Commission fee Calculator',
    seoDescription: 'Input trade details to calculate your net crypto profits, accounting for custom buy/sell commissions.',
    inputs: [
      { id: 'invested', label: 'Total Capital Invested ($)', type: 'number', defaultValue: 2000 },
      { id: 'buyPrice', label: 'Token Buy-in Price ($)', type: 'number', defaultValue: 45000 },
      { id: 'sellPrice', label: 'Token Selling Price ($)', type: 'number', defaultValue: 67000 },
      { id: 'feePct', label: 'Exchange Broker Commission fee (%)', type: 'number', defaultValue: 0.5 }
    ],
    formula: 'Tokens = Invested / BuyPrice\nFees = (Invested + (Tokens * SellPrice)) * FeeRate\nProfit = (Tokens * SellPrice) - Invested - Fees',
    explanation: 'Crypto trades often carry high transaction fees. Accounting for these broker commissions is essential to verify your actual net profits.',
    example: 'An investment of $2,000 at a coin cost of $45k, sold at $67k with a 0.5% fee rate, yields a net profit of approximately $953.',
    faq: [{ question: 'Are crypto gains taxable?', answer: 'In most jurisdictions, cryptocurrency transactions are subject to capital gains tax rates.' }],
    relatedSlugs: ['crypto-roi-calculator', 'crypto-dca-calculator'],
    keywords: ['bitcoin trading profit margin', 'ethereum sell fees deduction', 'reconciled gain converter'],
    calculate: (inputs) => {
      const inv = Number(inputs.invested || 2000);
      const buy = Number(inputs.buyPrice || 45000);
      const sell = Number(inputs.sellPrice || 67000);
      const fee = Number(inputs.feePct || 0.5) / 100;

      const qty = buy > 0 ? inv / buy : 0;
      const salesRaw = qty * sell;
      const fees = (inv * fee) + (salesRaw * fee);
      const netProfit = salesRaw - inv - fees;
      const roi = inv > 0 ? (netProfit / inv) * 100 : 0;

      return {
        results: [
          { label: 'Reconciled Net Profit', value: netProfit.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Net return ROI', value: `${roi.toFixed(1)}%` },
          { label: 'Deducted Exchange Service fees', value: fees.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Buy-in', value: inv },
          { name: 'Transaction Fees Paid', value: Math.round(fees) },
          { name: 'Takeaway Net Profit', value: Math.max(0, Math.round(netProfit)) }
        ]
      };
    }
  },
  {
    id: 'crypto-roi',
    name: 'Crypto ROI Calculator',
    slug: 'crypto-roi-calculator',
    category: 'crypto',
    description: 'Calculate cryptocurrency investment Return on Investment (ROI) and absolute yield ratios.',
    seoTitle: 'Crypto Investment Return on Investment (ROI) Finder',
    seoDescription: 'Value your digital coin and asset growth metrics by evaluating return rates.',
    inputs: [
      { id: 'costBasis', label: 'Starting Total Cost Basis ($)', type: 'number', defaultValue: 1500 },
      { id: 'currentValue', label: 'Current Target Portfolio Value ($)', type: 'number', defaultValue: 4200 }
    ],
    formula: 'ROI = [(Current Value - Cost Basis) / Cost Basis] * 100',
    explanation: 'ROI is a standard metric used to compare asset performance. Use this tool to evaluate and compare the performance of your different crypto holdings.',
    example: 'A portfolio that grows from an initial $1,500 cost basis to a current value of $4,200 delivers a 180.0% ROI.',
    faq: [{ question: 'What is cost basis?', answer: 'The total purchase price of your assets, including any trading commissions and transaction fees.' }],
    relatedSlugs: ['crypto-profit-calculator', 'crypto-investment-calculator'],
    keywords: ['crypto return rate index', 'absolute coin gain multiplier', 'token tier performance solver'],
    calculate: (inputs) => {
      const cb = Number(inputs.costBasis || 1500);
      const cv = Number(inputs.currentValue || 4200);

      const net = cv - cb;
      const pct = cb > 0 ? (net / cb) * 100 : 0;

      return {
        results: [
          { label: 'Portfolio Net ROI Return', value: `${pct.toFixed(2)} %`, isPrimary: true },
          { label: 'Absolute Growth Yield', value: net.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Cost Basis', value: cb },
          { name: 'Net Gain Portion', value: Math.max(0, net) }
        ]
      };
    }
  },
  {
    id: 'crypto-investment',
    name: 'Crypto Investment Calculator',
    slug: 'crypto-investment-calculator',
    category: 'crypto',
    description: 'Determine future portfolio values based on initial capital and continuous market returns.',
    seoTitle: 'Future Crypto Asset Investment Target Forecaster',
    seoDescription: 'Forecast your future portfolio value based on steady asset growth expectations.',
    inputs: [
      { id: 'startInvest', label: 'Starting Investment Allocation ($)', type: 'number', defaultValue: 5000 },
      { id: 'years', label: 'Target timeline span (Years)', type: 'number', defaultValue: 5 },
      { id: 'expectedApy', label: 'Assumed Token annual growth APY (%)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Value = Start * (1 + APY / 100)^Years',
    explanation: 'Cryptocurrency models often use higher return estimates compared to traditional assets, though these projections come with increased market volatility.',
    example: 'A $5,000 portfolio growing at an annual rate of 15% reaches approximately $10,056 over a 5-year period.',
    faq: [{ question: 'Why are crypto APYs often higher?', answer: 'Volatility can lead to rapid price swings, though these higher potential yields carry significant risk of capital loss.' }],
    relatedSlugs: ['crypto-profit-calculator', 'crypto-dca-calculator'],
    keywords: ['crypto compounding assets planner', 'token asset yield projection', 'digital token valuation target'],
    calculate: (inputs) => {
      const start = Number(inputs.startInvest || 5000);
      const yrs = Number(inputs.years || 5);
      const growth = Number(inputs.expectedApy || 15) / 100;

      const totalValue = start * Math.pow(1 + growth, yrs);
      const netGain = totalValue - start;

      return {
        results: [
          { label: 'Projected Portfolio Value', value: totalValue.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Implied Growth Yield Profit', value: netGain.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Aquisition Cost', value: start },
          { name: 'Compound Profit Goal', value: Math.round(netGain) }
        ]
      };
    }
  },
  {
    id: 'token-price',
    name: 'Token Price Calculator',
    slug: 'token-price-calculator',
    category: 'crypto',
    description: 'Calculate implied token prices based on market capitalization and active circulating supply.',
    seoTitle: 'Imputed Token Price & Circulating Supply Calculator',
    seoDescription: 'Calculate the implied market price of a cryptocurrency based on its circulating supply.',
    inputs: [
      { id: 'marketCap', label: 'Target Protocol Market Cap ($)', type: 'number', defaultValue: 120_000_000 },
      { id: 'supply', label: 'Active Circulating Token Supply count', type: 'number', defaultValue: 40_000_000 }
    ],
    formula: 'Token Price = Market Cap / Circulating Supply',
    explanation: 'Low-cost tokens with high circulating supplies are not inherently "cheap." A token\'s real value is represented by its total market capitalization.',
    example: 'A protocol with a $120M market cap and 40M circulating tokens has an implied token price of $3.00.',
    faq: [{ question: 'What is fully diluted valuation (FDV)?', answer: 'The implied market cap of a protocol if all tokens in the maximum supply were unlocked and circulating.' }],
    relatedSlugs: ['crypto-profit-calculator', 'crypto-roi-calculator'],
    keywords: ['token price market cap solver', 'circulating supply pricing index', 'valuation divisor metric'],
    calculate: (inputs) => {
      const mc = Number(inputs.marketCap || 120_000_000);
      const supply = Number(inputs.supply || 40_000_000);

      const price = supply > 0 ? mc / supply : 0;

      return {
        results: [
          { label: 'Implied Individual Token Price', value: price.toFixed(4), unit: '$', isPrimary: true },
          { label: 'Protocol Market Cap', value: mc.toLocaleString(), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'mining-profit',
    name: 'Mining Profit Calculator',
    slug: 'mining-profit-calculator',
    category: 'crypto',
    description: 'Calculate cryptocurrency mining profitability by balancing hardware hash rate against local electricity costs.',
    seoTitle: 'Crypto Coin Mining Margin & Electricity Cost Calculator',
    seoDescription: 'Estimate your mining hardware profitability by balancing your hashrate and electricity expenses.',
    inputs: [
      { id: 'hashrate', label: 'Hardware Hashrate (MH/s)', type: 'number', defaultValue: 450 },
      { id: 'power', label: 'System Power Draw (Watts)', type: 'number', defaultValue: 320 },
      { id: 'powerCost', label: 'Local Electricity Cost ($/kWh)', type: 'number', defaultValue: 0.12 },
      { id: 'blockReward', label: 'Est. Daily Block Reward Yield ($)', type: 'number', defaultValue: 6.2 }
    ],
    formula: 'Daily Power Cost = (Power * 24 / 1000) * PowerCost\nNet Daily Profit = Daily Reward - Daily Cost',
    explanation: 'Mining profitability depends heavily on your hardware efficiency and local energy rates. High electricity costs can easily erode mining profits.',
    example: 'A 320W rig operating in a region with $0.12/kWh electricity costs averages $0.92 in daily operating power expenses.',
    faq: [{ question: 'What is hashrate?', answer: 'The speed at which a mining computer can complete cryptographic calculations to secure the network.' }],
    relatedSlugs: ['crypto-profit-calculator', 'crypto-roi-calculator'],
    keywords: ['gpu mining profitability tool', 'electricity cost per kwh', 'hashrate payout margin'],
    calculate: (inputs) => {
      const pwr = Number(inputs.power || 320);
      const costKwh = Number(inputs.powerCost || 0.12);
      const dayReward = Number(inputs.blockReward || 6.2);

      const dailyKwh = (pwr * 24) / 1000;
      const dailyExpense = dailyKwh * costKwh;
      const netDaily = dayReward - dailyExpense;

      const monthlyExpense = dailyExpense * 30.4;
      const monthlyNet = netDaily * 30.4;

      return {
        results: [
          { label: 'Net Monthly Mining Profit', value: monthlyNet.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly Electricity Bill Cost', value: monthlyExpense.toFixed(2), unit: '$' },
          { label: 'Daily Energy Consumption', value: `${dailyKwh.toFixed(2)} kWh` }
        ],
        chartData: [
          { name: 'Revenue', value: Math.round(dayReward * 30.4) },
          { name: 'Electricity Cost', value: Math.round(monthlyExpense) }
        ]
      };
    }
  },
  {
    id: 'crypto-dca',
    name: 'Crypto DCA Calculator',
    slug: 'crypto-dca-calculator',
    category: 'crypto',
    description: 'Calculate average purchase prices and entry costs using a dollar-cost averaging (DCA) strategy.',
    seoTitle: 'Crypto Dollar-Cost Averaging (DCA) Strategy Tool',
    seoDescription: 'Simulate your token acquisition costs and average entry pricing using a DCA strategy.',
    inputs: [
      { id: 'rate', label: 'Recurring Purchase Amount ($)', type: 'number', defaultValue: 100 },
      { id: 'cycles', label: 'Total Purchase Intervals completed', type: 'number', defaultValue: 12 },
      { id: 'currentAvg', label: 'Average Token Entry Cost ($)', type: 'number', defaultValue: 3200 },
      { id: 'priceNow', label: 'Current Trading Price ($)', type: 'number', defaultValue: 4500 }
    ],
    formula: 'Total Capital = Rate * Intervals\nAverage cost equals sum of purchases divided by tokens acquired.',
    explanation: 'A dollar-cost averaging (DCA) strategy reduces the risk of trying to time volatile cryptocurrency markets by making regular, consistent purchases.',
    example: 'Making 12 monthly purchases of $100 average out market pricing, reducing the impact of short-term price swings.',
    faq: [{ question: 'Why use a DCA strategy?', answer: 'DCA helps remove emotions from trading, helping investors build long-term positions through steady, recurring buys.' }],
    relatedSlugs: ['crypto-profit-calculator', 'crypto-investment-calculator'],
    keywords: ['crypto recurring buy average', 'dollar cost averaging calculator', 'token entry price smoother'],
    calculate: (inputs) => {
      const pmts = Number(inputs.rate || 100);
      const count = Number(inputs.cycles || 12);
      const avg = Number(inputs.currentAvg || 3200);
      const now = Number(inputs.priceNow || 4500);

      const totalInvested = pmts * count;
      const tokensAcquired = avg > 0 ? totalInvested / avg : 0;
      const currentVal = tokensAcquired * now;
      const profit = currentVal - totalInvested;

      return {
        results: [
          { label: 'Current Portfolio Value', value: currentVal.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Invested Capital', value: totalInvested.toFixed(2), unit: '$' },
          { label: 'Net Profit Yield', value: profit.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Total Cost', value: totalInvested },
          { name: 'Current Val', value: Math.round(currentVal) }
        ]
      };
    }
  }
];
