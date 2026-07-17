export interface EMIRateChange {
  id: string;
  effectivePaymentIndex: number | '';
  rate: number | '';
  reason?: string;
}

export interface EMIExtraPayment {
  id: string;
  paymentIndex: number | '';
  amount: number | '';
  description?: string;
  applyTo: 'principal' | 'interest' | 'both';
}

export interface EMIRecurringExtraPayment {
  id: string;
  amount: number | '';
  frequency: 'monthly' | 'yearly' | '';
}

export interface EMITaxEntry {
  id: string;
  amount: number | '';
  frequency: 'monthly' | 'annual' | '';
}

export interface EMIInsuranceEntry {
  id: string;
  amount: number | '';
  frequency: 'monthly' | 'annual' | 'one-time' | '';
}

export interface EMIFeeEntry {
  id: string;
  amount: number | '';
  label: string;
}

export interface EMICalculatorInputs {
  loanAmount: number | '';
  interestRate: number | '';
  tenure: number | '';
  tenureType: 'years' | 'months' | 'weeks' | 'payments' | '';
  
  // Optional Down Payment
  downPayment: number | '';
  
  // Optional Fee
  processingFee: number | '';
  processingFeeType: 'flat' | 'percent' | '';
  
  // Dates and Periods
  startDate: string;
  gracePeriod: number | '';
  gracePeriodType: 'none' | 'interest-only' | 'no-payment' | '';
  interestFreePeriod: number | '';
  
  // Extra Payments (global inputs)
  extraMonthly: number | '';
  extraYearly: number | '';
  oneTimeLumpSum: number | '';
  lumpSumIndex: number | '';
  
  // Frequencies
  paymentFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'semi-annually' | 'annually' | '';
  compoundFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'semi-annually' | 'annually' | '';
  
  // Extra Fees & Insurance
  insuranceCost: number | '';
  insuranceCostType: 'monthly' | 'annual' | 'one-time' | '';
  taxes: number | '';
  taxesType: 'monthly' | 'annual' | '';
  adminFees: number | '';
  otherCharges: number | '';
  
  // Mode of variable interest
  interestType: 'fixed' | 'variable' | 'hybrid' | '';
  
  // Custom Lists
  rateChanges: EMIRateChange[];
  extraPayments: EMIExtraPayment[];
  
  // New Dynamic Lists
  recurringExtraPayments?: EMIRecurringExtraPayment[];
  taxesList?: EMITaxEntry[];
  insuranceList?: EMIInsuranceEntry[];
  additionalFeesList?: EMIFeeEntry[];
  
  // Recast option
  prepaymentRecastOption: 'keep-emi' | 'reduce-emi' | '';
  currency: string;
}

export interface EMIPaymentRow {
  paymentNumber: number;
  paymentDate: string;
  openingBalance: number;
  emi: number;
  interestPaid: number;
  principalPaid: number;
  extraPayment: number;
  remainingBalance: number;
  runningInterest: number;
  runningPrincipal: number;
  taxesPaid: number;
  insurancePaid: number;
  otherFeesPaid: number;
  totalPeriodicCost: number;
}

export interface EMICalculationResults {
  rows: EMIPaymentRow[];
  monthlyEmi: number;
  totalInterest: number;
  totalPrincipal: number;
  totalPayment: number;
  totalExtraFees: number;
  interestPercent: number;
  principalPercent: number;
  payoffDate: string;
  interestSaved: number;
  timeSavedMonths: number;
  effectiveInterestRate: number;
  
  // Comparison vs baseline
  hasExtraPayments: boolean;
  baseTotalInterest: number;
  baseTotalPayment: number;
  baseTenureMonths: number;
}

export const getPeriodsPerYear = (freq: string): number => {
  switch (freq) {
    case 'weekly': return 52;
    case 'bi-weekly': return 26;
    case 'monthly': return 12;
    case 'quarterly': return 4;
    case 'semi-annually': return 2;
    case 'annually': return 1;
    default: return 12;
  }
};

// Add date helper
export const incrementDate = (startDateStr: string, index: number, frequency: string): string => {
  if (!startDateStr) {
    return `Payment ${index + 1}`;
  }
  const dateObj = new Date(startDateStr);
  if (isNaN(dateObj.getTime())) return `Payment ${index + 1}`;

  switch (frequency) {
    case 'weekly':
      dateObj.setDate(dateObj.getDate() + index * 7);
      break;
    case 'bi-weekly':
      dateObj.setDate(dateObj.getDate() + index * 14);
      break;
    case 'monthly':
      dateObj.setMonth(dateObj.getMonth() + index);
      break;
    case 'quarterly':
      dateObj.setMonth(dateObj.getMonth() + index * 3);
      break;
    case 'semi-annually':
      dateObj.setMonth(dateObj.getMonth() + index * 6);
      break;
    case 'annually':
      dateObj.setFullYear(dateObj.getFullYear() + index);
      break;
    default:
      dateObj.setMonth(dateObj.getMonth() + index);
  }

  return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Calculate periodic interest rate taking compounding frequency into account
export const getPeriodicRate = (annualRatePercent: number, paymentFreq: string, compoundFreq: string): number => {
  const p = getPeriodsPerYear(paymentFreq);
  const c = getPeriodsPerYear(compoundFreq);
  const R = annualRatePercent / 100;

  if (p === c) {
    return R / p;
  }

  // Precise compounding equation: r = (1 + R/c)^(c/p) - 1
  return Math.pow(1 + R / c, c / p) - 1;
};

// Generate standard amortization table and run the core engine
export const computeEmiAmortization = (
  inputs: EMICalculatorInputs,
  ignoreExtraPayments: boolean = false
): EMICalculationResults => {
  const rawAmount = Number(inputs.loanAmount) || 0;
  const downPayment = Number(inputs.downPayment) || 0;
  const initialPrincipal = Math.max(0, rawAmount - downPayment);

  const initialAnnualRate = Number(inputs.interestRate) || 0;
  const rawTenure = Number(inputs.tenure) || 0;

  // Calculate base periods M
  let totalPayments = 0;
  const pFrequency = inputs.paymentFrequency || 'monthly';
  const cFrequency = inputs.compoundFrequency || 'monthly';
  const periodsPerYear = getPeriodsPerYear(pFrequency);

  if (inputs.tenureType === 'years') {
    totalPayments = Math.round(rawTenure * periodsPerYear);
  } else if (inputs.tenureType === 'months') {
    totalPayments = Math.round((rawTenure / 12) * periodsPerYear);
  } else if (inputs.tenureType === 'weeks') {
    totalPayments = Math.round((rawTenure / 52) * periodsPerYear);
  } else {
    totalPayments = Math.round(rawTenure);
  }

  if (totalPayments <= 0 || initialPrincipal <= 0) {
    return {
      rows: [],
      monthlyEmi: 0,
      totalInterest: 0,
      totalPrincipal: 0,
      totalPayment: 0,
      totalExtraFees: 0,
      interestPercent: 0,
      principalPercent: 0,
      payoffDate: 'N/A',
      interestSaved: 0,
      timeSavedMonths: 0,
      effectiveInterestRate: 0,
      hasExtraPayments: false,
      baseTotalInterest: 0,
      baseTotalPayment: 0,
      baseTenureMonths: 0,
    };
  }

  // Calculate processing fee
  const processingFeeAmt = inputs.processingFee
    ? inputs.processingFeeType === 'percent'
      ? (initialPrincipal * (Number(inputs.processingFee) / 100))
      : Number(inputs.processingFee)
    : 0;

  // Set up compounding variables
  let currentBalance = initialPrincipal;
  const rows: EMIPaymentRow[] = [];
  let runningInterest = 0;
  let runningPrincipal = 0;
  let totalTaxesPaid = 0;
  let totalInsurancePaid = 0;
  let totalOtherFeesPaid = 0;

  // Track extra payments configuration
  const globalExtraMonthly = ignoreExtraPayments ? 0 : (Number(inputs.extraMonthly) || 0);
  const globalExtraYearly = ignoreExtraPayments ? 0 : (Number(inputs.extraYearly) || 0);
  const globalLumpSum = ignoreExtraPayments ? 0 : (Number(inputs.oneTimeLumpSum) || 0);
  const globalLumpSumIndex = ignoreExtraPayments ? 0 : (Number(inputs.lumpSumIndex) || 0);

  // Filter and parse rate changes (ensuring effectivePaymentIndex and rate are valid numbers)
  const activeRateChanges = (inputs.rateChanges || [])
    .filter(rc => typeof rc.effectivePaymentIndex === 'number' && typeof rc.rate === 'number')
    .map(rc => ({
      effectivePaymentIndex: rc.effectivePaymentIndex as number,
      rate: rc.rate as number,
      reason: rc.reason,
    }));

  const activeExtraPayments = ignoreExtraPayments ? [] : (inputs.extraPayments || [])
    .filter(ep => typeof ep.paymentIndex === 'number' && typeof ep.amount === 'number')
    .map(ep => ({
      paymentIndex: ep.paymentIndex as number,
      amount: ep.amount as number,
      description: ep.description,
    }));

  const gracePeriod = Number(inputs.gracePeriod) || 0;
  const interestFreePeriod = Number(inputs.interestFreePeriod) || 0;

  // Compute baseline (without prepayments) for saving comparison if this calculation is NOT the baseline
  let baselineResults: { totalInterest: number; totalPayment: number; tenurePayments: number } | null = null;
  if (!ignoreExtraPayments) {
    const baseline = computeEmiAmortization(inputs, true);
    baselineResults = {
      totalInterest: baseline.totalInterest,
      totalPayment: baseline.totalPayment,
      tenurePayments: baseline.rows.length,
    };
  }

  // Set initial periodic EMI based on initial state
  let currentAnnualRate = initialAnnualRate;
  let currentPeriodicRate = getPeriodicRate(currentAnnualRate, pFrequency, cFrequency);

  // Helper to compute standard EMI for a given principal, periodic rate, and remaining periods
  const computeStandardEMI = (P: number, r: number, remPeriods: number): number => {
    if (remPeriods <= 0) return 0;
    if (r <= 0) return P / remPeriods;
    return (P * r * Math.pow(1 + r, remPeriods)) / (Math.pow(1 + r, remPeriods) - 1);
  };

  let scheduledEMI = computeStandardEMI(initialPrincipal, currentPeriodicRate, totalPayments);

  // Main Loop through payment numbers
  for (let k = 1; k <= 1000; k++) { // safety limit of 1000 payments to avoid infinite loop
    if (currentBalance <= 0) break;

    // 1. Check for Rate Changes
    const rateOverride = activeRateChanges.find(rc => rc.effectivePaymentIndex === k);
    if (rateOverride) {
      currentAnnualRate = rateOverride.rate;
      currentPeriodicRate = getPeriodicRate(currentAnnualRate, pFrequency, cFrequency);
    }

    // 2. Check for Interest-Free Period
    const isInterestFree = k <= interestFreePeriod;
    const activePeriodicRate = isInterestFree ? 0 : currentPeriodicRate;

    // 3. Compute Interest Accrued
    const interestAccrued = Math.round(currentBalance * activePeriodicRate * 100) / 100;

    // 4. Determine EMI for this period
    let currentEMI = 0;

    // Check if we are in Grace Period
    const isGracePeriod = k <= gracePeriod;
    if (isGracePeriod) {
      if (inputs.gracePeriodType === 'interest-only') {
        currentEMI = interestAccrued;
      } else if (inputs.gracePeriodType === 'no-payment') {
        currentEMI = 0;
      }
    } else {
      // Recalculate scheduled EMI if rate change or if "recast" mode is active and we want to adjust EMI
      if (rateOverride || (inputs.prepaymentRecastOption === 'reduce-emi' && k > 1)) {
        const remainingPayments = Math.max(1, totalPayments - k + 1);
        scheduledEMI = computeStandardEMI(currentBalance, activePeriodicRate, remainingPayments);
      }
      currentEMI = scheduledEMI;
    }

    // Ensure payment does not over-settle the loan (regular payment cannot exceed remaining balance + interest)
    const maxRegularPayment = currentBalance + interestAccrued;
    let actualEMI = Math.min(currentEMI, maxRegularPayment);
    if (actualEMI < 0) actualEMI = 0;

    // Determine principal part of standard payment
    let principalPaid = actualEMI - interestAccrued;
    if (principalPaid < 0) {
      // If grace period is no-payment, interest is accrued and added to principal
      principalPaid = actualEMI - interestAccrued; // negative
    }

    // 5. Gather Extra Payments
    let extraAmt = 0;
    
    // Global extra monthly
    extraAmt += globalExtraMonthly;
    
    // Global extra yearly
    if (k % periodsPerYear === 0) {
      extraAmt += globalExtraYearly;
    }
    
    // Global lump sum
    if (k === globalLumpSumIndex) {
      extraAmt += globalLumpSum;
    }

    // Dynamic recurring extra payments
    if (!ignoreExtraPayments && inputs.recurringExtraPayments) {
      inputs.recurringExtraPayments.forEach(item => {
        const amt = Number(item.amount) || 0;
        if (item.frequency === 'monthly') {
          extraAmt += amt;
        } else if (item.frequency === 'yearly' && k % periodsPerYear === 0) {
          extraAmt += amt;
        }
      });
    }

    // Custom extra payments list
    const customExtras = activeExtraPayments.filter(ep => ep.paymentIndex === k);
    customExtras.forEach(ep => {
      extraAmt += ep.amount;
    });

    // Limit extra payment to outstanding balance after standard scheduled payment
    const balanceAfterStandard = currentBalance + interestAccrued - actualEMI;
    extraAmt = Math.min(extraAmt, Math.max(0, balanceAfterStandard));

    // Total Principal Paid in this period
    const totalPrincipalThisPeriod = principalPaid + extraAmt;

    // 6. Calculate Auxiliary Periodic Costs (Insurance, taxes, admin, other charges)
    let taxesPaid = 0;
    if (inputs.taxes) {
      taxesPaid = inputs.taxesType === 'annual' ? (Number(inputs.taxes) / periodsPerYear) : Number(inputs.taxes);
    }
    if (inputs.taxesList) {
      inputs.taxesList.forEach(item => {
        const amt = Number(item.amount) || 0;
        if (item.frequency === 'monthly') {
          taxesPaid += amt;
        } else if (item.frequency === 'annual') {
          taxesPaid += amt / periodsPerYear;
        }
      });
    }

    let insurancePaid = 0;
    if (inputs.insuranceCost) {
      if (inputs.insuranceCostType === 'monthly') {
        insurancePaid = Number(inputs.insuranceCost);
      } else if (inputs.insuranceCostType === 'annual') {
        insurancePaid = Number(inputs.insuranceCost) / periodsPerYear;
      } else if (inputs.insuranceCostType === 'one-time' && k === 1) {
        insurancePaid = Number(inputs.insuranceCost);
      }
    }
    if (inputs.insuranceList) {
      inputs.insuranceList.forEach(item => {
        const amt = Number(item.amount) || 0;
        if (item.frequency === 'monthly') {
          insurancePaid += amt;
        } else if (item.frequency === 'annual') {
          insurancePaid += amt / periodsPerYear;
        } else if (item.frequency === 'one-time' && k === 1) {
          insurancePaid += amt;
        }
      });
    }

    let otherFeesPaid = (Number(inputs.adminFees) || 0) + (Number(inputs.otherCharges) || 0);
    if (inputs.additionalFeesList) {
      inputs.additionalFeesList.forEach(item => {
        otherFeesPaid += Number(item.amount) || 0;
      });
    }
    const totalPeriodicCost = actualEMI + extraAmt + taxesPaid + insurancePaid + otherFeesPaid;

    runningInterest += interestAccrued;
    runningPrincipal += totalPrincipalThisPeriod;
    totalTaxesPaid += taxesPaid;
    totalInsurancePaid += insurancePaid;
    totalOtherFeesPaid += otherFeesPaid;

    const openingBalance = currentBalance;
    currentBalance = Math.max(0, currentBalance + interestAccrued - actualEMI - extraAmt);

    rows.push({
      paymentNumber: k,
      paymentDate: incrementDate(inputs.startDate, k - 1, pFrequency),
      openingBalance,
      emi: actualEMI,
      interestPaid: interestAccrued,
      principalPaid,
      extraPayment: extraAmt,
      remainingBalance: currentBalance,
      runningInterest,
      runningPrincipal,
      taxesPaid,
      insurancePaid,
      otherFeesPaid,
      totalPeriodicCost,
    });

    // If fully paid off, stop
    if (currentBalance <= 0) break;
  }

  // Summarize results
  const totalPrincipal = initialPrincipal;
  const totalInterest = runningInterest;
  const totalPayment = totalPrincipal + totalInterest;
  const totalExtraFees = totalTaxesPaid + totalInsurancePaid + totalOtherFeesPaid + processingFeeAmt;

  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  const principalPercent = totalPayment > 0 ? (totalPrincipal / totalPayment) * 100 : 0;

  const payoffDate = inputs.startDate && rows.length > 0 ? rows[rows.length - 1].paymentDate : 'N/A';

  // Savings
  const hasExtraPayments = baselineResults !== null && (
    globalExtraMonthly > 0 ||
    globalExtraYearly > 0 ||
    globalLumpSum > 0 ||
    activeExtraPayments.length > 0 ||
    inputs.gracePeriod !== '' ||
    inputs.interestFreePeriod !== ''
  );

  const interestSaved = baselineResults ? Math.max(0, baselineResults.totalInterest - totalInterest) : 0;
  // Convert payment period difference into months for "Time Saved"
  let timeSavedMonths = 0;
  if (baselineResults) {
    const periodDiff = baselineResults.tenurePayments - rows.length;
    if (periodDiff > 0) {
      if (pFrequency === 'weekly') {
        timeSavedMonths = (periodDiff * 7) / 30.44;
      } else if (pFrequency === 'bi-weekly') {
        timeSavedMonths = (periodDiff * 14) / 30.44;
      } else if (pFrequency === 'monthly') {
        timeSavedMonths = periodDiff;
      } else if (pFrequency === 'quarterly') {
        timeSavedMonths = periodDiff * 3;
      } else if (pFrequency === 'semi-annually') {
        timeSavedMonths = periodDiff * 6;
      } else if (pFrequency === 'annually') {
        timeSavedMonths = periodDiff * 12;
      }
    }
  }

  // Calculate average annual rate weighted by balance or just effective rate
  const effectiveInterestRate = initialAnnualRate;

  return {
    rows,
    monthlyEmi: rows.length > 0 ? rows[0].emi : 0,
    totalInterest,
    totalPrincipal,
    totalPayment,
    totalExtraFees,
    interestPercent,
    principalPercent,
    payoffDate,
    interestSaved,
    timeSavedMonths,
    effectiveInterestRate,
    hasExtraPayments,
    baseTotalInterest: baselineResults ? baselineResults.totalInterest : totalInterest,
    baseTotalPayment: baselineResults ? baselineResults.totalPayment : totalPayment,
    baseTenureMonths: baselineResults ? baselineResults.tenurePayments : rows.length,
  };
};
