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
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces for our component
interface CustomEvent {
  id: string;
  type: 'contribution' | 'withdrawal';
  amount: number | '';
  frequency: 'one-time' | 'weekly' | 'monthly' | 'yearly';
  startYear: number | '';
  endYear: number | '';
}

interface Scenario {
  name: string;
  monthlyInvestment: number;
  annualReturn: number;
  duration: number;
  stepUp: number;
  inflation: number;
  finalValue: number;
  totalInvested: number;
  profit: number;
  tag?: string;
}

export default function SipCalculator() {
  // --- CORE STATE ---
  // Mandatory Inputs (Every numeric field starts EMPTY)
  const [currency, setCurrency] = useState<string>('$');
  const [monthlyContribution, setMonthlyContribution] = useState<number | ''>('');
  const [expectedReturn, setExpectedReturn] = useState<number | ''>('');
  const [durationYears, setDurationYears] = useState<number | ''>('');
  const [investmentFrequency, setInvestmentFrequency] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');

  // Optional Advanced Inputs
  const [initialLumpSum, setInitialLumpSum] = useState<number | ''>('');
  const [annualStepUp, setAnnualStepUp] = useState<number | ''>('');
  const [inflationRate, setInflationRate] = useState<number | ''>('');
  const [capitalGainsTax, setCapitalGainsTax] = useState<number | ''>('');
  const [dividendYield, setDividendYield] = useState<number | ''>('');
  const [managementFee, setManagementFee] = useState<number | ''>('');
  const [exitFee, setExitFee] = useState<number | ''>('');

  // Goal Planner Inputs
  const [goalAmount, setGoalAmount] = useState<number | ''>('');
  
  // Custom Investment Events Builder
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<'growth' | 'breakdown' | 'contributions'>('growth');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showGoalPlanner, setShowGoalPlanner] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [tableSortKey, setTableSortKey] = useState<string>('year');
  const [tableSortDesc, setTableSortDesc] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  // --- VALIDATION ENGINE ---
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (monthlyContribution === '') return ["Please enter a monthly contribution amount to start."];
    if (expectedReturn === '') return ["Please enter an expected annual return rate."];
    if (durationYears === '') return ["Please enter an investment duration."];

    if (Number(monthlyContribution) <= 0) {
      errors.push("Base contribution amount must be greater than zero.");
    }
    const r = Number(expectedReturn);
    if (r < -100 || r > 100) {
      errors.push("Expected annual return rate must be between -100% and 100%.");
    }
    const d = Number(durationYears);
    if (d <= 0 || d > 60) {
      errors.push("Investment duration must be between 1 and 60 years.");
    }

    // Optional fields checks
    if (initialLumpSum !== '' && Number(initialLumpSum) < 0) {
      errors.push("Initial lump sum cannot be negative.");
    }
    if (annualStepUp !== '' && (Number(annualStepUp) < 0 || Number(annualStepUp) > 100)) {
      errors.push("Annual step-up must be between 0% and 100%.");
    }
    if (inflationRate !== '' && (Number(inflationRate) < 0 || Number(inflationRate) > 50)) {
      errors.push("Inflation rate must be between 0% and 50%.");
    }
    if (capitalGainsTax !== '' && (Number(capitalGainsTax) < 0 || Number(capitalGainsTax) > 100)) {
      errors.push("Capital gains tax rate must be between 0% and 100%.");
    }
    if (dividendYield !== '' && (Number(dividendYield) < 0 || Number(dividendYield) > 50)) {
      errors.push("Dividend yield must be between 0% and 50%.");
    }
    if (managementFee !== '' && (Number(managementFee) < 0 || Number(managementFee) > 10)) {
      errors.push("Management fee must be between 0% and 10%.");
    }
    if (exitFee !== '' && (Number(exitFee) < 0 || Number(exitFee) > 10)) {
      errors.push("Exit fee must be between 0% and 10%.");
    }
    if (goalAmount !== '' && Number(goalAmount) <= 0) {
      errors.push("Goal amount must be greater than zero.");
    }

    return errors;
  }, [monthlyContribution, expectedReturn, durationYears, initialLumpSum, annualStepUp, inflationRate, capitalGainsTax, dividendYield, managementFee, exitFee, goalAmount]);

  const isValid = validationErrors.length === 0;

  // --- MATHEMATICAL SIMULATION ENGINE ---
  const simulationResults = useMemo(() => {
    if (!isValid) return null;

    const baseContribution = Number(monthlyContribution) || 0;
    const annReturn = Number(expectedReturn) || 0;
    const years = Number(durationYears) || 0;
    const lumpSum = Number(initialLumpSum) || 0;
    const stepUpPct = Number(annualStepUp) || 0;
    const infRate = Number(inflationRate) || 0;
    const taxRate = Number(capitalGainsTax) || 0;
    const divYield = Number(dividendYield) || 0;
    const mFeeRate = Number(managementFee) || 0;
    const eFeeRate = Number(exitFee) || 0;

    // Determine simulation periodic frequency details
    let periodsPerYear = 12;
    if (investmentFrequency === 'weekly') periodsPerYear = 52;
    if (investmentFrequency === 'quarterly') periodsPerYear = 4;
    if (investmentFrequency === 'yearly') periodsPerYear = 1;

    const totalPeriods = Math.round(years * periodsPerYear);
    
    // Periodic rates
    const periodicReturn = (annReturn / 100) / periodsPerYear;
    const periodicDiv = (divYield / 100) / periodsPerYear;
    const periodicMFee = (mFeeRate / 100) / periodsPerYear;

    let balance = lumpSum;
    let runningInvested = lumpSum;
    let accumulatedFees = 0;
    let totalDividends = 0;

    // Array to record raw monthly intervals
    const periodRecords: {
      period: number;
      year: number;
      begBalance: number;
      contribution: number;
      withdrawal: number;
      growth: number;
      dividends: number;
      fees: number;
      endBalance: number;
      runningInvested: number;
    }[] = [];

    // Simulate period-by-period
    for (let p = 1; p <= totalPeriods; p++) {
      const year = Math.ceil(p / periodsPerYear);
      const begBalance = balance;

      // Calculate contribution amount for this period, taking step-up into account
      // Step-up triggers annually starting from Year 2
      let stepUpFactor = Math.pow(1 + stepUpPct / 100, year - 1);
      let currentBaseContribution = baseContribution * stepUpFactor;

      let contribution = currentBaseContribution;
      let withdrawal = 0;

      // Integrate custom investment events
      customEvents.forEach(evt => {
        const evtAmt = Number(evt.amount) || 0;
        const startY = Number(evt.startYear) || 1;
        const endY = Number(evt.endYear) || years;

        // Verify if event is active in this specific year
        if (year >= startY && year <= endY) {
          let eventStepUpFactor = Math.pow(1 + stepUpPct / 100, year - startY);
          let periodicEventContribution = evtAmt * eventStepUpFactor;

          if (evt.type === 'contribution') {
            if (evt.frequency === 'one-time') {
              // Trigger on the first period of that starting year
              if (p === (startY - 1) * periodsPerYear + 1) {
                contribution += evtAmt;
              }
            } else if (evt.frequency === 'yearly') {
              // Trigger once a year (first period of each year)
              if ((p - 1) % periodsPerYear === 0) {
                contribution += periodicEventContribution;
              }
            } else if (evt.frequency === 'weekly' && investmentFrequency === 'weekly') {
              contribution += periodicEventContribution;
            } else if (evt.frequency === 'monthly') {
              // Standard monthly interval
              if (investmentFrequency === 'weekly') {
                // If weekly simulation, trigger once every 4 weeks approximately
                if ((p - 1) % 4 === 0) contribution += periodicEventContribution;
              } else if (investmentFrequency === 'monthly') {
                contribution += periodicEventContribution;
              } else if (investmentFrequency === 'quarterly') {
                // 3 months per quarter
                contribution += periodicEventContribution * 3;
              } else if (investmentFrequency === 'yearly') {
                contribution += periodicEventContribution * 12;
              }
            }
          } else if (evt.type === 'withdrawal') {
            if (evt.frequency === 'one-time') {
              if (p === (startY - 1) * periodsPerYear + 1) {
                withdrawal += evtAmt;
              }
            } else if (evt.frequency === 'yearly') {
              if ((p - 1) % periodsPerYear === 0) {
                withdrawal += periodicEventContribution;
              }
            } else if (evt.frequency === 'monthly') {
              if (investmentFrequency === 'weekly') {
                if ((p - 1) % 4 === 0) withdrawal += periodicEventContribution;
              } else if (investmentFrequency === 'monthly') {
                withdrawal += periodicEventContribution;
              } else if (investmentFrequency === 'quarterly') {
                withdrawal += periodicEventContribution * 3;
              } else if (investmentFrequency === 'yearly') {
                withdrawal += periodicEventContribution * 12;
              }
            }
          }
        }
      });

      // Adjust active capital balance
      let activeCapital = begBalance + contribution - withdrawal;
      if (activeCapital < 0) {
        withdrawal = begBalance + contribution; // Cap withdrawal to available balance
        activeCapital = 0;
      }

      runningInvested += (contribution - withdrawal);
      if (runningInvested < 0) runningInvested = 0;

      // Yield compounding
      const growth = activeCapital * periodicReturn;
      const dividends = activeCapital * periodicDiv;
      totalDividends += dividends;

      // Management Fee Deduction
      const fees = activeCapital * periodicMFee;
      accumulatedFees += fees;

      const endBalance = activeCapital + growth + dividends - fees;
      balance = Math.max(0, endBalance);

      periodRecords.push({
        period: p,
        year,
        begBalance,
        contribution,
        withdrawal,
        growth,
        dividends,
        fees,
        endBalance: balance,
        runningInvested
      });
    }

    // Post-simulation summary computations
    const finalGrossValue = balance;
    
    // Capital Gains Tax deduction at exit
    const totalGains = Math.max(0, finalGrossValue - runningInvested);
    const taxEstimate = totalGains * (taxRate / 100);
    
    // Exit Fee deduction
    const exitFeeEstimate = finalGrossValue * (eFeeRate / 100);
    
    const netFinalValue = Math.max(0, finalGrossValue - taxEstimate - exitFeeEstimate);
    const estimatedProfit = Math.max(0, netFinalValue - runningInvested);

    // Inflation Adjusted purchasing power
    const inflationAdjustedValue = netFinalValue / Math.pow(1 + infRate / 100, years);

    // Yearly Aggregation for Table & Chart
    const yearlyRecords: {
      year: number;
      begBalance: number;
      contributions: number;
      withdrawals: number;
      growth: number;
      fees: number;
      endingBalance: number;
      runningProfit: number;
      runningInvested: number;
    }[] = [];

    for (let y = 1; y <= years; y++) {
      const yearPeriods = periodRecords.filter(r => r.year === y);
      if (yearPeriods.length === 0) continue;

      const begBalance = yearPeriods[0].begBalance;
      const contributions = yearPeriods.reduce((acc, curr) => acc + curr.contribution, 0);
      const withdrawals = yearPeriods.reduce((acc, curr) => acc + curr.withdrawal, 0);
      const growth = yearPeriods.reduce((acc, curr) => acc + curr.growth + curr.dividends, 0);
      const fees = yearPeriods.reduce((acc, curr) => acc + curr.fees, 0);
      const endingBalance = yearPeriods[yearPeriods.length - 1].endBalance;
      const runningInvested = yearPeriods[yearPeriods.length - 1].runningInvested;
      const runningProfit = Math.max(0, endingBalance - runningInvested);

      yearlyRecords.push({
        year: y,
        begBalance,
        contributions,
        withdrawals,
        growth,
        fees,
        endingBalance,
        runningProfit,
        runningInvested
      });
    }

    // Build Chart dataset
    const chartData = yearlyRecords.map(r => ({
      year: r.year,
      invested: Math.round(r.runningInvested),
      profit: Math.round(r.runningProfit),
      fees: Math.round(accumulatedFees * (r.year / years)), // Linearly distributed estimate for simplicity in yearly progression
      total: Math.round(r.endingBalance)
    }));

    // Goal calculation progress
    let goalProgress = 0;
    let goalGap = 0;
    if (goalAmount !== '') {
      goalProgress = Math.min(100, (netFinalValue / Number(goalAmount)) * 100);
      goalGap = Math.max(0, Number(goalAmount) - netFinalValue);
    }

    return {
      totalInvested: runningInvested,
      finalGrossValue,
      taxEstimate,
      exitFeeEstimate,
      netFinalValue,
      estimatedProfit,
      inflationAdjustedValue,
      accumulatedFees,
      totalDividends,
      yearlyRecords,
      chartData,
      goalProgress,
      goalGap
    };
  }, [isValid, monthlyContribution, expectedReturn, durationYears, investmentFrequency, initialLumpSum, annualStepUp, inflationRate, capitalGainsTax, dividendYield, managementFee, exitFee, goalAmount, customEvents]);

  // --- WHAT-IF COMPREHENSIVE SCENARIO PLANNER ---
  const scenarios: Scenario[] = useMemo(() => {
    if (!isValid || !simulationResults) return [];

    const baseContrib = Number(monthlyContribution) || 0;
    const baseReturn = Number(expectedReturn) || 0;
    const baseYears = Number(durationYears) || 0;
    const baseStepUp = Number(annualStepUp) || 0;
    const baseInflation = Number(inflationRate) || 0;

    const runScenarioMath = (contrib: number, ret: number, yrs: number, sup: number): { finalValue: number; totalInvested: number; profit: number } => {
      let balance = Number(initialLumpSum) || 0;
      let invested = balance;
      let periods = 12;
      const totalPeriods = yrs * periods;
      const periodicReturn = (ret / 100) / periods;

      for (let p = 1; p <= totalPeriods; p++) {
        const year = Math.ceil(p / periods);
        let stepUpFactor = Math.pow(1 + sup / 100, year - 1);
        let contribution = contrib * stepUpFactor;

        balance += contribution;
        invested += contribution;
        balance += balance * periodicReturn;
      }
      return {
        finalValue: balance,
        totalInvested: invested,
        profit: Math.max(0, balance - invested)
      };
    };

    const s1 = runScenarioMath(baseContrib, baseReturn, baseYears, baseStepUp);
    const s2 = runScenarioMath(baseContrib, baseReturn + 2, baseYears, baseStepUp);
    const s3 = runScenarioMath(baseContrib, baseReturn, baseYears + 5, baseStepUp);
    const s4 = runScenarioMath(baseContrib * 1.2, baseReturn, baseYears, baseStepUp);
    const s5 = runScenarioMath(baseContrib, baseReturn, baseYears, baseStepUp + 5);

    return [
      {
        name: "Current Plan",
        monthlyInvestment: baseContrib,
        annualReturn: baseReturn,
        duration: baseYears,
        stepUp: baseStepUp,
        inflation: baseInflation,
        finalValue: simulationResults.netFinalValue,
        totalInvested: simulationResults.totalInvested,
        profit: simulationResults.estimatedProfit,
        tag: "Base Case"
      },
      {
        name: "Higher Return (+2% Yield)",
        monthlyInvestment: baseContrib,
        annualReturn: baseReturn + 2,
        duration: baseYears,
        stepUp: baseStepUp,
        inflation: baseInflation,
        ...s2,
        tag: "Aggressive Option"
      },
      {
        name: "Longer Horizon (+5 Years)",
        monthlyInvestment: baseContrib,
        annualReturn: baseReturn,
        duration: baseYears + 5,
        stepUp: baseStepUp,
        inflation: baseInflation,
        ...s3,
        tag: "Long Term compounding"
      },
      {
        name: "Increased Contribution (+20%)",
        monthlyInvestment: Math.round(baseContrib * 1.2),
        annualReturn: baseReturn,
        duration: baseYears,
        stepUp: baseStepUp,
        inflation: baseInflation,
        ...s4,
        tag: "High Savings Speed"
      },
      {
        name: "Aggressive Step-Up (+5%)",
        monthlyInvestment: baseContrib,
        annualReturn: baseReturn,
        duration: baseYears,
        stepUp: baseStepUp + 5,
        inflation: baseInflation,
        ...s5,
        tag: "Dynamic Ladder"
      }
    ];
  }, [isValid, monthlyContribution, expectedReturn, durationYears, annualStepUp, inflationRate, initialLumpSum, simulationResults]);

  // Determine the best scenario out of what-if analysis
  const bestScenario = useMemo(() => {
    if (scenarios.length === 0) return null;
    return [...scenarios].sort((a, b) => b.finalValue - a.finalValue)[0];
  }, [scenarios]);

  // --- SMART RULE-BASED INSIGHT GENERATOR ---
  const smartInsights = useMemo(() => {
    if (!simulationResults) return [];
    const insights: { title: string; desc: string; type: 'info' | 'success' | 'warn' }[] = [];

    const finalVal = simulationResults.netFinalValue;
    const invested = simulationResults.totalInvested;
    const profit = simulationResults.estimatedProfit;
    const years = Number(durationYears) || 0;

    // Insight 1: Compounding tipping point (where growth exceeds investment)
    if (profit > invested) {
      insights.push({
        title: "Compounding Tipping Point Crossed! 🎉",
        desc: `Your compounded profit (${currency}${Math.round(profit).toLocaleString()}) has officially exceeded your out-of-pocket investment capital (${currency}${Math.round(invested).toLocaleString()}). This is the true power of compounding!`,
        type: 'success'
      });
    } else {
      insights.push({
        title: "Building Momentum",
        desc: `At year ${years}, your profit accounts for ${Math.round((profit / finalVal) * 100)}% of your final portfolio. Compounding gains build exponential speed in the later years. Try extending your duration by 5 years to see a massive difference!`,
        type: 'info'
      });
    }

    // Insight 2: Inflation Impact
    if (Number(inflationRate) > 0) {
      const inflationLoss = finalVal - simulationResults.inflationAdjustedValue;
      insights.push({
        title: "Inflation Purchasing Power Warning ⚠️",
        desc: `With a ${inflationRate}% average inflation rate, the purchasing power of your final portfolio reduces by ${currency}${Math.round(inflationLoss).toLocaleString()}. Your inflation-adjusted net value is ${currency}${Math.round(simulationResults.inflationAdjustedValue).toLocaleString()}.`,
        type: 'warn'
      });
    }

    // Insight 3: Step-Up Leverage
    if (Number(annualStepUp) === 0 || annualStepUp === '') {
      insights.push({
        title: "Unlock Growth with Step-Up 🚀",
        desc: "You are currently not using the Annual Step-Up parameter. If you increase your monthly contribution by just 10% each year to match typical wage hikes, your final wealth could increase dramatically with zero structural friction.",
        type: 'info'
      });
    } else {
      insights.push({
        title: "Step-Up Multiplier Active 🔥",
        desc: `Your ${annualStepUp}% annual step-up multiplies your wealth significantly compared to fixed contributions. It ensures you automatically save more as your career progress raises your earnings!`,
        type: 'success'
      });
    }

    // Insight 4: Tax efficiency
    if (Number(capitalGainsTax) > 0) {
      insights.push({
        title: "Tax Drag Minimization 💸",
        desc: `Capital gains tax of ${capitalGainsTax}% is estimated to reduce your final balance by ${currency}${Math.round(simulationResults.taxEstimate).toLocaleString()} at liquidation. Consider investing through tax-sheltered accounts to retain this growth.`,
        type: 'warn'
      });
    }

    return insights;
  }, [simulationResults, durationYears, currency, inflationRate, annualStepUp, capitalGainsTax]);

  // --- ACTIONS & EXPORT FUNCTIONS ---
  const handleLoadDemo = () => {
    setCurrency('$');
    setMonthlyContribution(500);
    setExpectedReturn(12.0);
    setDurationYears(15);
    setInvestmentFrequency('monthly');
    setInitialLumpSum(5000);
    setAnnualStepUp(8);
    setInflationRate(3.0);
    setCapitalGainsTax(15);
    setDividendYield(1.5);
    setManagementFee(0.5);
    setExitFee(1.0);
    setGoalAmount(250000);
    setCustomEvents([
      {
        id: "1",
        type: "contribution",
        amount: 200,
        frequency: "monthly",
        startYear: 3,
        endYear: 8
      },
      {
        id: "2",
        type: "withdrawal",
        amount: 1000,
        frequency: "yearly",
        startYear: 10,
        endYear: 12
      }
    ]);
    setShowAdvanced(true);
    setShowGoalPlanner(true);
  };

  const handleClearAll = () => {
    setMonthlyContribution('');
    setExpectedReturn('');
    setDurationYears('');
    setInitialLumpSum('');
    setAnnualStepUp('');
    setInflationRate('');
    setCapitalGainsTax('');
    setDividendYield('');
    setManagementFee('');
    setExitFee('');
    setGoalAmount('');
    setCustomEvents([]);
    setShowAdvanced(false);
    setShowGoalPlanner(false);
  };

  const exportCSV = () => {
    if (!simulationResults) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Year,Beginning Balance,Contributions,Withdrawals,Expected Growth,Ending Balance,Cumulative Profit,Cumulative Invested\n";
    
    simulationResults.yearlyRecords.forEach(r => {
      csvContent += `${r.year},${r.begBalance.toFixed(2)},${r.contributions.toFixed(2)},${r.withdrawals.toFixed(2)},${r.growth.toFixed(2)},${r.endingBalance.toFixed(2)},${r.runningProfit.toFixed(2)},${r.runningInvested.toFixed(2)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Calculatoora_SIP_Calculator_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printTable = () => {
    window.print();
  };

  // --- CUSTOM EVENTS MANAGEMENT ---
  const addCustomEvent = () => {
    setCustomEvents(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'contribution',
        amount: '',
        frequency: 'monthly',
        startYear: '',
        endYear: ''
      }
    ]);
  };

  const deleteCustomEvent = (id: string) => {
    setCustomEvents(prev => prev.filter(e => e.id !== id));
  };

  const updateCustomEvent = (id: string, key: keyof CustomEvent, value: any) => {
    setCustomEvents(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, [key]: value };
      }
      return e;
    }));
  };

  const duplicateCustomEvent = (id: string) => {
    const src = customEvents.find(e => e.id === id);
    if (!src) return;
    setCustomEvents(prev => [
      ...prev,
      {
        ...src,
        id: Date.now().toString() + "-dup"
      }
    ]);
  };

  // --- INTERACTIVE YEARLY TABLE QUERY / FILTER ENGINE ---
  const filteredAndSortedTable = useMemo(() => {
    if (!simulationResults) return [];
    let records = [...simulationResults.yearlyRecords];

    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      records = records.filter(r => 
        r.year.toString().includes(q) ||
        Math.round(r.endingBalance).toString().includes(q) ||
        Math.round(r.runningInvested).toString().includes(q)
      );
    }

    records.sort((a: any, b: any) => {
      let valA = a[tableSortKey];
      let valB = b[tableSortKey];
      if (valA === undefined) return 0;
      if (typeof valA === 'string') {
        return tableSortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }
      return tableSortDesc ? valB - valA : valA - valB;
    });

    return records;
  }, [simulationResults, tableSearch, tableSortKey, tableSortDesc]);

  // FAQ Articles Dataset
  const faqArticles = [
    {
      question: "What is a Systematic Investment Plan (SIP)?",
      answer: "A Systematic Investment Plan (SIP) is a disciplined investment methodology where a fixed amount of capital is deposited at regular structured intervals (weekly, monthly, quarterly, or yearly) into mutual funds, stock indexes, or corporate securities. This approach avoids timing the market and capitalizes on long-term compound growth."
    },
    {
      question: "How does the SIP step-up calculator function differ from normal compound calculators?",
      answer: "A regular compound calculator assumes a flat investment contribution across the entire multi-decade timeline. Our SIP Step-up engine lets you increment your investment by a custom annual percentage (e.g., 5% or 10% yearly) to parallel typical salary increases. This ensures your retirement accounts compound at a significantly faster rate."
    },
    {
      question: "What is the difference between Weekly, Monthly, and Yearly SIPs?",
      answer: "Frequency defines how often your recurring cash deposits are purchased into active index allocations. Weekly SIPs capture micro-swings in market prices, while Monthly is the standard corporate paycheck cycle. Due to dollar-cost averaging, compound yields over long cycles of 10+ years remain incredibly consistent across weekly, monthly, and quarterly schedules."
    },
    {
      question: "Does this SIP calculator factor in taxation and exit fees?",
      answer: "Yes. Our advanced mode models Capital Gains Tax (levied strictly on profit earnings at exit) and Exit Load Fees (deducted as a flat percentage of final liquid capital balance upon redemption). It also handles periodic corporate management fees (annual expense ratio) to ensure you see a real, net-of-fees final financial readout."
    }
  ];

  return (
    <div className="space-y-10" id="sip-calculator-top">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/45 dark:border-neutral-800/40 pb-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white tracking-tight leading-none flex items-center gap-3">
            SIP Calculator <Sparkles className="w-6 h-6 text-blue-500 dark:text-cyan-400 animate-pulse" />
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 mt-2.5 max-w-2xl leading-relaxed">
            The world's most advanced Systematic Investment Plan calculator. Models compounding portfolios, steps up contributions, tracks goal gaps, and designs custom events client-side.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLoadDemo}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-cyan-400 dark:bg-cyan-500/5 dark:hover:bg-cyan-500/10 dark:border-cyan-400/15 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-97"
            id="sip-btn-demo"
          >
            <Sparkles className="w-4 h-4" /> Load Realistic Example
          </button>
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-97"
            id="sip-btn-clear"
          >
            <RefreshCw className="w-4 h-4" /> Clear All Fields
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: The Interactive Glassmorphic Calculator Block */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[32px] border border-white/90 dark:border-neutral-800/90 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md shadow-2xl p-6 sm:p-8 transition-all">
            <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/60 pb-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                <PiggyBank className="w-4 h-4" /> Core SIP Inputs
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                No Backend, Client-Side Only
              </span>
            </div>

            {/* Input Form Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Currency & Base Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100" htmlFor="sip-monthly-contrib">
                      Regular Investment Amount <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value)}
                      className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold border-0 rounded px-1.5 py-0.5"
                    >
                      <option value="$">$ USD</option>
                      <option value="₹">₹ INR</option>
                      <option value="€">€ EUR</option>
                      <option value="£">£ GBP</option>
                      <option value="¥">¥ JPY</option>
                    </select>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">{currency}</span>
                    <input
                      id="sip-monthly-contrib"
                      type="number"
                      min={0}
                      placeholder="e.g. 500"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 focus:shadow-[0_0_25px_rgba(0,240,255,0.08)] transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                {/* Return Rate */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100" htmlFor="sip-expected-return">
                    Expected Annual Return <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">%</span>
                    <input
                      id="sip-expected-return"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 12"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 focus:shadow-[0_0_25px_rgba(0,240,255,0.08)] transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100" htmlFor="sip-duration">
                    Investment Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">years</span>
                    <input
                      id="sip-duration"
                      type="number"
                      min={1}
                      max={60}
                      placeholder="e.g. 15"
                      value={durationYears}
                      onChange={(e) => setDurationYears(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 focus:shadow-[0_0_25px_rgba(0,240,255,0.08)] transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                {/* Investment Frequency */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100" htmlFor="sip-frequency">
                    Investment Frequency
                  </label>
                  <select
                    id="sip-frequency"
                    value={investmentFrequency}
                    onChange={(e) => setInvestmentFrequency(e.target.value as any)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 focus:shadow-[0_0_25px_rgba(0,240,255,0.08)] transition-all duration-300 shadow-sm"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

              </div>

              {/* Advanced Parameters Accordion Drawer */}
              <div className="border-t border-neutral-200/50 dark:border-neutral-800/60 pt-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex justify-between items-center py-2 text-neutral-800 dark:text-neutral-100 font-bold hover:text-blue-500 dark:hover:text-cyan-400 transition"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-neutral-400" /> Advanced Compounding Options
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 pb-2">
                        {/* Lump Sum */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300" htmlFor="sip-lump-sum">
                            Starting Lump Sum Contribution
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-semibold">{currency}</span>
                            <input
                              id="sip-lump-sum"
                              type="number"
                              placeholder="e.g. 5000"
                              value={initialLumpSum}
                              onChange={(e) => setInitialLumpSum(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Annual Step Up */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300" htmlFor="sip-step-up">
                            Annual Step-Up Contribution Increase
                          </label>
                          <div className="relative">
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-semibold">%</span>
                            <input
                              id="sip-step-up"
                              type="number"
                              placeholder="e.g. 5"
                              value={annualStepUp}
                              onChange={(e) => setAnnualStepUp(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Inflation Rate */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300" htmlFor="sip-inflation">
                            Expected Inflation Rate
                          </label>
                          <div className="relative">
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-semibold">%</span>
                            <input
                              id="sip-inflation"
                              type="number"
                              placeholder="e.g. 3"
                              value={inflationRate}
                              onChange={(e) => setInflationRate(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Capital Gains Tax */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300" htmlFor="sip-cg-tax">
                            Capital Gains Tax (At Exit)
                          </label>
                          <div className="relative">
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-semibold">%</span>
                            <input
                              id="sip-cg-tax"
                              type="number"
                              placeholder="e.g. 15"
                              value={capitalGainsTax}
                              onChange={(e) => setCapitalGainsTax(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Dividend Yield */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300" htmlFor="sip-dividend">
                            Reinvested Dividend Yield
                          </label>
                          <div className="relative">
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-semibold">%</span>
                            <input
                              id="sip-dividend"
                              type="number"
                              placeholder="e.g. 1.5"
                              value={dividendYield}
                              onChange={(e) => setDividendYield(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Management Fee */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300" htmlFor="sip-mgmt-fee">
                            Annual Expense Ratio / Management Fee
                          </label>
                          <div className="relative">
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-semibold">%</span>
                            <input
                              id="sip-mgmt-fee"
                              type="number"
                              step="0.01"
                              placeholder="e.g. 0.75"
                              value={managementFee}
                              onChange={(e) => setManagementFee(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Exit Load Fee */}
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300" htmlFor="sip-exit-fee">
                            Exit Load Fee (Deducted from final value)
                          </label>
                          <div className="relative">
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-semibold">%</span>
                            <input
                              id="sip-exit-fee"
                              type="number"
                              placeholder="e.g. 1"
                              value={exitFee}
                              onChange={(e) => setExitFee(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Goal Planner Accordion Drawer */}
              <div className="border-t border-neutral-200/50 dark:border-neutral-800/60 pt-4">
                <button
                  onClick={() => setShowGoalPlanner(!showGoalPlanner)}
                  className="w-full flex justify-between items-center py-2 text-neutral-800 dark:text-neutral-100 font-bold hover:text-blue-500 dark:hover:text-cyan-400 transition"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-neutral-400" /> Goal-Based Investment Planner
                  </span>
                  {showGoalPlanner ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                  {showGoalPlanner && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pb-2 space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300" htmlFor="sip-goal-amt">
                            Target Goal Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-semibold">{currency}</span>
                            <input
                              id="sip-goal-amt"
                              type="number"
                              placeholder="e.g. 250000"
                              value={goalAmount}
                              onChange={(e) => setGoalAmount(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Custom Investment Events Schedule Builder */}
              <div className="border-t border-neutral-200/50 dark:border-neutral-800/60 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-neutral-400" /> Additional Custom Life Events (Contributions / SWP)
                  </span>
                  <button
                    onClick={addCustomEvent}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/15 dark:text-cyan-400 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Event Row
                  </button>
                </div>

                <AnimatePresence>
                  {customEvents.length === 0 ? (
                    <div className="p-5 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-950/10 text-center text-xs text-neutral-500">
                      No custom events active. You can add parallel one-time lumpsums, recurring bonus deposits, or Systematic Withdrawal Plans (SWP).
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customEvents.map((evt) => (
                        <motion.div
                          key={evt.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/50 dark:bg-neutral-950/30 flex flex-col sm:flex-row items-center gap-3"
                        >
                          {/* Type selection */}
                          <div className="w-full sm:w-auto shrink-0">
                            <select
                              value={evt.type}
                              onChange={(e) => updateCustomEvent(evt.id, 'type', e.target.value)}
                              className="text-xs font-bold px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
                            >
                              <option value="contribution">Deposit (+)</option>
                              <option value="withdrawal">Withdrawal (-)</option>
                            </select>
                          </div>

                          {/* Amount Input */}
                          <div className="w-full relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">{currency}</span>
                            <input
                              type="number"
                              placeholder="Amount"
                              value={evt.amount}
                              onChange={(e) => updateCustomEvent(evt.id, 'amount', e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full pl-6 pr-2 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-bold text-neutral-900 dark:text-white"
                            />
                          </div>

                          {/* Frequency */}
                          <div className="w-full sm:w-auto shrink-0">
                            <select
                              value={evt.frequency}
                              onChange={(e) => updateCustomEvent(evt.id, 'frequency', e.target.value)}
                              className="text-xs px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
                            >
                              <option value="one-time">One-Time</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>

                          {/* Start/End Year Timeline range */}
                          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase">Yrs</span>
                            <input
                              type="number"
                              placeholder="Start"
                              value={evt.startYear}
                              onChange={(e) => updateCustomEvent(evt.id, 'startYear', e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-14 px-2 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-bold text-neutral-900 dark:text-white text-center"
                            />
                            <span className="text-neutral-400 text-xs">to</span>
                            <input
                              type="number"
                              placeholder="End"
                              disabled={evt.frequency === 'one-time'}
                              value={evt.frequency === 'one-time' ? evt.startYear : evt.endYear}
                              onChange={(e) => updateCustomEvent(evt.id, 'endYear', e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-14 px-2 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-bold text-neutral-900 dark:text-white text-center disabled:opacity-50"
                            />
                          </div>

                          {/* Row Actions */}
                          <div className="flex items-center gap-1.5 sm:ml-auto">
                            <button
                              onClick={() => duplicateCustomEvent(evt.id)}
                              title="Duplicate Event"
                              className="p-1.5 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500 transition cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteCustomEvent(evt.id)}
                              title="Delete Event"
                              className="p-1.5 rounded bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-500 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Primary dynamic results view and detailed calculation graph */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Results Presentation Block */}
          <div className="rounded-[32px] border border-white/15 dark:border-neutral-850 bg-neutral-950 text-white shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 font-mono mb-4 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Calculated Wealth Projection
            </h3>

            {simulationResults ? (
              <div className="space-y-6 relative">
                {/* Primary Future Value Readout */}
                <div className="border-b border-neutral-800/60 pb-5">
                  <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1 font-sans">
                    Net Final Portfolio Value (Net of Exit Fees/Taxes)
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 tracking-tight leading-none">
                      {currency}{Math.round(simulationResults.netFinalValue).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Sub Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[11px] font-semibold text-neutral-400 font-sans uppercase">Total Out-of-Pocket Invested</span>
                    <span className="text-lg font-bold text-neutral-200">
                      {currency}{Math.round(simulationResults.totalInvested).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-neutral-400 font-sans uppercase">Compounded Growth Earnings</span>
                    <span className="text-lg font-bold text-green-400">
                      {currency}{Math.round(simulationResults.estimatedProfit).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-neutral-400 font-sans uppercase">Total Expense Fees Paid</span>
                    <span className="text-sm font-semibold text-red-400">
                      {currency}{Math.round(simulationResults.accumulatedFees).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-neutral-400 font-sans uppercase">Tax Liabilities Estimate</span>
                    <span className="text-sm font-semibold text-red-400">
                      {currency}{Math.round(simulationResults.taxEstimate).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Inflation Adjusted buying power readout */}
                {Number(inflationRate) > 0 && (
                  <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-xs leading-normal text-neutral-300 flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      Inflation Adjusted buying power today: <strong className="text-white font-mono">{currency}{Math.round(simulationResults.inflationAdjustedValue).toLocaleString()}</strong>
                    </span>
                  </div>
                )}

                {/* Goal progress indicator */}
                {goalAmount !== '' && (
                  <div className="space-y-2 border-t border-neutral-900 pt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-neutral-400">PROGRESS TOWARDS GOAL</span>
                      <span className="font-bold text-cyan-400">{simulationResults.goalProgress.toFixed(1)}% Completed</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${simulationResults.goalProgress}%` }}
                      />
                    </div>
                    <span className="block text-[10px] text-neutral-500 text-right">
                      {simulationResults.goalGap > 0 
                        ? `${currency}${Math.round(simulationResults.goalGap).toLocaleString()} remaining gap to solve`
                        : "Target Achieved! Excellent job!"
                      }
                    </span>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-neutral-900 pt-4">
                  <span>Mathematical Precision</span>
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Client-Side Computed
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-400 text-xs">
                <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                Please enter the required inputs on the left (Investment Amount, Return Rate, and Duration) to see instant compounding projections.
              </div>
            )}
          </div>

          {/* Interactive Custom SVG Visual Charts Card */}
          {simulationResults && (
            <div className="p-6 rounded-[32px] border border-white/50 dark:border-neutral-800/50 bg-white/85 dark:bg-neutral-900/40 backdrop-blur-md shadow-2xl transition-all duration-300 space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
                  📈 Visual Portfolio Charts
                </span>
                <div className="flex gap-1 bg-neutral-150 dark:bg-neutral-900 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('growth')}
                    className={`p-1.5 rounded ${activeTab === 'growth' ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                    title="Portfolio Growth"
                  >
                    <LineIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('breakdown')}
                    className={`p-1.5 rounded ${activeTab === 'breakdown' ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                    title="Asset Structure Breakdown"
                  >
                    <PieIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('contributions')}
                    className={`p-1.5 rounded ${activeTab === 'contributions' ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                    title="Contributions Bar Chart"
                  >
                    <BarIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chart Visualizer Area */}
              <div ref={chartContainerRef} className="h-60 relative flex items-center justify-center">
                {activeTab === 'growth' && (
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Render grid lines */}
                    <line x1="40" y1="20" x2="380" y2="20" stroke="#888" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
                    <line x1="40" y1="65" x2="380" y2="65" stroke="#888" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
                    <line x1="40" y1="110" x2="380" y2="110" stroke="#888" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
                    <line x1="40" y1="155" x2="380" y2="155" stroke="#888" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />

                    {/* Build Line coordinates */}
                    {(() => {
                      const points = simulationResults.chartData;
                      if (!points || points.length === 0) return null;
                      const maxTotal = Math.max(...points.map(p => p.total)) || 1;
                      
                      const coords = points.map((p, idx) => {
                        const x = 40 + (idx / (points.length - 1)) * 340;
                        const y = 160 - (p.total / maxTotal) * 140;
                        return { x, y };
                      });

                      const investedCoords = points.map((p, idx) => {
                        const x = 40 + (idx / (points.length - 1)) * 340;
                        const y = 160 - (p.invested / maxTotal) * 140;
                        return { x, y };
                      });

                      const pathStr = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
                      const investedPathStr = investedCoords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
                      const fillPathStr = `${pathStr} L ${coords[coords.length-1].x} 160 L 40 160 Z`;

                      return (
                        <>
                          {/* Fill Gradient Area */}
                          <path d={fillPathStr} fill="url(#growthGrad)" />
                          
                          {/* Total Growth Line */}
                          <path d={pathStr} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Invested Capital Line */}
                          <path d={investedPathStr} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />

                          {/* Legend markers inside SVG */}
                          <g transform="translate(45, 15)">
                            <circle cx="0" cy="0" r="4" fill="#3b82f6" />
                            <text x="8" y="4" fontSize="8" className="fill-neutral-600 dark:fill-neutral-300 font-bold font-sans">Compounded Balance</text>
                            <circle cx="100" cy="0" r="4" fill="#10b981" />
                            <text x="108" y="4" fontSize="8" className="fill-neutral-600 dark:fill-neutral-300 font-bold font-sans">Invested Capital</text>
                          </g>

                          {/* Axes Readouts */}
                          <text x="35" y="165" fontSize="8" className="fill-neutral-400 font-mono text-right">0</text>
                          <text x="35" y="25" fontSize="8" className="fill-neutral-400 font-mono text-right">{maxTotal >= 1000000 ? `${(maxTotal / 1000000).toFixed(1)}M` : Math.round(maxTotal / 1000) + "k"}</text>
                          
                          {/* Year ticks */}
                          <text x="40" y="175" fontSize="8" className="fill-neutral-400 font-mono text-center">Y1</text>
                          <text x="380" y="175" fontSize="8" className="fill-neutral-400 font-mono text-center">Y{durationYears}</text>
                        </>
                      );
                    })()}
                  </svg>
                )}

                {activeTab === 'breakdown' && (
                  <div className="flex flex-col md:flex-row items-center justify-around gap-4 w-full h-full">
                    {/* Donut circle */}
                    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="48" className="fill-none stroke-neutral-100 dark:stroke-neutral-800" strokeWidth="12" />
                        {(() => {
                          const total = simulationResults.netFinalValue || 1;
                          const investedPct = simulationResults.totalInvested / total;
                          const profitPct = simulationResults.estimatedProfit / total;
                          const feePct = (simulationResults.accumulatedFees + simulationResults.taxEstimate + simulationResults.exitFeeEstimate) / total;

                          const circum = 2 * Math.PI * 48;
                          const invOffset = circum;
                          const profOffset = circum - (investedPct * circum);
                          const feeOffset = circum - ((investedPct + profitPct) * circum);

                          return (
                            <>
                              {/* Invested Segment */}
                              <circle cx="60" cy="60" r="48" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray={circum} strokeDashoffset={invOffset - (investedPct * circum)} strokeLinecap="round" />
                              {/* Profit Segment */}
                              <circle cx="60" cy="60" r="48" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray={circum} strokeDashoffset={profOffset - (profitPct * circum)} strokeLinecap="round" />
                              {/* Fees / Taxes Segment */}
                              {feePct > 0.01 && (
                                <circle cx="60" cy="60" r="48" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray={circum} strokeDashoffset={feeOffset - (feePct * circum)} strokeLinecap="round" />
                              )}
                            </>
                          );
                        })()}
                      </svg>
                      <div className="absolute text-center">
                        <span className="block text-[9px] font-bold text-neutral-400 uppercase">Grown Yield</span>
                        <span className="text-sm font-black text-neutral-800 dark:text-neutral-100">{currency}{Math.round(simulationResults.netFinalValue >= 1000000 ? simulationResults.netFinalValue / 1000000 : simulationResults.netFinalValue / 1000).toLocaleString()}{simulationResults.netFinalValue >= 1000000 ? 'M' : 'k'}</span>
                      </div>
                    </div>

                    {/* Breakdown legend list */}
                    <div className="flex-1 w-full space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Invested Principal
                        </div>
                        <span className="font-mono text-neutral-500">{Math.round((simulationResults.totalInvested / simulationResults.netFinalValue) * 100)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> Compounded Profit
                        </div>
                        <span className="font-mono text-neutral-500">{Math.round((simulationResults.estimatedProfit / simulationResults.netFinalValue) * 100)}%</span>
                      </div>
                      {(simulationResults.accumulatedFees > 0 || simulationResults.taxEstimate > 0) && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> Expenses &amp; Taxes
                          </div>
                          <span className="font-mono text-neutral-500">{Math.round(((simulationResults.accumulatedFees + simulationResults.taxEstimate) / simulationResults.netFinalValue) * 100)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'contributions' && (
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    {/* Simple bar chart */}
                    {(() => {
                      const points = simulationResults.chartData;
                      if (!points || points.length === 0) return null;
                      const maxInvested = Math.max(...points.map(p => p.invested)) || 1;
                      const step = Math.ceil(points.length / 10) || 1;

                      return (
                        <>
                          <line x1="30" y1="160" x2="380" y2="160" stroke="#888" strokeWidth="0.75" opacity="0.3" />
                          {points.filter((_, i) => i % step === 0 || i === points.length - 1).map((p, idx, arr) => {
                            const barWidth = 14;
                            const x = 50 + (idx / (arr.length - 1)) * 310 - barWidth/2;
                            const height = (p.invested / maxInvested) * 120;
                            const y = 160 - height;

                            return (
                              <g key={p.year}>
                                {/* Contributions column bar */}
                                <rect 
                                  x={x} 
                                  y={y} 
                                  width={barWidth} 
                                  height={height} 
                                  fill="#10b981" 
                                  rx="3"
                                  className="transition-all hover:opacity-85 cursor-pointer"
                                />
                                <text x={x + barWidth/2} y="175" fontSize="8" className="fill-neutral-400 font-mono text-center" textAnchor="middle">Yr{p.year}</text>
                                <text x={x + barWidth/2} y={y - 4} fontSize="7" className="fill-neutral-500 font-mono font-bold" textAnchor="middle">{currency}{Math.round(p.invested / 1000)}k</text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                )}
              </div>

              {/* Download Chart button */}
              <button
                onClick={() => {
                  alert("To download your active SIP calculator report, please use the 'Export Detailed CSV Ledger' or 'Print PDF Ledger' actions below.");
                }}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Visual Projections Report
              </button>
            </div>
          )}

          {/* Scenario What-If Compare Card */}
          {scenarios.length > 0 && (
            <div className="p-6 rounded-[32px] border border-white/50 dark:border-neutral-800/50 bg-white/85 dark:bg-neutral-900/40 backdrop-blur-md shadow-2xl transition-all duration-300 space-y-4">
              <span className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
                🕵️ Scenarios What-If Analysis
              </span>

              <div className="space-y-3">
                {scenarios.map((scen, idx) => {
                  const isBest = bestScenario && bestScenario.name === scen.name;
                  return (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isBest 
                          ? 'border-yellow-500/30 bg-yellow-500/5 dark:bg-yellow-400/5' 
                          : 'border-neutral-200/50 dark:border-neutral-850 bg-neutral-50/20 dark:bg-neutral-950/5'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <span className="font-extrabold text-sm text-neutral-800 dark:text-neutral-100 block">{scen.name}</span>
                          {scen.tag && (
                            <span className="inline-block text-[9px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest font-mono">
                              {scen.tag}
                            </span>
                          )}
                        </div>
                        {isBest && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-yellow-700 dark:text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-0.5 uppercase tracking-wider">
                            ⭐ Best Growth
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                        <div>
                          <span className="block text-[9px] uppercase tracking-wider text-neutral-400">Total Invested</span>
                          <strong className="text-neutral-700 dark:text-neutral-200 font-mono">{currency}{Math.round(scen.totalInvested).toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase tracking-wider text-neutral-400">Final Worth</span>
                          <strong className="text-neutral-700 dark:text-neutral-200 font-mono">{currency}{Math.round(scen.finalValue).toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase tracking-wider text-neutral-400">Compounded Profit</span>
                          <strong className="text-green-500 font-mono font-bold">+{currency}{Math.round(scen.profit).toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Smart rule-based Insights Cards Grid */}
      {simulationResults && smartInsights.length > 0 && (
        <div className="pt-8 border-t border-neutral-200/50 dark:border-neutral-800/60 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-blue-500 dark:text-cyan-400" />
            Smart Optimization Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smartInsights.slice(0, 3).map((insight, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-3xl border text-sm leading-relaxed ${
                  insight.type === 'success' 
                    ? 'border-emerald-500/20 bg-emerald-500/5 text-neutral-700 dark:text-neutral-300' 
                    : insight.type === 'warn'
                    ? 'border-orange-500/20 bg-orange-500/5 text-neutral-700 dark:text-neutral-300'
                    : 'border-blue-500/20 bg-blue-500/5 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <span className="font-extrabold text-neutral-900 dark:text-white block mb-1.5 flex items-center gap-1.5">
                  {insight.title}
                </span>
                <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {insight.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculator Detailed Yearly Table ledger */}
      {simulationResults && (
        <div className="pt-10 border-t border-neutral-200/50 dark:border-neutral-800/60 space-y-4 font-sans">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-500 dark:text-cyan-400" />
                Compounding Growth Schedule Table
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Explore your growth schedule ledger year-by-year. Sort columns, search fields, or export as CSV and Print.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Table search query */}
              <input
                type="text"
                placeholder="Search ledger..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-semibold text-neutral-800 dark:text-white"
              />
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-850 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV Ledger
              </button>
              <button
                onClick={printTable}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-850 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print PDF Ledger
              </button>
            </div>
          </div>

          {/* Output Table */}
          <div className="border border-neutral-200/50 dark:border-neutral-800/60 rounded-[28px] overflow-hidden bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-100/50 dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800 font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    <th 
                      onClick={() => { setTableSortKey('year'); setTableSortDesc(!tableSortDesc); }}
                      className="px-5 py-3.5 font-bold cursor-pointer hover:bg-neutral-200/40"
                    >
                      Year {tableSortKey === 'year' && (tableSortDesc ? '↓' : '↑')}
                    </th>
                    <th 
                      onClick={() => { setTableSortKey('begBalance'); setTableSortDesc(!tableSortDesc); }}
                      className="px-5 py-3.5 font-bold cursor-pointer hover:bg-neutral-200/40"
                    >
                      Beginning Balance {tableSortKey === 'begBalance' && (tableSortDesc ? '↓' : '↑')}
                    </th>
                    <th 
                      onClick={() => { setTableSortKey('contributions'); setTableSortDesc(!tableSortDesc); }}
                      className="px-5 py-3.5 font-bold cursor-pointer hover:bg-neutral-200/40"
                    >
                      Contributions {tableSortKey === 'contributions' && (tableSortDesc ? '↓' : '↑')}
                    </th>
                    <th 
                      onClick={() => { setTableSortKey('withdrawals'); setTableSortDesc(!tableSortDesc); }}
                      className="px-5 py-3.5 font-bold cursor-pointer hover:bg-neutral-200/40"
                    >
                      Withdrawals {tableSortKey === 'withdrawals' && (tableSortDesc ? '↓' : '↑')}
                    </th>
                    <th 
                      onClick={() => { setTableSortKey('growth'); setTableSortDesc(!tableSortDesc); }}
                      className="px-5 py-3.5 font-bold cursor-pointer hover:bg-neutral-200/40"
                    >
                      Growth Earnings {tableSortKey === 'growth' && (tableSortDesc ? '↓' : '↑')}
                    </th>
                    <th 
                      onClick={() => { setTableSortKey('fees'); setTableSortDesc(!tableSortDesc); }}
                      className="px-5 py-3.5 font-bold cursor-pointer hover:bg-neutral-200/40"
                    >
                      Expense Fees {tableSortKey === 'fees' && (tableSortDesc ? '↓' : '↑')}
                    </th>
                    <th 
                      onClick={() => { setTableSortKey('endingBalance'); setTableSortDesc(!tableSortDesc); }}
                      className="px-5 py-3.5 font-bold cursor-pointer hover:bg-neutral-200/40"
                    >
                      Ending Balance {tableSortKey === 'endingBalance' && (tableSortDesc ? '↓' : '↑')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/40 dark:divide-neutral-800/40 font-mono text-neutral-700 dark:text-neutral-300">
                  {filteredAndSortedTable.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-neutral-500 font-sans">
                        No year records match search term.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedTable.map((row) => (
                      <tr key={row.year} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-neutral-900 dark:text-white">Year {row.year}</td>
                        <td className="px-5 py-3.5">{currency}{Math.round(row.begBalance).toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-green-600 dark:text-green-400 font-semibold">+{currency}{Math.round(row.contributions).toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-red-500">-{currency}{Math.round(row.withdrawals).toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-blue-600 dark:text-cyan-400">+{currency}{Math.round(row.growth).toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-neutral-400">{currency}{Math.round(row.fees).toLocaleString()}</td>
                        <td className="px-5 py-3.5 font-bold text-neutral-900 dark:text-white">{currency}{Math.round(row.endingBalance).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Informational Educational Content block */}
      <div className="mt-16 pt-12 border-t border-neutral-200/50 dark:border-neutral-800/60 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          
          <section className="space-y-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            <h2 className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-500 dark:text-cyan-400" />
              Comprehensive Guide to SIP Calculations
            </h2>
            <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-950/20 space-y-4">
              <p>
                A <strong>Systematic Investment Plan (SIP)</strong> is one of the most powerful financial vehicles for retail wealth generation. By automating regular, periodic deposits into index mutual funds, exchange-traded funds (ETFs), or equity bundles, investors successfully isolate themselves from the anxieties of market timing.
              </p>
              <h3 className="font-bold text-neutral-900 dark:text-white">Why Use an Advanced SIP Calculator with Step-Up?</h3>
              <p>
                Standard compound interest formulas assume your paycheck remains completely flat over 20 or 30 years. In reality, wage growth allows you to increment your investment capital periodically. By integrating an <strong>Annual Step-Up</strong>, even a small 5% to 10% step-up raises your ending net retirement corpus exponentially, utilizing the power of early compounding leverage.
              </p>
            </div>
          </section>

          <section className="space-y-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            <h3 className="text-lg font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500 dark:text-cyan-400" /> SIP Compounding Formula
            </h3>
            <pre className="p-5 rounded-2xl bg-neutral-900 text-cyan-400 font-mono text-xs overflow-x-auto border border-neutral-800 whitespace-pre-wrap leading-relaxed">
              <code>{`Future Value Formula for periodic payments (SIP):
FV = P * [((1 + i)^n - 1) / i] * (1 + i)

Where:
  P  = Periodic contribution amount
  i  = Periodic interest rate (Expected Annual Return / Compounding Intervals)
  n  = Total compounding periods (Duration Years * Compounding Intervals)
  (1 + i) accounts for payments made at the beginning of each period.`}</code>
            </pre>
          </section>

          {/* Accordion FAQ Area */}
          <section className="space-y-4 font-sans">
            <h2 className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-500 dark:text-cyan-400" />
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-3">
              {faqArticles.map((article, index) => {
                const isOpen = openFaq === index;
                return (
                  <div 
                    key={index}
                    className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 overflow-hidden bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-neutral-800 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-cyan-400 transition"
                    >
                      <span>{article.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-blue-500 dark:text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-150 dark:border-neutral-900/40">
                        {article.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* Sidebar Widget Information */}
        <div className="lg:col-span-4 space-y-6 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
          <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-950/20 backdrop-blur-md space-y-4">
            <h4 className="font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono flex items-center gap-1.5">
              💡 Pro Tip: Dollar-Cost Averaging
            </h4>
            <p>
              Investing a fixed sum regularly means you automatically buy more shares when prices are low, and fewer when prices are expensive. Over long horizons, this <strong>dollar-cost averaging (DCA)</strong> strategy lowers your average cost basis and yields a highly stable financial return.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
