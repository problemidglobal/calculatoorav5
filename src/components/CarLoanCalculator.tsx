import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Trash2, 
  AlertTriangle,
  FileText, 
  TrendingUp, 
  Coins, 
  ChevronRight,
  HelpCircle,
  HelpCircle as QuestionIcon,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CarLoanInputs, computeCarLoan, CarLoanResults } from '../utils/carLoanMath';
import CarLoanInputSections from './CarLoanInputSections';
import CarLoanResultsPanel from './CarLoanResults';
import CarLoanAmortizationTable from './CarLoanAmortizationTable';
import CarLoanSeoContent from './CarLoanSeoContent';

export default function CarLoanCalculator() {
  // YYYY-MM-DD helper
  const todayStr = useMemo(() => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }, []);

  // Empty initial inputs as mandated: "Every numeric field must be completely empty when the page loads"
  const createEmptyInputs = (): CarLoanInputs => ({
    carPrice: '',
    interestRate: '',
    loanTerm: '',
    termUnit: 'months',
    startDate: todayStr,
    vehicleType: 'Gasoline',
    
    downPayment: '',
    downPaymentPercent: '',
    downPaymentType: 'amount',

    tradeInValue: '',
    tradeInBalance: '',

    dealerRebate: '',
    manufacturerIncentive: '',
    cashDiscount: '',

    salesTaxRate: '',
    salesTaxType: 'percent',
    salesTaxAmount: '',

    registrationFee: '',
    registrationFeeType: 'amount',
    titleFee: '',
    titleFeeType: 'amount',
    documentationFee: '',
    documentationFeeType: 'amount',
    dealerFee: '',
    dealerFeeType: 'amount',
    destinationCharge: '',
    destinationChargeType: 'amount',
    governmentFee: '',
    governmentFeeType: 'amount',
    inspectionFee: '',
    inspectionFeeType: 'amount',
    licenseFee: '',
    licenseFeeType: 'amount',
    customFee: '',
    customFeeType: 'amount',

    financeFeesAndTaxes: true,

    extendedWarranty: '',
    gapInsurance: '',
    roadsideAssistance: '',
    servicePackage: '',
    processingFee: '',
    originationFee: '',
    balloonPayment: '',

    extraMonthly: '',
    extraOneTime: '',
    extraOneTimeMonth: '',
    annualExtra: '',
    extraPaymentsList: [],

    annualIncome: '',
    existingDebts: '',

    interestType: 'fixed',
    customRateSchedule: [],

    inflationRate: '',
  });

  const [inputs, setInputs] = useState<CarLoanInputs>(() => createEmptyInputs());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'education'>('dashboard');

  // Input Validation Rules
  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    const carPriceNum = Number(inputs.carPrice);
    const interestRateNum = Number(inputs.interestRate);
    const termValueNum = Number(inputs.loanTerm);

    if (inputs.carPrice === '') {
      // Do not throw error yet, wait for user input
    } else if (carPriceNum <= 0) {
      errors.push("Vehicle Purchase Price must be greater than zero.");
    }

    if (inputs.interestRate === '') {
      // Do not throw error
    } else {
      if (interestRateNum < -100 || interestRateNum > 100) {
        errors.push("Interest Rate APR must be between -100% and 100%.");
      }
    }

    if (inputs.loanTerm === '') {
      // Do not throw error
    } else if (termValueNum <= 0) {
      errors.push("Loan Term must be greater than zero.");
    }

    const dp = Number(inputs.downPayment) || 0;
    if (dp > carPriceNum && carPriceNum > 0) {
      errors.push("Down Payment cannot exceed the Vehicle Purchase Price.");
    }

    const tradeInVal = Number(inputs.tradeInValue) || 0;
    if (tradeInVal < 0) {
      errors.push("Trade-in Value cannot be negative.");
    }

    const tradeInBal = Number(inputs.tradeInBalance) || 0;
    if (tradeInBal < 0) {
      errors.push("Trade-in Loan Balance cannot be negative.");
    }

    const extraM = Number(inputs.extraMonthly) || 0;
    if (extraM < 0) {
      errors.push("Recurring extra monthly payment cannot be negative.");
    }

    return errors;
  }, [inputs]);

  // Dynamic calculations via useMemo
  const results = useMemo<CarLoanResults | null>(() => {
    if (validationErrors.length > 0) return null;
    return computeCarLoan(inputs);
  }, [inputs, validationErrors]);

  // Loading demo datasets
  const loadDemoInputs = () => {
    setInputs({
      carPrice: 38000,
      interestRate: 6.49,
      loanTerm: 60,
      termUnit: 'months',
      startDate: todayStr,
      vehicleType: 'Gasoline',
      
      downPayment: 6000,
      downPaymentPercent: 15.79,
      downPaymentType: 'amount',

      tradeInValue: 9500,
      tradeInBalance: 3500, // $6,000 net trade credit!

      dealerRebate: 1000,
      manufacturerIncentive: 500,
      cashDiscount: 300,

      salesTaxRate: 6.25,
      salesTaxType: 'percent',
      salesTaxAmount: '',

      registrationFee: 150,
      registrationFeeType: 'amount',
      titleFee: 95,
      titleFeeType: 'amount',
      documentationFee: 199,
      documentationFeeType: 'amount',
      dealerFee: 150,
      dealerFeeType: 'amount',
      destinationCharge: 850,
      destinationChargeType: 'amount',
      governmentFee: 45,
      governmentFeeType: 'amount',
      inspectionFee: '',
      inspectionFeeType: 'amount',
      licenseFee: '',
      licenseFeeType: 'amount',
      customFee: '',
      customFeeType: 'amount',

      financeFeesAndTaxes: true,

      extendedWarranty: 1800,
      gapInsurance: 595,
      roadsideAssistance: '',
      servicePackage: 1200,
      processingFee: '',
      originationFee: '',
      balloonPayment: '',

      extraMonthly: 100,
      extraOneTime: '',
      extraOneTimeMonth: '',
      annualExtra: '',
      extraPaymentsList: [
        { id: 'tax-rf', type: 'onetime', month: 12, amount: 2000, description: 'Tax Refund Prepayment' }
      ],

      annualIncome: 85000,
      existingDebts: 1600,

      interestType: 'fixed',
      customRateSchedule: [],

      inflationRate: 2.4,
    });
  };

  const handleClearAll = () => {
    setInputs(createEmptyInputs());
    setActiveTab('dashboard');
  };

  // Check if required entries exist
  const hasRequiredFields = inputs.carPrice !== '' && inputs.interestRate !== '' && inputs.loanTerm !== '';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title / Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-6">
        <div>
          <nav className="flex items-center gap-1 text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
            <span>Premium Series</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-500 dark:text-blue-400 font-black">Car Loan Calculator</span>
          </nav>
          <h1 id="calculator-main-title" className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2 select-none">
            Car Loan Calculator
          </h1>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-2xl mt-1">
            Rebuild-compliant premium auto financing machine. Analyzes trades, down payments, local taxes, multiple dealer fees, extra amortizations, and real APR indices offline.
          </p>
        </div>
      </div>

      {/* Validation Banner */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/15 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-400 font-bold animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span>The calculator requires valid coordinates before compiling results:</span>
            <ul className="list-disc pl-4 space-y-0.5 font-semibold">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Two-Column Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Input Controller */}
        <section className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-neutral-400" />
              Adjust Inputs
            </h3>
          </div>
          <CarLoanInputSections
            inputs={inputs}
            setInputs={setInputs}
            onClear={handleClearAll}
            onLoadDemo={loadDemoInputs}
          />
        </section>

        {/* Right Column: Live Results Workstation */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
            {/* Tab navigation */}
            <div className="flex gap-2">
              <button
                id="tab-overview"
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 text-xs font-black rounded-xl transition ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Overview
              </button>
              <button
                id="tab-amortization"
                onClick={() => {
                  if (hasRequiredFields) {
                    setActiveTab('schedule');
                  }
                }}
                disabled={!hasRequiredFields || validationErrors.length > 0}
                className={`px-4 py-2 text-xs font-black rounded-xl transition disabled:opacity-40 disabled:pointer-events-none ${
                  activeTab === 'schedule' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Amortization Schedule
              </button>
              <button
                id="tab-education"
                onClick={() => setActiveTab('education')}
                className={`px-4 py-2 text-xs font-black rounded-xl transition ${
                  activeTab === 'education' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Education Guide & FAQ
              </button>
            </div>
          </div>

          {/* Tab Panes */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <CarLoanResultsPanel results={results} inputs={inputs} />
                </motion.div>
              )}

              {activeTab === 'schedule' && results && (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <CarLoanAmortizationTable schedule={results.schedule} inputs={inputs} />
                </motion.div>
              )}

              {activeTab === 'education' && (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <CarLoanSeoContent />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </div>

      {/* SEO content always visible on screen bottom for maximum crawlers search accessibility */}
      {activeTab !== 'education' && (
        <section className="pt-8 border-t border-neutral-100 dark:border-neutral-800">
          <CarLoanSeoContent />
        </section>
      )}
    </div>
  );
}
