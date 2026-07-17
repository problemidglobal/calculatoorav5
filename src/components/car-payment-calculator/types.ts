export interface CarPaymentInputs {
  // Financing Mode
  mode: 'standard' | 'trade-in' | 'lease-buy';

  // Currency
  currency: string;

  // Standard Inputs
  vehiclePrice: string;
  downPayment: string;
  interestRate: string;
  loanTerm: string; // in months

  // Trade-In Inputs
  tradeInValue: string;
  tradeInBalance: string; // optional

  // Lease vs Buy Inputs
  leasePayment: string;
  leaseTerm: string; // in months
  residualValue: string; // optional

  // Optional Dealer / Tax / Fee Inputs
  salesTax: string;
  registrationFee: string;
  titleFee: string;
  docFee: string;
  dealerFee: string;
  extendedWarranty: string;
  gapInsurance: string;
  manufacturerRebate: string;
  cashIncentive: string;
  optionalInsurance: string;
  maintenanceEstimate: string;
  negativeEquity: string;

  // Extra Payments Planner
  oneTimeExtra: string;
  oneTimeExtraMonth: string;
  monthlyExtra: string;
  annualExtra: string;

  // Total Ownership Cost Inputs
  insurancePerMonth: string;
  fuelPerMonth: string;
  maintenancePerMonth: string;
  parkingPerMonth: string;

  // Affordability Check Inputs
  monthlyIncome: string;
  monthlyDebt: string;
  targetBudget: string;
}

export interface AmortizationRow {
  paymentNumber: number;
  paymentAmount: number;
  principal: number;
  interest: number;
  extraPayment: number;
  remainingBalance: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
}

export interface YearAmortizationRow {
  yearNumber: number;
  paymentAmount: number;
  principal: number;
  interest: number;
  extraPayment: number;
  remainingBalance: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
}

export interface CalculationResults {
  monthlyPayment: number;
  totalLoanAmount: number;
  interestPaid: number;
  totalCostOfLoan: number;
  totalCostOfVehicle: number;
  amountFinanced: number;
  totalUpfrontCost: number;

  // Amortization schedules (original and updated with extra payments)
  schedule: AmortizationRow[];
  yearlySchedule: YearAmortizationRow[];

  // Extra payment schedule comparisons
  hasExtraPayments: boolean;
  extraSchedule: AmortizationRow[];
  extraYearlySchedule: YearAmortizationRow[];
  interestSaved: number;
  monthsSaved: number;
  payoffDate: string;
  originalPayoffDate: string;

  // Ownership Cost results
  ownershipMonthlyCost: number;
  ownershipAnnualCost: number;

  // Affordability results
  paymentToIncomeRatio: number;
  debtToIncomeRatio: number;
  affordabilityStatus: 'excellent' | 'good' | 'tight' | 'unaffordable' | 'neutral';

  // Step-by-Step explanation data
  stepByStep: {
    formula: string;
    substitution: string;
    steps: string[];
    finalAnswer: string;
  };

  // Lease vs Buy analysis
  leaseBuy?: {
    buyMonthly: number;
    leaseMonthly: number;
    buyTotalCost: number;
    leaseTotalCost: number;
    difference: number;
    verdict: string;
    breakEvenMonths: number;
  };
}
