import React, { useState } from 'react';
import { 
  Car, 
  Coins, 
  Percent, 
  Calendar, 
  DollarSign, 
  ShieldAlert, 
  Sparkles, 
  Plus, 
  X, 
  HelpCircle,
  PiggyBank,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { CarLoanInputs, ExtraPaymentEvent, CustomRateEvent, computeNetTradeIn } from '../utils/carLoanMath';

interface CarLoanInputSectionsProps {
  inputs: CarLoanInputs;
  setInputs: React.Dispatch<React.SetStateAction<CarLoanInputs>>;
  onClear: () => void;
  onLoadDemo: () => void;
}

export default function CarLoanInputSections({
  inputs,
  setInputs,
  onClear,
  onLoadDemo
}: CarLoanInputSectionsProps) {
  const [openSection, setOpenSection] = useState<string>('basic');

  const toggleSection = (sec: string) => {
    setOpenSection(prev => prev === sec ? '' : sec);
  };

  const updateField = (field: keyof CarLoanInputs, val: any) => {
    setInputs(prev => {
      const updated = { ...prev, [field]: val };

      // Synchronization for down payment
      const carPriceNum = Number(updated.carPrice) || 0;
      if (field === 'downPayment') {
        const dpVal = Number(val) || 0;
        updated.downPaymentPercent = carPriceNum > 0 ? Number(((dpVal / carPriceNum) * 100).toFixed(2)) : '';
        updated.downPaymentType = 'amount';
      } else if (field === 'downPaymentPercent') {
        const dpPct = Number(val) || 0;
        updated.downPayment = carPriceNum > 0 ? Number(((dpPct / 100) * carPriceNum).toFixed(2)) : '';
        updated.downPaymentType = 'percent';
      } else if (field === 'carPrice') {
        const price = Number(val) || 0;
        if (prev.downPaymentType === 'percent' && prev.downPaymentPercent !== '') {
          updated.downPayment = Number(((Number(prev.downPaymentPercent) / 100) * price).toFixed(2));
        } else if (prev.downPayment !== '') {
          updated.downPaymentPercent = price > 0 ? Number(((Number(prev.downPayment) / price) * 100).toFixed(2)) : '';
        }
      }

      return updated;
    });
  };

  // Prepayment temporary form states
  const [extraType, setExtraType] = useState<'monthly' | 'quarterly' | 'yearly' | 'onetime'>('onetime');
  const [extraMonth, setExtraMonth] = useState<number>(12);
  const [extraAmount, setExtraAmount] = useState<number | ''>('');
  const [extraDesc, setExtraDesc] = useState<string>('');

  const handleAddExtra = () => {
    const amt = Number(extraAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newEvent: ExtraPaymentEvent = {
      id: Math.random().toString(36).substring(2, 9),
      type: extraType,
      month: Number(extraMonth) || 1,
      amount: amt,
      description: extraDesc.trim() || `${extraType.charAt(0).toUpperCase() + extraType.slice(1)} Extra Payment`
    };

    setInputs(prev => ({
      ...prev,
      extraPaymentsList: [...prev.extraPaymentsList, newEvent]
    }));

    setExtraAmount('');
    setExtraDesc('');
  };

  const handleRemoveExtra = (id: string) => {
    setInputs(prev => ({
      ...prev,
      extraPaymentsList: prev.extraPaymentsList.filter(e => e.id !== id)
    }));
  };

  // Custom Interest Rate schedule temporary states
  const [rateSchedYear, setRateSchedYear] = useState<number>(2);
  const [rateSchedPct, setRateSchedPct] = useState<number | ''>('');

  const handleAddCustomRate = () => {
    const rVal = Number(rateSchedPct);
    if (isNaN(rVal) || rVal < -100 || rVal > 100) return;

    const newEvent: CustomRateEvent = {
      id: Math.random().toString(36).substring(2, 9),
      year: Number(rateSchedYear),
      rate: rVal
    };

    setInputs(prev => {
      // Remove any existing event for same year
      const filtered = prev.customRateSchedule.filter(s => s.year !== newEvent.year);
      return {
        ...prev,
        customRateSchedule: [...filtered, newEvent].sort((a, b) => a.year - b.year)
      };
    });

    setRateSchedPct('');
  };

  const handleRemoveCustomRate = (id: string) => {
    setInputs(prev => ({
      ...prev,
      customRateSchedule: prev.customRateSchedule.filter(e => e.id !== id)
    }));
  };

  const netTradeInVal = computeNetTradeIn(Number(inputs.tradeInValue) || 0, Number(inputs.tradeInBalance) || 0);

  const containerClass = "p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6";
  const headerClass = (sec: string) => 
    `w-full px-6 py-4 flex items-center justify-between text-left font-extrabold transition-all duration-300 rounded-2xl border ${
      openSection === sec 
        ? 'bg-blue-600/5 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/20 shadow-xs' 
        : 'bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200/60 dark:border-neutral-800/60 hover:border-blue-500/40 dark:hover:border-blue-400/40 text-neutral-800 dark:text-neutral-100'
    }`;
  
  const labelClass = "text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 select-none";
  const inputClass = "w-full text-sm py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all";
  const selectClass = "w-full text-sm py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer";

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          id="btn-car-load-demo"
          onClick={onLoadDemo}
          className="px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/60 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Demo Example
        </button>
        <button
          id="btn-car-clear-all"
          onClick={onClear}
          className="px-4 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          Clear All Inputs
        </button>
      </div>

      {/* SECTION 1: Required Basic Details */}
      <div className={containerClass}>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-neutral-900 dark:text-white text-base">Required Car Loan Basics</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Every calculation starts from zero. No default assumptions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="carPrice">
              <span>Vehicle Purchase Price</span>
              <span className="text-red-500 font-black">*</span>
              <HelpCircle className="w-3 h-3 text-neutral-400" title="The agreed retail purchase price of the vehicle, before incentives or trade-ins." />
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
              <input
                id="carPrice"
                type="number"
                placeholder="e.g. 35000"
                value={inputs.carPrice}
                onChange={(e) => updateField('carPrice', e.target.value === '' ? '' : Number(e.target.value))}
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="interestRate">
              <span>Annual Interest Rate (APR)</span>
              <span className="text-red-500 font-black">*</span>
            </label>
            <div className="relative">
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">%</span>
              <input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="e.g. 6.49"
                value={inputs.interestRate}
                onChange={(e) => updateField('interestRate', e.target.value === '' ? '' : Number(e.target.value))}
                className={`${inputClass} pr-8`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="loanTerm">
              <span>Loan Term Length</span>
              <span className="text-red-500 font-black">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="loanTerm"
                type="number"
                placeholder={inputs.termUnit === 'years' ? 'e.g. 5' : 'e.g. 60'}
                value={inputs.loanTerm}
                onChange={(e) => updateField('loanTerm', e.target.value === '' ? '' : Number(e.target.value))}
                className={inputClass}
              />
              <select
                id="termUnit"
                value={inputs.termUnit}
                onChange={(e) => updateField('termUnit', e.target.value)}
                className={`${selectClass} w-28`}
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="vehicleType">Vehicle Categorization</label>
            <select
              id="vehicleType"
              value={inputs.vehicleType}
              onChange={(e) => updateField('vehicleType', e.target.value)}
              className={selectClass}
            >
              <option value="Gasoline">Gasoline/ICE</option>
              <option value="EV">Electric Vehicle (EV)</option>
              <option value="Hybrid">Hybrid / PHEV</option>
              <option value="Used">Used Vehicle</option>
              <option value="Luxury">Luxury Class</option>
              <option value="Commercial">Commercial/Heavy Utility</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="startDate">Loan Start Date</label>
            <input
              id="startDate"
              type="date"
              value={inputs.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Down Payment & Trade-In (Collapsible) */}
      <div className="space-y-2">
        <button
          id="btn-toggle-downpayment"
          onClick={() => toggleSection('downpayment')}
          className={headerClass('downpayment')}
        >
          <span className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Down Payment & Trade-In Valuation
          </span>
          {openSection === 'downpayment' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'downpayment' && (
          <div className={`${containerClass} mt-1 animate-fadeIn`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="downPayment">Down Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="downPayment"
                    type="number"
                    placeholder="e.g. 5000"
                    value={inputs.downPayment}
                    onChange={(e) => updateField('downPayment', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="downPaymentPercent">Down Payment Percentage</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">%</span>
                  <input
                    id="downPaymentPercent"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 15"
                    value={inputs.downPaymentPercent}
                    onChange={(e) => updateField('downPaymentPercent', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pr-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="tradeInValue">Vehicle Trade-In Appraised Value</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="tradeInValue"
                    type="number"
                    placeholder="e.g. 8000"
                    value={inputs.tradeInValue}
                    onChange={(e) => updateField('tradeInValue', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="tradeInBalance">Existing Trade-In Loan Balance</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="tradeInBalance"
                    type="number"
                    placeholder="e.g. 2000"
                    value={inputs.tradeInBalance}
                    onChange={(e) => updateField('tradeInBalance', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
            </div>

            {/* Net Trade-In Display */}
            {(Number(inputs.tradeInValue) > 0 || Number(inputs.tradeInBalance) > 0) && (
              <div className={`p-4 rounded-xl border ${
                netTradeInVal >= 0 
                  ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-800 dark:text-emerald-400' 
                  : 'bg-rose-500/5 border-rose-500/10 text-rose-800 dark:text-rose-400'
              } text-xs font-bold flex justify-between items-center`}>
                <span>Net Trade-In Value:</span>
                <span>
                  {netTradeInVal >= 0 
                    ? `+ $${netTradeInVal.toLocaleString()} Credit` 
                    : `- $${Math.abs(netTradeInVal).toLocaleString()} Negative Equity (Rolled in)`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 3: Rebates & Cash Discounts (Collapsible) */}
      <div className="space-y-2">
        <button
          id="btn-toggle-rebates"
          onClick={() => toggleSection('rebates')}
          className={headerClass('rebates')}
        >
          <span className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4" />
            Rebates, Manufacturer Incentives & Discounts
          </span>
          {openSection === 'rebates' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'rebates' && (
          <div className={`${containerClass} mt-1 animate-fadeIn`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="dealerRebate">Dealer Cash Rebate</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="dealerRebate"
                    type="number"
                    placeholder="e.g. 1000"
                    value={inputs.dealerRebate}
                    onChange={(e) => updateField('dealerRebate', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="manufacturerIncentive">Manufacturer Incentive</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="manufacturerIncentive"
                    type="number"
                    placeholder="e.g. 1500"
                    value={inputs.manufacturerIncentive}
                    onChange={(e) => updateField('manufacturerIncentive', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="cashDiscount">Negotiated Cash Discount</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="cashDiscount"
                    type="number"
                    placeholder="e.g. 500"
                    value={inputs.cashDiscount}
                    onChange={(e) => updateField('cashDiscount', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: Taxes, Fees & Financing Choice (Collapsible) */}
      <div className="space-y-2">
        <button
          id="btn-toggle-taxes"
          onClick={() => toggleSection('taxes')}
          className={headerClass('taxes')}
        >
          <span className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Taxes, Fees & Out-of-pocket Options
          </span>
          {openSection === 'taxes' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'taxes' && (
          <div className={`${containerClass} mt-1 animate-fadeIn`}>
            {/* Financing Option */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-neutral-800 dark:text-white block">Roll Taxes & Fees into Loan?</span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">Enable to finance these, or disable to pay upfront in Cash.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  id="chk-finance-fees"
                  type="checkbox"
                  checked={inputs.financeFeesAndTaxes}
                  onChange={(e) => updateField('financeFeesAndTaxes', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 dark:bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="salesTaxRate">State Sales Tax Rate</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    {inputs.salesTaxType === 'percent' ? (
                      <>
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">%</span>
                        <input
                          id="salesTaxRate"
                          type="number"
                          step="0.01"
                          placeholder="e.g. 6.25"
                          value={inputs.salesTaxRate}
                          onChange={(e) => updateField('salesTaxRate', e.target.value === '' ? '' : Number(e.target.value))}
                          className={`${inputClass} pr-8`}
                        />
                      </>
                    ) : (
                      <>
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                        <input
                          id="salesTaxAmount"
                          type="number"
                          placeholder="e.g. 1800"
                          value={inputs.salesTaxAmount}
                          onChange={(e) => updateField('salesTaxAmount', e.target.value === '' ? '' : Number(e.target.value))}
                          className={`${inputClass} pl-8`}
                        />
                      </>
                    )}
                  </div>
                  <select
                    id="salesTaxType"
                    value={inputs.salesTaxType}
                    onChange={(e) => updateField('salesTaxType', e.target.value)}
                    className={`${selectClass} w-24`}
                  >
                    <option value="percent">Rate %</option>
                    <option value="amount">Fixed $</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="dealerFee">Dealer Processing/Doc Fee</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className={inputs.dealerFeeType === 'amount' ? "absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold" : "absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold"}>
                      {inputs.dealerFeeType === 'amount' ? '$' : '%'}
                    </span>
                    <input
                      id="dealerFee"
                      type="number"
                      placeholder="e.g. 399"
                      value={inputs.dealerFee}
                      onChange={(e) => updateField('dealerFee', e.target.value === '' ? '' : Number(e.target.value))}
                      className={`${inputClass} ${inputs.dealerFeeType === 'amount' ? 'pl-8' : 'pr-8'}`}
                    />
                  </div>
                  <select
                    id="dealerFeeType"
                    value={inputs.dealerFeeType}
                    onChange={(e) => updateField('dealerFeeType', e.target.value)}
                    className={`${selectClass} w-24`}
                  >
                    <option value="amount">Fixed $</option>
                    <option value="percent">Rate %</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="registrationFee">Registration & Licensing Fees</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className={inputs.registrationFeeType === 'amount' ? "absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold" : "absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold"}>
                      {inputs.registrationFeeType === 'amount' ? '$' : '%'}
                    </span>
                    <input
                      id="registrationFee"
                      type="number"
                      placeholder="e.g. 150"
                      value={inputs.registrationFee}
                      onChange={(e) => updateField('registrationFee', e.target.value === '' ? '' : Number(e.target.value))}
                      className={`${inputClass} ${inputs.registrationFeeType === 'amount' ? 'pl-8' : 'pr-8'}`}
                    />
                  </div>
                  <select
                    id="registrationFeeType"
                    value={inputs.registrationFeeType}
                    onChange={(e) => updateField('registrationFeeType', e.target.value)}
                    className={`${selectClass} w-24`}
                  >
                    <option value="amount">Fixed $</option>
                    <option value="percent">Rate %</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="titleFee">Vehicle Title Fee</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className={inputs.titleFeeType === 'amount' ? "absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold" : "absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold"}>
                      {inputs.titleFeeType === 'amount' ? '$' : '%'}
                    </span>
                    <input
                      id="titleFee"
                      type="number"
                      placeholder="e.g. 95"
                      value={inputs.titleFee}
                      onChange={(e) => updateField('titleFee', e.target.value === '' ? '' : Number(e.target.value))}
                      className={`${inputClass} ${inputs.titleFeeType === 'amount' ? 'pl-8' : 'pr-8'}`}
                    />
                  </div>
                  <select
                    id="titleFeeType"
                    value={inputs.titleFeeType}
                    onChange={(e) => updateField('titleFeeType', e.target.value)}
                    className={`${selectClass} w-24`}
                  >
                    <option value="amount">Fixed $</option>
                    <option value="percent">Rate %</option>
                  </select>
                </div>
              </div>

              {/* Advanced Small Fee Toggles */}
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="destinationCharge">Destination / Freight Charges</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="destinationCharge"
                    type="number"
                    placeholder="e.g. 1000"
                    value={inputs.destinationCharge}
                    onChange={(e) => updateField('destinationCharge', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="governmentFee">Other Government Fees</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="governmentFee"
                    type="number"
                    placeholder="e.g. 50"
                    value={inputs.governmentFee}
                    onChange={(e) => updateField('governmentFee', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: Add-ons & Optional Insurances (Collapsible) */}
      <div className="space-y-2">
        <button
          id="btn-toggle-addons"
          onClick={() => toggleSection('addons')}
          className={headerClass('addons')}
        >
          <span className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Warranty, GAP Insurance & Other Add-ons
          </span>
          {openSection === 'addons' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'addons' && (
          <div className={`${containerClass} mt-1 animate-fadeIn`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="extendedWarranty">Extended Warranty Contract</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="extendedWarranty"
                    type="number"
                    placeholder="e.g. 2500"
                    value={inputs.extendedWarranty}
                    onChange={(e) => updateField('extendedWarranty', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="gapInsurance">GAP Insurance Cost</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="gapInsurance"
                    type="number"
                    placeholder="e.g. 600"
                    value={inputs.gapInsurance}
                    onChange={(e) => updateField('gapInsurance', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="servicePackage">Maintenance/Service Package</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="servicePackage"
                    type="number"
                    placeholder="e.g. 1000"
                    value={inputs.servicePackage}
                    onChange={(e) => updateField('servicePackage', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="balloonPayment">Balloon Payment at Term End</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="balloonPayment"
                    type="number"
                    placeholder="e.g. 5000"
                    value={inputs.balloonPayment}
                    onChange={(e) => updateField('balloonPayment', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: Extra Payments (Prepayments) */}
      <div className="space-y-2">
        <button
          id="btn-toggle-extra"
          onClick={() => toggleSection('extra')}
          className={headerClass('extra')}
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Extra Payment & Prepayment Planner
          </span>
          {openSection === 'extra' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'extra' && (
          <div className={`${containerClass} mt-1 animate-fadeIn`}>
            {/* Quick entries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="extraMonthly">Recurring Monthly Extra</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="extraMonthly"
                    type="number"
                    placeholder="e.g. 100"
                    value={inputs.extraMonthly}
                    onChange={(e) => updateField('extraMonthly', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="annualExtra">Recurring Annual Extra</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="annualExtra"
                    type="number"
                    placeholder="e.g. 1000"
                    value={inputs.annualExtra}
                    onChange={(e) => updateField('annualExtra', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="extraOneTime">One-Time Prepayment Event</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                    <input
                      id="extraOneTime"
                      type="number"
                      placeholder="e.g. 5000"
                      value={inputs.extraOneTime}
                      onChange={(e) => updateField('extraOneTime', e.target.value === '' ? '' : Number(e.target.value))}
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                  <input
                    id="extraOneTimeMonth"
                    type="number"
                    title="Target Month"
                    placeholder="Month"
                    value={inputs.extraOneTimeMonth}
                    onChange={(e) => updateField('extraOneTimeMonth', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} w-20 text-center`}
                  />
                </div>
              </div>
            </div>

            {/* Custom Extra Payments List Builder */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
              <span className="text-xs font-black text-neutral-800 dark:text-white block">Add Advanced Custom Prepayments</span>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-neutral-50/50 dark:bg-neutral-950/40 p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500">Frequency</label>
                  <select
                    id="select-extra-frequency"
                    value={extraType}
                    onChange={(e: any) => setExtraType(e.target.value)}
                    className={selectClass}
                  >
                    <option value="onetime">One-Time</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500">Occurs in Month</label>
                  <input
                    id="input-extra-month"
                    type="number"
                    min="1"
                    placeholder="12"
                    value={extraMonth}
                    onChange={(e) => setExtraMonth(Number(e.target.value))}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500">Amount ($)</label>
                  <input
                    id="input-extra-amount"
                    type="number"
                    placeholder="1000"
                    value={extraAmount}
                    onChange={(e) => setExtraAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className={inputClass}
                  />
                </div>

                <div className="flex gap-2">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500">Description (Optional)</label>
                    <input
                      id="input-extra-desc"
                      type="text"
                      placeholder="e.g. Tax return"
                      value={extraDesc}
                      onChange={(e) => setExtraDesc(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <button
                    id="btn-add-extra-pay"
                    type="button"
                    onClick={handleAddExtra}
                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer self-end"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Active Events List */}
              {inputs.extraPaymentsList.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Active Scheduled Prepayments</span>
                  <div className="max-h-40 overflow-y-auto border border-neutral-150 dark:border-neutral-800 rounded-xl divide-y divide-neutral-100 dark:divide-neutral-800">
                    {inputs.extraPaymentsList.map((e) => (
                      <div key={e.id} className="p-3 flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900">
                        <div className="flex flex-col gap-0.5">
                          <span>{e.description}</span>
                          <span className="text-[10px] text-neutral-400 normal-case">
                            ${e.amount.toLocaleString()} ({e.type === 'onetime' ? `Month ${e.month}` : e.type})
                          </span>
                        </div>
                        <button
                          id={`btn-remove-extra-${e.id}`}
                          onClick={() => handleRemoveExtra(e.id)}
                          className="p-1 hover:bg-rose-500/10 hover:text-rose-600 text-neutral-400 dark:text-neutral-500 rounded-lg transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 7: Variable Interest rate scheduler (Collapsible) */}
      <div className="space-y-2">
        <button
          id="btn-toggle-ratesched"
          onClick={() => toggleSection('ratesched')}
          className={headerClass('ratesched')}
        >
          <span className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Variable Interest Rates & Yearly Schedules
          </span>
          {openSection === 'ratesched' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'ratesched' && (
          <div className={`${containerClass} mt-1 animate-fadeIn`}>
            {/* Toggle Rate Type */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-black text-neutral-800 dark:text-white block">Interest Rate Modality</span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">Choose between a standard fixed rate or variable yearly adjustments.</span>
              </div>
              <div className="flex bg-neutral-200 dark:bg-neutral-900 p-1 rounded-xl">
                <button
                  id="btn-rate-fixed"
                  type="button"
                  onClick={() => updateField('interestType', 'fixed')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    inputs.interestType === 'fixed' 
                      ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm' 
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
                  }`}
                >
                  Fixed APR
                </button>
                <button
                  id="btn-rate-variable"
                  type="button"
                  onClick={() => updateField('interestType', 'variable')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    inputs.interestType === 'variable' 
                      ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm' 
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
                  }`}
                >
                  Variable APR
                </button>
              </div>
            </div>

            {inputs.interestType === 'variable' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-neutral-50/50 dark:bg-neutral-950/40 p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500">Applicable Year</label>
                    <select
                      id="select-rate-year"
                      value={rateSchedYear}
                      onChange={(e) => setRateSchedYear(Number(e.target.value))}
                      className={selectClass}
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => (
                        <option key={y} value={y}>Year {y}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500">Interest Rate (%)</label>
                    <input
                      id="input-rate-percentage"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 7.25"
                      value={rateSchedPct}
                      onChange={(e) => setRateSchedPct(e.target.value === '' ? '' : Number(e.target.value))}
                      className={inputClass}
                    />
                  </div>

                  <button
                    id="btn-add-custom-rate"
                    type="button"
                    onClick={handleAddCustomRate}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer font-bold text-xs"
                  >
                    Add Annual Adjust
                  </button>
                </div>

                {/* Active schedule list */}
                {inputs.customRateSchedule.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Annual Adjustments Schedule</span>
                    <div className="border border-neutral-150 dark:border-neutral-800 rounded-xl divide-y divide-neutral-100 dark:divide-neutral-800">
                      {inputs.customRateSchedule.map(s => (
                        <div key={s.id} className="p-3 flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900">
                          <span>Year {s.year} Rate:</span>
                          <div className="flex items-center gap-3">
                            <span className="text-blue-600 dark:text-cyan-400">{s.rate}% APR</span>
                            <button
                              id={`btn-remove-rate-${s.id}`}
                              onClick={() => handleRemoveCustomRate(s.id)}
                              className="p-1 hover:bg-rose-500/10 hover:text-rose-600 text-neutral-400 dark:text-neutral-500 rounded-lg transition cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 dark:text-neutral-500">Fixed rate of {inputs.interestRate || '0'}% applies throughout the loan duration.</p>
            )}
          </div>
        )}
      </div>

      {/* SECTION 8: Affordability Profiler (Collapsible) */}
      <div className="space-y-2">
        <button
          id="btn-toggle-affordability"
          onClick={() => toggleSection('affordability')}
          className={headerClass('affordability')}
        >
          <span className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4" />
            Affordability Profiler & Monthly Income
          </span>
          {openSection === 'affordability' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'affordability' && (
          <div className={`${containerClass} mt-1 animate-fadeIn`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="annualIncome">Gross Annual Income</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="annualIncome"
                    type="number"
                    placeholder="e.g. 75000"
                    value={inputs.annualIncome}
                    onChange={(e) => updateField('annualIncome', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="existingDebts">Other Monthly Debt Payments</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">$</span>
                  <input
                    id="existingDebts"
                    type="number"
                    placeholder="e.g. 1500"
                    value={inputs.existingDebts}
                    onChange={(e) => updateField('existingDebts', e.target.value === '' ? '' : Number(e.target.value))}
                    className={`${inputClass} pl-8`}
                  />
                </div>
                <span className="text-[10px] text-neutral-400">Rent/Mortgage, Student Loans, Credit Card Minimums.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 9: Advanced Inflation Discounting (Collapsible) */}
      <div className="space-y-2">
        <button
          id="btn-toggle-inflation"
          onClick={() => toggleSection('inflation')}
          className={headerClass('inflation')}
        >
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Inflation Discounting
          </span>
          {openSection === 'inflation' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'inflation' && (
          <div className={`${containerClass} mt-1 animate-fadeIn`}>
            <div className="space-y-1.5 max-w-md">
              <label className={labelClass} htmlFor="inflationRate">Expected Inflation Rate (Real vs Nominal Value)</label>
              <div className="relative">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">%</span>
                <input
                  id="inflationRate"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 2.5"
                  value={inputs.inflationRate}
                  onChange={(e) => updateField('inflationRate', e.target.value === '' ? '' : Number(e.target.value))}
                  className={`${inputClass} pr-8`}
                />
              </div>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">Estimates the purchasing power value of future loan installments.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
