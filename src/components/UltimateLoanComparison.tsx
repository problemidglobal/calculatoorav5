import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  Award, 
  Coins, 
  Sparkles, 
  Percent 
} from 'lucide-react';
import { LoanInputs, LoanResults, computeLoanAmortization } from '../utils/ultimateLoanMath';

interface SavedScenario {
  id: string;
  name: string;
  inputs: LoanInputs;
  results: LoanResults;
}

interface UltimateLoanComparisonProps {
  currentInputs: LoanInputs;
  currentResults: LoanResults;
}

export default function UltimateLoanComparison({
  currentInputs,
  currentResults
}: UltimateLoanComparisonProps) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [newScenarioName, setNewScenarioName] = useState<string>('Scenario ' + (scenarios.length + 1));

  const handleSaveCurrentScenario = () => {
    if (newScenarioName.trim() === '') return;
    
    // Deep clone inputs to preserve state
    const clonedInputs = JSON.parse(JSON.stringify(currentInputs));
    
    // Re-run the math explicitly to make sure everything is calculated
    const results = computeLoanAmortization(clonedInputs);

    const scenario: SavedScenario = {
      id: Math.random().toString(36).substring(2, 9),
      name: newScenarioName,
      inputs: clonedInputs,
      results
    };

    setScenarios(prev => [...prev, scenario]);
    setNewScenarioName('Scenario ' + (scenarios.length + 2));
  };

  const handleRemoveScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  // Compare active scenarios
  const allCompared = React.useMemo(() => {
    // Include current active loan as the first comparison column
    const activeScenario: SavedScenario = {
      id: 'active-loan',
      name: 'Current Active Workspace',
      inputs: currentInputs,
      results: currentResults
    };
    return [activeScenario, ...scenarios];
  }, [currentInputs, currentResults, scenarios]);

  // Find minimums to highlight best options
  const metrics = React.useMemo(() => {
    if (allCompared.length < 2) return null;

    let lowestMonthly = Infinity;
    let lowestInterest = Infinity;
    let lowestTrueCost = Infinity;
    let shortestTerm = Infinity;

    let bestMonthlyId = '';
    let bestInterestId = '';
    let bestTrueCostId = '';
    let bestTermId = '';

    allCompared.forEach(sc => {
      const { results } = sc;
      if (results.monthlyPayment < lowestMonthly) {
        lowestMonthly = results.monthlyPayment;
        bestMonthlyId = sc.id;
      }
      if (results.totalInterest < lowestInterest) {
        lowestInterest = results.totalInterest;
        bestInterestId = sc.id;
      }
      if (results.trueLoanCost < lowestTrueCost) {
        lowestTrueCost = results.trueLoanCost;
        bestTrueCostId = sc.id;
      }
      if (results.schedule.length < shortestTerm) {
        shortestTerm = results.schedule.length;
        bestTermId = sc.id;
      }
    });

    return {
      bestMonthlyId,
      bestInterestId,
      bestTrueCostId,
      bestTermId
    };
  }, [allCompared]);

  const currency = currentInputs.currency || '$';

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 space-y-6 text-left font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-800 dark:text-white">Side-by-Side Comparison</h3>
          <p className="text-[10px] text-neutral-400">Save current variables as snapshots to compare rates, payments, and savings</p>
        </div>

        {/* Snapshot Save Form */}
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={newScenarioName}
            onChange={(e) => setNewScenarioName(e.target.value)}
            placeholder="e.g. 15-Yr Fixed"
            className="text-xs px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none"
          />
          <button 
            onClick={handleSaveCurrentScenario}
            className="px-4 py-2 bg-neutral-900 hover:bg-blue-600 hover:text-white dark:bg-neutral-850 dark:hover:bg-neutral-850 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Snapshot
          </button>
        </div>
      </div>

      {allCompared.length < 2 ? (
        <div className="p-8 border-2 border-dashed border-neutral-150 dark:border-neutral-800 rounded-2xl text-center text-neutral-450 select-none space-y-2">
          <p className="text-xs">No saved comparison scenarios yet.</p>
          <p className="text-[10px] text-neutral-400">Modify your loan inputs, type a nickname above, and click "Snapshot" to store multiple models.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-150 dark:border-neutral-800/80">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/40 border-b border-neutral-150 dark:border-neutral-800">
                <th className="p-4 font-bold text-neutral-500 w-44">Parameters</th>
                {allCompared.map(sc => (
                  <th key={sc.id} className="p-4 font-black text-neutral-800 dark:text-white min-w-44 text-right relative">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>{sc.name}</span>
                      {sc.id !== 'active-loan' && (
                        <button 
                          onClick={() => handleRemoveScenario(sc.id)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono text-neutral-700 dark:text-neutral-300">
              
              {/* Core Inputs Comparison */}
              <tr>
                <td className="p-4 font-sans font-bold text-neutral-500 bg-neutral-50/30 dark:bg-neutral-900/10">Home/Asset Value</td>
                {allCompared.map(sc => (
                  <td key={sc.id} className="p-4 text-right font-bold text-neutral-800 dark:text-neutral-200">
                    {sc.inputs.currency}{sc.inputs.amount.toLocaleString()}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-sans font-bold text-neutral-500 bg-neutral-50/30 dark:bg-neutral-900/10">Base Interest Rate</td>
                {allCompared.map(sc => (
                  <td key={sc.id} className="p-4 text-right font-bold">
                    {sc.inputs.interestRate.toFixed(2)}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-sans font-bold text-neutral-500 bg-neutral-50/30 dark:bg-neutral-900/10">Loan Term</td>
                {allCompared.map(sc => (
                  <td key={sc.id} className="p-4 text-right font-bold">
                    {sc.inputs.termYears} Yrs {sc.inputs.termMonths > 0 ? `${sc.inputs.termMonths} Mos` : ''}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-sans font-bold text-neutral-500 bg-neutral-50/30 dark:bg-neutral-900/10">Prepayments Active</td>
                {allCompared.map(sc => (
                  <td key={sc.id} className="p-4 text-right font-bold font-sans">
                    {sc.inputs.extraMonthly > 0 || sc.inputs.extraYearly > 0 || sc.inputs.extraPaymentsList.length > 0 ? (
                      <span className="text-emerald-500 text-xs font-black">Yes</span>
                    ) : (
                      <span className="text-neutral-400 text-xs">No</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Outputs & Results Comparison */}
              <tr className="border-t-2 border-neutral-200 dark:border-neutral-800">
                <td className="p-4 font-sans font-bold text-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/20">Monthly Payment</td>
                {allCompared.map(sc => {
                  const isBest = metrics?.bestMonthlyId === sc.id;
                  return (
                    <td key={sc.id} className={`p-4 text-right font-black ${isBest ? 'text-emerald-500' : 'text-neutral-900 dark:text-white'}`}>
                      {currency}{sc.results.monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      {isBest && <span className="font-sans text-[9px] font-black uppercase text-emerald-500 ml-1">(Lowest)</span>}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-sans font-bold text-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/20">Total Interest Paid</td>
                {allCompared.map(sc => {
                  const isBest = metrics?.bestInterestId === sc.id;
                  return (
                    <td key={sc.id} className={`p-4 text-right font-black ${isBest ? 'text-emerald-500' : 'text-neutral-800 dark:text-neutral-200'}`}>
                      {currency}{sc.results.totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      {isBest && <span className="font-sans text-[9px] font-black uppercase text-emerald-500 ml-1">(Lowest)</span>}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-sans font-bold text-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/20">Total Payments Term</td>
                {allCompared.map(sc => {
                  const isBest = metrics?.bestTermId === sc.id;
                  return (
                    <td key={sc.id} className={`p-4 text-right font-black ${isBest ? 'text-emerald-500' : 'text-neutral-850 dark:text-neutral-200'}`}>
                      {sc.results.schedule.length} payments
                      {isBest && <span className="font-sans text-[9px] font-black uppercase text-emerald-500 ml-1">(Shortest)</span>}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-sans font-bold text-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/20">True Total Cost</td>
                {allCompared.map(sc => {
                  const isBest = metrics?.bestTrueCostId === sc.id;
                  return (
                    <td key={sc.id} className={`p-4 text-right font-black ${isBest ? 'text-emerald-500' : 'text-neutral-850 dark:text-neutral-200'}`}>
                      {currency}{sc.results.trueLoanCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      {isBest && <span className="font-sans text-[9px] font-black uppercase text-emerald-500 ml-1">(Lowest)</span>}
                    </td>
                  );
                })}
              </tr>

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
