import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Coins, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Plus, 
  Copy, 
  RefreshCw, 
  Bookmark, 
  BadgeAlert, 
  Check, 
  LayoutDashboard,
  Percent,
  Clock,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  EMICalculatorInputs, 
  EMIRateChange, 
  EMIExtraPayment, 
  EMIRecurringExtraPayment,
  EMITaxEntry,
  EMIInsuranceEntry,
  EMIFeeEntry,
  computeEmiAmortization 
} from '../utils/emiMath';
import EMIPaymentsTable from './emi/EMIPaymentsTable';
import EMIVisualizations from './emi/EMIVisualizations';
import EMILoanAffordability from './emi/EMILoanAffordability';
import EMISmartInsights from './emi/EMISmartInsights';
import EMIWhatIfComparison from './emi/EMIWhatIfComparison';
import EMIEducationalContent from './emi/EMIEducationalContent';

interface EMICalculatorProps {
  onNavigate?: (page: string) => void;
}

export default function EMICalculator({ onNavigate }: EMICalculatorProps) {
  // ISO date helper for start date
  const todayStr = useMemo(() => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }, []);

  // Standard Initial State: Empty numeric fields as requested
  const createEmptyInputs = (): EMICalculatorInputs => ({
    loanAmount: '',
    interestRate: '',
    tenure: '',
    tenureType: '',
    downPayment: '',
    processingFee: '',
    processingFeeType: '',
    startDate: '',
    gracePeriod: '',
    gracePeriodType: '',
    interestFreePeriod: '',
    extraMonthly: '',
    extraYearly: '',
    oneTimeLumpSum: '',
    lumpSumIndex: '',
    paymentFrequency: '',
    compoundFrequency: '',
    insuranceCost: '',
    insuranceCostType: '',
    taxes: '',
    taxesType: '',
    adminFees: '',
    otherCharges: '',
    interestType: '',
    rateChanges: [],
    extraPayments: [],
    recurringExtraPayments: [],
    taxesList: [],
    insuranceList: [],
    additionalFeesList: [],
    prepaymentRecastOption: '',
    currency: '$',
  });

  const [inputs, setInputs] = useState<EMICalculatorInputs>(() => createEmptyInputs());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'charts' | 'schedule' | 'comparison' | 'affordability'>('dashboard');
  
  // Collapsible drawers for inputs
  const [expandedSection, setExpandedSection] = useState<string | null>('core');
  const [copied, setCopied] = useState(false);

  // Toggle sections
  const toggleSection = (sec: string) => {
    setExpandedSection(expandedSection === sec ? null : sec);
  };

  // Preset loaders for examples
  const loadExample = (type: 'home' | 'car' | 'personal' | 'education' | 'business') => {
    const fresh = createEmptyInputs();
    
    switch (type) {
      case 'home':
        setInputs({
          ...fresh,
          loanAmount: 450000,
          interestRate: 6.25,
          tenure: 30,
          tenureType: 'years',
          downPayment: 50000,
          processingFee: 1.5,
          processingFeeType: 'percent',
          startDate: todayStr,
          paymentFrequency: 'monthly',
          compoundFrequency: 'monthly',
          interestType: 'fixed',
          prepaymentRecastOption: 'keep-emi',
          recurringExtraPayments: [{ id: '1', amount: 150, frequency: 'monthly' }],
          taxesList: [{ id: '1', amount: 250, frequency: 'monthly' }],
          insuranceList: [{ id: '1', amount: 100, frequency: 'monthly' }],
        });
        break;
      case 'car':
        setInputs({
          ...fresh,
          loanAmount: 38000,
          interestRate: 4.5,
          tenure: 60,
          tenureType: 'months',
          downPayment: 5000,
          processingFee: 150,
          processingFeeType: 'flat',
          startDate: todayStr,
          paymentFrequency: 'monthly',
          compoundFrequency: 'monthly',
          interestType: 'fixed',
          prepaymentRecastOption: 'keep-emi',
        });
        break;
      case 'personal':
        setInputs({
          ...fresh,
          loanAmount: 15000,
          interestRate: 11.2,
          tenure: 36,
          tenureType: 'months',
          startDate: todayStr,
          paymentFrequency: 'monthly',
          compoundFrequency: 'monthly',
          interestType: 'fixed',
          prepaymentRecastOption: 'keep-emi',
        });
        break;
      case 'education':
        setInputs({
          ...fresh,
          loanAmount: 50000,
          interestRate: 5.5,
          tenure: 10,
          tenureType: 'years',
          startDate: todayStr,
          gracePeriod: 12,
          gracePeriodType: 'interest-only',
          paymentFrequency: 'monthly',
          compoundFrequency: 'monthly',
          interestType: 'fixed',
          prepaymentRecastOption: 'keep-emi',
        });
        break;
      case 'business':
        setInputs({
          ...fresh,
          loanAmount: 120000,
          interestRate: 7.8,
          tenure: 7,
          tenureType: 'years',
          processingFee: 500,
          processingFeeType: 'flat',
          startDate: todayStr,
          paymentFrequency: 'quarterly',
          compoundFrequency: 'semi-annually',
          interestType: 'variable',
          prepaymentRecastOption: 'keep-emi',
          rateChanges: [
            { id: '1', effectivePaymentIndex: 12, rate: 8.4, reason: 'Market Index Adjustment' }
          ],
        });
        break;
    }
  };

  const clearAll = () => {
    setInputs(createEmptyInputs());
    setExpandedSection('core');
  };

  // Validations & Live Computations
  const validationErrors = useMemo(() => {
    const list: string[] = [];
    const amount = Number(inputs.loanAmount) || 0;
    const rate = Number(inputs.interestRate) || 0;
    const tenure = Number(inputs.tenure) || 0;

    // Check only if they have begun typing
    if (inputs.loanAmount !== '' && amount <= 0) {
      list.push('Loan Amount must be greater than zero.');
    }
    if (inputs.interestRate !== '' && rate < 0) {
      list.push('Interest Rate cannot be negative.');
    }
    if (inputs.tenure !== '' && tenure <= 0) {
      list.push('Loan Tenure must be greater than zero.');
    }

    return list;
  }, [inputs]);

  const missingRequiredFields = useMemo(() => {
    const list: string[] = [];
    if (!inputs.loanAmount || Number(inputs.loanAmount) <= 0) {
      list.push('Enter Loan Amount');
    }
    if (inputs.interestRate === '' || Number(inputs.interestRate) < 0) {
      list.push('Enter Interest Rate');
    }
    if (!inputs.tenure || Number(inputs.tenure) <= 0) {
      list.push('Enter Loan Term');
    }
    if (!inputs.tenureType) {
      list.push('Choose Tenure Type');
    }
    if (!inputs.paymentFrequency) {
      list.push('Choose Payment Frequency');
    }
    if (!inputs.compoundFrequency) {
      list.push('Choose Compound Frequency');
    }
    if (!inputs.interestType) {
      list.push('Choose Interest Type');
    }
    return list;
  }, [inputs]);

  const isReady = missingRequiredFields.length === 0;

  const totalAuxiliaryMonthlyFees = useMemo(() => {
    let total = 0;
    if (inputs.taxesList) {
      inputs.taxesList.forEach(t => {
        const amt = Number(t.amount) || 0;
        if (t.frequency === 'monthly') {
          total += amt;
        } else if (t.frequency === 'annual') {
          total += amt / 12;
        }
      });
    }
    if (inputs.insuranceList) {
      inputs.insuranceList.forEach(ins => {
        const amt = Number(ins.amount) || 0;
        if (ins.frequency === 'monthly') {
          total += amt;
        } else if (ins.frequency === 'annual') {
          total += amt / 12;
        }
      });
    }
    if (inputs.additionalFeesList) {
      inputs.additionalFeesList.forEach(f => {
        total += Number(f.amount) || 0;
      });
    }
    return total;
  }, [inputs.taxesList, inputs.insuranceList, inputs.additionalFeesList]);

  // Execute computations live
  const calculatedResults = useMemo(() => {
    if (!isReady) {
      // return default empty outputs for layout
      return computeEmiAmortization({
        ...inputs,
        loanAmount: 0,
        interestRate: 0,
        tenure: 0,
      });
    }

    return computeEmiAmortization(inputs);
  }, [inputs, isReady]);

  // Baseline schedule for comparisons (re-ran without extra payments)
  const baselineResults = useMemo(() => {
    if (!isReady) {
      return computeEmiAmortization({
        ...inputs,
        loanAmount: 0,
        interestRate: 0,
        tenure: 0,
      }, true);
    }
    return computeEmiAmortization(inputs, true);
  }, [inputs, isReady]);

  const handleCopyResults = () => {
    if (calculatedResults.rows.length === 0) return;
    const text = `
==== CALCULATOORA EMI SUMMARY ====
Loan Amount: ${inputs.currency}${inputs.loanAmount}
Interest Rate: ${inputs.interestRate}%
Tenure: ${inputs.tenure} ${inputs.tenureType}
Periodic installment: ${inputs.currency}${calculatedResults.monthlyEmi.toFixed(2)}
Total Principal Payable: ${inputs.currency}${calculatedResults.totalPrincipal.toFixed(2)}
Total Interest Payable: ${inputs.currency}${calculatedResults.totalInterest.toFixed(2)}
Total Paid: ${inputs.currency}${calculatedResults.totalPayment.toFixed(2)}
Estimated Payoff Date: ${calculatedResults.payoffDate}
==================================
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Variable interest rates add/delete helpers
  const addRateChange = () => {
    const change: EMIRateChange = {
      id: Math.random().toString(),
      effectivePaymentIndex: '',
      rate: '',
      reason: '',
    };
    setInputs({
      ...inputs,
      rateChanges: [...inputs.rateChanges, change]
    });
  };

  const removeRateChange = (id: string) => {
    setInputs({
      ...inputs,
      rateChanges: inputs.rateChanges.filter(rc => rc.id !== id)
    });
  };

  // Extra prepayments add/delete helpers
  const addExtraPayment = () => {
    const extra: EMIExtraPayment = {
      id: Math.random().toString(),
      paymentIndex: '',
      amount: '',
      applyTo: 'principal',
      description: ''
    };
    setInputs({
      ...inputs,
      extraPayments: [...inputs.extraPayments, extra]
    });
  };

  const removeExtraPayment = (id: string) => {
    setInputs({
      ...inputs,
      extraPayments: inputs.extraPayments.filter(ep => ep.id !== id)
    });
  };

  // Dynamic recurring payments helper
  const addRecurringExtraPayment = () => {
    const item: EMIRecurringExtraPayment = {
      id: Math.random().toString(),
      amount: '',
      frequency: ''
    };
    setInputs({
      ...inputs,
      recurringExtraPayments: [...(inputs.recurringExtraPayments || []), item]
    });
  };

  const removeRecurringExtraPayment = (id: string) => {
    setInputs({
      ...inputs,
      recurringExtraPayments: (inputs.recurringExtraPayments || []).filter(item => item.id !== id)
    });
  };

  // Dynamic taxes helper
  const addTaxEntry = () => {
    const item: EMITaxEntry = {
      id: Math.random().toString(),
      amount: '',
      frequency: ''
    };
    setInputs({
      ...inputs,
      taxesList: [...(inputs.taxesList || []), item]
    });
  };

  const removeTaxEntry = (id: string) => {
    setInputs({
      ...inputs,
      taxesList: (inputs.taxesList || []).filter(item => item.id !== id)
    });
  };

  // Dynamic insurance helper
  const addInsuranceEntry = () => {
    const item: EMIInsuranceEntry = {
      id: Math.random().toString(),
      amount: '',
      frequency: ''
    };
    setInputs({
      ...inputs,
      insuranceList: [...(inputs.insuranceList || []), item]
    });
  };

  const removeInsuranceEntry = (id: string) => {
    setInputs({
      ...inputs,
      insuranceList: (inputs.insuranceList || []).filter(item => item.id !== id)
    });
  };

  // Dynamic other fees helper
  const addAdditionalFeeEntry = () => {
    const item: EMIFeeEntry = {
      id: Math.random().toString(),
      amount: '',
      label: ''
    };
    setInputs({
      ...inputs,
      additionalFeesList: [...(inputs.additionalFeesList || []), item]
    });
  };

  const removeAdditionalFeeEntry = (id: string) => {
    setInputs({
      ...inputs,
      additionalFeesList: (inputs.additionalFeesList || []).filter(item => item.id !== id)
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-4">
      {/* Premium Dashboard Header */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Coins className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <span className="bg-white/10 backdrop-blur-md text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full text-blue-100">
            Professional Grade Amortization Engine
          </span>
          <h2 className="text-3xl font-black mt-2 tracking-tight">EMI Calculator</h2>
          <p className="text-xs text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
            The world's most advanced client-side EMI Solver. Accurately model compound periods, grace schedules, multiple variable rate segments, and complex extra prepayment strategies instantly.
          </p>

          {/* Quick Preset Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-blue-100/80 mr-1">Load Example Presets:</span>
            {[
              { type: 'home', label: 'Home Loan', color: 'bg-white/10 hover:bg-white/20' },
              { type: 'car', label: 'Car Loan', color: 'bg-white/10 hover:bg-white/20' },
              { type: 'personal', label: 'Personal Loan', color: 'bg-white/10 hover:bg-white/20' },
              { type: 'education', label: 'Student Loan', color: 'bg-white/10 hover:bg-white/20' },
              { type: 'business', label: 'Business Loan', color: 'bg-white/10 hover:bg-white/20' },
            ].map((btn) => (
              <button
                key={btn.type}
                onClick={() => loadExample(btn.type as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1 ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Dynamic Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-3xl p-6 shadow-xl relative">
            <div className="flex items-center justify-between gap-4 mb-6">
              <span className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">
                Loan Parameters
              </span>
              <button
                onClick={clearAll}
                className="text-xs font-bold text-neutral-500 hover:text-rose-500 flex items-center gap-1.5 transition select-none"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>

            {/* Validations warnings list */}
            {validationErrors.length > 0 && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-6 text-xs text-rose-600 font-semibold space-y-1">
                {validationErrors.map((err, i) => (
                  <p key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
                    {err}
                  </p>
                ))}
              </div>
            )}

            {/* Inputs Drawers Stack */}
            <div className="space-y-4 text-left">
              
              {/* SECTION A: Core Inputs */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850">
                <button
                  type="button"
                  onClick={() => toggleSection('core')}
                  className="w-full flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest mb-3"
                >
                  <span className="flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-blue-500" />
                    Core Specifications
                  </span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${expandedSection === 'core' ? 'rotate-180' : ''}`} />
                </button>

                {expandedSection === 'core' && (
                  <div className="space-y-4 pt-1">
                    {/* Loan Currency Displays */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Currency Symbol</label>
                      <select
                        value={inputs.currency}
                        onChange={(e) => setInputs({ ...inputs, currency: e.target.value })}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 w-full text-xs font-semibold focus:outline-none"
                      >
                        {['$', '€', '£', '¥', '₹', '₨', '₪', '₩'].map((sym) => (
                          <option key={sym} value={sym}>{sym} - Display Only</option>
                        ))}
                      </select>
                    </div>

                    {/* Loan Amount */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Loan Amount ({inputs.currency}) *</label>
                      <input
                        type="number"
                        placeholder="e.g. 500000"
                        value={inputs.loanAmount}
                        onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value === '' ? '' : Number(e.target.value) })}
                        className="px-4 py-2.5 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none text-xs font-mono font-semibold"
                      />
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Annual Interest Rate (%) *</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 8.5"
                        value={inputs.interestRate}
                        onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value === '' ? '' : Number(e.target.value) })}
                        className="px-4 py-2.5 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none text-xs font-mono font-semibold"
                      />
                    </div>

                    {/* Tenure */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Loan Tenure *</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="e.g. 20"
                          value={inputs.tenure}
                          onChange={(e) => setInputs({ ...inputs, tenure: e.target.value === '' ? '' : Number(e.target.value) })}
                          className="px-4 py-2.5 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none text-xs font-mono font-semibold"
                        />
                        <select
                          value={inputs.tenureType}
                          onChange={(e: any) => setInputs({ ...inputs, tenureType: e.target.value })}
                          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 text-xs font-bold focus:outline-none shrink-0"
                        >
                          <option value="">Choose Option</option>
                          <option value="years">Years</option>
                          <option value="months">Months</option>
                          <option value="weeks">Weeks</option>
                          <option value="payments">Payments</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION B: Down Payment & Fees */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850">
                <button
                  type="button"
                  onClick={() => toggleSection('deposit')}
                  className="w-full flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest"
                >
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-500" />
                    Down Payment & Fees
                  </span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${expandedSection === 'deposit' ? 'rotate-180' : ''}`} />
                </button>

                {expandedSection === 'deposit' && (
                  <div className="space-y-4 pt-4 border-t border-neutral-200/40 dark:border-neutral-800/40 mt-3">
                    {/* Down Payment */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Down Payment ({inputs.currency})</label>
                      <input
                        type="number"
                        placeholder="e.g. 100000"
                        value={inputs.downPayment}
                        onChange={(e) => setInputs({ ...inputs, downPayment: e.target.value === '' ? '' : Number(e.target.value) })}
                        className="px-4 py-2.5 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none text-xs font-mono font-semibold"
                      />
                    </div>

                    {/* Processing Fee */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Processing Fee</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="e.g. 1.5"
                          value={inputs.processingFee}
                          onChange={(e) => setInputs({ ...inputs, processingFee: e.target.value === '' ? '' : Number(e.target.value) })}
                          className="px-4 py-2.5 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none text-xs font-mono font-semibold"
                        />
                        <select
                          value={inputs.processingFeeType}
                          onChange={(e: any) => setInputs({ ...inputs, processingFeeType: e.target.value })}
                          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 text-xs font-bold focus:outline-none shrink-0"
                        >
                          <option value="">Choose Type</option>
                          <option value="percent">% Ratio</option>
                          <option value="flat">Flat Cash</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION C: Date & Grace Periods */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850">
                <button
                  type="button"
                  onClick={() => toggleSection('dates')}
                  className="w-full flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest"
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    Dates & Grace Periods
                  </span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${expandedSection === 'dates' ? 'rotate-180' : ''}`} />
                </button>

                {expandedSection === 'dates' && (
                  <div className="space-y-4 pt-4 border-t border-neutral-200/40 dark:border-neutral-800/40 mt-3">
                    {/* Loan Start Date */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Loan Start Date</label>
                      <input
                        type={inputs.startDate ? "date" : "text"}
                        placeholder="Select loan start date"
                        value={inputs.startDate}
                        onFocus={(e) => { e.target.type = "date"; }}
                        onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                        onChange={(e) => setInputs({ ...inputs, startDate: e.target.value })}
                        className="px-4 py-2.5 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none text-xs font-mono font-semibold"
                      />
                    </div>

                    {/* Grace Period */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Grace Period (Payments)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="e.g. 12"
                          value={inputs.gracePeriod}
                          onChange={(e) => setInputs({ ...inputs, gracePeriod: e.target.value === '' ? '' : Number(e.target.value) })}
                          className="px-4 py-2.5 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none text-xs font-mono font-semibold"
                        />
                        <select
                          value={inputs.gracePeriodType}
                          onChange={(e: any) => setInputs({ ...inputs, gracePeriodType: e.target.value })}
                          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 text-xs font-bold focus:outline-none shrink-0"
                        >
                          <option value="">Choose Type</option>
                          <option value="none">Disabled</option>
                          <option value="interest-only">Interest Only</option>
                          <option value="no-payment">No Payment</option>
                        </select>
                      </div>
                    </div>

                    {/* Interest Free Period */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Interest-Free Period (Payments)</label>
                      <input
                        type="number"
                        placeholder="e.g. 6"
                        value={inputs.interestFreePeriod}
                        onChange={(e) => setInputs({ ...inputs, interestFreePeriod: e.target.value === '' ? '' : Number(e.target.value) })}
                        className="px-4 py-2.5 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none text-xs font-mono font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION D: Extra Payments Accelerator */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest mb-3">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-500 animate-bounce" />
                    Recurring Extra Payments
                  </span>
                  <button
                    type="button"
                    onClick={addRecurringExtraPayment}
                    className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg transition text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Extra
                  </button>
                </div>

                <div className="space-y-4 pt-1">
                  {(inputs.recurringExtraPayments && inputs.recurringExtraPayments.length > 0) ? (
                    <div className="space-y-3">
                      {inputs.recurringExtraPayments.map((item, i) => (
                        <div key={item.id} className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/50 dark:border-neutral-800 text-xs relative space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-neutral-400 uppercase">Extra Amount ({inputs.currency})</label>
                              <input
                                type="number"
                                placeholder="e.g. 100"
                                value={item.amount}
                                onChange={(e) => {
                                  const list = [...(inputs.recurringExtraPayments || [])];
                                  list[i].amount = e.target.value === '' ? '' : Number(e.target.value);
                                  setInputs({ ...inputs, recurringExtraPayments: list });
                                }}
                                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-mono font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-neutral-400 uppercase">Frequency</label>
                              <select
                                value={item.frequency}
                                onChange={(e) => {
                                  const list = [...(inputs.recurringExtraPayments || [])];
                                  list[i].frequency = e.target.value;
                                  setInputs({ ...inputs, recurringExtraPayments: list });
                                }}
                                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-bold"
                              >
                                <option value="">Choose Option</option>
                                <option value="weekly">Weekly</option>
                                <option value="bi-weekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="semi-annually">Semi-Annually</option>
                                <option value="annually">Annually</option>
                              </select>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeRecurringExtraPayment(item.id)}
                            className="absolute top-1 right-1 p-1 text-neutral-300 hover:text-rose-500 rounded-lg transition"
                            title="Remove Extra Payment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-neutral-400/80 leading-relaxed font-semibold italic">
                      No recurring extra payments active. Click "Add Extra" to accelerate your loan payoff.
                    </p>
                  )}

                  {/* Prepayment Recast Mode */}
                  <div className="pt-2 border-t border-neutral-200/45 dark:border-neutral-850/45">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Prepayment Impact Mode</label>
                    <select
                      value={inputs.prepaymentRecastOption}
                      onChange={(e: any) => setInputs({ ...inputs, prepaymentRecastOption: e.target.value })}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 w-full text-xs font-semibold focus:outline-none"
                    >
                      <option value="">Choose Option</option>
                      <option value="keep-emi">Keep EMI Same, Shorten Tenure (Common)</option>
                      <option value="reduce-emi">Adjust EMI Down, Keep Tenure Same (Recast)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION E: Frequency & Compounding */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850">
                <button
                  type="button"
                  onClick={() => toggleSection('frequency')}
                  className="w-full flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest"
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Frequency & Compounding
                  </span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${expandedSection === 'frequency' ? 'rotate-180' : ''}`} />
                </button>

                {expandedSection === 'frequency' && (
                  <div className="space-y-4 pt-4 border-t border-neutral-200/40 dark:border-neutral-800/40 mt-3">
                    {/* Payment Frequency */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Payment Frequency</label>
                      <select
                        value={inputs.paymentFrequency}
                        onChange={(e: any) => setInputs({ ...inputs, paymentFrequency: e.target.value })}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 w-full text-xs font-semibold focus:outline-none"
                      >
                        <option value="">Choose Payment Frequency</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="semi-annually">Semi-Annually</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>

                    {/* Compounding Frequency */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Compounding Frequency</label>
                      <select
                        value={inputs.compoundFrequency}
                        onChange={(e: any) => setInputs({ ...inputs, compoundFrequency: e.target.value })}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 w-full text-xs font-semibold focus:outline-none"
                      >
                        <option value="">Choose Compound Frequency</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="monthly">Monthly (US Standard)</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="semi-annually">Semi-Annually (Canadian Standard)</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>

                    {/* Interest Type */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Interest Calculation Type</label>
                      <select
                        value={inputs.interestType}
                        onChange={(e: any) => setInputs({ ...inputs, interestType: e.target.value })}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 w-full text-xs font-semibold focus:outline-none"
                      >
                        <option value="">Choose Interest Type</option>
                        <option value="fixed">Fixed Rate</option>
                        <option value="variable">Variable Rate Schedule</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION F: Auxiliary Charges */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 space-y-6">
                
                {/* SUBSECTION F1: Property Taxes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-orange-500" />
                      Property Taxes List
                    </span>
                    <button
                      type="button"
                      onClick={addTaxEntry}
                      className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg transition text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Tax
                    </button>
                  </div>

                  {(inputs.taxesList && inputs.taxesList.length > 0) ? (
                    <div className="space-y-3">
                      {inputs.taxesList.map((item, i) => (
                        <div key={item.id} className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/50 dark:border-neutral-800 text-xs relative space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-neutral-400 uppercase">Amount ({inputs.currency})</label>
                              <input
                                type="number"
                                placeholder="e.g. 150"
                                value={item.amount}
                                onChange={(e) => {
                                  const list = [...(inputs.taxesList || [])];
                                  list[i].amount = e.target.value === '' ? '' : Number(e.target.value);
                                  setInputs({ ...inputs, taxesList: list });
                                }}
                                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-mono font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-neutral-400 uppercase">Frequency</label>
                              <select
                                value={item.frequency}
                                onChange={(e) => {
                                  const list = [...(inputs.taxesList || [])];
                                  list[i].frequency = e.target.value;
                                  setInputs({ ...inputs, taxesList: list });
                                }}
                                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-bold"
                              >
                                <option value="">Choose Option</option>
                                <option value="monthly">Monthly</option>
                                <option value="annual">Yearly</option>
                              </select>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeTaxEntry(item.id)}
                            className="absolute top-1 right-1 p-1 text-neutral-300 hover:text-rose-500 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-neutral-400/80 leading-relaxed font-semibold italic pl-1">
                      No tax entries added. Click "Add Tax" to define property tax overheads.
                    </p>
                  )}
                </div>

                {/* SUBSECTION F2: Insurance List */}
                <div className="space-y-3 pt-3 border-t border-neutral-200/30 dark:border-neutral-850/30">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-orange-500" />
                      Home & Mortgage Insurance
                    </span>
                    <button
                      type="button"
                      onClick={addInsuranceEntry}
                      className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg transition text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Insurance
                    </button>
                  </div>

                  {(inputs.insuranceList && inputs.insuranceList.length > 0) ? (
                    <div className="space-y-3">
                      {inputs.insuranceList.map((item, i) => (
                        <div key={item.id} className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/50 dark:border-neutral-800 text-xs relative space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-neutral-400 uppercase">Cost ({inputs.currency})</label>
                              <input
                                type="number"
                                placeholder="e.g. 75"
                                value={item.amount}
                                onChange={(e) => {
                                  const list = [...(inputs.insuranceList || [])];
                                  list[i].amount = e.target.value === '' ? '' : Number(e.target.value);
                                  setInputs({ ...inputs, insuranceList: list });
                                }}
                                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-mono font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-neutral-400 uppercase">Frequency</label>
                              <select
                                value={item.frequency}
                                onChange={(e) => {
                                  const list = [...(inputs.insuranceList || [])];
                                  list[i].frequency = e.target.value;
                                  setInputs({ ...inputs, insuranceList: list });
                                }}
                                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-bold"
                              >
                                <option value="">Choose Option</option>
                                <option value="monthly">Monthly</option>
                                <option value="annual">Yearly</option>
                                <option value="one-time">One-time</option>
                              </select>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeInsuranceEntry(item.id)}
                            className="absolute top-1 right-1 p-1 text-neutral-300 hover:text-rose-500 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-neutral-400/80 leading-relaxed font-semibold italic pl-1">
                      No insurance entries added. Click "Add Insurance" to define coverage premiums.
                    </p>
                  )}
                </div>

                {/* SUBSECTION F3: Additional Fees List */}
                <div className="space-y-3 pt-3 border-t border-neutral-200/30 dark:border-neutral-850/30">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-orange-500" />
                      Other Charges & Fees
                    </span>
                    <button
                      type="button"
                      onClick={addAdditionalFeeEntry}
                      className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg transition text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Fee
                    </button>
                  </div>

                  {(inputs.additionalFeesList && inputs.additionalFeesList.length > 0) ? (
                    <div className="space-y-3">
                      {inputs.additionalFeesList.map((item, i) => (
                        <div key={item.id} className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/50 dark:border-neutral-800 text-xs relative space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-neutral-400 uppercase">Amount (Monthly)</label>
                              <input
                                type="number"
                                placeholder="e.g. 15"
                                value={item.amount}
                                onChange={(e) => {
                                  const list = [...(inputs.additionalFeesList || [])];
                                  list[i].amount = e.target.value === '' ? '' : Number(e.target.value);
                                  setInputs({ ...inputs, additionalFeesList: list });
                                }}
                                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-mono font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-neutral-400 uppercase">Description</label>
                              <input
                                type="text"
                                placeholder="e.g. Admin, Maintenance"
                                value={item.label}
                                onChange={(e) => {
                                  const list = [...(inputs.additionalFeesList || [])];
                                  list[i].label = e.target.value;
                                  setInputs({ ...inputs, additionalFeesList: list });
                                }}
                                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-semibold text-neutral-700 dark:text-neutral-300"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeAdditionalFeeEntry(item.id)}
                            className="absolute top-1 right-1 p-1 text-neutral-300 hover:text-rose-500 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-neutral-400/80 leading-relaxed font-semibold italic pl-1">
                      No auxiliary fee entries added. Click "Add Fee" to define extra overheads.
                    </p>
                  )}
                </div>

              </div>

              {/* SECTION G: Variable Rate Schedule */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest mb-3">
                  <span className="flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-rose-500 animate-pulse" />
                    Interest Rate Schedule
                  </span>
                  <button
                    type="button"
                    onClick={addRateChange}
                    className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg transition text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Rate Shift
                  </button>
                </div>

                {inputs.rateChanges.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    {inputs.rateChanges.map((rc, i) => (
                      <div key={rc.id} className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/50 dark:border-neutral-800 text-xs relative space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-neutral-400 uppercase">From Payment No.</label>
                            <input
                              type="number"
                              placeholder="e.g. 12"
                              value={rc.effectivePaymentIndex}
                              onChange={(e) => {
                                const list = [...inputs.rateChanges];
                                list[i].effectivePaymentIndex = e.target.value === '' ? '' : Math.max(1, Number(e.target.value));
                                setInputs({ ...inputs, rateChanges: list });
                              }}
                              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-mono font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-neutral-400 uppercase">New Rate (%)</label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="e.g. 5.5"
                              value={rc.rate}
                              onChange={(e) => {
                                const list = [...inputs.rateChanges];
                                list[i].rate = e.target.value === '' ? '' : Number(e.target.value);
                                setInputs({ ...inputs, rateChanges: list });
                              }}
                              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-mono font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-neutral-400 uppercase">Reason / Event (Optional)</label>
                          <input
                            type="text"
                            value={rc.reason || ''}
                            onChange={(e) => {
                              const list = [...inputs.rateChanges];
                              list[i].reason = e.target.value;
                              setInputs({ ...inputs, rateChanges: list });
                            }}
                            placeholder="e.g. Index Shift"
                            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-[11px] focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeRateChange(rc.id)}
                          className="absolute top-1 right-1 p-1 text-neutral-300 hover:text-rose-500 rounded-lg transition"
                          title="Remove Adjustment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-neutral-400/80 leading-relaxed font-semibold italic">
                    No entries added. Click "Add Rate Shift" to introduce adjustments over the timeline.
                  </p>
                )}
              </div>

              {/* SECTION H: Custom Extra Payments Schedule */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest mb-3">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-500 animate-pulse" />
                    Custom Extra Payments
                  </span>
                  <button
                    type="button"
                    onClick={addExtraPayment}
                    className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg transition text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Lump Sum
                  </button>
                </div>

                {inputs.extraPayments.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    {inputs.extraPayments.map((ep, i) => (
                      <div key={ep.id} className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/50 dark:border-neutral-800 text-xs relative space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-neutral-400 uppercase">Payment No.</label>
                            <input
                              type="number"
                              placeholder="e.g. 36"
                              value={ep.paymentIndex}
                              onChange={(e) => {
                                const list = [...inputs.extraPayments];
                                list[i].paymentIndex = e.target.value === '' ? '' : Math.max(1, Number(e.target.value));
                                setInputs({ ...inputs, extraPayments: list });
                              }}
                              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-mono font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-neutral-400 uppercase">Amount ({inputs.currency})</label>
                            <input
                              type="number"
                              placeholder="e.g. 1000"
                              value={ep.amount}
                              onChange={(e) => {
                                const list = [...inputs.extraPayments];
                                list[i].amount = e.target.value === '' ? '' : Math.max(1, Number(e.target.value));
                                setInputs({ ...inputs, extraPayments: list });
                              }}
                              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-xs focus:outline-none font-mono font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-neutral-400 uppercase">Notes (Optional)</label>
                          <input
                            type="text"
                            value={ep.description || ''}
                            onChange={(e) => {
                              const list = [...inputs.extraPayments];
                              list[i].description = e.target.value;
                              setInputs({ ...inputs, extraPayments: list });
                            }}
                            placeholder="e.g. Inheritance, Bonus"
                            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 p-1.5 rounded-lg text-[11px] focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeExtraPayment(ep.id)}
                          className="absolute top-1 right-1 p-1 text-neutral-300 hover:text-rose-500 rounded-lg transition"
                          title="Remove Prepayment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-neutral-400/80 leading-relaxed font-semibold italic">
                    No entries added. Use "Add Lump Sum" to define one-time payments at any specific month.
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Key KPIs & Visual Tabs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Workspace Navigation */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-2xl w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-cyan-400 shadow-md border border-neutral-200/50 dark:border-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('charts')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'charts'
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-cyan-400 shadow-md border border-neutral-200/50 dark:border-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Visual Analytics
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'schedule'
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-cyan-400 shadow-md border border-neutral-200/50 dark:border-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              Amortization Curve
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'comparison'
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-cyan-400 shadow-md border border-neutral-200/50 dark:border-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              What-If Sandbox
            </button>

            <button
              onClick={() => setActiveTab('affordability')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'affordability'
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-cyan-400 shadow-md border border-neutral-200/50 dark:border-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <Coins className="w-4 h-4" />
              Affordability Index
            </button>
          </div>

          {/* Active Tab Frame */}
          <div className="space-y-6">
            {!isReady ? (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-3xl p-8 shadow-xl text-center space-y-6">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <BadgeAlert className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-neutral-800 dark:text-white">Simulation Suspended</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                    The EMI Calculator is currently in a pristine blank state. Please fill out the required specifications on the left or click <strong className="text-blue-600 dark:text-cyan-400">"Load Example"</strong> to initialize the engine.
                  </p>
                </div>

                <div className="max-w-md mx-auto border border-neutral-150 dark:border-neutral-800 rounded-2xl p-4 bg-neutral-50 dark:bg-neutral-950/60 text-left space-y-3">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-200/40 dark:border-neutral-850/40 pb-2">Required Inputs Progress</span>
                  
                  <div className="space-y-2 text-xs font-bold text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center justify-between">
                      <span>Loan Amount</span>
                      {inputs.loanAmount && Number(inputs.loanAmount) > 0 ? (
                        <span className="text-emerald-500 flex items-center gap-1">✔️ Provided</span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">❌ Enter Loan Amount</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Interest Rate</span>
                      {inputs.interestRate !== '' && Number(inputs.interestRate) >= 0 ? (
                        <span className="text-emerald-500 flex items-center gap-1">✔️ Provided</span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">❌ Enter Interest Rate</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Loan Tenure</span>
                      {inputs.tenure && Number(inputs.tenure) > 0 ? (
                        <span className="text-emerald-500 flex items-center gap-1">✔️ Provided</span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">❌ Enter Loan Term</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Tenure Type</span>
                      {inputs.tenureType ? (
                        <span className="text-emerald-500 flex items-center gap-1">✔️ Selected</span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">❌ Choose Tenure Type</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Payment Frequency</span>
                      {inputs.paymentFrequency ? (
                        <span className="text-emerald-500 flex items-center gap-1">✔️ Selected</span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">❌ Choose Payment Frequency</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Compounding Frequency</span>
                      {inputs.compoundFrequency ? (
                        <span className="text-emerald-500 flex items-center gap-1">✔️ Selected</span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">❌ Choose Compound Frequency</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Interest Type</span>
                      {inputs.interestType ? (
                        <span className="text-emerald-500 flex items-center gap-1">✔️ Selected</span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">❌ Choose Interest Type</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* TAB 1: OVERVIEW & DASHBOARD */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    
                    {/* PRIMARY DASHBOARD WIDGETS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Monthly EMI */}
                      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-lg relative overflow-hidden">
                        <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">Periodic EMI Payment</span>
                        <span className="text-3xl font-black text-blue-600 dark:text-cyan-400 font-mono tracking-tight block">
                          {inputs.currency}{calculatedResults.monthlyEmi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <p className="text-[10px] text-neutral-400 mt-2 font-bold flex items-center gap-1">
                          <Info className="w-3.5 h-3.5 shrink-0 text-neutral-300" />
                          Amount payable per {inputs.paymentFrequency} cycle
                        </p>
                      </div>

                      {/* Payoff Date */}
                      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-lg relative overflow-hidden">
                        <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">Estimated Payoff Date</span>
                        <span className="text-2xl font-black text-neutral-850 dark:text-white tracking-tight block">
                          {calculatedResults.payoffDate}
                        </span>
                        <p className="text-[10px] text-neutral-400 mt-2 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 shrink-0 text-neutral-300 animate-pulse" />
                          Total Term: {calculatedResults.rows.length} cycles ({inputs.paymentFrequency})
                        </p>
                      </div>
                    </div>

                    {/* SAVINGS ACCELERATOR BANNER (Conditional) */}
                    {calculatedResults.hasExtraPayments && calculatedResults.interestSaved > 0 && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/25 flex items-center justify-between gap-4">
                        <div className="text-left">
                          <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest block mb-0.5">Prepayment Accelerator Active</span>
                          <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                            You will save <strong className="text-emerald-600 dark:text-emerald-400">{inputs.currency}{Math.round(calculatedResults.interestSaved).toLocaleString()}</strong> in interest and close your loan <strong className="text-emerald-600 dark:text-emerald-400">{calculatedResults.timeSavedMonths.toFixed(1)} months earlier</strong> than scheduled!
                          </p>
                        </div>
                        <div className="text-right font-mono shrink-0">
                          <span className="text-[10px] text-neutral-400 block font-bold">Interest Saved</span>
                          <span className="text-xl font-extrabold text-emerald-500">
                            -{((calculatedResults.interestSaved / calculatedResults.baseTotalInterest) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* DISTRIBUTION BREAKDOWN */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-3xl p-6 shadow-xl text-left">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">
                          Repayment Composition
                        </span>
                        <button
                          onClick={handleCopyResults}
                          className="text-xs font-bold text-neutral-500 hover:text-blue-500 flex items-center gap-1.5 transition select-none"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Summary
                            </>
                          )}
                        </button>
                      </div>

                      {/* Multi-segmented Progress Bar */}
                      <div className="w-full bg-neutral-100 dark:bg-neutral-950 h-5 rounded-full overflow-hidden flex mb-6 border border-neutral-150 dark:border-neutral-850">
                        <div 
                          className="bg-blue-500 transition-all duration-500" 
                          style={{ width: `${calculatedResults.principalPercent}%` }} 
                          title={`Principal: ${calculatedResults.principalPercent.toFixed(1)}%`}
                        />
                        <div 
                          className="bg-amber-500 transition-all duration-500" 
                          style={{ width: `${calculatedResults.interestPercent}%` }} 
                          title={`Interest: ${calculatedResults.interestPercent.toFixed(1)}%`}
                        />
                      </div>

                      {/* Details Ledger */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {/* Total Principal */}
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">Total Principal</span>
                          <span className="text-base font-bold text-neutral-800 dark:text-white font-mono block">
                            {inputs.currency}{calculatedResults.totalPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-[10px] text-blue-500 font-bold block mt-0.5">
                            {calculatedResults.principalPercent.toFixed(1)}% Ratio
                          </span>
                        </div>

                        {/* Total Interest */}
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">Total Interest</span>
                          <span className="text-base font-bold text-neutral-800 dark:text-white font-mono block">
                            {inputs.currency}{calculatedResults.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-[10px] text-amber-500 font-bold block mt-0.5">
                            {calculatedResults.interestPercent.toFixed(1)}% Ratio
                          </span>
                        </div>

                        {/* Additional Fees */}
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">Administrative & Fees</span>
                          <span className="text-base font-bold text-neutral-800 dark:text-white font-mono block">
                            {inputs.currency}{calculatedResults.totalExtraFees.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-bold block mt-0.5">
                            Taxes/Ins/Admin
                          </span>
                        </div>
                      </div>

                      {/* Summary Total Payout */}
                      <div className="border-t border-neutral-200/60 dark:border-neutral-800/80 pt-4 mt-6 flex justify-between items-baseline">
                        <span className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-wider">Total out of pocket cost</span>
                        <span className="text-xl font-black text-neutral-850 dark:text-white font-mono">
                          {inputs.currency}{(calculatedResults.totalPayment + calculatedResults.totalExtraFees).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* SMART INSIGHTS COMPONENT */}
                    <EMISmartInsights 
                      results={calculatedResults} 
                      currency={inputs.currency} 
                      loanAmount={Number(inputs.loanAmount) || 0} 
                    />

                  </div>
                )}

                {/* TAB 2: INTERACTIVE CHARTS */}
                {activeTab === 'charts' && (
                  <EMIVisualizations 
                    results={calculatedResults} 
                    baseline={baselineResults} 
                    currency={inputs.currency} 
                  />
                )}

                {/* TAB 3: AMORTIZATION SCHEDULE */}
                {activeTab === 'schedule' && (
                  <EMIPaymentsTable 
                    rows={calculatedResults.rows} 
                    currency={inputs.currency} 
                  />
                )}

                {/* TAB 4: WHAT-IF COMPARISON */}
                {activeTab === 'comparison' && (
                  <EMIWhatIfComparison
                    baseInputs={inputs}
                    baseEmi={calculatedResults.monthlyEmi}
                    baseInterest={calculatedResults.totalInterest}
                    baseTotal={calculatedResults.totalPayment}
                    basePayoff={calculatedResults.payoffDate}
                    currency={inputs.currency}
                  />
                )}

                {/* TAB 5: AFFORDABILITY INDEX */}
                {activeTab === 'affordability' && (
                  <EMILoanAffordability
                    monthlyEmi={calculatedResults.monthlyEmi}
                    otherFees={totalAuxiliaryMonthlyFees}
                    currency={inputs.currency}
                  />
                )}
              </>
            )}

          </div>

        </div>

      </div>

      {/* COMPREHENSIVE SEO & EDUCATIONAL HUB */}
      <EMIEducationalContent onNavigate={onNavigate} />

    </div>
  );
}
