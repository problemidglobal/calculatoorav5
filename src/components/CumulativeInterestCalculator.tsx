import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2, 
  AlertTriangle,
  FileText, 
  TrendingUp, 
  Coins, 
  ChevronRight,
  HelpCircle,
  Download,
  Printer,
  Search,
  ArrowUpDown,
  Plus,
  Minus,
  Calendar,
  Layers,
  ChevronDown,
  Info,
  Sliders,
  DollarSign,
  Briefcase,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// --- Types ---
export interface ExtraPaymentEvent {
  id: string;
  amount: string;
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'yearly';
  startMonth: string; // e.g., 12 (represents payment number)
}

export interface RateChangeEvent {
  id: string;
  paymentNumber: string;
  newRate: string;
}

export interface CumulativeInterestInputs {
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
  downPayment: string;
  extraMonthly: string;
  extraAnnual: string;
  startDate: string; // YYYY-MM
  paymentFrequency: 'monthly' | 'biweekly' | 'weekly';
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
  loanFees: string;
  feesType: 'flat' | 'percent';
  addFeesToLoan: boolean;
  insurance: string; // Annual insurance amount
  taxes: string; // Annual tax amount
  balloonPayment: string;
  inflationRate: string;
  extraPaymentsList: ExtraPaymentEvent[];
  variableSchedule: RateChangeEvent[];
}

export interface AmortizationRow {
  paymentNumber: number;
  date: string;
  beginningBalance: number;
  interest: number;
  principal: number;
  extraPayment: number;
  endingBalance: number;
  runningInterest: number;
  runningPrincipal: number;
  appliedRate: number;
  insurance: number;
  taxes: number;
  totalPaymentOutflow: number;
}

export interface CalculationResult {
  schedule: AmortizationRow[];
  baseSchedule: AmortizationRow[]; // Schedule without extra payments and down payment, for comparison
  totalInterest: number;
  totalPrincipal: number;
  totalPayments: number;
  payoffDate: string;
  monthsToPayoff: number;
  interestSaved: number;
  timeSavedMonths: number;
  monthlyBasePayment: number;
  realTotalInterest: number; // Inflation adjusted
  originalTotalInterest: number; // For savings
}

export interface SavedScenario {
  id: string;
  name: string;
  inputs: CumulativeInterestInputs;
  result: CalculationResult;
}

// --- Helper Functions ---
const getPeriodDate = (startDateStr: string, periodIndex: number, frequency: 'monthly' | 'biweekly' | 'weekly'): string => {
  const baseDate = startDateStr ? new Date(startDateStr + '-02') : new Date(); // use day 2 to prevent timezone offset issues
  if (isNaN(baseDate.getTime())) return `P-${periodIndex}`;
  
  if (frequency === 'monthly') {
    baseDate.setMonth(baseDate.getMonth() + periodIndex - 1);
    return baseDate.toLocaleString('default', { month: 'short', year: 'numeric' });
  } else if (frequency === 'biweekly') {
    baseDate.setDate(baseDate.getDate() + (periodIndex - 1) * 14);
    return baseDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  } else {
    baseDate.setDate(baseDate.getDate() + (periodIndex - 1) * 7);
    return baseDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

const getPeriodsPerYear = (frequency: 'monthly' | 'biweekly' | 'weekly'): number => {
  switch (frequency) {
    case 'biweekly': return 26;
    case 'weekly': return 52;
    case 'monthly':
    default: return 12;
  }
};

const calculateAmortization = (inputs: CumulativeInterestInputs, applyExtras: boolean): CalculationResult => {
  const loanAmt = Number(inputs.loanAmount) || 0;
  const initRate = Number(inputs.interestRate) || 0;
  const termYears = Number(inputs.loanTerm) || 0;
  const downPay = Number(inputs.downPayment) || 0;
  const feeVal = Number(inputs.loanFees) || 0;
  const isPercentFee = inputs.feesType === 'percent';
  const addFee = inputs.addFeesToLoan;
  
  const pYr = getPeriodsPerYear(inputs.paymentFrequency);
  const totalPeriods = termYears * pYr;
  
  const calculatedFee = isPercentFee ? (loanAmt * feeVal) / 100 : feeVal;
  const principalBase = Math.max(0, loanAmt - downPay + (addFee ? calculatedFee : 0));
  
  // Calculate compounding adjusted rate
  const getPeriodicRate = (annualAPR: number): number => {
    const rAnn = annualAPR / 100;
    let cYr = 12;
    if (inputs.compoundingFrequency === 'daily') cYr = 365;
    else if (inputs.compoundingFrequency === 'quarterly') cYr = 4;
    else if (inputs.compoundingFrequency === 'annually') cYr = 1;
    
    if (cYr === pYr) {
      return rAnn / pYr;
    }
    // Periodic compounding formula
    const effAnnual = Math.pow(1 + rAnn / cYr, cYr) - 1;
    return Math.pow(1 + effAnnual, 1 / pYr) - 1;
  };

  const getScheduledPayment = (currentPrincipal: number, periodsLeft: number, ratePerPeriod: number): number => {
    if (ratePerPeriod <= 0) return currentPrincipal / Math.max(1, periodsLeft);
    const balloon = Number(inputs.balloonPayment) || 0;
    
    // Formula for payment with balloon: PMT = [P * (1+r)^n - Balloon] * r / [(1+r)^n - 1]
    const comp = Math.pow(1 + ratePerPeriod, periodsLeft);
    return (currentPrincipal * comp - balloon) * ratePerPeriod / (comp - 1);
  };

  const schedule: AmortizationRow[] = [];
  let currentPrincipal = principalBase;
  let runningInterest = 0;
  let runningPrincipal = 0;
  
  const annualTaxes = Number(inputs.taxes) || 0;
  const annualIns = Number(inputs.insurance) || 0;
  const periodicTax = annualTaxes / pYr;
  const periodicIns = annualIns / pYr;
  const inflationAnnual = Number(inputs.inflationRate) || 0;
  const inflationPerPeriod = inflationAnnual / 100 / pYr;

  let baseRate = initRate;
  
  for (let k = 1; k <= totalPeriods; k++) {
    if (currentPrincipal <= 0.01) break;
    
    // Check variable rate changes
    let rateApplied = baseRate;
    if (inputs.variableSchedule && inputs.variableSchedule.length > 0) {
      const activeChanges = inputs.variableSchedule
        .filter(c => Number(c.paymentNumber) <= k && c.newRate !== '')
        .sort((a, b) => Number(b.paymentNumber) - Number(a.paymentNumber));
      if (activeChanges.length > 0) {
        rateApplied = Number(activeChanges[0].newRate);
      }
    }
    
    const rPer = getPeriodicRate(rateApplied);
    const interest = currentPrincipal * rPer;
    
    // Fully amortized payment recalculated if rate changes, or calculated first time
    const pmt = getScheduledPayment(currentPrincipal, totalPeriods - k + 1, rPer);
    
    let principal = Math.min(currentPrincipal, pmt - interest);
    if (principal < 0) principal = 0;
    
    // Extra payments
    let extra = 0;
    if (applyExtras) {
      // General Monthly Extras
      const extraMonthly = Number(inputs.extraMonthly) || 0;
      extra += extraMonthly;
      
      // General Annual Extras (apply at the end of each year cycle)
      const extraAnnual = Number(inputs.extraAnnual) || 0;
      if (extraAnnual > 0 && k % pYr === 0) {
        extra += extraAnnual;
      }
      
      // Event-based extra payments
      if (inputs.extraPaymentsList && inputs.extraPaymentsList.length > 0) {
        inputs.extraPaymentsList.forEach(evt => {
          const amt = Number(evt.amount) || 0;
          const start = Number(evt.startMonth) || 1;
          if (evt.frequency === 'one-time' && k === start) {
            extra += amt;
          } else if (evt.frequency === 'monthly' && k >= start) {
            extra += amt;
          } else if (evt.frequency === 'quarterly' && k >= start && (k - start) % (pYr / 4) === 0) {
            extra += amt;
          } else if (evt.frequency === 'yearly' && k >= start && (k - start) % pYr === 0) {
            extra += amt;
          }
        });
      }
    }
    
    // Clamp extra to remaining balance
    extra = Math.min(extra, currentPrincipal - principal);
    
    const endingBalance = Math.max(0, currentPrincipal - principal - extra);
    runningInterest += interest;
    runningPrincipal += (principal + extra);
    
    const totalOutflow = interest + principal + extra + periodicTax + periodicIns;

    schedule.push({
      paymentNumber: k,
      date: getPeriodDate(inputs.startDate, k, inputs.paymentFrequency),
      beginningBalance: currentPrincipal,
      interest,
      principal: principal + extra,
      extraPayment: extra,
      endingBalance,
      runningInterest,
      runningPrincipal,
      appliedRate: rateApplied,
      insurance: periodicIns,
      taxes: periodicTax,
      totalPaymentOutflow: totalOutflow
    });
    
    currentPrincipal = endingBalance;
    if (currentPrincipal <= 0.01) break;
  }
  
  const totalInterest = runningInterest;
  const totalPrincipal = runningPrincipal;
  const totalPayments = totalInterest + principalBase;
  const payoffDate = schedule.length > 0 ? schedule[schedule.length - 1].date : 'N/A';
  const monthsToPayoff = schedule.length;
  
  // Real Inflation-Adjusted total interest
  let realTotalInterest = 0;
  schedule.forEach(row => {
    const discount = Math.pow(1 + inflationPerPeriod, row.paymentNumber);
    realTotalInterest += row.interest / discount;
  });

  return {
    schedule,
    baseSchedule: [], // Filled externally
    totalInterest,
    totalPrincipal,
    totalPayments,
    payoffDate,
    monthsToPayoff,
    interestSaved: 0,
    timeSavedMonths: 0,
    monthlyBasePayment: schedule.length > 0 ? (schedule[0].interest + schedule[0].principal - schedule[0].extraPayment) : 0,
    realTotalInterest,
    originalTotalInterest: totalInterest
  };
};

export default function CumulativeInterestCalculator() {
  const [inputs, setInputs] = useState<CumulativeInterestInputs>({
    loanAmount: '',
    interestRate: '',
    loanTerm: '',
    downPayment: '',
    extraMonthly: '',
    extraAnnual: '',
    startDate: new Date().toISOString().slice(0, 7), // YYYY-MM
    paymentFrequency: 'monthly',
    compoundingFrequency: 'monthly',
    loanFees: '',
    feesType: 'flat',
    addFeesToLoan: false,
    insurance: '',
    taxes: '',
    balloonPayment: '',
    inflationRate: '',
    extraPaymentsList: [],
    variableSchedule: []
  });

  // Active analysis page tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis' | 'comparison' | 'table' | 'seo'>('dashboard');
  
  // Scenarios Saved State
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [scenarioNameInput, setScenarioNameInput] = useState<string>('');

  // Search/Sort/Filter for Amortization Table
  const [tableSearch, setTableSearch] = useState<string>('');
  const [tableSortField, setTableSortField] = useState<keyof AmortizationRow>('paymentNumber');
  const [tableSortAsc, setTableSortAsc] = useState<boolean>(true);
  const [tablePage, setTablePage] = useState<number>(1);
  const [tablePageSize, setTablePageSize] = useState<number>(12);

  // Time analysis state
  const [timeAnalysisMode, setTimeAnalysisMode] = useState<'payment' | 'month' | 'quarter' | 'year' | 'custom-range'>('year');
  const [timeAnalysisValue, setTimeAnalysisValue] = useState<number>(5); // e.g. Year 5, payment 60
  const [customRangeStart, setCustomRangeStart] = useState<number>(1);
  const [customRangeEnd, setCustomRangeEnd] = useState<number>(60);

  // Active chart type selection
  const [chartSelection, setChartSelection] = useState<'cumulative' | 'allocation' | 'balance' | 'annualBar'>('cumulative');

  // Input validation
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!inputs.loanAmount) return ["Please complete the required fields."];
    if (Number(inputs.loanAmount) <= 0) errors.push("Loan Amount must be greater than zero.");
    
    if (!inputs.interestRate) return ["Please complete the required fields."];
    const rate = Number(inputs.interestRate);
    if (rate < -100 || rate > 100) errors.push("Interest Rate must be between -100% and 100%.");

    if (!inputs.loanTerm) return ["Please complete the required fields."];
    if (Number(inputs.loanTerm) <= 0) errors.push("Loan Term must be greater than zero.");

    // Check optional inputs non-negative
    if (inputs.downPayment && Number(inputs.downPayment) < 0) errors.push("Down Payment cannot be negative.");
    if (inputs.extraMonthly && Number(inputs.extraMonthly) < 0) errors.push("Extra Monthly Payment cannot be negative.");
    if (inputs.extraAnnual && Number(inputs.extraAnnual) < 0) errors.push("Extra Annual Payment cannot be negative.");
    
    return errors;
  }, [inputs.loanAmount, inputs.interestRate, inputs.loanTerm, inputs.downPayment, inputs.extraMonthly, inputs.extraAnnual]);

  const isValid = validationErrors.length === 0;

  // Real-time calculation results
  const results = useMemo<CalculationResult | null>(() => {
    if (!isValid) return null;
    
    // 1. Calculate schedule WITH extra payments & options applied
    const scheduleWithExtras = calculateAmortization(inputs, true);
    
    // 2. Calculate baseline schedule (WITHOUT extra payments, down payment set to 0, variable rate kept as initial rate)
    const baseInputs: CumulativeInterestInputs = {
      ...inputs,
      downPayment: '',
      extraMonthly: '',
      extraAnnual: '',
      extraPaymentsList: [],
      variableSchedule: []
    };
    const baselineSchedule = calculateAmortization(baseInputs, false);
    
    const interestSaved = Math.max(0, baselineSchedule.totalInterest - scheduleWithExtras.totalInterest);
    const timeSavedMonths = Math.max(0, baselineSchedule.monthsToPayoff - scheduleWithExtras.monthsToPayoff);
    
    return {
      ...scheduleWithExtras,
      baseSchedule: baselineSchedule.schedule,
      interestSaved,
      timeSavedMonths,
      originalTotalInterest: baselineSchedule.totalInterest
    };
  }, [inputs, isValid]);

  // --- Handlers ---
  const handleLoadExample = () => {
    setInputs({
      loanAmount: '350000',
      interestRate: '6.25',
      loanTerm: '30',
      downPayment: '50000',
      extraMonthly: '250',
      extraAnnual: '1500',
      startDate: '2026-07',
      paymentFrequency: 'monthly',
      compoundingFrequency: 'monthly',
      loanFees: '2500',
      feesType: 'flat',
      addFeesToLoan: true,
      insurance: '1200',
      taxes: '3600',
      balloonPayment: '',
      inflationRate: '2.5',
      extraPaymentsList: [
        { id: 'ex1', amount: '5000', frequency: 'one-time', startMonth: '36' }
      ],
      variableSchedule: [
        { id: 'v1', paymentNumber: '120', newRate: '5.5' }
      ]
    });
    setTimeAnalysisValue(5);
    setCustomRangeStart(12);
    setCustomRangeEnd(60);
  };

  const handleClearAll = () => {
    setInputs({
      loanAmount: '',
      interestRate: '',
      loanTerm: '',
      downPayment: '',
      extraMonthly: '',
      extraAnnual: '',
      startDate: new Date().toISOString().slice(0, 7),
      paymentFrequency: 'monthly',
      compoundingFrequency: 'monthly',
      loanFees: '',
      feesType: 'flat',
      addFeesToLoan: false,
      insurance: '',
      taxes: '',
      balloonPayment: '',
      inflationRate: '',
      extraPaymentsList: [],
      variableSchedule: []
    });
    setScenarios([]);
  };

  const handleAddExtraPaymentEvent = () => {
    const newEvent: ExtraPaymentEvent = {
      id: Date.now().toString(),
      amount: '',
      frequency: 'one-time',
      startMonth: ''
    };
    setInputs(prev => ({
      ...prev,
      extraPaymentsList: [...prev.extraPaymentsList, newEvent]
    }));
  };

  const handleUpdateExtraPaymentEvent = (id: string, field: keyof ExtraPaymentEvent, val: any) => {
    setInputs(prev => ({
      ...prev,
      extraPaymentsList: prev.extraPaymentsList.map(evt => {
        if (evt.id === id) {
          return { ...evt, [field]: val };
        }
        return evt;
      })
    }));
  };

  const handleRemoveExtraPaymentEvent = (id: string) => {
    setInputs(prev => ({
      ...prev,
      extraPaymentsList: prev.extraPaymentsList.filter(evt => evt.id !== id)
    }));
  };

  const handleAddVariableRateEvent = () => {
    const newEvent: RateChangeEvent = {
      id: Date.now().toString(),
      paymentNumber: '',
      newRate: ''
    };
    setInputs(prev => ({
      ...prev,
      variableSchedule: [...prev.variableSchedule, newEvent]
    }));
  };

  const handleUpdateVariableRateEvent = (id: string, field: keyof RateChangeEvent, val: any) => {
    setInputs(prev => ({
      ...prev,
      variableSchedule: prev.variableSchedule.map(evt => {
        if (evt.id === id) {
          return { ...evt, [field]: val };
        }
        return evt;
      })
    }));
  };

  const handleRemoveVariableRateEvent = (id: string) => {
    setInputs(prev => ({
      ...prev,
      variableSchedule: prev.variableSchedule.filter(evt => evt.id !== id)
    }));
  };

  // Scenario comparisons saving
  const handleSaveScenario = () => {
    if (!results) return;
    const name = scenarioNameInput.trim() || `Scenario ${scenarios.length + 1}`;
    const newScenario: SavedScenario = {
      id: Date.now().toString(),
      name,
      inputs: JSON.parse(JSON.stringify(inputs)),
      result: JSON.parse(JSON.stringify(results))
    };
    setScenarios([...scenarios, newScenario]);
    setScenarioNameInput('');
  };

  const handleRemoveScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  // Sort amortization table
  const handleSortTable = (field: keyof AmortizationRow) => {
    if (tableSortField === field) {
      setTableSortAsc(!tableSortAsc);
    } else {
      setTableSortField(field);
      setTableSortAsc(true);
    }
  };

  // Format currencies helper
  const fmt = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  // CSV Export
  const exportCSV = () => {
    if (!results) return;
    const headers = [
      'Payment #', 'Date', 'Beginning Balance', 'Interest Paid', 
      'Principal Repaid', 'Extra Payments', 'Ending Balance', 
      'Cumulative Interest', 'Cumulative Principal', 'Outflow'
    ];
    const csvContent = [
      headers.join(','),
      ...results.schedule.map(row => [
        row.paymentNumber,
        `"${row.date}"`,
        row.beginningBalance.toFixed(2),
        row.interest.toFixed(2),
        row.principal.toFixed(2),
        row.extraPayment.toFixed(2),
        row.endingBalance.toFixed(2),
        row.runningInterest.toFixed(2),
        row.runningPrincipal.toFixed(2),
        row.totalPaymentOutflow.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cumulative_interest_schedule_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Interactive custom timeframe query calculation
  const customQueryStats = useMemo(() => {
    if (!results || results.schedule.length === 0) return null;
    const schedule = results.schedule;
    const pYr = getPeriodsPerYear(inputs.paymentFrequency);
    
    let targetRows: AmortizationRow[] = [];
    let title = "";

    if (timeAnalysisMode === 'payment') {
      const idx = Math.min(schedule.length, Math.max(1, timeAnalysisValue));
      targetRows = schedule.slice(0, idx);
      title = `Accumulation up to Payment ${idx}`;
    } else if (timeAnalysisMode === 'month') {
      const idx = Math.min(schedule.length, Math.max(1, timeAnalysisValue));
      targetRows = schedule.slice(0, idx);
      title = `Accumulation up to Month ${idx}`;
    } else if (timeAnalysisMode === 'quarter') {
      const totalQuarters = Math.ceil(schedule.length / (pYr / 4));
      const q = Math.min(totalQuarters, Math.max(1, timeAnalysisValue));
      const limit = q * Math.round(pYr / 4);
      targetRows = schedule.slice(0, Math.min(schedule.length, limit));
      title = `Accumulation up to Quarter ${q}`;
    } else if (timeAnalysisMode === 'year') {
      const totalYears = Math.ceil(schedule.length / pYr);
      const yr = Math.min(totalYears, Math.max(1, timeAnalysisValue));
      const limit = yr * pYr;
      targetRows = schedule.slice(0, Math.min(schedule.length, limit));
      title = `Accumulation up to Year ${yr}`;
    } else if (timeAnalysisMode === 'custom-range') {
      const startIdx = Math.min(schedule.length, Math.max(1, customRangeStart)) - 1;
      const endIdx = Math.min(schedule.length, Math.max(1, customRangeEnd));
      targetRows = schedule.slice(startIdx, endIdx);
      title = `Analysis between Payments ${startIdx + 1} and ${endIdx}`;
    }

    if (targetRows.length === 0) return null;

    const interestPaid = targetRows.reduce((sum, r) => sum + r.interest, 0);
    const principalPaid = targetRows.reduce((sum, r) => sum + r.principal, 0);
    const endingBal = targetRows[targetRows.length - 1].endingBalance;
    const totalOutflow = targetRows.reduce((sum, r) => sum + r.totalPaymentOutflow, 0);
    const ratio = interestPaid / (principalPaid || 1);

    return {
      title,
      interestPaid,
      principalPaid,
      endingBal,
      totalOutflow,
      ratio: ratio * 100,
      rowsCount: targetRows.length
    };
  }, [results, timeAnalysisMode, timeAnalysisValue, customRangeStart, customRangeEnd, inputs.paymentFrequency]);

  // Table rows filtered/sorted
  const processedTableRows = useMemo(() => {
    if (!results) return [];
    let rows = [...results.schedule];

    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      rows = rows.filter(r => 
        r.date.toLowerCase().includes(q) || 
        r.paymentNumber.toString().includes(q)
      );
    }

    rows.sort((a, b) => {
      const valA = a[tableSortField];
      const valB = b[tableSortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return tableSortAsc ? valA - valB : valB - valA;
      }
      return tableSortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });

    return rows;
  }, [results, tableSearch, tableSortField, tableSortAsc]);

  const paginatedTableRows = useMemo(() => {
    const start = (tablePage - 1) * tablePageSize;
    return processedTableRows.slice(start, start + tablePageSize);
  }, [processedTableRows, tablePage, tablePageSize]);

  const totalTablePages = Math.ceil(processedTableRows.length / tablePageSize) || 1;

  // Sync back to page 1 on search filter
  useEffect(() => {
    setTablePage(1);
  }, [tableSearch, tableSortField, tableSortAsc]);

  // Chart high contrast visual helpers
  const getChartDataTimeline = useMemo(() => {
    if (!results) return [];
    const step = Math.max(1, Math.floor(results.schedule.length / 30));
    return results.schedule.filter((_, idx) => idx % step === 0 || idx === results.schedule.length - 1).map(row => ({
      name: row.date,
      paymentNumber: row.paymentNumber,
      'Cumulative Interest': Math.round(row.runningInterest),
      'Cumulative Principal': Math.round(row.runningPrincipal),
      'Loan Balance': Math.round(row.endingBalance),
    }));
  }, [results]);

  const getChartDataAnnualAllocations = useMemo(() => {
    if (!results) return [];
    const pYr = getPeriodsPerYear(inputs.paymentFrequency);
    const data: any[] = [];
    
    let yearSumInterest = 0;
    let yearSumPrincipal = 0;
    let yearIndex = 1;

    results.schedule.forEach((row, idx) => {
      yearSumInterest += row.interest;
      yearSumPrincipal += row.principal;
      
      if ((idx + 1) % pYr === 0 || idx === results.schedule.length - 1) {
        data.push({
          name: `Year ${yearIndex}`,
          'Interest Paid': Math.round(yearSumInterest),
          'Principal Repaid': Math.round(yearSumPrincipal),
        });
        yearSumInterest = 0;
        yearSumPrincipal = 0;
        yearIndex++;
      }
    });

    return data;
  }, [results, inputs.paymentFrequency]);

  // Smart insights rule-based triggers
  const insights = useMemo(() => {
    if (!results) return [];
    const list: string[] = [];
    
    const principal = Number(inputs.loanAmount) || 0;
    const termYears = Number(inputs.loanTerm) || 0;
    const rate = Number(inputs.interestRate) || 0;
    const interestRatio = results.totalInterest / (results.totalPrincipal || 1);

    // Insight 1: Interest vs Principal crossover point
    let crossoverPayment = -1;
    for (let i = 0; i < results.schedule.length; i++) {
      if (results.schedule[i].interest < results.schedule[i].principal - results.schedule[i].extraPayment) {
        crossoverPayment = results.schedule[i].paymentNumber;
        break;
      }
    }
    const pYr = getPeriodsPerYear(inputs.paymentFrequency);
    if (crossoverPayment !== -1) {
      const crossoverYear = (crossoverPayment / pYr).toFixed(1);
      list.push(`Principal repayment exceeds interest portion starting at Payment #${crossoverPayment} (approximately Year ${crossoverYear}).`);
    } else {
      list.push(`Due to high rates or short term structure, interest matches or exceeds principal component for almost the entire duration.`);
    }

    // Insight 2: Total interest weight
    const interestWeight = (results.totalInterest / (principal || 1)) * 100;
    list.push(`You will pay approximately ${interestWeight.toFixed(0)}% of the original loan principal amount as cumulative interest over time.`);

    // Insight 3: Extra monthly payment impact
    if (results.interestSaved > 0) {
      list.push(`Your optional additions and pre-payments save a massive ${fmt(results.interestSaved)} in cumulative interest.`);
      if (results.timeSavedMonths > 0) {
        const yearsSaved = (results.timeSavedMonths / pYr).toFixed(1);
        list.push(`These payment strategies accelerate your debt-free timeline by ${results.timeSavedMonths} periods (approx. ${yearsSaved} years).`);
      }
    } else {
      list.push(`Adding a standard extra $100 monthly would save significant cumulative interest and pay off the loan years ahead of schedule.`);
    }

    // Insight 4: Frontloading of interest
    const firstHalfCount = Math.floor(results.schedule.length / 2);
    if (firstHalfCount > 0) {
      const firstHalfInterest = results.schedule.slice(0, firstHalfCount).reduce((sum, r) => sum + r.interest, 0);
      const firstHalfPercentage = (firstHalfInterest / results.totalInterest) * 100;
      list.push(`Approximately ${firstHalfPercentage.toFixed(0)}% of the entire loan's interest is accumulated during the first half of the term.`);
    }

    // Insight 5: Impact of longer loan term
    if (termYears > 15) {
      list.push(`A standard 30-year term accumulates over double the total interest compared to a 15-year term structure at the same rate.`);
    }

    return list;
  }, [results, inputs, inputs.paymentFrequency]);

  // Trigger Print layout
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 font-sans text-neutral-800 dark:text-neutral-100 selection:bg-blue-500/30">
      
      {/* JSON-LD Structured Data Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Cumulative Interest Calculator",
          "url": "https://calculatoora.com/calculators/cumulative-interest-calculator",
          "description": "Calculate accumulated loan interest over specific dates, payment ranges, and custom timelines. Compare extra monthly payment models in real time.",
          "applicationCategory": "FinancialApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "mainEntity": {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is cumulative interest?",
                "value": "Cumulative interest is the running sum of all interest payments made over the duration of a loan or a specific portion of its life."
              },
              {
                "@type": "Question",
                "name": "Why is interest higher during early payments?",
                "value": "Interest is calculated on the remaining principal balance. Because the principal balance is highest at the beginning of the loan, the early payments allocate a larger share to interest."
              }
            ]
          }
        })}
      </script>

      {/* Hero Header */}
      <div className="mb-8 text-center print:hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-blue-100/60 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200/50 dark:border-blue-800/40 select-none">
          <Sparkles className="w-3.5 h-3.5" /> High-Fidelity Debt Modeling
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Cumulative Interest Calculator
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
          An advanced interest analysis platform. Compute compounding accumulation, model variable interest schedules, optimize extra payments, and pinpoint exactly how interest builds.
        </p>
      </div>

      {/* Top Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60 print:hidden backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={handleLoadExample}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-neutral-950 rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" /> Load Realistic Example
          </button>
          <button 
            type="button"
            onClick={handleClearAll}
            className="px-4 py-2 text-xs font-bold bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All Fields
          </button>
        </div>

        <div className="text-xs text-neutral-400 font-mono">
          Status: <span className={isValid ? "text-emerald-500" : "text-amber-500"}>{isValid ? "● Ready" : "○ Awaiting Required Inputs"}</span>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Inputs (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-100/40 dark:shadow-none space-y-6">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <Coins className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
              1. Base Loan Coordinates
            </h2>

            {/* Core Required Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Loan Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">$</span>
                  <input 
                    type="number"
                    value={inputs.loanAmount}
                    onChange={(e) => setInputs(prev => ({ ...prev, loanAmount: e.target.value }))}
                    placeholder="e.g. 250000"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Interest Rate (APR %) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">%</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={inputs.interestRate}
                    onChange={(e) => setInputs(prev => ({ ...prev, interestRate: e.target.value }))}
                    placeholder="e.g. 6.5"
                    className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Loan Term (Years) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number"
                  value={inputs.loanTerm}
                  onChange={(e) => setInputs(prev => ({ ...prev, loanTerm: e.target.value }))}
                  placeholder="e.g. 30"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Down Payment
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">$</span>
                  <input 
                    type="number"
                    value={inputs.downPayment}
                    onChange={(e) => setInputs(prev => ({ ...prev, downPayment: e.target.value }))}
                    placeholder="e.g. 50000"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Frequencies and Advanced Settings */}
            <div className="pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">Frequencies & Chronology</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Payment Frequency
                  </label>
                  <select 
                    value={inputs.paymentFrequency}
                    onChange={(e: any) => setInputs(prev => ({ ...prev, paymentFrequency: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="monthly">Monthly (12/yr)</option>
                    <option value="biweekly">Bi-weekly (26/yr)</option>
                    <option value="weekly">Weekly (52/yr)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Compounding Frequency
                  </label>
                  <select 
                    value={inputs.compoundingFrequency}
                    onChange={(e: any) => setInputs(prev => ({ ...prev, compoundingFrequency: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="daily">Daily (365/yr)</option>
                    <option value="monthly">Monthly (12/yr)</option>
                    <option value="quarterly">Quarterly (4/yr)</option>
                    <option value="annually">Annually (1/yr)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Loan Start Date
                  </label>
                  <input 
                    type="month"
                    value={inputs.startDate}
                    onChange={(e) => setInputs(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Projected Inflation Rate (%)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">%</span>
                    <input 
                      type="number"
                      step="0.1"
                      value={inputs.inflationRate}
                      onChange={(e) => setInputs(prev => ({ ...prev, inflationRate: e.target.value }))}
                      placeholder="e.g. 2.5"
                      className="w-full pl-3 pr-8 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Taxes & Addons */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">Taxes, Insurance, & Balloon Payments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Property Tax
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">$</span>
                    <input 
                      type="number"
                      value={inputs.taxes}
                      onChange={(e) => setInputs(prev => ({ ...prev, taxes: e.target.value }))}
                      placeholder="e.g. 3600"
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Annual Home Insurance
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">$</span>
                    <input 
                      type="number"
                      value={inputs.insurance}
                      onChange={(e) => setInputs(prev => ({ ...prev, insurance: e.target.value }))}
                      placeholder="e.g. 1200"
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                    Balloon Payment
                    <Info className="w-3.5 h-3.5 text-neutral-400 cursor-help" title="Lump sum payment due at the final term limit of the loan" />
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">$</span>
                    <input 
                      type="number"
                      value={inputs.balloonPayment}
                      onChange={(e) => setInputs(prev => ({ ...prev, balloonPayment: e.target.value }))}
                      placeholder="e.g. 50000"
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Loan Fees & Upfront Costs
                  </label>
                  <div className="grid grid-cols-12 gap-1">
                    <div className="col-span-8 relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400 text-[10px] font-bold">
                        {inputs.feesType === 'flat' ? '$' : '%'}
                      </span>
                      <input 
                        type="number"
                        value={inputs.loanFees}
                        onChange={(e) => setInputs(prev => ({ ...prev, loanFees: e.target.value }))}
                        placeholder="e.g. 2500"
                        className="w-full pl-5 pr-1 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <select 
                      value={inputs.feesType}
                      onChange={(e: any) => setInputs(prev => ({ ...prev, feesType: e.target.value }))}
                      className="col-span-4 px-1 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-[10px]"
                    >
                      <option value="flat">USD ($)</option>
                      <option value="percent">Percent (%)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="addFeesToLoan"
                  checked={inputs.addFeesToLoan}
                  onChange={(e) => setInputs(prev => ({ ...prev, addFeesToLoan: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded bg-neutral-100 border-neutral-300 focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="addFeesToLoan" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 cursor-pointer">
                  Capitalize fees (add upfront fees into initial loan principal)
                </label>
              </div>
            </div>

            {/* Standard Extra Payments Portion */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">Recurring Prepayments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Extra Monthly Prepayment
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">$</span>
                    <input 
                      type="number"
                      value={inputs.extraMonthly}
                      onChange={(e) => setInputs(prev => ({ ...prev, extraMonthly: e.target.value }))}
                      placeholder="e.g. 200"
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Extra Annual Prepayment
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">$</span>
                    <input 
                      type="number"
                      value={inputs.extraAnnual}
                      onChange={(e) => setInputs(prev => ({ ...prev, extraAnnual: e.target.value }))}
                      placeholder="e.g. 1500"
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Unlimited Event-based prepayments list */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Custom Prepayment Events</h3>
                <button 
                  type="button"
                  onClick={handleAddExtraPaymentEvent}
                  className="px-2.5 py-1 text-[10px] bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-cyan-400 font-bold rounded-lg border border-blue-200/55 dark:border-blue-900/40 cursor-pointer flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" /> Add Event
                </button>
              </div>

              {inputs.extraPaymentsList.length === 0 ? (
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 italic">No custom prepayment events configured yet.</p>
              ) : (
                <div className="space-y-3">
                  {inputs.extraPaymentsList.map((evt, idx) => (
                    <div key={evt.id} className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-800">
                      <div className="w-24">
                        <label className="block text-[9px] font-bold text-neutral-400 mb-0.5">Amount</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none text-neutral-400 text-[10px] font-bold">$</span>
                          <input 
                            type="number"
                            value={evt.amount}
                            onChange={(e) => handleUpdateExtraPaymentEvent(evt.id, 'amount', e.target.value)}
                            placeholder="5000"
                            className="w-full pl-4 pr-1 py-1 rounded bg-white dark:bg-neutral-800 text-xs border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="w-24">
                        <label className="block text-[9px] font-bold text-neutral-400 mb-0.5">Start Month #</label>
                        <input 
                          type="number"
                          value={evt.startMonth}
                          onChange={(e) => handleUpdateExtraPaymentEvent(evt.id, 'startMonth', e.target.value)}
                          placeholder="36"
                          className="w-full px-1.5 py-1 rounded bg-white dark:bg-neutral-800 text-xs border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                        />
                      </div>

                      <div className="flex-1 min-w-[100px]">
                        <label className="block text-[9px] font-bold text-neutral-400 mb-0.5">Frequency</label>
                        <select 
                          value={evt.frequency}
                          onChange={(e: any) => handleUpdateExtraPaymentEvent(evt.id, 'frequency', e.target.value)}
                          className="w-full px-1.5 py-1 rounded bg-white dark:bg-neutral-800 text-[11px] border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                        >
                          <option value="one-time">One-Time</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>

                      <button 
                        type="button"
                        onClick={() => handleRemoveExtraPaymentEvent(evt.id)}
                        className="p-1 mt-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 rounded cursor-pointer transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Variable Schedule Interest Rates */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Variable Rate Schedule</h3>
                  <Info className="w-3.5 h-3.5 text-neutral-400 cursor-help" title="Configure rate adjustments at specific milestones to simulate adjustable rate loans (ARMs)." />
                </div>
                <button 
                  type="button"
                  onClick={handleAddVariableRateEvent}
                  className="px-2.5 py-1 text-[10px] bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-cyan-400 font-bold rounded-lg border border-indigo-200/55 dark:border-indigo-900/40 cursor-pointer flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" /> Add Rate Adjustment
                </button>
              </div>

              {inputs.variableSchedule.length === 0 ? (
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 italic">No variable adjustments active (constant flat rate applies).</p>
              ) : (
                <div className="space-y-3">
                  {inputs.variableSchedule.map((evt) => (
                    <div key={evt.id} className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-800">
                      <div className="flex-1">
                        <label className="block text-[9px] font-bold text-neutral-400 mb-0.5">Effective Payment #</label>
                        <input 
                          type="number"
                          value={evt.paymentNumber}
                          onChange={(e) => handleUpdateVariableRateEvent(evt.id, 'paymentNumber', e.target.value)}
                          placeholder="e.g. 120"
                          className="w-full px-1.5 py-1 rounded bg-white dark:bg-neutral-800 text-xs border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-[9px] font-bold text-neutral-400 mb-0.5">Adjusted Rate (%)</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 right-0 pr-1.5 flex items-center pointer-events-none text-neutral-400 text-[10px] font-bold">%</span>
                          <input 
                            type="number"
                            step="0.01"
                            value={evt.newRate}
                            onChange={(e) => handleUpdateVariableRateEvent(evt.id, 'newRate', e.target.value)}
                            placeholder="5.25"
                            className="w-full pl-1.5 pr-4 py-1 rounded bg-white dark:bg-neutral-800 text-xs border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                          />
                        </div>
                      </div>

                      <button 
                        type="button"
                        onClick={() => handleRemoveVariableRateEvent(evt.id)}
                        className="p-1 mt-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 rounded cursor-pointer transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Calculations & Interactive Visualizations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Validation Warnings / Pending fields message */}
          {!isValid ? (
            <div className="p-10 bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center space-y-4 shadow-sm print:hidden">
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-amber-500">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-neutral-800 dark:text-white uppercase tracking-wider">Awaiting Parameters</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1">
                  {validationErrors[0]} Enter your loan amount, interest rate, and term details to unlock the world's most detailed cumulative interest report.
                </p>
              </div>
              <button 
                type="button"
                onClick={handleLoadExample}
                className="px-4 py-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800 rounded-xl transition cursor-pointer"
              >
                Or Load Demo Data
              </button>
            </div>
          ) : (
            results && (
              <div className="space-y-6">
                
                {/* 1. Results Navigation Tabs */}
                <div className="flex border-b border-neutral-200 dark:border-neutral-800 pb-px print:hidden overflow-x-auto gap-2">
                  {[
                    { id: 'dashboard', label: 'Realtime Dashboard', icon: Sliders },
                    { id: 'analysis', label: 'Timeframe Analysis', icon: Calendar },
                    { id: 'comparison', label: 'Scenario Comparison', icon: Layers },
                    { id: 'table', label: 'Amortization Table', icon: FileText },
                    { id: 'seo', label: 'Educational Guide', icon: Info }
                  ].map((t) => {
                    const IconComp = t.icon;
                    const isSelected = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id as any)}
                        className={`py-2.5 px-4 text-xs font-black rounded-t-xl transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border-b-2 ${
                          isSelected 
                            ? 'text-blue-600 border-blue-500 dark:text-cyan-400 dark:border-cyan-400 bg-blue-50/30 dark:bg-neutral-850' 
                            : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white border-transparent'
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Component Renderers */}
                {activeTab === 'dashboard' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Bento Results Panel */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      
                      {/* Main Big Output: Total Cumulative Interest */}
                      <div className="col-span-1 sm:col-span-2 md:col-span-3 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-neutral-900 dark:to-neutral-950 text-white rounded-3xl border border-blue-500/20 dark:border-neutral-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-widest text-blue-100 dark:text-neutral-400">Projected Total Cumulative Interest</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 dark:bg-neutral-800 text-blue-100">Amortized Schedule</span>
                          </div>
                          <div className="text-4xl sm:text-5xl font-black tracking-tight mt-3 font-mono drop-shadow-sm">
                            {fmt(results.totalInterest)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-white/10">
                          <div>
                            <span className="block text-[10px] font-bold text-blue-200 dark:text-neutral-400 uppercase tracking-wider">Interest Savings</span>
                            <span className="text-sm font-extrabold text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                              {results.interestSaved > 0 ? `+ ${fmt(results.interestSaved)}` : '$0.00 Saved'}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-blue-200 dark:text-neutral-400 uppercase tracking-wider">Estimated Payoff Date</span>
                            <span className="text-sm font-extrabold text-white font-mono mt-0.5">{results.payoffDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Remaining Loan Balance */}
                      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl flex flex-col justify-between shadow-sm">
                        <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Current Loan Balance</span>
                        <div className="text-xl font-bold font-mono text-neutral-950 dark:text-white mt-1">
                          {fmt(0)} <span className="text-[10px] text-neutral-400">(at payoff)</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-2 block">Original principal repaid</span>
                      </div>

                      {/* Cumulative Principal Repaid */}
                      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl flex flex-col justify-between shadow-sm">
                        <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Total Principal Repaid</span>
                        <div className="text-xl font-bold font-mono text-neutral-950 dark:text-white mt-1">
                          {fmt(results.totalPrincipal)}
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-2 block">Includes prepayments</span>
                      </div>

                      {/* Interest Outflow Share */}
                      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl flex flex-col justify-between shadow-sm">
                        <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Interest Component Share</span>
                        <div className="text-xl font-bold font-mono text-neutral-950 dark:text-white mt-1">
                          {((results.totalInterest / results.totalPayments) * 100 || 0).toFixed(1)}%
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-2 block">Of total scheduled payments</span>
                      </div>

                      {/* Average Interest per Payment Period */}
                      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl flex flex-col justify-between shadow-sm">
                        <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Avg Payment Interest</span>
                        <div className="text-xl font-bold font-mono text-neutral-950 dark:text-white mt-1">
                          {fmt(results.totalInterest / results.schedule.length)}
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-2 block">Across entire amortized span</span>
                      </div>

                      {/* Average Principal per Payment Period */}
                      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl flex flex-col justify-between shadow-sm">
                        <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Avg Payment Principal</span>
                        <div className="text-xl font-bold font-mono text-neutral-950 dark:text-white mt-1">
                          {fmt(results.totalPrincipal / results.schedule.length)}
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-2 block">Monthly principal velocity</span>
                      </div>

                      {/* Real Inflation Adjusted Interest */}
                      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl flex flex-col justify-between shadow-sm">
                        <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                          Real Interest Paid
                          <Info className="w-3 h-3 text-neutral-400 cursor-help" title="Interest adjusted by inflation to represent modern real spending power equivalents" />
                        </span>
                        <div className="text-xl font-bold font-mono text-neutral-950 dark:text-white mt-1">
                          {fmt(results.realTotalInterest)}
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-2 block">Inflation-discounted value</span>
                      </div>

                    </div>

                    {/* Rule-based Smart Insights widget */}
                    <div className="p-5 bg-blue-50/50 dark:bg-neutral-900/40 border border-blue-100 dark:border-neutral-800 rounded-3xl space-y-3">
                      <h3 className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> Smart Cumulative Interest Insights
                      </h3>
                      <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                        {insights.map((ins, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 dark:text-cyan-400 font-bold mt-0.5">•</span>
                            <span>{ins}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Charts Visualization Section */}
                    <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-800 dark:text-white">Cumulative Visualizations</h3>
                          <p className="text-[10px] text-neutral-400">Interactive timeline analyses of interest & debt components</p>
                        </div>
                        
                        {/* Selector tabs for specific charts */}
                        <div className="flex flex-wrap gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                          {[
                            { id: 'cumulative', label: 'Accumulation' },
                            { id: 'balance', label: 'Balance Timeline' },
                            { id: 'annualBar', label: 'Annual Contributions' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setChartSelection(opt.id as any)}
                              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                                chartSelection === opt.id 
                                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' 
                                  : 'text-neutral-400 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recharts Container */}
                      <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          {chartSelection === 'cumulative' ? (
                            <AreaChart data={getChartDataTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorPri" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
                              <XAxis dataKey="name" stroke="#888888" fontSize={9} />
                              <YAxis stroke="#888888" fontSize={9} tickFormatter={(v) => `$${v}`} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#fff', fontSize: 11 }}
                                formatter={(val) => [`$${Number(val).toLocaleString()}`]}
                              />
                              <Legend wrapperStyle={{ fontSize: 10 }} />
                              <Area type="monotone" dataKey="Cumulative Interest" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInt)" strokeWidth={2} />
                              <Area type="monotone" dataKey="Cumulative Principal" stroke="#10b981" fillOpacity={1} fill="url(#colorPri)" strokeWidth={2} />
                            </AreaChart>
                          ) : chartSelection === 'balance' ? (
                            <LineChart data={getChartDataTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
                              <XAxis dataKey="name" stroke="#888888" fontSize={9} />
                              <YAxis stroke="#888888" fontSize={9} tickFormatter={(v) => `$${v}`} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#fff', fontSize: 11 }}
                                formatter={(val) => [`$${Number(val).toLocaleString()}`]}
                              />
                              <Legend wrapperStyle={{ fontSize: 10 }} />
                              <Line type="monotone" dataKey="Loan Balance" stroke="#ef4444" strokeWidth={2.5} dot={false} />
                            </LineChart>
                          ) : (
                            <BarChart data={getChartDataAnnualAllocations} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
                              <XAxis dataKey="name" stroke="#888888" fontSize={9} />
                              <YAxis stroke="#888888" fontSize={9} tickFormatter={(v) => `$${v}`} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#fff', fontSize: 11 }}
                                formatter={(val) => [`$${Number(val).toLocaleString()}`]}
                              />
                              <Legend wrapperStyle={{ fontSize: 10 }} />
                              <Bar dataKey="Interest Paid" fill="#3b82f6" stackId="a" radius={[2, 2, 0, 0]} />
                              <Bar dataKey="Principal Repaid" fill="#10b981" stackId="a" radius={[2, 2, 0, 0]} />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-850">
                        <span>💡 Tip: Click legend items or switch views to analyze principal vs interest decay patterns.</span>
                        <span className="font-mono text-[10px]">Data updated in real time</span>
                      </div>
                    </div>

                  </motion.div>
                )}

                {activeTab === 'analysis' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-6"
                  >
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider text-neutral-800 dark:text-white flex items-center gap-1.5">
                        <Calendar className="w-5 h-5 text-indigo-500" /> Segmented Timeframe Analyzer
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Inspect how much interest accumulates up to any arbitrary date or during any payment range. Keep absolute control over scheduled debt windows.
                      </p>
                    </div>

                    {/* Range Mode Controls */}
                    <div className="space-y-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-800">
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'year', label: 'By Year' },
                          { id: 'month', label: 'By Month' },
                          { id: 'quarter', label: 'By Quarter' },
                          { id: 'payment', label: 'By Payment Number' },
                          { id: 'custom-range', label: 'Custom Payment Range' }
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setTimeAnalysisMode(m.id as any)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                              timeAnalysisMode === m.id 
                                ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-neutral-950' 
                                : 'bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>

                      {/* Interactive Sliders depending on Mode */}
                      {timeAnalysisMode !== 'custom-range' ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
                            <span>Target Horizon Value:</span>
                            <span className="text-blue-600 dark:text-cyan-400 font-mono font-black">
                              {timeAnalysisMode === 'year' && `Year ${timeAnalysisValue}`}
                              {timeAnalysisMode === 'month' && `Month ${timeAnalysisValue}`}
                              {timeAnalysisMode === 'quarter' && `Quarter ${timeAnalysisValue}`}
                              {timeAnalysisMode === 'payment' && `Payment #${timeAnalysisValue}`}
                            </span>
                          </div>
                          <input 
                            type="range"
                            min="1"
                            max={
                              timeAnalysisMode === 'year' ? Math.ceil(results.schedule.length / getPeriodsPerYear(inputs.paymentFrequency)) :
                              timeAnalysisMode === 'quarter' ? Math.ceil(results.schedule.length / (getPeriodsPerYear(inputs.paymentFrequency) / 4)) :
                              results.schedule.length
                            }
                            value={timeAnalysisValue}
                            onChange={(e) => setTimeAnalysisValue(Number(e.target.value))}
                            className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-neutral-400 uppercase">Start Payment Number</label>
                            <input 
                              type="number"
                              min="1"
                              max={results.schedule.length}
                              value={customRangeStart}
                              onChange={(e) => setCustomRangeStart(Number(e.target.value))}
                              className="w-full mt-1 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-neutral-400 uppercase">End Payment Number</label>
                            <input 
                              type="number"
                              min="1"
                              max={results.schedule.length}
                              value={customRangeEnd}
                              onChange={(e) => setCustomRangeEnd(Number(e.target.value))}
                              className="w-full mt-1 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Time Analysis Outputs */}
                    {customQueryStats && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/20 space-y-1">
                          <span className="block text-[10px] text-neutral-400 uppercase font-bold">Accumulated Interest in Period</span>
                          <span className="text-2xl font-mono font-black text-blue-600 dark:text-cyan-400">{fmt(customQueryStats.interestPaid)}</span>
                        </div>

                        <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/20 space-y-1">
                          <span className="block text-[10px] text-neutral-400 uppercase font-bold">Principal Paid off in Period</span>
                          <span className="text-2xl font-mono font-black text-emerald-500">{fmt(customQueryStats.principalPaid)}</span>
                        </div>

                        <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/20 space-y-1">
                          <span className="block text-[10px] text-neutral-400 uppercase font-bold">Remaining Loan Balance at End</span>
                          <span className="text-xl font-mono font-bold text-neutral-900 dark:text-white">{fmt(customQueryStats.endingBal)}</span>
                        </div>

                        <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/20 space-y-1">
                          <span className="block text-[10px] text-neutral-400 uppercase font-bold">Interest-to-Principal ratio</span>
                          <span className="text-xl font-mono font-bold text-amber-500">{customQueryStats.ratio.toFixed(1)}%</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'comparison' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-6"
                  >
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider text-neutral-800 dark:text-white flex items-center gap-1.5">
                        <Layers className="w-5 h-5 text-sky-500" /> Scenario Sandbox & Comparison
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Compare your current loan model against other structural alternatives. Save unlimited custom configurations to discover optimal payoff options instantly.
                      </p>
                    </div>

                    {/* Scenario Saver panel */}
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-850 flex flex-col sm:flex-row gap-3 items-end">
                      <div className="flex-1 w-full">
                        <label className="block text-[11px] font-bold text-neutral-500 uppercase">Save Current Setup As Scenario:</label>
                        <input 
                          type="text"
                          value={scenarioNameInput}
                          onChange={(e) => setScenarioNameInput(e.target.value)}
                          placeholder="e.g., With Extra $200 Payment"
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleSaveScenario}
                        className="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-neutral-950 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Save Scenario
                      </button>
                    </div>

                    {/* Saved Scenarios Table Comparison */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-400 uppercase tracking-wider">
                            <th className="py-2.5 px-3">Scenario Name</th>
                            <th className="py-2.5 px-3">Total Interest</th>
                            <th className="py-2.5 px-3">Interest Saved</th>
                            <th className="py-2.5 px-3">Time Saved</th>
                            <th className="py-2.5 px-3">Base Payment</th>
                            <th className="py-2.5 px-3">Final Cost</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Always render current active setup first */}
                          <tr className="border-b border-neutral-150 dark:border-neutral-850 bg-blue-50/20 dark:bg-neutral-850/25">
                            <td className="py-3 px-3 font-bold text-blue-600 dark:text-cyan-400">
                              Active Configuration <span className="text-[9px] font-mono font-normal">(Current inputs)</span>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold">{fmt(results.totalInterest)}</td>
                            <td className="py-3 px-3 font-mono text-emerald-500 font-bold">{results.interestSaved > 0 ? fmt(results.interestSaved) : '-'}</td>
                            <td className="py-3 px-3 font-mono text-emerald-500 font-bold">{results.timeSavedMonths > 0 ? `${results.timeSavedMonths} periods` : '-'}</td>
                            <td className="py-3 px-3 font-mono">{fmt(results.monthlyBasePayment)}</td>
                            <td className="py-3 px-3 font-mono">{fmt(results.totalPrincipal + results.totalInterest)}</td>
                            <td className="py-3 px-3 text-right text-[10px] text-neutral-400 italic">Active Mode</td>
                          </tr>

                          {/* Render custom scenarios */}
                          {scenarios.map((s) => (
                            <tr key={s.id} className="border-b border-neutral-150 dark:border-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-850/40">
                              <td className="py-3 px-3 font-bold text-neutral-800 dark:text-white">{s.name}</td>
                              <td className="py-3 px-3 font-mono">{fmt(s.result.totalInterest)}</td>
                              <td className="py-3 px-3 font-mono text-emerald-500 font-bold">{s.result.interestSaved > 0 ? fmt(s.result.interestSaved) : '-'}</td>
                              <td className="py-3 px-3 font-mono text-emerald-500 font-bold">{s.result.timeSavedMonths > 0 ? `${s.result.timeSavedMonths} periods` : '-'}</td>
                              <td className="py-3 px-3 font-mono">{fmt(s.result.monthlyBasePayment)}</td>
                              <td className="py-3 px-3 font-mono">{fmt(s.result.totalPrincipal + s.result.totalInterest)}</td>
                              <td className="py-3 px-3 text-right">
                                <button 
                                  type="button"
                                  onClick={() => handleRemoveScenario(s.id)}
                                  className="text-red-500 hover:text-red-600 font-bold transition cursor-pointer"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'table' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-black uppercase tracking-wider text-neutral-800 dark:text-white">Amortization Ledger</h3>
                        <p className="text-[10px] text-neutral-400">Chronological list of principal decay and compounding interest</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button 
                          onClick={exportCSV}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 text-[10px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" /> Export CSV
                        </button>
                        <button 
                          onClick={handlePrint}
                          className="px-3 py-1.5 bg-neutral-150 hover:bg-neutral-250 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-[10px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3 h-3" /> Print Schedule
                        </button>
                      </div>
                    </div>

                    {/* Search query box */}
                    <div className="relative max-w-xs">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <input 
                        type="text" 
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                        placeholder="Search date or Year..."
                        className="w-full text-xs pl-10 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-800 dark:text-white focus:outline-none"
                      />
                    </div>

                    {/* Ledger Amortization Table */}
                    <div className="overflow-x-auto border border-neutral-150 dark:border-neutral-850 rounded-2xl">
                      <table className="w-full text-xs text-left min-w-[800px]">
                        <thead>
                          <tr className="bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-850 text-[10px] text-neutral-400 uppercase tracking-wider">
                            {[
                              { key: 'paymentNumber', label: 'Payment #' },
                              { key: 'date', label: 'Date' },
                              { key: 'beginningBalance', label: 'Beginning Bal' },
                              { key: 'interest', label: 'Interest' },
                              { key: 'principal', label: 'Principal' },
                              { key: 'extraPayment', label: 'Extra Pay' },
                              { key: 'endingBalance', label: 'Ending Bal' },
                              { key: 'runningInterest', label: 'Cum. Interest' },
                              { key: 'runningPrincipal', label: 'Cum. Principal' }
                            ].map(col => (
                              <th 
                                key={col.key}
                                onClick={() => handleSortTable(col.key as any)}
                                className="py-3 px-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 select-none"
                              >
                                <div className="flex items-center gap-1">
                                  {col.label}
                                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedTableRows.map((row) => (
                            <tr key={row.paymentNumber} className="border-b border-neutral-150 dark:border-neutral-850 hover:bg-neutral-50/50 dark:hover:bg-neutral-850/20 font-mono">
                              <td className="py-2.5 px-3 font-sans font-bold">{row.paymentNumber}</td>
                              <td className="py-2.5 px-3 font-sans font-bold text-neutral-500">{row.date}</td>
                              <td className="py-2.5 px-3">{fmt(row.beginningBalance)}</td>
                              <td className="py-2.5 px-3 text-red-500">{fmt(row.interest)}</td>
                              <td className="py-2.5 px-3 text-emerald-500">{fmt(row.principal)}</td>
                              <td className="py-2.5 px-3 text-blue-500">{row.extraPayment > 0 ? fmt(row.extraPayment) : '-'}</td>
                              <td className="py-2.5 px-3 font-bold">{fmt(row.endingBalance)}</td>
                              <td className="py-2.5 px-3 font-bold text-red-600 dark:text-red-400">{fmt(row.runningInterest)}</td>
                              <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">{fmt(row.runningPrincipal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination control footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs">
                      <div className="text-neutral-400">
                        Showing rows <span className="text-neutral-800 dark:text-white font-bold">{Math.min(processedTableRows.length, (tablePage - 1) * tablePageSize + 1)}</span> to{' '}
                        <span className="text-neutral-800 dark:text-white font-bold">{Math.min(processedTableRows.length, tablePage * tablePageSize)}</span> of{' '}
                        <span className="text-neutral-800 dark:text-white font-bold">{processedTableRows.length}</span> rows
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={tablePage === 1}
                          onClick={() => setTablePage(prev => Math.max(1, prev - 1))}
                          className="px-3 py-1 bg-neutral-100 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200 rounded disabled:opacity-50 cursor-pointer"
                        >
                          Previous
                        </button>
                        <span className="px-3">Page <span className="font-bold">{tablePage}</span> of {totalTablePages}</span>
                        <button
                          type="button"
                          disabled={tablePage === totalTablePages}
                          onClick={() => setTablePage(prev => Math.min(totalTablePages, prev + 1))}
                          className="px-3 py-1 bg-neutral-100 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200 rounded disabled:opacity-50 cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'seo' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SEOEducationalPanel />
                  </motion.div>
                )}

              </div>
            )
          )}

        </div>

      </div>

      {/* Embedded SEO content below main layout to satisfy checklist requirements */}
      <div className="mt-12 pt-12 border-t border-neutral-200 dark:border-neutral-800 print:hidden">
        <SEOEducationalPanel />
      </div>

    </div>
  );
}

// --- SEO Long-form Educational Content Subcomponent ---
function SEOEducationalPanel() {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-8 text-left font-sans shadow-sm">
      
      {/* Educational Guide Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-wider">
          Cumulative Interest Calculator Deep-Dive Guide
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Master the mechanics of loan compounding, interest frontloading, and smart prepayment structures.
        </p>
      </div>

      {/* Long-form articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-10">
        
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest text-blue-600 dark:text-cyan-400">
            What Is Cumulative Interest?
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Cumulative interest represents the total summation of all interest payments made over the duration of a loan or a specific portion of its life. Unlike simple interest, which is calculated strictly on the initial principal value, cumulative interest inside amortized schedules accumulates progressively as the balance decreases, highlighting the overall financial overhead of borrowing over extended periods.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest text-blue-600 dark:text-cyan-400">
            How Loan Interest Accumulates
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            When you secure an amortized loan (such as a mortgage or car loan), your monthly payment is structured to remain fixed. However, the allocation of that payment shifts dynamically. Interest is computed on the remaining principal balance using the periodic interest rate. Consequently, early in the term when the outstanding balance is high, the interest portion dominates, and very little is paid toward principal.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest text-blue-600 dark:text-cyan-400">
            Why Interest Is Higher During Early Payments
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            This frontloading occurs because of the formula used for amortization. Because interest is always equal to <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-[10px] font-mono">Balance * Periodic Rate</code>, and the balance is largest at the beginning, interest is inherently frontloaded. For example, during the first years of a 30-year mortgage at 6%, up to 70% of each monthly payment goes directly toward interest, rather than reducing principal.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest text-blue-600 dark:text-cyan-400">
            How Extra Payments Reduce Interest
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Because interest is computed on the remaining principal balance, any additional money paid directly toward principal (prepayments) reduces the outstanding balance permanently. This bypasses the interest schedule for subsequent periods, creating a cascading compound interest savings effect. Adding even $100 monthly to a standard loan can cut thousands of dollars in cumulative interest and shorten the term by several years.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest text-blue-600 dark:text-cyan-400">
            How Loan Terms Affect Total Interest
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            The length of your loan is the most significant multiplier of cumulative interest. A $300,000 loan at 6% over 30 years will accumulate $347,514 in total interest, costing more in interest than the original loan principal! A 15-year term at the same rate accumulates only $154,385, saving over $193,000 in total interest and building equity twice as fast.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest text-blue-600 dark:text-cyan-400">
            Interest vs Principal Mechanics
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            By analyzing the interest-to-principal ratio, you can spot when your loan passes the crossover threshold. This is the milestone where your payment begins to pay off more principal than interest. Using a Cumulative Interest Calculator lets you simulate the exact date of this crossover and discover how extra payments pull this timeline forward.
          </p>
        </div>

      </div>

      {/* Worked Examples */}
      <div className="pt-6 border-t border-neutral-150 dark:border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold text-neutral-800 dark:text-white uppercase tracking-widest">
          Worked Historical Examples
        </h3>
        
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/20 text-xs space-y-3 leading-relaxed">
          <p>
            <strong>Case Study A (Baseline Mortgage):</strong> A family borrows $350,000 with a standard 30-year fixed rate mortgage at 6.5%.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Original monthly scheduled payment: $2,212.24</li>
            <li>Total interest scheduled: $446,407.81</li>
            <li>Interest paid during first 5 years: $109,242.01 (24.4% of total interest)</li>
            <li>Principal paid during first 5 years: $23,492.62 (Only 6.7% of total principal)</li>
          </ul>
          <p>
            <strong>Prepayment Strategy:</strong> By paying an extra $200 per month starting from day one, they reduce the loan term to 25.1 years, saving $84,112.50 in cumulative interest and fully paying off the loan 4.9 years early.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="pt-6 border-t border-neutral-150 dark:border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold text-neutral-800 dark:text-white uppercase tracking-widest">
          Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-4">
          {[
            {
              q: "Can I use this calculator for daily compounded credit cards?",
              a: "Yes. By selecting a 'Daily' compounding frequency and entering your current balance and APR, you can accurately track how daily interest builds over custom ranges."
            },
            {
              q: "What is a balloon payment?",
              a: "A balloon payment is a larger-than-normal lump-sum payment due at the end of the loan term, which lowers the regular scheduled payments during the term but requires a large final payoff."
            },
            {
              q: "How does inflation affect my cumulative interest?",
              a: "With a 2.5% inflation rate, future interest payments are made with less valuable dollars. The 'Real Interest' metric calculates the present-value purchasing equivalent of those future payments."
            },
            {
              q: "Does down payment reduce total interest?",
              a: "Yes. Down payment directly lowers the initial loan principal balance, meaning subsequent interest calculations are made on a smaller base balance from payment #1."
            }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5 text-xs">
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <span className="text-blue-500">Q:</span> {item.q}
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 pl-5 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Glossary of Financial Terms */}
      <div className="pt-6 border-t border-neutral-150 dark:border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold text-neutral-800 dark:text-white uppercase tracking-widest">
          Financial Glossary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <strong className="text-neutral-900 dark:text-white">Amortization:</strong>
            <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">The systematic paying off of a debt over time in equal payments consisting of principal and interest portions.</p>
          </div>
          <div>
            <strong className="text-neutral-900 dark:text-white">APR (Annual Percentage Rate):</strong>
            <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">The yearly cost of borrowing money, expressed as a interest rate percentage of the total loan amount.</p>
          </div>
          <div>
            <strong className="text-neutral-900 dark:text-white">Prepayment:</strong>
            <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">Any amount paid towards the principal balance of a loan ahead of the regular scheduled payments.</p>
          </div>
          <div>
            <strong className="text-neutral-900 dark:text-white">Principal:</strong>
            <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">The original sum of money borrowed, excluding any accrued interest or fees.</p>
          </div>
        </div>
      </div>

      {/* Related Calculators SPA Links */}
      <div className="pt-6 border-t border-neutral-150 dark:border-neutral-800 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">
          Related Financial Hubs
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Loan Calculator', hash: '#/calculators/ultimate-loan-calculator' },
            { label: 'Car Loan Calculator', hash: '#/calculators/car-loan-calculator' },
            { label: 'Mortgage Calculator', hash: '#/calculators/ultimate-loan-calculator' },
            { label: 'Interest Calculator', hash: '#/finance/simple-interest-calculator' },
            { label: 'Amortization Calculator', hash: '#/calculators/ultimate-loan-calculator' },
            { label: 'Debt Payoff Calculator', hash: '#/calculators/ultimate-loan-calculator' }
          ].map((link, idx) => (
            <a 
              key={idx}
              href={link.hash}
              className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-semibold rounded-xl transition border border-neutral-200/50 dark:border-neutral-850"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
