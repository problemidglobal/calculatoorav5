// core mathematical utility for ultimate investment projections

export interface CustomReturnEvent {
  year: number;
  rate: number;
}

export interface CustomContributionEvent {
  year: number;
  amount: number;
}

export interface CustomWithdrawalEvent {
  month: number;
  amount: number;
  label?: string;
}

export interface PortfolioAsset {
  id: string;
  name: string;
  percentage: number; // 0 to 100
  expectedReturn: number; // %
  volatility: number; // %
}

export interface InvestmentInputs {
  initialInvestment: number;
  currency: string;
  investmentGoal: number;
  investmentPeriodYears: number;
  investmentPeriodMonths: number;
  startDate: string;
  
  // Return settings
  annualReturn: number; // %
  minReturn?: number; // % (Worst case)
  maxReturn?: number; // % (Best case)
  returnType: 'fixed' | 'variable' | 'custom';
  customReturns: CustomReturnEvent[]; // custom returns by year
  
  // Compounding frequency
  compoundingFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'continuous';

  // Contributions
  monthlyContribution: number;
  weeklyContribution: number;
  yearlyContribution: number;
  biweeklyContribution: number;
  quarterlyContribution: number;
  customContribution: number;
  customContributionIntervalMonths: number;
  
  contributionStepUpPercent: number; // percentage increase in contribution every year

  // Withdrawals
  monthlyWithdrawal: number;
  yearlyWithdrawal: number;
  customWithdrawals: CustomWithdrawalEvent[];

  // Dividends
  dividendYield: number; // %
  dividendGrowth: number; // %
  reinvestDividends: boolean;
  dividendTaxRate: number; // %

  // Taxes
  capitalGainsTaxRate: number; // %
  annualTaxRate: number; // % (wealth tax applied to ending balance annually)
  exitTaxRate: number; // % (flat tax on final balance)

  // Inflation
  inflationRate: number; // %

  // Fees
  brokerFeePercent: number; // % of contributions
  managementFeePercent: number; // % of asset value (annual, deducted monthly)
  expenseRatio: number; // % of asset value (annual, deducted monthly)
  transactionFee: number; // flat fee per contribution
  platformFeeMonthly: number; // flat fee monthly
  performanceFeePercent: number; // % of net profits (deducted at end or annually)

  // Risk/Volatility
  volatility: number; // %
  riskLevel: 'low' | 'medium' | 'high';

  // Portfolio
  assets: PortfolioAsset[];
}

export interface ProjectionRow {
  month: number;
  year: number;
  date: string;
  
  // Expected Case
  nominalBalance: number;
  realBalance: number;
  totalContributions: number;
  totalWithdrawals: number;
  totalInterestEarned: number;
  totalDividendsEarned: number;
  totalTaxesPaid: number;
  totalFeesPaid: number;
  netProfit: number;
  
  // Volatility Bands
  bestCaseBalance: number;
  worstCaseBalance: number;

  // Custom values for debugging or ledger search
  dividendIncome: number;
  interestIncome: number;
}

export interface InvestmentResults {
  schedule: ProjectionRow[];
  
  // Summary Metrics (Expected Case)
  finalNominalValue: number;
  finalRealValue: number;
  totalContributions: number;
  totalWithdrawals: number;
  totalGains: number;
  totalDividends: number;
  totalTaxes: number;
  totalFees: number;
  netProfit: number;
  
  // Volatility Band Finals
  finalBestCaseValue: number;
  finalWorstCaseValue: number;

  // Financial ratios
  cagr: number; // %
  roi: number; // %
  moneyMultiple: number; // x
  
  // Goals
  goalReached: boolean;
  monthsToGoal: number;
  estimatedCompletionDate: string;
  goalProgressPercent: number;

  // Safe withdrawal rate (e.g. 4% rule)
  safeWithdrawalEstimateMonthly: number;

  // Rule-based scores
  portfolioHealthScore: number; // 0-100
  portfolioHealthRemarks: string[];
}

// Convert compounding frequency to annual number
const getCompoundingPeriods = (freq: string): number => {
  switch (freq) {
    case 'daily': return 365;
    case 'weekly': return 52;
    case 'biweekly': return 26;
    case 'monthly': return 12;
    case 'quarterly': return 4;
    case 'semiannual': return 2;
    case 'annual': return 1;
    default: return 12;
  }
};

// Main function to run the full monthly-based investment simulation
export function computeInvestmentProjection(inputs: InvestmentInputs): InvestmentResults {
  const num = (v: any, def = 0): number => {
    if (v === undefined || v === null || v === "") return def;
    const parsed = Number(v);
    return isNaN(parsed) ? def : parsed;
  };

  const initialInvestment = num(inputs.initialInvestment);
  const investmentPeriodYears = num(inputs.investmentPeriodYears);
  const investmentPeriodMonths = num(inputs.investmentPeriodMonths);
  const annualReturn = num(inputs.annualReturn);
  const investmentGoal = num(inputs.investmentGoal);
  const volatility = num(inputs.volatility);
  
  const monthlyContribution = num(inputs.monthlyContribution);
  const weeklyContribution = num(inputs.weeklyContribution);
  const biweeklyContribution = num(inputs.biweeklyContribution);
  const quarterlyContribution = num(inputs.quarterlyContribution);
  const yearlyContribution = num(inputs.yearlyContribution);
  const customContribution = num(inputs.customContribution);
  const customContributionIntervalMonths = num(inputs.customContributionIntervalMonths);
  const contributionStepUpPercent = num(inputs.contributionStepUpPercent);

  const monthlyWithdrawalInput = num(inputs.monthlyWithdrawal);
  const yearlyWithdrawalInput = num(inputs.yearlyWithdrawal);

  const dividendYield = num(inputs.dividendYield);
  const dividendGrowth = num(inputs.dividendGrowth);
  const dividendTaxRate = num(inputs.dividendTaxRate);

  const capitalGainsTaxRate = num(inputs.capitalGainsTaxRate);
  const annualTaxRate = num(inputs.annualTaxRate);
  const exitTaxRate = num(inputs.exitTaxRate);
  const inflationRate = num(inputs.inflationRate);

  const brokerFeePercent = num(inputs.brokerFeePercent);
  const managementFeePercent = num(inputs.managementFeePercent);
  const expenseRatio = num(inputs.expenseRatio);
  const transactionFee = num(inputs.transactionFee);
  const platformFeeMonthly = num(inputs.platformFeeMonthly);
  const performanceFeePercent = num(inputs.performanceFeePercent);

  const totalMonths = investmentPeriodYears * 12 + investmentPeriodMonths;
  const startDt = inputs.startDate ? new Date(inputs.startDate) : new Date();
  
  const schedule: ProjectionRow[] = [];
  
  // Track balances for Expected, Best, and Worst cases
  let balanceExp = initialInvestment;
  let balanceBest = initialInvestment;
  let balanceWorst = initialInvestment;
  
  let cumContributions = initialInvestment;
  let cumWithdrawals = 0;
  let cumInterestExp = 0;
  let cumDividendsExp = 0;
  let cumTaxesExp = 0;
  let cumFeesExp = 0;

  // Initial fees if broker fee or transaction fee is applied to initial investment
  let initialFees = 0;
  if (initialInvestment > 0) {
    initialFees += initialInvestment * (brokerFeePercent / 100);
    initialFees += transactionFee;
  }
  cumFeesExp += initialFees;
  balanceExp = Math.max(0, balanceExp - initialFees);
  balanceBest = Math.max(0, balanceBest - initialFees);
  balanceWorst = Math.max(0, balanceWorst - initialFees);

  // We loop month-by-month
  for (let m = 1; m <= totalMonths; m++) {
    const currentYear = Math.ceil(m / 12);
    
    // 1. Determine Interest Rate (r_annual) for Expected, Best, and Worst cases
    let rExpAnnual = annualReturn / 100;
    
    if (inputs.returnType === 'custom') {
      const match = (inputs.customReturns || []).find(cr => num(cr.year) === currentYear);
      if (match) {
        rExpAnnual = num(match.rate) / 100;
      } else if (inputs.customReturns && inputs.customReturns.length > 0) {
        // Fallback to last custom return
        const sorted = [...inputs.customReturns].sort((a, b) => num(b.year) - num(a.year));
        rExpAnnual = num(sorted[0].rate) / 100;
      }
    }

    // Best/Worst return rates using volatility
    const vol = volatility / 100;
    // Detemining deterministic bands using 1.28 (90% conf) or 1.645 (95% conf)
    const zScore = 1.28; 
    const rBestAnnual = rExpAnnual + (zScore * vol);
    const rWorstAnnual = rExpAnnual - (zScore * vol);

    // 2. Convert annual returns to equivalent monthly compounding rates
    const getMonthlyCompRate = (annualRate: number, frequency: string): number => {
      if (frequency === 'continuous') {
        return Math.exp(annualRate / 12) - 1;
      }
      const compoundingN = getCompoundingPeriods(frequency);
      const ear = Math.pow(1 + annualRate / compoundingN, compoundingN) - 1;
      return Math.pow(1 + ear, 1 / 12) - 1;
    };

    const compoundingFrequency = inputs.compoundingFrequency || 'monthly';
    const rMonthlyExp = getMonthlyCompRate(rExpAnnual, compoundingFrequency);
    const rMonthlyBest = getMonthlyCompRate(rBestAnnual, compoundingFrequency);
    const rMonthlyWorst = getMonthlyCompRate(rWorstAnnual, compoundingFrequency);

    // 3. Step-up multiplier for contributions based on current year
    const stepUpMultiplier = Math.pow(1 + (contributionStepUpPercent / 100), currentYear - 1);

    // 4. Calculate this month's contributions
    let monthlyContrib = 0;
    monthlyContrib += monthlyContribution;
    monthlyContrib += weeklyContribution * (52 / 12);
    monthlyContrib += biweeklyContribution * (26 / 12);
    monthlyContrib += quarterlyContribution / 3;
    monthlyContrib += yearlyContribution / 12;
    
    if (customContributionIntervalMonths > 0 && m % customContributionIntervalMonths === 0) {
      monthlyContrib += customContribution;
    }

    // Apply step-up increase
    monthlyContrib *= stepUpMultiplier;

    // Fees applied to contributions
    let contribFees = 0;
    if (monthlyContrib > 0) {
      contribFees += monthlyContrib * (brokerFeePercent / 100);
      contribFees += transactionFee;
    }

    const netMonthlyContrib = Math.max(0, monthlyContrib - contribFees);

    // 5. Calculate this month's withdrawals
    let monthlyWithdrawal = monthlyWithdrawalInput;
    if (m % 12 === 0) {
      monthlyWithdrawal += yearlyWithdrawalInput;
    }
    const customWith = (inputs.customWithdrawals || []).find(w => num(w.month) === m);
    if (customWith) {
      monthlyWithdrawal += num(customWith.amount);
    }

    // 6. Growth calculations before cashflow additions (standard practice)
    const interestEarnedExp = balanceExp * rMonthlyExp;
    const interestEarnedBest = balanceBest * rMonthlyBest;
    const interestEarnedWorst = balanceWorst * rMonthlyWorst;

    // Dividends calculations
    // Dividend yield grows by dividendGrowth every year
    const currentDivYield = (dividendYield / 100) * Math.pow(1 + (dividendGrowth / 100), currentYear - 1);
    const grossDividendExp = balanceExp * (currentDivYield / 12);
    const dividendTax = grossDividendExp * (dividendTaxRate / 100);
    const netDividendExp = grossDividendExp - dividendTax;

    // We assume similar dividend rates for Best/Worst cases to keep the focus on return volatility
    const grossDividendBest = balanceBest * (currentDivYield / 12);
    const netDividendBest = grossDividendBest - (grossDividendBest * (dividendTaxRate / 100));
    
    const grossDividendWorst = balanceWorst * (currentDivYield / 12);
    const netDividendWorst = grossDividendWorst - (grossDividendWorst * (dividendTaxRate / 100));

    // 7. Deduct annual asset-based fees (Management Fee, Expense Ratio)
    // Paid monthly, typically calculated as Balance * Rate / 12
    const mgtFeeRate = managementFeePercent / 100 / 12;
    const expenseRatioRate = expenseRatio / 100 / 12;
    
    const assetFeesExp = balanceExp * (mgtFeeRate + expenseRatioRate) + platformFeeMonthly;
    const assetFeesBest = balanceBest * (mgtFeeRate + expenseRatioRate) + platformFeeMonthly;
    const assetFeesWorst = balanceWorst * (mgtFeeRate + expenseRatioRate) + platformFeeMonthly;

    // Update balances
    // Expected Case
    balanceExp += interestEarnedExp;
    if (inputs.reinvestDividends) {
      balanceExp += netDividendExp;
    }
    balanceExp += netMonthlyContrib;
    balanceExp = Math.max(0, balanceExp - monthlyWithdrawal - assetFeesExp);

    // Best Case
    balanceBest += interestEarnedBest;
    if (inputs.reinvestDividends) {
      balanceBest += netDividendBest;
    }
    balanceBest += netMonthlyContrib;
    balanceBest = Math.max(0, balanceBest - monthlyWithdrawal - assetFeesBest);

    // Worst Case
    balanceWorst += interestEarnedWorst;
    if (inputs.reinvestDividends) {
      balanceWorst += netDividendWorst;
    }
    balanceWorst += netMonthlyContrib;
    balanceWorst = Math.max(0, balanceWorst - monthlyWithdrawal - assetFeesWorst);

    // Cumulative stats
    cumContributions += monthlyContrib;
    cumWithdrawals += monthlyWithdrawal;
    cumInterestExp += interestEarnedExp;
    cumDividendsExp += grossDividendExp;
    cumTaxesExp += dividendTax;
    cumFeesExp += contribFees + assetFeesExp;

    // Annual wealth tax applied to ending balance annually
    if (m % 12 === 0 && annualTaxRate > 0) {
      const annualTaxExp = balanceExp * (annualTaxRate / 100);
      const annualTaxBest = balanceBest * (annualTaxRate / 100);
      const annualTaxWorst = balanceWorst * (annualTaxRate / 100);

      balanceExp = Math.max(0, balanceExp - annualTaxExp);
      balanceBest = Math.max(0, balanceBest - annualTaxBest);
      balanceWorst = Math.max(0, balanceWorst - annualTaxWorst);

      cumTaxesExp += annualTaxExp;
    }

    // 8. Calculate Inflation Factor for Real Balance
    const infFactor = Math.pow(1 + (inflationRate / 100), -m / 12);
    const realBal = balanceExp * infFactor;

    // Row Date
    const rowDate = new Date(startDt.getFullYear(), startDt.getMonth() + m, 1);
    const dateStr = rowDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });

    schedule.push({
      month: m,
      year: currentYear,
      date: dateStr,
      nominalBalance: balanceExp,
      realBalance: realBal,
      totalContributions: cumContributions,
      totalWithdrawals: cumWithdrawals,
      totalInterestEarned: cumInterestExp,
      totalDividendsEarned: cumDividendsExp,
      totalTaxesPaid: cumTaxesExp,
      totalFeesPaid: cumFeesExp,
      netProfit: Math.max(0, balanceExp - cumContributions),
      bestCaseBalance: balanceBest,
      worstCaseBalance: balanceWorst,
      dividendIncome: grossDividendExp,
      interestIncome: interestEarnedExp
    });
  }

  // Deduct Exit Tax and Capital Gains Tax (on gains over contributions) at the very end
  let finalNominalValue = balanceExp;
  let finalBestCaseValue = balanceBest;
  let finalWorstCaseValue = balanceWorst;

  const totalGains = Math.max(0, finalNominalValue - cumContributions);
  
  // Capital Gains Tax
  let capGainsTax = 0;
  if (capitalGainsTaxRate > 0 && totalGains > 0) {
    capGainsTax = totalGains * (capitalGainsTaxRate / 100);
  }

  // Exit Tax
  let exitTax = finalNominalValue * (exitTaxRate / 100);

  // Performance Fee (e.g. hedge fund performance fee based on gains)
  let performanceFee = 0;
  if (performanceFeePercent > 0 && totalGains > 0) {
    performanceFee = totalGains * (performanceFeePercent / 100);
  }

  cumTaxesExp += capGainsTax + exitTax;
  cumFeesExp += performanceFee;

  finalNominalValue = Math.max(0, finalNominalValue - capGainsTax - exitTax - performanceFee);
  finalBestCaseValue = Math.max(0, finalBestCaseValue - capGainsTax - exitTax - performanceFee);
  finalWorstCaseValue = Math.max(0, finalWorstCaseValue - capGainsTax - exitTax - performanceFee);

  // Re-adjust final real balance
  const finalInfFactor = Math.pow(1 + (inflationRate / 100), -totalMonths / 12);
  const finalRealValue = finalNominalValue * finalInfFactor;

  // Calculate CAGR and Money Multiple
  const totalYrs = totalMonths / 12;
  let cagr = 0;
  if (initialInvestment > 0 && totalYrs > 0) {
    cagr = (Math.pow(finalNominalValue / initialInvestment, 1 / totalYrs) - 1) * 100;
  } else if (cumContributions > 0 && totalYrs > 0) {
    cagr = (Math.pow(finalNominalValue / cumContributions, 1 / totalYrs) - 1) * 100;
  }

  const roi = cumContributions > 0 ? (totalGains / cumContributions) * 100 : 0;
  const moneyMultiple = cumContributions > 0 ? finalNominalValue / cumContributions : 0;

  // Goal planning checks
  let goalReached = finalNominalValue >= investmentGoal;
  let monthsToGoal = -1;
  let estimatedCompletionDate = 'N/A';

  for (const row of schedule) {
    if (row.nominalBalance >= investmentGoal) {
      monthsToGoal = row.month;
      estimatedCompletionDate = row.date;
      break;
    }
  }

  const goalProgressPercent = investmentGoal > 0 
    ? Math.min(100, (finalNominalValue / investmentGoal) * 100) 
    : 100;

  // Safe Withdrawal Rate Monthly estimate (4% rule by default)
  const safeWithdrawalEstimateMonthly = (finalNominalValue * 0.04) / 12;

  // Portfolio Health Score Calculations (out of 100)
  let portfolioHealthScore = 100;
  const portfolioHealthRemarks: string[] = [];

  // 1. Fee drag check
  const totalExpectedDrag = (managementFeePercent + expenseRatio + (brokerFeePercent * 0.5));
  if (totalExpectedDrag > 2.5) {
    portfolioHealthScore -= 20;
    portfolioHealthRemarks.push('High expense and fee structure (>2.5% annually) creates a heavy drag on long-term compound growth.');
  } else if (totalExpectedDrag > 1.0) {
    portfolioHealthScore -= 10;
    portfolioHealthRemarks.push('Moderate fee levels. Consider lower-cost ETFs or index funds to optimize performance.');
  } else {
    portfolioHealthRemarks.push('Excellent low-cost fee architecture. Maximum growth compound is preserved.');
  }

  // 2. Inflation protection check
  if (inflationRate > 4 && annualReturn - inflationRate < 2) {
    portfolioHealthScore -= 15;
    portfolioHealthRemarks.push('Inflation risk is high relative to your expected return rate. Your real purchasing power is barely growing.');
  } else {
    portfolioHealthRemarks.push('Your return rate successfully outpacing expected inflation cycles.');
  }

  // 3. Asset Allocation and diversification check
  const assetsList = inputs.assets || [];
  const totalPercent = assetsList.reduce((sum, item) => sum + num(item.percentage), 0);
  if (assetsList.length === 0) {
    portfolioHealthScore -= 15;
    portfolioHealthRemarks.push('No portfolio assets declared. Standard asset allocations provide optimal risk-return bounds.');
  } else if (assetsList.length === 1) {
    portfolioHealthScore -= 10;
    portfolioHealthRemarks.push('Concentration risk alert: 100% of capital assigned to a single asset category.');
  } else {
    portfolioHealthRemarks.push(`Diversified across ${assetsList.length} core asset classes.`);
  }

  // Ensure score stays in bounds
  portfolioHealthScore = Math.max(10, Math.min(100, portfolioHealthScore));

  return {
    schedule,
    finalNominalValue,
    finalRealValue,
    totalContributions: cumContributions,
    totalWithdrawals: cumWithdrawals,
    totalGains,
    totalDividends: cumDividendsExp,
    totalTaxes: cumTaxesExp,
    totalFees: cumFeesExp,
    netProfit: finalNominalValue - cumContributions,
    finalBestCaseValue,
    finalWorstCaseValue,
    cagr,
    roi,
    moneyMultiple,
    goalReached,
    monthsToGoal,
    estimatedCompletionDate,
    goalProgressPercent,
    safeWithdrawalEstimateMonthly,
    portfolioHealthScore,
    portfolioHealthRemarks
  };
}

/**
 * Goal planning solvers
 */

// 1. Calculate how much to invest monthly to reach a goal
export function solveMonthlyContribution(
  goal: number,
  years: number,
  annualReturn: number,
  initial: number = 0
): number {
  const months = years * 12;
  const mr = (annualReturn / 100) / 12;
  
  if (mr === 0) {
    return Math.max(0, (goal - initial) / months);
  }

  const futureValueOfInitial = initial * Math.pow(1 + mr, months);
  const requiredAnnuityValue = goal - futureValueOfInitial;
  
  if (requiredAnnuityValue <= 0) return 0;

  // Monthly annuity formula: FV = PMT * [ (1 + mr)^months - 1 ] / mr
  const factor = (Math.pow(1 + mr, months) - 1) / mr;
  return requiredAnnuityValue / factor;
}

// 2. Calculate how many years until a goal is reached
export function solveYearsToGoal(
  goal: number,
  initial: number,
  monthly: number,
  annualReturn: number
): number {
  const mr = (annualReturn / 100) / 12;
  
  if (initial >= goal) return 0;
  
  if (mr === 0) {
    if (monthly <= 0) return Infinity;
    return (goal - initial) / (monthly * 12);
  }

  // Solve goal = initial * (1+mr)^n + monthly * [ (1+mr)^n - 1 ] / mr
  // goal = initial * x + (monthly/mr) * x - (monthly/mr) where x = (1+mr)^n
  // goal + monthly/mr = x * (initial + monthly/mr)
  // x = (goal + monthly/mr) / (initial + monthly/mr)
  const numerator = goal + (monthly / mr);
  const denominator = initial + (monthly / mr);
  
  if (denominator <= 0 || numerator / denominator <= 0) return Infinity;

  const x = numerator / denominator;
  const n = Math.log(x) / Math.log(1 + mr);
  return n / 12;
}

// 3. Calculate required annual return to reach a goal
export function solveRequiredReturn(
  goal: number,
  initial: number,
  monthly: number,
  years: number
): number {
  const months = years * 12;
  if (initial + (monthly * months) >= goal) return 0; // 0% return required

  // Numerical solver (Bisection method)
  let low = 0.0001; // 0.01%
  let high = 2.0;   // 200%
  let steps = 100;
  
  const f = (rate: number) => {
    const mr = rate / 12;
    let balance = initial;
    for (let i = 0; i < months; i++) {
      balance = balance * (1 + mr) + monthly;
    }
    return balance - goal;
  };

  if (f(high) < 0) return 200.0; // too high

  let mid = 0;
  while (steps > 0 && (high - low) > 0.00001) {
    mid = (low + high) / 2;
    const val = f(mid);
    if (val === 0) {
      break;
    } else if (val < 0) {
      low = mid;
    } else {
      high = mid;
    }
    steps--;
  }

  return mid * 100; // convert to %
}
