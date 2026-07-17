import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Trash2, 
  AlertTriangle,
  FileText, 
  TrendingUp, 
  Coins, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LoanInputs, computeLoanAmortization } from '../utils/ultimateLoanMath';
import UltimateLoanInputSections from './UltimateLoanInputSections';
import UltimateLoanResults from './UltimateLoanResults';
import UltimateLoanAmortizationTable from './UltimateLoanAmortizationTable';
import UltimateLoanComparison from './UltimateLoanComparison';
import UltimateLoanSeoContent from './UltimateLoanSeoContent';

export default function UltimateLoanCalculator() {
  // YYYY-MM-DD format helper
  const todayStr = useMemo(() => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }, []);

  // Empty values on page load as mandated by constraints: "Every numeric field must be completely empty when the page loads"
  const createEmptyInputs = (): LoanInputs => ({
    amount: '' as any,
    currency: '$',
    interestRate: '' as any,
    interestType: 'fixed',
    variableRates: [],
    termYears: '' as any,
    termMonths: '' as any,
    startDate: todayStr,
    paymentFrequency: 'monthly',
    compoundingFrequency: 'monthly',
    downPayment: '' as any,
    downPaymentPercent: '' as any,
    
    // Fees
    processingFee: '' as any,
    processingFeeType: 'fixed',
    originationFee: '' as any,
    originationFeeType: 'percent',
    otherFees: '' as any,
    otherFeesType: 'fixed',

    // Insurance
    mortgageInsurance: '' as any,
    mortgageInsuranceType: 'monthly',
    propertyInsurance: '' as any,
    propertyInsuranceType: 'yearly',

    // Taxes
    propertyTax: '' as any,
    propertyTaxType: 'yearly',
    stampDuty: '' as any,
    stampDutyType: 'percent',

    // Extra payments
    extraMonthly: '' as any,
    extraYearly: '' as any,
    extraPaymentsList: [],

    // Advanced options
    gracePeriod: '' as any,
    graceType: 'interest-only',
    balloonPayment: '' as any,
    inflationRate: '' as any,
  });

  const [inputs, setInputs] = useState<LoanInputs>(() => createEmptyInputs());
  const [resultsTab, setResultsTab] = useState<'dashboard' | 'schedule' | 'comparison' | 'education'>('dashboard');

  // Input validations: "The calculator only calculates using values explicitly entered by the user."
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    
    if (inputs.amount === undefined || inputs.amount === '') {
      errors.push("Please enter Loan Amount.");
    } else if (Number(inputs.amount) <= 0) {
      errors.push("Loan Amount must be greater than zero.");
    }

    if (inputs.interestRate === undefined || inputs.interestRate === '') {
      errors.push("Please enter Interest Rate.");
    } else {
      const r = Number(inputs.interestRate);
      if (r < -100 || r > 100) {
        errors.push("Interest Rate must be between -100% and 100%.");
      }
    }

    const hasYears = inputs.termYears !== undefined && inputs.termYears !== '';
    const hasMonths = inputs.termMonths !== undefined && inputs.termMonths !== '';
    if (!hasYears && !hasMonths) {
      errors.push("Please enter Loan Term (Years or Months).");
    } else {
      const yrs = Number(inputs.termYears) || 0;
      const mos = Number(inputs.termMonths) || 0;
      if (yrs < 0 || mos < 0) {
        errors.push("Loan Term cannot be negative.");
      } else if (yrs === 0 && mos === 0) {
        errors.push("Loan Term must be greater than zero.");
      }
    }

    const dp = Number(inputs.downPayment) || 0;
    const amt = Number(inputs.amount) || 0;
    if (dp > amt) {
      errors.push("Down Payment cannot exceed Loan Amount.");
    }

    const extraM = Number(inputs.extraMonthly) || 0;
    const extraY = Number(inputs.extraYearly) || 0;
    if (extraM < 0 || extraY < 0) {
      errors.push("Extra payments cannot be negative.");
    }

    return errors;
  }, [inputs]);

  // Load standard premium interactive demo values
  const loadDemoInputs = () => {
    setInputs({
      amount: 250000,
      currency: '$',
      interestRate: 6.5,
      interestType: 'fixed',
      variableRates: [],
      termYears: 30,
      termMonths: 0,
      startDate: todayStr,
      paymentFrequency: 'monthly',
      compoundingFrequency: 'monthly',
      downPayment: 50000,
      downPaymentPercent: 20,
      processingFee: 500,
      processingFeeType: 'fixed',
      originationFee: 1,
      originationFeeType: 'percent',
      otherFees: 0,
      otherFeesType: 'fixed',
      mortgageInsurance: 0,
      mortgageInsuranceType: 'monthly',
      propertyInsurance: 1200,
      propertyInsuranceType: 'yearly',
      propertyTax: 3000,
      propertyTaxType: 'yearly',
      stampDuty: 1.5,
      stampDutyType: 'percent',
      extraMonthly: 150,
      extraYearly: 0,
      extraPaymentsList: [
        { id: 'dp1', type: 'onetime', month: 12, amount: 5000, description: 'Prepayment event' }
      ],
      gracePeriod: 0,
      graceType: 'interest-only',
      balloonPayment: 0,
      inflationRate: 3.0
    });
  };

  const handleClearAll = () => {
    setInputs(createEmptyInputs());
  };

  const handleClearSection = (sectionId: string) => {
    setInputs(prev => {
      const updated = { ...prev };
      if (sectionId === 'basic') {
        updated.amount = '' as any;
        updated.interestRate = '' as any;
        updated.interestType = 'fixed';
        updated.termYears = '' as any;
        updated.termMonths = '' as any;
        updated.startDate = todayStr;
        updated.paymentFrequency = 'monthly';
        updated.compoundingFrequency = 'monthly';
      } else if (sectionId === 'downpayment') {
        updated.downPayment = '' as any;
        updated.downPaymentPercent = '' as any;
      } else if (sectionId === 'costs') {
        updated.processingFee = '' as any;
        updated.processingFeeType = 'fixed';
        updated.originationFee = '' as any;
        updated.originationFeeType = 'percent';
        updated.stampDuty = '' as any;
        updated.stampDutyType = 'percent';
      } else if (sectionId === 'insurance') {
        updated.mortgageInsurance = '' as any;
        updated.mortgageInsuranceType = 'monthly';
        updated.propertyInsurance = '' as any;
        updated.propertyInsuranceType = 'yearly';
      } else if (sectionId === 'taxes') {
        updated.propertyTax = '' as any;
        updated.propertyTaxType = 'yearly';
      } else if (sectionId === 'extrapayments') {
        updated.extraMonthly = '' as any;
        updated.extraYearly = '' as any;
        updated.extraPaymentsList = [];
      } else if (sectionId === 'advanced') {
        updated.gracePeriod = '' as any;
        updated.graceType = 'interest-only';
        updated.balloonPayment = '' as any;
        updated.variableRates = [];
      } else if (sectionId === 'inflation') {
        updated.inflationRate = '' as any;
      }
      return updated;
    });
  };

  // Compute live results (only used for rendering when validation passes)
  const results = useMemo(() => {
    return computeLoanAmortization(inputs);
  }, [inputs]);

  // Tab styling helper
  const tabClass = (tab: typeof resultsTab) => 
    `px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition duration-300 select-none cursor-pointer flex items-center gap-1.5 ${
      resultsTab === tab 
        ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-neutral-950 shadow-md shadow-blue-500/10' 
        : 'text-neutral-550 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-neutral-100/50 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-900'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* PREMIUM HEADER */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 p-1 px-3.5 rounded-full text-[10px] font-black bg-blue-500/5 text-blue-600 dark:text-cyan-400 border border-blue-500/15 uppercase select-none tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Premium Debt Simulator
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white tracking-tight leading-none">
          Ultimate Loan Calculator
        </h1>
        
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-450 leading-relaxed font-medium">
          Configure down payments, prepayments, localized loan costs, and dynamic variables on a single screen. No assumptions or hidden rules—all calculated mathematically from your precise inputs.
        </p>
      </div>

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTROL PANEL INPUTS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-cyan-400"></div>
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">Control Panel Inputs</h3>
            </div>
          </div>

          {/* Load Example and Clear All */}
          <div className="flex gap-2.5">
            <button
              onClick={loadDemoInputs}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-500/5 hover:bg-blue-500/10 dark:bg-cyan-400/5 dark:hover:bg-cyan-400/10 border border-blue-500/15 dark:border-cyan-400/15 hover:border-blue-500/30 dark:hover:border-cyan-400/30 rounded-xl transition cursor-pointer select-none"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Example
            </button>
            <button
              onClick={handleClearAll}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/15 hover:border-rose-500/30 rounded-xl transition cursor-pointer select-none"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>

          <UltimateLoanInputSections 
            inputs={inputs} 
            setInputs={setInputs} 
            onClearSection={handleClearSection}
          />
        </div>

        {/* RIGHT COLUMN: TAB VIEW + PROJECTIONS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB NAVIGATION HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-150 dark:border-neutral-800">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setResultsTab('dashboard')} className={tabClass('dashboard')}>
                Executive Dashboard
              </button>
              <button onClick={() => setResultsTab('schedule')} className={tabClass('schedule')}>
                Amortization Schedule
              </button>
              <button onClick={() => setResultsTab('comparison')} className={tabClass('comparison')}>
                Compare Scenarios
              </button>
              <button onClick={() => setResultsTab('education')} className={tabClass('education')}>
                Educational Guide
              </button>
            </div>
          </div>

          {/* TAB CONTENTS CONTAINER */}
          <div className="transition-all">
            {validationErrors.length > 0 ? (
              /* PREMIUM "WAITING FOR INPUT" SCREEN */
              <div className="p-8 border border-blue-500/10 dark:border-cyan-500/10 rounded-3xl bg-gradient-to-br from-blue-500/5 to-transparent dark:from-cyan-500/5 dark:to-transparent flex flex-col items-center justify-center text-center py-16 space-y-6">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/15 dark:border-cyan-500/15 flex items-center justify-center text-blue-600 dark:text-cyan-400 animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">Waiting for Required Inputs</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                    This loan calculation engine simulates payments based strictly on values explicitly entered. We never guess, estimate, or fill defaults behind your back.
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-neutral-900/60 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl p-5 w-full max-w-sm text-left space-y-3">
                  <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block">Required Fields Remaining:</span>
                  <ul className="space-y-1.5">
                    {validationErrors.map((err, idx) => (
                      <li key={idx} className="text-xs font-bold text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={loadDemoInputs}
                  className="flex items-center gap-2 px-5 py-3 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:text-neutral-950 dark:hover:bg-cyan-400 rounded-xl shadow-lg shadow-blue-500/10 dark:shadow-cyan-500/10 transition cursor-pointer select-none"
                >
                  <Sparkles className="w-4 h-4" /> Load Premium Example
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={resultsTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  {resultsTab === 'dashboard' && (
                    <UltimateLoanResults 
                      results={results} 
                      inputs={inputs} 
                    />
                  )}

                  {resultsTab === 'schedule' && (
                    <UltimateLoanAmortizationTable 
                      schedule={results.schedule} 
                      inputs={inputs} 
                    />
                  )}

                  {resultsTab === 'comparison' && (
                    <UltimateLoanComparison 
                      currentInputs={inputs} 
                      currentResults={results} 
                    />
                  )}

                  {resultsTab === 'education' && (
                    <UltimateLoanSeoContent />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
