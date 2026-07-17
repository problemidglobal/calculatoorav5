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
  TrendingUp
} from 'lucide-react';
import { LoanInputs, ExtraPaymentEvent, VariableRateEvent } from '../utils/ultimateLoanMath';

interface UltimateLoanInputSectionsProps {
  inputs: LoanInputs;
  setInputs: React.Dispatch<React.SetStateAction<LoanInputs>>;
  onClearSection: (sectionId: string) => void;
}

export default function UltimateLoanInputSections({
  inputs,
  setInputs,
  onClearSection
}: UltimateLoanInputSectionsProps) {
  // Collapsible section states
  const [openSection, setOpenSection] = useState<string>('basic');

  const toggleSection = (sec: string) => {
    setOpenSection(p => p === sec ? '' : sec);
  };

  const updateField = (field: keyof LoanInputs, val: any) => {
    setInputs(prev => {
      const updated = { ...prev, [field]: val };

      // Synchronization for down payment
      if (field === 'downPayment') {
        const dpVal = val === '' ? 0 : Number(val);
        const total = prev.amount || 0;
        updated.downPaymentPercent = (total > 0 && val !== '') ? Number(((dpVal / total) * 100).toFixed(2)) : '';
      } else if (field === 'downPaymentPercent') {
        const dpPct = val === '' ? 0 : Number(val);
        const total = prev.amount || 0;
        updated.downPayment = (total > 0 && val !== '') ? Number(((dpPct / 100) * total).toFixed(2)) : '';
      } else if (field === 'amount') {
        // Recalculate down payment based on current percent
        const total = val === '' ? 0 : Number(val);
        const dpPct = prev.downPaymentPercent || 0;
        updated.downPayment = (total > 0 && prev.downPaymentPercent !== '') ? Number(((dpPct / 100) * total).toFixed(2)) : '';
      }

      return updated;
    });
  };

  // Helper for adding extra payment events
  const [extraPaymentType, setExtraPaymentType] = useState<'onetime' | 'monthly' | 'yearly'>('onetime');
  const [extraPaymentMonth, setExtraPaymentMonth] = useState<number | ''>('');
  const [extraPaymentAmount, setExtraPaymentAmount] = useState<number | ''>('');
  const [extraPaymentDesc, setExtraPaymentDesc] = useState<string>('Prepayment Event');

  const handleAddExtraPayment = () => {
    if (extraPaymentAmount === '' || extraPaymentMonth === '') return;
    if (Number(extraPaymentAmount) <= 0 || Number(extraPaymentMonth) <= 0) return;
    const newEvent: ExtraPaymentEvent = {
      id: Math.random().toString(36).substring(2, 9),
      type: extraPaymentType === 'onetime' ? 'onetime' : 'custom',
      month: Number(extraPaymentMonth),
      amount: Number(extraPaymentAmount),
      description: extraPaymentDesc
    };
    setInputs(prev => ({
      ...prev,
      extraPaymentsList: [...prev.extraPaymentsList, newEvent]
    }));
    setExtraPaymentAmount('');
    setExtraPaymentMonth('');
    setExtraPaymentDesc('Prepayment Event');
  };

  const handleRemoveExtraPayment = (id: string) => {
    setInputs(prev => ({
      ...prev,
      extraPaymentsList: prev.extraPaymentsList.filter(e => e.id !== id)
    }));
  };

  // Helper for adding variable interest rate events
  const [varRateMonth, setVarRateMonth] = useState<number | ''>('');
  const [varRatePct, setVarRatePct] = useState<number | ''>('');

  const handleAddVariableRate = () => {
    if (varRatePct === '' || varRateMonth === '') return;
    if (Number(varRatePct) <= 0 || Number(varRateMonth) <= 0) return;
    const newEvent: VariableRateEvent = {
      id: Math.random().toString(36).substring(2, 9),
      startMonth: Number(varRateMonth),
      rate: Number(varRatePct)
    };
    setInputs(prev => ({
      ...prev,
      variableRates: [...prev.variableRates, newEvent]
    }));
    setVarRateMonth('');
    setVarRatePct('');
  };

  const handleRemoveVariableRate = (id: string) => {
    setInputs(prev => ({
      ...prev,
      variableRates: prev.variableRates.filter(e => e.id !== id)
    }));
  };

  const activeHeaderClass = (sec: string) => 
    `w-full px-6 py-5 flex items-center justify-between text-left font-black transition-all duration-300 rounded-3xl border ${
      openSection === sec 
        ? 'bg-blue-600/5 dark:bg-cyan-500/5 text-blue-600 dark:text-cyan-400 border-blue-500/20 dark:border-cyan-500/20 shadow-sm' 
        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 dark:hover:border-cyan-400/50 text-neutral-800 dark:text-neutral-100'
    }`;

  const inputContainerClass = "space-y-1.5";
  const labelClass = "text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5";
  const inputClass = "w-full text-sm py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-cyan-400 transition";
  const selectClass = "w-full text-sm py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-cyan-400 transition";

  return (
    <div className="space-y-4 font-sans">
      
      {/* 1. BASIC INFORMATION SECTION */}
      <div className="rounded-3xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('basic')}
          className={activeHeaderClass('basic')}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${openSection === 'basic' ? 'bg-blue-600 text-white dark:bg-cyan-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Basic Information</h3>
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">Core parameters to establish the schedule</p>
            </div>
          </div>
          {openSection === 'basic' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {openSection === 'basic' && (
          <div className="p-6 bg-white/50 dark:bg-neutral-900/20 border-x border-b border-neutral-200 dark:border-neutral-800 rounded-b-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            
            <div className={inputContainerClass}>
              <label className={labelClass}>
                <DollarSign className="w-3.5 h-3.5" /> Loan Amount / Asset Value *
              </label>
              <input 
                type="number" 
                value={inputs.amount || ''} 
                onChange={(e) => updateField('amount', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 300000" 
                className={inputClass}
              />
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>Currency Symbol</label>
              <select 
                value={inputs.currency} 
                onChange={(e) => updateField('currency', e.target.value)}
                className={selectClass}
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="¥">JPY (¥)</option>
                <option value="₹">INR (₹)</option>
                <option value="A$">AUD (A$)</option>
                <option value="C$">CAD (C$)</option>
              </select>
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>
                <Percent className="w-3.5 h-3.5" /> Annual Interest Rate *
              </label>
              <input 
                type="number" 
                step="0.01"
                value={inputs.interestRate || ''} 
                onChange={(e) => updateField('interestRate', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 6.5" 
                className={inputClass}
              />
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>Interest Rate Type</label>
              <select 
                value={inputs.interestType} 
                onChange={(e) => updateField('interestType', e.target.value)}
                className={selectClass}
              >
                <option value="fixed">Fixed Rate</option>
                <option value="variable">Variable Rate</option>
                <option value="mixed">Mixed Interest Scheme</option>
              </select>
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>
                <Clock className="w-3.5 h-3.5" /> Term (Years) *
              </label>
              <input 
                type="number" 
                value={inputs.termYears || ''} 
                onChange={(e) => updateField('termYears', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Years" 
                className={inputClass}
              />
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>Term (Months)</label>
              <input 
                type="number" 
                value={inputs.termMonths || ''} 
                onChange={(e) => updateField('termMonths', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Months" 
                className={inputClass}
              />
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>
                <Calendar className="w-3.5 h-3.5" /> Start Date
              </label>
              <input 
                type="date" 
                value={inputs.startDate} 
                onChange={(e) => updateField('startDate', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>Payment Frequency</label>
              <select 
                value={inputs.paymentFrequency} 
                onChange={(e) => updateField('paymentFrequency', e.target.value)}
                className={selectClass}
              >
                <option value="monthly">Monthly</option>
                <option value="biweekly">Bi-weekly (26/yr)</option>
                <option value="weekly">Weekly (52/yr)</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>Compounding Frequency</label>
              <select 
                value={inputs.compoundingFrequency} 
                onChange={(e) => updateField('compoundingFrequency', e.target.value)}
                className={selectClass}
              >
                <option value="monthly">Compounded Monthly</option>
                <option value="quarterly">Compounded Quarterly</option>
                <option value="semiannual">Compounded Semiannually</option>
                <option value="annual">Compounded Annually</option>
                <option value="daily">Compounded Daily</option>
                <option value="continuous">Continuous Compounding</option>
              </select>
            </div>

            <div className="col-span-full border-t border-neutral-150 dark:border-neutral-800 pt-4 mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onClearSection('basic')}
                className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-rose-500/5 transition cursor-pointer select-none"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Section
              </button>
            </div>

          </div>
        )}
      </div>

      {/* 2. DOWN PAYMENT SECTION */}
      <div className="rounded-3xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('downpayment')}
          className={activeHeaderClass('downpayment')}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${openSection === 'downpayment' ? 'bg-blue-600 text-white dark:bg-cyan-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Down Payment</h3>
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">Calculate initial equity and Loan-to-Value (LTV)</p>
            </div>
          </div>
          {openSection === 'downpayment' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {openSection === 'downpayment' && (
          <div className="p-6 bg-white/50 dark:bg-neutral-900/20 border-x border-b border-neutral-200 dark:border-neutral-800 rounded-b-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
              <div className={inputContainerClass}>
                <label className={labelClass}>
                  Down Payment ({inputs.currency})
                </label>
                <input 
                  type="number" 
                  value={inputs.downPayment || ''} 
                  onChange={(e) => updateField('downPayment', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 60000" 
                  className={inputClass}
                />
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>
                  Down Payment %
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={inputs.downPaymentPercent || ''} 
                  onChange={(e) => updateField('downPaymentPercent', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 20" 
                  className={inputClass}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800/60 flex flex-wrap justify-between items-center text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="font-bold">Resulting Principal Loan:</span>
                <span className="font-mono text-sm font-black text-blue-600 dark:text-cyan-400">
                  {inputs.currency}{Math.max(0, inputs.amount - inputs.downPayment).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <span className="font-bold">Loan-to-Value (LTV):</span>
                <span className="font-mono text-sm font-black text-amber-600 dark:text-amber-400">
                  {(inputs.amount > 0 ? (Math.max(0, inputs.amount - inputs.downPayment) / inputs.amount) * 100 : 0).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800/60 pt-4 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onClearSection('downpayment')}
                className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-rose-500/5 transition cursor-pointer select-none"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Section
              </button>
            </div>

          </div>
        )}
      </div>

      {/* 3. LOAN FEES & CHARGES */}
      <div className="rounded-3xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('costs')}
          className={activeHeaderClass('costs')}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${openSection === 'costs' ? 'bg-blue-600 text-white dark:bg-cyan-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Loan Costs &amp; Fees</h3>
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">Processing, documentation, and origination charges</p>
            </div>
          </div>
          {openSection === 'costs' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {openSection === 'costs' && (
          <div className="p-6 bg-white/50 dark:bg-neutral-900/20 border-x border-b border-neutral-200 dark:border-neutral-800 rounded-b-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            
            <div className="space-y-2">
              <label className={labelClass}>Processing Fee</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={inputs.processingFee || ''} 
                  onChange={(e) => updateField('processingFee', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Value" 
                  className="flex-1 text-sm py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                />
                <select 
                  value={inputs.processingFeeType} 
                  onChange={(e) => updateField('processingFeeType', e.target.value)}
                  className="w-20 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="fixed">Fixed</option>
                  <option value="percent">%</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Origination Fee</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={inputs.originationFee || ''} 
                  onChange={(e) => updateField('originationFee', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Value" 
                  className="flex-1 text-sm py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                />
                <select 
                  value={inputs.originationFeeType} 
                  onChange={(e) => updateField('originationFeeType', e.target.value)}
                  className="w-20 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="fixed">Fixed</option>
                  <option value="percent">%</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Stamp Duty</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={inputs.stampDuty || ''} 
                  onChange={(e) => updateField('stampDuty', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Value" 
                  className="flex-1 text-sm py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                />
                <select 
                  value={inputs.stampDutyType} 
                  onChange={(e) => updateField('stampDutyType', e.target.value)}
                  className="w-20 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="fixed">Fixed</option>
                  <option value="percent">%</option>
                </select>
              </div>
            </div>

            <div className="col-span-full border-t border-neutral-150 dark:border-neutral-800 pt-4 mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onClearSection('costs')}
                className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-rose-500/5 transition cursor-pointer select-none"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Section
              </button>
            </div>

          </div>
        )}
      </div>

      {/* 4. INSURANCE & PROTECTION */}
      <div className="rounded-3xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('insurance')}
          className={activeHeaderClass('insurance')}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${openSection === 'insurance' ? 'bg-blue-600 text-white dark:bg-cyan-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Insurance &amp; Protection</h3>
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">Mortgage insurance, life protection, and property rates</p>
            </div>
          </div>
          {openSection === 'insurance' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {openSection === 'insurance' && (
          <div className="p-6 bg-white/50 dark:bg-neutral-900/20 border-x border-b border-neutral-200 dark:border-neutral-800 rounded-b-3xl grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            <div className="space-y-2">
              <label className={labelClass}>Mortgage Insurance (PMI)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={inputs.mortgageInsurance || ''} 
                  onChange={(e) => updateField('mortgageInsurance', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Insurance cost" 
                  className="flex-1 text-sm py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                />
                <select 
                  value={inputs.mortgageInsuranceType} 
                  onChange={(e) => updateField('mortgageInsuranceType', e.target.value)}
                  className="w-28 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="onetime">One Time</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Property / Home Insurance</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={inputs.propertyInsurance || ''} 
                  onChange={(e) => updateField('propertyInsurance', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Insurance cost" 
                  className="flex-1 text-sm py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                />
                <select 
                  value={inputs.propertyInsuranceType} 
                  onChange={(e) => updateField('propertyInsuranceType', e.target.value)}
                  className="w-28 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="onetime">One Time</option>
                </select>
              </div>
            </div>

            <div className="col-span-full border-t border-neutral-150 dark:border-neutral-800 pt-4 mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onClearSection('insurance')}
                className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-rose-500/5 transition cursor-pointer select-none"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Section
              </button>
            </div>

          </div>
        )}
      </div>

      {/* 5. TAXES & LEVIES */}
      <div className="rounded-3xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('taxes')}
          className={activeHeaderClass('taxes')}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${openSection === 'taxes' ? 'bg-blue-600 text-white dark:bg-cyan-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Taxes &amp; Levies</h3>
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">Property tax and other localized state duties</p>
            </div>
          </div>
          {openSection === 'taxes' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {openSection === 'taxes' && (
          <div className="p-6 bg-white/50 dark:bg-neutral-900/20 border-x border-b border-neutral-200 dark:border-neutral-800 rounded-b-3xl">
            <div className="space-y-2 max-w-md">
              <label className={labelClass}>Property Tax</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={inputs.propertyTax || ''} 
                  onChange={(e) => updateField('propertyTax', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Tax cost" 
                  className="flex-1 text-sm py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                />
                <select 
                  value={inputs.propertyTaxType} 
                  onChange={(e) => updateField('propertyTaxType', e.target.value)}
                  className="w-28 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="onetime">One Time</option>
                </select>
              </div>
            </div>

            <div className="border-t border-neutral-150 dark:border-neutral-800 pt-4 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onClearSection('taxes')}
                className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-rose-500/5 transition cursor-pointer select-none"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Section
              </button>
            </div>

          </div>
        )}
      </div>

      {/* 6. EXTRA PAYMENTS */}
      <div className="rounded-3xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('extrapayments')}
          className={activeHeaderClass('extrapayments')}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${openSection === 'extrapayments' ? 'bg-blue-600 text-white dark:bg-cyan-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Extra Payments</h3>
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">Accelerate payoff and track total interest savings</p>
            </div>
          </div>
          {openSection === 'extrapayments' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {openSection === 'extrapayments' && (
          <div className="p-6 bg-white/50 dark:bg-neutral-900/20 border-x border-b border-neutral-200 dark:border-neutral-800 rounded-b-3xl space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className={inputContainerClass}>
                <label className={labelClass}>Regular Extra Payment (Monthly)</label>
                <input 
                  type="number" 
                  value={inputs.extraMonthly || ''} 
                  onChange={(e) => updateField('extraMonthly', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 100" 
                  className={inputClass}
                />
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>Regular Extra Payment (Yearly)</label>
                <input 
                  type="number" 
                  value={inputs.extraYearly || ''} 
                  onChange={(e) => updateField('extraYearly', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 1200" 
                  className={inputClass}
                />
              </div>
            </div>

            {/* Custom Payment Schedule Events */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850 space-y-4">
              <h4 className="text-xs font-bold text-neutral-800 dark:text-white uppercase tracking-wider">Custom Prepayment Calendar</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/45 border border-neutral-150 dark:border-neutral-800">
                <div className={inputContainerClass}>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Frequency</label>
                  <select 
                    value={extraPaymentType} 
                    onChange={(e: any) => setExtraPaymentType(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800"
                  >
                    <option value="onetime">One-Time</option>
                  </select>
                </div>

                <div className={inputContainerClass}>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Month Index (1-based)</label>
                  <input 
                    type="number" 
                    value={extraPaymentMonth} 
                    onChange={(e) => setExtraPaymentMonth(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 12"
                    className="w-full text-xs p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800"
                  />
                </div>

                <div className={inputContainerClass}>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Amount ({inputs.currency})</label>
                  <input 
                    type="number" 
                    value={extraPaymentAmount} 
                    onChange={(e) => setExtraPaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 1000"
                    className="w-full text-xs p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800"
                  />
                </div>

                <button 
                  onClick={handleAddExtraPayment}
                  disabled={extraPaymentMonth === '' || extraPaymentAmount === '' || Number(extraPaymentMonth) <= 0 || Number(extraPaymentAmount) <= 0}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 h-10 select-none ${
                    (extraPaymentMonth === '' || extraPaymentAmount === '' || Number(extraPaymentMonth) <= 0 || Number(extraPaymentAmount) <= 0)
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-650 cursor-not-allowed border border-neutral-300 dark:border-neutral-750' 
                      : 'bg-neutral-900 hover:bg-blue-600 hover:text-white dark:bg-neutral-850 cursor-pointer text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Prepayment
                </button>
              </div>

              {inputs.extraPaymentsList.length > 0 && (
                <div className="mt-3 space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Active Scheduled Events ({inputs.extraPaymentsList.length})</span>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2">
                    {inputs.extraPaymentsList.map((evt) => (
                      <div key={evt.id} className="p-3 flex justify-between items-center bg-white dark:bg-neutral-900/30 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
                        <div>
                          <span className="font-bold text-neutral-700 dark:text-neutral-300">Month {evt.month} Prepayment:</span>
                          <span className="font-mono ml-1 text-blue-600 dark:text-cyan-400 font-bold">{inputs.currency}{evt.amount.toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveExtraPayment(evt.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-neutral-150 dark:border-neutral-800 pt-4 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onClearSection('extrapayments')}
                className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-rose-500/5 transition cursor-pointer select-none"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Section
              </button>
            </div>

          </div>
        )}
      </div>

      {/* 7. ADVANCED SETTINGS */}
      <div className="rounded-3xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('advanced')}
          className={activeHeaderClass('advanced')}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${openSection === 'advanced' ? 'bg-blue-600 text-white dark:bg-cyan-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Advanced Options</h3>
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">Grace periods, Balloon payouts, variable rate planners</p>
            </div>
          </div>
          {openSection === 'advanced' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {openSection === 'advanced' && (
          <div className="p-6 bg-white/50 dark:bg-neutral-900/20 border-x border-b border-neutral-200 dark:border-neutral-800 rounded-b-3xl space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              <div className={inputContainerClass}>
                <label className={labelClass}>Grace Period (Months)</label>
                <input 
                  type="number" 
                  value={inputs.gracePeriod || ''} 
                  onChange={(e) => updateField('gracePeriod', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 6" 
                  className={inputClass}
                />
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>Grace Period Type</label>
                <select 
                  value={inputs.graceType} 
                  onChange={(e) => updateField('graceType', e.target.value)}
                  className={selectClass}
                >
                  <option value="interest-only">Interest Only</option>
                  <option value="deferred">Deferred (No payments, capitalized)</option>
                </select>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>Balloon Payment ({inputs.currency})</label>
                <input 
                  type="number" 
                  value={inputs.balloonPayment || ''} 
                  onChange={(e) => updateField('balloonPayment', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Final chunk" 
                  className={inputClass}
                />
              </div>

            </div>

            {/* Variable Rate Planners */}
            {inputs.interestType !== 'fixed' && (
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850 space-y-4">
                <div className="flex items-center gap-1 text-xs font-bold text-neutral-850 dark:text-white uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Variable Interest Planner
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
                  <div className={inputContainerClass}>
                    <label className="text-[10px] font-bold text-neutral-400">Starts at Month Index</label>
                    <input 
                      type="number" 
                      value={varRateMonth} 
                      onChange={(e) => setVarRateMonth(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 36"
                      className="w-full text-xs p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800"
                    />
                  </div>

                  <div className={inputContainerClass}>
                    <label className="text-[10px] font-bold text-neutral-400">New Interest Rate (%)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={varRatePct} 
                      onChange={(e) => setVarRatePct(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 6.5"
                      className="w-full text-xs p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800"
                    />
                  </div>

                  <button 
                    onClick={handleAddVariableRate}
                    disabled={varRateMonth === '' || varRatePct === '' || Number(varRateMonth) <= 0 || Number(varRatePct) <= 0}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 h-10 select-none ${
                      (varRateMonth === '' || varRatePct === '' || Number(varRateMonth) <= 0 || Number(varRatePct) <= 0)
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-650 cursor-not-allowed border border-neutral-300 dark:border-neutral-750'
                        : 'bg-neutral-900 hover:bg-blue-600 hover:text-white dark:bg-neutral-850 cursor-pointer text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Rate Shift
                  </button>
                </div>

                {inputs.variableRates.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">Active Variable Rate Modifications ({inputs.variableRates.length})</span>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2">
                      {inputs.variableRates.map((evt) => (
                        <div key={evt.id} className="p-3 flex justify-between items-center bg-white dark:bg-neutral-900/30 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
                          <div>
                            <span className="font-bold text-neutral-700 dark:text-neutral-300">From Month {evt.startMonth}:</span>
                            <span className="font-mono ml-1.5 text-amber-500 font-bold">{evt.rate}% APR</span>
                          </div>
                          <button 
                            onClick={() => handleRemoveVariableRate(evt.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-neutral-150 dark:border-neutral-800 pt-4 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onClearSection('advanced')}
                className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-rose-500/5 transition cursor-pointer select-none"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Section
              </button>
            </div>

          </div>
        )}
      </div>

      {/* 8. INFLATION SETTINGS */}
      <div className="rounded-3xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection('inflation')}
          className={activeHeaderClass('inflation')}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${openSection === 'inflation' ? 'bg-blue-600 text-white dark:bg-cyan-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Inflation Adjustments</h3>
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">Model nominal costs vs. real inflation-discounted costs</p>
            </div>
          </div>
          {openSection === 'inflation' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {openSection === 'inflation' && (
          <div className="p-6 bg-white/50 dark:bg-neutral-900/20 border-x border-b border-neutral-200 dark:border-neutral-800 rounded-b-3xl">
            <div className={inputContainerClass + " max-w-sm"}>
              <label className={labelClass}>Expected Annual Inflation Rate (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={inputs.inflationRate || ''} 
                onChange={(e) => updateField('inflationRate', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 3.0" 
                className={inputClass}
              />
              <p className="text-[10px] text-neutral-400 leading-relaxed mt-1">
                Calculates the real buying power of future cash-outlays by discounting each payment dynamically using the inflation compound formula.
              </p>
            </div>

            <div className="border-t border-neutral-150 dark:border-neutral-800 pt-4 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onClearSection('inflation')}
                className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-rose-500/5 transition cursor-pointer select-none"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Section
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
