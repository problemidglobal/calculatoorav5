import React, { useState } from 'react';
import { Target, Shuffle, HelpCircle, Sparkles, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { GradeScale, Semester } from '../types/gpa';

interface GpaPlannerProps {
  scale: GradeScale;
  priorGpa: string;
  priorCredits: string;
  semesters: Semester[];
}

export default function GpaPlanner({ scale, priorGpa, priorCredits, semesters }: GpaPlannerProps) {
  // Planner State
  const [targetGpa, setTargetGpa] = useState('');
  const [remainingCredits, setRemainingCredits] = useState('');
  
  // Converter State
  const [convertType, setConvertType] = useState<'letter' | 'percent' | 'points'>('letter');
  const [convertLetter, setConvertLetter] = useState('A');
  const [convertPercent, setConvertPercent] = useState('');
  const [convertPoints, setConvertPoints] = useState('');

  // What-If State
  const [whatIfCourseId, setWhatIfCourseId] = useState('');
  const [whatIfHypotheticalGrade, setWhatIfHypotheticalGrade] = useState('');

  // Flatten active registered courses
  const allCourses = semesters.flatMap(s => s.courses.map(c => ({ ...c, semesterName: s.name })));
  const validCourses = allCourses.filter(c => {
    const cred = parseFloat(c.credits);
    return !isNaN(cred) && cred > 0 && c.grade !== '';
  });

  // Calculate current base metrics
  let currentCredits = 0;
  let currentQP = 0;
  let weightedQP = 0;

  validCourses.forEach(c => {
    const cred = parseFloat(c.credits);
    const match = scale.grades.find(g => g.label === c.grade);
    let basePoints = match ? match.value : parseFloat(c.grade);
    if (isNaN(basePoints)) basePoints = 0;

    let weightVal = 0;
    if (c.weightType === 'honors' || c.weightType === 'college') {
      weightVal = 0.5;
    } else if (c.weightType === 'ap' || c.weightType === 'ib') {
      weightVal = 1.0;
    } else if (c.weightType === 'custom') {
      weightVal = parseFloat(c.customWeightPoints) || 0;
    }

    currentCredits += cred;
    currentQP += basePoints * cred;
    weightedQP += (basePoints + weightVal) * cred;
  });

  // Prior cumulative blend
  const priorG = parseFloat(priorGpa);
  const priorC = parseFloat(priorCredits);
  let blendedCredits = currentCredits;
  let blendedQP = currentQP;

  if (!isNaN(priorG) && priorG >= 0 && !isNaN(priorC) && priorC > 0) {
    blendedCredits = currentCredits + priorC;
    blendedQP = currentQP + (priorG * priorC);
  }

  const currentBlendedGpa = blendedCredits > 0 ? blendedQP / blendedCredits : 0;

  // Future Planner Calculations
  const target = parseFloat(targetGpa);
  const remaining = parseFloat(remainingCredits);

  let plannerResult: {
    status: 'empty' | 'impossible' | 'achieved' | 'possible';
    requiredGpa?: number;
    bestCaseGpa?: number;
    worstCaseGpa?: number;
    message?: string;
  } = { status: 'empty' };

  if (!isNaN(target) && target > 0 && !isNaN(remaining) && remaining > 0) {
    const totalFutureCredits = blendedCredits + remaining;
    
    // Best case: straight A's (max scale) in all remaining credits
    const bestCaseQP = blendedQP + (scale.max * remaining);
    const bestCaseGpa = bestCaseQP / totalFutureCredits;

    // Worst case: F's (0.0) in all remaining credits
    const worstCaseQP = blendedQP + (0.0 * remaining);
    const worstCaseGpa = worstCaseQP / totalFutureCredits;

    // Required GPA to reach exact target
    const targetQP = target * totalFutureCredits;
    const requiredQP = targetQP - blendedQP;
    const requiredGpa = requiredQP / remaining;

    if (currentBlendedGpa >= target && requiredGpa <= 0) {
      plannerResult = {
        status: 'achieved',
        bestCaseGpa,
        worstCaseGpa,
        message: `Your current cumulative GPA of ${currentBlendedGpa.toFixed(2)} is already at or above your target of ${target.toFixed(2)}! Maintain solid efforts to lock in your credentials.`
      };
    } else if (requiredGpa > scale.max) {
      plannerResult = {
        status: 'impossible',
        bestCaseGpa,
        worstCaseGpa,
        requiredGpa,
        message: `Your target of ${target.toFixed(2)} is mathematically impossible. Even if you achieve a perfect ${scale.max.toFixed(2)} in all remaining ${remaining} credits, your maximum final cumulative GPA will be ${bestCaseGpa.toFixed(2)}.`
      };
    } else if (requiredGpa < 0) {
      plannerResult = {
        status: 'achieved',
        bestCaseGpa,
        worstCaseGpa,
        message: `Target achieved! You need a GPA of 0.0 or higher in your remaining credits to secure your target.`
      };
    } else {
      plannerResult = {
        status: 'possible',
        requiredGpa,
        bestCaseGpa,
        worstCaseGpa,
        message: `To achieve your target GPA of ${target.toFixed(2)}, you must maintain a minimum average GPA of ${requiredGpa.toFixed(2)} across your remaining ${remaining} credits.`
      };
    }
  }

  // Grade Converter Calculations
  let convertedResults: { label: string; value: string }[] = [];
  if (convertType === 'letter') {
    const match = scale.grades.find(g => g.label === convertLetter);
    if (match) {
      convertedResults = [
        { label: 'Grade Points', value: match.value.toFixed(2) },
        { label: 'Percentage Range', value: match.minPercent !== undefined ? `${match.minPercent}% - ${match.maxPercent}%` : 'N/A' },
        { label: '5.0 Scale Equivalent', value: ((match.value / scale.max) * 5).toFixed(2) },
        { label: '10.0 Scale Equivalent', value: ((match.value / scale.max) * 10).toFixed(2) }
      ];
    }
  } else if (convertType === 'percent') {
    const pct = parseFloat(convertPercent);
    if (!isNaN(pct) && pct >= 0 && pct <= 100) {
      const match = scale.grades.find(g => g.minPercent !== undefined && g.maxPercent !== undefined && pct >= g.minPercent && pct <= g.maxPercent);
      const pointsVal = match ? match.value : (pct / 100) * scale.max;
      convertedResults = [
        { label: 'Assigned Letter Grade', value: match ? match.label : 'N/A' },
        { label: 'Grade Points', value: pointsVal.toFixed(2) },
        { label: '5.0 Scale Equivalent', value: ((pointsVal / scale.max) * 5).toFixed(2) },
        { label: '10.0 Scale Equivalent', value: ((pointsVal / scale.max) * 10).toFixed(2) }
      ];
    }
  } else if (convertType === 'points') {
    const pts = parseFloat(convertPoints);
    if (!isNaN(pts) && pts >= 0 && pts <= scale.max) {
      const match = scale.grades.find(g => Math.abs(g.value - pts) < 0.1);
      convertedResults = [
        { label: 'Approximate Letter Grade', value: match ? match.label : 'Custom Point' },
        { label: 'Percentage Equivalent', value: `${((pts / scale.max) * 100).toFixed(0)}%` },
        { label: '5.0 Scale Equivalent', value: ((pts / scale.max) * 5).toFixed(2) },
        { label: '10.0 Scale Equivalent', value: ((pts / scale.max) * 10).toFixed(2) }
      ];
    }
  }

  // What-If Sandbox Calculations
  let whatIfResult: {
    originalGpa: number;
    simulatedGpa: number;
    difference: string;
    description: string;
  } | null = null;

  if (whatIfCourseId && whatIfHypotheticalGrade) {
    const targetCourse = validCourses.find(c => c.id === whatIfCourseId);
    if (targetCourse) {
      // Find old points
      const oldMatch = scale.grades.find(g => g.label === targetCourse.grade);
      const oldPoints = oldMatch ? oldMatch.value : parseFloat(targetCourse.grade) || 0;

      // Find new points
      const newMatch = scale.grades.find(g => g.label === whatIfHypotheticalGrade);
      const newPoints = newMatch ? newMatch.value : parseFloat(whatIfHypotheticalGrade) || 0;

      const credits = parseFloat(targetCourse.credits) || 0;
      
      const originalQP = blendedQP;
      const originalCredits = blendedCredits;

      const simulatedQP = originalQP - (oldPoints * credits) + (newPoints * credits);
      const simulatedGpa = originalCredits > 0 ? simulatedQP / originalCredits : 0;

      const diff = simulatedGpa - currentBlendedGpa;
      const formattedDiff = diff >= 0 ? `+${diff.toFixed(3)}` : `${diff.toFixed(3)}`;

      whatIfResult = {
        originalGpa: currentBlendedGpa,
        simulatedGpa,
        difference: formattedDiff,
        description: `Simulating changing "${targetCourse.name}" from a "${targetCourse.grade}" to a "${whatIfHypotheticalGrade}" adjusts your overall GPA by ${formattedDiff} points.`
      };
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* GPA Future Target Planner */}
      <div className="bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-md space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            GPA Target Planner
          </h3>
          <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1]">
            Set your target GPA and remaining credits to see your path to success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wide">
              Target Cumulative GPA
            </label>
            <input
              type="number"
              step="0.01"
              value={targetGpa}
              onChange={(e) => setTargetGpa(e.target.value)}
              placeholder="e.g. 3.80"
              className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-[#111827] dark:text-[#F9FAFB] placeholder-slate-400 dark:placeholder-neutral-500 shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wide">
              Remaining Credits
            </label>
            <input
              type="number"
              step="1"
              value={remainingCredits}
              onChange={(e) => setRemainingCredits(e.target.value)}
              placeholder="e.g. 30"
              className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-[#111827] dark:text-[#F9FAFB] placeholder-slate-400 dark:placeholder-neutral-500 shadow-sm"
            />
          </div>
        </div>

        {plannerResult.status !== 'empty' && (
          <div className={`p-4 rounded-xl border ${
            plannerResult.status === 'impossible'
              ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 text-rose-900 dark:text-rose-200'
              : plannerResult.status === 'achieved'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200'
                : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 text-blue-900 dark:text-blue-200'
          } space-y-3`}>
            <div className="flex items-start gap-2.5">
              {plannerResult.status === 'impossible' ? (
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              ) : (
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              <p className="text-xs leading-relaxed font-semibold">
                {plannerResult.message}
              </p>
            </div>

            {/* Sub-breakdown parameters */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-neutral-800/30 text-xs">
              <div>
                <span className="text-[#4B5563] dark:text-[#CBD5E1] block font-medium">Best Case GPA (Straight A's):</span>
                <span className="font-extrabold text-[#111827] dark:text-[#F9FAFB] text-sm">
                  {plannerResult.bestCaseGpa?.toFixed(3) || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[#4B5563] dark:text-[#CBD5E1] block font-medium">Worst Case GPA (F's):</span>
                <span className="font-extrabold text-[#111827] dark:text-[#F9FAFB] text-sm">
                  {plannerResult.worstCaseGpa?.toFixed(3) || 'N/A'}
                </span>
              </div>
              {plannerResult.requiredGpa !== undefined && (
                <div className="col-span-2">
                  <span className="text-[#4B5563] dark:text-[#CBD5E1] block font-medium">Required Average GPA on Remaining credits:</span>
                  <span className={`text-base font-extrabold ${
                    plannerResult.status === 'impossible' ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-cyan-400'
                  }`}>
                    {plannerResult.requiredGpa.toFixed(3)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* What-If Sandbox Simulation */}
      <div className="bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-md space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-cyan-500" />
            What-If Sandbox Simulator
          </h3>
          <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1]">
            Tweak any course grade to see how it changes your overall cumulative average.
          </p>
        </div>

        {validCourses.length === 0 ? (
          <div className="py-8 text-center text-[#4B5563] dark:text-[#CBD5E1] text-xs border border-dashed border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50/50 dark:bg-neutral-950/10">
            Input registered courses first to unlock What-If grade simulation.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wide">
                  Select Course
                </label>
                <select
                  value={whatIfCourseId}
                  onChange={(e) => setWhatIfCourseId(e.target.value)}
                  className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB]"
                >
                  <option value="">-- Select Active Course --</option>
                  {validCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.grade}, {c.credits}cr)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wide">
                  Hypothetical Grade
                </label>
                <select
                  value={whatIfHypotheticalGrade}
                  onChange={(e) => setWhatIfHypotheticalGrade(e.target.value)}
                  className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB]"
                >
                  <option value="">-- Choose Target Grade --</option>
                  {scale.grades.map((g) => (
                    <option key={g.label} value={g.label}>
                      {g.label} ({g.value.toFixed(2)} pts)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {whatIfResult && (
              <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/30 rounded-xl space-y-2">
                <p className="text-xs text-cyan-900 dark:text-cyan-200 font-semibold leading-relaxed">
                  {whatIfResult.description}
                </p>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-cyan-100/30">
                  <span className="text-[#4B5563] dark:text-[#CBD5E1]">Current Combined GPA:</span>
                  <span className="font-bold text-[#111827] dark:text-[#F9FAFB]">{whatIfResult.originalGpa.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#4B5563] dark:text-[#CBD5E1]">Simulated Combined GPA:</span>
                  <span className="font-extrabold text-blue-600 dark:text-cyan-400">{whatIfResult.simulatedGpa.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#4B5563] dark:text-[#CBD5E1]">Absolute Difference:</span>
                  <span className={`font-black ${
                    parseFloat(whatIfResult.difference) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {whatIfResult.difference}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instant Grade Converter Tool */}
      <div className="md:col-span-2 bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-md space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8b5cf6]" />
            Instant Scale Grade Converter
          </h3>
          <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1]">
            Convert score metrics seamlessly between standard Letter Grades, Percentages, and Grade Point configurations.
          </p>
        </div>

        {/* Input Toggle */}
        <div className="flex bg-slate-100 dark:bg-neutral-800/80 p-1 rounded-xl w-fit border border-slate-200 dark:border-neutral-750">
          {[
            { id: 'letter', name: 'Letter Grade' },
            { id: 'percent', name: 'Percentage' },
            { id: 'points', name: 'Grade Points' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setConvertType(type.id as any)}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                convertType === type.id
                  ? 'bg-white dark:bg-neutral-700 text-[#111827] dark:text-[#F9FAFB] shadow-md'
                  : 'text-[#4B5563] dark:text-[#CBD5E1] hover:text-[#111827] dark:hover:text-[#F9FAFB]'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        {/* Converter Forms */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wide">
              {convertType === 'letter' ? 'Letter Grade Value' : convertType === 'percent' ? 'Percentage Score (0-100)' : 'Grade Points Input'}
            </label>
            {convertType === 'letter' ? (
              <select
                value={convertLetter}
                onChange={(e) => setConvertLetter(e.target.value)}
                className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB]"
              >
                {scale.grades.map((g) => (
                  <option key={g.label} value={g.label}>
                    {g.label}
                  </option>
                ))}
              </select>
            ) : convertType === 'percent' ? (
              <input
                type="number"
                min="0"
                max="100"
                value={convertPercent}
                onChange={(e) => setConvertPercent(e.target.value)}
                placeholder="e.g. 95"
                className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB]"
              />
            ) : (
              <input
                type="number"
                step="0.01"
                min="0"
                max={scale.max}
                value={convertPoints}
                onChange={(e) => setConvertPoints(e.target.value)}
                placeholder={`e.g. 3.70 (Max: ${scale.max})`}
                className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB]"
              />
            )}
          </div>

          <div className="md:col-span-7">
            {convertedResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-neutral-950/40 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                {convertedResults.map((res, i) => (
                  <div key={i} className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#4B5563] dark:text-[#CBD5E1] block">{res.label}</span>
                    <span className="text-sm font-extrabold text-[#111827] dark:text-[#F9FAFB]">{res.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-[#4B5563] dark:text-[#CBD5E1] italic bg-slate-50/50 dark:bg-neutral-950/15 rounded-xl border border-dashed border-slate-200 dark:border-neutral-800">
                Enter conversion metrics on the left.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
