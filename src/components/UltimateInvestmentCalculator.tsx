import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Coins, 
  HelpCircle, 
  Clock, 
  ShieldAlert, 
  Sliders, 
  LayoutGrid, 
  TableProperties, 
  Scale, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { InvestmentInputs, computeInvestmentProjection } from '../utils/ultimateInvestmentMath';
import UltimateInvestmentInputSections from './UltimateInvestmentInputSections';
import UltimateInvestmentResults from './UltimateInvestmentResults';
import UltimateInvestmentLedgerTable from './UltimateInvestmentLedgerTable';
import UltimateInvestmentComparison from './UltimateInvestmentComparison';
import UltimateInvestmentSeoContent from './UltimateInvestmentSeoContent';

import { Sparkles, Trash2, AlertTriangle } from 'lucide-react';

export default function UltimateInvestmentCalculator() {
  // Today's date YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }, []);

  // Empty values on page load as mandated by constraints: "Every numeric field must be completely empty when the page loads"
  const createEmptyInputs = (): InvestmentInputs => ({
    initialInvestment: '' as any,
    currency: '$',
    investmentGoal: '' as any,
    investmentPeriodYears: '' as any,
    investmentPeriodMonths: '' as any,
    startDate: todayStr,
    
    // Return parameters
    annualReturn: '' as any,
    returnType: 'fixed',
    customReturns: [],

    // Compounding Frequency
    compoundingFrequency: 'monthly',

    // Contributions
    monthlyContribution: '' as any,
    weeklyContribution: '' as any,
    yearlyContribution: '' as any,
    biweeklyContribution: '' as any,
    quarterlyContribution: '' as any,
    customContribution: '' as any,
    customContributionIntervalMonths: '' as any,
    contributionStepUpPercent: '' as any,

    // Withdrawals
    monthlyWithdrawal: '' as any,
    yearlyWithdrawal: '' as any,
    customWithdrawals: [],

    // Dividends
    dividendYield: '' as any,
    dividendGrowth: '' as any,
    reinvestDividends: true,
    dividendTaxRate: '' as any,

    // Taxation & Inflation
    capitalGainsTaxRate: '' as any,
    annualTaxRate: '' as any,
    exitTaxRate: '' as any,
    inflationRate: '' as any,

    // Fees
    brokerFeePercent: '' as any,
    managementFeePercent: '' as any,
    expenseRatio: '' as any,
    transactionFee: '' as any,
    platformFeeMonthly: '' as any,
    performanceFeePercent: '' as any,

    // Risk
    volatility: '' as any,
    riskLevel: 'medium',

    // Portfolio
    assets: [
      { id: '1', name: 'Global Equities ETF', percentage: '' as any, expectedReturn: '' as any, volatility: '' as any },
      { id: '2', name: 'Government Bonds', percentage: '' as any, expectedReturn: '' as any, volatility: '' as any },
      { id: '3', name: 'Alternative Assets / Cash', percentage: '' as any, expectedReturn: '' as any, volatility: '' as any }
    ]
  });

  const [inputs, setInputs] = useState<InvestmentInputs>(() => createEmptyInputs());

  // Input validations: "The calculator only calculates using values explicitly entered by the user."
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    
    if (inputs.initialInvestment === undefined || inputs.initialInvestment === '') {
      errors.push("Please enter Initial Investment.");
    } else if (Number(inputs.initialInvestment) < 0) {
      errors.push("Initial Investment cannot be negative.");
    }

    if (inputs.annualReturn === undefined || inputs.annualReturn === '') {
      errors.push("Please enter Interest Rate.");
    } else {
      const r = Number(inputs.annualReturn);
      if (r < -100 || r > 100) {
        errors.push("Interest Rate must be between -100% and 100%.");
      }
    }

    const hasYears = inputs.investmentPeriodYears !== undefined && inputs.investmentPeriodYears !== '';
    const hasMonths = inputs.investmentPeriodMonths !== undefined && inputs.investmentPeriodMonths !== '';
    if (!hasYears && !hasMonths) {
      errors.push("Please enter Investment Period.");
    } else {
      const yrs = Number(inputs.investmentPeriodYears) || 0;
      const mos = Number(inputs.investmentPeriodMonths) || 0;
      if (yrs < 0 || mos < 0) {
        errors.push("Investment Period cannot be negative.");
      } else if (yrs === 0 && mos === 0) {
        errors.push("Investment Period must be greater than zero.");
      }
    }

    if (inputs.investmentGoal !== undefined && inputs.investmentGoal !== '' && Number(inputs.investmentGoal) < 0) {
      errors.push("Investment Goal cannot be negative.");
    }
    
    if (inputs.inflationRate !== undefined && inputs.inflationRate !== '' && Number(inputs.inflationRate) < 0) {
      errors.push("Inflation Rate cannot be negative.");
    }

    return errors;
  }, [inputs]);

  // Load standard premium interactive demo values
  const loadDemoInputs = () => {
    setInputs({
      initialInvestment: 10000,
      currency: '$',
      investmentGoal: 250000,
      investmentPeriodYears: 10,
      investmentPeriodMonths: 0,
      startDate: todayStr,
      annualReturn: 8.5,
      returnType: 'fixed',
      customReturns: [],
      compoundingFrequency: 'monthly',
      monthlyContribution: 500,
      weeklyContribution: 0,
      yearlyContribution: 0,
      biweeklyContribution: 0,
      quarterlyContribution: 0,
      customContribution: 0,
      customContributionIntervalMonths: 0,
      contributionStepUpPercent: 5,
      monthlyWithdrawal: 0,
      yearlyWithdrawal: 0,
      customWithdrawals: [],
      dividendYield: 2.0,
      dividendGrowth: 4.0,
      reinvestDividends: true,
      dividendTaxRate: 15,
      capitalGainsTaxRate: 20,
      annualTaxRate: 0,
      exitTaxRate: 0,
      inflationRate: 3.0,
      brokerFeePercent: 0.1,
      managementFeePercent: 0.4,
      expenseRatio: 0.15,
      transactionFee: 0,
      platformFeeMonthly: 5,
      performanceFeePercent: 0,
      volatility: 12,
      riskLevel: 'medium',
      assets: [
        { id: '1', name: 'Global Equities ETF', percentage: 60, expectedReturn: 9.0, volatility: 15 },
        { id: '2', name: 'Government Bonds', percentage: 30, expectedReturn: 4.0, volatility: 4 },
        { id: '3', name: 'Alternative Assets / Cash', percentage: 10, expectedReturn: 2.0, volatility: 2 }
      ]
    });
  };

  const handleClearAll = () => {
    setInputs(createEmptyInputs());
  };

  const handleClearSection = (sectionId: string) => {
    setInputs(prev => {
      const updated = { ...prev };
      if (sectionId === 'basic') {
        updated.initialInvestment = '' as any;
        updated.investmentGoal = '' as any;
        updated.investmentPeriodYears = '' as any;
        updated.investmentPeriodMonths = '' as any;
        updated.startDate = todayStr;
      } else if (sectionId === 'returns') {
        updated.annualReturn = '' as any;
        updated.returnType = 'fixed';
        updated.customReturns = [];
      } else if (sectionId === 'compounding') {
        updated.compoundingFrequency = 'monthly';
      } else if (sectionId === 'contributions') {
        updated.monthlyContribution = '' as any;
        updated.weeklyContribution = '' as any;
        updated.biweeklyContribution = '' as any;
        updated.quarterlyContribution = '' as any;
        updated.yearlyContribution = '' as any;
        updated.customContribution = '' as any;
        updated.customContributionIntervalMonths = '' as any;
        updated.contributionStepUpPercent = '' as any;
      } else if (sectionId === 'withdrawals') {
        updated.monthlyWithdrawal = '' as any;
        updated.yearlyWithdrawal = '' as any;
        updated.customWithdrawals = [];
      } else if (sectionId === 'dividends') {
        updated.dividendYield = '' as any;
        updated.dividendGrowth = '' as any;
        updated.reinvestDividends = true;
        updated.dividendTaxRate = '' as any;
      } else if (sectionId === 'taxAndInflation') {
        updated.capitalGainsTaxRate = '' as any;
        updated.annualTaxRate = '' as any;
        updated.exitTaxRate = '' as any;
        updated.inflationRate = '' as any;
      } else if (sectionId === 'fees') {
        updated.brokerFeePercent = '' as any;
        updated.managementFeePercent = '' as any;
        updated.expenseRatio = '' as any;
        updated.transactionFee = '' as any;
        updated.platformFeeMonthly = '' as any;
        updated.performanceFeePercent = '' as any;
      } else if (sectionId === 'risk') {
        updated.volatility = '' as any;
        updated.riskLevel = 'medium';
      } else if (sectionId === 'portfolio') {
        updated.assets = [
          { id: '1', name: 'Global Equities ETF', percentage: '' as any, expectedReturn: '' as any, volatility: '' as any },
          { id: '2', name: 'Government Bonds', percentage: '' as any, expectedReturn: '' as any, volatility: '' as any },
          { id: '3', name: 'Alternative Assets / Cash', percentage: '' as any, expectedReturn: '' as any, volatility: '' as any }
        ];
      }
      return updated;
    });
  };

  // Calculate results on input modifications (only valid when no errors exist)
  const results = useMemo(() => {
    return computeInvestmentProjection(inputs);
  }, [inputs]);

  // Master visual tabs for results panels
  const [resultsTab, setResultsTab] = useState<'dashboard' | 'ledger' | 'comparison'>('dashboard');

  const currencySymbol = inputs.currency || '$';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 font-sans">
      
      {/* 1. APP HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <span className="text-[10px] font-black tracking-widest uppercase text-blue-600 dark:text-cyan-400 bg-blue-500/10 dark:bg-cyan-500/10 px-3 py-1 rounded-full border border-blue-500/10">
          Version 23 • Ultimate Series
        </span>
        <h1 className="text-3xl lg:text-4xl font-black text-neutral-850 dark:text-white tracking-tight leading-none">
          Ultimate Investment & Compound Interest Calculator
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          The world's most advanced client-side wealth compound projection suite. Standardize multi-frequency SIP deposits, dividend reinvestment plans (DRIP), multi-tier taxes, expense drags, inflation vectors, and volatility confidence bands in real-time.
        </p>
      </div>

      {/* 2. THE MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: COLLAPSIBLE INPUT CONTROL SYSTEM (Lg: col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Sliders className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">Control Panel Inputs</h3>
          </div>

          {/* Action buttons as mandated: "Add 'Load Example' and 'Clear All' buttons in a conspicuous location" */}
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

          <UltimateInvestmentInputSections 
            inputs={inputs} 
            setInputs={setInputs} 
            onClearSection={handleClearSection}
          />
        </div>

        {/* RIGHT COLUMN: INTERACTIVE VISUAL DASHBOARD (Lg: col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* HORIZONTAL TAB SWITCHER */}
          <div className="flex items-center justify-between border-b border-neutral-150 dark:border-neutral-800 pb-2">
            <div className="flex gap-1.5">
              <button
                onClick={() => setResultsTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-black rounded-xl transition cursor-pointer select-none ${
                  resultsTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10 dark:bg-cyan-500 dark:text-neutral-950 dark:shadow-cyan-500/10'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-850'
                }`}
              >
                <LayoutGrid className="w-4 h-4" /> Projections Dashboard
              </button>

              <button
                onClick={() => setResultsTab('ledger')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-black rounded-xl transition cursor-pointer select-none ${
                  resultsTab === 'ledger'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10 dark:bg-cyan-500 dark:text-neutral-950 dark:shadow-cyan-500/10'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-850'
                }`}
              >
                <TableProperties className="w-4 h-4" /> Projections Ledger Table
              </button>

              <button
                onClick={() => setResultsTab('comparison')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-black rounded-xl transition cursor-pointer select-none ${
                  resultsTab === 'comparison'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10 dark:bg-cyan-500 dark:text-neutral-950 dark:shadow-cyan-500/10'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-850'
                }`}
              >
                <Scale className="w-4 h-4" /> Scenario Comparer
              </button>
            </div>
          </div>

          {/* TAB CONTENTS CONTAINER */}
          <div className="transition-all">
            {validationErrors.length > 0 ? (
              /* Premium "Waiting for Input" screen as mandated */
              <div className="p-8 border border-blue-500/10 dark:border-cyan-500/10 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent dark:from-cyan-500/5 dark:to-transparent flex flex-col items-center justify-center text-center py-16 space-y-6">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/15 dark:border-cyan-500/15 flex items-center justify-center text-blue-600 dark:text-cyan-400 animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">Waiting for Required Inputs</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    This premium financial projection engine calculates results based strictly on the values you explicitly enter. We never use hidden assumptions or auto-filled defaults.
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-neutral-900/60 border border-neutral-150 dark:border-neutral-800/80 rounded-xl p-4 w-full max-w-sm text-left space-y-2">
                  <span className="text-[10px] font-bold text-neutral-450 uppercase">Required Fields Remaining:</span>
                  <ul className="space-y-1">
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
              <>
                {resultsTab === 'dashboard' && (
                  <UltimateInvestmentResults 
                    results={results} 
                    inputs={inputs} 
                  />
                )}

                {resultsTab === 'ledger' && (
                  <UltimateInvestmentLedgerTable 
                    results={results} 
                    inputs={inputs} 
                  />
                )}

                {resultsTab === 'comparison' && (
                  <UltimateInvestmentComparison 
                    currentInputs={inputs} 
                    currentResults={results} 
                  />
                )}
              </>
            )}
          </div>

        </div>

      </div>

      {/* 3. SEO AND EDUCATIONAL ARTICLES FOOTER */}
      <UltimateInvestmentSeoContent />

    </div>
  );
}
