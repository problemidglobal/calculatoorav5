export interface CustomRateEvent {
  id: string;
  year: number; // 1-based, e.g., year 1, year 2
  rate: number; // percentage, e.g., 6.5
}

export interface ExtraPaymentEvent {
  id: string;
  type: 'monthly' | 'quarterly' | 'yearly' | 'onetime';
  month: number; // 1-based month index where it occurs (for onetime)
  amount: number;
  description?: string;
}

export interface CarLoanInputs {
  // Required Inputs
  carPrice: number | '';
  interestRate: number | '';
  loanTerm: number | '';
  termUnit: 'months' | 'years';
  startDate: string;

  // Car Specifications
  vehicleType: string; // 'New' | 'Used' | 'CPO' | 'EV' | 'Hybrid' | 'Gasoline' | 'Diesel' | 'Luxury' | 'Commercial'

  // Down Payment
  downPayment: number | '';
  downPaymentPercent: number | '';
  downPaymentType: 'amount' | 'percent';

  // Trade-In Details
  tradeInValue: number | '';
  tradeInBalance: number | '';

  // Incentives & Rebates
  dealerRebate: number | '';
  manufacturerIncentive: number | '';
  cashDiscount: number | '';

  // Taxes & Fees
  salesTaxRate: number | '';
  salesTaxType: 'percent' | 'amount';
  salesTaxAmount: number | '';

  registrationFee: number | '';
  registrationFeeType: 'amount' | 'percent';
  titleFee: number | '';
  titleFeeType: 'amount' | 'percent';
  documentationFee: number | '';
  documentationFeeType: 'amount' | 'percent';
  dealerFee: number | '';
  dealerFeeType: 'amount' | 'percent';
  destinationCharge: number | '';
  destinationChargeType: 'amount' | 'percent';
  governmentFee: number | '';
  governmentFeeType: 'amount' | 'percent';
  inspectionFee: number | '';
  inspectionFeeType: 'amount' | 'percent';
  licenseFee: number | '';
  licenseFeeType: 'amount' | 'percent';
  customFee: number | '';
  customFeeType: 'amount' | 'percent';

  // Financing Options
  financeFeesAndTaxes: boolean;

  // Add-ons / Insurances
  extendedWarranty: number | '';
  gapInsurance: number | '';
  roadsideAssistance: number | '';
  servicePackage: number | '';
  processingFee: number | '';
  originationFee: number | '';
  balloonPayment: number | '';

  // Extra Payments
  extraMonthly: number | '';
  extraOneTime: number | '';
  extraOneTimeMonth: number | '';
  annualExtra: number | '';
  extraPaymentsList: ExtraPaymentEvent[];

  // Affordability
  annualIncome: number | '';
  existingDebts: number | '';

  // Interest Type & Variable Rates
  interestType: 'fixed' | 'variable';
  customRateSchedule: CustomRateEvent[];
  
  // Inflation Rate
  inflationRate: number | '';
}

export interface CarAmortizationRow {
  paymentNumber: number;
  date: string;
  beginningBalance: number;
  regularPayment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  fees: number; // monthly share if applicable, or fee added
  insurance: number; // GAP or monthly share
  endingBalance: number;
  rateApplied: number;
  nominalCost: number;
  realCost: number; // inflation-discounted
}

export interface OwnershipCostEstimate {
  year: number;
  depreciation: number;
  fuelOrCharging: number;
  insurance: number;
  maintenance: number;
  loanPayments: number;
  total: number;
}

export interface CarLoanResults {
  // Core financial metrics
  loanAmount: number; // Raw principal before taxes & fees are added/financed
  financedAmount: number; // Final loan amount (Principal financed including fees/taxes/addons if rolled-in)
  monthlyPayment: number; // Initial required payment
  biweeklyPayment: number;
  weeklyPayment: number;
  totalInterest: number;
  totalPayment: number; // Total payments made over the active life of the loan
  aprEstimate: number;
  
  // Breakdown aggregates
  principalPaid: number;
  downPaymentPaid: number;
  netTradeInCredit: number;
  tradeInLoanBalancePaid: number;
  totalTaxesPaid: number;
  totalFeesPaid: number;
  totalAddonsPaid: number;
  totalVehicleCost: number; // Full cost of vehicle ownership (Down payment + Trade-in equity + Total Payments)
  totalCashNeededUpfront: number; // Out of pocket cash required at purchase
  
  // Extra payment rewards
  interestSaved: number;
  timeSavedMonths: number;
  payoffDate: string;
  loanProgressPercent: number;
  
  // Affordability Metrics
  maxRecommendedLoan: number;
  maxRecommendedMonthlyBudget: number;
  dtiRatioPercent: number;
  affordabilityStatus: 'Conservative' | 'Moderate' | 'Aggressive' | 'Over-leveraged' | 'N/A';
  affordabilityScore: number; // 0 to 100
  
  // Timeline schedule
  schedule: CarAmortizationRow[];
  
  // 5-Year Ownership Estimation
  fiveYearOwnershipCost: number;
  ownershipBreakdown: OwnershipCostEstimate[];
}

// Net Trade-In calculation helper
export function computeNetTradeIn(value: number, balance: number): number {
  return value - balance;
}

// Solve for APR using standard Newton-Raphson solver
// We want to find the rate 'r' such that:
// Financed Amount - Fees = Sum_t [ PMT / (1 + r)^t ]
function solveAPR(financedAmount: number, upfrontFees: number, monthlyPayment: number, totalMonths: number): number {
  const p = financedAmount - upfrontFees;
  if (p <= 0 || monthlyPayment <= 0 || totalMonths <= 0) return 0;

  // Let's guess starting monthly rate
  let r = 0.05 / 12; // 5% guess
  const maxIterations = 100;
  const precision = 1e-7;

  for (let i = 0; i < maxIterations; i++) {
    // f(r) = Sum_t [ PMT / (1+r)^t ] - P
    // df(r)/dr = Sum_t [ -t * PMT / (1+r)^(t+1) ]
    let f = -p;
    let df = 0;

    for (let t = 1; t <= totalMonths; t++) {
      const discount = Math.pow(1 + r, -t);
      f += monthlyPayment * discount;
      df -= t * monthlyPayment * discount / (1 + r);
    }

    if (Math.abs(df) < 1e-12) break;

    const nextR = r - f / df;
    if (Math.abs(nextR - r) < precision) {
      r = nextR;
      break;
    }
    r = nextR;
  }

  const annualAPR = r * 12 * 100;
  return isNaN(annualAPR) || annualAPR < 0 ? 0 : annualAPR;
}

// Helper to project dates month by month
function getNextDate(startDateStr: string, monthsToAdd: number): string {
  if (!startDateStr) return '';
  const d = new Date(startDateStr + 'T12:00:00'); // avoid timezone shifts
  if (isNaN(d.getTime())) return '';
  d.setMonth(d.getMonth() + monthsToAdd);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function computeCarLoan(inputs: CarLoanInputs): CarLoanResults | null {
  const carPrice = Number(inputs.carPrice) || 0;
  const baseInterestRate = Number(inputs.interestRate) || 0;
  const termValue = Number(inputs.loanTerm) || 0;

  if (carPrice <= 0 || termValue <= 0) {
    return null;
  }

  const totalMonths = inputs.termUnit === 'years' ? termValue * 12 : termValue;
  if (totalMonths <= 0) return null;

  // 1. Incentives & Trade-in
  const dealerRebate = Number(inputs.dealerRebate) || 0;
  const manufacturerIncentive = Number(inputs.manufacturerIncentive) || 0;
  const cashDiscount = Number(inputs.cashDiscount) || 0;
  const totalIncentives = dealerRebate + manufacturerIncentive + cashDiscount;

  const tradeInValue = Number(inputs.tradeInValue) || 0;
  const tradeInBalance = Number(inputs.tradeInBalance) || 0;
  const netTradeInValue = tradeInValue - tradeInBalance; // positive = credit, negative = roll-over negative equity

  // 2. Down Payment
  let downPayment = 0;
  if (inputs.downPaymentType === 'percent') {
    const pct = Number(inputs.downPaymentPercent) || 0;
    downPayment = carPrice * (pct / 100);
  } else {
    downPayment = Number(inputs.downPayment) || 0;
  }
  // Sanity validation: downpayment cannot exceed car price
  downPayment = Math.min(downPayment, carPrice);

  // 3. Taxes & Fees
  const taxBasis = Math.max(0, carPrice - (netTradeInValue > 0 ? netTradeInValue : 0) - totalIncentives);
  let salesTax = 0;
  if (inputs.salesTaxType === 'percent') {
    salesTax = taxBasis * ((Number(inputs.salesTaxRate) || 0) / 100);
  } else {
    salesTax = Number(inputs.salesTaxAmount) || 0;
  }

  const getFeeVal = (val: number | '', type: 'amount' | 'percent') => {
    if (!val) return 0;
    return type === 'percent' ? carPrice * (val / 100) : val;
  };

  const registration = getFeeVal(inputs.registrationFee, inputs.registrationFeeType);
  const title = getFeeVal(inputs.titleFee, inputs.titleFeeType);
  const doc = getFeeVal(inputs.documentationFee, inputs.documentationFeeType);
  const dealerFee = getFeeVal(inputs.dealerFee, inputs.dealerFeeType);
  const destination = getFeeVal(inputs.destinationCharge, inputs.destinationChargeType);
  const govFee = getFeeVal(inputs.governmentFee, inputs.governmentFeeType);
  const inspFee = getFeeVal(inputs.inspectionFee, inputs.inspectionFeeType);
  const licFee = getFeeVal(inputs.licenseFee, inputs.licenseFeeType);
  const customFee = getFeeVal(inputs.customFee, inputs.customFeeType);

  const totalFees = registration + title + doc + dealerFee + destination + govFee + inspFee + licFee + customFee + (Number(inputs.processingFee) || 0) + (Number(inputs.originationFee) || 0);

  // Addons
  const warranty = Number(inputs.extendedWarranty) || 0;
  const gap = Number(inputs.gapInsurance) || 0;
  const roadside = Number(inputs.roadsideAssistance) || 0;
  const servicePack = Number(inputs.servicePackage) || 0;
  const totalAddons = warranty + gap + roadside + servicePack;

  const negativeEquity = netTradeInValue < 0 ? Math.abs(netTradeInValue) : 0;
  const tradeInCredit = netTradeInValue > 0 ? netTradeInValue : 0;

  // 4. Principal Calculations
  // Loan Amount = Purchase price minus down payment, trade-in credit, and total rebates, plus negative equity
  const rawPrincipal = Math.max(0, carPrice - downPayment - tradeInCredit - totalIncentives + negativeEquity);

  // Rolling in fees/taxes/addons if financed
  const extrasFinanced = inputs.financeFeesAndTaxes ? (salesTax + totalFees + totalAddons) : 0;
  const financedAmount = rawPrincipal + extrasFinanced;

  const upfrontCashNeeded = downPayment + (!inputs.financeFeesAndTaxes ? (salesTax + totalFees + totalAddons) : 0);

  // 5. Interest Rate & Recalculating Amortization Row-by-Row
  // Helper to resolve interest rate for a given month 'm' (1-based)
  const getRateForMonth = (m: number): number => {
    if (inputs.interestType === 'fixed') {
      return baseInterestRate;
    }
    const yearOfLoan = Math.ceil(m / 12);
    const matchedSchedule = inputs.customRateSchedule.find(s => s.year === yearOfLoan);
    return matchedSchedule ? matchedSchedule.rate : baseInterestRate;
  };

  // Helper to compute standard amortization payment PMT = P * r * (1+r)^n / ((1+r)^n - 1)
  const getAmortizationPayment = (principal: number, annualRate: number, monthsRemaining: number): number => {
    if (monthsRemaining <= 0) return 0;
    const r = (annualRate / 100) / 12;
    if (r === 0) return principal / monthsRemaining;
    return (principal * r * Math.pow(1 + r, monthsRemaining)) / (Math.pow(1 + r, monthsRemaining) - 1);
  };

  // Run month-by-month calculation to support Variable/Custom Schedules and Extra payments
  // We'll run TWO passes:
  // Pass A: Baseline (no extra payments) to find standard timeline/interest
  // Pass B: Active (with custom extras) to find early payoff & interest savings
  
  // ----- Pass A: Baseline (no extras) -----
  let baseBalance = financedAmount;
  let baseTotalInterest = 0;
  let baseTotalPayments = 0;
  const baseScheduleMonthlyPayments: number[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    if (baseBalance <= 0) {
      baseScheduleMonthlyPayments.push(0);
      continue;
    }
    const currentRate = getRateForMonth(m);
    const monthsRemaining = totalMonths - m + 1;
    
    // Auto-loans recalculate payment when interest rate drops or increases
    // Standard auto fixed loans use Year 1 rate for payments. If variable, recalculate at rate boundaries (each year start)
    const rateChangedOrStart = m === 1 || (inputs.interestType === 'variable' && (m - 1) % 12 === 0);
    
    let requiredPayment = 0;
    if (rateChangedOrStart) {
      requiredPayment = getAmortizationPayment(baseBalance, currentRate, monthsRemaining);
    } else {
      requiredPayment = baseScheduleMonthlyPayments[m - 2] || getAmortizationPayment(baseBalance, currentRate, monthsRemaining);
    }
    baseScheduleMonthlyPayments.push(requiredPayment);

    const r = (currentRate / 100) / 12;
    const interestCharge = baseBalance * r;
    const principalPaid = Math.min(baseBalance, requiredPayment - interestCharge);
    
    baseTotalInterest += interestCharge;
    baseTotalPayments += (interestCharge + principalPaid);
    baseBalance -= principalPaid;
  }

  // ----- Pass B: Active (with extras, inflation, etc.) -----
  let activeBalance = financedAmount;
  let activeTotalInterest = 0;
  let activeTotalPaymentsCount = 0;
  const activeSchedule: CarAmortizationRow[] = [];
  
  const inflationPercent = Number(inputs.inflationRate) || 0;
  const inflationMonthlyRate = (inflationPercent / 100) / 12;

  let activeTotalExtraPaid = 0;
  let hasPaidOff = false;

  for (let m = 1; m <= totalMonths * 2; m++) { // Let balloon or terms stretch if needed up to double, but generally cap
    if (activeBalance <= 0.005) {
      if (!hasPaidOff) {
        hasPaidOff = true;
      }
      break;
    }

    const currentRate = getRateForMonth(m);
    const monthsRemaining = Math.max(1, totalMonths - m + 1);

    // Baseline required payment recalculation
    const rateChangedOrStart = m === 1 || (inputs.interestType === 'variable' && (m - 1) % 12 === 0);
    let requiredPayment = 0;
    if (rateChangedOrStart) {
      requiredPayment = getAmortizationPayment(activeBalance, currentRate, monthsRemaining);
    } else {
      // retrieve previously calculated required payment, but if balance changed a lot due to prepayments, 
      // let's keep required payment steady (paying down principal faster) as is typical of auto loans,
      // or recalculate to fully amortize. In standard car loans, extra prepayments shorten the term but don't lower the required monthly payment.
      // So we keep the payment calculated at the start of the year or loan!
      const startOfYearMonth = Math.floor((m - 1) / 12) * 12 + 1;
      requiredPayment = getAmortizationPayment(
        m === 1 ? financedAmount : activeSchedule[startOfYearMonth - 2]?.endingBalance || financedAmount,
        currentRate,
        totalMonths - startOfYearMonth + 1
      );
    }

    const r = (currentRate / 100) / 12;
    const interestCharge = activeBalance * r;
    const principalPaid = Math.min(activeBalance, Math.max(0, requiredPayment - interestCharge));

    // Calculate extra payments for month m
    let extraPaidThisMonth = 0;
    
    // Regular monthly extra
    extraPaidThisMonth += Number(inputs.extraMonthly) || 0;
    
    // Annual extra
    if (m % 12 === 0) {
      extraPaidThisMonth += Number(inputs.annualExtra) || 0;
    }

    // Custom one-time extra
    if (m === Number(inputs.extraOneTimeMonth)) {
      extraPaidThisMonth += Number(inputs.extraOneTime) || 0;
    }

    // List of extra payments
    inputs.extraPaymentsList.forEach(e => {
      if (e.type === 'monthly') {
        extraPaidThisMonth += e.amount;
      } else if (e.type === 'quarterly' && m % 3 === 0) {
        extraPaidThisMonth += e.amount;
      } else if (e.type === 'yearly' && m % 12 === 0) {
        extraPaidThisMonth += e.amount;
      } else if (e.type === 'onetime' && m === e.month) {
        extraPaidThisMonth += e.amount;
      }
    });

    // Cap extra payment to remaining balance
    const remainingAfterRegular = activeBalance - principalPaid;
    const realExtraApplied = Math.min(remainingAfterRegular, extraPaidThisMonth);
    activeTotalExtraPaid += realExtraApplied;

    const totalPrincipalThisMonth = principalPaid + realExtraApplied;
    const endingBalance = activeBalance - totalPrincipalThisMonth;

    // Nominal vs Real Cost
    const totalCashOutlay = requiredPayment + realExtraApplied;
    // Discount factor = (1 + inflation)^-m
    const discountFactor = Math.pow(1 + inflationMonthlyRate, -m);
    const realOutlay = totalCashOutlay * discountFactor;

    activeSchedule.push({
      paymentNumber: m,
      date: getNextDate(inputs.startDate, m - 1),
      beginningBalance: activeBalance,
      regularPayment: requiredPayment,
      principal: principalPaid,
      interest: interestCharge,
      extraPayment: realExtraApplied,
      fees: 0, // already rolled in or upfront
      insurance: 0, // already rolled in or upfront
      endingBalance: Math.max(0, endingBalance),
      rateApplied: currentRate,
      nominalCost: totalCashOutlay,
      realCost: realOutlay,
    });

    activeTotalInterest += interestCharge;
    activeTotalPaymentsCount++;
    activeBalance = endingBalance;
  }

  // Handle Balloon Payment at the end of the term if balance remains
  if (activeBalance > 0 && Number(inputs.balloonPayment) > 0) {
    const balloon = Math.min(activeBalance, Number(inputs.balloonPayment));
    activeTotalPaymentsCount++;
    activeSchedule.push({
      paymentNumber: activeSchedule.length + 1,
      date: getNextDate(inputs.startDate, activeSchedule.length),
      beginningBalance: activeBalance,
      regularPayment: balloon,
      principal: balloon,
      interest: 0,
      extraPayment: 0,
      fees: 0,
      insurance: 0,
      endingBalance: 0,
      rateApplied: 0,
      nominalCost: balloon,
      realCost: balloon * Math.pow(1 + inflationMonthlyRate, -(activeSchedule.length + 1)),
    });
    activeBalance = 0;
  }

  // 6. Outputs Summary Calculations
  const finalPayoffDate = activeSchedule[activeSchedule.length - 1]?.date || inputs.startDate;
  const standardMonthlyPayment = baseScheduleMonthlyPayments[0] || 0;

  // Time & Interest Savings
  const interestSaved = Math.max(0, baseTotalInterest - activeTotalInterest);
  const timeSavedMonths = Math.max(0, totalMonths - activeSchedule.length);

  // Biweekly/Weekly estimates
  const biweeklyPayment = standardMonthlyPayment / 2;
  const weeklyPayment = standardMonthlyPayment / 4;

  const totalPaymentsActive = activeSchedule.reduce((sum, row) => sum + row.nominalCost, 0);

  // Total Vehicle Cost = Downpayment + trade-in credit (if positive) + Total Payments (which includes principal + interest + financed taxes/fees)
  // Plus any upfront cash taxes/fees that were not financed
  const totalTaxesPaid = salesTax;
  const totalFeesPaid = totalFees;
  const totalAddonsPaid = totalAddons;
  const totalVehicleCost = upfrontCashNeeded + tradeInCredit + totalPaymentsActive;

  // APR Estimation
  const aprEstimate = solveAPR(financedAmount, Number(inputs.processingFee) || 0, standardMonthlyPayment, totalMonths);

  // 7. Affordability Indicator
  const annualIncome = Number(inputs.annualIncome) || 0;
  const existingDebts = Number(inputs.existingDebts) || 0;
  
  let maxRecommendedMonthlyBudget = 0;
  let maxRecommendedLoan = 0;
  let dtiRatioPercent = 0;
  let affordabilityStatus: 'Conservative' | 'Moderate' | 'Aggressive' | 'Over-leveraged' | 'N/A' = 'N/A';
  let affordabilityScore = 100;

  if (annualIncome > 0) {
    const monthlyGrossIncome = annualIncome / 12;
    // Conservatively 10% of monthly income should go to car payment
    maxRecommendedMonthlyBudget = monthlyGrossIncome * 0.10;
    
    // Recommended max loan size based on current rate and term
    const r = (baseInterestRate / 100) / 12;
    if (r > 0) {
      maxRecommendedLoan = maxRecommendedMonthlyBudget * ((1 - Math.pow(1 + r, -totalMonths)) / r);
    } else {
      maxRecommendedLoan = maxRecommendedMonthlyBudget * totalMonths;
    }

    // DTI including new car payment
    const totalNewMonthlyDebt = existingDebts + standardMonthlyPayment;
    dtiRatioPercent = (totalNewMonthlyDebt / monthlyGrossIncome) * 100;

    // Evaluate category based on car payment percentage of monthly gross income
    const carPaymentPctOfIncome = (standardMonthlyPayment / monthlyGrossIncome) * 100;
    if (carPaymentPctOfIncome <= 8) {
      affordabilityStatus = 'Conservative';
      affordabilityScore = 95 - carPaymentPctOfIncome * 2;
    } else if (carPaymentPctOfIncome <= 15) {
      affordabilityStatus = 'Moderate';
      affordabilityScore = 80 - (carPaymentPctOfIncome - 8) * 3;
    } else if (carPaymentPctOfIncome <= 22) {
      affordabilityStatus = 'Aggressive';
      affordabilityScore = 55 - (carPaymentPctOfIncome - 15) * 4;
    } else {
      affordabilityStatus = 'Over-leveraged';
      affordabilityScore = Math.max(5, 25 - (carPaymentPctOfIncome - 22) * 5);
    }
  }

  // 8. Dynamic 5-Year Ownership Projection
  // Estimates based on vehicle type (EV vs Gasoline, etc.)
  let annualDepreciationRate = 0.15; // standard
  let annualInsuranceCost = 1500;
  let annualMaintenanceCost = 800;
  let annualFuelCost = 1200;

  if (inputs.vehicleType === 'EV') {
    annualDepreciationRate = 0.18; // EVs depreciate slightly faster initially
    annualFuelCost = 450; // Electricity is cheaper than fuel
    annualMaintenanceCost = 500; // Less moving parts
    annualInsuranceCost = 1800; // slightly higher
  } else if (inputs.vehicleType === 'Used') {
    annualDepreciationRate = 0.10; // Used has slower depreciation curves
    annualMaintenanceCost = 1300; // higher repairs
    annualFuelCost = 1300;
  } else if (inputs.vehicleType === 'Luxury') {
    annualDepreciationRate = 0.20;
    annualMaintenanceCost = 1600;
    annualFuelCost = 1800;
    annualInsuranceCost = 2500;
  } else if (inputs.vehicleType === 'Hybrid') {
    annualDepreciationRate = 0.13;
    annualFuelCost = 700;
    annualMaintenanceCost = 750;
  }

  const ownershipBreakdown: OwnershipCostEstimate[] = [];
  let currentCarVal = carPrice;
  let totalOwnershipCostSum = 0;

  for (let yr = 1; yr <= 5; yr++) {
    const depreciationVal = currentCarVal * annualDepreciationRate;
    currentCarVal -= depreciationVal;

    // Monthly payments made during year yr
    let loanPaymentsYr = 0;
    const startM = (yr - 1) * 12 + 1;
    const endM = yr * 12;
    
    activeSchedule.forEach(row => {
      if (row.paymentNumber >= startM && row.paymentNumber <= endM) {
        loanPaymentsYr += row.nominalCost;
      }
    });

    // Add mild inflation to annual running costs
    const factor = Math.pow(1.025, yr - 1);
    const yrFuel = annualFuelCost * factor;
    const yrIns = annualInsuranceCost * factor;
    const yrMaint = annualMaintenanceCost * factor;
    const yrTotal = depreciationVal + yrFuel + yrIns + yrMaint + loanPaymentsYr;

    ownershipBreakdown.push({
      year: yr,
      depreciation: Math.round(depreciationVal),
      fuelOrCharging: Math.round(yrFuel),
      insurance: Math.round(yrIns),
      maintenance: Math.round(yrMaint),
      loanPayments: Math.round(loanPaymentsYr),
      total: Math.round(yrTotal),
    });

    totalOwnershipCostSum += yrTotal;
  }

  return {
    loanAmount: rawPrincipal,
    financedAmount,
    monthlyPayment: standardMonthlyPayment,
    biweeklyPayment,
    weeklyPayment,
    totalInterest: activeTotalInterest,
    totalPayment: totalPaymentsActive,
    aprEstimate,
    principalPaid: financedAmount,
    downPaymentPaid: downPayment,
    netTradeInCredit: tradeInCredit,
    tradeInLoanBalancePaid: tradeInBalance,
    totalTaxesPaid,
    totalFeesPaid,
    totalAddonsPaid,
    totalVehicleCost,
    totalCashNeededUpfront: upfrontCashNeeded,
    interestSaved,
    timeSavedMonths,
    payoffDate: finalPayoffDate,
    loanProgressPercent: financedAmount > 0 ? ((financedAmount - activeBalance) / financedAmount) * 100 : 0,
    maxRecommendedLoan,
    maxRecommendedMonthlyBudget,
    dtiRatioPercent,
    affordabilityStatus,
    affordabilityScore,
    schedule: activeSchedule,
    fiveYearOwnershipCost: Math.round(totalOwnershipCostSum),
    ownershipBreakdown,
  };
}
