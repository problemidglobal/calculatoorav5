import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Copy,
  PlusCircle,
  TrendingDown
} from 'lucide-react';
import { InvestmentInputs, InvestmentResults, computeInvestmentProjection } from '../utils/ultimateInvestmentMath';

interface SavedScenario {
  id: string;
  name: string;
  inputs: InvestmentInputs;
  results: InvestmentResults;
}

interface UltimateInvestmentComparisonProps {
  currentInputs: InvestmentInputs;
  currentResults: InvestmentResults;
}

export default function UltimateInvestmentComparison({
  currentInputs,
  currentResults
}: UltimateInvestmentComparisonProps) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [newScenarioName, setNewScenarioName] = useState<string>('');

  const currencySymbol = currentInputs.currency || '$';

  const formatVal = (val: number, symbol: string = currencySymbol) => {
    return symbol + Math.round(val).toLocaleString();
  };

  const handleSaveCurrentScenario = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newScenarioName.trim() || `Scenario ${scenarios.length + 1}`;
    
    const newScenario: SavedScenario = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      // Deep copy inputs to freeze them
      inputs: JSON.parse(JSON.stringify(currentInputs)),
      // Snapshot current results
      results: JSON.parse(JSON.stringify(currentResults))
    };

    setScenarios(prev => [...prev, newScenario].slice(0, 4)); // limit to 4 scenarios
    setNewScenarioName('');
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* CAPTURE FORM PANEL */}
      <div className="p-5 bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-150 dark:border-neutral-800 space-y-4">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-blue-500" /> Save Current Setup to Scenario Comparison Board
          </h4>
          <p className="text-[10px] text-neutral-450 mt-1">
            Freeze your current input parameters (contributions, returns, taxation, fees) to compare side-by-side with different options. You can compare up to 4 custom scenarios.
          </p>
        </div>

        <form onSubmit={handleSaveCurrentScenario} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Aggressive ETF Portfolio..."
            value={newScenarioName}
            onChange={(e) => setNewScenarioName(e.target.value)}
            className="flex-1 text-xs font-bold px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-850 dark:bg-white text-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition text-xs font-bold shrink-0 cursor-pointer select-none"
          >
            Save Scenario
          </button>
        </form>
      </div>

      {/* COMPARISON RESULTS BOARD */}
      {scenarios.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <Sparkles className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <h5 className="text-xs font-black uppercase tracking-wider text-neutral-500">No scenarios captured yet</h5>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Specify alternative return yields, contribution intervals, or taxation rules in the sidebar inputs, then freeze them here to perform multi-stage delta comparisons.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-neutral-150 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900/40">
          <table className="min-w-full divide-y divide-neutral-150 dark:divide-neutral-800 text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-905 font-black text-neutral-400 uppercase tracking-wider text-[9px]">
              <tr>
                <th className="px-4 py-3 text-left">Financial Metrics</th>
                {/* Active Scenario */}
                <th className="px-4 py-3 text-right bg-blue-500/5 text-blue-600 dark:text-cyan-400 font-extrabold border-r border-neutral-150 dark:border-neutral-800">
                  Active (Unsaved)
                </th>
                {/* Saved Scenarios */}
                {scenarios.map((s) => (
                  <th key={s.id} className="px-4 py-3 text-right group relative">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>{s.name}</span>
                      <button
                        onClick={() => handleDeleteScenario(s.id)}
                        className="text-rose-500 opacity-65 hover:opacity-100 transition p-0.5 rounded"
                        title="Delete Scenario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150 dark:divide-neutral-850 font-bold text-neutral-600 dark:text-neutral-300">
              
              {/* Row 1: Core Inputs Overview */}
              <tr className="bg-neutral-50/30 dark:bg-neutral-905/20 text-[9px] uppercase tracking-wider text-neutral-400">
                <td colSpan={scenarios.length + 2} className="px-4 py-1 font-black">Core Input Configs</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">Initial Capital</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-blue-600 dark:text-cyan-400 font-extrabold border-r border-neutral-150 dark:border-neutral-800">
                  {formatVal(currentInputs.initialInvestment, currentInputs.currency)}
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right">
                    {formatVal(s.inputs.initialInvestment, s.inputs.currency)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5">Monthly SIP Amount</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-blue-600 dark:text-cyan-400 font-extrabold border-r border-neutral-150 dark:border-neutral-800">
                  {formatVal(currentInputs.monthlyContribution, currentInputs.currency)}
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right">
                    {formatVal(s.inputs.monthlyContribution, s.inputs.currency)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5">Annual Return (%)</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-blue-600 dark:text-cyan-400 font-extrabold border-r border-neutral-150 dark:border-neutral-800">
                  {currentInputs.annualReturn}% ({currentInputs.returnType})
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right">
                    {s.inputs.annualReturn}% ({s.inputs.returnType})
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5">Compounding Period</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-blue-600 dark:text-cyan-400 font-extrabold border-r border-neutral-150 dark:border-neutral-800 capitalize">
                  {currentInputs.compoundingFrequency}
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right capitalize">
                    {s.inputs.compoundingFrequency}
                  </td>
                ))}
              </tr>

              {/* Row 2: Projected Outputs */}
              <tr className="bg-neutral-50/30 dark:bg-neutral-905/20 text-[9px] uppercase tracking-wider text-neutral-400">
                <td colSpan={scenarios.length + 2} className="px-4 py-1 font-black">Projected Results</td>
              </tr>

              <tr className="bg-blue-500/5 dark:bg-cyan-500/5">
                <td className="px-4 py-2.5 font-extrabold text-neutral-800 dark:text-white">Nominal Future Value</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-black text-xs border-r border-neutral-150 dark:border-neutral-800">
                  {formatVal(currentResults.finalNominalValue, currentInputs.currency)}
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right font-black text-xs text-neutral-800 dark:text-neutral-100">
                    {formatVal(s.results.finalNominalValue, s.inputs.currency)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400">Real Future Value (Inflation Adj)</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-emerald-600 dark:text-emerald-400 font-extrabold border-r border-neutral-150 dark:border-neutral-800">
                  {formatVal(currentResults.finalRealValue, currentInputs.currency)}
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right text-emerald-600 dark:text-emerald-400">
                    {formatVal(s.results.finalRealValue, s.inputs.currency)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5">Total Contributions</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-neutral-500 dark:text-neutral-400 border-r border-neutral-150 dark:border-neutral-800">
                  {formatVal(currentResults.totalContributions, currentInputs.currency)}
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right text-neutral-500">
                    {formatVal(s.results.totalContributions, s.inputs.currency)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5">Accumulated Gross Dividends</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-indigo-500 border-r border-neutral-150 dark:border-neutral-800">
                  +{formatVal(currentResults.totalDividends, currentInputs.currency)}
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right text-indigo-500">
                    +{formatVal(s.results.totalDividends, s.inputs.currency)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5">Capital Leakage (Taxes & Fees)</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-rose-500 border-r border-neutral-150 dark:border-neutral-800">
                  -{formatVal(currentResults.totalTaxes + currentResults.totalFees, currentInputs.currency)}
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right text-rose-500">
                    -{formatVal(s.results.totalTaxes + s.results.totalFees, s.inputs.currency)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5">Total Interest & Profits</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-emerald-500 border-r border-neutral-150 dark:border-neutral-800">
                  +{formatVal(currentResults.netProfit, currentInputs.currency)}
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right text-emerald-500">
                    +{formatVal(s.results.netProfit, s.inputs.currency)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5 text-indigo-500">Net Return on Investment (ROI)</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-indigo-500 font-extrabold border-r border-neutral-150 dark:border-neutral-800">
                  {currentResults.roi.toFixed(1)}% ({currentResults.moneyMultiple.toFixed(2)}x)
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right text-indigo-500">
                    {s.results.roi.toFixed(1)}% ({s.results.moneyMultiple.toFixed(2)}x)
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5 text-purple-500">Monthly Safe Payout (4% Rule)</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-purple-500 font-extrabold border-r border-neutral-150 dark:border-neutral-800">
                  {formatVal(currentResults.safeWithdrawalEstimateMonthly, currentInputs.currency)}/mo
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right text-purple-500">
                    {formatVal(s.results.safeWithdrawalEstimateMonthly, s.inputs.currency)}/mo
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-2.5 text-rose-500">Worst Case Scenario Value</td>
                <td className="px-4 py-2.5 text-right bg-blue-500/5 text-rose-500 font-bold border-r border-neutral-150 dark:border-neutral-800">
                  {formatVal(currentResults.finalWorstCaseValue, currentInputs.currency)}
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="px-4 py-2.5 text-right text-rose-500 font-medium">
                    {formatVal(s.results.finalWorstCaseValue, s.inputs.currency)}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
