export interface ClosingCostItem {
  id: string;
  label: string;
  value: number; // raw value
  type: 'fixed' | 'percent'; // percent of home price or loan amount
}

export interface ExtraPayment {
  id: string;
  type: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  amount: number;
  startMonth: number; // 1-indexed payment number
}

export interface RatePeriod {
  id: string;
  startYear: number | '';
  endYear: number | '';
  rate: number | '';
}

export interface MortgageInputs {
  homePrice: number | '';
  interestRate: number | '';
  loanTerm: number | ''; // in years
  
  // Down Payment
  downPayment: number | '';
  downPaymentPercent: number | '';
  downPaymentType: 'amount' | 'percent';

  // Escrow & Insurances
  propertyTaxRate: number | ''; // e.g. 1.2%
  propertyTaxAmount: number | ''; // annual
  propertyTaxType: 'rate' | 'amount';
  homeInsurance: number | ''; // annual
  hoaFee: number | ''; // monthly
  floodInsurance: number | ''; // annual
  otherEscrow: number | ''; // monthly

  // PMI
  pmiRate: number | ''; // e.g. 0.5% annual
  pmiAmount: number | ''; // monthly
  pmiType: 'rate' | 'amount';

  // Extra payments
  extraPayments: ExtraPayment[];

  // Variable rate schedule
  rateType: 'fixed' | 'arm';
  ratePeriods: RatePeriod[];

  // Appreciation & Inflation
  appreciationRate: number | ''; // annual
  inflationRate: number | ''; // annual

  // Home details
  propertyType: string;

  // Other upfront fees / Closing costs
  closingCosts: ClosingCostItem[];
  
  // Individual standard closing fees (optional)
  originationFee: number | '';
  originationFeeType: 'fixed' | 'percent';
  discountPoints: number | '';
  lenderCredits: number | '';
  escrowDeposit: number | '';
  inspectionCost: number | '';
  appraisalFee: number | '';
  attorneyFee: number | '';
  recordingFee: number | '';
  transferTax: number | '';
  titleInsurance: number | '';
  homeWarranty: number | '';
  renovationCost: number | '';
  movingCost: number | '';

  // Affordability
  annualIncome: number | '';
  monthlyIncome: number | '';
  otherMonthlyDebts: number | '';

  // Refinance comparison inputs
  refiInterestRate: number | '';
  refiTerm: number | ''; // years
  refiClosingCosts: number | '';
}

export interface AmortizationRow {
  paymentNumber: number;
  date: string;
  beginningBalance: number;
  principal: number;
  interest: number;
  escrow: number;
  pmi: number;
  extraPayment: number;
  endingBalance: number;
  runningInterest: number;
  runningPrincipal: number;
  rate: number;
}

export interface MortgageResults {
  loanAmount: number;
  baseMonthlyPI: number;
  monthlyEscrow: number;
  monthlyPMI: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalPayments: number;
  totalEscrow: number;
  totalPMI: number;
  totalClosingCosts: number;
  interestSaved: number;
  timeSavedMonths: number;
  payoffDate: string;
  estimatedPMIEndDate: string | null;
  pmiPaidMonths: number;
  ltvProgress: number; // initial LTV
  
  // Charts & timelines
  amortization: AmortizationRow[];
  homeValueTimeline: { month: number; year: number; homeValue: number; balance: number; equity: number }[];
  
  // Affordability
  affordability: {
    housingRatio: number;
    dtiRatio: number;
    status: 'Excellent' | 'Good' | 'Stretched' | 'Unaffordable';
    suggestedMaxMortgage: number;
    suggestedMonthlyPaymentRange: [number, number];
  } | null;

  // Refinance comparison
  refiComparison: {
    monthlyPayment: number;
    monthlySavings: number;
    totalInterest: number;
    interestSavings: number;
    payoffTerm: number;
    timeSavedMonths: number;
    totalSavings: number;
    netCostDifference: number; // Refi total payments + closing costs vs Remaining original payments
    breakEvenMonths: number;
  } | null;
}

// Compute helper
export function computeMortgage(inputs: MortgageInputs): MortgageResults | null {
  const homePrice = Number(inputs.homePrice) || 0;
  const initialRate = Number(inputs.interestRate) || 0;
  const termYears = Number(inputs.loanTerm) || 0;

  if (homePrice <= 0 || termYears <= 0) {
    return null;
  }

  // Calculate down payment and loan amount
  let downPayment = 0;
  if (inputs.downPaymentType === 'percent') {
    const percent = Number(inputs.downPaymentPercent) || 0;
    downPayment = (homePrice * percent) / 100;
  } else {
    downPayment = Number(inputs.downPayment) || 0;
  }

  if (downPayment > homePrice) {
    downPayment = homePrice;
  }

  const loanAmount = Math.max(0, homePrice - downPayment);
  const initialLtv = homePrice > 0 ? (loanAmount / homePrice) * 100 : 0;

  // Upfront Closing Costs
  let totalClosingCosts = 0;
  inputs.closingCosts.forEach(item => {
    if (item.type === 'percent') {
      totalClosingCosts += (loanAmount * item.value) / 100;
    } else {
      totalClosingCosts += item.value;
    }
  });

  // Individual standard closing fees
  const origFee = Number(inputs.originationFee) || 0;
  totalClosingCosts += inputs.originationFeeType === 'percent' ? (loanAmount * origFee) / 100 : origFee;
  
  totalClosingCosts += (Number(inputs.discountPoints) || 0) * loanAmount / 100;
  totalClosingCosts -= Number(inputs.lenderCredits) || 0;
  totalClosingCosts += Number(inputs.escrowDeposit) || 0;
  totalClosingCosts += Number(inputs.inspectionCost) || 0;
  totalClosingCosts += Number(inputs.appraisalFee) || 0;
  totalClosingCosts += Number(inputs.attorneyFee) || 0;
  totalClosingCosts += Number(inputs.recordingFee) || 0;
  totalClosingCosts += Number(inputs.transferTax) || 0;
  totalClosingCosts += Number(inputs.titleInsurance) || 0;
  totalClosingCosts += Number(inputs.homeWarranty) || 0;
  totalClosingCosts += Number(inputs.renovationCost) || 0;
  totalClosingCosts += Number(inputs.movingCost) || 0;

  totalClosingCosts = Math.max(0, totalClosingCosts);

  // Escrow Calculations (Monthly)
  let monthlyTax = 0;
  if (inputs.propertyTaxType === 'rate') {
    const taxRate = Number(inputs.propertyTaxRate) || 0;
    monthlyTax = (homePrice * (taxRate / 100)) / 12;
  } else {
    monthlyTax = (Number(inputs.propertyTaxAmount) || 0) / 12;
  }

  const monthlyIns = (Number(inputs.homeInsurance) || 0) / 12;
  const monthlyHoa = Number(inputs.hoaFee) || 0;
  const monthlyFlood = (Number(inputs.floodInsurance) || 0) / 12;
  const monthlyOtherEscrow = Number(inputs.otherEscrow) || 0;

  const monthlyEscrow = monthlyTax + monthlyIns + monthlyHoa + monthlyFlood + monthlyOtherEscrow;

  // PMI Calculations
  let monthlyPMIInitial = 0;
  if (inputs.pmiType === 'rate') {
    const pmiRate = Number(inputs.pmiRate) || 0;
    monthlyPMIInitial = (loanAmount * (pmiRate / 100)) / 12;
  } else {
    monthlyPMIInitial = Number(inputs.pmiAmount) || 0;
  }

  const hasPMI = initialLtv > 80 && (Number(inputs.pmiRate) > 0 || Number(inputs.pmiAmount) > 0);

  // Amortization loop
  const totalMonths = termYears * 12;
  const amortization: AmortizationRow[] = [];
  
  let balance = loanAmount;
  let runningInterest = 0;
  let runningPrincipal = 0;
  let totalPMIPaid = 0;
  let pmiPaidMonthsCount = 0;
  let pmiEndedMonth: number | null = null;

  // Let's create a date helper
  const startDate = new Date();

  // Create monthly payments array
  for (let m = 1; m <= totalMonths && balance > 0.01; m++) {
    // 1. Resolve Active Interest Rate for this month
    let activeRate = initialRate;
    if (inputs.rateType === 'arm') {
      const year = Math.ceil(m / 12);
      const matchingPeriod = (inputs.ratePeriods || []).find(p => {
        if (p.startYear === '' || p.endYear === '' || p.rate === '') return false;
        const start = Number(p.startYear);
        const end = Number(p.endYear);
        if (isNaN(start) || isNaN(end) || start > end) return false;
        return year >= start && year <= end;
      });
      if (matchingPeriod && matchingPeriod.rate !== '') {
        activeRate = Number(matchingPeriod.rate);
      }
    }

    const monthlyRate = (activeRate / 100) / 12;
    const remainingMonths = totalMonths - m + 1;

    // Recalculate standard monthly principal & interest if interest rate varies or at start
    let basePI = 0;
    if (monthlyRate === 0) {
      basePI = balance / remainingMonths;
    } else {
      basePI = balance * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    }

    // Compute interest and principal
    const interestCharge = balance * monthlyRate;
    let principalRepayment = Math.min(balance, basePI - interestCharge);
    if (principalRepayment < 0) principalRepayment = 0;

    // Resolve extra payments for this month
    let extraPaid = 0;
    inputs.extraPayments.forEach(ep => {
      if (ep.amount > 0) {
        if (ep.type === 'one-time' && ep.startMonth === m) {
          extraPaid += ep.amount;
        } else if (ep.type === 'monthly' && m >= ep.startMonth) {
          extraPaid += ep.amount;
        } else if (ep.type === 'quarterly' && m >= ep.startMonth && (m - ep.startMonth) % 3 === 0) {
          extraPaid += ep.amount;
        } else if (ep.type === 'yearly' && m >= ep.startMonth && (m - ep.startMonth) % 12 === 0) {
          extraPaid += ep.amount;
        }
      }
    });

    // Check if extra payment is larger than remaining balance
    const totalReduction = principalRepayment + extraPaid;
    if (totalReduction > balance) {
      extraPaid = Math.max(0, balance - principalRepayment);
    }

    // PMI removal rule (LTV <= 80% based on the ORIGINAL purchase price)
    // PMI is cancelled when the outstanding balance is <= 80% of original Home Price
    let currentPMI = 0;
    if (hasPMI) {
      const currentLtv = (balance / homePrice) * 100;
      if (currentLtv > 80) {
        currentPMI = monthlyPMIInitial;
        totalPMIPaid += currentPMI;
        pmiPaidMonthsCount++;
      } else if (pmiEndedMonth === null) {
        pmiEndedMonth = m - 1;
      }
    }

    const beginningBalance = balance;
    balance = Math.max(0, balance - principalRepayment - extraPaid);

    runningInterest += interestCharge;
    runningPrincipal += (principalRepayment + extraPaid);

    // Compute month's date
    const payDate = new Date(startDate);
    payDate.setMonth(startDate.getMonth() + m);
    const dateStr = payDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    amortization.push({
      paymentNumber: m,
      date: dateStr,
      beginningBalance,
      principal: principalRepayment,
      interest: interestCharge,
      escrow: monthlyEscrow,
      pmi: currentPMI,
      extraPayment: extraPaid,
      endingBalance: balance,
      runningInterest,
      runningPrincipal,
      rate: activeRate
    });
  }

  // Final aggregate metrics
  const finalMonthsCount = amortization.length;
  const totalInterest = runningInterest;
  const totalPMI = totalPMIPaid;
  const totalEscrow = monthlyEscrow * finalMonthsCount;
  const totalPayments = runningPrincipal + totalInterest + totalEscrow + totalPMI;

  // Payoff Date
  const payoffDateObj = new Date(startDate);
  payoffDateObj.setMonth(startDate.getMonth() + finalMonthsCount);
  const payoffDate = payoffDateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Estimated PMI End Date
  let estimatedPMIEndDate = null;
  if (hasPMI) {
    const pmiMonths = pmiEndedMonth !== null ? pmiEndedMonth : finalMonthsCount;
    const pmiEndObj = new Date(startDate);
    pmiEndObj.setMonth(startDate.getMonth() + pmiMonths);
    estimatedPMIEndDate = pmiEndObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // Calculate baseline timeline without extra payments to determine saved interest & time
  let baselineMonths = totalMonths;
  let baselineTotalInterest = 0;
  let baseBal = loanAmount;
  for (let m = 1; m <= totalMonths && baseBal > 0.01; m++) {
    let activeRate = initialRate;
    if (inputs.rateType === 'arm') {
      const year = Math.ceil(m / 12);
      const matchingPeriod = (inputs.ratePeriods || []).find(p => {
        if (p.startYear === '' || p.endYear === '' || p.rate === '') return false;
        const start = Number(p.startYear);
        const end = Number(p.endYear);
        if (isNaN(start) || isNaN(end) || start > end) return false;
        return year >= start && year <= end;
      });
      if (matchingPeriod && matchingPeriod.rate !== '') {
        activeRate = Number(matchingPeriod.rate);
      }
    }
    const monthlyRate = (activeRate / 100) / 12;
    const remainingMonths = totalMonths - m + 1;
    let basePI = 0;
    if (monthlyRate === 0) {
      basePI = baseBal / remainingMonths;
    } else {
      basePI = baseBal * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    }
    const interestCharge = baseBal * monthlyRate;
    const principalRepayment = Math.min(baseBal, basePI - interestCharge);
    baselineTotalInterest += interestCharge;
    baseBal = Math.max(0, baseBal - principalRepayment);
    if (baseBal <= 0) {
      baselineMonths = m;
      break;
    }
  }

  const timeSavedMonths = Math.max(0, baselineMonths - finalMonthsCount);
  const interestSaved = Math.max(0, baselineTotalInterest - totalInterest);

  // Home Appreciation Timeline
  const homeValueTimeline: { month: number; year: number; homeValue: number; balance: number; equity: number }[] = [];
  const appreciationRate = Number(inputs.appreciationRate) || 0;
  
  // Storing snapshots at year end + some steps
  for (let year = 0; year <= termYears; year++) {
    const m = year * 12;
    const compoundValue = homePrice * Math.pow(1 + (appreciationRate / 100), year);
    
    // Find matching row in amortization
    let currentBalance = 0;
    if (year === 0) {
      currentBalance = loanAmount;
    } else {
      const row = amortization.find(r => r.paymentNumber === m) || amortization[amortization.length - 1];
      currentBalance = row ? row.endingBalance : 0;
    }

    if (year > 0 && m > amortization.length) {
      // Loan already paid off
      currentBalance = 0;
    }

    homeValueTimeline.push({
      month: m,
      year,
      homeValue: compoundValue,
      balance: currentBalance,
      equity: Math.max(0, compoundValue - currentBalance)
    });
  }

  // Affordability Metrics
  let affordability = null;
  const annualIncome = Number(inputs.annualIncome) || 0;
  const monthlyIncome = Number(inputs.monthlyIncome) || (annualIncome / 12) || 0;
  const otherMonthlyDebts = Number(inputs.otherMonthlyDebts) || 0;

  if (monthlyIncome > 0) {
    // Base monthly PI + Escrow + PMI
    const activePMI = hasPMI ? monthlyPMIInitial : 0;
    const basePIInitial = loanAmount * ((initialRate / 100 / 12) * Math.pow(1 + (initialRate / 100 / 12), totalMonths)) / (Math.pow(1 + (initialRate / 100 / 12), totalMonths) - 1) || 0;
    const currentTotalHousing = basePIInitial + monthlyEscrow + activePMI;

    const housingRatio = (currentTotalHousing / monthlyIncome) * 100;
    const dtiRatio = ((currentTotalHousing + otherMonthlyDebts) / monthlyIncome) * 100;

    let status: 'Excellent' | 'Good' | 'Stretched' | 'Unaffordable' = 'Excellent';
    if (dtiRatio <= 36 && housingRatio <= 28) {
      status = 'Excellent';
    } else if (dtiRatio <= 43 && housingRatio <= 33) {
      status = 'Good';
    } else if (dtiRatio <= 50 && housingRatio <= 40) {
      status = 'Stretched';
    } else {
      status = 'Unaffordable';
    }

    // Suggested max mortgage (Based on standard 36% DTI)
    const availableForHousing = Math.max(0, (monthlyIncome * 0.36) - otherMonthlyDebts);
    const maxHousingPayment = Math.min(monthlyIncome * 0.28, availableForHousing);
    
    // Work backwards to find loan amount
    const r = (initialRate / 100) / 12;
    let suggestedMaxMortgage = 0;
    const estimateMonthlyPI = Math.max(0, maxHousingPayment - monthlyEscrow - activePMI);
    if (r === 0) {
      suggestedMaxMortgage = estimateMonthlyPI * totalMonths;
    } else {
      suggestedMaxMortgage = estimateMonthlyPI * (Math.pow(1 + r, totalMonths) - 1) / (r * Math.pow(1 + r, totalMonths));
    }
    suggestedMaxMortgage = Math.max(0, suggestedMaxMortgage);

    affordability = {
      housingRatio,
      dtiRatio,
      status,
      suggestedMaxMortgage,
      suggestedMonthlyPaymentRange: [maxHousingPayment * 0.8, maxHousingPayment] as [number, number]
    };
  }

  // Refinance comparison calculation
  let refiComparison = null;
  const refiRate = Number(inputs.refiInterestRate) || 0;
  const refiTermYears = Number(inputs.refiTerm) || 0;
  const refiCosts = Number(inputs.refiClosingCosts) || 0;

  if (refiRate > 0 && refiTermYears > 0) {
    const rRefi = (refiRate / 100) / 12;
    const nRefi = refiTermYears * 12;
    
    // Refinance amount is the outstanding balance of the current loan, plus any rolled closing costs (or paid out of pocket)
    // For comparison, let's assume refinancing the *current loan balance*
    const refiLoanAmount = balance > 0 ? balance : loanAmount; 
    
    let refiMonthlyPI = 0;
    if (rRefi === 0) {
      refiMonthlyPI = refiLoanAmount / nRefi;
    } else {
      refiMonthlyPI = refiLoanAmount * (rRefi * Math.pow(1 + rRefi, nRefi)) / (Math.pow(1 + rRefi, nRefi) - 1);
    }

    const refiTotalInterest = (refiMonthlyPI * nRefi) - refiLoanAmount;
    
    // Remaining original loan metrics
    const remainingOriginalMonths = amortization.length; // months left to pay off current loan
    const remainingOriginalPI = amortization.reduce((sum, row) => sum + row.principal + row.interest, 0);
    const remainingOriginalInterest = amortization.reduce((sum, row) => sum + row.interest, 0);

    const refiTotalPayments = refiMonthlyPI * nRefi;
    const monthlySavings = amortization[0] ? (amortization[0].principal + amortization[0].interest) - refiMonthlyPI : 0;
    
    const interestSavings = remainingOriginalInterest - refiTotalInterest;
    const refiTimeSavedMonths = remainingOriginalMonths - nRefi;
    
    // Net Cost Difference = Total refi payments + refi costs - remaining original payments
    const netCostDifference = (refiTotalPayments + refiCosts) - remainingOriginalPI;
    const totalSavings = -netCostDifference;

    // Simple breakeven: refi costs / monthly savings
    const breakEvenMonths = monthlySavings > 0 ? refiCosts / monthlySavings : 0;

    refiComparison = {
      monthlyPayment: refiMonthlyPI,
      monthlySavings,
      totalInterest: refiTotalInterest,
      interestSavings,
      payoffTerm: refiTermYears,
      timeSavedMonths: refiTimeSavedMonths,
      totalSavings,
      netCostDifference,
      breakEvenMonths
    };
  }

  // Active payments calculation details
  const activePMI = hasPMI ? monthlyPMIInitial : 0;
  const activePI = loanAmount * ((initialRate / 100 / 12) * Math.pow(1 + (initialRate / 100 / 12), totalMonths)) / (Math.pow(1 + (initialRate / 100 / 12), totalMonths) - 1) || 0;

  return {
    loanAmount,
    baseMonthlyPI: activePI,
    monthlyEscrow,
    monthlyPMI: activePMI,
    totalMonthlyPayment: activePI + monthlyEscrow + activePMI,
    totalInterest,
    totalPayments,
    totalEscrow,
    totalPMI,
    totalClosingCosts,
    interestSaved,
    timeSavedMonths,
    payoffDate,
    estimatedPMIEndDate,
    pmiPaidMonths: pmiPaidMonthsCount,
    ltvProgress: initialLtv,
    amortization,
    homeValueTimeline,
    affordability,
    refiComparison
  };
}
