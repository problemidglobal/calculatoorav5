import { Calculator } from '../types';

export const V20_PART4_CALCULATORS: Calculator[] = [
  // ====================================== PERSONAL LIFE ======================================
  {
    id: 'life-goal',
    name: 'Life Goal Savings Calculator',
    slug: 'life-goal',
    category: 'lifestyle',
    description: 'Calculate the monthly investment savings rate required to accomplish major life goals by a target age.',
    formula: 'Monthly Savings Needed = (Cost of Goal * (r/12)) / ((1 + r/12)^(Months) - 1)',
    explanation: 'Models compound growth on systematic investments. It computes required savings pacing for major events like buying a cabin, launching a self-funded career, or taking a sabbatical year.',
    example: 'Hoping to accumulate $50,000 for a wedding in 5 years, starting with $5,000 at a 6% annual projection rate.',
    inputs: [
      { id: 'targetCost', label: 'Financial Cost of Goal ($)', type: 'number', defaultValue: 60000, min: 100 },
      { id: 'startCap', label: 'Initial Savings Already Allocated ($)', type: 'number', defaultValue: 8000, min: 0 },
      { id: 'yearsLimit', label: 'Timeline in Years (Years to Goal)', type: 'number', defaultValue: 6, min: 1, max: 80 },
      { id: 'returnRate', label: 'Expected Annual Return Rate (%)', type: 'number', defaultValue: 7.0, min: 0, max: 30, step: 0.1 }
    ],
    faq: [
      { question: 'How does interest impact saving goals over long horizons?', answer: 'The compound interest formula works exponentially. Over longer timelines, compounding returns do much of the heavy lifting, requiring a lower monthly savings rate than short horizons.' }
    ],
    relatedSlugs: ['personal-budget-calculator', 'monthly-planning', 'time-allocation'],
    seoTitle: 'Life Goal Savings & Financial Timeline Calculator | Accumulator',
    seoDescription: 'Plan and budget for major financial achievements. Calculates necessary monthly payments based on compound asset interest returns.',
    calculate: (inputs) => {
      const target = Number(inputs.targetCost || 60000);
      const starting = Number(inputs.startCap || 0);
      const years = Number(inputs.yearsLimit || 5);
      const rate = Number(inputs.returnRate || 7) / 100;

      const months = years * 12;
      const rMonthly = rate / 12;

      // Future value of starting capital
      const fvStarting = starting * Math.pow(1 + rMonthly, months);
      const netTargetNeeded = Math.max(0, target - fvStarting);

      let monthlySavings = 0;
      if (rMonthly > 0) {
        monthlySavings = (netTargetNeeded * rMonthly) / (Math.pow(1 + rMonthly, months) - 1);
      } else {
        monthlySavings = netTargetNeeded / months;
      }

      return {
        results: [
          { label: 'Required Monthly Savings Rate', value: monthlySavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Initial Contribution Support', value: fvStarting.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Remaining Target to fund', value: netTargetNeeded.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Total Contributions Made', value: (starting + (monthlySavings * months)).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'personal-budget-calculator',
    name: 'Personal Budget Allocation Calculator',
    slug: 'personal-budget-calculator',
    category: 'lifestyle',
    description: 'Organize your income according to the popular 50/30/20 financial rule, tracking essential, elective, and savings categories.',
    formula: 'Essentials = 50% | Electives = 30% | Savings/Debt = 20%',
    explanation: 'Audits monthly expenditures. Allocates your net earnings into distinct categories to help secure a balanced and sustainable household budget.',
    example: 'Allocating a $4,500 net monthly salary into rent, organic food, memberships, and retirement offsets.',
    inputs: [
      { id: 'monthlyNetIncome', label: 'Net Monthly Post-Tax Take-home ($)', type: 'number', defaultValue: 5000, min: 100 },
      { id: 'housingRent', label: 'Rent / Home Mortgage Payment ($)', type: 'number', defaultValue: 1600, min: 0 },
      { id: 'foodBills', label: 'Monthly Groceries & Meals ($)', type: 'number', defaultValue: 550, min: 0 },
      { id: 'essentialUtilities', label: 'Core Utilities & Insurances ($)', type: 'number', defaultValue: 350, min: 0 },
      { id: 'leisureSpend', label: 'Memberships, Dining Out & Discretionary ($)', type: 'number', defaultValue: 1200, min: 0 }
    ],
    faq: [
      { question: 'What is the 50/30/20 financial guideline?', answer: 'It allocates 50% of net income to structural Needs (housing, grocery, utility, healthcare), 30% to optional Wants (leisure, hobbies, eating out), and 20% to financial Savings, retirement, or extra debt paydown.' }
    ],
    relatedSlugs: ['life-goal', 'monthly-planning', 'time-allocation'],
    seoTitle: 'Household Personal Budget Planner | 50/30/20 Budgeting',
    seoDescription: 'Divide take-home pay check levels into needs, optional fun spend, and liquid retirement compound investments. Track excess expenditures.',
    calculate: (inputs) => {
      const income = Number(inputs.monthlyNetIncome || 5000);
      const rent = Number(inputs.housingRent || 0);
      const food = Number(inputs.foodBills || 0);
      const utilities = Number(inputs.essentialUtilities || 0);
      const leisure = Number(inputs.leisureSpend || 0);

      const actualNeeds = rent + food + utilities;
      const actualWants = leisure;
      const actualSavings = Math.max(0, income - actualNeeds - actualWants);

      const targetNeeds = income * 0.50;
      const targetWants = income * 0.30;
      const targetSavings = income * 0.20;

      return {
        results: [
          { label: 'Remaining Savings Capacity', value: actualSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Actual Needs Expense Index', value: `${((actualNeeds / income) * 100).toFixed(0)}%`, unit: `(Target: 50%)`, isPrimary: true },
          { label: 'Actual Wants Expense Index', value: `${((actualWants / income) * 100).toFixed(0)}%`, unit: `(Target: 30%)` },
          { label: 'Ideal Needs Budget (50%)', value: targetNeeds.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Ideal Savings Target (20%)', value: targetSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ],
        chartData: {
          labels: ['Actual Needs', 'Actual Wants', 'Leftover Savings'],
          values: [actualNeeds, actualWants, actualSavings],
          colors: ['#ef4444', '#f59e0b', '#10b981']
        }
      };
    }
  },
  {
    id: 'monthly-planning',
    name: 'Daily Allowance Planner',
    slug: 'monthly-planning',
    category: 'lifestyle',
    description: 'Determine your flat daily discretionary allowance after factoring in core monthly rent and saving targets.',
    formula: 'Daily Allowance = (Net Income - Fixed Cost - Saving Target) / Days in Month',
    explanation: 'Limits impulse spending by giving you a simple daily limit to follow. This approach keeps your primary budgeting on track without complex tracking tools.',
    example: 'E.g., An incoming $4,000 month salary with $2,000 in fixed rent, bills, and saving goals.',
    inputs: [
      { id: 'income', label: 'Net Monthly Earnings ($)', type: 'number', defaultValue: 4200, min: 100 },
      { id: 'fixedRent', label: 'Rent & Fixed Monthly Bills ($)', type: 'number', defaultValue: 1800, min: 0 },
      { id: 'savingsCommitment', label: 'Target Savings / Investment ($)', type: 'number', defaultValue: 600, min: 0 }
    ],
    faq: [
      { question: 'Why track daily budgets instead of categories?', answer: 'Managing complex budget categories can feel exhausting. A clear daily allowance simplifies spending choices: "If I spend $100 on dining out today, I must spend $0 tomorrow to stay on budget."' }
    ],
    relatedSlugs: ['personal-budget-calculator', 'life-goal', 'time-allocation'],
    seoTitle: 'Daily Discretionary Allowance Calculator | Monthly Spending Planner',
    seoDescription: 'Find your target daily spending limit. Subtracts rent and savings to provide clear daily spending limits.',
    calculate: (inputs) => {
      const inc = Number(inputs.income || 4200);
      const fixed = Number(inputs.fixedRent || 0);
      const save = Number(inputs.savingsCommitment || 0);

      const availableDiscretionary = Math.max(0, inc - fixed - save);
      const dailyAllowance = availableDiscretionary / 30.4; // Average month length

      return {
        results: [
          { label: 'Daily Discretionary Allowance', value: dailyAllowance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Weekly Spending Allowance', value: (dailyAllowance * 7).toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Discretionary Funds Remaining', value: availableDiscretionary.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'time-allocation',
    name: 'discretionary Time Allocation Calculator',
    slug: 'time-allocation',
    category: 'lifestyle',
    description: 'See how you allocate your 168 weekly hours of life. Identifies available discretionary "free time" gaps.',
    formula: 'Remaining Hours = 168 - Work - Sleep - Chores - Commute',
    explanation: 'Audits your weekly schedule. Highlights scheduling leaks to help you make space for study, health, and family.',
    example: 'Working 40 hours, sleeping 8 hours a night, chores taking 10 hours, and commute taking 5 hours.',
    inputs: [
      { id: 'workHours', label: 'Work & Professional Hours per Week', type: 'number', defaultValue: 40, min: 0, max: 120 },
      { id: 'sleepHours', label: 'Average Sleeping Hours per Night', type: 'number', defaultValue: 8, min: 1, max: 24 },
      { id: 'choresTime', label: 'Chores, Cleaning & Grooming per Week (Hours)', type: 'number', defaultValue: 12, min: 0, max: 50 },
      { id: 'commuteTime', label: 'Weekly Travel & Commute (Hours)', type: 'number', defaultValue: 6, min: 0, max: 50 },
      { id: 'mealPrepTime', label: 'Cooking & Meal Times per Day (Hours)', type: 'number', defaultValue: 2, min: 0, max: 10 }
    ],
    faq: [
      { question: 'Are there exactly 168 hours in a week?', answer: 'Yes! (24 hours * 7 days). It is our ultimate fixed budget. Auditing this resource helps you identify time wasted on scrolling or unproductive habits.' }
    ],
    relatedSlugs: ['habit-progress', 'goal-progress', 'life-goal'],
    seoTitle: 'Weekly 168-Hour Time Allocation Calculator | Schedule Audit',
    seoDescription: 'Find your actual free time. Map out sleeping, commuting, working, and chore hours to optimize your daily routine.',
    calculate: (inputs) => {
      const work = Number(inputs.workHours || 40);
      const sleepDays = Number(inputs.sleepHours || 8) * 7;
      const chores = Number(inputs.choresTime || 12);
      const commute = Number(inputs.commuteTime || 6);
      const meal = Number(inputs.mealPrepTime || 2) * 7;

      const spentHours = work + sleepDays + chores + commute + meal;
      const remainingHours = Math.max(0, 168 - spentHours);
      const freeHoursPercent = (remainingHours / 168) * 100;

      return {
        results: [
          { label: 'Weekly Free Time Remaining', value: remainingHours, unit: 'hrs', isPrimary: true },
          { label: 'Free Time Proportion', value: `${freeHoursPercent.toFixed(1)}%`, isPrimary: true },
          { label: 'Total Dedicated/Allocated Hours', value: spentHours, unit: 'hrs' }
        ],
        chartData: {
          labels: ['Work', 'Sleep', 'Life Maintenance', 'Discretionary Free Time'],
          values: [work, sleepDays, chores + commute + meal, remainingHours],
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899']
        }
      };
    }
  },
  {
    id: 'goal-progress',
    name: 'Goal Progress Percentage Calculator',
    slug: 'goal-progress',
    category: 'lifestyle',
    description: 'Track progress toward multi-step milestones and estimate required completion timelines.',
    formula: 'Progress Percentage = (Completed Amount / Target Goal Quantity) * 100',
    explanation: 'Keeps you motivated by tracking progress on large goals (E.g., savings benchmarks, study targets, workout milestones). Includes project speed projections.',
    example: 'Aiming to save $10,000, with $4,200 already in your savings account.',
    inputs: [
      { id: 'goalTarget', label: 'Overall Target Goal Quantity', type: 'number', defaultValue: 10000, min: 1 },
      { id: 'completedAmt', label: 'Current Amount Already Done', type: 'number', defaultValue: 4200, min: 0 },
      { id: 'daysElapsed', label: 'Time Elapsed So Far (Days)', type: 'number', defaultValue: 30, min: 1 }
    ],
    faq: [
      { question: 'How is completing a goal timeline projected?', answer: 'This calculator divides your completed progress by days elapsed to find your daily pace. It then projects the remaining timeline based on that pace.' }
    ],
    relatedSlugs: ['habit-progress', 'time-allocation', 'life-goal'],
    seoTitle: 'Milestone Goal Progress & Timeline Completion Calculator',
    seoDescription: 'Track milestone achievements visually. Compute completion percentages, remaining amounts, and estimated target dates.',
    calculate: (inputs) => {
      const target = Number(inputs.goalTarget || 10000);
      const completed = Number(inputs.completedAmt || 0);
      const elapsed = Number(inputs.daysElapsed || 30);

      const validatedCompleted = Math.min(target, completed);
      const percentage = (validatedCompleted / target) * 100;
      const leftOver = target - validatedCompleted;

      const dailyPace = validatedCompleted / elapsed;
      const remainingDays = dailyPace > 0 ? leftOver / dailyPace : 0;

      return {
        results: [
          { label: 'Goal Completion Rate', value: `${percentage.toFixed(1)}%`, isPrimary: true },
          { label: 'Work Days Remaining to Finish', value: dailyPace > 0 ? Math.ceil(remainingDays) : 'Incalculable (No pace established)', isPrimary: true },
          { label: 'Quantity Remaining to Complete', value: leftOver.toLocaleString() },
          { label: 'Calculated Daily Performance Pace', value: dailyPace.toFixed(2), unit: 'units / day' }
        ]
      };
    }
  },
  {
    id: 'habit-progress',
    name: 'Habit Consistency Score Calculator',
    slug: 'habit-progress',
    category: 'lifestyle',
    description: 'Calculate your consistency index and track progress toward building long-term habits.',
    formula: 'Consistency Score = (Accrued Satisfied Days / Total Elapsed Days) * 100',
    explanation: 'Focuses on momentum and consistency over streaks, encouraging sustainable, long-term habit formation.',
    example: 'Hitting 18 gym sessions over a 30-day period.',
    inputs: [
      { id: 'trackedDays', label: 'Total Tracked Days of Habit', type: 'number', defaultValue: 30, min: 1 },
      { id: 'daysCompleted', label: 'Successful Days Logged', type: 'number', defaultValue: 22, min: 0 },
      { id: 'currentStreak', label: 'Active Successful Consecutive Streak', type: 'number', defaultValue: 5, min: 0 }
    ],
    faq: [
      { question: 'Why is habit consistency more important than maintaining streaks?', answer: 'Streaks are highly motivating but can cause discouragement if broken. Consistency scores capture your overall trend, helping you stay on track after a single missed day.' }
    ],
    relatedSlugs: ['goal-progress', 'time-allocation', 'life-goal'],
    seoTitle: 'Habit Consistency Score & Momentum Quality Calculator',
    seoDescription: 'Benchmark your habit-building progress. Convert completed days into consistency percentages and momentum scores.',
    calculate: (inputs) => {
      const total = Number(inputs.trackedDays || 30);
      const completed = Number(inputs.daysCompleted || 0);
      const streak = Number(inputs.currentStreak || 0);

      const validatedCompleted = Math.min(total, completed);
      const consistency = (validatedCompleted / total) * 100;

      // Momentum index: rewards consistency and active streaks
      const momentumCoefficient = Math.min(100, consistency + (streak * 3));

      let rating = 'Establishing Routine';
      if (momentumCoefficient >= 90) rating = 'Unstoppable Momentum';
      else if (momentumCoefficient >= 75) rating = 'Highly Consistent';
      else if (momentumCoefficient >= 50) rating = 'Solid Habit Foundations';

      return {
        results: [
          { label: 'Routine Consistency Score', value: `${consistency.toFixed(1)}%`, isPrimary: true },
          { label: 'Habit Momentum Rating', value: rating, isPrimary: true },
          { label: 'Successful Completed Days', value: validatedCompleted, unit: `/${total} days` },
          { label: 'Logged Missed Opportunities', value: total - validatedCompleted, unit: 'days' }
        ]
      };
    }
  },

  // ====================================== CYBERSECURITY ======================================
  {
    id: 'password-generator-strength',
    name: 'Password Entropy Strength Calculator',
    slug: 'password-generator-strength',
    category: 'cybersecurity',
    description: 'Calculate password entropy bits and estimate the time required for brute force decryption.',
    formula: 'Entropy Bits = Length * Log2(Pool Size)',
    explanation: 'Evaluates password strength using information theory. Higher entropy bits denote stronger resistance to dictionary attacks and massive computer cracking setups.',
    example: 'An 8-character password with letters only vs a 16-character alphanumeric password.',
    inputs: [
      { id: 'passLength', label: 'Character Length of Password', type: 'number', defaultValue: 12, min: 1, max: 128 },
      { id: 'incUpper', label: 'Include Uppercase Letters? (A-Z)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes (adds 26 symbols)', value: 'yes' },
        { label: 'No', value: 'no' }
      ]},
      { id: 'incLower', label: 'Include Lowercase Letters? (a-z)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes (adds 26 symbols)', value: 'yes' },
        { label: 'No', value: 'no' }
      ]},
      { id: 'incNumbers', label: 'Include Numeric Symbols? (0-9)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes (adds 10 symbols)', value: 'yes' },
        { label: 'No', value: 'no' }
      ]},
      { id: 'incSymbols', label: 'Include Special Characters? (@, $, % etc)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes (adds 32 symbols)', value: 'yes' },
        { label: 'No', value: 'no' }
      ]}
    ],
    faq: [
      { question: 'What is considered a safe entropy score?', answer: 'Aim for at least 80 bits of entropy. Any password with over 100 bits is secure and virtually uncrackable with current computer processing limits.' }
    ],
    relatedSlugs: ['security-score', 'encryption-comparison', 'attack-risk'],
    seoTitle: 'Password Entropy Strength & Brute Force Calculator | Security',
    seoDescription: 'Calculate the mathematical entropy of passwords. Find exact combinations, pool sizes, and brute force protection scores.',
    calculate: (inputs) => {
      const len = Number(inputs.passLength || 12);
      const up = inputs.incUpper === 'yes';
      const lr = inputs.incLower === 'yes';
      const num = inputs.incNumbers === 'yes';
      const sym = inputs.incSymbols === 'yes';

      let poolSize = 0;
      if (up) poolSize += 26;
      if (lr) poolSize += 26;
      if (num) poolSize += 10;
      if (sym) poolSize += 32;

      if (poolSize === 0) poolSize = 1; // safety prevent log(0)

      const entropyBits = len * Math.log2(poolSize);
      const totalCombinations = Math.pow(poolSize, len);

      let strengthLabel = 'Extremely Weak (Vulnerable)';
      if (entropyBits >= 100) strengthLabel = 'Military Grade (Uncrackable)';
      else if (entropyBits >= 80) strengthLabel = 'Strong (Excellent)';
      else if (entropyBits >= 60) strengthLabel = 'Moderate Quality';
      else if (entropyBits >= 40) strengthLabel = 'Weak (Risky)';

      // Brute force math: assume a supercomputer cluster doing 100 Billion guesses per second (1e11)
      const guessesPerSec = 100000000000;
      const secondsToCrack = totalCombinations / guessesPerSec;

      let crackTimeText = 'Instantly';
      if (secondsToCrack > 31536000000000) crackTimeText = 'Trillions of Years';
      else if (secondsToCrack > 3153600000) crackTimeText = `${Math.round(secondsToCrack / 31536000).toLocaleString()} Years`;
      else if (secondsToCrack > 86400) crackTimeText = `${Math.round(secondsToCrack / 86400)} Days`;
      else if (secondsToCrack > 3600) crackTimeText = `${Math.round(secondsToCrack / 3600)} Hours`;
      else if (secondsToCrack > 1) crackTimeText = `${Math.round(secondsToCrack)} Seconds`;

      return {
        results: [
          { label: 'Information Entropy Score', value: `${entropyBits.toFixed(1)} bits`, isPrimary: true },
          { label: 'Brute Force Defense Assessment', value: strengthLabel, isPrimary: true },
          { label: 'Time to Crack (at 100B guesses/sec)', value: crackTimeText },
          { label: 'Aggregate Pool Alphabet Size', value: `${poolSize} characters` }
        ]
      };
    }
  },
  {
    id: 'security-score',
    name: 'Unified Digital Security Score Calculator',
    slug: 'security-score',
    category: 'cybersecurity',
    description: 'Calculate your personal or small business security score based on cybersecurity hygiene.',
    formula: 'Score = sum(Factor Weight * Factor Input)',
    explanation: 'Evaluates your overall cyber security health, identifying key risk areas and recommending improvements.',
    example: 'Having MFA enabled and unique passwords with occasional OS updates builds a solid security posture.',
    inputs: [
      { id: 'mfaPercent', label: 'Proportion of Services with MFA active (%)', type: 'number', defaultValue: 60, min: 0, max: 100 },
      { id: 'uniquePass', label: 'Proportion of Unique Complex Passwords (%)', type: 'number', defaultValue: 50, min: 0, max: 100 },
      { id: 'updatesDone', label: 'How promptly do you apply device updates?', type: 'select', defaultValue: 'week', options: [
        { label: 'Instantly (Automatic)', value: '100' },
        { label: 'Within a week of release', value: '80' },
        { label: 'Within a month', value: '40' },
        { label: 'Rarely / Never update', value: '0' }
      ]},
      { id: 'phishingTest', label: 'Latest phishing awareness quiz score (%)', type: 'number', defaultValue: 70, min: 0, max: 100 }
    ],
    faq: [
      { question: 'Why is MFA the single most critical security component?', answer: 'Multi-factor authentication (MFA) blocks roughly 99% of bulk automated credential stuffing attacks, serving as a vital second layer of defense.' }
    ],
    relatedSlugs: ['password-generator-strength', 'attack-risk', 'encryption-comparison'],
    seoTitle: 'Digital Security Audit & Vulnerability Score Calculator | Pro',
    seoDescription: 'Benchmark your personal cyber hygiene score. Computes multi-factor verification, password uniqueness, and patch promptness.',
    calculate: (inputs) => {
      const mfa = Number(inputs.mfaPercent || 0);
      const unique = Number(inputs.uniquePass || 0);
      const updates = Number(inputs.updatesDone || '80');
      const phishing = Number(inputs.phishingTest || 0);

      const securityScoreSum = (mfa * 0.35) + (unique * 0.25) + (updates * 0.20) + (phishing * 0.20);
      const finalIndex = Math.round(securityScoreSum);

      let vulnerabilityLevel = 'Critical risk profile';
      if (finalIndex >= 90) vulnerabilityLevel = 'Secure Posture';
      else if (finalIndex >= 70) vulnerabilityLevel = 'Moderate Security (Some exposures)';
      else if (finalIndex >= 40) vulnerabilityLevel = 'Weak Protection';

      return {
        results: [
          { label: 'Overall Security Score', value: `${finalIndex} / 100`, isPrimary: true },
          { label: 'Postural Health Status', value: vulnerabilityLevel, isPrimary: true },
          { label: 'MFA Defense Component Impact', value: Math.round(mfa * 0.35), unit: '/35' },
          { label: 'Credential Safety Contribution', value: Math.round(unique * 0.25), unit: '/25' }
        ]
      };
    }
  },
  {
    id: 'attack-risk',
    name: 'Cyberattack Breaching Risk Calculator',
    slug: 'attack-risk',
    category: 'cybersecurity',
    description: 'Calculate the probability of a data breach or ransomware event based on team scale and training click outcomes.',
    formula: 'Breach Risk Likelihood % = Click Rate * Size Coefficient * Backup Multiplier',
    explanation: 'Computes vulnerability indicators and potential financial losses for small businesses.',
    example: 'An office of 50 employees experiencing a 15% click rate during email phishing drills.',
    inputs: [
      { id: 'employeeSize', label: 'Company Employee Headcount', type: 'number', defaultValue: 45, min: 2 },
      { id: 'phishingClickRate', label: 'Employee Phishing Simulation Click Rate (%)', type: 'number', defaultValue: 12, min: 0, max: 100 },
      { id: 'backupInterval', label: 'Business Database Backup Frequency', type: 'select', defaultValue: 'daily', options: [
        { label: 'Real-time Immutable Redundancies', value: '0.1' },
        { label: 'Daily Backup Operations', value: '1.0' },
        { label: 'Weekly Backups', value: '4.0' },
        { label: 'Monthly / Unregulated System', value: '10.0' }
      ]}
    ],
    faq: [
      { question: 'What is the most common cyber attack vector for companies?', answer: 'Phishing remains the primary entry point, as attackers exploit human vulnerability to steal credentials and gain corporate access.' }
    ],
    relatedSlugs: ['security-score', 'backup-recovery', 'recovery-time-rto'],
    seoTitle: 'Ransomware Cyberattack Breach Liability Calculator | SMB Tool',
    seoDescription: 'Evaluate corporate ransomware and phishing vulnerability. Computes likelihood of system breach and estimated financial impact.',
    calculate: (inputs) => {
      const size = Number(inputs.employeeSize || 10);
      const clickRate = Number(inputs.phishingClickRate || 10);
      const backupCoeff = Number(inputs.backupInterval || '1.0');

      // Simple probabilistic risk scale model
      const threatExposureFactor = size * (clickRate / 100);
      const rawLikelihood = 100 * (1 - Math.exp(-0.05 * threatExposureFactor));
      const finalLikelihood = Math.min(99, Math.max(1, rawLikelihood * (0.8 + (backupCoeff * 0.05))));

      const avgLossImpact = size * 1500; // estimated $1,500 recovery expense per employee asset
      const riskPremiumValue = avgLossImpact * (finalLikelihood / 100);

      return {
        results: [
          { label: 'Breach Likelihood Précis', value: `${finalLikelihood.toFixed(1)}%`, isPrimary: true },
          { label: 'Est. Annual Risk Financial Premium', value: riskPremiumValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Base Asset Financial Liability', value: avgLossImpact.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'encryption-comparison',
    name: 'Cryptographic Encryption Decryption Brute Force Solver',
    slug: 'encryption-comparison',
    category: 'cybersecurity',
    description: 'Calculate cryptographic key spaces and estimate the centuries required to brute force modern standards.',
    formula: 'Keyspace Size = 2^Key Bit Depth',
    explanation: 'Illustrates the mathematical scale of cryptographic designs. Compares AES, RSA, and SHA standard sizes.',
    example: 'Comparing the structural strength of AES-128 against the uncrackable AES-256 scale.',
    inputs: [
      { id: 'cipherStandard', label: 'Cryptographic Standard & Bit Depth', type: 'select', defaultValue: 'aes128', options: [
        { label: 'AES-128 (Symmetric Key cipher)', value: '128' },
        { label: 'AES-256 (Industry Gold Standard)', value: '256' },
        { label: 'RSA-1024 (Outdated Asymmetric Standard)', value: '1024' },
        { label: 'RSA-2048 (Mainstream Web standard)', value: '2048' }
      ]},
      { id: 'speedFlops', label: 'Supercomputer Cluster Guesses per Sec (Ops/sec)', type: 'select', defaultValue: 'exascale', options: [
        { label: 'Fast Mining Server (10 Trillion/sec, 1E13)', value: '1e13' },
        { label: 'Exascale Supercomputer Cluster (1 Quintillion/sec, 1E18)', value: '1e18' },
        { label: 'Theoretical Quantum Node (1 Decillion/sec, 1E33)', value: '1e33' }
      ]}
    ],
    faq: [
      { question: 'Why is AES-256 considered completely quantum-safe?', answer: 'Even with advanced quantum computers running Grover\'s search algorithm, the effective key strength of AES-256 is only halved to 128 bits, which still requires trillions of years to brute-force.' }
    ],
    relatedSlugs: ['password-generator-strength', 'security-score', 'attack-risk'],
    seoTitle: 'AES & RSA Encryption Strength & Brute Force Calculator',
    seoDescription: 'Compare cryptographic algorithms. Calculates absolute key spaces and forecasts processing time milestones based on computing speeds.',
    calculate: (inputs) => {
      const bits = Number(inputs.cipherStandard || '128');
      const speedStr = inputs.speedFlops || '1e18';
      const speed = parseFloat(speedStr);

      // We calculate estimate using logarithms to avoid Infinity overflow
      // Log10(Seconds) = bits * Log10(2) - Log10(speed)
      const log1e2 = Math.log10(2);
      const logS = bits * log1e2 - Math.log10(speed);

      let timeLabel = '';
      if (logS > 100) {
        timeLabel = 'Trillions of Universe Lifespans';
      } else if (logS > 15) {
        timeLabel = `Over 10^${Math.round(logS - 7.49)} years (Essentially Infinite)`;
      } else {
        const seconds = Math.pow(10, logS);
        if (seconds > 31536000) timeLabel = `${Math.ceil(seconds / 31536000).toLocaleString()} Years`;
        else if (seconds > 86400) timeLabel = `${Math.ceil(seconds / 86400)} Days`;
        else timeLabel = `${seconds.toFixed(2)} Seconds`;
      }

      return {
        results: [
          { label: 'Entropy Bit Depth', value: `${bits} bits`, isPrimary: true },
          { label: 'Estimated Decryption Duration', value: timeLabel, isPrimary: true },
          { label: 'Log10 Combination Space', value: `10^${Math.round(bits * Math.log10(2))}` }
        ]
      };
    }
  },
  {
    id: 'backup-recovery',
    name: 'System Backup Transfer & Recovery Time Objective (RTO) Calculator',
    slug: 'backup-recovery',
    category: 'cybersecurity',
    description: 'Calculate recovery velocities and check if file restore network transfer times fit your target Recovery Time Objective (RTO).',
    formula: 'Transfer Duration = Base File Sizing / Available Net link Speed',
    explanation: 'Audits network capacities during critical server failures, helping disaster recovery teams optimize target replication streams.',
    example: 'Restoring a 5TB company server backup database over a dedicated 500 Mbps fiber line.',
    inputs: [
      { id: 'backupSizeTB', label: 'Overall Recovery Backup Sizing (Terabytes)', type: 'number', defaultValue: 2.5, min: 0.01, step: 0.01 },
      { id: 'networkSpeedMbps', label: 'Available Network Download Speed (Mbps)', type: 'number', defaultValue: 300, min: 1 },
      { id: 'targetRtoHours', label: 'Strict Target recovery limit (RTO) (Hours)', type: 'number', defaultValue: 12, min: 1 }
    ],
    faq: [
      { question: 'What is the Recovery Time Objective (RTO)?', answer: 'RTO defines the maximum acceptable duration of downtime before system recovery must be completed to prevent significant financial or operational loss.' }
    ],
    relatedSlugs: ['recovery-time-rto', 'security-score', 'attack-risk'],
    seoTitle: 'Network Backup File Recovery & RTO Estimator | IT Disaster tool',
    seoDescription: 'Find exact recovery durations for large database backups over network pipes. Conforms to corporate disaster recovery plan validation.',
    calculate: (inputs) => {
      const sizeTB = Number(inputs.backupSizeTB || 2.5);
      const speedMbps = Number(inputs.networkSpeedMbps || 300);
      const rto = Number(inputs.targetRtoHours || 12);

      // TB to Bits: sizeTB * 1e12 * 8 bytes
      const totalBits = sizeTB * 8 * Math.pow(10, 12);
      const totalSecondsRaw = totalBits / (speedMbps * 1000000);
      const totalHours = totalSecondsRaw / 3600;

      const rtoPassed = totalHours <= rto;

      return {
        results: [
          { label: 'Requires Transfer Duration', value: `${totalHours.toFixed(2)} hours`, isPrimary: true },
          { label: 'RTO SLA Compliance', value: rtoPassed ? 'PASS (In-Bounds)' : 'FAIL (Deficit Pipeline)', isPrimary: true },
          { label: 'Sling Traffic Rate Per Hour', value: `${((speedMbps * 3600) / 8000).toFixed(1)} GB/hr` }
        ]
      };
    }
  },
  {
    id: 'recovery-time-rto',
    name: 'Incident Downtime Financial Impact Calculator',
    slug: 'recovery-time-rto',
    category: 'cybersecurity',
    description: 'Calculate the total financial damage of a cyber incident, combining alert, patching, and data restoration timeline phases.',
    formula: 'Overall Cost = Total Outage Duration * Hourly Business Loss',
    explanation: 'Helps CISOs justify security budgets to stakeholders by quantifying the potential financial impact of downtime.',
    example: 'An e-commerce site experiencing a 15-hour outage, costing $4,500 in lost transactions per hour.',
    inputs: [
      { id: 'identifyHours', label: 'Time Spent to Detect Incident (Hours)', type: 'number', defaultValue: 5, min: 0 },
      { id: 'patchHours', label: 'Time Spent to Patch & Contain (Hours)', type: 'number', defaultValue: 6, min: 0 },
      { id: 'dbRestoreHours', label: 'Time Spent to Restore Backups (Hours)', type: 'number', defaultValue: 4, min: 0 },
      { id: 'hourlyOutageExpense', label: 'Estimated Interrupted Operations Loss ($/hour)', type: 'number', defaultValue: 3200, min: 0 }
    ],
    faq: [
      { question: 'What is Mean Time to Detect (MTTD)?', answer: 'MTTD measures the average duration between a security breach occurring and when the team formally identifies the threat vector.' }
    ],
    relatedSlugs: ['backup-recovery', 'security-score', 'attack-risk'],
    seoTitle: 'Cyber Security Breach Incident Financial Impact Calculator',
    seoDescription: 'Calculate direct operational damage from cyber incident outages based on identification, containment, and recovery durations.',
    calculate: (inputs) => {
      const ident = Number(inputs.identifyHours || 5);
      const patch = Number(inputs.patchHours || 6);
      const restore = Number(inputs.dbRestoreHours || 4);
      const rate = Number(inputs.hourlyOutageExpense || 3200);

      const totalDowntimeHours = ident + patch + restore;
      const finalCost = totalDowntimeHours * rate;

      return {
        results: [
          { label: 'Total Incident Cost Damage', value: finalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Total Offline System Outage', value: `${totalDowntimeHours} hours`, isPrimary: true },
          { label: 'Identification Phase Cost', value: (ident * rate).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Containment & Restoration Cost', value: ((patch + restore) * rate).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },

  // ====================================== PROGRAMMING ======================================
  {
    id: 'api-request-calculator',
    name: 'API Cloud Request & Network cost Calculator',
    slug: 'api-request-calculator',
    category: 'programming',
    description: 'Calculate average monthly API payloads, data egress parameters, and estimate API proxy costs.',
    formula: 'Egress Traffic = Requests Count * Payload Sizing',
    explanation: 'Helps developers budget system architectures, preventing unexpected cloud egress storage bills on cloud providers.',
    example: 'E.g., Serving 100 requests every second with a 35KB average JSON payload size.',
    inputs: [
      { id: 'reqPerSec', label: 'Average API Traffic Rate (Requests/Sec) (RPS)', type: 'number', defaultValue: 50, min: 0 },
      { id: 'payloadSizeKB', label: 'Average Payload Size per Request (KB)', type: 'number', defaultValue: 25, min: 0.1, step: 0.1 },
      { id: 'costPerMillion', label: 'Cloud Execution Cost per 1 Million Requests ($)', type: 'number', defaultValue: 3.5, min: 0, step: 0.1 }
    ],
    faq: [
      { question: 'What is API network egress?', answer: 'Egress refers to data traveling from your server back to the calling client. Cloud providers often bill egress traffic per GB, making caching essential for heavy payloads.' }
    ],
    relatedSlugs: ['server-capacity', 'database-growth', 'software-project-budget'],
    seoTitle: 'Cloud Traffic API Request & Egress Bandwidth Calculator | System Admin',
    seoDescription: 'Estimate API execution expenses. Calculate monthly transaction counts, network bandwidth volumes, and hosting server costs.',
    calculate: (inputs) => {
      const rps = Number(inputs.reqPerSec || 50);
      const sizing = Number(inputs.payloadSizeKB || 25);
      const rate = Number(inputs.costPerMillion || 3.5);

      const reqPerDay = rps * 86400;
      const reqPerMonth = reqPerDay * 30.4; // avg month

      const payloadPerMonthKB = reqPerMonth * sizing;
      const egressGB = payloadPerMonthKB / 1048576; // KB to GB

      const serverRequestCost = (reqPerMonth / 1000000) * rate;

      return {
        results: [
          { label: 'Monthly Request Volume', value: Math.round(reqPerMonth).toLocaleString(), unit: 'requests', isPrimary: true },
          { label: 'Monthly Data Egress Volume', value: `${egressGB.toFixed(1)} GB`, isPrimary: true },
          { label: 'Monthly Cloud Request Expenses', value: serverRequestCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) },
          { label: 'Egress Cost projection (at $0.08/GB)', value: (egressGB * 0.08).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'server-capacity',
    name: 'Server Node Capacity Estimator',
    slug: 'server-capacity',
    category: 'programming',
    description: 'Estimate required web server instances and concurrent connection bounds based on traffic peaks.',
    formula: 'Instances Required = Daily Users * Active Time Factor / Host Capacity limit',
    explanation: 'Prevents downtime by helping developers size server scaling parameters ahead of marketing campaigns.',
    example: 'Hosting 150,000 active daily users with typical 180-second session lengths.',
    inputs: [
      { id: 'dailyActiveUsers', label: 'Daily Active Users (DAU)', type: 'number', defaultValue: 100000, min: 100 },
      { id: 'sessionLengthSec', label: 'Average User Session Duration (Seconds)', type: 'number', defaultValue: 150, min: 10 },
      { id: 'instanceLimit', label: 'Single Server Instance Connection limit (CCU)', type: 'number', defaultValue: 4000, min: 100 },
      { id: 'peakMultiplier', label: 'Traffic Peak Multiplier (Typical: 3.0x)', type: 'number', defaultValue: 2.5, min: 1, max: 20, step: 0.1 }
    ],
    faq: [
      { question: 'What does CCU mean?', answer: 'Concurrent Users (CCU) represents the number of active users browsing or making server API calls at the exact same moment.' }
    ],
    relatedSlugs: ['api-request-calculator', 'database-growth', 'code-time-estimator'],
    seoTitle: 'Web Server Node Capacity & Load Balancing Calculator | Scale',
    seoDescription: 'Find peak concurrent traffic loads and estimate necessary server instances to host daily active users.',
    calculate: (inputs) => {
      const dau = Number(inputs.dailyActiveUsers || 100000);
      const session = Number(inputs.sessionLengthSec || 150);
      const limit = Number(inputs.instanceLimit || 4000);
      const peak = Number(inputs.peakMultiplier || 2.5);

      // Average users per second
      // Session volume over 86,400 daily seconds
      const avgConcurrent = (dau * session) / 86400;
      const peakConcurrent = avgConcurrent * peak;
      const instancesNeeded = Math.ceil(peakConcurrent / limit);

      return {
        results: [
          { label: 'Peak Concurrent Users (CCU)', value: Math.round(peakConcurrent).toLocaleString(), unit: 'users', isPrimary: true },
          { label: 'Required Server Instances', value: Math.max(1, instancesNeeded), unit: 'servers', isPrimary: true },
          { label: 'Average Concurrent Users', value: Math.round(avgConcurrent).toLocaleString(), unit: 'users' },
          { label: 'Instance Buffer Margin Score', value: `${((1 - (peakConcurrent / (Math.max(1, instancesNeeded) * limit))) * 100).toFixed(0)}%` }
        ]
      };
    }
  },
  {
    id: 'database-growth',
    name: 'Database Storage Growth Calculator',
    slug: 'database-growth',
    category: 'programming',
    description: 'Project database storage needs over 1, 3, and 5 years based on daily registrations and raw user record weight parameters.',
    formula: 'Growth/Year = (Daily Registrations * 365 * Record Size) + Logs Overhead',
    explanation: 'Helps developers plan database storage upgrades, preventing database operations from failing due to full disks.',
    example: 'Adding 10,000 new users daily, storing average profile sizes of 5KB per record.',
    inputs: [
      { id: 'initialDbSizeGB', label: 'Initial Database Size (GB)', type: 'number', defaultValue: 50, min: 0 },
      { id: 'dailyRegistrations', label: 'Daily New Registrations / Records Added', type: 'number', defaultValue: 8000, min: 0 },
      { id: 'recordSizeKB', label: 'Average Storage Weight Per Record (KB)', type: 'number', defaultValue: 8, min: 0.1, step: 0.1 },
      { id: 'mediaLogsGBMonth', label: 'Monthly Media Logs & System Backups Sizing (GB)', type: 'number', defaultValue: 20, min: 0 }
    ],
    faq: [
      { question: 'Why does database overhead often exceed raw values?', answer: 'Indices, replication logs, transaction histories, and cache pools can inflate actual storage needs to 2-3x the raw data value.' }
    ],
    relatedSlugs: ['api-request-calculator', 'server-capacity', 'software-project-budget'],
    seoTitle: 'Database Growth & Storage Prediction Calculator | DBA Tools',
    seoDescription: 'Project the storage requirements of your SQL or NoSQL databases over 5 years. Solves user profile sizes and indexing overhead.',
    calculate: (inputs) => {
      const initial = Number(inputs.initialDbSizeGB || 50);
      const daily = Number(inputs.dailyRegistrations || 8000);
      const sizeKB = Number(inputs.recordSizeKB || 8);
      const miscGB = Number(inputs.mediaLogsGBMonth || 20);

      const dailyGrowthGB = (daily * sizeKB) / 1048576; // KB to GB
      const yearlyUserGrowthGB = dailyGrowthGB * 365;
      const yearlyMiscGrowthGB = miscGB * 12;
      const overallAnnualGB = yearlyUserGrowthGB + yearlyMiscGrowthGB;

      return {
        results: [
          { label: 'DB Size after 1 Year', value: `${(initial + overallAnnualGB).toFixed(1)} GB`, isPrimary: true },
          { label: 'DB Size after 3 Years', value: `${(initial + (overallAnnualGB * 3)).toFixed(1)} GB`, isPrimary: true },
          { label: 'DB Size after 5 Years', value: `${(initial + (overallAnnualGB * 5)).toFixed(1)} GB` },
          { label: 'Average Daily Growth Rate', value: `${(dailyGrowthGB * 1024 + (miscGB * 1024 / 30.4)).toFixed(1)} MB/day` }
        ]
      };
    }
  },
  {
    id: 'code-time-estimator',
    name: 'Software Code Time Estimator',
    slug: 'code-time-estimator',
    category: 'programming',
    description: 'Estimate required engineering hours and calendar week spans for building software products.',
    formula: 'Time = sum(Feature Hours) * Engineer Skill factor * QA coverage multipliers',
    explanation: 'Models development cycles based on feature sets, testing levels, and team experience, helping product managers set realistic expectations.',
    example: 'Scheduling a 12-screen React mobile application with 6 backend APIs.',
    inputs: [
      { id: 'screenCount', label: 'Number of Unique UI Screens/Views', type: 'number', defaultValue: 8, min: 1 },
      { id: 'dbModelCount', label: 'Database Entities / Schema Models', type: 'number', defaultValue: 5, min: 0 },
      { id: 'apiCount', label: 'Required Third-Party API Integrations', type: 'number', defaultValue: 4, min: 0 },
      { id: 'testDensity', label: 'Core Testing Coverage Tier', type: 'select', defaultValue: 'standard', options: [
        { label: 'Ad-hoc Manual Verification (1.0x)', value: '1.0' },
        { label: 'Standard Jest/Cypress integration (1.3x)', value: '1.3' },
        { label: '100% Strict Safety Type Coverage (1.7x)', value: '1.7' }
      ]},
      { id: 'developerSkill', label: 'Average Developer Experiential Level', type: 'select', defaultValue: 'mid', options: [
        { label: 'Junior / Rookie Staff (1.6x)', value: '1.6' },
        { label: 'Mid-Level Professional (1.0x)', value: '1.0' },
        { label: 'Senior Architect / Lead (0.6x)', value: '0.6' }
      ]}
    ],
    faq: [
      { question: 'Why does testing density slow down initial development?', answer: 'Writing unit, integration, and end-to-end tests increases upfront development time but saves countless hours in long-term maintenance by preventing regressions.' }
    ],
    relatedSlugs: ['software-project-budget', 'development-cost', 'server-capacity'],
    seoTitle: 'Software Engineering Time & Hour Estimator | Agile PM',
    seoDescription: 'Forecast software engineering timelines based on UI view densities, API routes, and testing requirements.',
    calculate: (inputs) => {
      const screens = Number(inputs.screenCount || 8);
      const dbs = Number(inputs.dbModelCount || 5);
      const apis = Number(inputs.apiCount || 4);
      const testMultiplier = Number(inputs.testDensity || '1.3');
      const skillMultiplier = Number(inputs.developerSkill || '1.0');

      const featureHoursRaw = (screens * 12) + (dbs * 15) + (apis * 18);
      const computedLaborHours = featureHoursRaw * testMultiplier * skillMultiplier;
      const calendarWeeks = computedLaborHours / 35; // typical 35-hour developer work week

      return {
        results: [
          { label: 'Estimated Developer Hours', value: Math.ceil(computedLaborHours), unit: 'hrs', isPrimary: true },
          { label: 'Project Calendar Span', value: `${calendarWeeks.toFixed(1)} Weeks`, isPrimary: true },
          { label: 'Estimated Standard QA Hours', value: Math.ceil(computedLaborHours * 0.25), unit: 'hrs' },
          { label: 'Complexity Index Tier', value: featureHoursRaw > 200 ? 'Enterprise Class' : featureHoursRaw > 80 ? 'Standard SaaS MVP' : 'Minimalist Prototype' }
        ]
      };
    }
  },
  {
    id: 'software-project-budget',
    name: 'Software Project Budget Calculator',
    slug: 'software-project-budget',
    category: 'programming',
    description: 'Calculate overall development budgets for digital applications and SaaS projects, outlining developer labor and hosting.',
    formula: 'Total Budget = (Hours * Rate) + SaaS Integrations + Hosting + Contingency Buffer',
    explanation: 'Helps agencies and founders calculate comprehensive development budgets, including hosting, third-party APIs, and safety buffers.',
    example: 'Proposing a 200-hour development contract at $75/hr with a 15% contingency buffer.',
    inputs: [
      { id: 'devHours', label: 'Estimated Development Labor (Hours)', type: 'number', defaultValue: 150, min: 10 },
      { id: 'ratePerHour', label: 'Average Developer Hourly Billing Rate ($/hr)', type: 'number', defaultValue: 75, min: 15 },
      { id: 'saasIntegrations', label: 'Premium API & SaaS License Monthly Cost ($)', type: 'number', defaultValue: 150, min: 0 },
      { id: 'serverHosting', label: 'Annual Server & Cloud Infrastructure Cost ($)', type: 'number', defaultValue: 1200, min: 0 },
      { id: 'contingencyFactor', label: 'Budget Contingency Buffer Allowance (%)', type: 'number', defaultValue: 15, min: 0, max: 100 }
    ],
    faq: [
      { question: 'Why is a development budget buffer necessary?', answer: 'Development projects often encounter unknown challenges, such as undocumented API issues or scope adjustments, making a 15-20% contingency buffer standard practice.' }
    ],
    relatedSlugs: ['code-time-estimator', 'development-cost', 'api-request-calculator'],
    seoTitle: 'Software Application Development Cost & Project Budget Calculator',
    seoDescription: 'Estimate overall development budgets for mobile and web apps, including contractor billings, API integration fees, and cloud hosting.',
    calculate: (inputs) => {
      const hours = Number(inputs.devHours || 150);
      const rate = Number(inputs.ratePerHour || 75);
      const saas = Number(inputs.saasIntegrations || 150);
      const host = Number(inputs.serverHosting || 1200);
      const contingency = Number(inputs.contingencyFactor || 15) / 100;

      const laborCost = hours * rate;
      const subtotalOverhead = laborCost + (saas * 12) + host;
      const bufferCost = subtotalOverhead * contingency;
      const grandTotalBudget = subtotalOverhead + bufferCost;

      return {
        results: [
          { label: 'Overall Project Budget', value: grandTotalBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Core Engineering Labor Cost', value: laborCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Reserve Contingency Buffer', value: bufferCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Operation/SaaS Subscriptions Year', value: ((saas * 12) + host).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'development-cost',
    name: 'Software Lifetime Maintenance Cost Calculator',
    slug: 'development-cost',
    category: 'programming',
    description: 'Calculate the Total Cost of Ownership (TCO) for software products, including annual upkeep and update cycles.',
    formula: 'Lifetime Cost = Build Cost + (Build Cost * Annual Upkeep % + Revisions * Update Cost) * Years',
    explanation: 'Highlights the hidden, post-launch expenses of software products, such as patch updates, security compliance, operating systems upgrades, and bug fixes.',
    example: 'An upfront build costing $50K, requiring standard 15% annual maintenance and 3 update cycles yearly.',
    inputs: [
      { id: 'upfrontBuildCost', label: 'Upfront Initial Build Cost ($)', type: 'number', defaultValue: 40000, min: 1000 },
      { id: 'upkeepPercent', label: 'Annual Upkeep & Server Maintenance Rate (%)', type: 'number', defaultValue: 15, min: 5, max: 50 },
      { id: 'updatesCount', label: 'Required Update/Feature Rounds Per Year', type: 'number', defaultValue: 3, min: 0 },
      { id: 'costPerUpdate', label: 'Average Cost per Update Round ($)', type: 'number', defaultValue: 1500, min: 0 }
    ],
    faq: [
      { question: 'What is the industry standard for annual software maintenance?', answer: 'Software maintenance costs typically run between 15% and 25% of the original build budget annually to cover hosting, API updates, and compliance.' }
    ],
    relatedSlugs: ['software-project-budget', 'code-time-estimator', 'api-request-calculator'],
    seoTitle: 'Software Total Cost of Ownership (TCO) & Upkeep Calculator',
    seoDescription: 'Estimate long-term software upkeep costs, evaluating upfront budgets, hosting renewals, security patching, and annual version updates.',
    calculate: (inputs) => {
      const compileBuild = Number(inputs.upfrontBuildCost || 40000);
      const upkeepRate = Number(inputs.upkeepPercent || 15) / 100;
      const updates = Number(inputs.updatesCount || 3);
      const updateCost = Number(inputs.costPerUpdate || 1500);

      const annualUpkeep = compileBuild * upkeepRate;
      const annualUpdates = updates * updateCost;
      const combinedAnnualFees = annualUpkeep + annualUpdates;

      const cost3Years = compileBuild + (combinedAnnualFees * 3);
      const cost5Years = compileBuild + (combinedAnnualFees * 5);

      return {
        results: [
          { label: '3-Year Total Cost of Ownership', value: cost3Years.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: '5-Year Total Cost of Ownership', value: cost5Years.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Combined Year Upkeep Rate', value: combinedAnnualFees.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Ratio of Upkeep relative to Build', value: `${((combinedAnnualFees / compileBuild) * 100).toFixed(0)}% / year` }
        ]
      };
    }
  }
];
