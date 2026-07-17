import React, { useState, useMemo } from 'react';
import { 
  Percent, DollarSign, Calendar, Sparkles, HelpCircle, ChevronRight, 
  TrendingUp, BarChart3, ShieldAlert, RefreshCw, FileSpreadsheet, 
  Printer, Download, BookOpen, ChevronDown, ArrowRight, Sparkle, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

export default function MortgageCalculator() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'refinance' | 'affordability'>('calculator');
  const [scheduleView, setScheduleView] = useState<'monthly' | 'yearly'>('yearly');

  // --- STANDARD MODE STATES ---
  const [homePrice, setHomePrice] = useState<number | ''>('');
  const [downPayment, setDownPayment] = useState<number | ''>('');
  const [downPaymentPercent, setDownPaymentPercent] = useState<number | ''>('');
  const [closingCost, setClosingCost] = useState<number | ''>('');
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  const [currency, setCurrency] = useState<string>('$');

  const [interestRate, setInterestRate] = useState<number | ''>('');
  const [loanTerm, setLoanTerm] = useState<number | ''>('');
  const [loanType, setLoanType] = useState<'fixed' | 'arm' | 'interest-only' | 'balloon'>('fixed');
  const [paymentOption, setPaymentOption] = useState<'monthly' | 'biweekly'>('monthly');

  // ARM Parameters
  const [armFixedPeriod, setArmFixedPeriod] = useState<number | ''>('');
  const [armAdjFreq, setArmAdjFreq] = useState<number | ''>('');
  const [armRateCap, setArmRateCap] = useState<number | ''>('');
  const [armLifetimeCap, setArmLifetimeCap] = useState<number | ''>('');
  const [armRateFloor, setArmRateFloor] = useState<number | ''>('');

  // Property Costs
  const [propertyTax, setPropertyTax] = useState<number | ''>('');
  const [homeInsurance, setHomeInsurance] = useState<number | ''>('');
  const [hoaFee, setHoaFee] = useState<number | ''>('');
  const [floodInsurance, setFloodInsurance] = useState<number | ''>('');
  const [maintenanceCost, setMaintenanceCost] = useState<number | ''>('');
  const [utilities, setUtilities] = useState<number | ''>('');

  // PMI Parameters
  const [pmiRate, setPmiRate] = useState<number | ''>('');
  const [pmiAmount, setPmiAmount] = useState<number | ''>('');
  const [pmiType, setPmiType] = useState<'rate' | 'amount'>('rate');
  const [pmiThreshold, setPmiThreshold] = useState<number | ''>('');

  // Extra Payments
  const [extraMonthly, setExtraMonthly] = useState<number | ''>('');
  const [extraAnnual, setExtraAnnual] = useState<number | ''>('');
  const [oneTimeExtra, setOneTimeExtra] = useState<number | ''>('');
  const [oneTimeMonth, setOneTimeMonth] = useState<number | ''>('');

  // --- REFINANCE STATES ---
  const [refiBalance, setRefiBalance] = useState<number | ''>('');
  const [refiCurrentRate, setRefiCurrentRate] = useState<number | ''>('');
  const [refiNewRate, setRefiNewRate] = useState<number | ''>('');
  const [refiCost, setRefiCost] = useState<number | ''>('');
  const [refiYearsRemaining, setRefiYearsRemaining] = useState<number | ''>('');

  // --- AFFORDABILITY STATES ---
  const [affIncome, setAffIncome] = useState<number | ''>('');
  const [affMonthlyDebt, setAffMonthlyDebt] = useState<number | ''>('');
  const [affTargetHousingRatio, setAffTargetHousingRatio] = useState<number | ''>('');
  const [affTargetDTI, setAffTargetDTI] = useState<number | ''>('');

  // --- SYNCED DOWN PAYMENT HANDLERS ---
  const handleDownPaymentChange = (val: number | '') => {
    setDownPayment(val);
    if (val !== '' && homePrice && homePrice > 0) {
      setDownPaymentPercent(parseFloat(((val / homePrice) * 100).toFixed(2)));
    } else if (val === '') {
      setDownPaymentPercent('');
    }
  };

  const handleDownPaymentPercentChange = (val: number | '') => {
    setDownPaymentPercent(val);
    if (val !== '' && homePrice && homePrice > 0) {
      setDownPayment(Math.round((homePrice * val) / 100));
    } else if (val === '') {
      setDownPayment('');
    }
  };

  // --- VALIDATION ERROR ---
  const validationError = useMemo(() => {
    if (homePrice !== '' && Number(homePrice) < 0) return "Home price cannot be negative.";
    if (interestRate !== '' && (Number(interestRate) < 0 || Number(interestRate) > 100)) return "Interest rate must be between 0% and 100%.";
    if (loanTerm !== '' && (Number(loanTerm) <= 0 || Number(loanTerm) > 100)) return "Please enter a valid loan term (1-100 years).";
    if (downPayment !== '' && homePrice !== '' && Number(downPayment) > Number(homePrice)) return "Down payment cannot exceed the home price.";
    return null;
  }, [homePrice, interestRate, loanTerm, downPayment]);

  // --- CORE ENGINE ---
  const calculations = useMemo(() => {
    const price = Number(homePrice) || 0;
    const rate = Number(interestRate) || 0;
    const term = Number(loanTerm) || 0;

    if (price <= 0 || term <= 0 || validationError) return null;

    const dp = Number(downPayment) || 0;
    const loanAmt = Math.max(0, price - dp);
    const ltv = price > 0 ? (loanAmt / price) * 100 : 0;
    const totalMonths = term * 12;

    // Upfront closing costs
    const cc = Number(closingCost) || 0;

    // Escrows
    const mTax = propertyTax ? (Number(propertyTax) / 12) : 0;
    const mIns = homeInsurance ? (Number(homeInsurance) / 12) : 0;
    const mHOA = hoaFee ? Number(hoaFee) : 0;
    const mFlood = floodInsurance ? (Number(floodInsurance) / 12) : 0;
    const mMaint = maintenanceCost ? Number(maintenanceCost) : 0;
    const mUtil = utilities ? Number(utilities) : 0;
    const monthlyEscrow = mTax + mIns + mHOA + mFlood + mMaint + mUtil;

    // PMI Setup
    let monthlyPMIInitial = 0;
    if (ltv > 80) {
      if (pmiType === 'rate' && pmiRate) {
        monthlyPMIInitial = (loanAmt * (Number(pmiRate) / 100)) / 12;
      } else if (pmiType === 'amount' && pmiAmount) {
        monthlyPMIInitial = Number(pmiAmount);
      }
    }
    const pmiCancelThreshold = Number(pmiThreshold) || 80;

    // Baseline (without extra payments)
    let baseBal = loanAmt;
    let baselineTotalInterest = 0;
    let baselineMonths = totalMonths;
    for (let m = 1; m <= totalMonths && baseBal > 0.01; m++) {
      let activeRate = rate;
      if (loanType === 'arm' && armFixedPeriod && m > Number(armFixedPeriod) * 12) {
        const cycle = Number(armAdjFreq) || 1;
        const yearsSinceFixed = Math.ceil((m - Number(armFixedPeriod) * 12) / 12);
        const periods = Math.ceil(yearsSinceFixed / cycle);
        activeRate = Math.min(Number(armLifetimeCap) || (rate + 5), rate + (periods * (Number(armRateCap) || 2)));
        if (armRateFloor) activeRate = Math.max(Number(armRateFloor), activeRate);
      }
      const mRate = (activeRate / 100) / 12;
      const rem = totalMonths - m + 1;
      let basePI = mRate === 0 ? baseBal / rem : baseBal * (mRate * Math.pow(1 + mRate, rem)) / (Math.pow(1 + mRate, rem) - 1);
      if (loanType === 'interest-only' && armFixedPeriod && m <= Number(armFixedPeriod) * 12) {
        basePI = baseBal * mRate;
      }
      const interestCharge = baseBal * mRate;
      const principalPaid = Math.min(baseBal, basePI - interestCharge);
      baselineTotalInterest += interestCharge;
      baseBal = Math.max(0, baseBal - principalPaid);
      if (baseBal <= 0) {
        baselineMonths = m;
        break;
      }
    }

    // Amortization (with extra payments)
    const schedule: any[] = [];
    let balance = loanAmt;
    let runningInterest = 0;
    let runningPrincipal = 0;
    let totalPMIPaid = 0;

    for (let m = 1; m <= totalMonths && balance > 0.01; m++) {
      let activeRate = rate;
      if (loanType === 'arm' && armFixedPeriod && m > Number(armFixedPeriod) * 12) {
        const cycle = Number(armAdjFreq) || 1;
        const yearsSinceFixed = Math.ceil((m - Number(armFixedPeriod) * 12) / 12);
        const periods = Math.ceil(yearsSinceFixed / cycle);
        activeRate = Math.min(Number(armLifetimeCap) || (rate + 5), rate + (periods * (Number(armRateCap) || 2)));
        if (armRateFloor) activeRate = Math.max(Number(armRateFloor), activeRate);
      }

      const mRate = (activeRate / 100) / 12;
      const rem = totalMonths - m + 1;
      let basePI = mRate === 0 ? balance / rem : balance * (mRate * Math.pow(1 + mRate, rem)) / (Math.pow(1 + mRate, rem) - 1);

      if (loanType === 'interest-only' && armFixedPeriod && m <= Number(armFixedPeriod) * 12) {
        basePI = balance * mRate;
      }

      if (paymentOption === 'biweekly') {
        basePI = basePI * 13 / 12;
      }

      const interestCharge = balance * mRate;
      let principalPaid = Math.min(balance, basePI - interestCharge);
      if (principalPaid < 0) principalPaid = 0;

      // Extra Payments
      let extraPaid = 0;
      if (extraMonthly) extraPaid += Number(extraMonthly);
      if (extraAnnual && m % 12 === 0) extraPaid += Number(extraAnnual);
      if (oneTimeExtra && oneTimeMonth && m === Number(oneTimeMonth)) extraPaid += Number(oneTimeExtra);

      if (loanType === 'balloon' && armFixedPeriod && m === Number(armFixedPeriod) * 12) {
        extraPaid = balance - principalPaid;
      }

      // PMI removal check
      let currentPMI = 0;
      const currentLtv = price > 0 ? (balance / price) * 100 : 0;
      if (currentLtv > pmiCancelThreshold) {
        currentPMI = monthlyPMIInitial;
        totalPMIPaid += currentPMI;
      }

      const totalReduction = principalPaid + extraPaid;
      if (totalReduction > balance) {
        extraPaid = Math.max(0, balance - principalPaid);
      }

      const begBalance = balance;
      balance = Math.max(0, balance - principalPaid - extraPaid);
      runningInterest += interestCharge;
      runningPrincipal += (principalPaid + extraPaid);

      const payDate = new Date(purchaseDate || new Date());
      payDate.setMonth(payDate.getMonth() + m);
      const dateStr = payDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      schedule.push({
        paymentNumber: m,
        date: dateStr,
        beginningBalance: begBalance,
        principal: principalPaid,
        interest: interestCharge,
        escrow: monthlyEscrow,
        pmi: currentPMI,
        extraPayment: extraPaid,
        endingBalance: balance,
        runningInterest,
        runningPrincipal,
        rate: activeRate
      });

      if (loanType === 'balloon' && armFixedPeriod && m === Number(armFixedPeriod) * 12) {
        break;
      }
    }

    const actualMonths = schedule.length;
    const payoffDateObj = new Date(purchaseDate || new Date());
    payoffDateObj.setMonth(payoffDateObj.getMonth() + actualMonths);
    const payoffDateStr = payoffDateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const totalInterest = runningInterest;
    const totalPayments = runningPrincipal + totalInterest + (monthlyEscrow * actualMonths) + totalPMIPaid + cc;
    const timeSavedMonths = Math.max(0, baselineMonths - actualMonths);
    const interestSaved = Math.max(0, baselineTotalInterest - totalInterest);

    const firstMonthPI = schedule[0] ? (schedule[0].principal + schedule[0].interest) : 0;

    return {
      loanAmount: loanAmt,
      totalInterest,
      totalPayments,
      totalPMIPaid,
      payoffDate: payoffDateStr,
      timeSavedMonths,
      interestSaved,
      schedule,
      monthlyEscrow,
      firstMonthPI,
      monthlyPMIInitial,
      initialLtv: ltv
    };
  }, [
    homePrice, downPayment, interestRate, loanTerm, loanType, paymentOption,
    armFixedPeriod, armAdjFreq, armRateCap, armLifetimeCap, armRateFloor,
    propertyTax, homeInsurance, hoaFee, floodInsurance, maintenanceCost, utilities,
    pmiRate, pmiAmount, pmiType, pmiThreshold,
    extraMonthly, extraAnnual, oneTimeExtra, oneTimeMonth, purchaseDate, closingCost, validationError
  ]);

  // --- REFINANCE MATH ---
  const refinanceCalc = useMemo(() => {
    const bal = Number(refiBalance) || 0;
    const curRate = Number(refiCurrentRate) || 0;
    const newRate = Number(refiNewRate) || 0;
    const cost = Number(refiCost) || 0;
    const years = Number(refiYearsRemaining) || 0;

    if (bal <= 0 || curRate <= 0 || newRate <= 0 || years <= 0) return null;

    const n = years * 12;
    const rCur = (curRate / 100) / 12;
    const rNew = (newRate / 100) / 12;

    const curMonthly = rCur === 0 ? bal / n : bal * (rCur * Math.pow(1 + rCur, n)) / (Math.pow(1 + rCur, n) - 1);
    const newMonthly = rNew === 0 ? bal / n : bal * (rNew * Math.pow(1 + rNew, n)) / (Math.pow(1 + rNew, n) - 1);

    const monthlySavings = curMonthly - newMonthly;
    const totalCurPaid = curMonthly * n;
    const totalNewPaid = newMonthly * n;

    const interestSavings = (totalCurPaid - bal) - (totalNewPaid - bal);
    const netSavings = interestSavings - cost;
    const breakEvenMonths = monthlySavings > 0 ? cost / monthlySavings : 0;

    return { curMonthly, newMonthly, monthlySavings, interestSavings, netSavings, breakEvenMonths };
  }, [refiBalance, refiCurrentRate, refiNewRate, refiCost, refiYearsRemaining]);

  // --- AFFORDABILITY MATH ---
  const affordabilityCalc = useMemo(() => {
    const income = Number(affIncome) || 0;
    const debt = Number(affMonthlyDebt) || 0;
    const hRatio = Number(affTargetHousingRatio) || 28;
    const dtiRatio = Number(affTargetDTI) || 36;

    if (income <= 0) return null;

    const monthlyIncome = income / 12;
    const maxHousingPayment = monthlyIncome * (hRatio / 100);
    const maxDTIPayment = (monthlyIncome * (dtiRatio / 100)) - debt;

    const recommendedMonthly = Math.max(0, Math.min(maxHousingPayment, maxDTIPayment));

    const activeRate = Number(interestRate) || 6.5;
    const activeTerm = Number(loanTerm) || 30;

    const r = (activeRate / 100) / 12;
    const n = activeTerm * 12;

    let recommendedLoan = 0;
    if (r === 0) {
      recommendedLoan = recommendedMonthly * n;
    } else {
      recommendedLoan = recommendedMonthly * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    }

    const dp = Number(downPayment) || 0;
    const recommendedHomePrice = recommendedLoan + dp;

    return { monthlyIncome, recommendedMonthly, recommendedHomePrice, recommendedLoan };
  }, [affIncome, affMonthlyDebt, affTargetHousingRatio, affTargetDTI, interestRate, loanTerm, downPayment]);

  // --- LOAD EXAMPLE & CLEAR ALL ---
  const loadExample = () => {
    setHomePrice(450000);
    setDownPayment(90000);
    setDownPaymentPercent(20);
    setInterestRate(6.25);
    setLoanTerm(30);
    setClosingCost(9000);
    setPurchaseDate('2026-08-01');
    setCurrency('$');
    setPropertyTax(2500);
    setHomeInsurance(1200);
    setHoaFee(150);
    setPmiRate(0.5);
    setPmiThreshold(80);
    setExtraMonthly(200);
    // Refi Example
    setRefiBalance(350000);
    setRefiCurrentRate(7.5);
    setRefiNewRate(5.875);
    setRefiCost(4500);
    setRefiYearsRemaining(25);
    // Affordability Example
    setAffIncome(120000);
    setAffMonthlyDebt(450);
    setAffTargetHousingRatio(28);
    setAffTargetDTI(36);
  };

  const clearAll = () => {
    setHomePrice('');
    setDownPayment('');
    setDownPaymentPercent('');
    setClosingCost('');
    setPurchaseDate('');
    setCurrency('$');
    setInterestRate('');
    setLoanTerm('');
    setLoanType('fixed');
    setPaymentOption('monthly');
    setArmFixedPeriod('');
    setArmAdjFreq('');
    setArmRateCap('');
    setArmLifetimeCap('');
    setArmRateFloor('');
    setPropertyTax('');
    setHomeInsurance('');
    setHoaFee('');
    setFloodInsurance('');
    setMaintenanceCost('');
    setUtilities('');
    setPmiRate('');
    setPmiAmount('');
    setPmiThreshold('');
    setExtraMonthly('');
    setExtraAnnual('');
    setOneTimeExtra('');
    setOneTimeMonth('');
    setRefiBalance('');
    setRefiCurrentRate('');
    setRefiNewRate('');
    setRefiCost('');
    setRefiYearsRemaining('');
    setAffIncome('');
    setAffMonthlyDebt('');
    setAffTargetHousingRatio('');
    setAffTargetDTI('');
  };

  // --- EXPORT TO CSV ---
  const exportToCSV = () => {
    if (!calculations?.schedule || calculations.schedule.length === 0) return;
    const headers = ["Payment Number", "Date", "Beginning Balance", "Principal", "Interest", "Escrow", "PMI", "Extra Payment", "Ending Balance"];
    const rows = calculations.schedule.map(r => [
      r.paymentNumber,
      r.date,
      r.beginningBalance.toFixed(2),
      r.principal.toFixed(2),
      r.interest.toFixed(2),
      r.escrow.toFixed(2),
      r.pmi.toFixed(2),
      r.extraPayment.toFixed(2),
      r.endingBalance.toFixed(2)
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "mortgage_amortization_schedule.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatMoney = (val: number) => {
    return currency + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // --- DYNAMIC SLIDER VALUE UPDATE ---
  const handleSliderChange = (id: string, val: number) => {
    if (id === 'interestRate') setInterestRate(val);
    else if (id === 'homePrice') setHomePrice(val);
    else if (id === 'loanTerm') setLoanTerm(val);
    else if (id === 'extraMonthly') setExtraMonthly(val);
  };

  // --- AMORTIZATION SCHEDULE GROUPED BY YEAR ---
  const yearlySchedule = useMemo(() => {
    if (!calculations?.schedule) return [];
    const yearlyMap: { [key: number]: any } = {};
    calculations.schedule.forEach((row: any) => {
      const year = Math.ceil(row.paymentNumber / 12);
      if (!yearlyMap[year]) {
        yearlyMap[year] = {
          year,
          beginningBalance: row.beginningBalance,
          principal: 0,
          interest: 0,
          escrow: 0,
          pmi: 0,
          extraPayment: 0,
          endingBalance: row.endingBalance
        };
      }
      yearlyMap[year].principal += row.principal;
      yearlyMap[year].interest += row.interest;
      yearlyMap[year].escrow += row.escrow;
      yearlyMap[year].pmi += row.pmi;
      yearlyMap[year].extraPayment += row.extraPayment;
      yearlyMap[year].endingBalance = row.endingBalance;
    });
    return Object.values(yearlyMap);
  }, [calculations?.schedule]);

  return (
    <div id="mortgage-calc-root" className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-blue-500/30">
      
      {/* HEADER BANNER */}
      <div className="relative py-14 overflow-hidden border-b border-neutral-200/60 dark:border-neutral-900 bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-4 tracking-wider uppercase select-none">
            <Sparkle className="w-3.5 h-3.5 animate-pulse" /> World-Class Calculator Engine
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-none">
            Mortgage Calculator
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3 max-w-2xl mx-auto leading-relaxed">
            Plan your home financing using our professional, client-side, banking-grade simulation hub.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button 
              onClick={loadExample}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition shadow-lg shadow-blue-500/10 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Example
            </button>
            <button 
              onClick={clearAll}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer transition"
            >
              Clear All Fields
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* TAB BUTTONS */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-850 mb-8 max-w-lg mx-auto bg-neutral-100 dark:bg-neutral-900/50 p-1 rounded-2xl">
          {(['calculator', 'refinance', 'affordability'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {tab === 'calculator' ? 'Standard Planner' : tab === 'refinance' ? 'Refinance Mode' : 'Affordability'}
            </button>
          ))}
        </div>

        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT INPUT COLUMN */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* STANDARD CALCULATOR INPUTS */}
            {activeTab === 'calculator' && (
              <>
                {/* Section 1: Property Info */}
                <div className="p-6 rounded-3xl bg-white/75 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-850 shadow-sm backdrop-blur-md">
                  <h3 className="text-sm font-black uppercase text-neutral-400 tracking-wider mb-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm"></span> Property Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Home Price ({currency})</label>
                      <input 
                        type="number" 
                        value={homePrice} 
                        onChange={e => {
                          const val = e.target.value === '' ? '' : Number(e.target.value);
                          setHomePrice(val);
                          if (val === '') { setDownPayment(''); setDownPaymentPercent(''); }
                          else if (downPaymentPercent !== '') { setDownPayment(Math.round((val * Number(downPaymentPercent)) / 100)); }
                          else if (downPayment !== '') { setDownPaymentPercent(parseFloat(((Number(downPayment) / val) * 100).toFixed(2))); }
                        }}
                        placeholder="e.g. 450000"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Closing Cost ({currency})</label>
                      <input 
                        type="number" 
                        value={closingCost} 
                        onChange={e => setClosingCost(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 9000"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Down Payment ({currency})</label>
                      <input 
                        type="number" 
                        value={downPayment} 
                        onChange={e => handleDownPaymentChange(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 90000"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Down Payment %</label>
                      <input 
                        type="number" 
                        value={downPaymentPercent} 
                        onChange={e => handleDownPaymentPercentChange(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 20"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Purchase Date</label>
                      <input 
                        type="date" 
                        value={purchaseDate} 
                        onChange={e => setPurchaseDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Currency Symbol</label>
                      <select 
                        value={currency} 
                        onChange={e => setCurrency(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      >
                        <option value="$">USD ($)</option>
                        <option value="€">EUR (€)</option>
                        <option value="£">GBP (£)</option>
                        <option value="¥">JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Loan Information */}
                <div className="p-6 rounded-3xl bg-white/75 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-850 shadow-sm backdrop-blur-md">
                  <h3 className="text-sm font-black uppercase text-neutral-400 tracking-wider mb-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm"></span> Loan Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Interest Rate %</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={interestRate} 
                        onChange={e => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 6.25"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Loan Term (Years)</label>
                      <input 
                        type="number" 
                        value={loanTerm} 
                        onChange={e => setLoanTerm(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 30"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Loan Structure</label>
                      <select 
                        value={loanType} 
                        onChange={e => setLoanType(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      >
                        <option value="fixed">Fixed Rate</option>
                        <option value="arm">Adjustable Rate (ARM)</option>
                        <option value="interest-only">Interest Only</option>
                        <option value="balloon">Balloon Mortgage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Payment Interval</label>
                      <select 
                        value={paymentOption} 
                        onChange={e => setPaymentOption(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      >
                        <option value="monthly">Monthly Payment</option>
                        <option value="biweekly">Biweekly Payment</option>
                      </select>
                    </div>
                  </div>

                  {/* ARM Settings Overlay Panel */}
                  <AnimatePresence>
                    {(loanType === 'arm' || loanType === 'interest-only' || loanType === 'balloon') && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-neutral-100 dark:border-neutral-800 pt-4 mt-4 space-y-4"
                      >
                        <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-black tracking-wider block uppercase">
                          {loanType.toUpperCase()} Parameters Settings
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-0.5">Initial Fixed Period (Years)</label>
                            <input 
                              type="number" 
                              value={armFixedPeriod} 
                              onChange={e => setArmFixedPeriod(e.target.value === '' ? '' : Number(e.target.value))}
                              placeholder="e.g. 5"
                              className="w-full px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-lg font-bold"
                            />
                          </div>
                          {loanType === 'arm' && (
                            <>
                              <div>
                                <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-0.5">Adjustment Cycle (Years)</label>
                                <input 
                                  type="number" 
                                  value={armAdjFreq} 
                                  onChange={e => setArmAdjFreq(e.target.value === '' ? '' : Number(e.target.value))}
                                  placeholder="e.g. 1"
                                  className="w-full px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-lg font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-0.5">Period Rate Cap %</label>
                                <input 
                                  type="number" 
                                  value={armRateCap} 
                                  onChange={e => setArmRateCap(e.target.value === '' ? '' : Number(e.target.value))}
                                  placeholder="e.g. 2"
                                  className="w-full px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-lg font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-0.5">Lifetime Rate Cap %</label>
                                <input 
                                  type="number" 
                                  value={armLifetimeCap} 
                                  onChange={e => setArmLifetimeCap(e.target.value === '' ? '' : Number(e.target.value))}
                                  placeholder="e.g. 12"
                                  className="w-full px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-lg font-bold"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section 3: Escrows & Additional Costs */}
                <div className="p-6 rounded-3xl bg-white/75 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-850 shadow-sm backdrop-blur-md">
                  <h3 className="text-sm font-black uppercase text-neutral-400 tracking-wider mb-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm"></span> Escrow & Annual Property Costs
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Annual Property Tax ({currency})</label>
                      <input 
                        type="number" 
                        value={propertyTax} 
                        onChange={e => setPropertyTax(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 2500"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Annual Home Insurance ({currency})</label>
                      <input 
                        type="number" 
                        value={homeInsurance} 
                        onChange={e => setHomeInsurance(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 1200"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Monthly HOA Fee ({currency})</label>
                      <input 
                        type="number" 
                        value={hoaFee} 
                        onChange={e => setHoaFee(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 150"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Annual Flood Insurance ({currency})</label>
                      <input 
                        type="number" 
                        value={floodInsurance} 
                        onChange={e => setFloodInsurance(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 600"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Monthly Maintenance ({currency})</label>
                      <input 
                        type="number" 
                        value={maintenanceCost} 
                        onChange={e => setMaintenanceCost(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 200"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Monthly Utilities ({currency})</label>
                      <input 
                        type="number" 
                        value={utilities} 
                        onChange={e => setUtilities(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 250"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: PMI Settings */}
                <div className="p-6 rounded-3xl bg-white/75 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-850 shadow-sm backdrop-blur-md">
                  <h3 className="text-sm font-black uppercase text-neutral-400 tracking-wider mb-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm"></span> PMI & Escrow Setup
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">PMI Charge Pattern</label>
                      <select 
                        value={pmiType} 
                        onChange={e => setPmiType(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      >
                        <option value="rate">Rate % of Loan</option>
                        <option value="amount">Flat Monthly Fee</option>
                      </select>
                    </div>
                    {pmiType === 'rate' ? (
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Annual PMI Rate %</label>
                        <input 
                          type="number" 
                          value={pmiRate} 
                          onChange={e => setPmiRate(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 0.5"
                          className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Monthly PMI Amount ({currency})</label>
                        <input 
                          type="number" 
                          value={pmiAmount} 
                          onChange={e => setPmiAmount(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 100"
                          className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                        />
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">PMI Auto-Cancel LTV Threshold %</label>
                      <input 
                        type="number" 
                        value={pmiThreshold} 
                        onChange={e => setPmiThreshold(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 80"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Extra Prepayments */}
                <div className="p-6 rounded-3xl bg-white/75 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-850 shadow-sm backdrop-blur-md">
                  <h3 className="text-sm font-black uppercase text-neutral-400 tracking-wider mb-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm"></span> Optional Extra Payments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Monthly Extra Payment ({currency})</label>
                      <input 
                        type="number" 
                        value={extraMonthly} 
                        onChange={e => setExtraMonthly(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 200"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Annual Extra Payment ({currency})</label>
                      <input 
                        type="number" 
                        value={extraAnnual} 
                        onChange={e => setExtraAnnual(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 2000"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">One-Time Extra Payment ({currency})</label>
                      <input 
                        type="number" 
                        value={oneTimeExtra} 
                        onChange={e => setOneTimeExtra(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 10000"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">At Amortization Month #</label>
                      <input 
                        type="number" 
                        value={oneTimeMonth} 
                        onChange={e => setOneTimeMonth(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 12"
                        className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* REFINANCE INPUTS */}
            {activeTab === 'refinance' && (
              <div className="p-6 rounded-3xl bg-white/75 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-850 shadow-sm backdrop-blur-md space-y-4">
                <h3 className="text-sm font-black uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm"></span> Refinance Parameters
                </h3>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Current Balance ({currency})</label>
                  <input 
                    type="number" 
                    value={refiBalance} 
                    onChange={e => setRefiBalance(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 350000"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Current Rate %</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={refiCurrentRate} 
                      onChange={e => setRefiCurrentRate(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 7.5"
                      className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">New Rate %</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={refiNewRate} 
                      onChange={e => setRefiNewRate(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 5.875"
                      className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Refi Closing Costs ({currency})</label>
                    <input 
                      type="number" 
                      value={refiCost} 
                      onChange={e => setRefiCost(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 4500"
                      className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Years Remaining</label>
                    <input 
                      type="number" 
                      value={refiYearsRemaining} 
                      onChange={e => setRefiYearsRemaining(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 25"
                      className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AFFORDABILITY INPUTS */}
            {activeTab === 'affordability' && (
              <div className="p-6 rounded-3xl bg-white/75 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-850 shadow-sm backdrop-blur-md space-y-4">
                <h3 className="text-sm font-black uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm"></span> Affordability Planner
                </h3>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Annual Gross Income ({currency})</label>
                  <input 
                    type="number" 
                    value={affIncome} 
                    onChange={e => setAffIncome(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 120000"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Monthly Non-Mortgage Debt ({currency})</label>
                  <input 
                    type="number" 
                    value={affMonthlyDebt} 
                    onChange={e => setAffMonthlyDebt(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 450"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Target Front Ratio %</label>
                    <input 
                      type="number" 
                      value={affTargetHousingRatio} 
                      onChange={e => setAffTargetHousingRatio(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 28"
                      className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Target Back DTI %</label>
                    <input 
                      type="number" 
                      value={affTargetDTI} 
                      onChange={e => setAffTargetDTI(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 36"
                      className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT RESULTS COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STANDARD CALCULATOR DASHBOARD */}
            {activeTab === 'calculator' && (
              <>
                {calculations ? (
                  <div className="space-y-6">
                    {/* PRIMARY SUMMARY SCOREBOARD */}
                    <div className="p-8 rounded-3xl bg-radial from-blue-600 to-indigo-900 text-white shadow-xl shadow-blue-500/10">
                      <div className="grid grid-cols-2 gap-6 items-center">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Total Monthly payment</span>
                          <h2 className="text-4xl md:text-5xl font-black mt-1">
                            {formatMoney(calculations.firstMonthPI + calculations.monthlyEscrow + (calculations.initialLtv > 80 ? calculations.monthlyPMIInitial : 0))}
                          </h2>
                          <div className="mt-4 space-y-1 text-xs text-blue-100 font-bold">
                            <p>• P&I: {formatMoney(calculations.firstMonthPI)}</p>
                            <p>• Escrow: {formatMoney(calculations.monthlyEscrow)}</p>
                            {calculations.initialLtv > 80 && <p>• PMI: {formatMoney(calculations.monthlyPMIInitial)}</p>}
                          </div>
                        </div>

                        <div className="border-l border-white/10 pl-6 space-y-4">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-blue-200 block">Total Interest Paid</span>
                            <span className="text-xl font-black">{formatMoney(calculations.totalInterest)}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-blue-200 block">Loan Term Payoff Date</span>
                            <span className="text-sm font-bold text-blue-100 block">{calculations.payoffDate}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-blue-200 block">Total Funding Lifetime Cost</span>
                            <span className="text-sm font-bold text-blue-100 block">{formatMoney(calculations.totalPayments)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SMART INSIGHTS ALERT */}
                    {(calculations.timeSavedMonths > 0 || calculations.initialLtv > 80) && (
                      <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-xs font-bold space-y-2 leading-relaxed">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-300 uppercase tracking-widest text-[9px] font-black">
                          <Sparkles className="w-3.5 h-3.5" /> Dynamic Mortgage Insights
                        </span>
                        {calculations.timeSavedMonths > 0 && (
                          <p>✓ Making your custom extra payments will shave <strong className="text-emerald-600 dark:text-emerald-300 font-black">{(calculations.timeSavedMonths / 12).toFixed(1)} years</strong> off your mortgage term and save <strong className="text-emerald-600 dark:text-emerald-300 font-black">{formatMoney(calculations.interestSaved)}</strong> in total lifetime interest charges!</p>
                        )}
                        {calculations.initialLtv > 80 && (
                          <p>ℹ Your initial Loan-to-Value is <strong className="text-neutral-900 dark:text-neutral-50 font-black">{calculations.initialLtv.toFixed(1)}%</strong>. Increasing your down payment by {formatMoney((calculations.initialLtv - 80) * Number(homePrice) / 100)} eliminates PMI costs entirely!</p>
                        )}
                      </div>
                    )}

                    {/* INTERACTIVE WHAT-IF SLIDERS */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-850 shadow-sm">
                      <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-blue-500" /> Live What-If Analysis Sliders
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-neutral-500">Live Interest Rate</span>
                            <span className="text-blue-600 dark:text-cyan-400">{interestRate || 0}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="1" 
                            max="15" 
                            step="0.05"
                            value={interestRate || 6} 
                            onChange={e => handleSliderChange('interestRate', parseFloat(e.target.value))}
                            className="w-full accent-blue-600 cursor-pointer"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-neutral-500">Live Home Price</span>
                            <span className="text-blue-600 dark:text-cyan-400">{formatMoney(Number(homePrice) || 0)}</span>
                          </div>
                          <input 
                            type="range" 
                            min="50000" 
                            max="2000000" 
                            step="10000"
                            value={homePrice || 450000} 
                            onChange={e => handleSliderChange('homePrice', parseInt(e.target.value))}
                            className="w-full accent-blue-600 cursor-pointer"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-neutral-500">Extra Monthly Payment</span>
                            <span className="text-blue-600 dark:text-cyan-400">{formatMoney(Number(extraMonthly) || 0)}</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="5000" 
                            step="50"
                            value={extraMonthly || 0} 
                            onChange={e => handleSliderChange('extraMonthly', parseInt(e.target.value))}
                            className="w-full accent-blue-600 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* RECHARTS TIMELINES VISUALIZATIONS */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-850 shadow-sm">
                      <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-4">
                        Amortization & Remaining Loan Balance Curve
                      </h4>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={yearlySchedule}>
                            <defs>
                              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="year" name="Year" />
                            <YAxis />
                            <Tooltip formatter={(value: any) => formatMoney(Number(value))} />
                            <Area type="monotone" dataKey="endingBalance" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#balanceGrad)" name="Remaining Balance" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* AMORTIZATION DATA TABLE WITH EXPORT */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-850 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
                          Interactive Amortization Schedule
                        </h4>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setScheduleView(scheduleView === 'monthly' ? 'yearly' : 'monthly')}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-200 transition cursor-pointer"
                          >
                            Show {scheduleView === 'monthly' ? 'Yearly Summary' : 'Monthly Schedule'}
                          </button>
                          <button 
                            onClick={exportToCSV}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 transition cursor-pointer flex items-center gap-1"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
                          </button>
                        </div>
                      </div>

                      <div className="max-h-80 overflow-y-auto border border-neutral-150 dark:border-neutral-800 rounded-2xl scrollbar-thin">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="bg-neutral-50 dark:bg-neutral-950 sticky top-0 border-b border-neutral-200 dark:border-neutral-800 z-10 font-bold">
                            <tr>
                              <th className="p-3 text-[10px] uppercase text-neutral-400">Period</th>
                              <th className="p-3 text-[10px] uppercase text-neutral-400 text-right">Principal</th>
                              <th className="p-3 text-[10px] uppercase text-neutral-400 text-right">Interest</th>
                              <th className="p-3 text-[10px] uppercase text-neutral-400 text-right">Escrow</th>
                              <th className="p-3 text-[10px] uppercase text-neutral-400 text-right">Ending Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scheduleView === 'yearly' ? (
                              yearlySchedule.map((row: any) => (
                                <tr key={row.year} className="border-b border-neutral-100 dark:border-neutral-850 hover:bg-neutral-50/50">
                                  <td className="p-3 font-bold text-neutral-600 dark:text-neutral-400">Year {row.year}</td>
                                  <td className="p-3 text-right font-semibold">{formatMoney(row.principal)}</td>
                                  <td className="p-3 text-right text-red-500 font-semibold">{formatMoney(row.interest)}</td>
                                  <td className="p-3 text-right font-medium text-neutral-500">{formatMoney(row.escrow)}</td>
                                  <td className="p-3 text-right font-black">{formatMoney(row.endingBalance)}</td>
                                </tr>
                              ))
                            ) : (
                              calculations.schedule.map((row: any) => (
                                <tr key={row.paymentNumber} className="border-b border-neutral-100 dark:border-neutral-850 hover:bg-neutral-50/50">
                                  <td className="p-3 font-bold text-neutral-600 dark:text-neutral-400">{row.date}</td>
                                  <td className="p-3 text-right font-semibold">{formatMoney(row.principal)}</td>
                                  <td className="p-3 text-right text-red-500 font-semibold">{formatMoney(row.interest)}</td>
                                  <td className="p-3 text-right font-medium text-neutral-500">{formatMoney(row.escrow)}</td>
                                  <td className="p-3 text-right font-black">{formatMoney(row.endingBalance)}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold">
                    <Info className="w-8 h-8 mx-auto mb-3 text-neutral-300" />
                    Enter Home Price, Interest Rate, and Loan Term to unlock interactive dashboards.
                  </div>
                )}
              </>
            )}

            {/* REFINANCE RESULTS VIEW */}
            {activeTab === 'refinance' && (
              <div className="space-y-6">
                {refinanceCalc ? (
                  <>
                    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-850 shadow-sm space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100">
                          <span className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Old Monthly</span>
                          <span className="text-base font-black text-neutral-800 dark:text-neutral-100">{formatMoney(refinanceCalc.curMonthly)}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100">
                          <span className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Proposed New</span>
                          <span className="text-base font-black text-neutral-800 dark:text-neutral-100">{formatMoney(refinanceCalc.newMonthly)}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-[9px] uppercase font-bold text-emerald-600 block mb-1">Monthly Saved</span>
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{formatMoney(refinanceCalc.monthlySavings)}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100">
                          <span className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Interest Saved</span>
                          <span className="text-base font-black text-neutral-800 dark:text-neutral-100">{formatMoney(refinanceCalc.interestSavings)}</span>
                        </div>
                      </div>

                      {refinanceCalc.monthlySavings > 0 ? (
                        <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-800 dark:text-cyan-400 leading-relaxed">
                          ⚡ It takes approximately <strong className="text-blue-600 dark:text-cyan-300 font-black">{Math.ceil(refinanceCalc.breakEvenMonths)} months</strong> to break even on the refinance closing costs of {formatMoney(Number(refiCost))}. Your total net financial gain over the remaining term is <strong className="text-blue-600 dark:text-cyan-300 font-black">{formatMoney(refinanceCalc.netSavings)}</strong>!
                        </div>
                      ) : (
                        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-500 leading-relaxed">
                          ⚠ Refinancing under these parameters yields negative monthly savings. Doing so is not recommended unless you are converting from an adjustable-rate to a fixed security structure.
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold">
                    <Info className="w-8 h-8 mx-auto mb-3 text-neutral-300" />
                    Enter Refinance parameters to compute lifetime breakeven performance analysis.
                  </div>
                )}
              </div>
            )}

            {/* AFFORDABILITY RESULTS VIEW */}
            {activeTab === 'affordability' && (
              <div className="space-y-6">
                {affordabilityCalc ? (
                  <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-850 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-blue-600 text-white">
                        <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Suggested Home Price</span>
                        <h3 className="text-3xl font-black mt-1">{formatMoney(affordabilityCalc.recommendedHomePrice)}</h3>
                        <p className="text-[10px] text-blue-100 mt-2 font-semibold">Includes down payment contribution of {formatMoney(Number(downPayment) || 0)}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Recommended Monthly Housing</span>
                        <h3 className="text-2xl font-black mt-1 text-neutral-800 dark:text-neutral-100">{formatMoney(affordabilityCalc.recommendedMonthly)}</h3>
                        <p className="text-[10px] text-neutral-400 mt-2 font-semibold">Computed within your custom target Debt-to-Income parameters.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-850 text-neutral-400 font-bold">
                    <Info className="w-8 h-8 mx-auto mb-3 text-neutral-300" />
                    Enter your gross income and debt parameters to construct home buying recommendations.
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* --- IN-DEPTH EDUCATIONAL RESOURCE & SEO HUB --- */}
        <div className="mt-16 border-t border-neutral-200 dark:border-neutral-850 pt-12 space-y-8 max-w-4xl mx-auto font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight text-neutral-950 dark:text-white">
              Mortgage Financing Educational Resource Hub
            </h2>
            <p className="text-xs text-neutral-400 mt-1">Empower your real estate decisions with insights curated by credit experts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-neutral-950 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-1 h-3.5 bg-blue-500 rounded-sm"></span> How Payments Are Calculated
              </h3>
              <p>
                Mortgage payments consist of Principal (repaying the borrowed debt) and Interest (lender cost fee). Lenders calculate your monthly P&I using standard annuity formulas:
              </p>
              <code className="block p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 font-mono text-[10px] text-blue-600 dark:text-cyan-400">
                Monthly = P * [r(1+r)^n] / [(1+r)^n - 1]
              </code>
              <p>
                Where P represents your Loan Balance, r is the periodic Monthly Interest (APR / 12), and n is the Total Months (Years * 12).
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-neutral-950 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-1 h-3.5 bg-blue-500 rounded-sm"></span> Understanding Escrow (PITI)
              </h3>
              <p>
                In addition to Principal and Interest, a comprehensive house payment often collects Property Taxes, Homeowners Insurance, and HOA fees. This combination is referred to as **PITI** (Principal, Interest, Taxes, Insurance). 
              </p>
              <p>
                These additional fees are collected in a monthly escrow account and paid automatically by your servicer on their annual due dates.
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-900 pt-8">
            <h3 className="text-sm font-black text-neutral-950 dark:text-white mb-4 text-center uppercase tracking-wider">
              Frequently Asked Questions (FAQ)
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-neutral-950 dark:text-white mb-1">What is Private Mortgage Insurance (PMI)?</h4>
                <p>PMI protects conventional lenders if you default on your home loan. It is required if your down payment is less than 20% (LTV above 80%). It can be canceled once your balance reaches 80% LTV.</p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-950 dark:text-white mb-1">What is the difference between Fixed and ARM mortgages?</h4>
                <p>Fixed mortgages lock in one interest rate for your entire loan lifespan, providing stable payments. Adjustable Rate Mortgages (ARMs) offer a lower initial rate which subsequently fluctuates periodically with market indexes.</p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-950 dark:text-white mb-1">How can extra payments shorten my mortgage?</h4>
                <p>Any supplemental payment applied directly to your principal reduces your interest base, lowering your lifetime compounding interest and paying off the loan years ahead of schedule.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
