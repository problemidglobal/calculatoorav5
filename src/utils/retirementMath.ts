export interface TimelineEvent {
  id: string;
  age: number;
  description: string;
  contribution: number;
  withdrawal: number;
  income: number;
  expense: number;
  isCollapsed?: boolean;
}

export interface RetirementPhase {
  id: string;
  name: string;
  startAge: number;
  endAge: number;
  contribution: number;
  withdrawal: number;
  returnRate: number;
  inflation: number;
  expenses: number;
}

export interface GoalPlannerInputs {
  targetIncome: number;
  targetIncomeType: 'monthly' | 'annual';
  targetSavings: number;
  targetAge: number;
}

export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  annualContribution: number;
  contributionStepUp: number;
  contributionFrequency: 'monthly' | 'annual';
  employerContribution: number;
  employerContributionType: 'amount' | 'percent';
  preRetireReturn: number;
  postRetireReturn: number;
  inflationRate: number;
  salary: number;
  salaryGrowth: number;
  targetIncome: number;
  targetIncomeType: 'monthly' | 'annual';
  taxRate: number;
  swrPercent: number;
  withdrawalStrategy: 'fixed' | 'percentage' | 'dynamic' | 'inflation_adjusted' | 'custom';
  volatility: number;
  currency: string; // '$' | '€' | '£' | '¥' | '₹'
  
  // Healthcare
  healthcareCost: number;
  healthcareCostType: 'monthly' | 'annual';
  healthcareInflation: number;

  // Other retirement income
  socialSecurity: number; // Monthly
  ssStartAge: number;
  pensionIncome: number;
  pensionType: 'monthly' | 'annual';
  rentalIncome: number;
  businessIncome: number;
  investmentIncome: number;
  customRecurringIncome: number;
  inheritance: number;
  inheritanceAge: number;

  // Timeline Events
  events: TimelineEvent[];

  // Phases
  phases: RetirementPhase[];
  phasesEnabled: boolean;

  // FIRE Mode Settings
  fireEnabled?: boolean;
  leanFireMultiplier?: number;
  fatFireMultiplier?: number;

  // Goal Planner
  goalPlanner: GoalPlannerInputs;

  // Monte Carlo count
  monteCarloCount: 100 | 500 | 1000 | 5000;
}

export interface YearProjection {
  age: number;
  yearIndex: number;
  isRetired: boolean;
  startingBalance: number;
  contribution: number;
  investmentReturn: number;
  withdrawal: number;
  income: number;
  expenses: number;
  taxes: number;
  endingBalance: number;
  purchasingPowerValue: number; // ending balance discounted by cumulative inflation
  spendingNeed: number;
  socialSecurity: number;
}

export interface MonteCarloRun {
  age: number;
  p10: number; // 10th percentile
  p50: number; // 50th percentile (median)
  p90: number; // 90th percentile
}

export interface HistogramBin {
  rangeLabel: string;
  count: number;
  percentage: number;
}

export interface GoalPlannerResults {
  requiredMonthlyContribution: number | null;
  requiredAnnualReturn: number | null;
  requiredRetirementAge: number | null;
  savingsGap: number;
}

export interface FIREResults {
  fireTarget: number;
  leanFireTarget: number;
  fatFireTarget: number;
  coastFireTarget: number;
  safeWithdrawalEstimate: number;
  yearsUntilFIRE: number | null;
}

export interface RetirementResults {
  deterministicTimeline: YearProjection[];
  requiredNestEgg: number;
  projectedNestEgg: number;
  savingsGap: number;
  retirementReadinessScore: number; // 0 to 100
  readinessStatus: 'Ready' | 'Almost Ready' | 'Behind Target' | 'Needs Improvement';
  exhaustionAge: number | null; // Age at which portfolio hits 0, if any
  monteCarloSuccessRate: number; // % of runs that survive to lifeExpectancy
  monteCarloTimeline: MonteCarloRun[];
  monteCarloHistogram: HistogramBin[];
  totalContributions: number;
  totalGains: number;
  totalWithdrawals: number;
  goalPlannerResults: GoalPlannerResults;
  fireResults: FIREResults;
}

// Box-Muller transform for generating normally distributed random variables
function randomNormal(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); 
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

export function computeRetirementProjection(inputs: Partial<RetirementInputs>): RetirementResults {
  // Convert inputs to numbers or fallback to zero to guarantee no crash
  const currentAge = Number(inputs.currentAge) || 30;
  const retirementAge = Number(inputs.retirementAge) || 65;
  const lifeExpectancy = Number(inputs.lifeExpectancy) || 85;
  const currentSavings = Number(inputs.currentSavings) || 0;
  const contributionFrequency = inputs.contributionFrequency || 'monthly';
  const monthlyContribution = Number(inputs.monthlyContribution) || 0;
  const annualContribution = Number(inputs.annualContribution) || 0;
  
  const basePreRetireReturn = Number(inputs.preRetireReturn) || 0;
  const basePostRetireReturn = Number(inputs.postRetireReturn) || 0;
  const baseInflationRate = Number(inputs.inflationRate) || 0;
  const taxRate = Number(inputs.taxRate) || 0;
  const swrPercent = Number(inputs.swrPercent) || 4;
  const withdrawalStrategy = inputs.withdrawalStrategy || 'fixed';
  const volatility = Number(inputs.volatility) || 12;

  // Salary & Employer
  const currentSalary = Number(inputs.salary) || 0;
  const salaryGrowth = Number(inputs.salaryGrowth) || 0;
  const employerContribution = Number(inputs.employerContribution) || 0;
  const employerContributionType = inputs.employerContributionType || 'amount';

  // Desired income
  const rawTargetIncome = Number(inputs.targetIncome) || 0;
  const targetIncomeType = inputs.targetIncomeType || 'monthly';
  const desiredAnnualIncomeTodayDollars = targetIncomeType === 'monthly' ? rawTargetIncome * 12 : rawTargetIncome;

  // Healthcare
  const rawHealthcareCost = Number(inputs.healthcareCost) || 0;
  const healthcareCostType = inputs.healthcareCostType || 'monthly';
  const healthcareAnnualCost = healthcareCostType === 'monthly' ? rawHealthcareCost * 12 : rawHealthcareCost;
  const healthcareInflation = Number(inputs.healthcareInflation) || 0;

  // Other incomes
  const socialSecurityMonthly = Number(inputs.socialSecurity) || 0;
  const ssStartAge = Number(inputs.ssStartAge) || 67;
  const rawPension = Number(inputs.pensionIncome) || 0;
  const pensionType = inputs.pensionType || 'monthly';
  const pensionAnnual = pensionType === 'monthly' ? rawPension * 12 : rawPension;

  const rentalAnnual = (Number(inputs.rentalIncome) || 0) * 12;
  const businessAnnual = (Number(inputs.businessIncome) || 0) * 12;
  const investmentAnnual = (Number(inputs.investmentIncome) || 0) * 12;
  const customRecurringAnnual = (Number(inputs.customRecurringIncome) || 0) * 12;
  const inheritanceAmount = Number(inputs.inheritance) || 0;
  const inheritanceAge = Number(inputs.inheritanceAge) || 0;

  // Events & Phases
  const events = inputs.events || [];
  const phases = inputs.phases || [];
  const phasesEnabled = !!inputs.phasesEnabled;

  const totalYears = Math.max(0, lifeExpectancy - currentAge);
  const yearsToRetire = Math.max(0, retirementAge - currentAge);

  // Help compute phase values for a specific age
  const getPhaseAtAge = (age: number): RetirementPhase | null => {
    if (!phasesEnabled || phases.length === 0) return null;
    return phases.find(p => age >= p.startAge && age <= p.endAge) || null;
  };

  // Compute Required Nest Egg based on SWR (Safe Withdrawal Rate)
  // Required Nest Egg = Needed Net Annual Spending in Retirement (grossed up for tax) / SWR
  // Today's spending needs adjusted for inflation up to retirement age
  const inflationMultiplierAtRetirement = Math.pow(1 + baseInflationRate / 100, Math.max(0, yearsToRetire));
  
  // SS at retirement (today's SS grown by inflation)
  const ssAnnualAtRetirement = socialSecurityMonthly * 12 * inflationMultiplierAtRetirement;
  const pensionAnnualAtRetirement = pensionAnnual * inflationMultiplierAtRetirement;
  const rentalAnnualAtRetirement = rentalAnnual * inflationMultiplierAtRetirement;
  const businessAnnualAtRetirement = businessAnnual * inflationMultiplierAtRetirement;
  const otherIncomeAtRetirement = ssAnnualAtRetirement + pensionAnnualAtRetirement + rentalAnnualAtRetirement + businessAnnualAtRetirement;

  const desiredSpendingAtRetirement = desiredAnnualIncomeTodayDollars * inflationMultiplierAtRetirement;
  const healthcareCostAtRetirement = healthcareAnnualCost * Math.pow(1 + healthcareInflation / 100, Math.max(0, yearsToRetire));

  const totalSpendingNeededAtRetirement = desiredSpendingAtRetirement + healthcareCostAtRetirement;
  const netSpendingNeededAtRetirement = Math.max(0, totalSpendingNeededAtRetirement - otherIncomeAtRetirement);
  
  const taxDivisor = taxRate < 100 ? (1 - taxRate / 100) : 1;
  const netSpendingAfterTaxAtRetirement = netSpendingNeededAtRetirement / taxDivisor;
  
  const swrFactor = swrPercent / 100;
  const requiredNestEgg = swrFactor > 0 ? netSpendingAfterTaxAtRetirement / swrFactor : 0;

  // Deterministic run
  const deterministicTimeline: YearProjection[] = [];
  let balance = currentSavings;
  let totalContributions = 0;
  let totalGains = 0;
  let totalWithdrawals = 0;
  let exhaustionAge: number | null = null;
  let projectedNestEgg = 0;
  
  // Track inflation-adjusted spending in previous years for dynamic withdrawal
  let lastYearWithdrawal = 0;

  for (let y = 0; y <= totalYears; y++) {
    const age = currentAge + y;
    const isRetired = age >= retirementAge;
    const startingBalance = balance;

    // Resolve parameter overrides from active phase (if enabled)
    const activePhase = getPhaseAtAge(age);
    const preRetReturn = activePhase ? activePhase.returnRate : basePreRetireReturn;
    const postRetReturn = activePhase ? activePhase.returnRate : basePostRetireReturn;
    const currentYearInflation = activePhase ? activePhase.inflation : baseInflationRate;
    const activeReturnRate = isRetired ? postRetReturn : preRetReturn;

    const inflationDivisor = Math.pow(1 + currentYearInflation / 100, y);
    const inflationMultiplier = Math.pow(1 + currentYearInflation / 100, y);

    // Calculate dynamic Salary and Employer contributions
    const salary = currentSalary * Math.pow(1 + salaryGrowth / 100, Math.max(0, age - currentAge));
    let employerContrib = 0;
    if (!isRetired && salary > 0) {
      employerContrib = employerContributionType === 'percent'
        ? salary * (employerContribution / 100)
        : employerContribution * 12;
    }

    // Accumulation Contributions
    let baseContribution = 0;
    if (!isRetired) {
      if (activePhase) {
        // Use phase defined annual contribution
        baseContribution = activePhase.contribution;
      } else {
        const stepUpRate = Number(inputs.contributionStepUp) || 0;
        const initialContribution = contributionFrequency === 'monthly'
          ? monthlyContribution * 12
          : annualContribution;
        baseContribution = initialContribution * Math.pow(1 + stepUpRate / 100, y);
      }
    }

    // Timeline Events matching this specific age
    const matchingEvents = events.filter(e => Math.round(e.age) === age);
    let eventContributions = 0;
    let eventWithdrawals = 0;
    let eventIncomes = 0;
    let eventExpenses = 0;

    matchingEvents.forEach(ev => {
      eventContributions += Number(ev.contribution) || 0;
      eventWithdrawals += Number(ev.withdrawal) || 0;
      eventIncomes += Number(ev.income) || 0;
      eventExpenses += Number(ev.expense) || 0;
    });

    // Inheritance One-time event
    const inheritanceInYear = age === inheritanceAge ? inheritanceAmount : 0;

    // Total Contributions
    let contribution = baseContribution + employerContrib + eventContributions;
    if (isRetired) {
      contribution = eventContributions; // accumulate events only in retirement
    }
    totalContributions += contribution;

    // Income streams (In retirement)
    let ssBenefit = 0;
    let pension = 0;
    let rental = 0;
    let business = 0;
    let otherIncomes = 0;

    if (isRetired) {
      if (age >= ssStartAge) {
        ssBenefit = socialSecurityMonthly * 12 * inflationMultiplier;
      }
      pension = pensionAnnual * inflationMultiplier;
      rental = rentalAnnual * inflationMultiplier;
      business = businessAnnual * inflationMultiplier;
      otherIncomes = ssBenefit + pension + rental + business + investmentAnnual * inflationMultiplier + customRecurringAnnual * inflationMultiplier + eventIncomes + inheritanceInYear;
    } else {
      otherIncomes = eventIncomes + inheritanceInYear;
    }

    // Expenses (In retirement)
    let spendingNeed = 0;
    let healthcareCost = 0;
    let expenses = 0;

    if (isRetired) {
      const baseSpendingNeed = activePhase ? activePhase.expenses : desiredAnnualIncomeTodayDollars * inflationMultiplier;
      spendingNeed = baseSpendingNeed;
      healthcareCost = healthcareAnnualCost * Math.pow(1 + healthcareInflation / 100, y);
      expenses = spendingNeed + healthcareCost + eventExpenses;
    } else {
      expenses = eventExpenses;
    }

    // Withdrawal computation
    let withdrawal = 0;
    let calculatedTaxes = 0;

    if (isRetired) {
      const netSpendingGap = Math.max(0, expenses - otherIncomes);
      
      // Withdraw strategy selection
      if (withdrawalStrategy === 'fixed') {
        const grossDraw = netSpendingGap / taxDivisor;
        withdrawal = Math.min(balance, grossDraw);
        calculatedTaxes = withdrawal * (taxRate / 100);
      } else if (withdrawalStrategy === 'percentage') {
        const percentageDraw = balance * swrFactor;
        withdrawal = Math.min(balance, percentageDraw);
        calculatedTaxes = withdrawal * (taxRate / 100);
      } else if (withdrawalStrategy === 'dynamic') {
        // Bounded Dynamic Spending Rule (+/- 15% around target)
        const targetDraw = netSpendingGap / taxDivisor;
        const rawPercentageDraw = balance * swrFactor;
        const floor = targetDraw * 0.85;
        const ceiling = targetDraw * 1.15;
        const dynamicDraw = Math.max(floor, Math.min(ceiling, rawPercentageDraw));
        withdrawal = Math.min(balance, dynamicDraw);
        calculatedTaxes = withdrawal * (taxRate / 100);
      } else if (withdrawalStrategy === 'inflation_adjusted') {
        // Starts at SWR * portfolio at retirement, then grows strictly with inflation
        if (age === retirementAge) {
          const startingNestEgg = balance;
          const initialDraw = startingNestEgg * swrFactor;
          withdrawal = Math.min(balance, initialDraw);
          lastYearWithdrawal = initialDraw;
        } else {
          const adjustedDraw = lastYearWithdrawal * (1 + currentYearInflation / 100);
          withdrawal = Math.min(balance, adjustedDraw);
          lastYearWithdrawal = adjustedDraw;
        }
        calculatedTaxes = withdrawal * (taxRate / 100);
      } else if (withdrawalStrategy === 'custom') {
        // CustomSchedule uses only event withdrawals / phase withdrawals
        const customDraw = activePhase ? activePhase.withdrawal : eventWithdrawals;
        withdrawal = Math.min(balance, customDraw);
        calculatedTaxes = withdrawal * (taxRate / 100);
      }
      
      // Ensure we add manual timeline event withdrawals if any
      if (eventWithdrawals > 0 && withdrawalStrategy !== 'custom') {
        const additionalDraw = Math.min(balance - withdrawal, eventWithdrawals);
        withdrawal += additionalDraw;
        calculatedTaxes += additionalDraw * (taxRate / 100);
      }

      totalWithdrawals += withdrawal;
    } else {
      // In Accumulation Phase, support timeline event withdrawals if specified
      if (eventWithdrawals > 0) {
        withdrawal = Math.min(balance, eventWithdrawals);
        totalWithdrawals += withdrawal;
      }
    }

    // Market Gains Calculation
    let investReturn = 0;
    if (!isRetired) {
      // Return on average balance including current contributions
      investReturn = (startingBalance + contribution / 2 - withdrawal / 2) * (activeReturnRate / 100);
      balance = startingBalance + contribution - withdrawal + investReturn;
    } else {
      // Return on average remaining balance
      const remaining = Math.max(0, startingBalance - withdrawal);
      investReturn = remaining * (activeReturnRate / 100);
      balance = remaining + investReturn + otherIncomes; // add other guaranteed income streams
    }

    if (balance < 0) balance = 0;
    totalGains += investReturn;

    // Track Nest Egg size at exactly the year of retirement
    if (age === retirementAge) {
      projectedNestEgg = startingBalance;
    }

    // Inflation discounted balance
    const purchasingPowerValue = balance / (inflationDivisor || 1);

    deterministicTimeline.push({
      age,
      yearIndex: y,
      isRetired,
      startingBalance,
      contribution,
      investmentReturn: investReturn,
      withdrawal,
      income: otherIncomes,
      expenses,
      taxes: calculatedTaxes,
      endingBalance: balance,
      purchasingPowerValue,
      spendingNeed: expenses,
      socialSecurity: ssBenefit
    });

    if (isRetired && balance === 0 && startingBalance > 0 && exhaustionAge === null) {
      exhaustionAge = age;
    }
  }

  // Fallback for projectedNestEgg
  if (projectedNestEgg === 0 && yearsToRetire <= totalYears) {
    const retireProj = deterministicTimeline.find(t => t.age === retirementAge);
    if (retireProj) {
      projectedNestEgg = retireProj.startingBalance;
    }
  }

  const savingsGap = Math.max(0, requiredNestEgg - projectedNestEgg);

  // Monte Carlo Simulation Run
  const simCount = Number(inputs.monteCarloCount) || 500;
  let successfulTrials = 0;
  const trialTimelineBalances: number[][] = Array.from({ length: totalYears + 1 }, () => []);
  const finalBalances: number[] = [];

  for (let trial = 0; trial < simCount; trial++) {
    let trialBalance = currentSavings;
    let trialExhausted = false;
    let mcLastYearWithdrawal = 0;

    for (let y = 0; y <= totalYears; y++) {
      const age = currentAge + y;
      const isRetired = age >= retirementAge;
      
      const activePhase = getPhaseAtAge(age);
      const preRetReturn = activePhase ? activePhase.returnRate : basePreRetireReturn;
      const postRetReturn = activePhase ? activePhase.returnRate : basePostRetireReturn;
      const currentYearInflation = activePhase ? activePhase.inflation : baseInflationRate;
      
      const activeMeanReturn = isRetired ? postRetReturn : preRetReturn;
      
      // Sample randomized return
      const sampledReturn = randomNormal(activeMeanReturn, volatility);

      const inflationMultiplier = Math.pow(1 + currentYearInflation / 100, y);

      // Contributions
      const salary = currentSalary * Math.pow(1 + salaryGrowth / 100, Math.max(0, age - currentAge));
      let employerContrib = 0;
      if (!isRetired && salary > 0) {
        employerContrib = employerContributionType === 'percent'
          ? salary * (employerContribution / 100)
          : employerContribution * 12;
      }

      let baseContrib = 0;
      if (!isRetired) {
        if (activePhase) {
          baseContrib = activePhase.contribution;
        } else {
          baseContrib = contributionFrequency === 'monthly'
            ? monthlyContribution * 12
            : annualContribution;
        }
      }

      // Event variables
      const matchingEvents = events.filter(e => Math.round(e.age) === age);
      let eventContrib = 0;
      let eventWithd = 0;
      let eventInc = 0;
      let eventExp = 0;

      matchingEvents.forEach(ev => {
        eventContrib += Number(ev.contribution) || 0;
        eventWithd += Number(ev.withdrawal) || 0;
        eventInc += Number(ev.income) || 0;
        eventExp += Number(ev.expense) || 0;
      });

      const inheritanceInYear = age === inheritanceAge ? inheritanceAmount : 0;

      let contrib = baseContrib + employerContrib + eventContrib;
      if (isRetired) {
        contrib = eventContrib;
      }

      let ssBenefit = 0;
      let pension = 0;
      let rental = 0;
      let business = 0;
      let otherIncomes = 0;

      if (isRetired) {
        if (age >= ssStartAge) {
          ssBenefit = socialSecurityMonthly * 12 * inflationMultiplier;
        }
        pension = pensionAnnual * inflationMultiplier;
        rental = rentalAnnual * inflationMultiplier;
        business = businessAnnual * inflationMultiplier;
        otherIncomes = ssBenefit + pension + rental + business + investmentAnnual * inflationMultiplier + customRecurringAnnual * inflationMultiplier + eventInc + inheritanceInYear;
      } else {
        otherIncomes = eventInc + inheritanceInYear;
      }

      let spendingNeed = 0;
      let healthcareCost = 0;
      let expenses = 0;

      if (isRetired) {
        const baseSpendingNeed = activePhase ? activePhase.expenses : desiredAnnualIncomeTodayDollars * inflationMultiplier;
        spendingNeed = baseSpendingNeed;
        healthcareCost = healthcareAnnualCost * Math.pow(1 + healthcareInflation / 100, y);
        expenses = spendingNeed + healthcareCost + eventExp;
      } else {
        expenses = eventExp;
      }

      let withdrawal = 0;
      if (isRetired) {
        const netSpendingGap = Math.max(0, expenses - otherIncomes);
        if (withdrawalStrategy === 'fixed') {
          withdrawal = Math.min(trialBalance, netSpendingGap / taxDivisor);
        } else if (withdrawalStrategy === 'percentage') {
          withdrawal = Math.min(trialBalance, trialBalance * swrFactor);
        } else if (withdrawalStrategy === 'dynamic') {
          const targetDraw = netSpendingGap / taxDivisor;
          const rawPercentageDraw = trialBalance * swrFactor;
          const floor = targetDraw * 0.85;
          const ceiling = targetDraw * 1.15;
          withdrawal = Math.min(trialBalance, Math.max(floor, Math.min(ceiling, rawPercentageDraw)));
        } else if (withdrawalStrategy === 'inflation_adjusted') {
          if (age === retirementAge) {
            withdrawal = Math.min(trialBalance, trialBalance * swrFactor);
            mcLastYearWithdrawal = withdrawal;
          } else {
            const adjusted = mcLastYearWithdrawal * (1 + currentYearInflation / 100);
            withdrawal = Math.min(trialBalance, adjusted);
            mcLastYearWithdrawal = adjusted;
          }
        } else if (withdrawalStrategy === 'custom') {
          withdrawal = Math.min(trialBalance, activePhase ? activePhase.withdrawal : eventWithd);
        }

        if (eventWithd > 0 && withdrawalStrategy !== 'custom') {
          withdrawal += Math.min(trialBalance - withdrawal, eventWithd);
        }
      } else {
        if (eventWithd > 0) {
          withdrawal = Math.min(trialBalance, eventWithd);
        }
      }

      // Compute growth and next balance
      if (!isRetired) {
        const growth = (trialBalance + contrib / 2 - withdrawal / 2) * (sampledReturn / 100);
        trialBalance = trialBalance + contrib - withdrawal + growth;
      } else {
        const remaining = Math.max(0, trialBalance - withdrawal);
        const growth = remaining * (sampledReturn / 100);
        trialBalance = remaining + growth + otherIncomes;
      }

      if (trialBalance < 0) trialBalance = 0;
      if (trialBalance === 0) trialExhausted = true;

      trialTimelineBalances[y].push(trialBalance);
    }

    finalBalances.push(trialBalance);
    if (!trialExhausted && trialBalance > 0) {
      successfulTrials++;
    }
  }

  const monteCarloSuccessRate = Math.round((successfulTrials / simCount) * 100);

  // Percentiles for Monte Carlo
  const monteCarloTimeline: MonteCarloRun[] = [];
  for (let y = 0; y <= totalYears; y++) {
    const age = currentAge + y;
    const sortedBalances = [...trialTimelineBalances[y]].sort((a, b) => a - b);
    const p10Idx = Math.floor(simCount * 0.1);
    const p50Idx = Math.floor(simCount * 0.5);
    const p90Idx = Math.floor(simCount * 0.9);

    monteCarloTimeline.push({
      age,
      p10: sortedBalances[p10Idx] || 0,
      p50: sortedBalances[p50Idx] || 0,
      p90: sortedBalances[p90Idx] || 0
    });
  }

  // Create Histogram of Final Outcomes
  finalBalances.sort((a, b) => a - b);
  const maxFinal = finalBalances[finalBalances.length - 1] || 1000000;
  const minFinal = finalBalances[0] || 0;
  const binCount = 10;
  const binSize = Math.max(1000, (maxFinal - minFinal) / binCount);
  const monteCarloHistogram: HistogramBin[] = [];

  for (let i = 0; i < binCount; i++) {
    const lower = minFinal + i * binSize;
    const upper = lower + binSize;
    const label = `${(lower / 1000).toFixed(0)}k – ${(upper / 1000).toFixed(0)}k`;
    
    const count = finalBalances.filter(val => val >= lower && val < (i === binCount - 1 ? upper + 1 : upper)).length;
    monteCarloHistogram.push({
      rangeLabel: label,
      count,
      percentage: Math.round((count / simCount) * 100)
    });
  }

  // Goal Planner back-calculations
  // 1. Required monthly contribution to hit Goal Planner's Target Savings
  // PMT formula: PMT = FV * r / ((1 + r)^n - 1)
  const gp = inputs.goalPlanner || { targetIncome: 0, targetIncomeType: 'annual', targetSavings: 0, targetAge: 65 };
  const gpTargetSavings = Number(gp.targetSavings) || 0;
  const gpTargetAge = Number(gp.targetAge) || retirementAge;
  const gpYears = Math.max(1, gpTargetAge - currentAge);
  const gpPreReturnRateDecimal = (basePreRetireReturn / 100) / 12;
  const gpMonths = gpYears * 12;

  let requiredMonthlyContribution: number | null = null;
  if (gpTargetSavings > 0 && gpPreReturnRateDecimal > 0) {
    const grownSavings = currentSavings * Math.pow(1 + gpPreReturnRateDecimal * 12, gpYears);
    const neededSavings = Math.max(0, gpTargetSavings - grownSavings);
    if (neededSavings > 0) {
      requiredMonthlyContribution = (neededSavings * gpPreReturnRateDecimal) / (Math.pow(1 + gpPreReturnRateDecimal, gpMonths) - 1);
    } else {
      requiredMonthlyContribution = 0;
    }
  }

  // 2. Required return rate to hit gpTargetSavings
  // Simple iteration to find Pre-retirement return %
  let requiredAnnualReturn: number | null = null;
  if (gpTargetSavings > 0) {
    const savingsBase = currentSavings;
    const monthlyContrib = contributionFrequency === 'monthly' ? monthlyContribution : (annualContribution / 12);
    let low = -20;
    let high = 50;
    let found = false;

    for (let iter = 0; iter < 50; iter++) {
      const mid = (low + high) / 2;
      const rateDec = (mid / 100) / 12;
      let val = savingsBase * Math.pow(1 + rateDec * 12, gpYears);
      if (rateDec > 0) {
        val += (monthlyContrib * (Math.pow(1 + rateDec, gpMonths) - 1)) / rateDec;
      } else {
        val += monthlyContrib * gpMonths;
      }

      if (Math.abs(val - gpTargetSavings) < 100) {
        requiredAnnualReturn = mid;
        found = true;
        break;
      }
      if (val > gpTargetSavings) {
        high = mid;
      } else {
        low = mid;
      }
    }
    if (!found) requiredAnnualReturn = low;
  }

  // 3. Required retirement age to hit gpTargetSavings
  let requiredRetirementAge: number | null = null;
  if (gpTargetSavings > 0) {
    let bal = currentSavings;
    let ageTest = currentAge;
    const monthlyContrib = contributionFrequency === 'monthly' ? monthlyContribution : (annualContribution / 12);
    const checkRate = (basePreRetireReturn / 100) / 12;

    while (bal < gpTargetSavings && ageTest < 110) {
      ageTest += 1;
      // Compounding 12 months
      for (let m = 0; m < 12; m++) {
        bal = bal * (1 + checkRate) + monthlyContrib;
      }
    }
    requiredRetirementAge = ageTest;
  }

  const goalPlannerResults: GoalPlannerResults = {
    requiredMonthlyContribution,
    requiredAnnualReturn,
    requiredRetirementAge,
    savingsGap: Math.max(0, gpTargetSavings - projectedNestEgg)
  };

  // FIRE metrics
  const annualSpendingRequirementInRetirement = desiredAnnualIncomeTodayDollars + healthcareAnnualCost;
  const fireTarget = swrFactor > 0 ? annualSpendingRequirementInRetirement / swrFactor : annualSpendingRequirementInRetirement * 25;
  const leanFireTarget = fireTarget * (Number(inputs.leanFireMultiplier) || 0.75);
  const fatFireTarget = fireTarget * (Number(inputs.fatFireMultiplier) || 1.25);
  
  // Coast FIRE = FIRE Target / (1 + returnRate)^yearsToRetire
  const realCoastGrowthRate = (basePreRetireReturn - baseInflationRate) / 100;
  const coastFireTarget = realCoastGrowthRate > 0 ? fireTarget / Math.pow(1 + realCoastGrowthRate, Math.max(0, yearsToRetire)) : fireTarget;

  const safeWithdrawalEstimate = projectedNestEgg * swrFactor;
  
  // Years Until FIRE
  let yearsUntilFIRE: number | null = null;
  const fireRow = deterministicTimeline.find(row => row.endingBalance >= fireTarget);
  if (fireRow) {
    yearsUntilFIRE = Math.max(0, fireRow.age - currentAge);
  }

  const fireResults: FIREResults = {
    fireTarget,
    leanFireTarget,
    fatFireTarget,
    coastFireTarget,
    safeWithdrawalEstimate,
    yearsUntilFIRE
  };

  // Readiness Score
  // Nest egg coverage ratio: up to 45 pts
  let coverageScore = 0;
  if (requiredNestEgg > 0) {
    coverageScore = Math.min(45, (projectedNestEgg / requiredNestEgg) * 45);
  } else {
    coverageScore = 45;
  }

  // MC Score: up to 35 pts
  const mcScore = (monteCarloSuccessRate / 100) * 35;

  // Survival Length Score: up to 20 pts
  let survivalScore = 0;
  if (exhaustionAge === null) {
    survivalScore = 20;
  } else {
    const retiredYearsActual = exhaustionAge - retirementAge;
    const retiredYearsTarget = lifeExpectancy - retirementAge;
    if (retiredYearsTarget > 0) {
      survivalScore = Math.min(20, (retiredYearsActual / retiredYearsTarget) * 20);
    } else {
      survivalScore = 20;
    }
  }

  const retirementReadinessScore = Math.round(coverageScore + mcScore + survivalScore);

  let readinessStatus: 'Ready' | 'Almost Ready' | 'Behind Target' | 'Needs Improvement' = 'Needs Improvement';
  if (retirementReadinessScore >= 85) {
    readinessStatus = 'Ready';
  } else if (retirementReadinessScore >= 65) {
    readinessStatus = 'Almost Ready';
  } else if (retirementReadinessScore >= 45) {
    readinessStatus = 'Behind Target';
  }

  return {
    deterministicTimeline,
    requiredNestEgg,
    projectedNestEgg,
    savingsGap,
    retirementReadinessScore,
    readinessStatus,
    exhaustionAge,
    monteCarloSuccessRate,
    monteCarloTimeline,
    monteCarloHistogram,
    totalContributions,
    totalGains,
    totalWithdrawals,
    goalPlannerResults,
    fireResults
  };
}
