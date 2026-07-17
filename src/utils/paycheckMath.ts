export interface CustomDeduction {
  id: string;
  label: string;
  type: 'fixed' | 'percent';
  value: number; // raw value (e.g. 50 for $50, 5 for 5%)
  isPreTax: boolean;
}

export interface PaycheckInputs {
  earningMethod: 'hourly' | 'salary' | 'daily' | 'weekly' | 'monthly' | 'annual' | 'commission' | 'freelance';
  
  // Required fields depending on method
  hourlyRate: string;
  hoursWorked: string;
  baseSalary: string;
  dailyRate: string;
  daysWorked: string;
  weeklyRate: string;
  monthlyRate: string;
  annualSalary: string;
  commissionRate: string;
  totalSales: string;
  grossCommission: string;
  projectRate: string;

  // Pay Frequency
  payFrequency: 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'quarterly' | 'yearly';

  // Optional earnings / allowances
  overtimeHours: string;
  overtimeMultiplier: string;
  doubleOvertimeHours: string;
  doubleOvertimeMultiplier: string;
  tripleOvertimeHours: string;
  tripleOvertimeMultiplier: string;
  customOvertimeHours: string;
  customOvertimeMultiplier: string;

  bonus: string;
  commission: string;
  tips: string;
  holidayPay: string;
  nightShiftAllowance: string;
  weekendAllowance: string;
  travelAllowance: string;
  mealAllowance: string;
  housingAllowance: string;
  medicalAllowance: string;
  educationAllowance: string;
  performanceIncentive: string;
  stockCompensation: string;
  otherEarnings: string;

  // Custom deductions
  deductions: CustomDeduction[];

  // Tax Rate
  estimatedTaxRate: string;

  // Optional Work Schedule (for conversions)
  hoursPerDay: string;
  daysPerWeek: string;
  weeksPerYear: string;
  workDaysPerMonth: string;
}

export interface PaycheckResults {
  basePay: number;
  totalOvertimeEarnings: number;
  bonusEarnings: number;
  commissionEarnings: number;
  totalBenefitsAndAllowances: number;
  totalEarnings: number; // Gross Pay (same as total earnings)
  
  preTaxDeductions: number;
  taxableIncome: number;
  estimatedTaxes: number;
  postTaxDeductions: number;
  totalDeductions: number;
  
  netPay: number;
  
  // Effective Rates
  effectiveHourlyRate: number;
  effectiveDailyRate: number;
  effectiveWeeklyPay: number;
  effectiveMonthlyPay: number;
  effectiveAnnualSalary: number;

  // Breakdown tables list
  earningsRows: { label: string; amount: number; category: string }[];
  deductionsRows: { label: string; amount: number; isPreTax: boolean; category: string }[];

  // Converted frequencies
  frequencyConversions: {
    frequency: string;
    grossPay: number;
    netPay: number;
    taxes: number;
    deductions: number;
  }[];
}

// Convert paycheck to annual factor
export function getPayFrequencyMultiplier(
  frequency: string,
  schedule: {
    hoursPerDay: number;
    daysPerWeek: number;
    weeksPerYear: number;
    workDaysPerMonth: number;
  }
): number {
  switch (frequency) {
    case 'hourly':
      return schedule.hoursPerDay * schedule.daysPerWeek * schedule.weeksPerYear; // e.g. 2080
    case 'daily':
      return schedule.daysPerWeek * schedule.weeksPerYear; // e.g. 260
    case 'weekly':
      return schedule.weeksPerYear; // 52
    case 'biweekly':
      return schedule.weeksPerYear / 2; // 26
    case 'semimonthly':
      return 24;
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'yearly':
      return 1;
    default:
      return 12;
  }
}

export function computePaycheck(inputs: PaycheckInputs): PaycheckResults {
  // Resolve work schedule with defaults if not specified
  const hoursPerDay = Number(inputs.hoursPerDay) || 8;
  const daysPerWeek = Number(inputs.daysPerWeek) || 5;
  const weeksPerYear = Number(inputs.weeksPerYear) || 52;
  const workDaysPerMonth = Number(inputs.workDaysPerMonth) || 21.67;

  const schedule = { hoursPerDay, daysPerWeek, weeksPerYear, workDaysPerMonth };

  // Calculate Base Pay depending on the chosen method
  let basePay = 0;
  const method = inputs.earningMethod;

  if (method === 'hourly') {
    const rate = Number(inputs.hourlyRate) || 0;
    const hours = Number(inputs.hoursWorked) || 0;
    basePay = rate * hours;
  } else if (method === 'salary') {
    basePay = Number(inputs.baseSalary) || 0;
  } else if (method === 'daily') {
    const rate = Number(inputs.dailyRate) || 0;
    const days = Number(inputs.daysWorked) || 0;
    basePay = rate * days;
  } else if (method === 'weekly') {
    basePay = Number(inputs.weeklyRate) || 0;
  } else if (method === 'monthly') {
    basePay = Number(inputs.monthlyRate) || 0;
  } else if (method === 'annual') {
    const annualVal = Number(inputs.annualSalary) || 0;
    const mult = getPayFrequencyMultiplier(inputs.payFrequency, schedule);
    basePay = annualVal / mult;
  } else if (method === 'commission') {
    const sales = Number(inputs.totalSales) || 0;
    const rate = Number(inputs.commissionRate) || 0;
    const grossComm = Number(inputs.grossCommission) || 0;
    basePay = grossComm + (sales * (rate / 100));
  } else if (method === 'freelance') {
    basePay = Number(inputs.projectRate) || 0;
  }

  // Calculate Overtime Pay (only active/relevant or if hourly parameters are entered)
  // Let's use either the custom hourly rate or derive an hourly rate for base salary
  let derivedHourlyRate = 0;
  if (method === 'hourly') {
    derivedHourlyRate = Number(inputs.hourlyRate) || 0;
  } else {
    // Derive hourly rate from base pay and frequency
    const mult = getPayFrequencyMultiplier(inputs.payFrequency, schedule);
    const annualBase = basePay * mult;
    const annualHours = hoursPerDay * daysPerWeek * weeksPerYear;
    derivedHourlyRate = annualHours > 0 ? annualBase / annualHours : 0;
  }

  let totalOvertimeEarnings = 0;
  const otH = Number(inputs.overtimeHours) || 0;
  const otM = Number(inputs.overtimeMultiplier) || 1.5;
  totalOvertimeEarnings += otH * derivedHourlyRate * otM;

  const dotH = Number(inputs.doubleOvertimeHours) || 0;
  const dotM = Number(inputs.doubleOvertimeMultiplier) || 2.0;
  totalOvertimeEarnings += dotH * derivedHourlyRate * dotM;

  const totH = Number(inputs.tripleOvertimeHours) || 0;
  const totM = Number(inputs.tripleOvertimeMultiplier) || 3.0;
  totalOvertimeEarnings += totH * derivedHourlyRate * totM;

  const cotH = Number(inputs.customOvertimeHours) || 0;
  const cotM = Number(inputs.customOvertimeMultiplier) || 1.0;
  totalOvertimeEarnings += cotH * derivedHourlyRate * cotM;

  // Optional Earnings
  const bonusEarnings = Number(inputs.bonus) || 0;
  const commissionEarnings = Number(inputs.commission) || 0;
  const tipsEarnings = Number(inputs.tips) || 0;
  const holidayPay = Number(inputs.holidayPay) || 0;

  // Allowances & Incentives
  const nightShift = Number(inputs.nightShiftAllowance) || 0;
  const weekendAll = Number(inputs.weekendAllowance) || 0;
  const travelAll = Number(inputs.travelAllowance) || 0;
  const mealAll = Number(inputs.mealAllowance) || 0;
  const housingAll = Number(inputs.housingAllowance) || 0;
  const medicalAll = Number(inputs.medicalAllowance) || 0;
  const eduAll = Number(inputs.educationAllowance) || 0;
  const perfInc = Number(inputs.performanceIncentive) || 0;
  const stockComp = Number(inputs.stockCompensation) || 0;
  const otherEarn = Number(inputs.otherEarnings) || 0;

  const totalBenefitsAndAllowances = 
    nightShift + weekendAll + travelAll + mealAll + housingAll + medicalAll + eduAll + perfInc + stockComp + otherEarn;

  // Total Earnings / Gross Pay
  const totalEarnings = basePay + totalOvertimeEarnings + bonusEarnings + commissionEarnings + tipsEarnings + holidayPay + totalBenefitsAndAllowances;

  // Earnings Breakdown Rows
  const earningsRows: { label: string; amount: number; category: string }[] = [];
  if (basePay > 0) earningsRows.push({ label: 'Base Pay', amount: basePay, category: 'Base' });
  if (totalOvertimeEarnings > 0) earningsRows.push({ label: 'Overtime Pay', amount: totalOvertimeEarnings, category: 'Overtime' });
  if (bonusEarnings > 0) earningsRows.push({ label: 'Bonus', amount: bonusEarnings, category: 'Additions' });
  if (commissionEarnings > 0) earningsRows.push({ label: 'Commission', amount: commissionEarnings, category: 'Additions' });
  if (tipsEarnings > 0) earningsRows.push({ label: 'Tips / Gratuities', amount: tipsEarnings, category: 'Additions' });
  if (holidayPay > 0) earningsRows.push({ label: 'Holiday Pay', amount: holidayPay, category: 'Additions' });
  if (nightShift > 0) earningsRows.push({ label: 'Night Shift Allowance', amount: nightShift, category: 'Allowances' });
  if (weekendAll > 0) earningsRows.push({ label: 'Weekend Allowance', amount: weekendAll, category: 'Allowances' });
  if (travelAll > 0) earningsRows.push({ label: 'Travel Allowance', amount: travelAll, category: 'Allowances' });
  if (mealAll > 0) earningsRows.push({ label: 'Meal Allowance', amount: mealAll, category: 'Allowances' });
  if (housingAll > 0) earningsRows.push({ label: 'Housing Allowance', amount: housingAll, category: 'Allowances' });
  if (medicalAll > 0) earningsRows.push({ label: 'Medical Allowance', amount: medicalAll, category: 'Allowances' });
  if (eduAll > 0) earningsRows.push({ label: 'Education Allowance', amount: eduAll, category: 'Allowances' });
  if (perfInc > 0) earningsRows.push({ label: 'Performance Incentive', amount: perfInc, category: 'Allowances' });
  if (stockComp > 0) earningsRows.push({ label: 'Stock Compensation', amount: stockComp, category: 'Allowances' });
  if (otherEarn > 0) earningsRows.push({ label: 'Other Earnings', amount: otherEarn, category: 'Allowances' });

  // Calculate Deductions
  let preTaxDeductions = 0;
  let postTaxDeductions = 0;

  const deductionsRows: { label: string; amount: number; isPreTax: boolean; category: string }[] = [];

  inputs.deductions.forEach(ded => {
    let amt = 0;
    if (ded.type === 'fixed') {
      amt = ded.value;
    } else {
      // percentage of Gross Pay / Total Earnings
      amt = totalEarnings * (ded.value / 100);
    }

    if (amt > 0) {
      if (ded.isPreTax) {
        preTaxDeductions += amt;
      } else {
        postTaxDeductions += amt;
      }
      deductionsRows.push({
        label: ded.label || 'Custom Deduction',
        amount: amt,
        isPreTax: ded.isPreTax,
        category: ded.isPreTax ? 'Pre-Tax' : 'Post-Tax'
      });
    }
  });

  // Calculate Taxable Income
  const taxableIncome = Math.max(0, totalEarnings - preTaxDeductions);

  // Estimated income tax
  const taxRate = Number(inputs.estimatedTaxRate) || 0;
  const estimatedTaxes = taxableIncome * (taxRate / 100);

  if (estimatedTaxes > 0) {
    deductionsRows.push({
      label: `Estimated Income Tax (${taxRate}%)`,
      amount: estimatedTaxes,
      isPreTax: false,
      category: 'Taxes'
    });
  }

  // Combined Deductions
  const totalDeductions = preTaxDeductions + postTaxDeductions + estimatedTaxes;

  // Net Pay (Take Home Pay)
  const netPay = Math.max(0, totalEarnings - totalDeductions);

  // Frequencies cross-conversions
  // To convert this specific paycheck into other frequencies, let's first get its annualized value
  const paycheckMultiplier = getPayFrequencyMultiplier(inputs.payFrequency, schedule);
  
  // Regular annualized total
  const annualGross = totalEarnings * paycheckMultiplier;
  const annualNet = netPay * paycheckMultiplier;
  const annualTaxes = estimatedTaxes * paycheckMultiplier;
  const annualDeductionsCount = totalDeductions * paycheckMultiplier;

  const frequenciesList = [
    { name: 'Hourly', key: 'hourly' },
    { name: 'Daily', key: 'daily' },
    { name: 'Weekly', key: 'weekly' },
    { name: 'Biweekly', key: 'biweekly' },
    { name: 'Semi-Monthly', key: 'semimonthly' },
    { name: 'Monthly', key: 'monthly' },
    { name: 'Quarterly', key: 'quarterly' },
    { name: 'Yearly', key: 'yearly' },
  ];

  const frequencyConversions = frequenciesList.map(freq => {
    const m = getPayFrequencyMultiplier(freq.key, schedule);
    return {
      frequency: freq.name,
      grossPay: annualGross / m,
      netPay: annualNet / m,
      taxes: annualTaxes / m,
      deductions: (annualDeductionsCount - annualTaxes) / m
    };
  });

  // Extract effective rates
  const annualHrs = getPayFrequencyMultiplier('hourly', schedule);
  const annualDays = getPayFrequencyMultiplier('daily', schedule);
  
  const effectiveHourlyRate = annualHrs > 0 ? annualNet / annualHrs : 0;
  const effectiveDailyRate = annualDays > 0 ? annualNet / annualDays : 0;
  const effectiveWeeklyPay = annualNet / getPayFrequencyMultiplier('weekly', schedule);
  const effectiveMonthlyPay = annualNet / getPayFrequencyMultiplier('monthly', schedule);
  const effectiveAnnualSalary = annualNet;

  return {
    basePay,
    totalOvertimeEarnings,
    bonusEarnings,
    commissionEarnings,
    totalBenefitsAndAllowances,
    totalEarnings,
    preTaxDeductions,
    taxableIncome,
    estimatedTaxes,
    postTaxDeductions,
    totalDeductions,
    netPay,
    effectiveHourlyRate,
    effectiveDailyRate,
    effectiveWeeklyPay,
    effectiveMonthlyPay,
    effectiveAnnualSalary,
    earningsRows,
    deductionsRows,
    frequencyConversions
  };
}
