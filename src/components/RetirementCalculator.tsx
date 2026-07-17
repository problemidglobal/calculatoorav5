import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  LayoutGrid, 
  TableProperties, 
  Scale, 
  Sparkles, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';
import { RetirementInputs, computeRetirementProjection } from '../utils/retirementMath';
import RetirementInputSections from './RetirementInputSections';
import RetirementResults from './RetirementResults';
import RetirementLedgerTable from './RetirementLedgerTable';
import RetirementComparison from './RetirementComparison';
import RetirementSeoContent from './RetirementSeoContent';

export default function RetirementCalculator() {
  
  // Creates standard empty fields to conform with the strict "fields start empty" rule
  const createEmptyInputs = (): RetirementInputs => ({
    currentAge: '' as any,
    retirementAge: '' as any,
    lifeExpectancy: '' as any,
    currentSavings: '' as any,
    monthlyContribution: '' as any,
    annualContribution: '' as any,
    contributionStepUp: '' as any,
    contributionFrequency: 'monthly',
    salary: '' as any,
    salaryGrowth: '' as any,
    employerContribution: '' as any,
    employerContributionType: 'percent',
    preRetireReturn: '' as any,
    postRetireReturn: '' as any,
    targetIncome: '' as any,
    targetIncomeType: 'annual',
    inflationRate: '' as any,
    socialSecurity: '' as any,
    ssStartAge: '' as any,
    taxRate: '' as any,
    swrPercent: '' as any,
    withdrawalStrategy: 'fixed',
    volatility: '' as any,
    currency: '$',
    monteCarloCount: 500,
    pensionIncome: '' as any,
    pensionType: 'monthly',
    rentalIncome: '' as any,
    businessIncome: '' as any,
    investmentIncome: '' as any,
    customRecurringIncome: '' as any,
    inheritance: '' as any,
    inheritanceAge: '' as any,
    healthcareCost: '' as any,
    healthcareCostType: 'monthly',
    healthcareInflation: '' as any,
    events: [],
    phasesEnabled: false,
    phases: [
      { id: 'working', name: 'Working Years', startAge: '' as any, endAge: '' as any, returnRate: '' as any, inflation: '' as any, contribution: '' as any, withdrawal: '' as any, expenses: '' as any },
      { id: 'early', name: 'Early Retirement', startAge: '' as any, endAge: '' as any, returnRate: '' as any, inflation: '' as any, contribution: '' as any, withdrawal: '' as any, expenses: '' as any },
      { id: 'full', name: 'Full Retirement', startAge: '' as any, endAge: '' as any, returnRate: '' as any, inflation: '' as any, contribution: '' as any, withdrawal: '' as any, expenses: '' as any },
      { id: 'late', name: 'Late Retirement', startAge: '' as any, endAge: '' as any, returnRate: '' as any, inflation: '' as any, contribution: '' as any, withdrawal: '' as any, expenses: '' as any }
    ],
    goalPlanner: {
      targetSavings: '' as any,
      targetAge: '' as any,
      targetIncome: '' as any,
      targetIncomeType: 'annual'
    }
  });

  const [inputs, setInputs] = useState<RetirementInputs>(() => createEmptyInputs());
  const [resultsTab, setResultsTab] = useState<'dashboard' | 'ledger' | 'comparison'>('dashboard');

  // Reactively track validation errors to toggle the "Waiting for Input" landing card
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    
    if (inputs.currentAge === undefined || inputs.currentAge === '' || isNaN(Number(inputs.currentAge))) {
      errors.push("Please enter your Current Age.");
    } else {
      const age = Number(inputs.currentAge);
      if (age < 0 || age > 110) {
        errors.push("Current Age must be between 0 and 110.");
      }
    }

    if (inputs.retirementAge === undefined || inputs.retirementAge === '' || isNaN(Number(inputs.retirementAge))) {
      errors.push("Please enter your Target Retirement Age.");
    } else {
      const retAge = Number(inputs.retirementAge);
      const currAge = Number(inputs.currentAge) || 0;
      if (retAge <= currAge) {
        errors.push("Retirement Age must be greater than your Current Age.");
      }
    }

    if (inputs.lifeExpectancy === undefined || inputs.lifeExpectancy === '' || isNaN(Number(inputs.lifeExpectancy))) {
      errors.push("Please enter your Life Expectancy.");
    } else {
      const expAge = Number(inputs.lifeExpectancy);
      const retAge = Number(inputs.retirementAge) || 0;
      if (expAge <= retAge) {
        errors.push("Life Expectancy must be greater than your Retirement Age.");
      }
    }

    if (inputs.preRetireReturn === undefined || inputs.preRetireReturn === '' || isNaN(Number(inputs.preRetireReturn))) {
      errors.push("Please enter Pre-Retirement return yield.");
    }

    if (inputs.postRetireReturn === undefined || inputs.postRetireReturn === '' || isNaN(Number(inputs.postRetireReturn))) {
      errors.push("Please enter Post-Retirement return yield.");
    }

    if (inputs.targetIncome === undefined || inputs.targetIncome === '' || isNaN(Number(inputs.targetIncome))) {
      errors.push("Please enter your Target Spending.");
    }

    if (inputs.inflationRate === undefined || inputs.inflationRate === '' || isNaN(Number(inputs.inflationRate))) {
      errors.push("Please enter Inflation Rate.");
    }

    if (inputs.volatility === undefined || inputs.volatility === '' || isNaN(Number(inputs.volatility))) {
      errors.push("Please enter portfolio Risk Volatility.");
    }

    return errors;
  }, [inputs]);

  // Load a highly professional premium sample set
  const loadDemoInputs = () => {
    setInputs({
      currentAge: 30,
      retirementAge: 65,
      lifeExpectancy: 85,
      currentSavings: 50000,
      monthlyContribution: 500,
      annualContribution: 6000,
      contributionStepUp: 3.0,
      contributionFrequency: 'monthly',
      salary: 75000,
      salaryGrowth: 3.0,
      employerContribution: 3.0,
      employerContributionType: 'percent',
      preRetireReturn: 8.0,
      postRetireReturn: 5.0,
      targetIncome: 60000,
      targetIncomeType: 'annual',
      inflationRate: 2.5,
      socialSecurity: 1600,
      ssStartAge: 67,
      taxRate: 12.0,
      swrPercent: 4.0,
      withdrawalStrategy: 'fixed',
      volatility: 12.0,
      currency: '$',
      monteCarloCount: 500,
      pensionIncome: 500,
      pensionType: 'monthly',
      rentalIncome: 0,
      businessIncome: 0,
      investmentIncome: 0,
      customRecurringIncome: 0,
      inheritance: 0,
      inheritanceAge: 50,
      healthcareCost: 300,
      healthcareCostType: 'monthly',
      healthcareInflation: 5.0,
      events: [
        {
          id: 'ev-1',
          age: 45,
          description: 'Sabbatical Study Break',
          contribution: '' as any,
          withdrawal: 15000,
          income: '' as any,
          expense: '' as any,
          isCollapsed: true
        }
      ],
      phasesEnabled: false,
      phases: [
        { id: 'working', name: 'Working Years', startAge: 30, endAge: 65, returnRate: 8.0, inflation: 2.5, contribution: 500, withdrawal: 0, expenses: 40000 },
        { id: 'early', name: 'Early Retirement', startAge: 65, endAge: 70, returnRate: 6.0, inflation: 2.5, contribution: 0, withdrawal: 5000, expenses: 50000 },
        { id: 'full', name: 'Full Retirement', startAge: 70, endAge: 80, returnRate: 5.0, inflation: 2.5, contribution: 0, withdrawal: 5000, expenses: 60000 },
        { id: 'late', name: 'Late Retirement', startAge: 80, endAge: 85, returnRate: 4.0, inflation: 2.5, contribution: 0, withdrawal: 5000, expenses: 70000 }
      ],
      goalPlanner: {
        targetSavings: 1500000,
        targetAge: 60,
        targetIncome: 80000,
        targetIncomeType: 'annual'
      }
    });
  };

  const handleClearAll = () => {
    setInputs(createEmptyInputs());
  };

  const handleClearSection = (sectionId: string) => {
    setInputs(prev => {
      const updated = { ...prev };
      if (sectionId === 'accumulation') {
        updated.currentAge = '' as any;
        updated.retirementAge = '' as any;
        updated.lifeExpectancy = '' as any;
        updated.currentSavings = '' as any;
        updated.monthlyContribution = '' as any;
        updated.annualContribution = '' as any;
        updated.contributionStepUp = '' as any;
        updated.salary = '' as any;
        updated.salaryGrowth = '' as any;
        updated.employerContribution = '' as any;
      } else if (sectionId === 'returns') {
        updated.preRetireReturn = '' as any;
        updated.postRetireReturn = '' as any;
        updated.volatility = '' as any;
        updated.monteCarloCount = 500;
      } else if (sectionId === 'spending') {
        updated.targetIncome = '' as any;
        updated.inflationRate = '' as any;
        updated.taxRate = '' as any;
        updated.swrPercent = '' as any;
        updated.withdrawalStrategy = 'fixed';
        updated.healthcareCost = '' as any;
        updated.healthcareInflation = '' as any;
      } else if (sectionId === 'income') {
        updated.socialSecurity = '' as any;
        updated.ssStartAge = '' as any;
        updated.pensionIncome = '' as any;
        updated.rentalIncome = '' as any;
        updated.businessIncome = '' as any;
        updated.investmentIncome = '' as any;
        updated.customRecurringIncome = '' as any;
        updated.inheritance = '' as any;
        updated.inheritanceAge = '' as any;
      }
      return updated;
    });
  };

  // Reactively calculate outputs when inputs are valid
  const calculatedResults = useMemo(() => {
    if (validationErrors.length > 0) return null;
    return computeRetirementProjection(inputs);
  }, [inputs, validationErrors]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 font-sans">
      
      {/* 1. APP HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <span className="text-[10px] font-black tracking-widest uppercase text-blue-600 dark:text-cyan-400 bg-blue-500/10 dark:bg-cyan-500/10 px-3 py-1 rounded-full border border-blue-500/10">
          Version 23 • Ultimate Series
        </span>
        <h1 className="text-3xl lg:text-4xl font-black text-neutral-850 dark:text-white tracking-tight leading-none">
          Ultimate Retirement Calculator
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          The world's most advanced client-side retirement readiness and longevity survival suite. Run real-time stochastic Monte Carlo simulations, customize step-up savings triggers, offset guaranteed Social Security/pensions, and analyze what-if scenarios side-by-side.
        </p>
      </div>

      {/* 2. MAIN COLS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTROL INPUTS (Lg: col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Sliders className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">Control Panel Inputs</h3>
          </div>

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

          <RetirementInputSections 
            inputs={inputs} 
            setInputs={setInputs} 
            onClearSection={handleClearSection}
          />
        </div>

        {/* RIGHT COLUMN: INTERACTIVE VISUAL DASHBOARD (Lg: col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* HORIZONTAL TAB SWITCHER */}
          <div className="flex items-center justify-between border-b border-neutral-150 dark:border-neutral-800 pb-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setResultsTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-black rounded-xl transition shrink-0 cursor-pointer select-none ${
                  resultsTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10 dark:bg-cyan-500 dark:text-neutral-950 dark:shadow-cyan-500/10'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-850'
                }`}
              >
                <LayoutGrid className="w-4 h-4" /> Readiness Dashboard
              </button>

              <button
                onClick={() => setResultsTab('ledger')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-black rounded-xl transition shrink-0 cursor-pointer select-none ${
                  resultsTab === 'ledger'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10 dark:bg-cyan-500 dark:text-neutral-950 dark:shadow-cyan-500/10'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-850'
                }`}
              >
                <TableProperties className="w-4 h-4" /> Lifetime Ledger Schedule
              </button>

              <button
                onClick={() => setResultsTab('comparison')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-black rounded-xl transition shrink-0 cursor-pointer select-none ${
                  resultsTab === 'comparison'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10 dark:bg-cyan-500 dark:text-neutral-950 dark:shadow-cyan-500/10'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-850'
                }`}
              >
                <Scale className="w-4 h-4" /> Scenario Builder
              </button>
            </div>
          </div>

          {/* RENDERING CONTAINER */}
          <div>
            {validationErrors.length > 0 || !calculatedResults ? (
              /* PREMIUM "WAITING FOR USER INPUT" PLACEHOLDER PANEL */
              <div className="p-8 border border-blue-500/10 dark:border-cyan-500/10 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent dark:from-cyan-500/5 dark:to-transparent flex flex-col items-center justify-center text-center py-16 space-y-6">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/15 dark:border-cyan-500/15 flex items-center justify-center text-blue-600 dark:text-cyan-400 animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">Waiting for Required Inputs</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    This premium retirement projection engine calculates outcomes based strictly on values you explicitly enter. We never assume pre-filled defaults to ensure absolute calculation integrity.
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
                  <RetirementResults 
                    results={calculatedResults} 
                    inputs={inputs} 
                    setInputs={setInputs}
                  />
                )}

                {resultsTab === 'ledger' && (
                  <RetirementLedgerTable 
                    timeline={calculatedResults.deterministicTimeline} 
                    inputs={inputs} 
                  />
                )}

                {resultsTab === 'comparison' && (
                  <RetirementComparison 
                    currentInputs={inputs} 
                  />
                )}
              </>
            )}
          </div>

        </div>

      </div>

      {/* 3. SEO AND MASTERCLASS FOOTER */}
      <RetirementSeoContent />

    </div>
  );
}
