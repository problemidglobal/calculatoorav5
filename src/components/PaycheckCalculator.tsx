import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Receipt, 
  TrendingUp, 
  Layers, 
  BookOpen, 
  Sparkles, 
  Trash2,
  Percent,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { PaycheckInputs, computePaycheck } from '../utils/paycheckMath';
import PaycheckInputSections from './PaycheckInputSections';
import PaycheckResultsPanel from './PaycheckResultsPanel';
import PaycheckBreakdownTable from './PaycheckBreakdownTable';
import PaycheckComparisonMode from './PaycheckComparisonMode';
import PaycheckSeoContent from './PaycheckSeoContent';

const initialEmptyInputs: PaycheckInputs = {
  earningMethod: 'hourly',
  hourlyRate: '',
  hoursWorked: '',
  baseSalary: '',
  dailyRate: '',
  daysWorked: '',
  weeklyRate: '',
  monthlyRate: '',
  annualSalary: '',
  commissionRate: '',
  totalSales: '',
  grossCommission: '',
  projectRate: '',
  payFrequency: 'weekly',
  overtimeHours: '',
  overtimeMultiplier: '',
  doubleOvertimeHours: '',
  doubleOvertimeMultiplier: '',
  tripleOvertimeHours: '',
  tripleOvertimeMultiplier: '',
  customOvertimeHours: '',
  customOvertimeMultiplier: '',
  bonus: '',
  commission: '',
  tips: '',
  holidayPay: '',
  nightShiftAllowance: '',
  weekendAllowance: '',
  travelAllowance: '',
  mealAllowance: '',
  housingAllowance: '',
  medicalAllowance: '',
  educationAllowance: '',
  performanceIncentive: '',
  stockCompensation: '',
  otherEarnings: '',
  deductions: [],
  estimatedTaxRate: '',
  hoursPerDay: '',
  daysPerWeek: '',
  weeksPerYear: '',
  workDaysPerMonth: '',
};

export default function PaycheckCalculator() {
  const [inputs, setInputs] = useState<PaycheckInputs>({ ...initialEmptyInputs });
  const [activeTab, setActiveTab] = useState<'results' | 'breakdown' | 'comparison'>('results');

  // Load a realistic preloaded dataset
  const handleLoadDemo = () => {
    setInputs({
      earningMethod: 'hourly',
      hourlyRate: '28',
      hoursWorked: '40',
      baseSalary: '',
      dailyRate: '',
      daysWorked: '',
      weeklyRate: '',
      monthlyRate: '',
      annualSalary: '',
      commissionRate: '',
      totalSales: '',
      grossCommission: '',
      projectRate: '',
      payFrequency: 'weekly',
      overtimeHours: '5',
      overtimeMultiplier: '1.5',
      doubleOvertimeHours: '2',
      doubleOvertimeMultiplier: '2.0',
      tripleOvertimeHours: '',
      tripleOvertimeMultiplier: '',
      customOvertimeHours: '',
      customOvertimeMultiplier: '',
      bonus: '150',
      commission: '',
      tips: '60',
      holidayPay: '',
      nightShiftAllowance: '',
      weekendAllowance: '',
      travelAllowance: '',
      mealAllowance: '',
      housingAllowance: '',
      medicalAllowance: '',
      educationAllowance: '',
      performanceIncentive: '',
      stockCompensation: '',
      otherEarnings: '',
      deductions: [
        { id: 'demo-1', label: 'Retirement 401(k)', type: 'percent', value: 6, isPreTax: true },
        { id: 'demo-2', label: 'Health Insurance Premium', type: 'fixed', value: 85, isPreTax: true },
        { id: 'demo-3', label: 'Dental Plan Withholding', type: 'fixed', value: 15, isPreTax: true },
        { id: 'demo-4', label: 'Corporate Gym Fee', type: 'fixed', value: 20, isPreTax: false }
      ],
      estimatedTaxRate: '15',
      hoursPerDay: '8',
      daysPerWeek: '5',
      weeksPerYear: '52',
      workDaysPerMonth: '21.67',
    });
  };

  const handleClear = () => {
    setInputs({ ...initialEmptyInputs });
  };

  // Compute Results dynamically
  const results = useMemo(() => {
    // Check if sufficient input has been filled
    const method = inputs.earningMethod;
    let hasMinInputs = false;

    if (method === 'hourly' && inputs.hourlyRate) hasMinInputs = true;
    else if (method === 'salary' && inputs.baseSalary) hasMinInputs = true;
    else if (method === 'daily' && inputs.dailyRate) hasMinInputs = true;
    else if (method === 'weekly' && inputs.weeklyRate) hasMinInputs = true;
    else if (method === 'monthly' && inputs.monthlyRate) hasMinInputs = true;
    else if (method === 'annual' && inputs.annualSalary) hasMinInputs = true;
    else if (method === 'commission' && (inputs.totalSales || inputs.grossCommission)) hasMinInputs = true;
    else if (method === 'freelance' && inputs.projectRate) hasMinInputs = true;

    if (!hasMinInputs) return null;

    return computePaycheck(inputs);
  }, [inputs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header (Matching Calculatoora design guidelines) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Premium Personal Finance Module</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
          Paycheck Calculator
        </h1>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 leading-relaxed font-semibold">
          The world's most advanced paycheck stub and take-home salary simulator. Input earnings, configure pre/post tax benefits, allocate local tax withholdings, and compare plans with zero data assumptions.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Controls & Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-50/50 dark:bg-neutral-950/10 p-5 rounded-3xl border border-neutral-100 dark:border-neutral-850/50 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-500" />
              Paycheck Parameters
            </h2>
            <PaycheckInputSections
              inputs={inputs}
              setInputs={setInputs}
              onClear={handleClear}
              onLoadDemo={handleLoadDemo}
            />
          </div>
        </div>

        {/* Right Hand: Interactive Results & Analytics */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Output Navigation Tabs */}
          <div className="flex border-b border-neutral-150 dark:border-neutral-850 pb-px gap-1.5">
            {[
              { id: 'results', label: 'Live Dashboard', icon: TrendingUp },
              { id: 'breakdown', label: 'Paystub Ledger', icon: Receipt },
              { id: 'comparison', label: 'Scenarios Comparison', icon: Layers }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-4 font-black text-xs uppercase tracking-wider transition border-b-2 -mb-px cursor-pointer select-none ${
                    isActive 
                      ? 'border-blue-500 text-blue-600 dark:text-cyan-400 font-extrabold' 
                      : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Render Active View Tab */}
          <div className="min-h-[400px]">
            {activeTab === 'results' && (
              <PaycheckResultsPanel 
                results={results} 
                inputs={inputs} 
              />
            )}
            {activeTab === 'breakdown' && (
              <PaycheckBreakdownTable 
                results={results} 
                inputs={inputs} 
              />
            )}
            {activeTab === 'comparison' && (
              <PaycheckComparisonMode 
                currentInputs={inputs} 
                currentResults={results} 
              />
            )}
          </div>

        </div>

      </div>

      {/* Structured SEO Guide Block */}
      <PaycheckSeoContent />

    </div>
  );
}
