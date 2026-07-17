export interface VariableRateEvent {
  id: string;
  startMonth: number; // The month index (1-based) where this rate starts applying
  rate: number; // New annual interest percentage (e.g. 7.5)
}

export interface ExtraPaymentEvent {
  id: string;
  type: 'monthly' | 'yearly' | 'onetime' | 'custom';
  month: number; // Target month (for onetime or custom)
  amount: number;
  description?: string;
}

export interface LoanInputs {
  amount: number; // Property/Asset value
  currency: string; // Symbol, e.g., "$"
  interestRate: number; // Base rate
  interestType: 'fixed' | 'variable' | 'mixed';
  variableRates: VariableRateEvent[];
  termYears: number;
  termMonths: number;
  startDate: string; // "YYYY-MM-DD"
  paymentFrequency: 'monthly' | 'biweekly' | 'weekly' | 'quarterly' | 'yearly';
  compoundingFrequency: 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'daily' | 'continuous';
  downPayment: number;
  downPaymentPercent: number;
  // Fees
  processingFee: number;
  processingFeeType: 'fixed' | 'percent';
  originationFee: number;
  originationFeeType: 'fixed' | 'percent';
  otherFees: number;
  otherFeesType: 'fixed' | 'percent';
  // Insurance
  mortgageInsurance: number;
  mortgageInsuranceType: 'monthly' | 'yearly' | 'onetime';
  propertyInsurance: number;
  propertyInsuranceType: 'monthly' | 'yearly' | 'onetime';
  // Taxes
  propertyTax: number;
  propertyTaxType: 'monthly' | 'yearly' | 'onetime';
  stampDuty: number;
  stampDutyType: 'fixed' | 'percent';
  // Extra Payments
  extraMonthly: number;
  extraYearly: number;
  extraPaymentsList: ExtraPaymentEvent[];
  // Advanced settings
  gracePeriod: number; // in months
  graceType: 'interest-only' | 'deferred';
  balloonPayment: number;
  inflationRate: number;
}

export interface AmortizationRow {
  paymentNumber: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  fees: number;
  insurance: number;
  taxes: number;
  extraPayment: number;
  remainingBalance: number;
  rateApplied: number;
  nominalCost: number;
  realCost: number;
}

export interface LoanResults {
  schedule: AmortizationRow[];
  monthlyPayment: number; // standard baseline payment
  totalPayment: number;
  totalInterest: number;
  totalFees: number;
  totalInsurance: number;
  totalTaxes: number;
  totalExtraPayments: number;
  interestSaved: number;
  timeSavedMonths: number;
  finalPayoffDate: string;
  apr: number;
  effectiveAnnualRate: number;
  trueLoanCost: number;
  realCostAfterInflation: number;
  progressPercent: number;
  ltv: number;
  healthScore: number;
  healthReasons: string[];
}

// Convert frequencies to compounding periods per year
function getCompoundingPeriods(freq: string): number {
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
}

// Convert payment frequency to periods per year
function getPaymentPeriodsPerYear(freq: string): number {
  switch (freq) {
    case 'weekly': return 52;
    case 'biweekly': return 26;
    case 'monthly': return 12;
    case 'quarterly': return 4;
    case 'yearly': return 1;
    default: return 12;
  }
}

// Calculate the periodic interest rate adjusted for compounding rules
export function calculatePeriodicRate(
  annualRatePct: number,
  payFreq: string,
  compFreq: string
): number {
  const R = annualRatePct / 100;
  const F_pay = getPaymentPeriodsPerYear(payFreq);
  
  if (compFreq === 'continuous') {
    // EAR = e^R - 1, periodic rate = (1 + EAR)^(1 / F_pay) - 1 = e^(R / F_pay) - 1
    return Math.exp(R / F_pay) - 1;
  }

  const F_comp = getCompoundingPeriods(compFreq);
  if (F_comp === F_pay) {
    return R / F_pay;
  }

  // Exact formula converting nominal compound rate to periodic rate:
  // (1 + R / F_comp)^F_comp = (1 + r)^F_pay
  // r = (1 + R / F_comp)^(F_comp / F_pay) - 1
  return Math.pow(1 + R / F_comp, F_comp / F_pay) - 1;
}

// Format date nicely
export function addMonths(dateStr: string, monthsToAdd: number): string {
  const d = new Date(dateStr + 'T12:00:00');
  if (isNaN(d.getTime())) return dateStr;
  d.setMonth(d.getMonth() + monthsToAdd);
  return d.toISOString().split('T')[0];
}

// Format period index to actual date
export function getPeriodDate(startDateStr: string, periodIndex: number, payFreq: string): string {
  const monthsPerPeriod = 12 / getPaymentPeriodsPerYear(payFreq);
  return addMonths(startDateStr, Math.round(periodIndex * monthsPerPeriod));
}

export function computeLoanAmortization(inputs: LoanInputs): LoanResults {
  const currency = inputs.currency || '$';

  // Helper function to safely convert potential empty/undefined strings to numbers
  const numVal = (v: any, def = 0): number => {
    if (v === undefined || v === null || v === "") return def;
    const p = Number(v);
    return isNaN(p) ? def : p;
  };
  
  // 1. Initial Principal Calculation
  const propertyValue = numVal(inputs.amount);
  const downPayment = numVal(inputs.downPayment);
  const principal = Math.max(0, propertyValue - downPayment);
  const ltv = propertyValue > 0 ? (principal / propertyValue) * 100 : 0;

  const payFreqPerYear = getPaymentPeriodsPerYear(inputs.paymentFrequency);
  const totalPeriodsScheduled = Math.max(
    1,
    (numVal(inputs.termYears) * payFreqPerYear) + Math.round((numVal(inputs.termMonths) * payFreqPerYear) / 12)
  );

  // Calculate upfront fees
  let upfrontFees = 0;
  if (inputs.stampDutyType === 'fixed') {
    upfrontFees += numVal(inputs.stampDuty);
  } else {
    upfrontFees += (numVal(inputs.stampDuty) / 100) * principal;
  }

  // Monthly or standard periodic fees/costs
  const getPeriodFee = (feeVal: number, feeType: 'fixed' | 'percent'): number => {
    if (feeType === 'fixed') return feeVal / (12 / (12 / payFreqPerYear)); // prorated to period
    return ((feeVal / 100) * principal) / payFreqPerYear;
  };

  const periodProcessingFee = getPeriodFee(numVal(inputs.processingFee), inputs.processingFeeType);
  const periodOriginationFee = getPeriodFee(numVal(inputs.originationFee), inputs.originationFeeType);
  const periodOtherFee = getPeriodFee(numVal(inputs.otherFees), inputs.otherFeesType);
  const totalPeriodFees = periodProcessingFee + periodOriginationFee + periodOtherFee;

  // Monthly or standard periodic insurance
  const getPeriodInsurance = (insVal: number, insType: 'monthly' | 'yearly' | 'onetime'): number => {
    if (insType === 'onetime') return 0; // handled upfront
    if (insType === 'yearly') return insVal / payFreqPerYear;
    return insVal * (12 / payFreqPerYear); // monthly to period conversion
  };

  const periodMortgageIns = getPeriodInsurance(numVal(inputs.mortgageInsurance), inputs.mortgageInsuranceType);
  const periodPropertyIns = getPeriodInsurance(numVal(inputs.propertyInsurance), inputs.propertyInsuranceType);
  const totalPeriodInsurance = periodMortgageIns + periodPropertyIns;

  // Onetime insurances (upfront)
  let upfrontInsurance = 0;
  if (inputs.mortgageInsuranceType === 'onetime') upfrontInsurance += numVal(inputs.mortgageInsurance);
  if (inputs.propertyInsuranceType === 'onetime') upfrontInsurance += numVal(inputs.propertyInsurance);

  // Monthly or standard periodic taxes
  const getPeriodTax = (taxVal: number, taxType: 'monthly' | 'yearly' | 'onetime'): number => {
    if (taxType === 'onetime') return 0;
    if (taxType === 'yearly') return taxVal / payFreqPerYear;
    return taxVal * (12 / payFreqPerYear);
  };
  const periodPropertyTax = getPeriodTax(numVal(inputs.propertyTax), inputs.propertyTaxType);
  let upfrontTax = 0;
  if (inputs.propertyTaxType === 'onetime') upfrontTax += numVal(inputs.propertyTax);

  // 2. Schedule Simulation Engine
  let balance = principal;
  const schedule: AmortizationRow[] = [];
  
  let totalInterest = 0;
  let totalPayments = 0;
  let totalFeesPaid = upfrontFees;
  let totalInsurancePaid = upfrontInsurance;
  let totalTaxesPaid = upfrontTax;
  let totalExtraPaid = 0;

  const inflationPeriodicRate = numVal(inputs.inflationRate) / 100 / payFreqPerYear;

  // Grace Period boundaries
  const gracePeriodInPaymentPeriods = Math.round(numVal(inputs.gracePeriod) * (payFreqPerYear / 12));

  // Variable rates sorting
  const sortedVariableRates = [...inputs.variableRates].sort((a, b) => a.startMonth - b.startMonth);

  // Base rate calculation helper
  const getRateForPeriod = (periodNum: number): number => {
    const currentMonth = Math.ceil((periodNum * 12) / payFreqPerYear);
    if (inputs.interestType === 'fixed') return numVal(inputs.interestRate);
    
    // Mixed interest rate (e.g. fixed for first 5 years, then variable)
    // Here we can search for the last matching variable rate event
    let activeRate = numVal(inputs.interestRate);
    for (const item of sortedVariableRates) {
      if (currentMonth >= item.startMonth) {
        activeRate = numVal(item.rate);
      }
    }
    return activeRate;
  };

  let num = 1;
  while (balance > 0.01 && num <= 1200) { // Limit to 1200 periods (e.g. 100 years weekly) to avoid crash
    const rateApplied = getRateForPeriod(num);
    const r = calculatePeriodicRate(rateApplied, inputs.paymentFrequency, inputs.compoundingFrequency);
    
    // Calculated interest due for this period
    const interestDue = balance * r;
    
    let scheduledPMT = 0;
    let isGrace = num <= gracePeriodInPaymentPeriods;
    let principalPaid = 0;

    if (isGrace) {
      if (inputs.graceType === 'interest-only') {
        scheduledPMT = interestDue;
        principalPaid = 0;
      } else {
        // deferred (0 payment, interest capitalized)
        scheduledPMT = 0;
        principalPaid = -interestDue; // negative principal
      }
    } else {
      // Recalculate scheduled payment based on remaining periods and outstanding balance
      const remainingPeriods = totalPeriodsScheduled - num + 1;
      const balloon = numVal(inputs.balloonPayment);
      
      if (remainingPeriods > 0) {
        if (r > 0) {
          // Standard PMT with possible Balloon balance remaining
          scheduledPMT = (balance * r * Math.pow(1 + r, remainingPeriods) - balloon * r) / (Math.pow(1 + r, remainingPeriods) - 1);
        } else {
          scheduledPMT = (balance - balloon) / remainingPeriods;
        }
      } else {
        scheduledPMT = balance + interestDue;
      }
      
      scheduledPMT = Math.max(0, scheduledPMT);
      principalPaid = Math.min(balance, scheduledPMT - interestDue);
    }

    // Accumulate extra payments for this period
    let extraPeriodAmount = 0;
    // Standard regular extra payments
    if (numVal(inputs.extraMonthly) > 0) {
      // Extra monthly applies to every month. Prorate to payment frequency:
      extraPeriodAmount += numVal(inputs.extraMonthly) / (payFreqPerYear / 12);
    }
    
    const currentMonthIndex = Math.ceil((num * 12) / payFreqPerYear);
    if (numVal(inputs.extraYearly) > 0 && currentMonthIndex % 12 === 0 && num % (payFreqPerYear / 12) === 0) {
      extraPeriodAmount += numVal(inputs.extraYearly);
    }

    // Custom manual extra payment list
    for (const evt of inputs.extraPaymentsList) {
      if (evt.month === currentMonthIndex) {
        // distribute over the periods in that target month
        const periodsInMonth = Math.max(1, payFreqPerYear / 12);
        extraPeriodAmount += numVal(evt.amount) / periodsInMonth;
      }
    }

    const actualExtraPaid = Math.min(balance - principalPaid, extraPeriodAmount);

    // Apply payments
    let finalPrincipal = principalPaid + actualExtraPaid;
    let finalInterest = interestDue;
    
    if (balance + finalInterest < scheduledPMT) {
      scheduledPMT = balance + finalInterest;
      finalPrincipal = balance;
    }

    // Capitalize interest in deferred grace period
    balance = balance + finalInterest - (scheduledPMT + actualExtraPaid);
    if (balance < 0) balance = 0;

    // Inflation adjustment factor
    const nominalCost = scheduledPMT + finalPrincipal + totalPeriodFees + totalPeriodInsurance + periodPropertyTax + actualExtraPaid;
    const realCost = nominalCost * Math.pow(1 + inflationPeriodicRate, -num);

    schedule.push({
      paymentNumber: num,
      date: getPeriodDate(inputs.startDate, num, inputs.paymentFrequency),
      payment: scheduledPMT,
      principal: Math.max(0, principalPaid),
      interest: finalInterest,
      fees: totalPeriodFees,
      insurance: totalPeriodInsurance,
      taxes: periodPropertyTax,
      extraPayment: actualExtraPaid,
      remainingBalance: balance,
      rateApplied,
      nominalCost,
      realCost
    });

    totalInterest += finalInterest;
    totalPayments += scheduledPMT;
    totalFeesPaid += totalPeriodFees;
    totalInsurancePaid += totalPeriodInsurance;
    totalTaxesPaid += periodPropertyTax;
    totalExtraPaid += actualExtraPaid;

    num++;
  }

  // Calculate "scheduled only" (without extra payments) to calculate exact savings
  const baselineResults = computeBaselineNoExtras(inputs, principal);

  const interestSaved = Math.max(0, baselineResults.totalInterest - totalInterest);
  const timeSavedMonths = Math.max(0, baselineResults.totalPeriods - schedule.length) * (12 / payFreqPerYear);

  const finalPayoffDate = schedule.length > 0 ? schedule[schedule.length - 1].date : inputs.startDate;
  const trueLoanCost = principal + totalInterest + totalFeesPaid + totalInsurancePaid + totalTaxesPaid;

  // Calculate simple real cost adjusted for inflation
  let realCostAfterInflation = trueLoanCost;
  if (numVal(inputs.inflationRate) > 0) {
    realCostAfterInflation = schedule.reduce((sum, row) => sum + row.realCost, 0);
  }

  // Calculate APR (Approximate)
  // APR = (Total Fees + Total Interest + Total Insurance) / Loan Principal / Term Years * 100
  const termYearsActual = schedule.length / payFreqPerYear;
  const totalFinancingCharges = totalInterest + totalFeesPaid;
  const apr = termYearsActual > 0 ? ((totalFinancingCharges / principal) / termYearsActual) * 100 : numVal(inputs.interestRate);

  const effectiveAnnualRate = (Math.pow(1 + (numVal(inputs.interestRate) / 100) / getCompoundingPeriods(inputs.compoundingFrequency), getCompoundingPeriods(inputs.compoundingFrequency)) - 1) * 100;

  // Progress Percent (Current status based on start and current date relative to payoff)
  const today = new Date();
  const startD = new Date(inputs.startDate);
  const payoffD = new Date(finalPayoffDate);
  let progressPercent = 0;
  if (today > startD) {
    const totalDuration = payoffD.getTime() - startD.getTime();
    const elapsed = today.getTime() - startD.getTime();
    progressPercent = totalDuration > 0 ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)) : 0;
  }

  // Health Score calculation (Rule-Based)
  let healthScore = 100;
  const healthReasons: string[] = [];

  if (ltv > 80) {
    healthScore -= 15;
    healthReasons.push('Low down payment (LTV > 80%) increases insurance premiums and interest risks.');
  } else {
    healthScore += 5;
    healthReasons.push('Solid down payment (LTV ≤ 80%) reduces lender risk and eliminates PMI.');
  }

  if (totalExtraPaid > 0) {
    healthScore += 15;
    healthReasons.push(`Excellent prepayments! You saved ${currency}${interestSaved.toLocaleString('en-US', { maximumFractionDigits: 0 })} in compound interest.`);
  }

  const interestToPrincipalRatio = totalInterest / principal;
  if (interestToPrincipalRatio > 1.0) {
    healthScore -= 20;
    healthReasons.push('Total interest exceeds original principal sum. Consider shortening loan term or paying extra.');
  } else if (interestToPrincipalRatio < 0.3) {
    healthScore += 10;
    healthReasons.push('Fantastic interest-to-principal ratio. Financing costs are highly optimized.');
  }

  const totalChargesPct = (totalFeesPaid / principal) * 100;
  if (totalChargesPct > 5) {
    healthScore -= 10;
    healthReasons.push('Lender processing & origination fees are high (exceeds 5% of principal).');
  }

  if (numVal(inputs.gracePeriod) > 0 && inputs.graceType === 'deferred') {
    healthScore -= 10;
    healthReasons.push('Deferred payment capitalization triggers negative amortization, compounding your debt.');
  }

  healthScore = Math.min(100, Math.max(10, healthScore));

  return {
    schedule,
    monthlyPayment: schedule[0] ? schedule[0].payment : 0,
    totalPayment: totalPayments,
    totalInterest,
    totalFees: totalFeesPaid,
    totalInsurance: totalInsurancePaid,
    totalTaxes: totalTaxesPaid,
    totalExtraPayments: totalExtraPaid,
    interestSaved,
    timeSavedMonths,
    finalPayoffDate,
    apr,
    effectiveAnnualRate,
    trueLoanCost,
    realCostAfterInflation,
    progressPercent,
    ltv,
    healthScore,
    healthReasons
  };
}

// Compute standard baseline schedule without any prepayments or custom schedules
function computeBaselineNoExtras(inputs: LoanInputs, principal: number): { totalInterest: number; totalPeriods: number } {
  // Helper function to safely convert potential empty/undefined strings to numbers
  const numVal = (v: any, def = 0): number => {
    if (v === undefined || v === null || v === "") return def;
    const p = Number(v);
    return isNaN(p) ? def : p;
  };

  const payFreqPerYear = getPaymentPeriodsPerYear(inputs.paymentFrequency);
  const totalPeriodsScheduled = Math.max(
    1,
    (numVal(inputs.termYears) * payFreqPerYear) + Math.round((numVal(inputs.termMonths) * payFreqPerYear) / 12)
  );

  let balance = principal;
  let totalInterest = 0;
  let num = 1;

  const sortedVariableRates = [...inputs.variableRates].sort((a, b) => a.startMonth - b.startMonth);
  const getRateForPeriod = (periodNum: number): number => {
    const currentMonth = Math.ceil((periodNum * 12) / payFreqPerYear);
    if (inputs.interestType === 'fixed') return numVal(inputs.interestRate);
    
    let activeRate = numVal(inputs.interestRate);
    for (const item of sortedVariableRates) {
      if (currentMonth >= item.startMonth) {
        activeRate = numVal(item.rate);
      }
    }
    return activeRate;
  };

  const gracePeriodInPaymentPeriods = Math.round(numVal(inputs.gracePeriod) * (payFreqPerYear / 12));

  while (balance > 0.01 && num <= 1200) {
    const rateApplied = getRateForPeriod(num);
    const r = calculatePeriodicRate(rateApplied, inputs.paymentFrequency, inputs.compoundingFrequency);
    const interestDue = balance * r;

    let scheduledPMT = 0;
    let isGrace = num <= gracePeriodInPaymentPeriods;

    if (isGrace) {
      if (inputs.graceType === 'interest-only') {
        scheduledPMT = interestDue;
      } else {
        scheduledPMT = 0;
      }
    } else {
      const remainingPeriods = totalPeriodsScheduled - num + 1;
      const balloon = numVal(inputs.balloonPayment);
      
      if (remainingPeriods > 0) {
        if (r > 0) {
          scheduledPMT = (balance * r * Math.pow(1 + r, remainingPeriods) - balloon * r) / (Math.pow(1 + r, remainingPeriods) - 1);
        } else {
          scheduledPMT = (balance - balloon) / remainingPeriods;
        }
      } else {
        scheduledPMT = balance + interestDue;
      }
      
      scheduledPMT = Math.max(0, scheduledPMT);
    }

    let principalPaid = Math.min(balance, scheduledPMT - interestDue);
    if (balance + interestDue < scheduledPMT) {
      scheduledPMT = balance + interestDue;
      principalPaid = balance;
    }

    balance = balance + interestDue - scheduledPMT;
    if (balance < 0) balance = 0;
    totalInterest += interestDue;
    num++;
  }

  return {
    totalInterest,
    totalPeriods: num - 1
  };
}
