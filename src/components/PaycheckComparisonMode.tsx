import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  CheckCircle, 
  TrendingUp, 
  ArrowRight,
  Info,
  Layers,
  Award
} from 'lucide-react';
import { PaycheckInputs, computePaycheck, PaycheckResults } from '../utils/paycheckMath';

interface PaycheckComparisonModeProps {
  currentInputs: PaycheckInputs;
  currentResults: PaycheckResults | null;
}

interface SavedScenario {
  id: string;
  name: string;
  earningMethod: string;
  payFrequency: string;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  retainedPercent: number;
}

export default function PaycheckComparisonMode({
  currentInputs,
  currentResults
}: PaycheckComparisonModeProps) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [customLabel, setCustomLabel] = useState('');

  // Save the current paycheck parameters as a scenario
  const handleSaveCurrentScenario = () => {
    if (!currentResults) return;

    const label = customLabel.trim() || `Scenario ${scenarios.length + 1}`;
    
    const newScenario: SavedScenario = {
      id: Math.random().toString(36).substr(2, 9),
      name: label,
      earningMethod: currentInputs.earningMethod,
      payFrequency: currentInputs.payFrequency,
      grossPay: currentResults.totalEarnings,
      totalDeductions: currentResults.totalDeductions,
      netPay: currentResults.netPay,
      retainedPercent: currentResults.totalEarnings > 0 
        ? (currentResults.netPay / currentResults.totalEarnings) * 100 
        : 0
    };

    setScenarios(prev => [...prev, newScenario]);
    setCustomLabel('');
  };

  // Find the index of the best scenario (highest netPay)
  const bestScenarioId = useMemo(() => {
    if (scenarios.length === 0) return null;
    let best = scenarios[0];
    for (let i = 1; i < scenarios.length; i++) {
      if (scenarios[i].netPay > best.netPay) {
        best = scenarios[i];
      }
    }
    return best.id;
  }, [scenarios]);

  const handleDeleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  const loadPreloadedScenarios = () => {
    // Generates a neat list of compared scenarios
    setScenarios([
      {
        id: 'sc-1',
        name: 'Regular 40 Hours (No OT)',
        earningMethod: 'hourly',
        payFrequency: 'weekly',
        grossPay: 1000,
        totalDeductions: 150,
        netPay: 850,
        retainedPercent: 85.0
      },
      {
        id: 'sc-2',
        name: 'Overtime Boost (40h + 5h OT)',
        earningMethod: 'hourly',
        payFrequency: 'weekly',
        grossPay: 1187.5,
        totalDeductions: 178.13,
        netPay: 1009.37,
        retainedPercent: 85.0
      },
      {
        id: 'sc-3',
        name: 'With Performance Bonus',
        earningMethod: 'hourly',
        payFrequency: 'weekly',
        grossPay: 1500,
        totalDeductions: 310,
        netPay: 1190,
        retainedPercent: 79.3
      }
    ]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Controller / Header */}
      <div className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-150 dark:border-neutral-800 shadow-sm space-y-4">
        <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-neutral-400" />
          Paycheck Comparison Engine
        </h4>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
          Save different paycheck configurations side-by-side to compare gross outputs, benefit plans, tax allocations, and overall net take-home cash.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            id="comparison-scenario-label"
            type="text"
            placeholder="e.g. 40 Hours vs 50 Hours, Custom Tax Rate..."
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            disabled={!currentResults}
            className="flex-1 text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white font-bold focus:outline-none"
          />
          <button
            id="btn-save-scenario"
            type="button"
            onClick={handleSaveCurrentScenario}
            disabled={!currentResults}
            className="py-3 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Current Setup</span>
          </button>
          
          {scenarios.length === 0 && (
            <button
              id="btn-load-demo-comparison"
              type="button"
              onClick={loadPreloadedScenarios}
              className="py-3 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-extrabold text-xs rounded-xl transition cursor-pointer"
            >
              Load Scenarios Example
            </button>
          )}
        </div>
      </div>

      {/* 2. Side-By-Side Comparison Ledger */}
      {scenarios.length > 0 ? (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-neutral-150 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <table className="min-w-full divide-y divide-neutral-150 dark:divide-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
              <thead className="bg-neutral-50/50 dark:bg-neutral-950/20">
                <tr>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-neutral-500">Scenario</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-neutral-500">Gross Pay</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-neutral-500">Deductions</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-neutral-500">Net Take-Home</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-neutral-500">Retained %</th>
                  <th className="py-3 px-4 text-center font-bold uppercase tracking-wider text-neutral-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                {scenarios.map((sc) => {
                  const isBest = sc.id === bestScenarioId;
                  return (
                    <tr 
                      key={sc.id}
                      className={`transition ${isBest ? 'bg-emerald-500/5 dark:bg-emerald-500/10 font-bold' : 'hover:bg-neutral-50 dark:hover:bg-neutral-850/40'}`}
                    >
                      {/* Name & Status */}
                      <td className="py-3.5 px-4 flex items-center gap-2">
                        {isBest && <Award className="w-4 h-4 text-emerald-500 shrink-0" />}
                        <div className="flex flex-col">
                          <span className={isBest ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-neutral-800 dark:text-neutral-200'}>
                            {sc.name}
                          </span>
                          <span className="text-[9px] font-bold text-neutral-400 uppercase">
                            {sc.earningMethod} &bull; {sc.payFrequency}
                          </span>
                        </div>
                      </td>
                      {/* Gross */}
                      <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300 font-semibold">
                        ${Math.round(sc.grossPay).toLocaleString()}
                      </td>
                      {/* Deductions */}
                      <td className="py-3.5 px-4 text-rose-500 dark:text-rose-400">
                        -${Math.round(sc.totalDeductions).toLocaleString()}
                      </td>
                      {/* Net Pay */}
                      <td className={`py-3.5 px-4 text-sm font-black ${isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white'}`}>
                        ${Math.round(sc.netPay).toLocaleString()}
                        {isBest && (
                          <span className="ml-1.5 py-0.5 px-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg">
                            Best
                          </span>
                        )}
                      </td>
                      {/* Retained % */}
                      <td className="py-3.5 px-4 font-mono text-neutral-400">
                        {sc.retainedPercent.toFixed(1)}%
                      </td>
                      {/* Delete */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteScenario(sc.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {bestScenarioId && (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-400 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>The optimal scenario based on take-home pay is:</span>
                <p className="text-[11px] font-semibold">
                  &ldquo;{scenarios.find(s => s.id === bestScenarioId)?.name}&rdquo; yielding exactly <span className="font-black text-emerald-600 dark:text-emerald-400">${Math.round(scenarios.find(s => s.id === bestScenarioId)?.netPay || 0).toLocaleString()}</span> in net take-home salary.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center border-2 border-dashed border-neutral-150 dark:border-neutral-800 rounded-3xl">
          <span className="text-xs text-neutral-400 font-semibold block">No compared paycheck configurations loaded.</span>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
            Input values, name your scenario, and click &quot;Add Current Setup&quot; to initiate multi-plan comparisons.
          </p>
        </div>
      )}

    </div>
  );
}
