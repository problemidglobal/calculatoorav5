import React, { useState, useMemo, useRef } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  HelpCircle, 
  BookOpen, 
  ArrowRight, 
  Info, 
  Layers, 
  RefreshCw, 
  Check, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Download,
  Plus,
  Trash2,
  Copy,
  Printer,
  FileSpreadsheet,
  AlertCircle,
  PiggyBank,
  CheckCircle2,
  PieChart as PieIcon,
  LineChart as LineIcon,
  BarChart as BarIcon,
  Award,
  Search,
  Settings,
  Flame,
  Calendar,
  DollarSign as CurrencyIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { 
  FAQ_ARTICLES, 
  GLOSSARY_ITEMS, 
  WORKED_EXAMPLES, 
  RELATED_CALCULATORS, 
  EDUCATIONAL_CONTENT 
} from '../data/savingsCalculatorSeo';

import { 
  runSavingsSimulation, 
  SavingsEvent, 
  SimulationParams, 
  SimulationResult, 
  YearlyRecord 
} from '../utils/savingsMath';

interface ScenarioComparison {
  id: string;
  name: string;
  params: Partial<SimulationParams>;
  result: SimulationResult;
}

export default function SavingsCalculator() {
  // --- CORE INPUT STATES (All start EMPTY, never prefilled) ---
  const [currency, setCurrency] = useState<string>('$');
  const [initialSavings, setInitialSavings] = useState<number | ''>('');
  const [recurringDeposit, setRecurringDeposit] = useState<number | ''>('');
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'>('monthly');
  const [customFrequencyDays, setCustomFrequencyDays] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>('');
  const [years, setYears] = useState<number | ''>('');
  const [goalAmount, setGoalAmount] = useState<number | ''>('');

  // --- ADVANCED FACTORS STATES (All start EMPTY or default enum) ---
  const [compoundingFrequency, setCompoundingFrequency] = useState<'daily' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual'>('monthly');
  const [inflationRate, setInflationRate] = useState<number | ''>('');
  const [annualIncrease, setAnnualIncrease] = useState<number | ''>('');
  const [annualIncreaseType, setAnnualIncreaseType] = useState<'percentage' | 'amount'>('percentage');
  const [managementFee, setManagementFee] = useState<number | ''>('');
  const [managementFeeType, setManagementFeeType] = useState<'percentage' | 'amount'>('percentage');
  const [taxRate, setTaxRate] = useState<number | ''>('');

  // --- WITHDRAWALS STATE ---
  const [withdrawalAmount, setWithdrawalAmount] = useState<number | ''>('');
  const [withdrawalFrequency, setWithdrawalFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [withdrawalStartYear, setWithdrawalStartYear] = useState<number | ''>('');

  // --- CUSTOM SAVINGS EVENTS BUILDER ---
  const [events, setEvents] = useState<SavingsEvent[]>([]);

  // --- COMPARISON SCENARIOS ---
  const [scenarios, setScenarios] = useState<ScenarioComparison[]>([]);
  const [customScenarioName, setCustomScenarioName] = useState<string>('');

  // --- UI CONTROLS ---
  const [activeInputTab, setActiveInputTab] = useState<'core' | 'advanced' | 'events'>('core');
  const [activeChartTab, setActiveChartTab] = useState<'growth' | 'distribution' | 'annual'>('growth');
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');
  const [activeSeoTab, setActiveSeoTab] = useState<'guide' | 'worked' | 'faq' | 'glossary'>('guide');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [tableSortKey, setTableSortKey] = useState<keyof YearlyRecord>('year');
  const [tableSortDesc, setTableSortDesc] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);

  // --- LOAD EXAMPLE METHOD ---
  const loadExample = () => {
    setCurrency('$');
    setInitialSavings(10000);
    setRecurringDeposit(450);
    setRecurringFrequency('monthly');
    setInterestRate(5.5);
    setYears(12);
    setGoalAmount(100000);

    // Advanced features
    setCompoundingFrequency('monthly');
    setInflationRate(2.8);
    setAnnualIncrease(4);
    setAnnualIncreaseType('percentage');
    setManagementFee(0.15);
    setManagementFeeType('percentage');
    setTaxRate(15);

    // Regular Withdrawal
    setWithdrawalAmount(200);
    setWithdrawalFrequency('monthly');
    setWithdrawalStartYear(8);

    // Events
    setEvents([
      {
        id: 'event-1',
        description: 'Year 5 Bonus Boost',
        deposit: 5000,
        withdrawal: '',
        frequency: 'one-time',
        startYear: 5,
        endYear: 5,
        isExpanded: false
      },
      {
        id: 'event-2',
        description: 'Year 10 Car Downpayment',
        deposit: '',
        withdrawal: 12000,
        frequency: 'one-time',
        startYear: 10,
        endYear: 10,
        isExpanded: false
      }
    ]);
    
    setInfoMessage("A detailed 12-year milestones roadmap loaded with compounding, inflation adjustments, tax-drag, fees, and custom lump-sum events.");
  };

  // --- CLEAR ALL METHOD ---
  const clearAll = () => {
    setInitialSavings('');
    setRecurringDeposit('');
    setRecurringFrequency('monthly');
    setCustomFrequencyDays('');
    setInterestRate('');
    setYears('');
    setGoalAmount('');

    setCompoundingFrequency('monthly');
    setInflationRate('');
    setAnnualIncrease('');
    setAnnualIncreaseType('percentage');
    setManagementFee('');
    setManagementFeeType('percentage');
    setTaxRate('');

    setWithdrawalAmount('');
    setWithdrawalFrequency('monthly');
    setWithdrawalStartYear('');

    setEvents([]);
    setScenarios([]);
    setTableSearch('');
    setInfoMessage("All fields cleared successfully.");
  };

  // --- COMPILE SIMULATION PARAMETERS ---
  const activeParams = useMemo<Partial<SimulationParams>>(() => {
    return {
      initialSavings: initialSavings !== '' ? Number(initialSavings) : 0,
      recurringDeposit: recurringDeposit !== '' ? Number(recurringDeposit) : 0,
      recurringFrequency,
      customFrequencyDays: customFrequencyDays !== '' ? Number(customFrequencyDays) : 30,
      interestRate: interestRate !== '' ? Number(interestRate) : 0,
      years: years !== '' ? Number(years) : 0,
      compoundingFrequency,
      inflationRate: inflationRate !== '' ? Number(inflationRate) : 0,
      annualIncrease: annualIncrease !== '' ? Number(annualIncrease) : 0,
      annualIncreaseType,
      managementFee: managementFee !== '' ? Number(managementFee) : 0,
      managementFeeType,
      taxRate: taxRate !== '' ? Number(taxRate) : 0,
      withdrawalAmount: withdrawalAmount !== '' ? Number(withdrawalAmount) : 0,
      withdrawalFrequency,
      withdrawalStartYear: withdrawalStartYear !== '' ? Number(withdrawalStartYear) : 1,
      goalAmount: goalAmount !== '' ? Number(goalAmount) : 0,
      events
    };
  }, [
    initialSavings, recurringDeposit, recurringFrequency, customFrequencyDays,
    interestRate, years, compoundingFrequency, inflationRate, annualIncrease,
    annualIncreaseType, managementFee, managementFeeType, taxRate, withdrawalAmount,
    withdrawalFrequency, withdrawalStartYear, goalAmount, events
  ]);

  // --- EXECUTE MATH ENGINE ---
  const simulationResult = useMemo<SimulationResult | null>(() => {
    // We only trigger simulation if either initialSavings is present or recurring is present
    if (initialSavings === '' && recurringDeposit === '') {
      return null;
    }
    return runSavingsSimulation(activeParams);
  }, [activeParams]);

  // --- VALIDATION AND HELPER MESSAGES ---
  const validationErrors = useMemo<string[]>(() => {
    const errors: string[] = [];
    if (initialSavings !== '' && Number(initialSavings) < 0) {
      errors.push("Starting balance cannot be negative.");
    }
    if (interestRate !== '' && (Number(interestRate) < -100 || Number(interestRate) > 100)) {
      errors.push("Interest rate must be between -100% and 100%.");
    }
    if (years !== '' && Number(years) < 0) {
      errors.push("Duration term cannot be negative.");
    }
    if (inflationRate !== '' && (Number(inflationRate) < 0 || Number(inflationRate) > 50)) {
      errors.push("Inflation rate must be between 0% and 50% for standard models.");
    }
    if (taxRate !== '' && (Number(taxRate) < 0 || Number(taxRate) > 90)) {
      errors.push("Tax rate must be between 0% and 90%.");
    }
    return errors;
  }, [initialSavings, interestRate, years, inflationRate, taxRate]);

  // --- ADD TO COMPARE SCENARIOS ---
  const handleAddScenario = () => {
    if (!simulationResult) return;
    const name = customScenarioName.trim() || `Scenario ${scenarios.length + 1}`;
    
    // Prevent duplicated name
    if (scenarios.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      setInfoMessage("Scenario with this name already exists. Please choose another name.");
      return;
    }

    const newScenario: ScenarioComparison = {
      id: `scenario-${Date.now()}`,
      name,
      params: { ...activeParams },
      result: { ...simulationResult }
    };

    setScenarios([...scenarios, newScenario]);
    setCustomScenarioName('');
    setInfoMessage(`Added "${name}" to scenario comparison stack.`);
  };

  const handleRemoveScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  // Find the highest wealth yielding scenario in the comparison pool
  const bestScenario = useMemo(() => {
    if (scenarios.length === 0) return null;
    let best = scenarios[0];
    for (let i = 1; i < scenarios.length; i++) {
      if (scenarios[i].result.futureValue > best.result.futureValue) {
        best = scenarios[i];
      }
    }
    return best;
  }, [scenarios]);

  // --- CUSTOM EVENT UTILITIES ---
  const handleAddEvent = () => {
    const newEvent: SavingsEvent = {
      id: `ev-${Date.now()}`,
      description: `Event ${events.length + 1}`,
      deposit: '',
      withdrawal: '',
      frequency: 'one-time',
      startYear: '',
      endYear: '',
      isExpanded: true
    };
    setEvents([...events, newEvent]);
  };

  const handleUpdateEvent = (id: string, updatedFields: Partial<SavingsEvent>) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, ...updatedFields } : ev));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const handleDuplicateEvent = (ev: SavingsEvent) => {
    const duplicated: SavingsEvent = {
      ...ev,
      id: `ev-${Date.now()}`,
      description: `${ev.description} (Copy)`,
      isExpanded: true
    };
    setEvents([...events, duplicated]);
  };

  // --- TABLE LOGIC (SEARCH, FILTER & SORT) ---
  const processedYearlyRecords = useMemo(() => {
    if (!simulationResult) return [];
    let records = [...simulationResult.yearlyRecords];

    // Simple search filter on year number
    if (tableSearch.trim() !== '') {
      const searchNum = Number(tableSearch);
      if (!isNaN(searchNum)) {
        records = records.filter(r => r.year === searchNum);
      }
    }

    // Sort logic
    records.sort((a, b) => {
      const valA = a[tableSortKey];
      const valB = b[tableSortKey];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return tableSortDesc ? valB - valA : valA - valB;
      }
      return 0;
    });

    return records;
  }, [simulationResult, tableSearch, tableSortKey, tableSortDesc]);

  const handleSort = (key: keyof YearlyRecord) => {
    if (tableSortKey === key) {
      setTableSortDesc(!tableSortDesc);
    } else {
      setTableSortKey(key);
      setTableSortDesc(false);
    }
  };

  // --- DATA EXPORT SERVICES ---
  const exportToCSV = () => {
    if (!simulationResult) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Year,Opening Balance,Deposits,Interest,Fees,Taxes,Withdrawals,Closing Balance,Real Value (Inflation Adjusted)\n";
    
    simulationResult.yearlyRecords.forEach(r => {
      const row = [
        r.year,
        r.openingBalance.toFixed(2),
        r.deposits.toFixed(2),
        r.interest.toFixed(2),
        r.fees.toFixed(2),
        r.taxes.toFixed(2),
        r.withdrawals.toFixed(2),
        r.closingBalance.toFixed(2),
        r.inflationAdjustedClosing.toFixed(2)
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "savings_breakdown_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToTextReport = () => {
    if (!simulationResult) return;
    let content = `==================================================\n`;
    content += `CALCULATOORA SAVINGS REPORT\n`;
    content += `==================================================\n`;
    content += `Nominal Future Value: ${currency}${simulationResult.futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    content += `Purchasing Power Value (Inflation Adjusted): ${currency}${simulationResult.inflationAdjustedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    content += `Total Principal Invested: ${currency}${simulationResult.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    content += `Cumulative Interest Earned: ${currency}${simulationResult.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    content += `Taxes Deducted: ${currency}${simulationResult.totalTaxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    content += `Fees Accumulation: ${currency}${simulationResult.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    content += `Goal Achieve Status: ${simulationResult.isGoalAchieved ? 'ACHIEVED' : 'NOT REACHED'}\n`;
    if (simulationResult.timeToGoalMonths !== -1) {
      content += `Months to Reach Goal: ${simulationResult.timeToGoalMonths} months (${(simulationResult.timeToGoalMonths / 12).toFixed(1)} years)\n`;
    }
    content += `==================================================\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "savings_calculator_summary.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const exportChartAsPng = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true
        });
        const link = document.createElement('a');
        link.download = 'savings_projection_chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        setInfoMessage("Could not capture chart as PNG. Try printing or saving the PDF.");
      }
    }
  };

  // --- RECHARTS DYNAMIC PREPARATION ---
  const chartData = useMemo(() => {
    if (!simulationResult) return [];
    return simulationResult.yearlyRecords.map(r => ({
      year: `Yr ${r.year}`,
      'Total Savings': Math.round(r.closingBalance),
      'Inflation Adjusted': Math.round(r.inflationAdjustedClosing),
      'Deposits Accumulation': Math.round(r.deposits + (r.openingBalance === initialSavings ? Number(initialSavings) : 0)),
      'Interest Accrued': Math.round(r.interest)
    }));
  }, [simulationResult, initialSavings]);

  const pieChartData = useMemo(() => {
    if (!simulationResult) return [];
    return [
      { name: 'Principal Savings', value: Math.round(Number(initialSavings) || 0), color: '#3b82f6' },
      { name: 'Total Extra Deposits', value: Math.round(simulationResult.totalDeposits), color: '#10b981' },
      { name: 'Net Compound Interest', value: Math.round(simulationResult.totalInterest), color: '#8b5cf6' }
    ].filter(item => item.value > 0);
  }, [simulationResult, initialSavings]);

  // --- SMART RULE-BASED INSIGHTS ---
  const smartInsights = useMemo<string[]>(() => {
    if (!simulationResult) return [];
    const insights: string[] = [];
    const fv = simulationResult.futureValue;
    const deposits = simulationResult.totalDeposits + (initialSavings !== '' ? Number(initialSavings) : 0);
    const interest = simulationResult.totalInterest;

    if (interest > deposits) {
      insights.push(`🔥 Exponential Milestone: Your compounding interest yield (${currency}${Math.round(interest).toLocaleString()}) exceeds your total cash contributions (${currency}${Math.round(deposits).toLocaleString()})! This represents a mature, self-sustaining growth portfolio.`);
    } else if (interest > deposits * 0.5) {
      insights.push(`⭐ Significant Growth: Interest represents over 33% of your total portfolio value. Time and compound yield are doing heavy lifting.`);
    }

    if (inflationRate && Number(inflationRate) > 0) {
      const difference = fv - simulationResult.inflationAdjustedValue;
      insights.push(`💸 Inflation Impact: Over your simulation term, a steady ${inflationRate}% annual inflation rate degrades the purchasing power of your closing balance by ${currency}${Math.round(difference).toLocaleString()} (${Math.round((difference / fv) * 100)}% purchasing loss).`);
    }

    if (simulationResult.isGoalAchieved) {
      const yrs = (simulationResult.timeToGoalMonths / 12).toFixed(1);
      insights.push(`🎯 Goal Cleared! You will achieve your financial milestone of ${currency}${Number(goalAmount).toLocaleString()} in Year ${yrs} (${simulationResult.timeToGoalMonths} months).`);
    } else if (goalAmount) {
      const gap = Number(goalAmount) - fv;
      insights.push(`⚠️ Savings Gap: You are projected to finish ${currency}${Math.round(gap).toLocaleString()} short of your target milestone. Consider bumping monthly deposits by 10% or extending your saving term.`);
    }

    if (taxRate && Number(taxRate) > 0) {
      insights.push(`📉 Tax Drag: A ${taxRate}% capital gains tax on interest reduced your potential future portfolio yield by ${currency}${Math.round(simulationResult.totalTaxes).toLocaleString()}. Consider using tax-sheltered accounts.`);
    }

    if (managementFee && Number(managementFee) > 0) {
      insights.push(`⚙️ Management Costs: Ongoing fees chipped away ${currency}${Math.round(simulationResult.totalFees).toLocaleString()} from compound portfolio gains.`);
    }

    return insights;
  }, [simulationResult, currency, goalAmount, inflationRate, taxRate, managementFee, initialSavings]);

  return (
    <div id="savings-calculator-container" className="space-y-10">
      {/* Top Header Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600/90 to-indigo-800/90 p-8 text-white shadow-xl backdrop-blur-md">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-blue-100">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              Calculatoora Ultimate Calculator
            </div>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
              Savings Calculator
            </h1>
            <p className="mt-2 text-lg text-blue-100/90 max-w-2xl font-light">
              Evaluate compound yields, goal runways, step-up models, custom events, inflation, and fee impacts in a unified interactive framework.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadExample}
              id="btn-load-example"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 px-4 py-2.5 text-sm font-semibold shadow-md transition-all hover:bg-blue-50 hover:scale-105 active:scale-95"
            >
              <RefreshCw className="h-4 w-4 text-blue-600" />
              Load High-Yield Plan
            </button>
            <button
              onClick={clearAll}
              id="btn-clear-all"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 text-white border border-white/20 px-4 py-2.5 text-sm font-semibold hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <Trash2 className="h-4 w-4 text-red-300" />
              Clear Fields
            </button>
          </div>
        </div>
      </div>

      {/* Info messages */}
      <AnimatePresence>
        {infoMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
              <span>{infoMessage}</span>
            </div>
            <button onClick={() => setInfoMessage(null)} className="text-blue-500 hover:text-blue-700 text-xs font-medium">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: INPUTS COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-gray-200/80 bg-white shadow-md overflow-hidden">
            
            {/* Input Tabs Header */}
            <div className="flex border-b border-gray-200 bg-gray-50/50">
              <button
                onClick={() => setActiveInputTab('core')}
                className={`flex-1 py-3.5 text-sm font-semibold tracking-wide border-b-2 transition-all ${
                  activeInputTab === 'core' 
                    ? 'border-blue-600 text-blue-700 bg-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                Core Settings
              </button>
              <button
                onClick={() => setActiveInputTab('advanced')}
                className={`flex-1 py-3.5 text-sm font-semibold tracking-wide border-b-2 transition-all ${
                  activeInputTab === 'advanced' 
                    ? 'border-blue-600 text-blue-700 bg-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                Advanced Factors
              </button>
              <button
                onClick={() => setActiveInputTab('events')}
                className={`flex-1 py-3.5 text-sm font-semibold tracking-wide border-b-2 transition-all ${
                  activeInputTab === 'events' 
                    ? 'border-blue-600 text-blue-700 bg-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                Events & Schedule ({events.length})
              </button>
            </div>

            {/* Input Fields container */}
            <div className="p-6 space-y-5">
              
              {/* Core Settings Tab */}
              {activeInputTab === 'core' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Currency Accent</label>
                    <div className="grid grid-cols-5 gap-1 bg-gray-100 p-1 rounded-xl">
                      {['$', '€', '£', '¥', '₹'].map((curr) => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => setCurrency(curr)}
                          className={`py-1.5 text-center text-sm font-bold rounded-lg transition-all ${
                            currency === curr ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Initial Savings Balance</label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-400 text-sm font-bold">{currency}</span>
                      </div>
                      <input
                        type="number"
                        value={initialSavings}
                        onChange={(e) => setInitialSavings(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 5000"
                        className="block w-full rounded-xl border border-gray-200 py-3 pl-8 pr-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Recurring Deposit</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-400 text-sm font-bold">{currency}</span>
                        </div>
                        <input
                          type="number"
                          value={recurringDeposit}
                          onChange={(e) => setRecurringDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 300"
                          className="block w-full rounded-xl border border-gray-200 py-3 pl-8 pr-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Frequency</label>
                      <select
                        value={recurringFrequency}
                        onChange={(e: any) => setRecurringFrequency(e.target.value)}
                        className="block w-full rounded-xl border border-gray-200 py-3 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                        <option value="custom">Custom interval</option>
                      </select>
                    </div>
                  </div>

                  {recurringFrequency === 'custom' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Custom Interval (Days)</label>
                      <input
                        type="number"
                        value={customFrequencyDays}
                        onChange={(e) => setCustomFrequencyDays(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 45"
                        className="block w-full rounded-xl border border-gray-200 py-3 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Interest APY (%)</label>
                      <div className="relative rounded-xl shadow-sm">
                        <input
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 4.5"
                          step="0.01"
                          className="block w-full rounded-xl border border-gray-200 py-3 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-400 text-xs font-bold">%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Saving Term (Years)</label>
                      <div className="relative rounded-xl shadow-sm">
                        <input
                          type="number"
                          value={years}
                          onChange={(e) => setYears(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 10"
                          className="block w-full rounded-xl border border-gray-200 py-3 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-400 text-xs">Yrs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Target Savings Goal (Optional)</label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-400 text-sm font-bold">{currency}</span>
                      </div>
                      <input
                        type="number"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 50000"
                        className="block w-full rounded-xl border border-gray-200 py-3 pl-8 pr-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Factors Tab */}
              {activeInputTab === 'advanced' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Compounding Interval</label>
                    <select
                      value={compoundingFrequency}
                      onChange={(e: any) => setCompoundingFrequency(e.target.value)}
                      className="block w-full rounded-xl border border-gray-200 py-3 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    >
                      <option value="daily">Daily Compounding</option>
                      <option value="monthly">Monthly Compounding</option>
                      <option value="quarterly">Quarterly Compounding</option>
                      <option value="semi-annual">Semi-Annual Compounding</option>
                      <option value="annual">Annual Compounding</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Annual Inflation (%)</label>
                      <div className="relative rounded-xl shadow-sm">
                        <input
                          type="number"
                          value={inflationRate}
                          onChange={(e) => setInflationRate(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 2.5"
                          step="0.1"
                          className="block w-full rounded-xl border border-gray-200 py-3 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-400 text-xs">%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Annual Step-Up Increase</label>
                      <div className="flex gap-2">
                        <div className="relative rounded-xl shadow-sm flex-1">
                          <input
                            type="number"
                            value={annualIncrease}
                            onChange={(e) => setAnnualIncrease(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="e.g. 5"
                            className="block w-full rounded-xl border border-gray-200 py-3 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                          />
                        </div>
                        <select
                          value={annualIncreaseType}
                          onChange={(e: any) => setAnnualIncreaseType(e.target.value)}
                          className="rounded-xl border border-gray-200 text-xs px-2 focus:border-blue-500 focus:outline-none bg-gray-50"
                        >
                          <option value="percentage">%</option>
                          <option value="amount">{currency}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tax on Yield (%)</label>
                      <div className="relative rounded-xl shadow-sm">
                        <input
                          type="number"
                          value={taxRate}
                          onChange={(e) => setTaxRate(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 15"
                          className="block w-full rounded-xl border border-gray-200 py-3 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-400 text-xs">%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Management Fee</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={managementFee}
                          onChange={(e) => setManagementFee(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 0.25"
                          step="0.01"
                          className="block w-full flex-1 rounded-xl border border-gray-200 py-3 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        />
                        <select
                          value={managementFeeType}
                          onChange={(e: any) => setManagementFeeType(e.target.value)}
                          className="rounded-xl border border-gray-200 text-xs px-2 focus:border-blue-500 focus:outline-none bg-gray-50"
                        >
                          <option value="percentage">%</option>
                          <option value="amount">{currency}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-3.5">
                    <span className="block text-xs font-bold text-gray-600 tracking-wider">REGULAR WITHDRAWAL SCHEDULE</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Amount</label>
                        <div className="relative shadow-sm rounded-lg">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                            <span className="text-gray-400 text-xs font-bold">{currency}</span>
                          </div>
                          <input
                            type="number"
                            value={withdrawalAmount}
                            onChange={(e) => setWithdrawalAmount(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="e.g. 200"
                            className="block w-full rounded-lg border border-gray-200 py-1.5 pl-6 pr-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Frequency</label>
                        <select
                          value={withdrawalFrequency}
                          onChange={(e: any) => setWithdrawalFrequency(e.target.value)}
                          className="block w-full rounded-lg border border-gray-200 py-1.5 px-2 text-xs focus:outline-none"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Start Year</label>
                      <input
                        type="number"
                        value={withdrawalStartYear}
                        onChange={(e) => setWithdrawalStartYear(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 5"
                        className="block w-full rounded-lg border border-gray-200 py-1.5 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Events & Schedule Tab */}
              {activeInputTab === 'events' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Custom Savings Events</span>
                      <span className="text-[11px] text-gray-400">One-time or periodic transactions.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddEvent}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg px-2.5 py-1.5 transition-all"
                    >
                      <Plus className="h-3 w-3" />
                      Add Event
                    </button>
                  </div>

                  <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                    {events.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 bg-gray-50/50">
                        <Calendar className="h-8 w-8 text-gray-300 mb-2" />
                        <p className="text-xs font-medium">No custom savings events defined.</p>
                        <p className="text-[11px] mt-1">Add lump-sum deposits, inheritance payouts, or large purchases here.</p>
                      </div>
                    ) : (
                      events.map((ev, index) => (
                        <div key={ev.id} className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-sm space-y-3 relative group">
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                              Event #{index + 1}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDuplicateEvent(ev)}
                                className="text-gray-400 hover:text-blue-600 p-1"
                                title="Duplicate Event"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEvent(ev.id)}
                                className="text-gray-400 hover:text-red-500 p-1"
                                title="Delete Event"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <input
                              type="text"
                              value={ev.description}
                              onChange={(e) => handleUpdateEvent(ev.id, { description: e.target.value })}
                              placeholder="Description (e.g., Inheritance)"
                              className="w-full text-xs font-medium border-b border-gray-100 py-1 focus:border-blue-500 focus:outline-none"
                            />

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] text-gray-400 font-semibold uppercase mb-0.5">Deposit Amount</label>
                                <div className="relative">
                                  <span className="absolute left-2 top-1.5 text-[11px] text-gray-400 font-bold">{currency}</span>
                                  <input
                                    type="number"
                                    value={ev.deposit}
                                    onChange={(e) => handleUpdateEvent(ev.id, { deposit: e.target.value === '' ? '' : Number(e.target.value) })}
                                    placeholder="e.g. 5000"
                                    className="w-full text-xs rounded border border-gray-200 py-1 pl-5 pr-2 focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] text-gray-400 font-semibold uppercase mb-0.5">Withdrawal Amount</label>
                                <div className="relative">
                                  <span className="absolute left-2 top-1.5 text-[11px] text-gray-400 font-bold">{currency}</span>
                                  <input
                                    type="number"
                                    value={ev.withdrawal}
                                    onChange={(e) => handleUpdateEvent(ev.id, { withdrawal: e.target.value === '' ? '' : Number(e.target.value) })}
                                    placeholder="e.g. 3000"
                                    className="w-full text-xs rounded border border-gray-200 py-1 pl-5 pr-2 focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-1.5">
                              <div className="col-span-1">
                                <label className="block text-[10px] text-gray-400 font-semibold uppercase mb-0.5">Frequency</label>
                                <select
                                  value={ev.frequency}
                                  onChange={(e: any) => handleUpdateEvent(ev.id, { frequency: e.target.value })}
                                  className="w-full text-[10px] rounded border border-gray-200 p-1 focus:outline-none"
                                >
                                  <option value="one-time">One-time</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="quarterly">Quarterly</option>
                                  <option value="yearly">Yearly</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] text-gray-400 font-semibold uppercase mb-0.5">Start Yr</label>
                                <input
                                  type="number"
                                  value={ev.startYear}
                                  onChange={(e) => handleUpdateEvent(ev.id, { startYear: e.target.value === '' ? '' : Number(e.target.value) })}
                                  placeholder="e.g. 3"
                                  className="w-full text-xs rounded border border-gray-200 p-1 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-gray-400 font-semibold uppercase mb-0.5">End Yr</label>
                                <input
                                  type="number"
                                  value={ev.endYear}
                                  disabled={ev.frequency === 'one-time'}
                                  onChange={(e) => handleUpdateEvent(ev.id, { endYear: e.target.value === '' ? '' : Number(e.target.value) })}
                                  placeholder={ev.frequency === 'one-time' ? '-' : 'e.g. 8'}
                                  className="w-full text-xs rounded border border-gray-200 p-1 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Validation Notice Box */}
          {validationErrors.length > 0 && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-900 text-xs space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 text-red-800 font-bold uppercase tracking-wider mb-1">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Input Discrepancies
              </div>
              {validationErrors.map((err, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-red-500 shrink-0">•</span>
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {/* Add Scenario Comparison Section */}
          {simulationResult && (
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm space-y-4">
              <div>
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Scenario Comparisons</span>
                <p className="text-[11px] text-gray-400">Save active setup to compare yields, APYs, or deposit rates.</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customScenarioName}
                  onChange={(e) => setCustomScenarioName(e.target.value)}
                  placeholder="Scenario name (e.g., HYSA 5.5%)"
                  className="block w-full rounded-xl border border-gray-200 py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddScenario}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 shrink-0 transition-all shadow-sm active:scale-95"
                >
                  Save Active
                </button>
              </div>

              {scenarios.length > 0 && (
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">SAVED COMPARE STACK ({scenarios.length})</span>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                    {scenarios.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                        <div>
                          <span className="font-semibold text-gray-700 block">{s.name}</span>
                          <span className="text-[10px] text-gray-400">
                            FV: {currency}{Math.round(s.result.futureValue).toLocaleString()} | APY: {s.params.interestRate || 0}%
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveScenario(s.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {bestScenario && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-[11px] flex items-start gap-1.5">
                      <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Top Portfolio Yield:</span>
                        <p>"{bestScenario.name}" yields the greatest future value of <span className="font-semibold">{currency}{Math.round(bestScenario.result.futureValue).toLocaleString()}</span>.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Hand: LIVE INTERACTIVE RESULTS DASHBOARD */}
        <div className="lg:col-span-7 space-y-6">
          
          {!simulationResult ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-gray-200 bg-white shadow-sm min-h-[450px]">
              <PiggyBank className="h-16 w-16 text-blue-200 mb-4 animate-bounce" />
              <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">
                Calculation Roadmap Ready
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm font-light leading-relaxed">
                Enter a starting balance or regular savings deposit amount in the core tab, or click <strong className="text-blue-600 font-semibold">Load High-Yield Plan</strong> to initialize.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={loadExample}
                  className="rounded-xl bg-blue-600 text-white font-semibold text-xs px-5 py-2.5 shadow-md hover:bg-blue-700 transition-all active:scale-95"
                >
                  Load Pre-loaded Template
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Solver Notice Bar */}
              {simulationResult.solvedFor !== 'None' && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 shadow-xs">
                  <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <Settings className="h-5 w-5 text-amber-700 animate-spin" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">SOLVER MODULE ENGAGED</span>
                    <span className="text-xs text-amber-900">
                      Based on your input values, we back-solved for the <strong className="font-semibold">{simulationResult.solvedFor}</strong>: <strong className="font-bold text-amber-800">{simulationResult.solvedFor === 'Required Interest Rate' ? `${simulationResult.solvedValue.toFixed(2)}% APY` : simulationResult.solvedFor === 'Duration' ? `${simulationResult.solvedValue} Years` : `${currency}${Math.round(simulationResult.solvedValue).toLocaleString()}/mo`}</strong>.
                    </span>
                  </div>
                </div>
              )}

              {/* Grid of Dashboard KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">NET SAVINGS (FV)</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-black text-blue-700 tracking-tight">
                      {currency}{Math.round(simulationResult.netSavings).toLocaleString()}
                    </span>
                  </div>
                  <span className="block text-[10px] text-emerald-600 mt-1 font-semibold flex items-center gap-0.5">
                    <TrendingUp className="h-2.5 w-2.5" />
                    Compound Accumulation
                  </span>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">CAPITAL CONTRIBUTIONS</span>
                  <div className="mt-1">
                    <span className="text-xl font-black text-gray-800 tracking-tight">
                      {currency}{Math.round(simulationResult.totalDeposits + (initialSavings !== '' ? Number(initialSavings) : 0)).toLocaleString()}
                    </span>
                  </div>
                  <span className="block text-[10px] text-gray-400 mt-1">
                    Self Contribution
                  </span>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">INTEREST ACCRUED</span>
                  <div className="mt-1">
                    <span className="text-xl font-black text-purple-700 tracking-tight">
                      {currency}{Math.round(simulationResult.totalInterest).toLocaleString()}
                    </span>
                  </div>
                  <span className="block text-[10px] text-purple-600 mt-1 font-semibold">
                    Compounded APY
                  </span>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">REAL VALUE</span>
                  <div className="mt-1">
                    <span className="text-xl font-black text-amber-700 tracking-tight">
                      {currency}{Math.round(simulationResult.inflationAdjustedValue).toLocaleString()}
                    </span>
                  </div>
                  <span className="block text-[10px] text-amber-600 mt-1 font-semibold">
                    Inflation adjusted
                  </span>
                </div>

              </div>

              {/* Goal Progress Card */}
              {goalAmount && (
                <div className="p-5 bg-gradient-to-r from-slate-50 to-blue-50/50 border border-blue-100/50 rounded-2xl shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-extrabold text-blue-900 tracking-wide uppercase">GOAL PROGRESS PLOT</span>
                    </div>
                    <span className="text-xs font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md">
                      {simulationResult.goalProgress.toFixed(1)}% Achieved
                    </span>
                  </div>

                  <div className="relative h-3 w-full bg-gray-200/80 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${simulationResult.goalProgress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>Target: {currency}{Number(goalAmount).toLocaleString()}</span>
                    <span>
                      {simulationResult.isGoalAchieved 
                        ? `🎉 Target met in Month ${simulationResult.timeToGoalMonths} (${(simulationResult.timeToGoalMonths / 12).toFixed(1)} yrs)`
                        : `Gap to target: ${currency}${Math.round(Math.max(0, Number(goalAmount) - simulationResult.futureValue)).toLocaleString()}`
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Visualizations Module */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-md space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">PROJECTED PATH PLOT</span>
                    <span className="text-xs text-gray-500 font-medium">Visualizing compounding trajectories.</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex bg-gray-100 p-1 rounded-xl text-xs font-semibold text-gray-600">
                      <button
                        onClick={() => setActiveChartTab('growth')}
                        className={`px-3 py-1 rounded-lg transition-all ${activeChartTab === 'growth' ? 'bg-white shadow-sm text-blue-600' : 'hover:text-gray-900'}`}
                      >
                        Growth
                      </button>
                      <button
                        onClick={() => setActiveChartTab('distribution')}
                        className={`px-3 py-1 rounded-lg transition-all ${activeChartTab === 'distribution' ? 'bg-white shadow-sm text-blue-600' : 'hover:text-gray-900'}`}
                      >
                        Breakdown
                      </button>
                      <button
                        onClick={() => setActiveChartTab('annual')}
                        className={`px-3 py-1 rounded-lg transition-all ${activeChartTab === 'annual' ? 'bg-white shadow-sm text-blue-600' : 'hover:text-gray-900'}`}
                      >
                        Annual Adds
                      </button>
                    </div>

                    <div className="inline-flex bg-gray-100 p-1 rounded-xl text-xs">
                      <button
                        onClick={() => setChartType('area')}
                        className={`p-1 rounded-lg transition-all ${chartType === 'area' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                        title="Area Chart"
                      >
                        <PieIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setChartType('bar')}
                        className={`p-1 rounded-lg transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                        title="Bar Chart"
                      >
                        <BarIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setChartType('line')}
                        className={`p-1 rounded-lg transition-all ${chartType === 'line' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                        title="Line Chart"
                      >
                        <LineIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={exportChartAsPng}
                      className="p-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-all"
                      title="Export Chart Image"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div ref={chartRef} className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {activeChartTab === 'growth' ? (
                      chartType === 'area' ? (
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#d97706" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="year" stroke="#9ca3af" fontSize={11} tickLine={false} />
                          <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} tickFormatter={(v) => `${currency}${v}`} />
                          <Tooltip formatter={(v) => [`${currency}${Number(v).toLocaleString()}`]} />
                          <Legend />
                          <Area type="monotone" dataKey="Total Savings" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
                          <Area type="monotone" dataKey="Inflation Adjusted" stroke="#d97706" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorReal)" />
                        </AreaChart>
                      ) : chartType === 'bar' ? (
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="year" stroke="#9ca3af" fontSize={11} tickLine={false} />
                          <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} tickFormatter={(v) => `${currency}${v}`} />
                          <Tooltip formatter={(v) => [`${currency}${Number(v).toLocaleString()}`]} />
                          <Legend />
                          <Bar dataKey="Total Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Inflation Adjusted" fill="#d97706" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      ) : (
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="year" stroke="#9ca3af" fontSize={11} tickLine={false} />
                          <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} tickFormatter={(v) => `${currency}${v}`} />
                          <Tooltip formatter={(v) => [`${currency}${Number(v).toLocaleString()}`]} />
                          <Legend />
                          <Line type="monotone" dataKey="Total Savings" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="Inflation Adjusted" stroke="#d97706" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        </LineChart>
                      )
                    ) : activeChartTab === 'distribution' ? (
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${currency}${Number(v).toLocaleString()}`]} />
                        <Legend />
                      </PieChart>
                    ) : (
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="year" stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} tickFormatter={(v) => `${currency}${v}`} />
                        <Tooltip formatter={(v) => [`${currency}${Number(v).toLocaleString()}`]} />
                        <Legend />
                        <Bar dataKey="Deposits Accumulation" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Interest Accrued" fill="#8b5cf6" stackId="a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

              </div>

              {/* Dynamic Smart Insights Panel */}
              {smartInsights.length > 0 && (
                <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-md space-y-4">
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">SMART ROADMAP INSIGHTS</span>
                    <span className="text-xs text-gray-500 font-medium">Algorithmic cash-flow assessments.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {smartInsights.map((insight, index) => (
                      <div key={index} className="p-3.5 rounded-xl border border-blue-50/60 bg-blue-50/20 text-xs text-gray-700 leading-relaxed font-light">
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Yearly Breakdown Table */}
              <div className="rounded-2xl border border-gray-200/80 bg-white shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">YEARLY PROGRESSION METRICS</span>
                    <span className="text-xs text-gray-500 font-medium">Sift, categorize, or download reports.</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                        placeholder="Search year..."
                        className="rounded-lg border border-gray-200 py-1 pl-8 pr-3 text-xs focus:outline-none focus:border-blue-500 max-w-[130px]"
                      />
                    </div>

                    <button
                      onClick={exportToCSV}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      CSV Report
                    </button>

                    <button
                      onClick={exportToTextReport}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download TXT
                    </button>

                    <button
                      onClick={handlePrint}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all"
                      title="Print Table"
                    >
                      <Printer className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                        {['year', 'openingBalance', 'deposits', 'interest', 'fees', 'taxes', 'withdrawals', 'closingBalance'].map((col) => (
                          <th 
                            key={col}
                            onClick={() => handleSort(col as keyof YearlyRecord)}
                            className="py-3 px-4 cursor-pointer hover:bg-gray-100 select-none transition-all"
                          >
                            <div className="flex items-center gap-1">
                              {col === 'year' ? 'Year' :
                               col === 'openingBalance' ? 'Opening Bal' :
                               col === 'deposits' ? 'Deposits' :
                               col === 'interest' ? 'Yield' :
                               col === 'fees' ? 'Fees' :
                               col === 'taxes' ? 'Taxes' :
                               col === 'withdrawals' ? 'Withdraws' : 'Closing Bal'}
                              {tableSortKey === col && (
                                tableSortDesc ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {processedYearlyRecords.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-gray-400">
                            No records matching search.
                          </td>
                        </tr>
                      ) : (
                        processedYearlyRecords.map((r) => (
                          <tr key={r.year} className="hover:bg-blue-50/30 transition-all font-light">
                            <td className="py-2.5 px-4 font-bold text-gray-800">Yr {r.year}</td>
                            <td className="py-2.5 px-4 font-mono">{currency}{Math.round(r.openingBalance).toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-emerald-600 font-mono">+{currency}{Math.round(r.deposits).toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-purple-600 font-mono">+{currency}{Math.round(r.interest).toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-red-500 font-mono">-{currency}{Math.round(r.fees).toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-orange-600 font-mono">-{currency}{Math.round(r.taxes).toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-red-600 font-mono">-{currency}{Math.round(r.withdrawals).toLocaleString()}</td>
                            <td className="py-2.5 px-4 font-bold text-blue-700 font-mono bg-blue-50/10">{currency}{Math.round(r.closingBalance).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* SEO & Educational Content Sections Panel */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-md">
        
        {/* SEO Tab Headers */}
        <div className="flex flex-wrap border-b border-gray-200/80 mb-6 gap-2 bg-gray-50/40 p-1 rounded-xl">
          <button
            onClick={() => setActiveSeoTab('guide')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeSeoTab === 'guide' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            How Savings Grow Guide
          </button>
          <button
            onClick={() => setActiveSeoTab('worked')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeSeoTab === 'worked' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Worked Examples
          </button>
          <button
            onClick={() => setActiveSeoTab('faq')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeSeoTab === 'faq' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveSeoTab('glossary')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeSeoTab === 'glossary' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Glossary & Terms
          </button>
        </div>

        {/* SEO tab content viewports */}
        <div className="space-y-6">
          
          {/* Guide Tab */}
          {activeSeoTab === 'guide' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">{EDUCATIONAL_CONTENT.mainTitle}</h2>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed font-light">{EDUCATIONAL_CONTENT.intro}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {EDUCATIONAL_CONTENT.sections.map((sec, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all space-y-2">
                    <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-wide">{sec.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-light whitespace-pre-line">{sec.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Worked Examples */}
          {activeSeoTab === 'worked' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Step-by-Step Worked Math Scenarios</h2>
                <p className="mt-1 text-xs text-gray-400">See the exact mathematics underpinning standard compound accounts and inflation offsets.</p>
              </div>

              <div className="space-y-4">
                {WORKED_EXAMPLES.map((ex, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                        {i + 1}
                      </div>
                      <span className="text-sm font-extrabold text-gray-800">{ex.title}</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-4 rounded-xl font-light">
                      <p><strong className="font-semibold text-gray-800">Scenario:</strong> {ex.scenario}</p>
                      <p className="whitespace-pre-line mt-2"><strong className="font-semibold text-gray-800">Formulas:</strong> {ex.calculation}</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] font-bold text-blue-900">
                      {ex.outcome}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQAccordion */}
          {activeSeoTab === 'faq' && (
            <div className="space-y-4">
              {FAQ_ARTICLES.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-3">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left font-extrabold text-xs text-gray-800 hover:text-blue-600 py-3 focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-all ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-gray-500 font-light leading-relaxed pl-1 pr-6 pb-2"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

          {/* Glossary */}
          {activeSeoTab === 'glossary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {GLOSSARY_ITEMS.map((item, index) => (
                <div key={index} className="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-xs transition-all space-y-1.5">
                  <span className="block text-xs font-extrabold text-blue-900 tracking-wide uppercase">{item.term}</span>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">{item.definition}</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Related Calculators */}
        <div className="mt-8 pt-6 border-t border-gray-200/80">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">RELATED CALCULATOORA HUBS</span>
          <div className="flex flex-wrap gap-2.5">
            {RELATED_CALCULATORS.map((calc) => (
              <a
                key={calc.slug}
                href={`/calculators/${calc.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all font-medium"
              >
                {calc.name}
                <ArrowRight className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
