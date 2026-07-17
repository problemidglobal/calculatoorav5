import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Sparkles, Trash2, Plus, Copy, BarChart3, TrendingUp } from 'lucide-react';
import { EMICalculatorInputs, computeEmiAmortization } from '../../utils/emiMath';

interface EMIWhatIfComparisonProps {
  baseInputs: EMICalculatorInputs;
  baseEmi: number;
  baseInterest: number;
  baseTotal: number;
  basePayoff: string;
  currency: string;
}

interface Scenario {
  id: string;
  name: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  tenureType: 'years' | 'months';
  downPayment: number;
  extraMonthly: number;
}

export default function EMIWhatIfComparison({ 
  baseInputs, 
  baseEmi, 
  baseInterest, 
  baseTotal, 
  basePayoff, 
  currency 
}: EMIWhatIfComparisonProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  
  // New Scenario Fields
  const [scName, setScName] = useState('');
  const [scAmount, setScAmount] = useState('');
  const [scRate, setScRate] = useState('');
  const [scTenure, setScTenure] = useState('');
  const [scTenureType, setScTenureType] = useState<'years' | 'months'>('years');
  const [scDownPayment, setScDownPayment] = useState('');
  const [scExtra, setScExtra] = useState('');

  // Auto-seed two logical scenarios based on current inputs so they don't have to start from scratch!
  const seededScenarios = useMemo(() => {
    const amount = Number(baseInputs.loanAmount) || 0;
    const rate = Number(baseInputs.interestRate) || 0;
    const tenure = Number(baseInputs.tenure) || 0;
    if (amount <= 0 || tenure <= 0) return [];

    const list: Scenario[] = [];

    // Scenario 1: Lower Interest Rate by 0.5%
    if (rate > 0.5) {
      list.push({
        id: 'seed-lower-rate',
        name: '0.5% Lower Interest Rate',
        loanAmount: amount,
        interestRate: Math.max(0.1, rate - 0.5),
        tenure: tenure,
        tenureType: baseInputs.tenureType === 'months' ? 'months' : 'years',
        downPayment: Number(baseInputs.downPayment) || 0,
        extraMonthly: Number(baseInputs.extraMonthly) || 0,
      });
    }

    // Scenario 2: Shorter Term (-15% or -5 years)
    const shorterTenure = baseInputs.tenureType === 'months' 
      ? Math.max(12, Math.round(tenure * 0.8)) 
      : Math.max(1, Math.round(tenure - 5));

    list.push({
      id: 'seed-shorter-term',
      name: baseInputs.tenureType === 'months' ? '20% Shorter Tenure' : '5 Years Shorter Tenure',
      loanAmount: amount,
      interestRate: rate,
      tenure: shorterTenure,
      tenureType: baseInputs.tenureType === 'months' ? 'months' : 'years',
      downPayment: Number(baseInputs.downPayment) || 0,
      extraMonthly: Number(baseInputs.extraMonthly) || 0,
    });

    return list;
  }, [baseInputs]);

  // Combine customized and default seeded scenarios
  const activeScenarios = useMemo(() => {
    return [...seededScenarios, ...scenarios];
  }, [seededScenarios, scenarios]);

  // Calculate results for each scenario
  const comparisonData = useMemo(() => {
    // Standard baseline
    const list = [{
      name: 'Base Scenario',
      emi: baseEmi,
      interest: baseInterest,
      principal: (Number(baseInputs.loanAmount) || 0) - (Number(baseInputs.downPayment) || 0),
      total: baseTotal,
      payoff: basePayoff,
      saved: 0,
    }];

    activeScenarios.forEach((sc) => {
      // Build fully synthesized temporary EMICalculatorInputs
      const mockInputs: EMICalculatorInputs = {
        ...baseInputs,
        loanAmount: sc.loanAmount,
        interestRate: sc.interestRate,
        tenure: sc.tenure,
        tenureType: sc.tenureType === 'months' ? 'months' : 'years',
        downPayment: sc.downPayment,
        extraMonthly: sc.extraMonthly,
      };

      const results = computeEmiAmortization(mockInputs);
      if (results.rows.length > 0) {
        list.push({
          name: sc.name,
          emi: results.rows[0].emi,
          interest: results.totalInterest,
          principal: results.totalPrincipal,
          total: results.totalPayment,
          payoff: results.payoffDate,
          saved: Math.max(0, baseInterest - results.totalInterest),
        });
      }
    });

    return list;
  }, [activeScenarios, baseInputs, baseEmi, baseInterest, baseTotal, basePayoff]);

  const handleAddScenario = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(scAmount) || Number(baseInputs.loanAmount) || 0;
    const rate = Number(scRate) || Number(baseInputs.interestRate) || 0;
    const tenure = Number(scTenure) || Number(baseInputs.tenure) || 0;
    const name = scName.trim() || `Option ${scenarios.length + 1}`;

    if (amount <= 0 || tenure <= 0) return;

    const newSc: Scenario = {
      id: Math.random().toString(),
      name,
      loanAmount: amount,
      interestRate: rate,
      tenure,
      tenureType: scTenureType,
      downPayment: Number(scDownPayment) || 0,
      extraMonthly: Number(scExtra) || 0,
    };

    setScenarios([...scenarios, newSc]);
    
    // reset inputs
    setScName('');
    setScAmount('');
    setScRate('');
    setScTenure('');
    setScDownPayment('');
    setScExtra('');
  };

  const deleteScenario = (id: string) => {
    setScenarios(scenarios.filter(sc => sc.id !== id));
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
        <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
          What-If Scenario Comparison
        </h3>
      </div>
      
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
        Simulate and side-by-side evaluate different interest rate proposals, larger deposits, or payment boosts.
      </p>

      {/* Add Scenario Form */}
      <form onSubmit={handleAddScenario} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-850 mb-6">
        <span className="text-xs font-bold text-neutral-500 block mb-3 uppercase tracking-wider">Create Custom Scenario</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Scenario Title</label>
            <input
              type="text"
              placeholder="e.g. 15-Year Term"
              value={scName}
              onChange={(e) => setScName(e.target.value)}
              className="px-3 py-2 w-full text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Loan Amount ({currency})</label>
            <input
              type="number"
              placeholder={`e.g. ${baseInputs.loanAmount}`}
              value={scAmount}
              onChange={(e) => setScAmount(e.target.value)}
              className="px-3 py-2 w-full text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              placeholder={`e.g. ${baseInputs.interestRate}`}
              value={scRate}
              onChange={(e) => setScRate(e.target.value)}
              className="px-3 py-2 w-full text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Tenure</label>
            <div className="flex gap-1">
              <input
                type="number"
                placeholder={`e.g. ${baseInputs.tenure}`}
                value={scTenure}
                onChange={(e) => setScTenure(e.target.value)}
                className="px-3 py-2 w-full text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none font-mono"
              />
              <select
                value={scTenureType}
                onChange={(e: any) => setScTenureType(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1 text-xs focus:outline-none"
              >
                <option value="years">Y</option>
                <option value="months">M</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add To Comparison Panel
        </button>
      </form>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-100 dark:border-neutral-800 mb-6">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 font-bold border-b border-neutral-150 dark:border-neutral-800">
              <th className="px-4 py-3">Scenario Name</th>
              <th className="px-4 py-3">Periodic EMI</th>
              <th className="px-4 py-3">Total Interest</th>
              <th className="px-4 py-3">Total Cost</th>
              <th className="px-4 py-3">Payoff Date</th>
              <th className="px-4 py-3">Interest Saved</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-150 dark:divide-neutral-800 font-mono">
            {comparisonData.map((data, i) => (
              <tr key={data.name} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                <td className="px-4 py-3 font-sans font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-amber-500' : i === 2 ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`} />
                  {data.name}
                </td>
                <td className="px-4 py-3 font-bold text-blue-600 dark:text-cyan-400">{currency}{data.emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{currency}{data.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{currency}{data.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="px-4 py-3 font-sans font-medium text-neutral-500">{data.payoff}</td>
                <td className={`px-4 py-3 font-bold ${data.saved > 0 ? 'text-emerald-500' : 'text-neutral-400'}`}>
                  {data.saved > 0 ? `+${currency}${data.saved.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '-'}
                </td>
                <td className="px-4 py-3 text-right font-sans">
                  {i >= 3 ? (
                    <button
                      onClick={() => deleteScenario(activeScenarios[i - 3].id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition"
                      title="Delete Scenario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest px-1">Seeded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparison Chart */}
      <div className="h-64 w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
            <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#888888" />
            <YAxis tickFormatter={(val) => `${currency}${Math.round(val / 1000)}k`} tick={{ fontSize: 9 }} stroke="#888888" />
            <Tooltip 
              formatter={(value: any) => [`${currency}${Number(value).toLocaleString()}`, '']}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '11px', color: '#171717' }}
            />
            <Bar dataKey="principal" name="Principal Amount" stackId="a" fill="#3b82f6" />
            <Bar dataKey="interest" name="Interest Accrued" stackId="a" fill="#f59e0b" />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
