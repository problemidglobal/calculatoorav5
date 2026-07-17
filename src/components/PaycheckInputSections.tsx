import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  HelpCircle, 
  Calendar, 
  Percent, 
  DollarSign, 
  User, 
  Clock, 
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PaycheckInputs, CustomDeduction } from '../utils/paycheckMath';

interface PaycheckInputSectionsProps {
  inputs: PaycheckInputs;
  setInputs: React.Dispatch<React.SetStateAction<PaycheckInputs>>;
  onClear: () => void;
  onLoadDemo: () => void;
}

export default function PaycheckInputSections({
  inputs,
  setInputs,
  onClear,
  onLoadDemo
}: PaycheckInputSectionsProps) {
  // Local state for the "Add Custom Deduction" mini form
  const [newDedLabel, setNewDedLabel] = useState('');
  const [newDedType, setNewDedType] = useState<'fixed' | 'percent'>('fixed');
  const [newDedValue, setNewDedValue] = useState('');
  const [newDedIsPreTax, setNewDedIsPreTax] = useState(true);

  // Accordion state
  const [openSection, setOpenSection] = useState<string>('basic');

  const toggleSection = (sec: string) => {
    setOpenSection(openSection === sec ? '' : sec);
  };

  const handleInputChange = (field: keyof PaycheckInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Deduction handlers
  const handleAddDeduction = () => {
    if (!newDedLabel.trim()) return;
    const val = Number(newDedValue) || 0;
    
    const newDed: CustomDeduction = {
      id: Math.random().toString(36).substr(2, 9),
      label: newDedLabel.trim(),
      type: newDedType,
      value: val,
      isPreTax: newDedIsPreTax
    };

    setInputs(prev => ({
      ...prev,
      deductions: [...prev.deductions, newDed]
    }));

    // Reset local inputs
    setNewDedLabel('');
    setNewDedValue('');
  };

  const handleQuickAddDeduction = (label: string, type: 'fixed' | 'percent', isPreTax: boolean, defaultVal: number) => {
    const newDed: CustomDeduction = {
      id: Math.random().toString(36).substr(2, 9),
      label,
      type,
      value: defaultVal,
      isPreTax
    };
    setInputs(prev => ({
      ...prev,
      deductions: [...prev.deductions, newDed]
    }));
  };

  const handleDeleteDeduction = (id: string) => {
    setInputs(prev => ({
      ...prev,
      deductions: prev.deductions.filter(d => d.id !== id)
    }));
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions (Demo Dataset & Clear) */}
      <div className="flex justify-between gap-3 bg-neutral-100/80 dark:bg-neutral-800/40 p-2.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/30">
        <button
          id="btn-load-demo-paycheck"
          type="button"
          onClick={onLoadDemo}
          className="flex-1 py-1.5 px-3 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-blue-600 dark:text-cyan-400 font-black text-[11px] rounded-xl border border-neutral-250 dark:border-neutral-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          Load Demo Paycheck
        </button>
        <button
          id="btn-clear-paycheck"
          type="button"
          onClick={onClear}
          className="flex-1 py-1.5 px-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-900 text-rose-500 font-black text-[11px] rounded-xl border border-neutral-250 dark:border-neutral-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All Fields
        </button>
      </div>

      {/* 1. Earning Method & Base Pay Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-150 dark:border-neutral-800 overflow-hidden shadow-sm">
        <button
          id="header-section-basic"
          onClick={() => toggleSection('basic')}
          className="w-full px-5 py-4 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-950/20 hover:bg-neutral-100/30 dark:hover:bg-neutral-950/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
              <DollarSign className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-wider">
              1. Earning Method & Pay
            </span>
          </div>
          {openSection === 'basic' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {openSection === 'basic' && (
          <div className="p-5 space-y-4 animate-slideDown">
            {/* Choose Earning Method */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Earning Method <span className="text-red-500 font-extrabold">*</span>
              </label>
              <select
                id="select-earning-method"
                value={inputs.earningMethod}
                onChange={(e) => handleInputChange('earningMethod', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="hourly">Hourly Pay</option>
                <option value="salary">Salary (per period)</option>
                <option value="daily">Daily Pay</option>
                <option value="weekly">Weekly Pay</option>
                <option value="monthly">Monthly Pay</option>
                <option value="annual">Annual Salary</option>
                <option value="commission">Commission Only</option>
                <option value="freelance">Freelance / Contract</option>
              </select>
            </div>

            {/* Choose Pay Frequency */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Pay Frequency <span className="text-red-500 font-extrabold">*</span>
              </label>
              <select
                id="select-pay-frequency"
                value={inputs.payFrequency}
                onChange={(e) => handleInputChange('payFrequency', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly (Every 2 Weeks)</option>
                <option value="semimonthly">Semi-Monthly (Twice a Month)</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly (Annually)</option>
              </select>
            </div>

            {/* Conditional Required Input Fields based on Earning Method */}
            {inputs.earningMethod === 'hourly' && (
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Hourly Wage ($)
                  </label>
                  <input
                    id="input-hourly-rate"
                    type="number"
                    placeholder="e.g. 25"
                    value={inputs.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Hours Worked
                  </label>
                  <input
                    id="input-hours-worked"
                    type="number"
                    placeholder="e.g. 40"
                    value={inputs.hoursWorked}
                    onChange={(e) => handleInputChange('hoursWorked', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {inputs.earningMethod === 'salary' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Base Salary per Pay Period ($)
                </label>
                <input
                  id="input-base-salary"
                  type="number"
                  placeholder="e.g. 3000"
                  value={inputs.baseSalary}
                  onChange={(e) => handleInputChange('baseSalary', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            {inputs.earningMethod === 'daily' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Daily Rate ($)
                  </label>
                  <input
                    id="input-daily-rate"
                    type="number"
                    placeholder="e.g. 200"
                    value={inputs.dailyRate}
                    onChange={(e) => handleInputChange('dailyRate', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Days Worked
                  </label>
                  <input
                    id="input-days-worked"
                    type="number"
                    placeholder="e.g. 10"
                    value={inputs.daysWorked}
                    onChange={(e) => handleInputChange('daysWorked', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {inputs.earningMethod === 'weekly' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Weekly Rate ($)
                </label>
                <input
                  id="input-weekly-rate"
                  type="number"
                  placeholder="e.g. 1200"
                  value={inputs.weeklyRate}
                  onChange={(e) => handleInputChange('weeklyRate', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            {inputs.earningMethod === 'monthly' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Monthly Rate ($)
                </label>
                <input
                  id="input-monthly-rate"
                  type="number"
                  placeholder="e.g. 5000"
                  value={inputs.monthlyRate}
                  onChange={(e) => handleInputChange('monthlyRate', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            {inputs.earningMethod === 'annual' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Annual Salary ($)
                </label>
                <input
                  id="input-annual-salary"
                  type="number"
                  placeholder="e.g. 85000"
                  value={inputs.annualSalary}
                  onChange={(e) => handleInputChange('annualSalary', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            {inputs.earningMethod === 'commission' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Total Sales Sold ($)
                  </label>
                  <input
                    id="input-commission-sales"
                    type="number"
                    placeholder="e.g. 50000"
                    value={inputs.totalSales}
                    onChange={(e) => handleInputChange('totalSales', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Commission Rate (%)
                  </label>
                  <input
                    id="input-commission-rate"
                    type="number"
                    placeholder="e.g. 5"
                    value={inputs.commissionRate}
                    onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-neutral-400">
                    Plus Base / Flat Commission Component ($)
                  </label>
                  <input
                    id="input-gross-commission"
                    type="number"
                    placeholder="e.g. 1000"
                    value={inputs.grossCommission}
                    onChange={(e) => handleInputChange('grossCommission', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {inputs.earningMethod === 'freelance' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Contract / Project Rate ($)
                </label>
                <input
                  id="input-project-rate"
                  type="number"
                  placeholder="e.g. 4500"
                  value={inputs.projectRate}
                  onChange={(e) => handleInputChange('projectRate', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Overtime Multipliers (Primarily Hourly but visible to all) */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-150 dark:border-neutral-800 overflow-hidden shadow-sm">
        <button
          id="header-section-overtime"
          onClick={() => toggleSection('overtime')}
          className="w-full px-5 py-4 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-950/20 hover:bg-neutral-100/30 dark:hover:bg-neutral-950/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-500">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-wider">
              2. Overtime (Optional)
            </span>
          </div>
          {openSection === 'overtime' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {openSection === 'overtime' && (
          <div className="p-5 space-y-4 animate-slideDown">
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-normal">
              Based on your Hourly Wage (or Derived Hourly Rate).
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Regular OT */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                  Regular OT (1.5x) Hrs
                </label>
                <input
                  id="input-ot-hours"
                  type="number"
                  placeholder="e.g. 5"
                  value={inputs.overtimeHours}
                  onChange={(e) => handleInputChange('overtimeHours', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                  Multiplier
                </label>
                <input
                  id="input-ot-mult"
                  type="number"
                  placeholder="1.5"
                  value={inputs.overtimeMultiplier}
                  onChange={(e) => handleInputChange('overtimeMultiplier', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                />
              </div>

              {/* Double OT */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                  Double OT (2.0x) Hrs
                </label>
                <input
                  id="input-double-ot-hours"
                  type="number"
                  placeholder="e.g. 2"
                  value={inputs.doubleOvertimeHours}
                  onChange={(e) => handleInputChange('doubleOvertimeHours', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                  Multiplier
                </label>
                <input
                  id="input-double-ot-mult"
                  type="number"
                  placeholder="2.0"
                  value={inputs.doubleOvertimeMultiplier}
                  onChange={(e) => handleInputChange('doubleOvertimeMultiplier', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                />
              </div>

              {/* Triple OT */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                  Triple OT (3.0x) Hrs
                </label>
                <input
                  id="input-triple-ot-hours"
                  type="number"
                  placeholder="e.g. 1"
                  value={inputs.tripleOvertimeHours}
                  onChange={(e) => handleInputChange('tripleOvertimeHours', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                  Multiplier
                </label>
                <input
                  id="input-triple-ot-mult"
                  type="number"
                  placeholder="3.0"
                  value={inputs.tripleOvertimeMultiplier}
                  onChange={(e) => handleInputChange('tripleOvertimeMultiplier', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                />
              </div>

              {/* Custom Overtime */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                  Custom OT Hrs
                </label>
                <input
                  id="input-custom-ot-hours"
                  type="number"
                  placeholder="e.g. 3"
                  value={inputs.customOvertimeHours}
                  onChange={(e) => handleInputChange('customOvertimeHours', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                  Custom Multiplier
                </label>
                <input
                  id="input-custom-ot-mult"
                  type="number"
                  placeholder="e.g. 2.5"
                  value={inputs.customOvertimeMultiplier}
                  onChange={(e) => handleInputChange('customOvertimeMultiplier', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Optional Earnings / Allowances */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-150 dark:border-neutral-800 overflow-hidden shadow-sm">
        <button
          id="header-section-additions"
          onClick={() => toggleSection('additions')}
          className="w-full px-5 py-4 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-950/20 hover:bg-neutral-100/30 dark:hover:bg-neutral-950/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500">
              <Plus className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-wider">
              3. Bonuses & Allowances
            </span>
          </div>
          {openSection === 'additions' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {openSection === 'additions' && (
          <div className="p-5 space-y-4 animate-slideDown">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Bonus ($)</label>
                <input
                  id="add-bonus"
                  type="number"
                  placeholder="e.g. 500"
                  value={inputs.bonus}
                  onChange={(e) => handleInputChange('bonus', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Commission ($)</label>
                <input
                  id="add-commission"
                  type="number"
                  placeholder="e.g. 350"
                  value={inputs.commission}
                  onChange={(e) => handleInputChange('commission', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Tips ($)</label>
                <input
                  id="add-tips"
                  type="number"
                  placeholder="e.g. 150"
                  value={inputs.tips}
                  onChange={(e) => handleInputChange('tips', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Holiday Pay ($)</label>
                <input
                  id="add-holiday"
                  type="number"
                  placeholder="e.g. 200"
                  value={inputs.holidayPay}
                  onChange={(e) => handleInputChange('holidayPay', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800/60 pt-4 space-y-4">
              <span className="block text-[11px] font-black text-neutral-400 uppercase tracking-widest">Allowances & Benefits</span>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Night Shift ($)</label>
                  <input
                    id="add-night"
                    type="number"
                    placeholder="e.g. 75"
                    value={inputs.nightShiftAllowance}
                    onChange={(e) => handleInputChange('nightShiftAllowance', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Weekend ($)</label>
                  <input
                    id="add-weekend"
                    type="number"
                    placeholder="e.g. 120"
                    value={inputs.weekendAllowance}
                    onChange={(e) => handleInputChange('weekendAllowance', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Travel ($)</label>
                  <input
                    id="add-travel"
                    type="number"
                    placeholder="e.g. 100"
                    value={inputs.travelAllowance}
                    onChange={(e) => handleInputChange('travelAllowance', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Meal ($)</label>
                  <input
                    id="add-meal"
                    type="number"
                    placeholder="e.g. 80"
                    value={inputs.mealAllowance}
                    onChange={(e) => handleInputChange('mealAllowance', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Housing ($)</label>
                  <input
                    id="add-housing"
                    type="number"
                    placeholder="e.g. 400"
                    value={inputs.housingAllowance}
                    onChange={(e) => handleInputChange('housingAllowance', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Medical ($)</label>
                  <input
                    id="add-medical"
                    type="number"
                    placeholder="e.g. 150"
                    value={inputs.medicalAllowance}
                    onChange={(e) => handleInputChange('medicalAllowance', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Education ($)</label>
                  <input
                    id="add-education"
                    type="number"
                    placeholder="e.g. 200"
                    value={inputs.educationAllowance}
                    onChange={(e) => handleInputChange('educationAllowance', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Performance ($)</label>
                  <input
                    id="add-perf"
                    type="number"
                    placeholder="e.g. 300"
                    value={inputs.performanceIncentive}
                    onChange={(e) => handleInputChange('performanceIncentive', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Stock Comp ($)</label>
                  <input
                    id="add-stock"
                    type="number"
                    placeholder="e.g. 1000"
                    value={inputs.stockCompensation}
                    onChange={(e) => handleInputChange('stockCompensation', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Other ($)</label>
                  <input
                    id="add-other"
                    type="number"
                    placeholder="e.g. 50"
                    value={inputs.otherEarnings}
                    onChange={(e) => handleInputChange('otherEarnings', e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 4. Custom Deductions Panel (Unlimited) */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-150 dark:border-neutral-800 overflow-hidden shadow-sm">
        <button
          id="header-section-deductions"
          onClick={() => toggleSection('deductions')}
          className="w-full px-5 py-4 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-950/20 hover:bg-neutral-100/30 dark:hover:bg-neutral-950/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-500/10 rounded-lg text-rose-500">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-wider">
              4. Deductions ({inputs.deductions.length})
            </span>
          </div>
          {openSection === 'deductions' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {openSection === 'deductions' && (
          <div className="p-5 space-y-4 animate-slideDown">
            {/* Quick-add templates */}
            <div className="space-y-2">
              <span className="block text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
                Quick-Add Common Benefits
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Retirement (401k)', type: 'percent', preTax: true, val: 5 },
                  { label: 'Health Insurance', type: 'fixed', preTax: true, val: 120 },
                  { label: 'Dental Insurance', type: 'fixed', preTax: true, val: 25 },
                  { label: 'Vision Insurance', type: 'fixed', preTax: true, val: 15 },
                  { label: 'Union Dues', type: 'fixed', preTax: false, val: 30 },
                  { label: 'Charity Contribution', type: 'fixed', preTax: false, val: 10 }
                ].map((tpl, i) => (
                  <button
                    key={i}
                    id={`quick-ded-${i}`}
                    type="button"
                    onClick={() => handleQuickAddDeduction(tpl.label, tpl.type as any, tpl.preTax, tpl.val)}
                    className="text-[10px] font-bold py-1 px-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 transition cursor-pointer"
                  >
                    + {tpl.label} ({tpl.type === 'percent' ? `${tpl.val}%` : `$${tpl.val}`})
                  </button>
                ))}
              </div>
            </div>

            {/* List of current deductions */}
            {inputs.deductions.length > 0 ? (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {inputs.deductions.map((ded) => (
                  <div
                    key={ded.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/20 text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{ded.label}</span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        {ded.isPreTax ? 'Pre-Tax' : 'Post-Tax'} &bull; {ded.type === 'percent' ? `${ded.value}%` : `$${ded.value}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteDeduction(ded.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-500 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                      title="Delete deduction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center border-2 border-dashed border-neutral-150 dark:border-neutral-800 rounded-xl">
                <span className="text-xs text-neutral-400 font-medium">No custom deductions loaded yet.</span>
              </div>
            )}

            {/* Deduction Mini Form */}
            <div className="p-4 rounded-xl border border-neutral-205 dark:border-neutral-800 bg-neutral-50/20 dark:bg-neutral-950/20 space-y-3">
              <span className="block text-[10px] font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                Create User-Defined Deduction
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Deduction Label</label>
                  <input
                    id="ded-label-input"
                    type="text"
                    placeholder="e.g. Loan Repayment, Charity"
                    value={newDedLabel}
                    onChange={(e) => setNewDedLabel(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Calculation Type</label>
                  <select
                    id="ded-type-select"
                    value={newDedType}
                    onChange={(e) => setNewDedType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none"
                  >
                    <option value="fixed">Fixed Amount ($)</option>
                    <option value="percent">Percentage (%)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Amount / Rate</label>
                  <input
                    id="ded-value-input"
                    type="number"
                    placeholder="e.g. 50"
                    value={newDedValue}
                    onChange={(e) => setNewDedValue(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-4 pt-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Tax Treatment:</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1 text-xs cursor-pointer select-none text-neutral-600 dark:text-neutral-300">
                      <input
                        type="radio"
                        name="dedPreTax"
                        checked={newDedIsPreTax}
                        onChange={() => setNewDedIsPreTax(true)}
                        className="text-blue-600 focus:ring-0"
                      />
                      Pre-Tax
                    </label>
                    <label className="flex items-center gap-1 text-xs cursor-pointer select-none text-neutral-600 dark:text-neutral-300">
                      <input
                        type="radio"
                        name="dedPreTax"
                        checked={!newDedIsPreTax}
                        onChange={() => setNewDedIsPreTax(false)}
                        className="text-blue-600 focus:ring-0"
                      />
                      Post-Tax
                    </label>
                  </div>
                </div>
              </div>

              <button
                id="btn-add-deduction"
                type="button"
                onClick={handleAddDeduction}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save Deduction to Paycheck</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Estimated Taxes & Work Schedule (Accordions) */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-150 dark:border-neutral-800 overflow-hidden shadow-sm">
        <button
          id="header-section-taxes"
          onClick={() => toggleSection('taxes')}
          className="w-full px-5 py-4 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-950/20 hover:bg-neutral-100/30 dark:hover:bg-neutral-950/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-500">
              <Percent className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-wider">
              5. Taxes & Work Schedule
            </span>
          </div>
          {openSection === 'taxes' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {openSection === 'taxes' && (
          <div className="p-5 space-y-4 animate-slideDown">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Estimated Total Income Tax Rate (%)
              </label>
              <input
                id="estimated-tax-rate"
                type="number"
                placeholder="e.g. 15"
                value={inputs.estimatedTaxRate}
                onChange={(e) => handleInputChange('estimatedTaxRate', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none"
              />
              <span className="text-[10px] text-neutral-400 leading-normal block">
                Calculates an automatic tax withholding deduction based on your taxable income.
              </span>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-3">
              <span className="block text-[11px] font-black text-neutral-400 uppercase tracking-widest">
                Custom Work Schedule (Optional Conversions)
              </span>
              <p className="text-[10px] text-neutral-400 leading-normal">
                Configures standard working durations. Leaves standard default constants active if empty.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500">Hours per Day</label>
                  <input
                    id="sched-hours-day"
                    type="number"
                    placeholder="e.g. 8"
                    value={inputs.hoursPerDay}
                    onChange={(e) => handleInputChange('hoursPerDay', e.target.value)}
                    className="w-full text-[11px] p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500">Days per Week</label>
                  <input
                    id="sched-days-week"
                    type="number"
                    placeholder="e.g. 5"
                    value={inputs.daysPerWeek}
                    onChange={(e) => handleInputChange('daysPerWeek', e.target.value)}
                    className="w-full text-[11px] p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500">Weeks per Year</label>
                  <input
                    id="sched-weeks-year"
                    type="number"
                    placeholder="e.g. 52"
                    value={inputs.weeksPerYear}
                    onChange={(e) => handleInputChange('weeksPerYear', e.target.value)}
                    className="w-full text-[11px] p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500">Days per Month</label>
                  <input
                    id="sched-days-month"
                    type="number"
                    placeholder="e.g. 21.67"
                    value={inputs.workDaysPerMonth}
                    onChange={(e) => handleInputChange('workDaysPerMonth', e.target.value)}
                    className="w-full text-[11px] p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
