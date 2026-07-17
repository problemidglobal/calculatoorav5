import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  HelpCircle, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Calendar, 
  ShieldAlert, 
  BookOpen, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  BadgePercent, 
  Coins, 
  FileText, 
  ShieldCheck, 
  Compass, 
  HeartHandshake,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CarPaymentInputs, CalculationResults } from './types';
import { calculateCarPayment, parseNum } from './helpers';
import Visualizations from './Visualizations';
import SeoContent from './SeoContent';

export default function CarPaymentCalculator() {
  // 1. Core Config States
  const [inputs, setInputs] = useState<CarPaymentInputs>({
    mode: 'standard',
    currency: '$',
    vehiclePrice: '',
    downPayment: '',
    interestRate: '',
    loanTerm: '',
    tradeInValue: '',
    tradeInBalance: '',
    leasePayment: '',
    leaseTerm: '',
    residualValue: '',
    salesTax: '',
    registrationFee: '',
    titleFee: '',
    docFee: '',
    dealerFee: '',
    extendedWarranty: '',
    gapInsurance: '',
    manufacturerRebate: '',
    cashIncentive: '',
    optionalInsurance: '',
    maintenanceEstimate: '',
    negativeEquity: '',
    oneTimeExtra: '',
    oneTimeExtraMonth: '',
    monthlyExtra: '',
    annualExtra: '',
    insurancePerMonth: '',
    fuelPerMonth: '',
    maintenancePerMonth: '',
    parkingPerMonth: '',
    monthlyIncome: '',
    monthlyDebt: '',
    targetBudget: ''
  });

  // Expandable sections
  const [showOptionalInputs, setShowOptionalInputs] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);
  const [amortizationView, setAmortizationView] = useState<'monthly' | 'yearly'>('yearly');

  // Load Example Financing Scenario
  const handleLoadExample = () => {
    if (inputs.mode === 'standard') {
      setInputs({
        ...inputs,
        vehiclePrice: '38000',
        downPayment: '6000',
        interestRate: '5.99',
        loanTerm: '60',
        // Clear others
        tradeInValue: '',
        tradeInBalance: '',
        leasePayment: '',
        leaseTerm: '',
        residualValue: '',
        salesTax: '6.5',
        registrationFee: '250',
        titleFee: '95',
        docFee: '150',
        dealerFee: '399',
        extendedWarranty: '1500',
        gapInsurance: '500',
        manufacturerRebate: '1000',
        cashIncentive: '500',
        oneTimeExtra: '1000',
        oneTimeExtraMonth: '12',
        monthlyExtra: '150',
        annualExtra: '500',
        insurancePerMonth: '130',
        fuelPerMonth: '110',
        maintenancePerMonth: '45',
        parkingPerMonth: '20',
        monthlyIncome: '6500',
        monthlyDebt: '1200',
        targetBudget: '650'
      });
    } else if (inputs.mode === 'trade-in') {
      setInputs({
        ...inputs,
        vehiclePrice: '42000',
        tradeInValue: '12000',
        tradeInBalance: '2000', // negative equity scenario
        downPayment: '4000',
        interestRate: '6.49',
        loanTerm: '72',
        leasePayment: '',
        leaseTerm: '',
        residualValue: '',
        salesTax: '7.0',
        registrationFee: '300',
        titleFee: '120',
        docFee: '200',
        dealerFee: '450',
        extendedWarranty: '1800',
        gapInsurance: '600',
        manufacturerRebate: '1500',
        cashIncentive: '0',
        oneTimeExtra: '2000',
        oneTimeExtraMonth: '6',
        monthlyExtra: '100',
        annualExtra: '0',
        insurancePerMonth: '145',
        fuelPerMonth: '120',
        maintenancePerMonth: '50',
        parkingPerMonth: '0',
        monthlyIncome: '7500',
        monthlyDebt: '1500',
        targetBudget: '700'
      });
    } else {
      // Lease vs Buy comparison
      setInputs({
        ...inputs,
        vehiclePrice: '35000',
        downPayment: '5000',
        interestRate: '5.49',
        loanTerm: '36',
        leasePayment: '399',
        leaseTerm: '36',
        residualValue: '19500',
        tradeInValue: '',
        tradeInBalance: '',
        salesTax: '6.0',
        registrationFee: '220',
        titleFee: '85',
        docFee: '150',
        dealerFee: '350',
        extendedWarranty: '',
        gapInsurance: '',
        manufacturerRebate: '1000',
        cashIncentive: '0',
        oneTimeExtra: '',
        oneTimeExtraMonth: '',
        monthlyExtra: '',
        annualExtra: '',
        insurancePerMonth: '120',
        fuelPerMonth: '100',
        maintenancePerMonth: '40',
        parkingPerMonth: '0',
        monthlyIncome: '6000',
        monthlyDebt: '1100',
        targetBudget: '600'
      });
    }
  };

  // Reset/Clear All
  const handleClearAll = () => {
    setInputs({
      mode: inputs.mode,
      currency: inputs.currency,
      vehiclePrice: '',
      downPayment: '',
      interestRate: '',
      loanTerm: '',
      tradeInValue: '',
      tradeInBalance: '',
      leasePayment: '',
      leaseTerm: '',
      residualValue: '',
      salesTax: '',
      registrationFee: '',
      titleFee: '',
      docFee: '',
      dealerFee: '',
      extendedWarranty: '',
      gapInsurance: '',
      manufacturerRebate: '',
      cashIncentive: '',
      optionalInsurance: '',
      maintenanceEstimate: '',
      negativeEquity: '',
      oneTimeExtra: '',
      oneTimeExtraMonth: '',
      monthlyExtra: '',
      annualExtra: '',
      insurancePerMonth: '',
      fuelPerMonth: '',
      maintenancePerMonth: '',
      parkingPerMonth: '',
      monthlyIncome: '',
      monthlyDebt: '',
      targetBudget: ''
    });
    setShowOptionalInputs(false);
    setShowAmortization(false);
  };

  // Run computation logic
  const results: CalculationResults = calculateCarPayment(inputs);

  // Validation alerts
  const showValidationWarning = () => {
    const price = parseNum(inputs.vehiclePrice);
    const term = parseNum(inputs.loanTerm);
    const rate = parseNum(inputs.interestRate);
    const tradeIn = parseNum(inputs.tradeInValue);

    if (price < 0 || term < 0 || rate < 0) {
      return "Critical: Inputs cannot contain negative financial figures.";
    }
    if (inputs.mode === 'trade-in' && tradeIn > price && price > 0) {
      return "Notice: Your Trade-in value is greater than the vehicle price. Please verify to ensure accuracy.";
    }
    return null;
  };

  const validationWarning = showValidationWarning();

  // Handle inline slider values update
  const handleSliderChange = (key: keyof CarPaymentInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Dynamic Rule-Based Smart Insights
  const getSmartInsights = () => {
    const list: string[] = [];
    const price = parseNum(inputs.vehiclePrice);
    const down = parseNum(inputs.downPayment);
    const rate = parseNum(inputs.interestRate);
    const term = parseNum(inputs.loanTerm);

    if (price > 0) {
      // Down payment 20% recommend
      const twentyPercent = price * 0.2;
      if (down < twentyPercent) {
        const needed = twentyPercent - down;
        list.push(`Increasing your down payment by ${inputs.currency}${needed.toLocaleString(undefined, { maximumFractionDigits: 0 })} to hit a 20% down payment marker reduces loan exposure and safeguards you against early vehicle depreciation.`);
      }

      // Shorter term recommendation
      if (term > 60) {
        list.push(`Your loan term is set to ${term} months. Selecting a shorter 48-month or 60-month term increases monthly obligations but saves substantial interest over the loan life.`);
      }

      // Extra payment simulation
      if (parseNum(inputs.monthlyExtra) === 0 && parseNum(inputs.oneTimeExtra) === 0) {
        list.push(`Adding a modest extra payment of even ${inputs.currency}50 per month triggers compound interest reductions, shaving months off your term.`);
      }
    } else {
      list.push("Fill in the vehicle price and term details to generate professional localized finance recommendations.");
    }

    return list;
  };

  const insights = getSmartInsights();

  // Quick navigation handler
  const handleNavigate = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Dynamic Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-widest rounded-full border border-blue-500/20">
          <Car className="w-3.5 h-3.5" />
          Professional Car Estimator
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Car Payment <span className="text-blue-600 dark:text-cyan-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.2)]">Calculator</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
          Estimate realistic auto loan payments, factor in negative equity trade-ins, contrast leasing versus buying, and plan accelerated payoff timelines with absolute mathematical accuracy.
        </p>
      </div>

      {/* Control Actions & Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm print:hidden">
        
        {/* Core Mode Selectors */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setInputs(prev => ({ ...prev, mode: 'standard' }))}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${inputs.mode === 'standard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
          >
            Standard Loan
          </button>
          <button
            onClick={() => setInputs(prev => ({ ...prev, mode: 'trade-in' }))}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${inputs.mode === 'trade-in' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
          >
            Trade-In Financing
          </button>
          <button
            onClick={() => setInputs(prev => ({ ...prev, mode: 'lease-buy' }))}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${inputs.mode === 'lease-buy' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
          >
            Lease vs Buy
          </button>
        </div>

        {/* Currency and Actions */}
        <div className="flex items-center gap-3">
          <select
            value={inputs.currency}
            onChange={(e) => setInputs(prev => ({ ...prev, currency: e.target.value }))}
            className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-none rounded-xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="₹">INR (₹)</option>
            <option value="¥">JPY (¥)</option>
            <option value="C$">CAD (C$)</option>
            <option value="A$">AUD (A$)</option>
          </select>

          <button
            onClick={handleLoadExample}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 hover:bg-blue-500/20 rounded-xl transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Example
          </button>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-500 dark:text-neutral-400 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Validation Warning Notice */}
      {validationWarning && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{validationWarning}</span>
        </div>
      )}

      {/* Main Grid: Inputs Panel on Left / Key Metrics & Analytics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT CONTAINER: Standard & Mode Specific Numeric Inputs */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-blue-500" />
              Configure Financing
            </h3>

            {/* Standard Mode Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                  Vehicle Base Price ({inputs.currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">{inputs.currency}</span>
                  <input
                    type="number"
                    value={inputs.vehiclePrice}
                    onChange={(e) => handleSliderChange('vehiclePrice', e.target.value)}
                    placeholder="e.g. 35000"
                    className="w-full pl-9 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              {inputs.mode === 'trade-in' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                      Trade-In Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">{inputs.currency}</span>
                      <input
                        type="number"
                        value={inputs.tradeInValue}
                        onChange={(e) => handleSliderChange('tradeInValue', e.target.value)}
                        placeholder="e.g. 8000"
                        className="w-full pl-9 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                      Trade-In Balance <span className="text-[10px] text-neutral-400 lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">{inputs.currency}</span>
                      <input
                        type="number"
                        value={inputs.tradeInBalance}
                        onChange={(e) => handleSliderChange('tradeInBalance', e.target.value)}
                        placeholder="e.g. 2000"
                        className="w-full pl-9 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {inputs.mode === 'lease-buy' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                      Lease Monthly Payment
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">{inputs.currency}</span>
                      <input
                        type="number"
                        value={inputs.leasePayment}
                        onChange={(e) => handleSliderChange('leasePayment', e.target.value)}
                        placeholder="e.g. 399"
                        className="w-full pl-9 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                      Lease Term (Months)
                    </label>
                    <input
                      type="number"
                      value={inputs.leaseTerm}
                      onChange={(e) => handleSliderChange('leaseTerm', e.target.value)}
                      placeholder="e.g. 36"
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                    Down Payment ({inputs.currency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">{inputs.currency}</span>
                    <input
                      type="number"
                      value={inputs.downPayment}
                      onChange={(e) => handleSliderChange('downPayment', e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full pl-9 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                    Interest Rate (% APR)
                  </label>
                  <div className="relative">
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">%</span>
                    <input
                      type="number"
                      step="0.01"
                      value={inputs.interestRate}
                      onChange={(e) => handleSliderChange('interestRate', e.target.value)}
                      placeholder="e.g. 6.49"
                      className="w-full pl-4 pr-8 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                    Loan Term (Months)
                  </label>
                  <input
                    type="number"
                    value={inputs.loanTerm}
                    onChange={(e) => handleSliderChange('loanTerm', e.target.value)}
                    placeholder="e.g. 60"
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                  />
                </div>

                {inputs.mode === 'lease-buy' && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                      Residual Value <span className="text-[10px] text-neutral-400 lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">{inputs.currency}</span>
                      <input
                        type="number"
                        value={inputs.residualValue}
                        onChange={(e) => handleSliderChange('residualValue', e.target.value)}
                        placeholder="e.g. 19500"
                        className="w-full pl-9 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Collapsible Section for Taxes, Fees and Optional Add-ons */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
              <button
                onClick={() => setShowOptionalInputs(!showOptionalInputs)}
                className="w-full flex justify-between items-center py-2 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition"
              >
                <span className="flex items-center gap-1.5">
                  <BadgePercent className="w-4 h-4 text-blue-500" />
                  Optional Taxes, Fees & Add-ons
                </span>
                {showOptionalInputs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {showOptionalInputs && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-4 pt-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                          Sales Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          value={inputs.salesTax}
                          onChange={(e) => handleSliderChange('salesTax', e.target.value)}
                          placeholder="e.g. 7"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                          Registration Fee ({inputs.currency})
                        </label>
                        <input
                          type="number"
                          value={inputs.registrationFee}
                          onChange={(e) => handleSliderChange('registrationFee', e.target.value)}
                          placeholder="e.g. 300"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                          Title Fee
                        </label>
                        <input
                          type="number"
                          value={inputs.titleFee}
                          onChange={(e) => handleSliderChange('titleFee', e.target.value)}
                          placeholder="e.g. 95"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                          Doc Fee
                        </label>
                        <input
                          type="number"
                          value={inputs.docFee}
                          onChange={(e) => handleSliderChange('docFee', e.target.value)}
                          placeholder="e.g. 150"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                          Dealer Fee
                        </label>
                        <input
                          type="number"
                          value={inputs.dealerFee}
                          onChange={(e) => handleSliderChange('dealerFee', e.target.value)}
                          placeholder="e.g. 499"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                          Extended Warranty
                        </label>
                        <input
                          type="number"
                          value={inputs.extendedWarranty}
                          onChange={(e) => handleSliderChange('extendedWarranty', e.target.value)}
                          placeholder="e.g. 1500"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                          Gap Insurance
                        </label>
                        <input
                          type="number"
                          value={inputs.gapInsurance}
                          onChange={(e) => handleSliderChange('gapInsurance', e.target.value)}
                          placeholder="e.g. 500"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                          Manufacturer Rebate
                        </label>
                        <input
                          type="number"
                          value={inputs.manufacturerRebate}
                          onChange={(e) => handleSliderChange('manufacturerRebate', e.target.value)}
                          placeholder="e.g. 1500"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                          Cash Incentive
                        </label>
                        <input
                          type="number"
                          value={inputs.cashIncentive}
                          onChange={(e) => handleSliderChange('cashIncentive', e.target.value)}
                          placeholder="e.g. 500"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Sliders (What-If analysis) */}
          <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 space-y-5">
            <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              What-If Visual Modifiers
            </h4>

            {/* Vehicle Price Slider */}
            {parseNum(inputs.vehiclePrice) > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Vehicle Price</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{inputs.currency}{parseNum(inputs.vehiclePrice).toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={Math.max(5000, parseNum(inputs.vehiclePrice) * 0.5)}
                  max={parseNum(inputs.vehiclePrice) * 1.5}
                  step="500"
                  value={inputs.vehiclePrice}
                  onChange={(e) => handleSliderChange('vehiclePrice', e.target.value)}
                  className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            )}

            {/* Down Payment Slider */}
            {parseNum(inputs.vehiclePrice) > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Down Payment</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{inputs.currency}{parseNum(inputs.downPayment).toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={parseNum(inputs.vehiclePrice) * 0.9}
                  step="250"
                  value={inputs.downPayment}
                  onChange={(e) => handleSliderChange('downPayment', e.target.value)}
                  className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            )}

            {/* Interest Rate Slider */}
            {parseNum(inputs.interestRate) > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Interest Rate</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{parseNum(inputs.interestRate)}% APR</span>
                </div>
                <input
                  type="range"
                  min="0.99"
                  max="19.99"
                  step="0.05"
                  value={inputs.interestRate}
                  onChange={(e) => handleSliderChange('interestRate', e.target.value)}
                  className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            )}
          </div>

        </div>

        {/* RIGHT CONTAINER: Real-time Output Panel & Analytics */}
        <div className="lg:col-span-7 space-y-6">
          
          <AnimatePresence mode="wait">
            {parseNum(inputs.vehiclePrice) === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col items-center justify-center p-8 sm:p-12 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl min-h-[400px] bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-4 animate-pulse">
                  <Car className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Awaiting Vehicle Price Information</h3>
                <p className="max-w-md text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                  As soon as you type in a vehicle price, our real-time computing engine will render complete monthly payments, amortization charts, and extra payment saving projections.
                </p>
                <button
                  onClick={handleLoadExample}
                  className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm tracking-wide transition flex items-center gap-1.5 shadow-md shadow-blue-500/10"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Load Sample Scenario
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                
                {/* 1. MAIN RESULT HERO CARD */}
                <div className="p-8 rounded-3xl bg-neutral-950 text-white shadow-2xl relative overflow-hidden">
                  
                  {/* Decorative faint grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative space-y-6">
                    <div className="flex justify-between items-start border-b border-white/10 pb-4">
                      <div>
                        <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-blue-400">
                          Estimated Monthly Payment
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-1">
                          {inputs.currency}{results.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                      </div>
                      <span className="px-3 py-1 bg-white/10 text-white font-bold text-xs rounded-full uppercase tracking-wider backdrop-blur-md">
                        {inputs.loanTerm} Mo Term
                      </span>
                    </div>

                    {/* Lease vs Buy mini box if active */}
                    {inputs.mode === 'lease-buy' && results.leaseBuy && (
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                          Lease vs Buy Direct Comparison
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-neutral-400 block">Buy Total (Residual Depreciated):</span>
                            <span className="font-extrabold text-sm">{inputs.currency}{results.leaseBuy.buyTotalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block">Lease Total:</span>
                            <span className="font-extrabold text-sm">{inputs.currency}{results.leaseBuy.leaseTotalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-300 italic pt-1 border-t border-white/5">
                          {results.leaseBuy.verdict}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs sm:text-sm">
                      <div>
                        <span className="text-neutral-400 block">Amount Financed:</span>
                        <span className="font-bold text-white">{inputs.currency}{results.amountFinanced.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">Total Interest Paid:</span>
                        <span className="font-bold text-red-400">{inputs.currency}{results.interestPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">Total Cost of Loan:</span>
                        <span className="font-bold text-white">{inputs.currency}{results.totalCostOfLoan.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">Total Upfront Cost:</span>
                        <span className="font-bold text-white">{inputs.currency}{results.totalUpfrontCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">Total Cost of Vehicle:</span>
                        <span className="font-bold text-emerald-400">{inputs.currency}{results.totalCostOfVehicle.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. RECHARTS VISUALIZATION SUB-MODULE */}
                <Visualizations results={results} currency={inputs.currency} />

                {/* 3. EXTRA PAYMENT PLANNER BOX */}
                <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg space-y-5">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 fill-current" />
                    Accelerated Payoff & Extra Payment Planner
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                        Monthly Extra Payment
                      </label>
                      <input
                        type="number"
                        value={inputs.monthlyExtra}
                        onChange={(e) => handleSliderChange('monthlyExtra', e.target.value)}
                        placeholder="e.g. 150"
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                        One-Time Extra Payment
                      </label>
                      <input
                        type="number"
                        value={inputs.oneTimeExtra}
                        onChange={(e) => handleSliderChange('oneTimeExtra', e.target.value)}
                        placeholder="e.g. 1000"
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                        Applied on Month #
                      </label>
                      <input
                        type="number"
                        value={inputs.oneTimeExtraMonth}
                        onChange={(e) => handleSliderChange('oneTimeExtraMonth', e.target.value)}
                        placeholder="e.g. 12"
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">
                        Annual Extra Payment
                      </label>
                      <input
                        type="number"
                        value={inputs.annualExtra}
                        onChange={(e) => handleSliderChange('annualExtra', e.target.value)}
                        placeholder="e.g. 500"
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. TOTAL COST OF OWNERSHIP BOX */}
                <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-500" />
                    Total Lifetime Cost of Ownership
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Auto ownership goes far beyond the base loan. Input your monthly recurring variables to compute realistic annual budgets.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        Insurance / Mo
                      </label>
                      <input
                        type="number"
                        value={inputs.insurancePerMonth}
                        onChange={(e) => handleSliderChange('insurancePerMonth', e.target.value)}
                        placeholder="e.g. 150"
                        className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        Fuel / Mo
                      </label>
                      <input
                        type="number"
                        value={inputs.fuelPerMonth}
                        onChange={(e) => handleSliderChange('fuelPerMonth', e.target.value)}
                        placeholder="e.g. 120"
                        className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        Maintenance / Mo
                      </label>
                      <input
                        type="number"
                        value={inputs.maintenancePerMonth}
                        onChange={(e) => handleSliderChange('maintenancePerMonth', e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        Parking / Mo
                      </label>
                      <input
                        type="number"
                        value={inputs.parkingPerMonth}
                        onChange={(e) => handleSliderChange('parkingPerMonth', e.target.value)}
                        placeholder="e.g. 30"
                        className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {parseNum(inputs.insurancePerMonth) > 0 && (
                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-4 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      <div>
                        <span>Estimated Monthly Total:</span>
                        <span className="block text-base text-blue-600 dark:text-cyan-400 font-extrabold">{inputs.currency}{results.ownershipMonthlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div>
                        <span>Estimated Annual Total:</span>
                        <span className="block text-base text-blue-600 dark:text-cyan-400 font-extrabold">{inputs.currency}{results.ownershipAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. INCOME AFFORDABILITY RATIO */}
                {parseNum(inputs.monthlyIncome) > 0 && (
                  <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg space-y-4">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Affordability Assessment
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl space-y-1">
                        <span className="text-neutral-400 block">Payment-to-Income Ratio:</span>
                        <span className="text-base font-extrabold text-neutral-800 dark:text-white">{results.paymentToIncomeRatio.toFixed(1)}%</span>
                        <p className="text-[10px] text-neutral-400">Recommended marker: Under 10%</p>
                      </div>

                      <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl space-y-1">
                        <span className="text-neutral-400 block">Debt-to-Income Ratio:</span>
                        <span className="text-base font-extrabold text-neutral-800 dark:text-white">{results.debtToIncomeRatio.toFixed(1)}%</span>
                        <p className="text-[10px] text-neutral-400">Recommended marker: Under 36%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. STEP-BY-STEP MATHEMATICAL SOLUTION */}
                <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-500" />
                    Step-by-Step Payment Solution
                  </h4>
                  
                  <div className="text-xs space-y-3">
                    <div>
                      <span className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Standard Amortization Formula:</span>
                      <code className="p-1.5 bg-white dark:bg-neutral-950 rounded block font-mono text-blue-600 dark:text-cyan-400 text-center">{results.stepByStep.formula}</code>
                    </div>

                    <div>
                      <span className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Substituting Current Scenario Metrics:</span>
                      <code className="p-1.5 bg-white dark:bg-neutral-950 rounded block font-mono text-center overflow-x-auto">{results.stepByStep.substitution}</code>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-neutral-700 dark:text-neutral-300 block">Calculation Progression Steps:</span>
                      {results.stepByStep.steps.map((step, idx) => (
                        <div key={idx} className="p-2 bg-white dark:bg-neutral-950 rounded border border-neutral-200/30 dark:border-neutral-800/30">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 7. AMORTIZATION LEDGER TABLE CONTROL */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-neutral-950">
                  <button
                    onClick={() => setShowAmortization(!showAmortization)}
                    className="w-full p-5 flex justify-between items-center text-sm font-bold text-neutral-800 dark:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      Detailed Amortization Ledger Table
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-normal text-neutral-400 uppercase">
                        {showAmortization ? 'Collapse' : 'Expand'}
                      </span>
                      {showAmortization ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {showAmortization && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-neutral-100 dark:border-neutral-800"
                      >
                        {/* Table View toggler */}
                        <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Interval Breakdown</span>
                          <div className="flex rounded-lg bg-white dark:bg-neutral-950 p-1 border border-neutral-200/50 dark:border-neutral-800/50 text-xs">
                            <button
                              onClick={() => setAmortizationView('yearly')}
                              className={`px-3 py-1 font-bold rounded-md transition ${amortizationView === 'yearly' ? 'bg-blue-600 text-white' : 'text-neutral-500'}`}
                            >
                              Yearly View
                            </button>
                            <button
                              onClick={() => setAmortizationView('monthly')}
                              className={`px-3 py-1 font-bold rounded-md transition ${amortizationView === 'monthly' ? 'bg-blue-600 text-white' : 'text-neutral-500'}`}
                            >
                              Monthly View
                            </button>
                          </div>
                        </div>

                        {/* Schedule Table */}
                        <div className="max-h-96 overflow-y-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-neutral-50 dark:bg-neutral-900 text-neutral-400 border-b border-neutral-200/40 dark:border-neutral-800/40 font-bold uppercase tracking-wider">
                                <th className="p-3 pl-4">#</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Principal</th>
                                <th className="p-3">Interest</th>
                                {results.hasExtraPayments && <th className="p-3">Extra Paid</th>}
                                <th className="p-3 pr-4">Balance</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900 text-neutral-600 dark:text-neutral-300">
                              {amortizationView === 'yearly' ? (
                                (results.hasExtraPayments ? results.extraYearlySchedule : results.yearlySchedule).map(row => (
                                  <tr key={row.yearNumber} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                                    <td className="p-3 pl-4 font-bold text-neutral-900 dark:text-white">Year {row.yearNumber}</td>
                                    <td className="p-3">{inputs.currency}{row.paymentAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                    <td className="p-3">{inputs.currency}{row.principal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                    <td className="p-3">{inputs.currency}{row.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                    {results.hasExtraPayments && <td className="p-3 text-emerald-500 font-bold">{inputs.currency}{row.extraPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
                                    <td className="p-3 pr-4 font-mono text-[11px] text-neutral-500">{inputs.currency}{row.remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                  </tr>
                                ))
                              ) : (
                                (results.hasExtraPayments ? results.extraSchedule : results.schedule).map(row => (
                                  <tr key={row.paymentNumber} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                                    <td className="p-3 pl-4 font-bold text-neutral-400">M{row.paymentNumber}</td>
                                    <td className="p-3">{inputs.currency}{row.paymentAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                    <td className="p-3">{inputs.currency}{row.principal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                    <td className="p-3">{inputs.currency}{row.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                    {results.hasExtraPayments && <td className="p-3 text-emerald-500 font-bold">{inputs.currency}{row.extraPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>}
                                    <td className="p-3 pr-4 font-mono text-[11px] text-neutral-500">{inputs.currency}{row.remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 8. SMART DYNAMIC FINANCING INSIGHTS */}
                <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Dynamic Smart Insights
                  </h4>
                  <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                    {insights.map((insight, idx) => (
                      <li key={idx} className="flex gap-2 items-start leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
          
        </div>

      </div>

      {/* SEO / Article Section */}
      <SeoContent onNavigate={handleNavigate} />

    </div>
  );
}
