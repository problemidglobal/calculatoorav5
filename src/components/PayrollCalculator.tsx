import React, { useState, useMemo, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Search, 
  ArrowUpDown, 
  Printer, 
  TrendingUp, 
  Coins, 
  DollarSign, 
  AlertCircle, 
  BookOpen, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  HelpCircle,
  FileText,
  Users,
  Briefcase,
  Layers,
  ArrowRightLeft,
  Percent,
  CheckCircle,
  Clock,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  Employee, 
  DeductionRow, 
  calculateEmployeePayroll, 
  calculatePayrollSummary 
} from '../utils/payrollMath';

// Preset lists for deductions & department selections
const SUGGESTED_DEDUCTIONS = [
  { name: 'Federal Income Tax', type: 'percent', value: 12, taxTreatment: 'post-tax' },
  { name: 'State Income Tax', type: 'percent', value: 4, taxTreatment: 'post-tax' },
  { name: '401(k) Retirement', type: 'percent', value: 5, taxTreatment: 'pre-tax' },
  { name: 'Health Insurance Premium', type: 'fixed', value: 120, taxTreatment: 'pre-tax' },
  { name: 'Dental Insurance Premium', type: 'fixed', value: 25, taxTreatment: 'pre-tax' },
  { name: 'Vision Insurance Premium', type: 'fixed', value: 10, taxTreatment: 'pre-tax' },
  { name: 'Union Fees', type: 'fixed', value: 30, taxTreatment: 'post-tax' },
  { name: 'Parking & Transport Fee', type: 'fixed', value: 15, taxTreatment: 'post-tax' }
];

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Human Resources', 'Operations', 'Finance', 'Other'];

// Initial Empty Employee Generator
const createEmptyEmployee = (idPrefix = 'emp-', index = 0): Employee & { department: string } => ({
  id: `${idPrefix}${Date.now()}-${index}`,
  name: '',
  employeeId: '',
  department: 'Engineering',
  employmentType: 'Hourly',
  paySchedule: 'weekly',
  isCollapsed: false,
  hourlyRate: '',
  hoursWorked: '',
  overtimeHours: '',
  overtimeMultiplier: '',
  doubleOvertimeHours: '',
  doubleOvertimeMultiplier: '',
  tripleOvertimeHours: '',
  tripleOvertimeMultiplier: '',
  baseSalary: '',
  commission: '',
  bonus: '',
  tips: '',
  holidayPay: '',
  nightShiftAllowance: '',
  weekendAllowance: '',
  travelAllowance: '',
  mealAllowance: '',
  housingAllowance: '',
  medicalAllowance: '',
  educationAllowance: '',
  stockCompensation: '',
  otherEarnings: '',
  deductions: [],
  employerTaxRate: '',
  employerTaxFixed: '',
  employerRetirementRate: '',
  employerRetirementFixed: '',
  employerInsurance: '',
  workersComp: '',
  trainingCost: '',
  recruitmentCost: '',
  equipmentCost: '',
  uniformCost: '',
  otherEmployerExpenses: ''
});

// Demo Data matching strict instruction parameters (No numeric defaults initially)
const demoEmployees: (Employee & { department: string })[] = [
  {
    id: 'emp-demo-1',
    name: 'Eleanor Vance',
    employeeId: 'EMP-3042',
    department: 'Engineering',
    employmentType: 'Salary',
    paySchedule: 'monthly',
    isCollapsed: false,
    hourlyRate: '',
    hoursWorked: '',
    overtimeHours: '',
    overtimeMultiplier: '',
    doubleOvertimeHours: '',
    doubleOvertimeMultiplier: '',
    tripleOvertimeHours: '',
    tripleOvertimeMultiplier: '',
    baseSalary: 7200,
    commission: '',
    bonus: 850,
    tips: '',
    holidayPay: '',
    nightShiftAllowance: '',
    weekendAllowance: '',
    travelAllowance: 200,
    mealAllowance: 120,
    housingAllowance: '',
    medicalAllowance: 250,
    educationAllowance: '',
    stockCompensation: 1200,
    otherEarnings: '',
    deductions: [
      { id: 'ded-e1-1', name: 'Federal Income Tax', type: 'percent', value: 15, taxTreatment: 'post-tax' },
      { id: 'ded-e1-2', name: 'Health Insurance Premium', type: 'fixed', value: 160, taxTreatment: 'pre-tax' },
      { id: 'ded-e1-3', name: '401(k) Retirement Contribution', type: 'percent', value: 6, taxTreatment: 'pre-tax' }
    ],
    employerTaxRate: 7.65,
    employerTaxFixed: '',
    employerRetirementRate: 4,
    employerRetirementFixed: '',
    employerInsurance: 320,
    workersComp: 60,
    trainingCost: 150,
    recruitmentCost: '',
    equipmentCost: 250,
    uniformCost: '',
    otherEmployerExpenses: ''
  },
  {
    id: 'emp-demo-2',
    name: 'Marcus Brody',
    employeeId: 'EMP-3043',
    department: 'Sales',
    employmentType: 'Hourly',
    paySchedule: 'weekly',
    isCollapsed: true,
    hourlyRate: 32,
    hoursWorked: 40,
    overtimeHours: 6,
    overtimeMultiplier: 1.5,
    doubleOvertimeHours: 2,
    doubleOvertimeMultiplier: 2.0,
    tripleOvertimeHours: '',
    tripleOvertimeMultiplier: '',
    baseSalary: '',
    commission: 1500,
    bonus: 250,
    tips: 95,
    holidayPay: '',
    nightShiftAllowance: 60,
    weekendAllowance: '',
    travelAllowance: '',
    mealAllowance: 60,
    housingAllowance: '',
    medicalAllowance: '',
    educationAllowance: '',
    stockCompensation: '',
    otherEarnings: '',
    deductions: [
      { id: 'ded-e2-1', name: 'State Withholding', type: 'percent', value: 8, taxTreatment: 'post-tax' },
      { id: 'ded-e2-2', name: 'Dental Plan Withholding', type: 'fixed', value: 30, taxTreatment: 'pre-tax' }
    ],
    employerTaxRate: 7.65,
    employerTaxFixed: '',
    employerRetirementRate: 3,
    employerRetirementFixed: '',
    employerInsurance: 180,
    workersComp: 45,
    trainingCost: '',
    recruitmentCost: '',
    equipmentCost: '',
    uniformCost: 40,
    otherEmployerExpenses: ''
  },
  {
    id: 'emp-demo-3',
    name: 'Sonia Gupta',
    employeeId: 'EMP-3044',
    department: 'Marketing',
    employmentType: 'Freelancer',
    paySchedule: 'biweekly',
    isCollapsed: true,
    hourlyRate: 45,
    hoursWorked: 64,
    overtimeHours: '',
    overtimeMultiplier: '',
    doubleOvertimeHours: '',
    doubleOvertimeMultiplier: '',
    tripleOvertimeHours: '',
    tripleOvertimeMultiplier: '',
    baseSalary: '',
    commission: '',
    bonus: '',
    tips: '',
    holidayPay: '',
    nightShiftAllowance: '',
    weekendAllowance: '',
    travelAllowance: 300,
    mealAllowance: '',
    housingAllowance: '',
    medicalAllowance: '',
    educationAllowance: '',
    stockCompensation: '',
    otherEarnings: '',
    deductions: [],
    employerTaxRate: '',
    employerTaxFixed: '',
    employerRetirementRate: '',
    employerRetirementFixed: '',
    employerInsurance: '',
    workersComp: 30,
    trainingCost: '',
    recruitmentCost: '',
    equipmentCost: '',
    uniformCost: '',
    otherEmployerExpenses: ''
  }
];

export default function PayrollCalculator() {
  const [employeeMode, setEmployeeMode] = useState<'single' | 'multiple'>('multiple');
  const [employees, setEmployees] = useState<(Employee & { department: string })[]>([]);
  
  // Tab control for dashboard / comparison / seo guides
  const [activeTab, setActiveTab] = useState<'dashboard' | 'comparison' | 'table' | 'guides'>('dashboard');

  // Search, sort, filter states for the Payroll Details Table
  const [tableSearch, setTableSearch] = useState('');
  const [tableSortField, setTableSortField] = useState<'name' | 'gross' | 'deductions' | 'employerCost' | 'netPay' | 'totalExpense'>('name');
  const [tableSortDir, setTableSortDir] = useState<'asc' | 'desc'>('asc');
  const [tableFilterDept, setTableFilterDept] = useState('all');

  // Comparison mode snapshots
  const [scenarioA, setScenarioA] = useState<(Employee & { department: string })[] | null>(null);
  const [scenarioB, setScenarioB] = useState<(Employee & { department: string })[] | null>(null);
  const [comparisonActive, setComparisonActive] = useState(false);

  // Print ref
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Helper: Adds a fresh employee
  const handleAddEmployee = () => {
    setEmployees(prev => [...prev, createEmptyEmployee('emp-', prev.length)]);
  };

  // Helper: Duplicate an employee card
  const handleDuplicateEmployee = (emp: Employee & { department: string }) => {
    const duplicated: Employee & { department: string } = {
      ...JSON.parse(JSON.stringify(emp)),
      id: `emp-dup-${Date.now()}`,
      name: emp.name ? `${emp.name} (Copy)` : '',
      employeeId: emp.employeeId ? `${emp.employeeId}-C` : ''
    };
    setEmployees(prev => [...prev, duplicated]);
  };

  // Helper: Delete an employee card
  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  // Collapse/Expand state helper
  const handleToggleCollapse = (id: string) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, isCollapsed: !e.isCollapsed } : e));
  };

  // Update specific field inside an employee card
  const handleUpdateEmployeeField = (id: string, field: keyof Employee | 'department', value: any) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  // Deductions Sub-handlers
  const handleAddDeduction = (id: string) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        const newDeduction: DeductionRow = {
          id: `ded-${Date.now()}-${e.deductions.length}`,
          name: '',
          type: 'fixed',
          value: '',
          taxTreatment: 'post-tax'
        };
        return { ...e, deductions: [...e.deductions, newDeduction] };
      }
      return e;
    }));
  };

  const handleUpdateDeductionField = (empId: string, dedId: string, field: keyof DeductionRow, value: any) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === empId) {
        const updatedDeductions = e.deductions.map(d => d.id === dedId ? { ...d, [field]: value } : d);
        return { ...e, deductions: updatedDeductions };
      }
      return e;
    }));
  };

  const handleDeleteDeduction = (empId: string, dedId: string) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === empId) {
        return { ...e, deductions: e.deductions.filter(d => d.id !== dedId) };
      }
      return e;
    }));
  };

  const handleApplySuggestedDeduction = (empId: string, suggested: typeof SUGGESTED_DEDUCTIONS[0]) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === empId) {
        const hasDeduction = e.deductions.some(d => d.name === suggested.name);
        if (hasDeduction) return e; // Skip duplicate names
        const newDeduction: DeductionRow = {
          id: `ded-sug-${Date.now()}-${e.deductions.length}`,
          name: suggested.name,
          type: suggested.type as 'fixed' | 'percent',
          value: suggested.value,
          taxTreatment: suggested.taxTreatment as 'pre-tax' | 'post-tax'
        };
        return { ...e, deductions: [...e.deductions, newDeduction] };
      }
      return e;
    }));
  };

  // Loads complete realistic example
  const handleLoadExample = () => {
    setEmployees(JSON.parse(JSON.stringify(demoEmployees)));
    if (employeeMode === 'single') {
      setEmployeeMode('multiple');
    }
  };

  // Clears out all inputs & employees
  const handleClearAll = () => {
    setEmployees([]);
    setComparisonActive(false);
    setScenarioA(null);
    setScenarioB(null);
  };

  // Dynamically configure single vs multiple list sizes
  const activeEmployees = useMemo(() => {
    if (employeeMode === 'single') {
      if (employees.length === 0) {
        return [createEmptyEmployee('single-emp-', 0)];
      }
      return [employees[0]];
    }
    return employees;
  }, [employeeMode, employees]);

  // Calculations for current state
  const payrollResults = useMemo(() => {
    return calculatePayrollSummary(activeEmployees);
  }, [activeEmployees]);

  const { summary, employeeResults } = payrollResults;

  // Single-employee active warnings helper
  const validationAlerts = useMemo(() => {
    const alerts: { employeeName: string; messages: string[] }[] = [];
    activeEmployees.forEach(emp => {
      const res = employeeResults[emp.id];
      if (res && res.hasErrors) {
        alerts.push({
          employeeName: emp.name || emp.employeeId || 'Unnamed Employee',
          messages: res.errorMessages
        });
      }
    });
    return alerts;
  }, [activeEmployees, employeeResults]);

  // Comparison calculations
  const comparisonResults = useMemo(() => {
    if (!scenarioA || !scenarioB) return null;
    const calcA = calculatePayrollSummary(scenarioA);
    const calcB = calculatePayrollSummary(scenarioB);
    return {
      summaryA: calcA.summary,
      summaryB: calcB.summary,
      diff: {
        totalEmployees: calcB.summary.totalEmployees - calcA.summary.totalEmployees,
        grossPayroll: calcB.summary.grossPayroll - calcA.summary.grossPayroll,
        totalDeductions: calcB.summary.totalDeductions - calcA.summary.totalDeductions,
        totalEmployerCosts: calcB.summary.totalEmployerCosts - calcA.summary.totalEmployerCosts,
        totalPayrollExpense: calcB.summary.totalPayrollExpense - calcA.summary.totalPayrollExpense,
        netPayroll: calcB.summary.netPayroll - calcA.summary.netPayroll,
        averageSalary: calcB.summary.averageSalary - calcA.summary.averageSalary,
        averageHourlyRate: calcB.summary.averageHourlyRate - calcA.summary.averageHourlyRate,
        averageEmployerCost: calcB.summary.averageEmployerCost - calcA.summary.averageEmployerCost,
        averageNetPay: calcB.summary.averageNetPay - calcA.summary.averageNetPay,
        totalOvertime: calcB.summary.totalOvertime - calcA.summary.totalOvertime,
        totalBonuses: calcB.summary.totalBonuses - calcA.summary.totalBonuses
      }
    };
  }, [scenarioA, scenarioB]);

  // Scenario Snapshot Actions
  const handleSetScenarioA = () => {
    setScenarioA(JSON.parse(JSON.stringify(activeEmployees)));
  };

  const handleSetScenarioB = () => {
    setScenarioB(JSON.parse(JSON.stringify(activeEmployees)));
  };

  const handleToggleComparison = () => {
    if (!comparisonActive) {
      setScenarioA(JSON.parse(JSON.stringify(activeEmployees)));
      setScenarioB(JSON.parse(JSON.stringify(activeEmployees)));
      setComparisonActive(true);
      setActiveTab('comparison');
    } else {
      setComparisonActive(false);
      setScenarioA(null);
      setScenarioB(null);
    }
  };

  // Recharts Visuals Formatting
  const allocationChartData = useMemo(() => {
    if (summary.grossPayroll === 0) return [];
    return [
      { name: 'Take-Home Net Payroll', value: summary.netPayroll, color: '#2563eb' },
      { name: 'Employee Deductions & Taxes', value: summary.totalDeductions, color: '#f59e0b' },
      { name: 'Employer Paid Costs', value: summary.totalEmployerCosts, color: '#10b981' }
    ];
  }, [summary]);

  const departmentChartData = useMemo(() => {
    const depts: Record<string, { gross: number; employerCost: number; employees: number }> = {};
    activeEmployees.forEach(emp => {
      const res = employeeResults[emp.id];
      if (!res) return;
      const d = emp.department || 'Other';
      if (!depts[d]) {
        depts[d] = { gross: 0, employerCost: 0, employees: 0 };
      }
      depts[d].gross += res.totalGross;
      depts[d].employerCost += res.employerCosts.total;
      depts[d].employees += 1;
    });

    return Object.entries(depts).map(([name, data]) => ({
      name,
      'Gross Pay ($)': Math.round(data.gross),
      'Employer Cost ($)': Math.round(data.employerCost),
      'Total Expense ($)': Math.round(data.gross + data.employerCost),
      'Employees Count': data.employees
    }));
  }, [activeEmployees, employeeResults]);

  const earningsDistributionData = useMemo(() => {
    return activeEmployees.map(emp => {
      const res = employeeResults[emp.id];
      const regular = res ? res.regularGross : 0;
      const overtime = res ? res.overtimeGross : 0;
      const bonus = emp.bonus === '' ? 0 : Number(emp.bonus);
      const other = res ? (res.totalGross - regular - overtime - bonus) : 0;
      return {
        name: emp.name || emp.employeeId || 'Staff Member',
        'Regular Pay': Math.round(regular),
        'Overtime Pay': Math.round(overtime),
        'Bonus Pay': Math.round(bonus),
        'Other Pay': Math.round(other)
      };
    });
  }, [activeEmployees, employeeResults]);

  const employerCostBreakdownData = useMemo(() => {
    let taxes = 0, retirement = 0, insurance = 0, operational = 0;
    activeEmployees.forEach(emp => {
      const res = employeeResults[emp.id];
      if (!res) return;
      taxes += res.employerCosts.taxes;
      retirement += res.employerCosts.retirement;
      insurance += res.employerCosts.insurance;
      operational += res.employerCosts.workersComp + res.employerCosts.training + res.employerCosts.recruitment + res.employerCosts.equipment + res.employerCosts.uniform + res.employerCosts.other;
    });

    if (taxes + retirement + insurance + operational === 0) return [];

    return [
      { name: 'Payroll Taxes', value: taxes, color: '#f43f5e' },
      { name: 'Retirement Contributions', value: retirement, color: '#8b5cf6' },
      { name: 'Insurance Benefits', value: insurance, color: '#3b82f6' },
      { name: 'Overhead & Training', value: operational, color: '#10b981' }
    ];
  }, [activeEmployees, employeeResults]);

  // Rule-based Smart Insights
  const smartInsights = useMemo(() => {
    const insights: string[] = [];
    if (summary.totalEmployees === 0) return ['Add employees or load an example to view payroll insights.'];

    // Insight 1: Employer cost ratio
    const costRatio = summary.grossPayroll > 0 ? (summary.totalEmployerCosts / summary.grossPayroll) * 100 : 0;
    if (costRatio > 0) {
      insights.push(`Employer operating costs account for ${costRatio.toFixed(1)}% of your gross wage payroll expenses.`);
    }

    // Insight 2: Overtime ratio
    const overtimeRatio = summary.grossPayroll > 0 ? (summary.totalOvertime / summary.grossPayroll) * 100 : 0;
    if (overtimeRatio > 15) {
      insights.push(`Overtime accounts for ${overtimeRatio.toFixed(1)}% of total wages, which represents a highly elevated shift loading layout.`);
    } else if (overtimeRatio > 0) {
      insights.push(`Overtime represents ${overtimeRatio.toFixed(1)}% of total gross wage allocations.`);
    }

    // Insight 3: Bonuses impact
    const bonusRatio = summary.grossPayroll > 0 ? (summary.totalBonuses / summary.grossPayroll) * 100 : 0;
    if (bonusRatio > 5) {
      insights.push(`Discretionary performance bonuses increase total payroll expense weights by ${bonusRatio.toFixed(1)}%.`);
    }

    // Insight 4: Average cost per employee
    const averageExpense = summary.totalPayrollExpense / summary.totalEmployees;
    insights.push(`The average complete employer payroll liability cost per staff member is $${averageExpense.toFixed(2)}.`);

    return insights;
  }, [summary]);

  // Table Search / Sort / Filter calculations
  const filteredSortedTableEmployees = useMemo(() => {
    let result = activeEmployees.map(emp => {
      const res = employeeResults[emp.id];
      return {
        emp,
        res,
        name: emp.name || 'Unnamed Employee',
        gross: res ? res.totalGross : 0,
        deductions: res ? res.totalDeductions : 0,
        employerCost: res ? res.employerCosts.total : 0,
        netPay: res ? res.netPay : 0,
        totalExpense: res ? res.totalExpense : 0
      };
    });

    // Apply Filter
    if (tableFilterDept !== 'all') {
      result = result.filter(item => item.emp.department === tableFilterDept);
    }

    // Apply Search
    if (tableSearch) {
      const query = tableSearch.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) || 
        (item.emp.employeeId && item.emp.employeeId.toLowerCase().includes(query))
      );
    }

    // Apply Sort
    result.sort((a, b) => {
      let valA: any = a[tableSortField];
      let valB: any = b[tableSortField];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return tableSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return tableSortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [activeEmployees, employeeResults, tableSearch, tableSortField, tableSortDir, tableFilterDept]);

  const handleSort = (field: typeof tableSortField) => {
    if (tableSortField === field) {
      setTableSortDir(p => p === 'asc' ? 'desc' : 'asc');
    } else {
      setTableSortField(field);
      setTableSortDir('asc');
    }
  };

  // Exports Features
  const handleCSVExport = () => {
    if (activeEmployees.length === 0) return;
    const headers = ['Employee Name', 'Employee ID', 'Department', 'Employment Type', 'Gross Pay', 'Deductions', 'Employer Costs', 'Net Take-Home Pay', 'Total Cost to Employer'];
    const rows = filteredSortedTableEmployees.map(item => [
      `"${item.name}"`,
      `"${item.emp.employeeId || 'N/A'}"`,
      `"${item.emp.department || 'N/A'}"`,
      `"${item.emp.employmentType}"`,
      item.gross.toFixed(2),
      item.deductions.toFixed(2),
      item.employerCost.toFixed(2),
      item.netPay.toFixed(2),
      item.totalExpense.toFixed(2)
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Calculatoora_Payroll_Summary_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#ec4899'];

  return (
    <div className="space-y-10 font-sans" ref={printAreaRef}>
      
      {/* Title Header with Modern Accent Branding */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-cyan-200">
              <Sparkles className="w-3.5 h-3.5" /> Calculatoora Premium Edition
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
              Payroll Calculator
            </h1>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl leading-relaxed">
              An advanced, completely client-side payroll architecture engineered for employers, HR leads, and professional accountants to process multi-role staff costs in real-time.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLoadExample}
              className="px-5 py-3 rounded-xl bg-white text-blue-700 font-extrabold text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Load Example
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleClearAll}
              className="px-5 py-3 rounded-xl bg-blue-700/60 hover:bg-blue-700/80 border border-blue-400/20 text-white font-extrabold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mode Switcher and Tabs Selection */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center border-b border-neutral-200 dark:border-neutral-800 pb-4 print:hidden">
        
        {/* Switch Single vs Multiple Mode */}
        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-1 flex gap-1 self-start">
          <button
            onClick={() => {
              setEmployeeMode('single');
              if (employees.length === 0) {
                setEmployees([createEmptyEmployee('single-emp-', 0)]);
              }
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              employeeMode === 'single'
                ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-md'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Single Employee
          </button>
          <button
            onClick={() => setEmployeeMode('multiple')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              employeeMode === 'multiple'
                ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-md'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Multiple Employees ({employees.length})
          </button>
        </div>

        {/* Action Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 scrollbar-none py-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/40 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Dashboard &amp; Charts
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'table'
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/40 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Payroll Ledger Table
          </button>
          <button
            onClick={handleToggleComparison}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/40 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Scenario Comparison {comparisonActive && '•'}
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'guides'
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/40 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Educational Content
          </button>
        </div>

      </div>

      {/* Validation alert banner if needed */}
      {validationAlerts.length > 0 && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/30 bg-rose-500/5 p-4 flex gap-3 text-rose-800 dark:text-rose-300 animate-pulse print:hidden">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold">Calculation Alerts &amp; Validation Messages</h4>
            <div className="text-xs space-y-1 list-disc pl-4">
              {validationAlerts.map((alert, idx) => (
                <div key={idx}>
                  <strong>{alert.employeeName}</strong>: {alert.messages.join(' ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Primary Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: EMPLOYEE CARD EDITOR */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center print:hidden">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <Layers className="w-5 h-5 text-blue-500" /> Employee Profiles {employeeMode === 'multiple' && `(${employees.length})`}
            </h2>
            {employeeMode === 'multiple' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddEmployee}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Employee
              </motion.button>
            )}
          </div>

          {activeEmployees.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center bg-white/40 dark:bg-neutral-900/20 backdrop-blur-md">
              <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-neutral-800 dark:text-white">No Employees Registered</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Add employees to get started, or click "Load Example" above to fill with verified simulation data.
              </p>
              <button
                onClick={handleAddEmployee}
                className="mt-4 px-4 py-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
              >
                Create First Profile
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {activeEmployees.map((emp, index) => {
                  const res = employeeResults[emp.id];
                  return (
                    <motion.div
                      key={emp.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-3xl border border-white/50 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-xl overflow-hidden"
                    >
                      {/* Header block of Card */}
                      <div 
                        onClick={() => handleToggleCollapse(emp.id)}
                        className="p-5 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/30 border-b border-neutral-100 dark:border-neutral-800/60 cursor-pointer select-none hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-cyan-400 font-extrabold text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                              {emp.name || 'Unnamed Employee'} 
                              {emp.employeeId && <span className="text-[10px] text-neutral-400 font-mono">({emp.employeeId})</span>}
                            </h3>
                            <div className="flex gap-2 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-mono">
                                {emp.employmentType}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-mono">
                                {emp.paySchedule}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 font-mono">
                                {emp.department}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 print:hidden" onClick={e => e.stopPropagation()}>
                          {/* Card Actions */}
                          {employeeMode === 'multiple' && (
                            <>
                              <button 
                                onClick={() => handleDuplicateEmployee(emp)}
                                className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition cursor-pointer"
                                title="Duplicate Profile"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteEmployee(emp.id)}
                                className="p-2 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 transition cursor-pointer"
                                title="Delete Profile"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleToggleCollapse(emp.id)}
                            className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition cursor-pointer"
                          >
                            {emp.isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Section */}
                      {!emp.isCollapsed && (
                        <div className="p-6 space-y-6">
                          
                          {/* Core Meta Inputs Row */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-neutral-500 mb-1.5">Employee Name</label>
                              <input 
                                type="text"
                                placeholder="e.g. Eleanor Vance"
                                value={emp.name}
                                onChange={e => handleUpdateEmployeeField(emp.id, 'name', e.target.value)}
                                className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-neutral-500 mb-1.5">Employee ID</label>
                              <input 
                                type="text"
                                placeholder="e.g. EMP-3042"
                                value={emp.employeeId}
                                onChange={e => handleUpdateEmployeeField(emp.id, 'employeeId', e.target.value)}
                                className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-neutral-500 mb-1.5">Department</label>
                              <select 
                                value={emp.department}
                                onChange={e => handleUpdateEmployeeField(emp.id, 'department', e.target.value)}
                                className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                              >
                                {DEPARTMENTS.map(d => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-neutral-500 mb-1.5">Pay Schedule</label>
                              <select 
                                value={emp.paySchedule}
                                onChange={e => handleUpdateEmployeeField(emp.id, 'paySchedule', e.target.value)}
                                className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                              >
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Biweekly</option>
                                <option value="semi-monthly">Semi-Monthly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-neutral-500 mb-1.5">Employment Classification</label>
                              <select 
                                value={emp.employmentType}
                                onChange={e => handleUpdateEmployeeField(emp.id, 'employmentType', e.target.value)}
                                className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                              >
                                <option value="Hourly">Hourly Contract</option>
                                <option value="Salary">Salaried Base</option>
                                <option value="Contract">Fixed-Price Contractor</option>
                                <option value="Freelancer">Independent Freelancer</option>
                                <option value="Part-Time">Part-Time Shifts</option>
                                <option value="Full-Time">Full-Time Standard</option>
                              </select>
                            </div>
                          </div>

                          {/* ----------------- SECTION: EARNINGS ----------------- */}
                          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                              <Coins className="w-4 h-4" /> 1. Wages &amp; Salary Earnings
                            </h4>
                            
                            {/* Salary vs Hourly Specific Fields */}
                            {emp.employmentType === 'Salary' || (emp.employmentType === 'Full-Time' && emp.hourlyRate === '') ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-900/20 p-4 rounded-2xl">
                                <div>
                                  <label className="block text-xs font-bold text-neutral-600 mb-1">Base Salary (Gross)</label>
                                  <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                                    <input 
                                      type="number"
                                      placeholder="e.g. 5000"
                                      value={emp.baseSalary}
                                      onChange={e => handleUpdateEmployeeField(emp.id, 'baseSalary', e.target.value === '' ? '' : Number(e.target.value))}
                                      className="w-full text-xs py-3 pl-8 pr-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                    />
                                  </div>
                                  <span className="text-[10px] text-neutral-400 mt-1 block">Regular salary per pay schedule frequency.</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900/20 p-4 rounded-2xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold text-neutral-600 mb-1">Hourly Wage Rate</label>
                                    <div className="relative">
                                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                                      <input 
                                        type="number"
                                        placeholder="e.g. 25"
                                        value={emp.hourlyRate}
                                        onChange={e => handleUpdateEmployeeField(emp.id, 'hourlyRate', e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full text-xs py-3 pl-8 pr-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-neutral-600 mb-1">Regular Hours Worked</label>
                                    <input 
                                      type="number"
                                      placeholder="e.g. 40"
                                      value={emp.hoursWorked}
                                      onChange={e => handleUpdateEmployeeField(emp.id, 'hoursWorked', e.target.value === '' ? '' : Number(e.target.value))}
                                      className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
                                  <div>
                                    <label className="block text-xs font-bold text-neutral-600 mb-1">Overtime Hours (1.5x)</label>
                                    <input 
                                      type="number"
                                      placeholder="e.g. 5"
                                      value={emp.overtimeHours}
                                      onChange={e => handleUpdateEmployeeField(emp.id, 'overtimeHours', e.target.value === '' ? '' : Number(e.target.value))}
                                      className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-neutral-600 mb-1">Double OT (2.0x)</label>
                                    <input 
                                      type="number"
                                      placeholder="e.g. 2"
                                      value={emp.doubleOvertimeHours}
                                      onChange={e => handleUpdateEmployeeField(emp.id, 'doubleOvertimeHours', e.target.value === '' ? '' : Number(e.target.value))}
                                      className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-neutral-600 mb-1">Triple OT (3.0x)</label>
                                    <input 
                                      type="number"
                                      placeholder="e.g. 1"
                                      value={emp.tripleOvertimeHours}
                                      onChange={e => handleUpdateEmployeeField(emp.id, 'tripleOvertimeHours', e.target.value === '' ? '' : Number(e.target.value))}
                                      className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Additional Allowances & Supplements (All optional) */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Bonus</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">$</span>
                                  <input 
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={emp.bonus}
                                    onChange={e => handleUpdateEmployeeField(emp.id, 'bonus', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full text-[11px] py-2.5 pl-6 pr-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Commission</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">$</span>
                                  <input 
                                    type="number"
                                    placeholder="e.g. 1200"
                                    value={emp.commission}
                                    onChange={e => handleUpdateEmployeeField(emp.id, 'commission', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full text-[11px] py-2.5 pl-6 pr-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Tips</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">$</span>
                                  <input 
                                    type="number"
                                    placeholder="e.g. 150"
                                    value={emp.tips}
                                    onChange={e => handleUpdateEmployeeField(emp.id, 'tips', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full text-[11px] py-2.5 pl-6 pr-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Holiday Pay</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">$</span>
                                  <input 
                                    type="number"
                                    placeholder="e.g. 200"
                                    value={emp.holidayPay}
                                    onChange={e => handleUpdateEmployeeField(emp.id, 'holidayPay', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full text-[11px] py-2.5 pl-6 pr-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Night Allowance</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">$</span>
                                  <input 
                                    type="number"
                                    placeholder="e.g. 100"
                                    value={emp.nightShiftAllowance}
                                    onChange={e => handleUpdateEmployeeField(emp.id, 'nightShiftAllowance', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full text-[11px] py-2.5 pl-6 pr-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Travel Allowance</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">$</span>
                                  <input 
                                    type="number"
                                    placeholder="e.g. 150"
                                    value={emp.travelAllowance}
                                    onChange={e => handleUpdateEmployeeField(emp.id, 'travelAllowance', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full text-[11px] py-2.5 pl-6 pr-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Meal Allowance</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">$</span>
                                  <input 
                                    type="number"
                                    placeholder="e.g. 80"
                                    value={emp.mealAllowance}
                                    onChange={e => handleUpdateEmployeeField(emp.id, 'mealAllowance', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full text-[11px] py-2.5 pl-6 pr-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Medical Allowance</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">$</span>
                                  <input 
                                    type="number"
                                    placeholder="e.g. 120"
                                    value={emp.medicalAllowance}
                                    onChange={e => handleUpdateEmployeeField(emp.id, 'medicalAllowance', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full text-[11px] py-2.5 pl-6 pr-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Stock Compensation</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">$</span>
                                  <input 
                                    type="number"
                                    placeholder="e.g. 1000"
                                    value={emp.stockCompensation}
                                    onChange={e => handleUpdateEmployeeField(emp.id, 'stockCompensation', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full text-[11px] py-2.5 pl-6 pr-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Other Earnings</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">$</span>
                                  <input 
                                    type="number"
                                    placeholder="e.g. 300"
                                    value={emp.otherEarnings}
                                    onChange={e => handleUpdateEmployeeField(emp.id, 'otherEarnings', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full text-[11px] py-2.5 pl-6 pr-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ----------------- SECTION: DEDUCTIONS ----------------- */}
                          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                            <div className="flex justify-between items-center">
                              <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                <Percent className="w-4 h-4" /> 2. Employee Deductions ({emp.deductions.length})
                              </h4>
                              <button
                                type="button"
                                onClick={() => handleAddDeduction(emp.id)}
                                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 rounded-lg text-[11px] font-bold text-neutral-700 dark:text-neutral-300 transition flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Deduction Row
                              </button>
                            </div>

                            {/* Preset Pills for fast insertion */}
                            <div className="flex flex-wrap gap-1.5 py-1">
                              <span className="text-[10px] text-neutral-400 self-center mr-1">Quick Presets:</span>
                              {SUGGESTED_DEDUCTIONS.map((sug, sIdx) => (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => handleApplySuggestedDeduction(emp.id, sug)}
                                  className="text-[9px] px-2 py-1 rounded bg-neutral-100 hover:bg-blue-500/10 dark:bg-neutral-800/80 hover:text-blue-600 dark:hover:text-cyan-400 font-bold transition text-neutral-600 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-800 cursor-pointer"
                                >
                                  + {sug.name}
                                </button>
                              ))}
                            </div>

                            {/* Deduction Rows mapping */}
                            {emp.deductions.length === 0 ? (
                              <p className="text-[11px] text-neutral-400 italic">No deductions registered. Employees will retain full gross earnings as take-home cash.</p>
                            ) : (
                              <div className="space-y-2.5">
                                {emp.deductions.map(ded => (
                                  <div key={ded.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-neutral-50/50 dark:bg-neutral-900/10 rounded-xl border border-neutral-100 dark:border-neutral-800">
                                    <div className="md:col-span-4">
                                      <input 
                                        type="text"
                                        placeholder="Deduction Name"
                                        value={ded.name}
                                        onChange={e => handleUpdateDeductionField(emp.id, ded.id, 'name', e.target.value)}
                                        className="w-full text-xs p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                      />
                                    </div>
                                    <div className="md:col-span-2">
                                      <select
                                        value={ded.type}
                                        onChange={e => handleUpdateDeductionField(emp.id, ded.id, 'type', e.target.value)}
                                        className="w-full text-xs p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                      >
                                        <option value="fixed">Fixed ($)</option>
                                        <option value="percent">Percent (%)</option>
                                      </select>
                                    </div>
                                    <div className="md:col-span-2">
                                      <input 
                                        type="number"
                                        placeholder="Value"
                                        value={ded.value}
                                        onChange={e => handleUpdateDeductionField(emp.id, ded.id, 'value', e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full text-xs p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                      />
                                    </div>
                                    <div className="md:col-span-3">
                                      <select
                                        value={ded.taxTreatment}
                                        onChange={e => handleUpdateDeductionField(emp.id, ded.id, 'taxTreatment', e.target.value)}
                                        className="w-full text-xs p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                      >
                                        <option value="pre-tax">Pre-Tax (pension, healthcare)</option>
                                        <option value="post-tax">Post-Tax (income tax, parking)</option>
                                      </select>
                                    </div>
                                    <div className="md:col-span-1 flex items-center justify-end">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteDeduction(emp.id, ded.id)}
                                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* ----------------- SECTION: EMPLOYER COSTS ----------------- */}
                          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4" /> 3. Employer Specific Payroll Costs (Optional)
                            </h4>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Employer Payroll Tax (%)</label>
                                <input 
                                  type="number"
                                  placeholder="e.g. 7.65"
                                  value={emp.employerTaxRate}
                                  onChange={e => handleUpdateEmployeeField(emp.id, 'employerTaxRate', e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Retirement Match (%)</label>
                                <input 
                                  type="number"
                                  placeholder="e.g. 3"
                                  value={emp.employerRetirementRate}
                                  onChange={e => handleUpdateEmployeeField(emp.id, 'employerRetirementRate', e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Employer Insurance ($)</label>
                                <input 
                                  type="number"
                                  placeholder="e.g. 250"
                                  value={emp.employerInsurance}
                                  onChange={e => handleUpdateEmployeeField(emp.id, 'employerInsurance', e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Workers Comp ($)</label>
                                <input 
                                  type="number"
                                  placeholder="e.g. 80"
                                  value={emp.workersComp}
                                  onChange={e => handleUpdateEmployeeField(emp.id, 'workersComp', e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Training Cost ($)</label>
                                <input 
                                  type="number"
                                  placeholder="e.g. 120"
                                  value={emp.trainingCost}
                                  onChange={e => handleUpdateEmployeeField(emp.id, 'trainingCost', e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Equipment Cost ($)</label>
                                <input 
                                  type="number"
                                  placeholder="e.g. 350"
                                  value={emp.equipmentCost}
                                  onChange={e => handleUpdateEmployeeField(emp.id, 'equipmentCost', e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Uniform Cost ($)</label>
                                <input 
                                  type="number"
                                  placeholder="e.g. 45"
                                  value={emp.uniformCost}
                                  onChange={e => handleUpdateEmployeeField(emp.id, 'uniformCost', e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-neutral-500 mb-1">Other Employer Exp ($)</label>
                                <input 
                                  type="number"
                                  placeholder="e.g. 100"
                                  value={emp.otherEmployerExpenses}
                                  onChange={e => handleUpdateEmployeeField(emp.id, 'otherEmployerExpenses', e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full text-[11px] p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Quick Summary Preview of Employee results */}
                          <div className="bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-neutral-500">Gross Pay:</span>
                              <span className="font-bold text-neutral-900 dark:text-white font-mono">${res ? res.totalGross.toFixed(2) : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-neutral-500">Total Deductions:</span>
                              <span className="font-bold text-rose-500 font-mono">-${res ? res.totalDeductions.toFixed(2) : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-neutral-500">Net Take-Home Check:</span>
                              <span className="font-bold text-blue-600 dark:text-cyan-400 font-mono">${res ? res.netPay.toFixed(2) : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-xs border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-2">
                              <span className="text-neutral-500">Employer Operating Burden:</span>
                              <span className="font-bold text-emerald-500 font-mono">+${res ? res.employerCosts.total.toFixed(2) : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-xs pt-1">
                              <span className="font-bold text-neutral-800 dark:text-white">Total Cost-To-Employer:</span>
                              <span className="font-black text-neutral-950 dark:text-white font-mono">${res ? res.totalExpense.toFixed(2) : '0.00'}</span>
                            </div>
                          </div>

                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DASHBOARDS, SUMMARIES, CHARTS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* TAB 1: DASHBOARD & CHARTS VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Gross vs Net Realtime Gauge Indicators */}
              <div className="rounded-3xl border border-white/50 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-xl p-6 space-y-6">
                <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" /> Realtime Dashboard
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Gross Payroll</span>
                    <p className="text-xl sm:text-2xl font-black text-blue-600 dark:text-cyan-400 font-mono">
                      ${summary.grossPayroll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Net Payroll</span>
                    <p className="text-xl sm:text-2xl font-black text-emerald-500 font-mono">
                      ${summary.netPayroll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Total Deductions</span>
                    <p className="text-xl sm:text-2xl font-black text-amber-500 font-mono">
                      ${summary.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Employer Costs</span>
                    <p className="text-xl sm:text-2xl font-black text-rose-500 font-mono">
                      ${summary.totalEmployerCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-neutral-900 dark:bg-neutral-950 text-white rounded-2xl space-y-1 shadow-md">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Total Payroll Expense (Burdened Cost)</span>
                  <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                    ${summary.totalPayrollExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-neutral-400">Sum of gross wages + employer insurance/tax allocations.</p>
                </div>
              </div>

              {/* Multi-employee Summary Card */}
              {employeeMode === 'multiple' && (
                <div className="rounded-3xl border border-white/50 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-xl p-6 space-y-4">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-500" /> Multi-Employee Summary
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between p-2 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30">
                      <span className="text-neutral-500">Total Staff:</span>
                      <span className="font-bold text-neutral-950 dark:text-white font-mono">{summary.totalEmployees}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30">
                      <span className="text-neutral-500">Highest Salary:</span>
                      <span className="font-bold text-neutral-950 dark:text-white font-mono">${summary.highestSalary.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30">
                      <span className="text-neutral-500">Lowest Salary:</span>
                      <span className="font-bold text-neutral-950 dark:text-white font-mono">${summary.lowestSalary === Infinity ? '0.00' : summary.lowestSalary.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30">
                      <span className="text-neutral-500">Avg Employer Cost:</span>
                      <span className="font-bold text-neutral-950 dark:text-white font-mono">${summary.averageEmployerCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30">
                      <span className="text-neutral-500">Avg Net Pay:</span>
                      <span className="font-bold text-neutral-950 dark:text-white font-mono">${summary.averageNetPay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30">
                      <span className="text-neutral-500">Total Benefits:</span>
                      <span className="font-bold text-neutral-950 dark:text-white font-mono">${summary.totalBenefits.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Visualizations */}
              {summary.grossPayroll > 0 && (
                <div className="rounded-3xl border border-white/50 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-xl p-6 space-y-8">
                  
                  {/* Allocation Chart */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">Payroll Cost Allocation</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={allocationChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {allocationChartData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v: any) => `$${v.toFixed(2)}`} />
                          <Legend wrapperStyle={{ fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Earnings Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">Staff Earnings Distribution</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={earningsDistributionData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" stroke="#a3a3a3" fontSize={10} />
                          <YAxis stroke="#a3a3a3" fontSize={10} />
                          <Tooltip formatter={(v: any) => `$${v}`} />
                          <Legend wrapperStyle={{ fontSize: '11px' }} />
                          <Bar dataKey="Regular Pay" stackId="a" fill="#2563eb" />
                          <Bar dataKey="Overtime Pay" stackId="a" fill="#10b981" />
                          <Bar dataKey="Bonus Pay" stackId="a" fill="#f59e0b" />
                          <Bar dataKey="Other Pay" stackId="a" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Employer Costs breakdown */}
                  {employerCostBreakdownData.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">Employer Cost Breakdown</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={employerCostBreakdownData}
                              cx="50%"
                              cy="50%"
                              outerRadius={85}
                              dataKey="value"
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              labelLine={false}
                              style={{ fontSize: '10px' }}
                            >
                              {employerCostBreakdownData.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v: any) => `$${v.toFixed(2)}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Department distribution */}
                  {departmentChartData.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">Department Cost Comparison</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={departmentChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke="#a3a3a3" fontSize={10} />
                            <YAxis stroke="#a3a3a3" fontSize={10} />
                            <Tooltip formatter={(v: any) => `$${v}`} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="Gross Pay ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Employer Cost ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Smart Insights Block */}
              <div className="rounded-3xl border border-white/50 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-xl p-6 space-y-4">
                <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-500" /> Smart Payroll Insights
                </h3>
                <div className="space-y-3">
                  {smartInsights.map((insight, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="text-blue-500 font-bold font-mono">✦</span>
                      <p>{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: COMPARISON MODE */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/50 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-xl p-6 space-y-6">
                <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-blue-500" /> Scenario Comparison Engine
                </h3>
                
                <p className="text-xs text-neutral-500">
                  Compare two distinct payroll budgets. Set Scenario A from current employee parameters, make modifications, and snapshot Scenario B to review wage differences instantly.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleSetScenarioA}
                    className="p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-cyan-400 text-xs font-bold rounded-xl transition flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span>Snapshot Scenario A</span>
                    <span className="text-[10px] text-neutral-400 font-mono font-normal">
                      {scenarioA ? `${scenarioA.length} Employees saved` : 'Empty'}
                    </span>
                  </button>
                  <button 
                    onClick={handleSetScenarioB}
                    className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-450 text-xs font-bold rounded-xl transition flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span>Snapshot Scenario B</span>
                    <span className="text-[10px] text-neutral-400 font-mono font-normal">
                      {scenarioB ? `${scenarioB.length} Employees saved` : 'Empty'}
                    </span>
                  </button>
                </div>

                {comparisonResults ? (
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold uppercase text-neutral-400 tracking-wider">Metrics Diff Overview</h4>
                    <div className="space-y-2.5">
                      {/* Gross Payroll Diff */}
                      <div className="flex justify-between items-center p-3 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-xl text-xs">
                        <div>
                          <span className="text-neutral-500">Total Gross Payroll</span>
                          <div className="flex gap-2 mt-0.5 text-[10px] text-neutral-400 font-mono">
                            <span>A: ${comparisonResults.summaryA.grossPayroll.toFixed(2)}</span>
                            <span>B: ${comparisonResults.summaryB.grossPayroll.toFixed(2)}</span>
                          </div>
                        </div>
                        <span className={`font-bold font-mono ${comparisonResults.diff.grossPayroll > 0 ? 'text-rose-500' : comparisonResults.diff.grossPayroll < 0 ? 'text-emerald-500' : 'text-neutral-500'}`}>
                          {comparisonResults.diff.grossPayroll > 0 ? '+' : ''}${comparisonResults.diff.grossPayroll.toFixed(2)}
                        </span>
                      </div>

                      {/* Total Payroll Expense Diff */}
                      <div className="flex justify-between items-center p-3 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-xl text-xs">
                        <div>
                          <span className="text-neutral-500 font-bold">Total Expense (Employer Burden)</span>
                          <div className="flex gap-2 mt-0.5 text-[10px] text-neutral-400 font-mono">
                            <span>A: ${comparisonResults.summaryA.totalPayrollExpense.toFixed(2)}</span>
                            <span>B: ${comparisonResults.summaryB.totalPayrollExpense.toFixed(2)}</span>
                          </div>
                        </div>
                        <span className={`font-black font-mono ${comparisonResults.diff.totalPayrollExpense > 0 ? 'text-rose-500' : comparisonResults.diff.totalPayrollExpense < 0 ? 'text-emerald-500' : 'text-neutral-500'}`}>
                          {comparisonResults.diff.totalPayrollExpense > 0 ? '+' : ''}${comparisonResults.diff.totalPayrollExpense.toFixed(2)}
                        </span>
                      </div>

                      {/* Staff Count Diff */}
                      <div className="flex justify-between items-center p-3 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-xl text-xs">
                        <div>
                          <span className="text-neutral-500">Total Employee Count</span>
                        </div>
                        <span className="font-bold font-mono">
                          {comparisonResults.diff.totalEmployees > 0 ? '+' : ''}{comparisonResults.diff.totalEmployees}
                        </span>
                      </div>

                      {/* Avg Salary Diff */}
                      <div className="flex justify-between items-center p-3 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-xl text-xs">
                        <div>
                          <span className="text-neutral-500">Avg Cost Per Employee</span>
                        </div>
                        <span className={`font-bold font-mono ${comparisonResults.diff.averageSalary > 0 ? 'text-rose-500' : 'text-neutral-500'}`}>
                          {comparisonResults.diff.averageSalary > 0 ? '+' : ''}${comparisonResults.diff.averageSalary.toFixed(2)}
                        </span>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-600 dark:text-amber-400 text-xs">
                    Please snapshot both Scenario A and Scenario B with some registered employee structures to compare diffs.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LEDGER TABLE VIEW */}
          {activeTab === 'table' && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/50 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-xl p-6 space-y-4">
                <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-500" /> Export Options
                </h3>
                
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={handleCSVExport}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Export CSV Spreadsheet
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print or Save as PDF
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* DETAILED PAYROLL TABLE */}
      <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" /> Payroll Ledger Details
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">Search, sort, filter, and audit individual employee payroll components.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text"
                placeholder="Search staff..."
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                className="text-xs pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Department Filter */}
            <select
              value={tableFilterDept}
              onChange={e => setTableFilterDept(e.target.value)}
              className="text-xs p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredSortedTableEmployees.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500 italic">
            No employee calculation data matches the query or filter constraints.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 border-b border-neutral-100 dark:border-neutral-800 uppercase font-mono tracking-wider">
                  <th 
                    onClick={() => handleSort('name')}
                    className="p-4 font-bold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    Employee <ArrowUpDown className="w-3 h-3 inline ml-1" />
                  </th>
                  <th 
                    onClick={() => handleSort('gross')}
                    className="p-4 font-bold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-right"
                  >
                    Gross Pay <ArrowUpDown className="w-3 h-3 inline ml-1" />
                  </th>
                  <th 
                    onClick={() => handleSort('deductions')}
                    className="p-4 font-bold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-right"
                  >
                    Deductions <ArrowUpDown className="w-3 h-3 inline ml-1" />
                  </th>
                  <th 
                    onClick={() => handleSort('employerCost')}
                    className="p-4 font-bold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-right"
                  >
                    Employer Cost <ArrowUpDown className="w-3 h-3 inline ml-1" />
                  </th>
                  <th 
                    onClick={() => handleSort('netPay')}
                    className="p-4 font-bold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-right"
                  >
                    Net Pay <ArrowUpDown className="w-3 h-3 inline ml-1" />
                  </th>
                  <th 
                    onClick={() => handleSort('totalExpense')}
                    className="p-4 font-bold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-right"
                  >
                    Payroll Burden <ArrowUpDown className="w-3 h-3 inline ml-1" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 font-medium">
                {filteredSortedTableEmployees.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 transition">
                    <td className="p-4">
                      <span className="font-bold text-neutral-900 dark:text-white block">{item.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">ID: {item.emp.employeeId || 'N/A'} • Dept: {item.emp.department}</span>
                    </td>
                    <td className="p-4 text-right font-mono">${item.gross.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono text-rose-500">-${item.deductions.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono text-emerald-500">+${item.employerCost.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono text-blue-600 dark:text-cyan-400 font-bold">${item.netPay.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-bold">${item.totalExpense.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SEO ARTICLE & EDUCATIONAL SECTION WITH REAL WORLD EXAMPLES, FAQ & GLOSSARY */}
      <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 space-y-8 print:hidden">
        
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Educational Resource: Payroll Calculator Guide
        </h2>

        <div className="prose prose-neutral dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-6 leading-relaxed">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">What Is Payroll?</h3>
              <p>
                Payroll refers to the comprehensive process of managing the payment of wages, salaries, bonuses, and net payouts to employees in a business. It comprises tracking worked hours, calculating employee taxes and benefits, and processing employer-side liabilities like state payroll taxes and pension matches.
              </p>

              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">How Payroll Is Calculated</h3>
              <p>
                The sequential steps involved in payroll mathematics require parsing gross wages, applying pre-tax deductions, executing tax withholding schedules, and adding employer-specific liabilities:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Gross Pay</strong>: Base pay + worked overtime hours + sales commission + performance bonuses.</li>
                <li><strong>Pre-Tax Deductions</strong>: Benefits like medical premiums or traditional 401k pension matches are subtracted from gross earnings.</li>
                <li><strong>Tax Withholding</strong>: Federal and State taxes are deducted from the remaining taxable wage.</li>
                <li><strong>Post-Tax Deductions</strong>: Secondary allocations (e.g. gym memberships, transport fees) are subtracted to resolve final <strong>Net Take-Home Pay</strong>.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Employer Payroll Costs vs Employee Deductions</h3>
              <p>
                A common misconception is that the employer's only liability is the gross pay of the employees. In reality, businesses incur substantial secondary charges called the <strong>payroll burden</strong>:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Employee Deductions</strong> are paid *out* of the employee's gross salary (reducing their net pay).</li>
                <li><strong>Employer Costs</strong> are paid *in addition* to the employee's gross salary (fully paid by the business). Examples include standard FICA matches, workers compensation premiums, and professional equipment overheads.</li>
              </ul>

              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Hourly vs Salaried Employees</h3>
              <p>
                Hourly contract workers are typically compensated for every hour logged, making them eligible for overtime multipliers (e.g., 1.5x, 2.0x, or 3.0x standard wages) during extended shift workloads. Salaried personnel are compensated with a flat rate per pay period, offering budgeting stability but requiring alternate compensation structures for extended hours.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">Real Calculation Example</h4>
            <p className="text-xs">
              Let's audit a realistic payroll cost for a software engineer compensated at <strong>$5,000.00 gross salary monthly</strong>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <p className="text-neutral-500 uppercase text-[10px]">Employee Side Withholdings:</p>
                <p>Base Gross Pay: $5,000.00</p>
                <p>Pre-Tax 401k (5%): -$250.00</p>
                <p>Taxable Income: $4,750.00</p>
                <p>Estimated Income Tax (12%): -$570.00</p>
                <p className="font-bold text-blue-600">Net Take-Home Pay: $3,930.00</p>
              </div>
              <div className="space-y-1">
                <p className="text-neutral-500 uppercase text-[10px]">Employer Side Burden:</p>
                <p>Employee Gross Pay: $5,000.00</p>
                <p>Employer FICA Matching (7.65%): +$382.50</p>
                <p>Employer Retirement Match (3%): +$150.00</p>
                <p>Workers Comp &amp; Insurance: +$200.00</p>
                <p className="font-bold text-emerald-500">Total Employer Expense: $5,732.50</p>
              </div>
            </div>
          </div>

          {/* FAQS Accordion style */}
          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Frequently Asked Questions (FAQ)</h3>
            <div className="space-y-2">
              <div className="p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/10 space-y-1.5">
                <h4 className="font-bold text-neutral-900 dark:text-white">Q: What is FICA tax?</h4>
                <p className="text-neutral-500">A: FICA is the US Federal Insurance Contributions Act, which funds Social Security and Medicare. Both employees and employers pay 6.2% for Social Security and 1.45% for Medicare, resulting in a standard FICA tax burden of 7.65% on each side.</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/10 space-y-1.5">
                <h4 className="font-bold text-neutral-900 dark:text-white">Q: What are pre-tax vs post-tax deductions?</h4>
                <p className="text-neutral-500">A: Pre-tax deductions are subtracted from gross pay before income taxes are calculated, reducing the total taxable income base. Post-tax deductions are subtracted from the pay after taxes have been computed, which does not impact tax liabilities.</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/10 space-y-1.5">
                <h4 className="font-bold text-neutral-900 dark:text-white">Q: Are independent freelancers processed on standard company payroll?</h4>
                <p className="text-neutral-500">A: Independent freelancers are typically not employees and thus are not subject to standard company tax withholding, FICA matches, or standard retirement benefits. They are processed via accounts payable, but this calculator supports modeling their flat/hourly fees for comprehensive business expense audits.</p>
              </div>
            </div>
          </div>

          {/* GLOSSARY */}
          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Payroll Glossary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <p><strong>Gross Pay</strong>: Total earnings before any taxes or deductions are removed.</p>
              <p><strong>Net Pay</strong>: Actual take-home pay delivered to the employee after all taxes and deductions.</p>
              <p><strong>FICA</strong>: Federal Insurance Contributions Act (funds Social Security and Medicare).</p>
              <p><strong>Pre-Tax Deduction</strong>: Benefit costs subtracted from gross earnings prior to tax calculations.</p>
              <p><strong>Post-Tax Deduction</strong>: Withholdings processed after standard tax computations.</p>
              <p><strong>Payroll Burden</strong>: The absolute cost of an employee to a business over their base gross wage.</p>
            </div>
          </div>

          {/* RELATED CALCULATORS LINKS */}
          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Related Calculators</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-neutral-400">Explore alternative calculators on our platform:</span>
              <a href="#/finance/paycheck-calculator" className="font-bold text-blue-600 hover:underline">Paycheck Calculator</a>
              <span>•</span>
              <a href="#/finance/salary-converter-calculator" className="font-bold text-blue-600 hover:underline">Salary Calculator</a>
              <span>•</span>
              <a href="#/finance/hourly-wage-calculator" className="font-bold text-blue-600 hover:underline">Hourly Wage Calculator</a>
              <span>•</span>
              <a href="#/finance/overtime-calculator" className="font-bold text-blue-600 hover:underline">Overtime Calculator</a>
              <span>•</span>
              <a href="#/finance/tax-calculator" className="font-bold text-blue-600 hover:underline">Tax Calculator</a>
              <span>•</span>
              <a href="#/finance/take-home-pay-calculator" className="font-bold text-blue-600 hover:underline">Take Home Pay Calculator</a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
