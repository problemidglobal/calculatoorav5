import React, { useRef } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie,
  AreaChart,
  Area
} from 'recharts';
import { 
  GraduationCap, 
  Download, 
  TrendingUp, 
  Layers, 
  Award, 
  Activity, 
  PieChart as PieIcon, 
  Trophy, 
  Sparkles,
  Bookmark
} from 'lucide-react';
import { Semester, GradeScale } from '../types/gpa';

interface GpaDashboardProps {
  semesters: Semester[];
  scale: GradeScale;
  priorGpa: string;
  priorCredits: string;
  targetGpa: string;
}

export default function GpaDashboard({ semesters, scale, priorGpa, priorCredits, targetGpa }: GpaDashboardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Flatten courses across all semesters
  const allCourses = semesters.flatMap(s => s.courses.map(c => ({ ...c, semesterName: s.name })));
  const validCourses = allCourses.filter(c => {
    const cred = parseFloat(c.credits);
    return !isNaN(cred) && cred > 0 && c.grade !== '';
  });

  // Calculate stats
  let totalCredits = 0;
  let totalUnweightedQP = 0;
  let totalWeightedQP = 0;
  let highestGp = -1;
  let lowestGp = 999;
  let highestGradeName = 'N/A';
  let lowestGradeName = 'N/A';

  const categoryMap: Record<string, number> = {};
  const gradeFrequency: Record<string, number> = {};

  validCourses.forEach(c => {
    const cred = parseFloat(c.credits);
    totalCredits += cred;

    // Resolve grade scale value
    const match = scale.grades.find(g => g.label === c.grade);
    let basePoints = match ? match.value : parseFloat(c.grade);
    if (isNaN(basePoints)) basePoints = 0;

    // Track min/max grades
    if (basePoints > highestGp) {
      highestGp = basePoints;
      highestGradeName = c.grade;
    }
    if (basePoints < lowestGp) {
      lowestGp = basePoints;
      lowestGradeName = c.grade;
    }

    // Resolve weights
    let weightVal = 0;
    if (c.weightType === 'honors' || c.weightType === 'college') {
      weightVal = 0.5;
    } else if (c.weightType === 'ap' || c.weightType === 'ib') {
      weightVal = 1.0;
    } else if (c.weightType === 'custom') {
      weightVal = parseFloat(c.customWeightPoints) || 0;
    }

    const weightedPoints = basePoints + weightVal;

    totalUnweightedQP += basePoints * cred;
    totalWeightedQP += weightedPoints * cred;

    // Categories
    const cat = c.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + cred;

    // Grades freq
    gradeFrequency[c.grade] = (gradeFrequency[c.grade] || 0) + 1;
  });

  const unweightedGpa = totalCredits > 0 ? totalUnweightedQP / totalCredits : 0;
  const weightedGpa = totalCredits > 0 ? totalWeightedQP / totalCredits : 0;

  // Previous cumulative GPA blend
  const priorG = parseFloat(priorGpa);
  const priorC = parseFloat(priorCredits);
  let combinedGpa = unweightedGpa;
  let combinedCredits = totalCredits;
  let combinedQualityPoints = totalUnweightedQP;

  if (!isNaN(priorG) && priorG >= 0 && !isNaN(priorC) && priorC > 0) {
    combinedCredits = totalCredits + priorC;
    combinedQualityPoints = totalUnweightedQP + (priorG * priorC);
    combinedGpa = combinedCredits > 0 ? combinedQualityPoints / combinedCredits : 0;
  }

  // Calculate per-semester GPAs
  const semesterData = semesters.map(s => {
    let sCredits = 0;
    let sUnweightedQP = 0;
    let sWeightedQP = 0;

    s.courses.forEach(c => {
      const cred = parseFloat(c.credits);
      if (!isNaN(cred) && cred > 0 && c.grade !== '') {
        sCredits += cred;
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

        sUnweightedQP += basePoints * cred;
        sWeightedQP += (basePoints + weightVal) * cred;
      }
    });

    const sUnweightedGpa = sCredits > 0 ? sUnweightedQP / sCredits : 0;
    const sWeightedGpa = sCredits > 0 ? sWeightedQP / sCredits : 0;

    return {
      name: s.name || 'Unnamed Term',
      unweighted: parseFloat(sUnweightedGpa.toFixed(2)),
      weighted: parseFloat(sWeightedGpa.toFixed(2)),
      credits: sCredits,
      qualityPoints: parseFloat(sUnweightedQP.toFixed(2))
    };
  }).filter(s => s.credits > 0);

  // Recharts Chart Formats
  const gradeDistributionData = Object.keys(gradeFrequency).map(key => ({
    name: key,
    count: gradeFrequency[key]
  })).sort((a, b) => b.count - a.count);

  const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#64748b'];
  const categoryDistributionData = Object.keys(categoryMap).map((key, i) => ({
    name: key,
    value: categoryMap[key],
    color: colors[i % colors.length]
  }));

  // Target GPA progress percentage
  const targetVal = parseFloat(targetGpa);
  let targetProgress = 0;
  if (!isNaN(targetVal) && targetVal > 0) {
    targetProgress = Math.min(100, Math.max(0, (combinedGpa / targetVal) * 100));
  }

  // Actionable Insights text
  const insights: string[] = [];
  if (validCourses.length > 0) {
    if (semesterData.length >= 2) {
      const last = semesterData[semesterData.length - 1];
      const prev = semesterData[semesterData.length - 2];
      if (last.unweighted > prev.unweighted) {
        insights.push(`Your unweighted GPA improved from ${prev.unweighted.toFixed(2)} in ${prev.name} to ${last.unweighted.toFixed(2)} in ${last.name}! Stellar progress!`);
      } else if (last.unweighted < prev.unweighted) {
        insights.push(`Your GPA dropped slightly this term. Use the What-If tool below to simulate better grade strategies.`);
      }
    }

    // High contributor category
    let maxCat = '';
    let maxCatCred = 0;
    Object.keys(categoryMap).forEach(k => {
      if (categoryMap[k] > maxCatCred) {
        maxCatCred = categoryMap[k];
        maxCat = k;
      }
    });
    if (maxCat) {
      insights.push(`Courses in the "${maxCat}" category are your largest academic driver, contributing ${maxCatCred} total credits.`);
    }

    // What-If quick suggestion
    const improveCandidate = validCourses.find(c => {
      const match = scale.grades.find(g => g.label === c.grade);
      return match && match.value < scale.max; // anything below straight A / max grade
    });
    if (improveCandidate) {
      const oldCred = parseFloat(improveCandidate.credits);
      const match = scale.grades.find(g => g.label === improveCandidate.grade);
      const curGp = match ? match.value : 0;
      const hypotheticalQP = totalUnweightedQP - (curGp * oldCred) + (scale.max * oldCred);
      const hypotheticalGpa = hypotheticalQP / totalCredits;
      const difference = hypotheticalGpa - unweightedGpa;
      if (difference > 0.005) {
        insights.push(`Raising your grade in "${improveCandidate.name}" to top grade (${scale.grades[0]?.label || 'A'}) would boost your unweighted GPA by approximately +${difference.toFixed(2)} (to ${hypotheticalGpa.toFixed(2)}).`);
      }
    }
  }

  // Export beautiful card to PNG
  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = '#0f172a'; // Deep slate
    ctx.fillRect(0, 0, 800, 500);

    // Decorative gradient circle
    const grad = ctx.createRadialGradient(400, 250, 50, 400, 250, 400);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 500);

    // Blue premium top bar
    const topBarGrad = ctx.createLinearGradient(0, 0, 800, 0);
    topBarGrad.addColorStop(0, '#2563eb');
    topBarGrad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = topBarGrad;
    ctx.fillRect(0, 0, 800, 10);

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('CALCULATOORA', 50, 60);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 14px monospace';
    ctx.fillText('OFFICIAL ACADEMIC REPORT CARD', 50, 85);

    // Date
    ctx.fillStyle = '#06b6d4';
    ctx.font = '500 14px sans-serif';
    ctx.fillText(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }), 620, 60);

    // Draw main GPA Badge
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(50, 120, 320, 320, 16);
    ctx.fill();
    ctx.stroke();

    // Large GPA Number
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('CUMULATIVE GPA', 90, 180);

    const gpaGrad = ctx.createLinearGradient(90, 260, 260, 260);
    gpaGrad.addColorStop(0, '#3b82f6');
    gpaGrad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = gpaGrad;
    ctx.font = 'bold 96px sans-serif';
    ctx.fillText(combinedGpa.toFixed(2), 90, 270);

    // Sub-badges in Left Card
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`Weighted GPA: ${weightedGpa.toFixed(2)}`, 90, 320);
    ctx.fillText(`Unweighted GPA: ${unweightedGpa.toFixed(2)}`, 90, 345);
    ctx.fillText(`Total Credits Earned: ${combinedCredits.toFixed(1)}`, 90, 370);
    ctx.fillText(`Calculated Quality Points: ${combinedQualityPoints.toFixed(1)}`, 90, 395);

    // Draw right panel with semester table
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Semester Breakdown', 410, 145);

    ctx.fillStyle = '#334155';
    ctx.fillRect(410, 165, 340, 2);

    let startY = 200;
    if (semesterData.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 14px sans-serif';
      ctx.fillText('No academic records inputted yet.', 410, startY);
    } else {
      semesterData.slice(0, 5).forEach((sem) => {
        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 14px sans-serif';
        ctx.fillText(sem.name, 410, startY);

        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(`GPA: ${sem.unweighted.toFixed(2)}`, 670, startY);

        ctx.fillStyle = '#64748b';
        ctx.font = '500 12px sans-serif';
        ctx.fillText(`${sem.credits} credits  |  ${sem.qualityPoints} Quality Points`, 410, startY + 20);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(410, startY + 32, 340, 1);

        startY += 50;
      });
    }

    // Footer Branding
    ctx.fillStyle = '#475569';
    ctx.font = '12px monospace';
    ctx.fillText('Verified with Calculatoora Engine • Playback Key: CLIENT_PERSIST_OK', 50, 475);

    // Trigger download
    const link = document.createElement('a');
    link.download = 'GPA_Academic_Report_Calculatoora.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const hasData = validCourses.length > 0;

  return (
    <div className="space-y-8">
      {/* Offscreen Canvas for Export */}
      <canvas ref={canvasRef} width={800} height={500} className="hidden" />

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cumulative GPA Card */}
        <div className="relative group bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-3 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-bl-2xl">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider block mb-1">Cumulative GPA</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
              {combinedGpa.toFixed(2)}
            </span>
            <span className="text-xs text-[#4B5563] dark:text-[#CBD5E1] font-mono">/ {scale.max.toFixed(1)}</span>
          </div>
          <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1] mt-2 leading-relaxed">
            {priorC > 0 
              ? `Weighted blend of historical records & ${totalCredits.toFixed(1)} new credits.`
              : `Overall academic average based on registered course credits.`}
          </p>
        </div>

        {/* Weighted vs Unweighted */}
        <div className="relative group bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-3 bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 rounded-bl-2xl">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider block mb-1">Weighted / Unweighted</span>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#374151] dark:text-[#D1D5DB] text-xs">Weighted:</span>
              <span className="text-blue-600 dark:text-cyan-400 font-bold">{weightedGpa.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#374151] dark:text-[#D1D5DB] text-xs">Unweighted:</span>
              <span className="text-[#111827] dark:text-[#F9FAFB] font-semibold">{unweightedGpa.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1] mt-2.5">
            Weighted incorporates AP, IB, College, and Honors rigor modifiers.
          </p>
        </div>

        {/* Academic Standings */}
        <div className="relative group bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-bl-2xl">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider block mb-1">Academic standing</span>
          <span className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB] block truncate">
            {combinedGpa >= 3.8 
              ? 'Summa Cum Laude' 
              : combinedGpa >= 3.6 
                ? 'Magna Cum Laude' 
                : combinedGpa >= 3.5 
                  ? "Dean's List Elite" 
                  : combinedGpa >= 3.0 
                    ? 'First Class Honors' 
                    : combinedGpa >= 2.0 
                      ? 'Satisfactory Standings' 
                      : hasData 
                        ? 'Academic Concern' 
                        : 'No Data Inputted'}
          </span>
          <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1] mt-2.5">
            {hasData 
              ? `Best grade: ${highestGradeName} | Lowest: ${lowestGradeName}`
              : 'Add your courses to evaluate honor classifications.'}
          </p>
        </div>

        {/* Credits Completed */}
        <div className="relative group bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-3 bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 rounded-bl-2xl">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider block mb-1">Total Credits Earned</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
              {combinedCredits.toFixed(1)}
            </span>
            <span className="text-xs text-[#4B5563] dark:text-[#CBD5E1]">Credits</span>
          </div>
          <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1] mt-2">
            Accumulated {combinedQualityPoints.toFixed(1)} overall Quality Points.
          </p>
        </div>
      </div>

      {/* Target Progress and Insights */}
      {targetVal > 0 && (
        <div className="bg-white/88 dark:bg-[#12141c]/88 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col md:flex-row items-center gap-6 shadow-md">
          <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-slate-100 dark:stroke-neutral-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-blue-500 transition-all duration-1000"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - targetProgress / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-extrabold text-[#111827] dark:text-[#F9FAFB]">{targetProgress.toFixed(0)}%</span>
              <span className="text-[10px] text-[#4B5563] dark:text-[#CBD5E1] uppercase font-bold tracking-wider">Target</span>
            </div>
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
              Target GPA Progress
            </h4>
            <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed max-w-xl">
              You are currently sitting at a combined cumulative GPA of <strong>{combinedGpa.toFixed(2)}</strong> toward your ultimate academic goal of <strong>{targetVal.toFixed(2)}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Visualizations & Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recharts Visualizations */}
        <div className="lg:col-span-8 bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Performance Analytics
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1]">
                Visualizing course weight distributions and performance trends over semesters.
              </p>
            </div>
            {hasData && (
              <button
                onClick={handleDownloadPNG}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl text-xs shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer animate-none"
              >
                <Download className="w-4 h-4" />
                Download Report Card PNG
              </button>
            )}
          </div>

          {!hasData ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-neutral-800 rounded-xl">
              <PieIcon className="w-10 h-10 text-slate-400 dark:text-neutral-500 mb-2" />
              <h5 className="font-bold text-[#111827] dark:text-[#F9FAFB] text-sm">No Active Graphics</h5>
              <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1] max-w-xs mt-1">
                Enter your course list and grades in the semester tables to generate trend graphs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Semester GPA Trend */}
              <div className="bg-slate-50 dark:bg-neutral-950/40 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                <h4 className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  GPA Semester Trend
                </h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={semesterData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" className="hidden dark:block" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} domain={[0, Math.max(scale.max, 4.0)]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#12141c', 
                          border: '1px solid #334155', 
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px'
                        }} 
                      />
                      <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" dataKey="unweighted" name="Unweighted" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="weighted" name="Weighted" stroke="#06b6d4" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Credit Distribution by Category */}
              <div className="bg-slate-50 dark:bg-neutral-950/40 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                <h4 className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <PieIcon className="w-4 h-4 text-cyan-500" />
                  Credits by Course Type
                </h4>
                <div className="h-48 w-full flex items-center justify-center">
                  {categoryDistributionData.length === 0 ? (
                    <span className="text-xs text-[#4B5563] dark:text-[#CBD5E1]">No categories</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                           data={categoryDistributionData}
                           cx="50%"
                           cy="50%"
                           innerRadius={45}
                           outerRadius={70}
                           paddingAngle={3}
                           dataKey="value"
                        >
                          {categoryDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: '#12141c', 
                            border: '1px solid #334155', 
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '11px'
                          }}
                        />
                        <Legend iconSize={8} iconType="square" layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Grade Frequency */}
              <div className="bg-slate-50 dark:bg-neutral-950/40 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                <h4 className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-emerald-500" />
                  Grade Frequency
                </h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistributionData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" className="hidden dark:block" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#12141c', 
                          border: '1px solid #334155', 
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px'
                        }}
                      />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]}>
                        {gradeDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weighted vs Unweighted comparison bar */}
              <div className="bg-slate-50 dark:bg-neutral-950/40 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                <h4 className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  Rigor Impact
                </h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={semesterData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" className="hidden dark:block" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} domain={[0, Math.max(scale.max, 4.0)]} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#12141c', 
                          border: '1px solid #334155', 
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px'
                        }}
                      />
                      <Area type="monotone" dataKey="weighted" name="Weighted" stroke="#06b6d4" fill="rgba(6, 182, 212, 0.15)" />
                      <Area type="monotone" dataKey="unweighted" name="Unweighted" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.05)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Smart Rule-Based Insights */}
        <div className="lg:col-span-4 bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-md h-fit space-y-4">
          <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Smart Academic Insights
          </h3>
          <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1]">
            Real-time rule-based pointers analyzing your grades and class credits.
          </p>

          {insights.length === 0 ? (
            <div className="py-8 text-center text-[#4B5563] dark:text-[#CBD5E1] text-xs">
              Fill in your class grades to trigger smart suggestions and warnings.
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-neutral-950/40 rounded-xl border border-slate-200 dark:border-neutral-800 text-xs text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed flex items-start gap-2">
                  <span className="text-blue-500 dark:text-cyan-400 text-base leading-none select-none">•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
