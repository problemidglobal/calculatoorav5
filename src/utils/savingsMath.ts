export interface SavingsEvent {
  id: string;
  description: string;
  deposit: number | '';
  withdrawal: number | '';
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startYear: number | '';
  endYear: number | '';
  isExpanded?: boolean;
}

export interface SimulationParams {
  initialSavings: number;
  recurringDeposit: number;
  recurringFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  customFrequencyDays: number;
  interestRate: number;
  years: number;
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  inflationRate: number;
  annualIncrease: number;
  annualIncreaseType: 'percentage' | 'amount';
  managementFee: number;
  managementFeeType: 'percentage' | 'amount';
  taxRate: number;
  withdrawalAmount: number;
  withdrawalFrequency: 'monthly' | 'yearly';
  withdrawalStartYear: number;
  goalAmount: number;
  events: SavingsEvent[];
}

export interface MonthlyRecord {
  month: number;
  year: number;
  openingBalance: number;
  deposits: number;
  interest: number;
  fees: number;
  taxes: number;
  withdrawals: number;
  closingBalance: number;
  inflationAdjustedClosing: number;
}

export interface YearlyRecord {
  year: number;
  openingBalance: number;
  deposits: number;
  interest: number;
  fees: number;
  taxes: number;
  withdrawals: number;
  closingBalance: number;
  inflationAdjustedClosing: number;
}

export interface SimulationResult {
  monthlyRecords: MonthlyRecord[];
  yearlyRecords: YearlyRecord[];
  totalDeposits: number;
  totalInterest: number;
  totalFees: number;
  totalTaxes: number;
  totalWithdrawals: number;
  futureValue: number;
  inflationAdjustedValue: number;
  netSavings: number;
  goalProgress: number; // percentage
  timeToGoalMonths: number;
  averageAnnualGrowth: number;
  isGoalAchieved: boolean;
  actualYearsSimulated: number;
  solvedFor: string;
  solvedValue: number;
}

/**
 * Calculates deposit amount adjusted for monthly frequency
 */
export function getMonthlyEquivalentDeposit(amount: number, freq: string, customDays: number = 30): number {
  if (!amount || amount <= 0) return 0;
  switch (freq) {
    case 'weekly':
      return amount * (52 / 12);
    case 'bi-weekly':
      return amount * (26 / 12);
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'yearly':
      return amount / 12;
    case 'custom':
      const days = customDays > 0 ? customDays : 30;
      return amount * (30 / days);
    default:
      return amount;
  }
}

/**
 * Calculates compounding factor per month
 */
export function getMonthlyCompoundingFactor(annualRate: number, compFreq: string): number {
  const r = annualRate / 100;
  switch (compFreq) {
    case 'daily':
      // (1 + r/365)^(365/12)
      return Math.pow(1 + r / 365, 365 / 12);
    case 'monthly':
      return 1 + r / 12;
    case 'quarterly':
      return Math.pow(1 + r / 4, 4 / 12);
    case 'semi-annual':
      return Math.pow(1 + r / 2, 2 / 12);
    case 'annual':
      return Math.pow(1 + r, 1 / 12);
    default:
      return 1 + r / 12;
  }
}

/**
 * Solves and runs the savings simulation
 */
export function runSavingsSimulation(params: Partial<SimulationParams>): SimulationResult | null {
  // Check required inputs to determine if we can compute
  const initialSavings = params.initialSavings ?? 0;
  const recurringDeposit = params.recurringDeposit ?? 0;
  const interestRate = params.interestRate ?? 0;
  const goalAmount = params.goalAmount ?? 0;
  const yearsInput = params.years ?? 0;

  // Count how many of the core inputs are present (non-zero or populated)
  let initialSavingsPresent = initialSavings >= 0; 
  let recurringDepositPresent = recurringDeposit > 0;
  let interestRatePresent = interestRate !== 0; // can be negative
  let goalAmountPresent = goalAmount > 0;
  let yearsPresent = yearsInput > 0;

  let solvedFor = 'None';
  let solvedValue = 0;
  let simulatedYears = yearsInput;

  // We need at least some basic configuration
  if (!initialSavingsPresent && !recurringDepositPresent) {
    return null;
  }

  // Auto-solver logic if years or recurring deposit or interest rate is missing but goal is set
  if (!yearsPresent && goalAmountPresent && interestRatePresent && (recurringDepositPresent || initialSavings > 0)) {
    // Solve for Years to reach Goal
    solvedFor = 'Duration';
    // Run a speculative maximum 100-year month-by-month loop to find when goal is met
    let tempBalance = initialSavings;
    let tempMonths = 0;
    let rDep = recurringDeposit;
    const factor = getMonthlyCompoundingFactor(interestRate, params.compoundingFrequency ?? 'monthly');
    const monthlyDepBase = getMonthlyEquivalentDeposit(rDep, params.recurringFrequency ?? 'monthly', params.customFrequencyDays ?? 30);
    
    while (tempBalance < goalAmount && tempMonths < 1200) {
      tempMonths++;
      const currentYear = Math.ceil(tempMonths / 12);
      
      // Step Up Deposit logic
      let monthlyDep = monthlyDepBase;
      if (params.annualIncrease && currentYear > 1) {
        const increaseVal = params.annualIncrease;
        if (params.annualIncreaseType === 'percentage') {
          monthlyDep = monthlyDepBase * Math.pow(1 + increaseVal / 100, currentYear - 1);
        } else {
          monthlyDep = monthlyDepBase + (increaseVal / 12) * (currentYear - 1);
        }
      }

      const opening = tempBalance;
      const stepInterest = opening * (factor - 1);
      
      // Subtract fees
      let fee = 0;
      if (params.managementFee) {
        if (params.managementFeeType === 'percentage') {
          fee = (params.managementFee / 100 / 12) * opening;
        } else {
          fee = params.managementFee / 12;
        }
      }

      // Subtract taxes on interest
      let tax = 0;
      if (params.taxRate && stepInterest > 0) {
        tax = stepInterest * (params.taxRate / 100);
      }

      // Subtract regular withdrawals
      let withdrawal = 0;
      if (params.withdrawalAmount && currentYear >= (params.withdrawalStartYear ?? 1)) {
        if (params.withdrawalFrequency === 'monthly') {
          withdrawal = params.withdrawalAmount;
        } else if (params.withdrawalFrequency === 'yearly' && tempMonths % 12 === 0) {
          withdrawal = params.withdrawalAmount;
        }
      }

      // Add custom events
      let eventDeposits = 0;
      let eventWithdrawals = 0;
      if (params.events) {
        params.events.forEach(ev => {
          const evDep = ev.deposit ? Number(ev.deposit) : 0;
          const evWith = ev.withdrawal ? Number(ev.withdrawal) : 0;
          let isEventActive = false;
          const evStart = ev.startYear !== '' ? Number(ev.startYear) : 1;
          const evEnd = ev.endYear !== '' ? Number(ev.endYear) : Infinity;

          if (currentYear >= evStart && currentYear <= evEnd) {
            if (ev.frequency === 'one-time' && currentYear === evStart && tempMonths % 12 === 1) {
              isEventActive = true;
            } else if (ev.frequency === 'weekly') {
              isEventActive = true; // handled as recurring
            } else if (ev.frequency === 'monthly') {
              isEventActive = true;
            } else if (ev.frequency === 'quarterly' && tempMonths % 3 === 0) {
              isEventActive = true;
            } else if (ev.frequency === 'yearly' && tempMonths % 12 === 0) {
              isEventActive = true;
            }
          }

          if (isEventActive) {
            if (ev.frequency === 'weekly') {
              eventDeposits += evDep * (52 / 12);
              eventWithdrawals += evWith * (52 / 12);
            } else {
              eventDeposits += evDep;
              eventWithdrawals += evWith;
            }
          }
        });
      }

      tempBalance = opening + monthlyDep + stepInterest + eventDeposits - fee - tax - withdrawal - eventWithdrawals;
      if (tempBalance < 0) tempBalance = 0;
    }
    simulatedYears = Math.max(1, Math.ceil(tempMonths / 12));
    solvedValue = simulatedYears;
  } else if (!recurringDepositPresent && goalAmountPresent && yearsPresent && interestRatePresent) {
    // Solve for Required Recurring Monthly Deposit
    solvedFor = 'Required Monthly Deposit';
    // Backsolve using an annuity formula approximation, then verify in loop
    const r = interestRate / 100;
    const n = yearsInput * 12;
    const f = getMonthlyCompoundingFactor(interestRate, params.compoundingFrequency ?? 'monthly');
    const totalGrowthFactor = Math.pow(f, n);
    const growthFromInitial = initialSavings * totalGrowthFactor;
    const gap = Math.max(0, goalAmount - growthFromInitial);
    
    if (gap > 0) {
      // S = PMT * [ (f^n - 1) / (f - 1) ] => PMT = S * (f - 1) / (f^n - 1)
      const annuityFactor = (f - 1) / (totalGrowthFactor - 1);
      solvedValue = gap * (f - 1 > 0 ? annuityFactor : 1 / n);
    } else {
      solvedValue = 0;
    }
  } else if (!interestRatePresent && goalAmountPresent && yearsPresent && recurringDepositPresent) {
    // Solve for Required Interest Rate
    solvedFor = 'Required Interest Rate';
    // Binary search for rate to match goal
    let lowRate = -10;
    let highRate = 100;
    let bestRate = 0;
    let iterations = 0;
    
    while (highRate - lowRate > 0.01 && iterations < 30) {
      iterations++;
      const midRate = (lowRate + highRate) / 2;
      const f = getMonthlyCompoundingFactor(midRate, params.compoundingFrequency ?? 'monthly');
      let bal = initialSavings;
      const monthlyDepBase = getMonthlyEquivalentDeposit(recurringDeposit, params.recurringFrequency ?? 'monthly', params.customFrequencyDays ?? 30);
      
      for (let m = 1; m <= yearsInput * 12; m++) {
        const yr = Math.ceil(m / 12);
        let monthlyDep = monthlyDepBase;
        if (params.annualIncrease && yr > 1) {
          const increaseVal = params.annualIncrease;
          if (params.annualIncreaseType === 'percentage') {
            monthlyDep = monthlyDepBase * Math.pow(1 + increaseVal / 100, yr - 1);
          } else {
            monthlyDep = monthlyDepBase + (increaseVal / 12) * (yr - 1);
          }
        }
        
        const opening = bal;
        const interest = opening * (f - 1);
        bal = opening + monthlyDep + interest;
      }
      
      if (bal >= goalAmount) {
        highRate = midRate;
        bestRate = midRate;
      } else {
        lowRate = midRate;
      }
    }
    solvedValue = bestRate;
  }

  // Fallback check: if duration is still not specified or invalid, fail gracefully
  const finalYears = Math.max(1, Math.min(100, Math.round(simulatedYears || 10)));
  const finalInterestRate = solvedFor === 'Required Interest Rate' ? solvedValue : interestRate;
  const finalRecurringDeposit = solvedFor === 'Required Monthly Deposit' ? solvedValue : recurringDeposit;

  // Setup actual simulation
  const totalMonths = finalYears * 12;
  const monthlyRecords: MonthlyRecord[] = [];
  const yearlyRecords: YearlyRecord[] = [];

  let currentBalance = initialSavings;
  const compoundFactor = getMonthlyCompoundingFactor(finalInterestRate, params.compoundingFrequency ?? 'monthly');
  const baseMonthlyDeposit = getMonthlyEquivalentDeposit(finalRecurringDeposit, params.recurringFrequency ?? 'monthly', params.customFrequencyDays ?? 30);

  let cumulativeDeposits = initialSavings;
  let cumulativeInterest = 0;
  let cumulativeFees = 0;
  let cumulativeTaxes = 0;
  let cumulativeWithdrawals = 0;

  // Year accumulations
  let yrOpening = initialSavings;
  let yrDeposits = 0;
  let yrInterest = 0;
  let yrFees = 0;
  let yrTaxes = 0;
  let yrWithdrawals = 0;

  let timeToGoalMonths = -1;

  for (let m = 1; m <= totalMonths; m++) {
    const currentYear = Math.ceil(m / 12);
    
    // Step Up Recurring Deposit logic (per year)
    let monthlyDep = baseMonthlyDeposit;
    if (params.annualIncrease && currentYear > 1) {
      const increaseVal = params.annualIncrease;
      if (params.annualIncreaseType === 'percentage') {
        monthlyDep = baseMonthlyDeposit * Math.pow(1 + increaseVal / 100, currentYear - 1);
      } else {
        monthlyDep = baseMonthlyDeposit + (increaseVal / 12) * (currentYear - 1);
      }
    }

    const openingBalance = currentBalance;
    const monthlyInterestEarned = openingBalance * (compoundFactor - 1);

    // Subtract fees
    let fee = 0;
    if (params.managementFee) {
      if (params.managementFeeType === 'percentage') {
        fee = (params.managementFee / 100 / 12) * openingBalance;
      } else {
        fee = params.managementFee / 12;
      }
    }

    // Subtract taxes
    let tax = 0;
    if (params.taxRate && monthlyInterestEarned > 0) {
      tax = monthlyInterestEarned * (params.taxRate / 100);
    }

    // Subtract withdrawal schedule
    let regularWithdrawal = 0;
    if (params.withdrawalAmount && currentYear >= (params.withdrawalStartYear ?? 1)) {
      if (params.withdrawalFrequency === 'monthly') {
        regularWithdrawal = params.withdrawalAmount;
      } else if (params.withdrawalFrequency === 'yearly' && m % 12 === 0) {
        regularWithdrawal = params.withdrawalAmount;
      }
    }

    // Process custom events for this specific month
    let eventDeposits = 0;
    let eventWithdrawals = 0;
    if (params.events) {
      params.events.forEach(ev => {
        const evDep = ev.deposit ? Number(ev.deposit) : 0;
        const evWith = ev.withdrawal ? Number(ev.withdrawal) : 0;
        let isEventActive = false;
        const evStart = ev.startYear !== '' ? Number(ev.startYear) : 1;
        const evEnd = ev.endYear !== '' ? Number(ev.endYear) : Infinity;

        if (currentYear >= evStart && currentYear <= evEnd) {
          if (ev.frequency === 'one-time' && currentYear === evStart && m % 12 === 1) {
            isEventActive = true;
          } else if (ev.frequency === 'weekly') {
            isEventActive = true;
          } else if (ev.frequency === 'monthly') {
            isEventActive = true;
          } else if (ev.frequency === 'quarterly' && m % 3 === 1) {
            isEventActive = true;
          } else if (ev.frequency === 'yearly' && m % 12 === 1) {
            isEventActive = true;
          }
        }

        if (isEventActive) {
          if (ev.frequency === 'weekly') {
            eventDeposits += evDep * (52 / 12);
            eventWithdrawals += evWith * (52 / 12);
          } else {
            eventDeposits += evDep;
            eventWithdrawals += evWith;
          }
        }
      });
    }

    const netDeposits = monthlyDep + eventDeposits;
    const netWithdrawals = regularWithdrawal + eventWithdrawals;

    currentBalance = openingBalance + netDeposits + monthlyInterestEarned - fee - tax - netWithdrawals;
    if (currentBalance < 0) currentBalance = 0;

    // Track inflation purchasing power
    const inflationFactor = Math.pow(1 + (params.inflationRate ?? 0) / 100, m / 12);
    const inflationAdjustedClosing = currentBalance / inflationFactor;

    // Cumulative tallies
    cumulativeDeposits += netDeposits;
    cumulativeInterest += monthlyInterestEarned;
    cumulativeFees += fee;
    cumulativeTaxes += tax;
    cumulativeWithdrawals += netWithdrawals;

    // Year accumulations
    yrDeposits += netDeposits;
    yrInterest += monthlyInterestEarned;
    yrFees += fee;
    yrTaxes += tax;
    yrWithdrawals += netWithdrawals;

    // Check Goal Completion Date
    if (goalAmountPresent && currentBalance >= goalAmount && timeToGoalMonths === -1) {
      timeToGoalMonths = m;
    }

    // Save Monthly Record
    monthlyRecords.push({
      month: m,
      year: currentYear,
      openingBalance,
      deposits: netDeposits,
      interest: monthlyInterestEarned,
      fees: fee,
      taxes: tax,
      withdrawals: netWithdrawals,
      closingBalance: currentBalance,
      inflationAdjustedClosing
    });

    // Save Yearly Record on year completion
    if (m % 12 === 0 || m === totalMonths) {
      yearlyRecords.push({
        year: currentYear,
        openingBalance: yrOpening,
        deposits: yrDeposits,
        interest: yrInterest,
        fees: yrFees,
        taxes: yrTaxes,
        withdrawals: yrWithdrawals,
        closingBalance: currentBalance,
        inflationAdjustedClosing
      });

      // Reset yearly counters for next year
      yrOpening = currentBalance;
      yrDeposits = 0;
      yrInterest = 0;
      yrFees = 0;
      yrTaxes = 0;
      yrWithdrawals = 0;
    }
  }

  const futureValue = currentBalance;
  const inflationFactorTotal = Math.pow(1 + (params.inflationRate ?? 0) / 100, finalYears);
  const inflationAdjustedValue = futureValue / inflationFactorTotal;
  const netSavings = futureValue;

  const totalCostBasis = cumulativeDeposits;
  const goalProgress = goalAmount > 0 ? Math.min(100, (futureValue / goalAmount) * 100) : 0;
  const isGoalAchieved = goalAmount > 0 && futureValue >= goalAmount;

  // Average annual compound growth rate estimate
  const averageAnnualGrowth = finalYears > 0 && initialSavings > 0
    ? (Math.pow(futureValue / initialSavings, 1 / finalYears) - 1) * 100
    : 0;

  return {
    monthlyRecords,
    yearlyRecords,
    totalDeposits: cumulativeDeposits - initialSavings,
    totalInterest: cumulativeInterest,
    totalFees: cumulativeFees,
    totalTaxes: cumulativeTaxes,
    totalWithdrawals: cumulativeWithdrawals,
    futureValue,
    inflationAdjustedValue,
    netSavings,
    goalProgress,
    timeToGoalMonths,
    averageAnnualGrowth,
    isGoalAchieved,
    actualYearsSimulated: finalYears,
    solvedFor,
    solvedValue
  };
}
