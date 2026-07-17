import { CarPaymentInputs, AmortizationRow, YearAmortizationRow, CalculationResults } from './types';

export function parseNum(val: string): number {
  const parsed = parseFloat(val);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

export function calculateCarPayment(inputs: CarPaymentInputs): CalculationResults {
  // 1. Parse base inputs
  const vehiclePrice = parseNum(inputs.vehiclePrice);
  const downPayment = parseNum(inputs.downPayment);
  const interestRate = parseNum(inputs.interestRate);
  const loanTerm = Math.round(parseNum(inputs.loanTerm)) || 12; // default to min 12 if 0

  // Optional Trade-In details
  const tradeInValue = inputs.mode === 'trade-in' ? parseNum(inputs.tradeInValue) : 0;
  const tradeInBalance = inputs.mode === 'trade-in' ? parseNum(inputs.tradeInBalance) : 0;

  // Other Fees & Optional Add-ons
  const salesTaxRate = parseNum(inputs.salesTax);
  const registrationFee = parseNum(inputs.registrationFee);
  const titleFee = parseNum(inputs.titleFee);
  const docFee = parseNum(inputs.docFee);
  const dealerFee = parseNum(inputs.dealerFee);
  const extendedWarranty = parseNum(inputs.extendedWarranty);
  const gapInsurance = parseNum(inputs.gapInsurance);
  const optionalInsurance = parseNum(inputs.optionalInsurance);
  const maintenanceEstimate = parseNum(inputs.maintenanceEstimate);
  const negativeEquity = parseNum(inputs.negativeEquity);

  // Rebates / Cash Incentives
  const manufacturerRebate = parseNum(inputs.manufacturerRebate);
  const cashIncentive = parseNum(inputs.cashIncentive);

  // 2. Calculations for loan amount (Amount Financed)
  // Basic calculation: Price - Down Payment - Trade-in + Trade-In Loan Balance
  // Add tax, fees, accessories, and subtract incentives
  const baseForTax = Math.max(0, vehiclePrice - tradeInValue);
  const calculatedSalesTax = baseForTax * (salesTaxRate / 100);

  const totalUpfrontFees = registrationFee + titleFee + docFee + dealerFee;
  const totalIncentives = manufacturerRebate + cashIncentive;
  const totalAddOns = extendedWarranty + gapInsurance + negativeEquity + tradeInBalance;

  // Let's distinguish between Total Cost of Vehicle vs Amount Financed
  // Amount Financed = Vehicle Price - Down Payment - Trade-in Value + Trade-In Balance + Tax + Fees + Addons - Incentives
  const netAmount = vehiclePrice - downPayment - tradeInValue + calculatedSalesTax + totalUpfrontFees + totalAddOns - totalIncentives;
  const amountFinanced = Math.max(0, netAmount);

  // Monthly Interest Rate
  const r = (interestRate / 100) / 12;

  // 3. Monthly payment
  let monthlyPayment = 0;
  if (amountFinanced > 0) {
    if (interestRate === 0) {
      monthlyPayment = amountFinanced / loanTerm;
    } else {
      monthlyPayment = amountFinanced * (r * Math.pow(1 + r, loanTerm)) / (Math.pow(1 + r, loanTerm) - 1);
    }
  }

  // 4. Generate Standard Amortization Schedule
  let remainingBalance = amountFinanced;
  const schedule: AmortizationRow[] = [];
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;

  for (let i = 1; i <= loanTerm; i++) {
    const interest = interestRate === 0 ? 0 : remainingBalance * r;
    let principal = monthlyPayment - interest;
    
    if (remainingBalance < principal) {
      principal = remainingBalance;
    }

    remainingBalance = Math.max(0, remainingBalance - principal);
    totalInterestPaid += interest;
    totalPrincipalPaid += principal;

    schedule.push({
      paymentNumber: i,
      paymentAmount: interest + principal,
      principal,
      interest,
      extraPayment: 0,
      remainingBalance,
      totalInterestPaid,
      totalPrincipalPaid
    });

    if (remainingBalance <= 0) break;
  }

  // Generate standard yearly schedule
  const yearlySchedule: YearAmortizationRow[] = [];
  for (let i = 0; i < schedule.length; i += 12) {
    const chunk = schedule.slice(i, i + 12);
    const lastItem = chunk[chunk.length - 1];
    const yearNumber = Math.floor(i / 12) + 1;
    const yearPayment = chunk.reduce((sum, item) => sum + item.paymentAmount, 0);
    const yearPrincipal = chunk.reduce((sum, item) => sum + item.principal, 0);
    const yearInterest = chunk.reduce((sum, item) => sum + item.interest, 0);

    yearlySchedule.push({
      yearNumber,
      paymentAmount: yearPayment,
      principal: yearPrincipal,
      interest: yearInterest,
      extraPayment: 0,
      remainingBalance: lastItem.remainingBalance,
      totalInterestPaid: lastItem.totalInterestPaid,
      totalPrincipalPaid: lastItem.totalPrincipalPaid
    });
  }

  // 5. Generate Extra Payment Schedule (Planner / Early Payoff Analyzer)
  const oneTimeExtra = parseNum(inputs.oneTimeExtra);
  const oneTimeExtraMonth = Math.round(parseNum(inputs.oneTimeExtraMonth)) || 1;
  const monthlyExtra = parseNum(inputs.monthlyExtra);
  const annualExtra = parseNum(inputs.annualExtra);

  const hasExtraPayments = oneTimeExtra > 0 || monthlyExtra > 0 || annualExtra > 0;
  const extraSchedule: AmortizationRow[] = [];
  let eRemainingBalance = amountFinanced;
  let eTotalInterestPaid = 0;
  let eTotalPrincipalPaid = 0;
  let extraMonthsUsed = 0;

  if (hasExtraPayments && amountFinanced > 0) {
    // Run month-by-month calculation with a maximum limit of 360 months to prevent infinity loops
    for (let i = 1; i <= 360; i++) {
      const interest = interestRate === 0 ? 0 : eRemainingBalance * r;
      let principal = monthlyPayment - interest;

      if (eRemainingBalance < principal) {
        principal = eRemainingBalance;
      }

      // Check for extra payments
      let currentExtra = 0;
      if (eRemainingBalance > principal) {
        currentExtra += monthlyExtra;
        if (i === oneTimeExtraMonth) {
          currentExtra += oneTimeExtra;
        }
        if (i % 12 === 0) {
          currentExtra += annualExtra;
        }
      }

      // Cap extra payment to actual remaining balance
      const maxExtraAllowed = Math.max(0, eRemainingBalance - principal);
      if (currentExtra > maxExtraAllowed) {
        currentExtra = maxExtraAllowed;
      }

      const actualPrincipalWithExtra = principal + currentExtra;
      eRemainingBalance = Math.max(0, eRemainingBalance - actualPrincipalWithExtra);
      eTotalInterestPaid += interest;
      eTotalPrincipalPaid += actualPrincipalWithExtra;
      extraMonthsUsed = i;

      extraSchedule.push({
        paymentNumber: i,
        paymentAmount: interest + principal + currentExtra,
        principal: actualPrincipalWithExtra,
        interest,
        extraPayment: currentExtra,
        remainingBalance: eRemainingBalance,
        totalInterestPaid: eTotalInterestPaid,
        totalPrincipalPaid: eTotalPrincipalPaid
      });

      if (eRemainingBalance <= 0) break;
    }
  }

  // Generate extra yearly schedule
  const extraYearlySchedule: YearAmortizationRow[] = [];
  for (let i = 0; i < extraSchedule.length; i += 12) {
    const chunk = extraSchedule.slice(i, i + 12);
    const lastItem = chunk[chunk.length - 1];
    const yearNumber = Math.floor(i / 12) + 1;
    const yearPayment = chunk.reduce((sum, item) => sum + item.paymentAmount, 0);
    const yearPrincipal = chunk.reduce((sum, item) => sum + item.principal, 0);
    const yearInterest = chunk.reduce((sum, item) => sum + item.interest, 0);
    const yearExtra = chunk.reduce((sum, item) => sum + item.extraPayment, 0);

    extraYearlySchedule.push({
      yearNumber,
      paymentAmount: yearPayment,
      principal: yearPrincipal,
      interest: yearInterest,
      extraPayment: yearExtra,
      remainingBalance: lastItem.remainingBalance,
      totalInterestPaid: lastItem.totalInterestPaid,
      totalPrincipalPaid: lastItem.totalPrincipalPaid
    });
  }

  // Calculate payoff dates dynamically starting from now (July 2026)
  const baseDate = new Date('2026-07-17T04:33:58-07:00');
  
  const formatDateOffset = (monthsOffset: number) => {
    const d = new Date(baseDate);
    d.setMonth(d.getMonth() + monthsOffset);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const originalPayoffDate = formatDateOffset(loanTerm);
  const payoffDate = hasExtraPayments ? formatDateOffset(extraMonthsUsed) : originalPayoffDate;
  const monthsSaved = hasExtraPayments ? Math.max(0, loanTerm - extraMonthsUsed) : 0;
  const interestSaved = hasExtraPayments ? Math.max(0, totalInterestPaid - eTotalInterestPaid) : 0;

  // 6. Cost metrics
  const totalLoanAmount = amountFinanced;
  const interestPaid = totalInterestPaid;
  const totalCostOfLoan = amountFinanced + interestPaid;
  
  // Total cost of vehicle includes down payment, trade-in value, upfront fees, add-ons and interest paid
  const totalCostOfVehicle = downPayment + tradeInValue + calculatedSalesTax + totalUpfrontFees + totalAddOns + interestPaid + (vehiclePrice - tradeInValue - downPayment - totalIncentives);

  // 7. Ownership Monthly & Annual Cost
  const insurancePM = parseNum(inputs.insurancePerMonth);
  const fuelPM = parseNum(inputs.fuelPerMonth);
  const maintPM = parseNum(inputs.maintenancePerMonth);
  const parkPM = parseNum(inputs.parkingPerMonth);
  
  const ownershipMonthlyCost = insurancePM + fuelPM + maintPM + parkPM + monthlyPayment;
  const ownershipAnnualCost = ownershipMonthlyCost * 12;

  // 8. Affordability Check ratios
  const monthlyIncome = parseNum(inputs.monthlyIncome);
  const monthlyDebt = parseNum(inputs.monthlyDebt);
  const targetBudget = parseNum(inputs.targetBudget);

  let paymentToIncomeRatio = 0;
  let debtToIncomeRatio = 0;
  let affordabilityStatus: 'excellent' | 'good' | 'tight' | 'unaffordable' | 'neutral' = 'neutral';

  if (monthlyIncome > 0) {
    paymentToIncomeRatio = (monthlyPayment / monthlyIncome) * 100;
    debtToIncomeRatio = ((monthlyDebt + monthlyPayment) / monthlyIncome) * 100;

    if (paymentToIncomeRatio <= 10 && debtToIncomeRatio <= 36) {
      affordabilityStatus = 'excellent';
    } else if (paymentToIncomeRatio <= 15 && debtToIncomeRatio <= 40) {
      affordabilityStatus = 'good';
    } else if (paymentToIncomeRatio <= 20 && debtToIncomeRatio <= 45) {
      affordabilityStatus = 'tight';
    } else {
      affordabilityStatus = 'unaffordable';
    }
  }

  // 9. Step-by-Step Math solver
  const formula = `Monthly Payment = P * [r * (1 + r)^n] / [(1 + r)^n - 1]`;
  const substitution = `${amountFinanced.toFixed(2)} * [${r.toFixed(6)} * (1 + ${r.toFixed(6)})^${loanTerm}] / [(1 + ${r.toFixed(6)})^${loanTerm} - 1]`;
  const pStr = amountFinanced.toFixed(2);
  const rStr = r.toFixed(6);
  const numer = (r * Math.pow(1 + r, loanTerm)).toFixed(6);
  const denom = (Math.pow(1 + r, loanTerm) - 1).toFixed(6);
  
  const steps = [
    `Step 1: Calculate Amount Financed = Vehicle Price (${vehiclePrice}) - Down Payment (${downPayment}) - Trade-In (${tradeInValue}) + Tax (${calculatedSalesTax.toFixed(2)}) + Fees (${totalUpfrontFees}) + Add-ons (${totalAddOns}) - Incentives (${totalIncentives}) = ${amountFinanced.toFixed(2)}`,
    `Step 2: Calculate monthly interest rate (r) = APR / 12 = ${interestRate}% / 12 = ${rStr}`,
    `Step 3: Plug into PMT Formula: PMT = ${pStr} * [${rStr} * (1 + ${rStr})^${loanTerm}] / [(1 + ${rStr})^${loanTerm} - 1]`,
    `Step 4: Solve Numerator: r * (1 + r)^n = ${numer}`,
    `Step 5: Solve Denominator: (1 + r)^n - 1 = ${denom}`,
    `Step 6: Divide Numerator by Denominator and multiply by Principal: ${pStr} * (${numer} / ${denom}) = ${monthlyPayment.toFixed(2)}`
  ];

  // 10. Lease vs Buy Comparison
  let leaseBuyResult = undefined;
  if (inputs.mode === 'lease-buy') {
    const leasePayment = parseNum(inputs.leasePayment);
    const leaseTerm = Math.round(parseNum(inputs.leaseTerm)) || 36;
    const residualValue = parseNum(inputs.residualValue) || (vehiclePrice * 0.55); // estimate 55% if empty

    const totalLeaseCost = (leasePayment * leaseTerm) + downPayment;
    // For buy: we look at standard loan over the same leaseTerm period (or total cost with depreciation)
    // To keep it clean and standard: Total Buy Cost over that term = downPayment + (monthlyPayment * leaseTerm) - Residual value
    // (since you own the vehicle which is still worth the residual value)
    const totalBuyCost = downPayment + (monthlyPayment * leaseTerm) + totalUpfrontFees - residualValue;

    const buyMonthly = monthlyPayment;
    const leaseMonthly = leasePayment;
    const difference = Math.abs(totalBuyCost - totalLeaseCost);
    const verdict = totalBuyCost < totalLeaseCost 
      ? 'Buying is more financially beneficial because you retain vehicle equity (residual value).' 
      : 'Leasing is more beneficial for lower monthly payments and zero depreciation risks.';

    // Break-even is roughly lease payment divided by loan difference, or visual threshold
    const breakEvenMonths = Math.max(1, Math.round(totalLeaseCost / (Math.max(1, monthlyPayment - leasePayment))));

    leaseBuyResult = {
      buyMonthly,
      leaseMonthly,
      buyTotalCost: Math.max(0, totalBuyCost),
      leaseTotalCost: totalLeaseCost,
      difference,
      verdict,
      breakEvenMonths
    };
  }

  return {
    monthlyPayment,
    totalLoanAmount,
    interestPaid,
    totalCostOfLoan,
    totalCostOfVehicle,
    amountFinanced,
    totalUpfrontCost: totalUpfrontFees + downPayment - tradeInValue + calculatedSalesTax,
    schedule,
    yearlySchedule,
    hasExtraPayments,
    extraSchedule,
    extraYearlySchedule,
    interestSaved,
    monthsSaved,
    payoffDate,
    originalPayoffDate,
    ownershipMonthlyCost,
    ownershipAnnualCost,
    paymentToIncomeRatio,
    debtToIncomeRatio,
    affordabilityStatus,
    stepByStep: {
      formula,
      substitution,
      steps,
      finalAnswer: monthlyPayment.toFixed(2)
    },
    leaseBuy: leaseBuyResult
  };
}
