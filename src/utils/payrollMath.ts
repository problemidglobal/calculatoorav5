export interface DeductionRow {
  id: string;
  name: string;
  type: 'fixed' | 'percent';
  value: number | '';
  taxTreatment: 'pre-tax' | 'post-tax';
}

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  employmentType: 'Hourly' | 'Salary' | 'Contract' | 'Freelancer' | 'Part-Time' | 'Full-Time';
  paySchedule: 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'semi-monthly' | 'monthly' | 'quarterly' | 'yearly';
  isCollapsed: boolean;
  
  // Earnings (Hourly specific)
  hourlyRate: number | '';
  hoursWorked: number | '';
  overtimeHours: number | '';
  overtimeMultiplier: number | '';
  doubleOvertimeHours: number | '';
  doubleOvertimeMultiplier: number | '';
  tripleOvertimeHours: number | '';
  tripleOvertimeMultiplier: number | '';

  // Earnings (Salary specific)
  baseSalary: number | ''; // per pay schedule
  
  // Additional Earnings (All types)
  commission: number | '';
  bonus: number | '';
  tips: number | '';
  holidayPay: number | '';
  nightShiftAllowance: number | '';
  weekendAllowance: number | '';
  travelAllowance: number | '';
  mealAllowance: number | '';
  housingAllowance: number | '';
  medicalAllowance: number | '';
  educationAllowance: number | '';
  stockCompensation: number | '';
  otherEarnings: number | '';

  // Deductions
  deductions: DeductionRow[];

  // Employer Costs
  employerTaxRate: number | ''; // %
  employerTaxFixed: number | ''; // $
  employerRetirementRate: number | ''; // %
  employerRetirementFixed: number | ''; // $
  employerInsurance: number | ''; // $
  workersComp: number | ''; // $
  trainingCost: number | ''; // $
  recruitmentCost: number | ''; // $
  equipmentCost: number | ''; // $
  uniformCost: number | ''; // $
  otherEmployerExpenses: number | ''; // $
}

export interface EmployeePayrollResults {
  regularGross: number;
  overtimeGross: number;
  additionalGross: number;
  totalGross: number;
  preTaxDeductions: number;
  postTaxDeductions: number;
  totalDeductions: number;
  netPay: number;
  employerCosts: {
    taxes: number;
    retirement: number;
    insurance: number;
    workersComp: number;
    training: number;
    recruitment: number;
    equipment: number;
    uniform: number;
    other: number;
    total: number;
  };
  totalExpense: number;
  averageHourlyRate: number;
  hasErrors: boolean;
  errorMessages: string[];
}

export interface PayrollSummary {
  totalEmployees: number;
  grossPayroll: number;
  totalDeductions: number;
  totalEmployerCosts: number;
  totalPayrollExpense: number;
  netPayroll: number;
  
  // Averages
  averageSalary: number; // monthly or annualized or current pay schedule gross
  averageHourlyRate: number;
  averageEmployerCost: number;
  averageNetPay: number;
  
  // Totals of specific categories
  totalBonuses: number;
  totalOvertime: number;
  totalCommissions: number;
  totalTaxes: number; // Employee deductions labeled tax + Employer Payroll Tax
  totalBenefits: number; // Health, retirement, dental deductions + Employer contributions

  highestSalary: number;
  lowestSalary: number;
}

// Compute payroll for a single employee
export function calculateEmployeePayroll(emp: Employee): EmployeePayrollResults {
  const errors: string[] = [];
  let hasErrors = false;

  const hr = emp.hourlyRate === '' ? 0 : Number(emp.hourlyRate);
  const hw = emp.hoursWorked === '' ? 0 : Number(emp.hoursWorked);
  const otHours = emp.overtimeHours === '' ? 0 : Number(emp.overtimeHours);
  const otMult = emp.overtimeMultiplier === '' ? 1.5 : Number(emp.overtimeMultiplier);
  const doubleOtHours = emp.doubleOvertimeHours === '' ? 0 : Number(emp.doubleOvertimeHours);
  const doubleOtMult = emp.doubleOvertimeMultiplier === '' ? 2.0 : Number(emp.doubleOvertimeMultiplier);
  const tripleOtHours = emp.tripleOvertimeHours === '' ? 0 : Number(emp.tripleOvertimeHours);
  const tripleOtMult = emp.tripleOvertimeMultiplier === '' ? 3.0 : Number(emp.tripleOvertimeMultiplier);

  const baseSalary = emp.baseSalary === '' ? 0 : Number(emp.baseSalary);

  // Validate values
  if (hr < 0) {
    errors.push('Hourly Rate cannot be negative.');
    hasErrors = true;
  }
  if (hw < 0 || otHours < 0 || doubleOtHours < 0 || tripleOtHours < 0) {
    errors.push('Hours worked cannot be negative.');
    hasErrors = true;
  }

  // Regular Gross
  let regularGross = 0;
  if (emp.employmentType === 'Salary' || emp.employmentType === 'Full-Time' && emp.hourlyRate === '' && baseSalary > 0) {
    regularGross = baseSalary;
  } else {
    // Default to hourly rate
    regularGross = hr * hw;
  }

  // Overtime Gross
  const otGross = (otHours * hr * otMult) + (doubleOtHours * hr * doubleOtMult) + (tripleOtHours * hr * tripleOtMult);

  // Additional Gross Earnings
  const commission = emp.commission === '' ? 0 : Number(emp.commission);
  const bonus = emp.bonus === '' ? 0 : Number(emp.bonus);
  const tips = emp.tips === '' ? 0 : Number(emp.tips);
  const holidayPay = emp.holidayPay === '' ? 0 : Number(emp.holidayPay);
  const nightAllowance = emp.nightShiftAllowance === '' ? 0 : Number(emp.nightShiftAllowance);
  const weekendAllowance = emp.weekendAllowance === '' ? 0 : Number(emp.weekendAllowance);
  const travelAllowance = emp.travelAllowance === '' ? 0 : Number(emp.travelAllowance);
  const mealAllowance = emp.mealAllowance === '' ? 0 : Number(emp.mealAllowance);
  const housingAllowance = emp.housingAllowance === '' ? 0 : Number(emp.housingAllowance);
  const medicalAllowance = emp.medicalAllowance === '' ? 0 : Number(emp.medicalAllowance);
  const educationAllowance = emp.educationAllowance === '' ? 0 : Number(emp.educationAllowance);
  const stockComp = emp.stockCompensation === '' ? 0 : Number(emp.stockCompensation);
  const otherEarnings = emp.otherEarnings === '' ? 0 : Number(emp.otherEarnings);

  const additionalGross = commission + bonus + tips + holidayPay + nightAllowance + weekendAllowance +
    travelAllowance + mealAllowance + housingAllowance + medicalAllowance + educationAllowance + stockComp + otherEarnings;

  const totalGross = regularGross + otGross + additionalGross;

  // Deductions
  let preTaxDeductions = 0;
  let postTaxDeductions = 0;

  emp.deductions.forEach(d => {
    let amt = 0;
    const dVal = d.value === '' ? 0 : Number(d.value);
    if (d.type === 'percent') {
      amt = (dVal / 100) * totalGross;
    } else {
      amt = dVal;
    }

    if (d.taxTreatment === 'pre-tax') {
      preTaxDeductions += amt;
    } else {
      postTaxDeductions += amt;
    }
  });

  let totalDeductions = preTaxDeductions + postTaxDeductions;
  
  if (totalDeductions > totalGross) {
    errors.push(`Deductions ($${totalDeductions.toFixed(2)}) exceed Gross Pay ($${totalGross.toFixed(2)}).`);
    totalDeductions = totalGross;
    // proportional scaling to fit gross pay
    if (preTaxDeductions + postTaxDeductions > 0) {
      const scale = totalGross / (preTaxDeductions + postTaxDeductions);
      preTaxDeductions = preTaxDeductions * scale;
      postTaxDeductions = postTaxDeductions * scale;
    } else {
      preTaxDeductions = 0;
      postTaxDeductions = 0;
    }
  }

  const netPay = Math.max(0, totalGross - totalDeductions);

  // Employer Costs
  const empTaxRate = emp.employerTaxRate === '' ? 0 : Number(emp.employerTaxRate);
  const empTaxFixed = emp.employerTaxFixed === '' ? 0 : Number(emp.employerTaxFixed);
  if (empTaxRate < 0 || empTaxFixed < 0) {
    errors.push('Employer Tax contributions cannot be negative.');
    hasErrors = true;
  }
  const employerTax = (empTaxRate / 100) * totalGross + empTaxFixed;

  const empRetRate = emp.employerRetirementRate === '' ? 0 : Number(emp.employerRetirementRate);
  const empRetFixed = emp.employerRetirementFixed === '' ? 0 : Number(emp.employerRetirementFixed);
  if (empRetRate < 0 || empRetFixed < 0) {
    errors.push('Employer Retirement contributions cannot be negative.');
    hasErrors = true;
  }
  const employerRetirement = (empRetRate / 100) * totalGross + empRetFixed;

  const empInsurance = emp.employerInsurance === '' ? 0 : Number(emp.employerInsurance);
  const workersComp = emp.workersComp === '' ? 0 : Number(emp.workersComp);
  const trainingCost = emp.trainingCost === '' ? 0 : Number(emp.trainingCost);
  const recruitmentCost = emp.recruitmentCost === '' ? 0 : Number(emp.recruitmentCost);
  const equipmentCost = emp.equipmentCost === '' ? 0 : Number(emp.equipmentCost);
  const uniformCost = emp.uniformCost === '' ? 0 : Number(emp.uniformCost);
  const otherExpenses = emp.otherEmployerExpenses === '' ? 0 : Number(emp.otherEmployerExpenses);

  if (empInsurance < 0 || workersComp < 0 || trainingCost < 0 || recruitmentCost < 0 || equipmentCost < 0 || uniformCost < 0 || otherExpenses < 0) {
    errors.push('Employer benefit/operating expenses cannot be negative.');
    hasErrors = true;
  }

  const totalEmployerCosts = employerTax + employerRetirement + empInsurance + workersComp + trainingCost + recruitmentCost + equipmentCost + uniformCost + otherExpenses;
  const totalExpense = totalGross + totalEmployerCosts;

  // Calculate average hourly rate
  const totalHours = hw + otHours + doubleOtHours + tripleOtHours;
  const averageHourlyRate = totalHours > 0 ? totalGross / totalHours : (hr || 0);

  return {
    regularGross,
    overtimeGross: otGross,
    additionalGross,
    totalGross,
    preTaxDeductions,
    postTaxDeductions,
    totalDeductions,
    netPay,
    employerCosts: {
      taxes: employerTax,
      retirement: employerRetirement,
      insurance: empInsurance,
      workersComp,
      training: trainingCost,
      recruitment: recruitmentCost,
      equipment: equipmentCost,
      uniform: uniformCost,
      other: otherExpenses,
      total: totalEmployerCosts
    },
    totalExpense,
    averageHourlyRate,
    hasErrors: errors.length > 0 || hasErrors,
    errorMessages: errors
  };
}

// Compute summary for multiple employees
export function calculatePayrollSummary(employees: Employee[]): {
  summary: PayrollSummary;
  employeeResults: Record<string, EmployeePayrollResults>;
} {
  const employeeResults: Record<string, EmployeePayrollResults> = {};
  
  let grossPayroll = 0;
  let totalDeductions = 0;
  let totalEmployerCosts = 0;
  let totalPayrollExpense = 0;
  let netPayroll = 0;

  let totalBonuses = 0;
  let totalOvertime = 0;
  let totalCommissions = 0;
  
  let totalTaxes = 0;
  let totalBenefits = 0;
  
  let highestSalary = 0;
  let lowestSalary = Infinity;
  let hourlySum = 0;
  let hourlyCount = 0;

  employees.forEach(emp => {
    const res = calculateEmployeePayroll(emp);
    employeeResults[emp.id] = res;

    grossPayroll += res.totalGross;
    totalDeductions += res.totalDeductions;
    totalEmployerCosts += res.employerCosts.total;
    totalPayrollExpense += res.totalExpense;
    netPayroll += res.netPay;

    totalBonuses += emp.bonus === '' ? 0 : Number(emp.bonus);
    totalOvertime += res.overtimeGross;
    totalCommissions += emp.commission === '' ? 0 : Number(emp.commission);

    // Sum of employee deductions labeled 'tax', 'income tax', 'withholding' etc. + Employer tax
    let empTaxDeductions = 0;
    let empBenefitDeductions = 0;

    emp.deductions.forEach(d => {
      const isTax = d.name.toLowerCase().includes('tax') || d.name.toLowerCase().includes('withholding');
      const isBenefit = d.name.toLowerCase().includes('retirement') || d.name.toLowerCase().includes('insurance') || d.name.toLowerCase().includes('pension') || d.name.toLowerCase().includes('gym') || d.name.toLowerCase().includes('health');
      
      const dVal = d.value === '' ? 0 : Number(d.value);
      const amt = d.type === 'percent' ? (dVal / 100) * res.totalGross : dVal;
      
      if (isTax) empTaxDeductions += amt;
      else if (isBenefit) empBenefitDeductions += amt;
    });

    totalTaxes += empTaxDeductions + res.employerCosts.taxes;
    totalBenefits += empBenefitDeductions + res.employerCosts.retirement + res.employerCosts.insurance;

    if (res.totalGross > highestSalary) highestSalary = res.totalGross;
    if (res.totalGross < lowestSalary) lowestSalary = res.totalGross;

    if (res.averageHourlyRate > 0) {
      hourlySum += res.averageHourlyRate;
      hourlyCount++;
    }
  });

  const count = employees.length;
  const actualLowestSalary = count === 0 ? 0 : lowestSalary;

  return {
    summary: {
      totalEmployees: count,
      grossPayroll,
      totalDeductions,
      totalEmployerCosts,
      totalPayrollExpense,
      netPayroll,
      averageSalary: count > 0 ? grossPayroll / count : 0,
      averageHourlyRate: hourlyCount > 0 ? hourlySum / hourlyCount : 0,
      averageEmployerCost: count > 0 ? totalEmployerCosts / count : 0,
      averageNetPay: count > 0 ? netPayroll / count : 0,
      totalBonuses,
      totalOvertime,
      totalCommissions,
      totalTaxes,
      totalBenefits,
      highestSalary,
      lowestSalary: actualLowestSalary
    },
    employeeResults
  };
}
