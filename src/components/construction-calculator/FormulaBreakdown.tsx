import React from 'react';
import { UnitSystem } from './types';

interface FormulaBreakdownProps {
  unitSystem: UnitSystem;
  length: number;
  width: number;
  height: number;
  areaSqM: number;
  volumeCuM: number;
  costDetails: {
    materials: number;
    labor: number;
    equipment: number;
    transport: number;
    tax: number;
    other: number;
    grandTotal: number;
  };
}

export default function FormulaBreakdown({
  unitSystem,
  length,
  width,
  height,
  areaSqM,
  volumeCuM,
  costDetails
}: FormulaBreakdownProps) {
  const isMetric = unitSystem === 'metric';

  const lenVal = length || 0;
  const widVal = width || 0;
  const htVal = height || 0;

  const areaVal = isMetric ? areaSqM : areaSqM * 10.76391;
  const volVal = isMetric ? volumeCuM : volumeCuM / 0.764554857984;

  const lenUnit = isMetric ? 'meters (m)' : 'feet (ft)';
  const htUnit = isMetric ? 'meters (m)' : 'feet (ft)';
  const areaUnitStr = isMetric ? 'Square Meters (m²)' : 'Square Feet (sq ft)';
  const volUnitStr = isMetric ? 'Cubic Meters (m³)' : 'Cubic Yards (yd³)';

  return (
    <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
          Step-by-Step Calculation Solutions
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          Detailed mechanical substitution matrices showing mathematical formulas and values.
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Area Formula */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950/80 rounded-xl border border-neutral-150 dark:border-neutral-850">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Section 1: Envelope Surface Area
            </span>
            <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">
              Area Solution
            </span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-neutral-400">Formula: </span>
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded font-mono text-neutral-800 dark:text-neutral-200">
                Area = Length × Width
              </code>
            </div>
            <div>
              <span className="text-neutral-400">Substitution: </span>
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded font-mono text-neutral-800 dark:text-neutral-200">
                Area = {lenVal} × {widVal}
              </code>
            </div>
            <div>
              <span className="text-neutral-400">Calculation: </span>
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded font-mono text-neutral-800 dark:text-neutral-200">
                Area = {(lenVal * widVal).toFixed(2)} {isMetric ? 'm²' : 'sq ft'}
              </code>
            </div>
            <div className="pt-1.5 border-t border-neutral-200 dark:border-neutral-850 font-bold text-neutral-900 dark:text-white">
              Final Footprint Result: {areaVal.toFixed(2)} {areaUnitStr}
            </div>
          </div>
        </div>

        {/* 2. Volume Formula */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950/80 rounded-xl border border-neutral-150 dark:border-neutral-850">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Section 2: Volume Displacement
            </span>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold px-2 py-0.5 rounded-full">
              Volume Solution
            </span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-neutral-400">Formula: </span>
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded font-mono text-neutral-800 dark:text-neutral-200">
                {isMetric ? 'Volume (m³) = Length × Width × Height' : 'Volume (Cubic Yards) = (Length × Width × Height) / 27'}
              </code>
            </div>
            <div>
              <span className="text-neutral-400">Substitution: </span>
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded font-mono text-neutral-800 dark:text-neutral-200">
                {isMetric 
                  ? `Volume = ${lenVal} × ${widVal} × ${htVal}` 
                  : `Volume = (${lenVal} × ${widVal} × ${htVal}) / 27`}
              </code>
            </div>
            <div>
              <span className="text-neutral-400">Calculation: </span>
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded font-mono text-neutral-800 dark:text-neutral-200">
                {isMetric 
                  ? `Volume = ${(lenVal * widVal * htVal).toFixed(2)} m³` 
                  : `Volume = ${((lenVal * widVal * htVal) / 27).toFixed(2)} Cubic Yards`}
              </code>
            </div>
            <div className="pt-1.5 border-t border-neutral-200 dark:border-neutral-850 font-bold text-neutral-900 dark:text-white">
              Final Volume Result: {volVal.toFixed(2)} {volUnitStr}
            </div>
          </div>
        </div>

        {/* 3. Cost Estimate Formula */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950/80 rounded-xl border border-neutral-150 dark:border-neutral-850">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Section 3: Cumulative Financial Budgeting
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
              Cost Solution
            </span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-neutral-400">Formula: </span>
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded font-mono text-neutral-800 dark:text-neutral-200">
                Base Subtotal = Materials + Labor + Equipment + Transport + Other
                <br />
                Grand Total = Base Subtotal × (1 + Tax %)
              </code>
            </div>
            <div>
              <span className="text-neutral-400">Substitution: </span>
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded font-mono text-neutral-800 dark:text-neutral-200 text-left block max-w-full overflow-x-auto whitespace-pre">
                Subtotal = ${costDetails.materials.toLocaleString()} + ${costDetails.labor.toLocaleString()} + ${costDetails.equipment.toLocaleString()} + ${costDetails.transport.toLocaleString()} + ${costDetails.other.toLocaleString()}
              </code>
            </div>
            <div>
              <span className="text-neutral-400">Calculation: </span>
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded font-mono text-neutral-800 dark:text-neutral-200">
                Grand Total = ${(costDetails.grandTotal).toLocaleString()} (Includes taxes)
              </code>
            </div>
            <div className="pt-1.5 border-t border-neutral-200 dark:border-neutral-850 font-bold text-neutral-900 dark:text-white">
              Cumulative Estimated Budget: ${costDetails.grandTotal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
