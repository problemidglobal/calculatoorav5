import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Calendar, 
  Percent, 
  Trash2, 
  User, 
  PiggyBank, 
  TrendingUp, 
  Scale, 
  Coins, 
  Plus, 
  Copy, 
  Heart, 
  HelpCircle, 
  Briefcase, 
  Landmark,
  Eye,
  EyeOff
} from 'lucide-react';
import { RetirementInputs, TimelineEvent, RetirementPhase } from '../utils/retirementMath';

interface RetirementInputSectionsProps {
  inputs: RetirementInputs;
  setInputs: React.Dispatch<React.SetStateAction<RetirementInputs>>;
  onClearSection: (sectionId: string) => void;
}

export default function RetirementInputSections({
  inputs,
  setInputs,
  onClearSection
}: RetirementInputSectionsProps) {
  const [openSection, setOpenSection] = useState<string>('accumulation');

  const toggleSection = (sec: string) => {
    setOpenSection(p => p === sec ? '' : sec);
  };

  const updateField = (field: keyof RetirementInputs, val: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: val === '' ? '' as any : val
    }));
  };

  // Helper to update specific nested properties
  const updateNestedField = (parent: 'goalPlanner', field: string, val: any) => {
    setInputs(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: val === '' ? '' as any : val
      }
    }));
  };

  // Custom Timeline Events management
  const handleAddEvent = () => {
    const newEvent: TimelineEvent = {
      id: Math.random().toString(36).substr(2, 9),
      age: '' as any,
      description: '',
      contribution: '' as any,
      withdrawal: '' as any,
      income: '' as any,
      expense: '' as any,
      isCollapsed: false
    };
    setInputs(prev => ({
      ...prev,
      events: [...(prev.events || []), newEvent]
    }));
  };

  const handleUpdateEvent = (id: string, field: keyof TimelineEvent, val: any) => {
    setInputs(prev => ({
      ...prev,
      events: prev.events.map(ev => ev.id === id ? { ...ev, [field]: val } : ev)
    }));
  };

  const handleDeleteEvent = (id: string) => {
    setInputs(prev => ({
      ...prev,
      events: prev.events.filter(ev => ev.id !== id)
    }));
  };

  const handleDuplicateEvent = (event: TimelineEvent) => {
    const duplicated: TimelineEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      description: `${event.description} (Copy)`,
      isCollapsed: false
    };
    setInputs(prev => ({
      ...prev,
      events: [...prev.events, duplicated]
    }));
  };

  const handleToggleCollapseEvent = (id: string) => {
    setInputs(prev => ({
      ...prev,
      events: prev.events.map(ev => ev.id === id ? { ...ev, isCollapsed: !ev.isCollapsed } : ev)
    }));
  };

  // Multiple Phases Management
  const handleUpdatePhase = (index: number, field: keyof RetirementPhase, val: any) => {
    setInputs(prev => {
      const updatedPhases = [...prev.phases];
      updatedPhases[index] = { ...updatedPhases[index], [field]: val };
      return {
        ...prev,
        phases: updatedPhases
      };
    });
  };

  const sectionHeader = (id: string, title: string, icon: React.ReactNode, subtitle?: string) => {
    const isOpen = openSection === id;
    return (
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-905 hover:bg-neutral-100/50 dark:hover:bg-neutral-850 transition-all rounded-2xl border border-neutral-150 dark:border-neutral-800 select-none text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-xl">
            {icon}
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-white">{title}</h4>
            {subtitle && <p className="text-[10px] text-neutral-400 font-medium">{subtitle}</p>}
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
      </button>
    );
  };

  const renderClearSectionButton = (id: string) => {
    return (
      <div className="flex justify-end pb-2 mb-2 border-b border-neutral-100 dark:border-neutral-800/60">
        <button
          type="button"
          onClick={() => onClearSection(id)}
          className="text-[9px] font-black text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 uppercase tracking-widest flex items-center gap-1 bg-rose-500/5 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-500/10 cursor-pointer select-none transition"
        >
          <Trash2 className="w-3 h-3 text-rose-500" /> Clear Section
        </button>
      </div>
    );
  };

  const cur = inputs.currency || '$';

  return (
    <div className="space-y-4 text-left font-sans max-h-[92vh] overflow-y-auto pr-1">

      {/* SECTION 1: CORE ACCUMULATION */}
      <div className="space-y-2">
        {sectionHeader('accumulation', '1. Accumulation & Salary', <PiggyBank className="w-4 h-4" />, 'Age, timeline, savings and employment earnings')}
        {openSection === 'accumulation' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('accumulation')}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Current Age *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="number"
                    value={inputs.currentAge ?? ''}
                    onChange={(e) => updateField('currentAge', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 30"
                    className="w-full text-xs font-bold pl-8.5 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Retirement Age *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="number"
                    value={inputs.retirementAge ?? ''}
                    onChange={(e) => updateField('retirementAge', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 65"
                    className="w-full text-xs font-bold pl-8.5 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Life Expectancy</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="number"
                    value={inputs.lifeExpectancy ?? ''}
                    onChange={(e) => updateField('lifeExpectancy', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 85"
                    className="w-full text-xs font-bold pl-8.5 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Current Savings</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">
                    {cur}
                  </span>
                  <input
                    type="number"
                    value={inputs.currentSavings ?? ''}
                    onChange={(e) => updateField('currentSavings', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 50000"
                    className="w-full text-xs font-bold pl-8 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-150 dark:border-neutral-850 space-y-3">
              <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Salary & Employer Match</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Annual Salary</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                    <input
                      type="number"
                      value={inputs.salary ?? ''}
                      onChange={(e) => updateField('salary', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      placeholder="e.g. 75000"
                      className="w-full text-[11px] font-bold pl-7 pr-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Annual Growth (%)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">%</span>
                    <input
                      type="number"
                      value={inputs.salaryGrowth ?? ''}
                      onChange={(e) => updateField('salaryGrowth', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 3.0"
                      className="w-full text-[11px] font-bold pl-2 pr-6 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Employer Match</label>
                  <input
                    type="number"
                    value={inputs.employerContribution ?? ''}
                    onChange={(e) => updateField('employerContribution', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder={inputs.employerContributionType === 'percent' ? 'e.g. 3.0' : 'e.g. 200'}
                    className="w-full text-[11px] font-bold px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Match Unit</label>
                  <select
                    value={inputs.employerContributionType}
                    onChange={(e) => updateField('employerContributionType', e.target.value)}
                    className="w-full text-[11px] font-bold px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none"
                  >
                    <option value="percent">% of Salary</option>
                    <option value="amount">{cur} / Month</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contributions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-neutral-450 uppercase">Savings Contribution</label>
                <div className="flex bg-neutral-100 dark:bg-neutral-950 p-0.5 rounded-lg border border-neutral-200/55 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => updateField('contributionFrequency', 'monthly')}
                    className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition ${
                      inputs.contributionFrequency === 'monthly'
                        ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm'
                        : 'text-neutral-450'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('contributionFrequency', 'annual')}
                    className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition ${
                      inputs.contributionFrequency === 'annual'
                        ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm'
                        : 'text-neutral-450'
                    }`}
                  >
                    Annual
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">
                    {inputs.contributionFrequency === 'monthly' ? 'Monthly savings' : 'Annual savings'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                    <input
                      type="number"
                      value={(inputs.contributionFrequency === 'monthly' ? inputs.monthlyContribution : inputs.annualContribution) ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                        if (inputs.contributionFrequency === 'monthly') {
                          updateField('monthlyContribution', val);
                        } else {
                          updateField('annualContribution', val);
                        }
                      }}
                      placeholder={inputs.contributionFrequency === 'monthly' ? 'e.g. 500' : 'e.g. 6000'}
                      className="w-full text-xs font-bold pl-7 pr-2 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Annual Step-up (%)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">%</span>
                    <input
                      type="number"
                      value={inputs.contributionStepUp ?? ''}
                      onChange={(e) => updateField('contributionStepUp', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      placeholder="e.g. 3.0"
                      className="w-full text-xs font-bold pl-4 pr-8 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* SECTION 2: RETURNS & MARKET VOLATILITY */}
      <div className="space-y-2">
        {sectionHeader('returns', '2. Market returns & risk', <TrendingUp className="w-4 h-4" />, 'Growth rates, simulation parameters & currency')}
        {openSection === 'returns' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('returns')}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Currency Display</label>
                <select
                  value={inputs.currency || '$'}
                  onChange={(e) => updateField('currency', e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="¥">JPY (¥)</option>
                  <option value="₹">INR (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">MC Simulations</label>
                <select
                  value={inputs.monteCarloCount || 500}
                  onChange={(e) => updateField('monteCarloCount', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="100">100 Runs (Fast)</option>
                  <option value="500">500 Runs (Standard)</option>
                  <option value="1000">1,000 Runs (High Quality)</option>
                  <option value="5000">5,000 Runs (Expert)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Pre-Retire Return</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">%</span>
                  <input
                    type="number"
                    value={inputs.preRetireReturn ?? ''}
                    onChange={(e) => updateField('preRetireReturn', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 7.5"
                    className="w-full text-xs font-bold pl-4 pr-8 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Post-Retire Return</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">%</span>
                  <input
                    type="number"
                    value={inputs.postRetireReturn ?? ''}
                    onChange={(e) => updateField('postRetireReturn', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 5.0"
                    className="w-full text-xs font-bold pl-4 pr-8 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Portfolio Volatility (MC Risk)</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">%</span>
                <input
                  type="number"
                  value={inputs.volatility ?? ''}
                  onChange={(e) => updateField('volatility', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. 12.0"
                  className="w-full text-xs font-bold pl-4 pr-8 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-[10px] text-neutral-400 leading-normal mt-1">
                Standard stock volatility is around 12-15%. Balanced portfolio is 8-11%. Conservative is 4-7%.
              </p>
            </div>

          </div>
        )}
      </div>

      {/* SECTION 3: SPENDING & DRAW STRATEGIES */}
      <div className="space-y-2">
        {sectionHeader('spending', '3. Spending & Withdrawals', <Scale className="w-4 h-4" />, 'Desired lifestyle expense, strategies & tax')}
        {openSection === 'spending' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('spending')}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-neutral-450 uppercase">Desired Retirement Income</label>
                <div className="flex bg-neutral-100 dark:bg-neutral-950 p-0.5 rounded-lg border border-neutral-200/55 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => updateField('targetIncomeType', 'monthly')}
                    className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition ${
                      inputs.targetIncomeType === 'monthly'
                        ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm'
                        : 'text-neutral-450'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('targetIncomeType', 'annual')}
                    className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition ${
                      inputs.targetIncomeType === 'annual'
                        ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm'
                        : 'text-neutral-450'
                    }`}
                  >
                    Annual
                  </button>
                </div>
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">
                  {cur}
                </span>
                <input
                  type="number"
                  value={inputs.targetIncome ?? ''}
                  onChange={(e) => updateField('targetIncome', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  placeholder={inputs.targetIncomeType === 'monthly' ? 'e.g. 5000' : 'e.g. 60000'}
                  className="w-full text-xs font-bold pl-8 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Annual Inflation</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">%</span>
                  <input
                    type="number"
                    value={inputs.inflationRate ?? ''}
                    onChange={(e) => updateField('inflationRate', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 2.5"
                    className="w-full text-xs font-bold pl-4 pr-8 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Income Tax Rate</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">%</span>
                  <input
                    type="number"
                    value={inputs.taxRate ?? ''}
                    onChange={(e) => updateField('taxRate', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 15.0"
                    className="w-full text-xs font-bold pl-4 pr-8 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-neutral-450 uppercase">Withdrawal Strategy</label>
              <select
                value={inputs.withdrawalStrategy}
                onChange={(e) => updateField('withdrawalStrategy', e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="fixed">Fixed Spending (Adjusted for Inflation)</option>
                <option value="percentage">SWR % of Remaining Balance</option>
                <option value="dynamic">Dynamic Bounded Rule (+/-15% Flex)</option>
                <option value="inflation_adjusted">SWR Nest Egg Base + Annual Inflation</option>
                <option value="custom">Custom Schedule (Driven by Phases/Events)</option>
              </select>
            </div>

            {inputs.withdrawalStrategy !== 'custom' && (
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Safe Withdrawal Rate (SWR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">%</span>
                  <input
                    type="number"
                    value={inputs.swrPercent ?? ''}
                    onChange={(e) => updateField('swrPercent', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 4.0"
                    className="w-full text-xs font-bold pl-4 pr-8 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
                  SWR determines the annual withdrawal as a percentage of the retirement nest egg. The legendary "4% rule" is standard.
                </p>
              </div>
            )}

            {/* Healthcare Section */}
            <div className="p-3 bg-red-500/5 rounded-xl border border-rose-500/10 space-y-3">
              <span className="text-[9px] font-black uppercase text-rose-500 tracking-wider flex items-center gap-1.5">
                <Heart className="w-3 h-3" /> Healthcare Expenses in Retirement
              </span>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Healthcare Cost</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                    <input
                      type="number"
                      value={inputs.healthcareCost ?? ''}
                      onChange={(e) => updateField('healthcareCost', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      placeholder="e.g. 300"
                      className="w-full text-[11px] font-bold pl-6 pr-1.5 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Frequency</label>
                  <select
                    value={inputs.healthcareCostType}
                    onChange={(e) => updateField('healthcareCostType', e.target.value)}
                    className="w-full text-[11px] font-bold px-1 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Healthcare Inflation (%)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">%</span>
                  <input
                    type="number"
                    value={inputs.healthcareInflation ?? ''}
                    onChange={(e) => updateField('healthcareInflation', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 5.0"
                    className="w-full text-[11px] font-bold pl-2 pr-6 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                  />
                </div>
                <p className="text-[9px] text-neutral-400 leading-normal mt-1">
                  Healthcare inflation is typically significantly higher than general price inflation.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* SECTION 4: GUARANTEED & OTHER INCOME STREAM SOURCES */}
      <div className="space-y-2">
        {sectionHeader('income', '4. Retirement Income Sources', <Coins className="w-4 h-4" />, 'Social security, pension, rentals, business & inheritance')}
        {openSection === 'income' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('income')}

            <div className="grid grid-cols-2 gap-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
              <span className="col-span-2 text-[9px] font-black uppercase text-blue-500 tracking-wider">Social Security</span>
              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Monthly Benefit</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                  <input
                    type="number"
                    value={inputs.socialSecurity ?? ''}
                    onChange={(e) => updateField('socialSecurity', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 1800"
                    className="w-full text-[11px] font-bold pl-6 pr-1.5 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Starting Age</label>
                <input
                  type="number"
                  value={inputs.ssStartAge ?? ''}
                  onChange={(e) => updateField('ssStartAge', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. 67"
                  className="w-full text-[11px] font-bold px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
              <span className="col-span-2 text-[9px] font-black uppercase text-indigo-500 tracking-wider">Pension Plan</span>
              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                  <input
                    type="number"
                    value={inputs.pensionIncome ?? ''}
                    onChange={(e) => updateField('pensionIncome', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 1000"
                    className="w-full text-[11px] font-bold pl-6 pr-1.5 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Type</label>
                <select
                  value={inputs.pensionType}
                  onChange={(e) => updateField('pensionType', e.target.value)}
                  className="w-full text-[11px] font-bold px-1.5 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none"
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1">Rental Income (Monthly)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                  <input
                    type="number"
                    value={inputs.rentalIncome ?? ''}
                    onChange={(e) => updateField('rentalIncome', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 800"
                    className="w-full text-xs font-bold pl-7 pr-2 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1">Business Profits (Monthly)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                  <input
                    type="number"
                    value={inputs.businessIncome ?? ''}
                    onChange={(e) => updateField('businessIncome', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 500"
                    className="w-full text-xs font-bold pl-7 pr-2 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1">Annuity/Investment (Monthly)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                  <input
                    type="number"
                    value={inputs.investmentIncome ?? ''}
                    onChange={(e) => updateField('investmentIncome', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 200"
                    className="w-full text-xs font-bold pl-7 pr-2 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1">Other Recurring (Monthly)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                  <input
                    type="number"
                    value={inputs.customRecurringIncome ?? ''}
                    onChange={(e) => updateField('customRecurringIncome', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 150"
                    className="w-full text-xs font-bold pl-7 pr-2 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Inheritance One-Time Income */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
              <span className="col-span-2 text-[9px] font-black uppercase text-emerald-500 tracking-wider">One-Time Inheritance</span>
              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                  <input
                    type="number"
                    value={inputs.inheritance ?? ''}
                    onChange={(e) => updateField('inheritance', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 100000"
                    className="w-full text-[11px] font-bold pl-6 pr-1.5 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Age Scheduled</label>
                <input
                  type="number"
                  value={inputs.inheritanceAge ?? ''}
                  onChange={(e) => updateField('inheritanceAge', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. 50"
                  className="w-full text-[11px] font-bold px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* SECTION 5: UNLIMITED TIMELINE EVENTS */}
      <div className="space-y-2">
        {sectionHeader('events', `5. Timeline Events (${inputs.events?.length || 0})`, <Calendar className="w-4 h-4" />, 'Map custom cash flows, buying a house, or inherits')}
        {openSection === 'events' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/60">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Interactive Timeline</span>
              <button
                type="button"
                onClick={handleAddEvent}
                className="text-[9px] font-black text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 uppercase tracking-widest flex items-center gap-1 bg-blue-500/5 hover:bg-blue-500/10 dark:bg-cyan-400/5 dark:hover:bg-cyan-400/10 px-3 py-1.5 rounded-lg border border-blue-500/10 cursor-pointer select-none transition"
              >
                <Plus className="w-3 h-3" /> Add Custom Event
              </button>
            </div>

            {(!inputs.events || inputs.events.length === 0) ? (
              <div className="text-center py-6 border-2 border-dashed border-neutral-150 dark:border-neutral-800 rounded-xl">
                <p className="text-[10px] text-neutral-400 font-bold uppercase">No events scheduled</p>
                <p className="text-[9px] text-neutral-400 max-w-[200px] mx-auto leading-normal mt-1">
                  Add custom cash flows like one-time withdrawals, expense shocks, or inheritance windfalls at specific ages.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {inputs.events.map((ev, idx) => (
                  <div key={ev.id} className="border border-neutral-150 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-950">
                    {/* Collapsible header */}
                    <div className="flex items-center justify-between p-3 bg-neutral-100/50 dark:bg-neutral-900/50 border-b border-neutral-150 dark:border-neutral-800/60">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase text-neutral-400">#{idx + 1}</span>
                        <span className="text-xs font-bold text-neutral-700 dark:text-white truncate max-w-[120px]">
                          {ev.description || 'Unnamed Event'}
                        </span>
                        {ev.age && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded">
                            Age {ev.age}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleCollapseEvent(ev.id)}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          title={ev.isCollapsed ? 'Expand Event' : 'Collapse Event'}
                        >
                          {ev.isCollapsed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateEvent(ev)}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-rose-500/10 rounded text-neutral-450 hover:text-rose-500 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {!ev.isCollapsed && (
                      <div className="p-3.5 space-y-3 text-left">
                        <div>
                          <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Description</label>
                          <input
                            type="text"
                            value={ev.description}
                            onChange={(e) => handleUpdateEvent(ev.id, 'description', e.target.value)}
                            placeholder="e.g. Down Payment, Medical cost, Inheritance"
                            className="w-full text-xs font-bold px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Age Scheduled *</label>
                            <input
                              type="number"
                              value={ev.age ?? ''}
                              onChange={(e) => handleUpdateEvent(ev.id, 'age', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                              placeholder="e.g. 45"
                              className="w-full text-xs font-bold px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">One-Time Contribution</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                              <input
                                type="number"
                                value={ev.contribution ?? ''}
                                onChange={(e) => handleUpdateEvent(ev.id, 'contribution', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                                placeholder="e.g. 5000"
                                className="w-full text-xs font-bold pl-6.5 pr-1.5 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[8px] font-black text-rose-450 uppercase mb-1">One-Time Withdrawal</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-neutral-400 text-[10px] font-bold">{cur}</span>
                              <input
                                type="number"
                                value={ev.withdrawal ?? ''}
                                onChange={(e) => handleUpdateEvent(ev.id, 'withdrawal', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                                placeholder="0"
                                className="w-full text-[10px] font-bold pl-5.5 pr-1 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-rose-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] font-black text-emerald-450 uppercase mb-1">One-Time Income</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-neutral-400 text-[10px] font-bold">{cur}</span>
                              <input
                                type="number"
                                value={ev.income ?? ''}
                                onChange={(e) => handleUpdateEvent(ev.id, 'income', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                                placeholder="0"
                                className="w-full text-[10px] font-bold pl-5.5 pr-1 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-emerald-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] font-black text-amber-550 uppercase mb-1">One-Time Expense</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-neutral-400 text-[10px] font-bold">{cur}</span>
                              <input
                                type="number"
                                value={ev.expense ?? ''}
                                onChange={(e) => handleUpdateEvent(ev.id, 'expense', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                                placeholder="0"
                                className="w-full text-[10px] font-bold pl-5.5 pr-1 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-amber-600 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>

      {/* SECTION 6: RETIREMENT PHASES SCHEDULER */}
      <div className="space-y-2">
        {sectionHeader('phases', `6. Retirement Phases (${inputs.phasesEnabled ? 'Active' : 'Off'})`, <Landmark className="w-4 h-4" />, 'Working years, Early/Full/Late Retirement scheduling')}
        {openSection === 'phases' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/60">
              <div>
                <span className="text-[10px] font-bold text-neutral-450 uppercase block">Phase override scheduler</span>
                <span className="text-[9px] text-neutral-400">Map precise financial rules for specific life periods</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={inputs.phasesEnabled} 
                  onChange={(e) => updateField('phasesEnabled', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-neutral-200 dark:bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {!inputs.phasesEnabled ? (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950/40 rounded-xl text-center border border-neutral-200/50 dark:border-neutral-800/40">
                <p className="text-[10px] text-neutral-400 font-bold uppercase">Phase Scheduling Disabled</p>
                <p className="text-[9px] text-neutral-400 mt-1 leading-normal">
                  Turn on the toggle to schedule precise pre-retirement returns, post-retirement inflation, and contribution limits for each life stage.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {inputs.phases.map((phase, idx) => (
                  <div key={phase.id} className="p-3 border border-neutral-150 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30 rounded-xl space-y-3 text-left">
                    <span className="text-[10px] font-black uppercase text-blue-500 dark:text-cyan-400 block tracking-widest">
                      {phase.name}
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Start Age</label>
                        <input
                          type="number"
                          value={phase.startAge ?? ''}
                          onChange={(e) => handleUpdatePhase(idx, 'startAge', e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="0"
                          className="w-full text-xs font-bold px-2 py-1 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">End Age</label>
                        <input
                          type="number"
                          value={phase.endAge ?? ''}
                          onChange={(e) => handleUpdatePhase(idx, 'endAge', e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="100"
                          className="w-full text-xs font-bold px-2 py-1 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Return Rate (%)</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-neutral-400 text-[10px] font-bold">%</span>
                          <input
                            type="number"
                            value={phase.returnRate ?? ''}
                            onChange={(e) => handleUpdatePhase(idx, 'returnRate', e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="0.0"
                            className="w-full text-xs font-bold pl-2 pr-5 py-1 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Inflation Rate (%)</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-neutral-400 text-[10px] font-bold">%</span>
                          <input
                            type="number"
                            value={phase.inflation ?? ''}
                            onChange={(e) => handleUpdatePhase(idx, 'inflation', e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="0.0"
                            className="w-full text-xs font-bold pl-2 pr-5 py-1 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900 text-neutral-850 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1">Contribution</label>
                        <input
                          type="number"
                          value={phase.contribution ?? ''}
                          onChange={(e) => handleUpdatePhase(idx, 'contribution', e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="0"
                          className="w-full text-[10px] font-bold px-1.5 py-1 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1">Withdrawal</label>
                        <input
                          type="number"
                          value={phase.withdrawal ?? ''}
                          onChange={(e) => handleUpdatePhase(idx, 'withdrawal', e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="0"
                          className="w-full text-[10px] font-bold px-1.5 py-1 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">Expenses</label>
                        <input
                          type="number"
                          value={phase.expenses ?? ''}
                          onChange={(e) => handleUpdatePhase(idx, 'expenses', e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="0"
                          className="w-full text-[10px] font-bold px-1.5 py-1 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
