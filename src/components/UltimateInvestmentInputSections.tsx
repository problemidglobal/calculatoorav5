import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Calendar, 
  Percent, 
  Coins, 
  Shield, 
  Activity, 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  Info, 
  Clock, 
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Briefcase
} from 'lucide-react';
import { 
  InvestmentInputs, 
  CustomReturnEvent, 
  CustomWithdrawalEvent, 
  PortfolioAsset 
} from '../utils/ultimateInvestmentMath';

interface UltimateInvestmentInputSectionsProps {
  inputs: InvestmentInputs;
  setInputs: React.Dispatch<React.SetStateAction<InvestmentInputs>>;
  onClearSection: (sectionId: string) => void;
}

export default function UltimateInvestmentInputSections({
  inputs,
  setInputs,
  onClearSection
}: UltimateInvestmentInputSectionsProps) {
  const [openSection, setOpenSection] = useState<string>('basic');

  const toggleSection = (sec: string) => {
    setOpenSection(p => p === sec ? '' : sec);
  };

  const updateField = (field: keyof InvestmentInputs, val: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: val
    }));
  };

  // Custom returns handlers
  const handleAddCustomReturn = () => {
    const nextYear = inputs.customReturns.length > 0 
      ? Math.max(...inputs.customReturns.map(r => r.year)) + 1 
      : 1;
    
    const newEvent: CustomReturnEvent = {
      year: nextYear,
      rate: inputs.annualReturn
    };

    setInputs(prev => ({
      ...prev,
      customReturns: [...prev.customReturns, newEvent]
    }));
  };

  const handleRemoveCustomReturn = (index: number) => {
    setInputs(prev => ({
      ...prev,
      customReturns: prev.customReturns.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateCustomReturn = (index: number, field: keyof CustomReturnEvent, val: number) => {
    setInputs(prev => {
      const updatedList = [...prev.customReturns];
      updatedList[index] = {
        ...updatedList[index],
        [field]: val
      };
      return {
        ...prev,
        customReturns: updatedList
      };
    });
  };

  // Custom withdrawal handlers
  const handleAddCustomWithdrawal = () => {
    const newEvent: CustomWithdrawalEvent = {
      month: 12,
      amount: 1000,
      label: 'Special Expense'
    };
    setInputs(prev => ({
      ...prev,
      customWithdrawals: [...prev.customWithdrawals, newEvent]
    }));
  };

  const handleRemoveCustomWithdrawal = (index: number) => {
    setInputs(prev => ({
      ...prev,
      customWithdrawals: prev.customWithdrawals.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateCustomWithdrawal = (index: number, field: keyof CustomWithdrawalEvent, val: any) => {
    setInputs(prev => {
      const updatedList = [...prev.customWithdrawals];
      updatedList[index] = {
        ...updatedList[index],
        [field]: val
      };
      return {
        ...prev,
        customWithdrawals: updatedList
      };
    });
  };

  // Portfolio assets handlers
  const handleAddAsset = () => {
    const newAsset: PortfolioAsset = {
      id: Math.random().toString(36).substring(2, 9),
      name: 'New Asset',
      percentage: 10,
      expectedReturn: inputs.annualReturn,
      volatility: inputs.volatility
    };
    setInputs(prev => ({
      ...prev,
      assets: [...prev.assets, newAsset]
    }));
  };

  const handleRemoveAsset = (id: string) => {
    setInputs(prev => ({
      ...prev,
      assets: prev.assets.filter(a => a.id !== id)
    }));
  };

  const handleUpdateAsset = (id: string, field: keyof PortfolioAsset, val: any) => {
    setInputs(prev => {
      const updatedList = prev.assets.map(a => {
        if (a.id === id) {
          return { ...a, [field]: val };
        }
        return a;
      });
      return {
        ...prev,
        assets: updatedList
      };
    });
  };

  const totalPortfolioAllocated = inputs.assets.reduce((sum, a) => sum + (Number(a.percentage) || 0), 0);

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

  const currencySymbol = inputs.currency || '$';

  return (
    <div className="space-y-4 text-left font-sans max-h-[92vh] overflow-y-auto pr-1">

      {/* 1. INVESTMENT INFORMATION (Required) */}
      <div className="space-y-2">
        {sectionHeader('basic', '1. Investment Info', <DollarSign className="w-4 h-4" />, 'Core parameters, goal targets, and terms')}
        {openSection === 'basic' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('basic')}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Currency</label>
                <select
                  value={inputs.currency}
                  onChange={(e) => updateField('currency', e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white"
                >
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="₹">INR (₹)</option>
                  <option value="¥">JPY (¥)</option>
                  <option value="A$">AUD (A$)</option>
                  <option value="C$">CAD (C$)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Investment Goal</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={inputs.investmentGoal || ''}
                    onChange={(e) => updateField('investmentGoal', Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 1000000"
                    className="w-full text-xs font-bold pl-8 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Initial Investment</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  value={inputs.initialInvestment || ''}
                  onChange={(e) => updateField('initialInvestment', Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="w-full text-xs font-bold pl-8 pr-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Period (Years)</label>
                <input
                  type="number"
                  value={inputs.investmentPeriodYears || ''}
                  onChange={(e) => updateField('investmentPeriodYears', Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Period (Months)</label>
                <input
                  type="number"
                  value={inputs.investmentPeriodMonths || ''}
                  onChange={(e) => updateField('investmentPeriodMonths', Math.max(0, Math.min(11, Number(e.target.value))))}
                  placeholder="0"
                  className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Start Date</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                </span>
                <input
                  type="date"
                  value={inputs.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className="w-full text-xs font-bold pl-9 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white"
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 2. RETURN SETTINGS (Section 2) */}
      <div className="space-y-2">
        {sectionHeader('returns', '2. Return Settings', <TrendingUp className="w-4 h-4" />, 'Expected returns, variables, schedules')}
        {openSection === 'returns' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('returns')}
            <div>
              <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Annual Return (%)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Percent className="w-3.5 h-3.5" />
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.annualReturn || ''}
                  onChange={(e) => updateField('annualReturn', Number(e.target.value))}
                  placeholder="e.g. 8.0"
                  className="w-full text-xs font-bold pl-8 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Return Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateField('returnType', 'fixed')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    inputs.returnType === 'fixed'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/30'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-500 dark:text-neutral-450'
                  }`}
                >
                  Fixed Return
                </button>
                <button
                  type="button"
                  onClick={() => updateField('returnType', 'custom')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    inputs.returnType === 'custom'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/30'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-500 dark:text-neutral-450'
                  }`}
                >
                  Custom Schedule
                </button>
              </div>
            </div>

            {inputs.returnType === 'custom' && (
              <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800/80 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-450 uppercase">Year-by-Year Yield changes</span>
                  <button
                    type="button"
                    onClick={handleAddCustomReturn}
                    className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Year Rate
                  </button>
                </div>

                {inputs.customReturns.length === 0 ? (
                  <p className="text-[10px] text-neutral-400 italic">No custom rates specified. Defaulting to nominal return above.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {inputs.customReturns.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-20">
                          <input
                            type="number"
                            value={item.year}
                            onChange={(e) => handleUpdateCustomReturn(idx, 'year', Math.max(1, Number(e.target.value)))}
                            placeholder="Year"
                            className="w-full text-xs font-bold px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center"
                          />
                        </div>
                        <div className="relative flex-1">
                          <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-neutral-400">
                            <Percent className="w-3 h-3" />
                          </span>
                          <input
                            type="number"
                            step="0.1"
                            value={item.rate}
                            onChange={(e) => handleUpdateCustomReturn(idx, 'rate', Number(e.target.value))}
                            placeholder="Rate %"
                            className="w-full text-xs font-bold pl-6 pr-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomReturn(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* 3. COMPOUNDING FREQUENCY (Section 3) */}
      <div className="space-y-2">
        {sectionHeader('compounding', '3. Compounding Frequency', <RefreshCw className="w-4 h-4" />, 'Compound interest cycles')}
        {openSection === 'compounding' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('compounding')}
            <div>
              <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Compounding Interval</label>
              <select
                value={inputs.compoundingFrequency}
                onChange={(e) => updateField('compoundingFrequency', e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white"
              >
                <option value="daily">Daily Compounding (365/Yr)</option>
                <option value="weekly">Weekly Compounding (52/Yr)</option>
                <option value="biweekly">Bi-weekly Compounding (26/Yr)</option>
                <option value="monthly">Monthly Compounding (12/Yr)</option>
                <option value="quarterly">Quarterly Compounding (4/Yr)</option>
                <option value="semiannual">Semi-Annually Compounding (2/Yr)</option>
                <option value="annual">Annually Compounding (1/Yr)</option>
                <option value="continuous">Continuous Compounding (Infinite)</option>
              </select>
            </div>

          </div>
        )}
      </div>

      {/* 4. CONTRIBUTIONS (Section 4) */}
      <div className="space-y-2">
        {sectionHeader('contributions', '4. Contributions & Step-Up', <Plus className="w-4 h-4" />, 'Optional SIP periodic deposits & annual increases')}
        {openSection === 'contributions' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('contributions')}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Monthly SIP</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={inputs.monthlyContribution || ''}
                    onChange={(e) => updateField('monthlyContribution', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-8 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Weekly Deposit</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={inputs.weeklyContribution || ''}
                    onChange={(e) => updateField('weeklyContribution', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-8 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Bi-weekly Deposit</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={inputs.biweeklyContribution || ''}
                    onChange={(e) => updateField('biweeklyContribution', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-8 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Quarterly Deposit</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={inputs.quarterlyContribution || ''}
                    onChange={(e) => updateField('quarterlyContribution', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-8 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Yearly Deposit</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={inputs.yearlyContribution || ''}
                    onChange={(e) => updateField('yearlyContribution', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-8 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Annual Step-Up (%)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="number"
                    value={inputs.contributionStepUpPercent || ''}
                    onChange={(e) => updateField('contributionStepUpPercent', Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 5.0"
                    className="w-full text-xs font-bold pl-8 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Custom Interval Contribution */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 space-y-3">
              <span className="text-[10px] font-bold text-neutral-450 uppercase">Custom Recurring Contribution</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400 font-bold text-[11px]">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      value={inputs.customContribution || ''}
                      onChange={(e) => updateField('customContribution', Math.max(0, Number(e.target.value)))}
                      placeholder="0"
                      className="w-full text-[11px] font-bold pl-6 pr-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-neutral-400 uppercase mb-1">Interval (Months)</label>
                  <input
                    type="number"
                    value={inputs.customContributionIntervalMonths || ''}
                    onChange={(e) => updateField('customContributionIntervalMonths', Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 6"
                    className="w-full text-[11px] font-bold px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 5. WITHDRAWALS (Section 5) */}
      <div className="space-y-2">
        {sectionHeader('withdrawals', '5. Withdrawals', <Clock className="w-4 h-4" />, 'Optional monthly, annual, or custom payouts')}
        {openSection === 'withdrawals' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('withdrawals')}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Monthly Cashout</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={inputs.monthlyWithdrawal || ''}
                    onChange={(e) => updateField('monthlyWithdrawal', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-8 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Annual Cashout</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={inputs.yearlyWithdrawal || ''}
                    onChange={(e) => updateField('yearlyWithdrawal', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-8 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Custom Withdrawals */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-450 uppercase">One-Time / Custom Cashouts</span>
                <button
                  type="button"
                  onClick={handleAddCustomWithdrawal}
                  className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Cashout
                </button>
              </div>

              {inputs.customWithdrawals.length === 0 ? (
                <p className="text-[10px] text-neutral-400 italic">No scheduled custom withdrawals configured.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {inputs.customWithdrawals.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5 p-3 rounded-xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[9px] font-bold text-neutral-400">Withdrawal #{idx+1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomWithdrawal(idx)}
                          className="text-rose-500 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[8px] font-bold text-neutral-450 mb-0.5">Month #</label>
                          <input
                            type="number"
                            value={item.month}
                            onChange={(e) => handleUpdateCustomWithdrawal(idx, 'month', Math.max(1, Number(e.target.value)))}
                            className="w-full text-xs font-bold px-2 py-1 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-neutral-450 mb-0.5">Amount</label>
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => handleUpdateCustomWithdrawal(idx, 'amount', Math.max(0, Number(e.target.value)))}
                            className="w-full text-xs font-bold px-2 py-1 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-neutral-450 mb-0.5">Label</label>
                          <input
                            type="text"
                            value={item.label || ''}
                            onChange={(e) => handleUpdateCustomWithdrawal(idx, 'label', e.target.value)}
                            placeholder="College, Car..."
                            className="w-full text-xs font-bold px-2 py-1 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* 6. DIVIDENDS (Section 6) */}
      <div className="space-y-2">
        {sectionHeader('dividends', '6. Dividend Yield', <Sparkles className="w-4 h-4" />, 'Optional dividend growth & reinvestment')}
        {openSection === 'dividends' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('dividends')}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Dividend Yield (%)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Percent className="w-3 h-3" />
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={inputs.dividendYield || ''}
                    onChange={(e) => updateField('dividendYield', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-7 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Div. Growth (%)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={inputs.dividendGrowth || ''}
                    onChange={(e) => updateField('dividendGrowth', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-8 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-905 p-3.5 rounded-xl border border-neutral-150 dark:border-neutral-800/60">
              <input
                type="checkbox"
                id="reinvest"
                checked={inputs.reinvestDividends}
                onChange={(e) => updateField('reinvestDividends', e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-blue-500/20"
              />
              <label htmlFor="reinvest" className="text-xs font-bold text-neutral-700 dark:text-neutral-300 select-none cursor-pointer">
                Reinvest Dividends (DRIP)
              </label>
            </div>

          </div>
        )}
      </div>

      {/* 7. TAXATION & INFLATION (Section 7 & 8) */}
      <div className="space-y-2">
        {sectionHeader('taxAndInflation', '7. Taxes & Inflation', <Shield className="w-4 h-4" />, 'Capital gains, wealth tax, and inflation purchasing power')}
        {openSection === 'taxAndInflation' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('taxAndInflation')}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Capital Gains Tax (%)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Percent className="w-3 h-3" />
                  </span>
                  <input
                    type="number"
                    value={inputs.capitalGainsTaxRate || ''}
                    onChange={(e) => updateField('capitalGainsTaxRate', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-7 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Dividend Tax (%)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Percent className="w-3 h-3" />
                  </span>
                  <input
                    type="number"
                    value={inputs.dividendTaxRate || ''}
                    onChange={(e) => updateField('dividendTaxRate', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-7 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Annual Wealth Tax (%)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Percent className="w-3 h-3" />
                  </span>
                  <input
                    type="number"
                    value={inputs.annualTaxRate || ''}
                    onChange={(e) => updateField('annualTaxRate', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-7 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Exit Flat Tax (%)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Percent className="w-3 h-3" />
                  </span>
                  <input
                    type="number"
                    value={inputs.exitTaxRate || ''}
                    onChange={(e) => updateField('exitTaxRate', Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full text-xs font-bold pl-7 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800/80 pt-3">
              <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Expected Inflation Rate (%)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Percent className="w-3 h-3" />
                </span>
                <input
                  type="number"
                  value={inputs.inflationRate || ''}
                  onChange={(e) => updateField('inflationRate', Number(e.target.value))}
                  placeholder="e.g. 3.0"
                  className="w-full text-xs font-bold pl-7 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 8. FEES (Section 9) */}
      <div className="space-y-2">
        {sectionHeader('fees', '8. Fees & Expense Drag', <Briefcase className="w-4 h-4" />, 'Broker fees, management expense ratio, platform charges')}
        {openSection === 'fees' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('fees')}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Broker Fee (%)</label>
                <input
                  type="number"
                  value={inputs.brokerFeePercent || ''}
                  onChange={(e) => updateField('brokerFeePercent', Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Expense Ratio (%)</label>
                <input
                  type="number"
                  value={inputs.expenseRatio || ''}
                  onChange={(e) => updateField('expenseRatio', Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Management Fee (%)</label>
                <input
                  type="number"
                  value={inputs.managementFeePercent || ''}
                  onChange={(e) => updateField('managementFeePercent', Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Flat Transaction Fee</label>
                <input
                  type="number"
                  value={inputs.transactionFee || ''}
                  onChange={(e) => updateField('transactionFee', Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Platform Fee (Mo.)</label>
                <input
                  type="number"
                  value={inputs.platformFeeMonthly || ''}
                  onChange={(e) => updateField('platformFeeMonthly', Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Performance Fee (%)</label>
                <input
                  type="number"
                  value={inputs.performanceFeePercent || ''}
                  onChange={(e) => updateField('performanceFeePercent', Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 9. RISK & VOLATILITY (Section 10) */}
      <div className="space-y-2">
        {sectionHeader('risk', '9. Risk & Volatility Band', <Activity className="w-4 h-4" />, 'Scenario projections, worst vs best cases')}
        {openSection === 'risk' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('risk')}
            <div>
              <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Risk Profile</label>
              <select
                value={inputs.riskLevel}
                onChange={(e) => {
                  const level = e.target.value as any;
                  let vol = 10;
                  if (level === 'low') vol = 5;
                  if (level === 'high') vol = 20;
                  setInputs(prev => ({
                    ...prev,
                    riskLevel: level,
                    volatility: vol
                  }));
                }}
                className="w-full text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white"
              >
                <option value="low">Low Risk (Safe bond-like return bands)</option>
                <option value="medium">Medium Risk (Balanced 60/40 allocation)</option>
                <option value="high">High Risk (Equities/Alternative heavy volatility)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Annual Volatility (%)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Percent className="w-3 h-3" />
                </span>
                <input
                  type="number"
                  value={inputs.volatility || ''}
                  onChange={(e) => updateField('volatility', Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. 15.0"
                  className="w-full text-xs font-bold pl-7 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white"
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 10. PORTFOLIO ALLOCATION (Section 12) */}
      <div className="space-y-2">
        {sectionHeader('portfolio', '10. Asset Portfolio allocation', <Coins className="w-4 h-4" />, 'Custom asset splits, diversification index')}
        {openSection === 'portfolio' && (
          <div className="p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl bg-white dark:bg-neutral-900/40 space-y-4">
            {renderClearSectionButton('portfolio')}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-450 uppercase">Asset Breakdown</span>
              <button
                type="button"
                onClick={handleAddAsset}
                className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Asset
              </button>
            </div>

            {inputs.assets.length === 0 ? (
              <p className="text-[10px] text-neutral-400 italic">No asset categories specified. Using a master single pool.</p>
            ) : (
              <div className="space-y-3">
                {inputs.assets.map((asset) => (
                  <div key={asset.id} className="p-3 border border-neutral-150 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/10 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <input
                        type="text"
                        value={asset.name}
                        onChange={(e) => handleUpdateAsset(asset.id, 'name', e.target.value)}
                        placeholder="Asset Name"
                        className="text-xs font-bold border-b border-neutral-200 dark:border-neutral-800 bg-transparent focus:outline-none focus:border-blue-500 py-0.5 text-neutral-800 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAsset(asset.id)}
                        className="text-rose-500 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[8px] font-bold text-neutral-400 mb-0.5">Allocation %</label>
                        <input
                          type="number"
                          value={asset.percentage}
                          onChange={(e) => handleUpdateAsset(asset.id, 'percentage', Math.max(0, Math.min(100, Number(e.target.value))))}
                          className="w-full text-xs font-bold px-2 py-1 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[8px] font-bold text-neutral-400 mb-0.5">Yield %</label>
                        <input
                          type="number"
                          value={asset.expectedReturn}
                          onChange={(e) => handleUpdateAsset(asset.id, 'expectedReturn', Number(e.target.value))}
                          className="w-full text-xs font-bold px-2 py-1 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-neutral-450 mb-0.5">Vol %</label>
                        <input
                          type="number"
                          value={asset.volatility}
                          onChange={(e) => handleUpdateAsset(asset.id, 'volatility', Math.max(0, Number(e.target.value)))}
                          className="w-full text-xs font-bold px-2 py-1 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Allocation validation badge */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-150 dark:border-neutral-800 text-xs font-bold">
                  <span className="text-neutral-500">Total Allocated:</span>
                  <span className={totalPortfolioAllocated === 100 ? 'text-emerald-500' : 'text-amber-500'}>
                    {totalPortfolioAllocated}% {totalPortfolioAllocated !== 100 && '(Recommended to equal 100%)'}
                  </span>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
