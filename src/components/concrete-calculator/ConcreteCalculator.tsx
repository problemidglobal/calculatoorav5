import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  Layers,
  Scale,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Clipboard,
  Check,
  Printer,
  Download,
  FileText,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Calculator,
  ChevronDown,
  Sliders,
  ChevronUp,
  Info,
  Layers3,
  Calendar,
  Construction,
  Award,
  CircleDot
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';

import { CalcMode, LengthUnit, VolumeUnit } from './types';
import { runCalculation, fromM3, toMeters, convertWeight } from './utils';
import { EducationalContent } from './EducationalContent';

export default function ConcreteCalculator() {
  // Tabs and general settings
  const [activeTab, setActiveTab] = useState<CalcMode>('slab');
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Input States (All start completely EMPTY for compliance with "IMPORTANT INPUT RULE")
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [units, setUnits] = useState<Record<string, LengthUnit>>({});

  // Optional general variables
  const [wastePct, setWastePct] = useState<string>('');
  const [bagSize, setBagSize] = useState<string>(''); // e.g. "80lb", "60lb", "40kg", etc.
  const [customBagWeight, setCustomBagWeight] = useState<string>('');
  const [concreteDensity, setConcreteDensity] = useState<string>(''); // in kg/m³ or lb/ft³
  const [mixRatio, setMixRatio] = useState<string>(''); // e.g. "1:2:4"

  // Cost inputs
  const [costPerUnit, setCostPerUnit] = useState<string>('');
  const [deliveryCost, setDeliveryCost] = useState<string>('');
  const [pumpCost, setPumpCost] = useState<string>('');
  const [laborCost, setLaborCost] = useState<string>('');
  const [otherCost, setOtherCost] = useState<string>('');

  // What-If Analysis States
  const [whatIfEnabled, setWhatIfEnabled] = useState<boolean>(false);
  const [whatIfThickness, setWhatIfThickness] = useState<number>(0); // percentage shift -50% to +50%
  const [whatIfLength, setWhatIfLength] = useState<number>(0); // percentage shift
  const [whatIfWidth, setWhatIfWidth] = useState<number>(0); // percentage shift
  const [whatIfWaste, setWhatIfWaste] = useState<number>(0); // percentage shift
  const [whatIfCost, setWhatIfCost] = useState<number>(0); // percentage shift

  // Status & Feedback UI
  const [copied, setCopied] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [exampleLoaded, setExampleLoaded] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Default units helper based on System selection
  const getDefaultLengthUnit = (role: 'length' | 'width' | 'thickness' | 'height' | 'depth' | 'diameter'): LengthUnit => {
    if (unitSystem === 'imperial') {
      if (role === 'thickness' || role === 'depth' || role === 'diameter') return 'in';
      return 'ft';
    } else {
      if (role === 'thickness' || role === 'depth') return 'cm';
      return 'm';
    }
  };

  // Re-run unit defaults when unit system flips, but ONLY if we haven't set them yet
  useEffect(() => {
    const freshUnits: Record<string, LengthUnit> = {};
    const keys = ['length', 'width', 'thickness', 'height', 'depth', 'diameter', 'outerDia', 'innerDia', 'rise', 'run', 'landingL', 'landingW', 'landingT', 'curbHeight', 'curbWidth', 'gutterWidth', 'gutterThickness'];
    keys.forEach(k => {
      freshUnits[k] = getDefaultLengthUnit(
        k === 'thickness' || k === 'depth' || k === 'gutterThickness' ? 'thickness' :
        k === 'diameter' || k === 'outerDia' || k === 'innerDia' ? 'diameter' : 'length'
      );
    });
    setUnits(freshUnits);
  }, [unitSystem, activeTab]);

  // Handle single input field update with positive validation check
  const handleInputChange = (key: string, val: string) => {
    setInputs(prev => ({ ...prev, [key]: val }));

    // Reactive friendly validation
    const num = parseFloat(val);
    if (val !== '' && (isNaN(num) || num <= 0)) {
      setValidationErrors(prev => ({ ...prev, [key]: 'Value must be greater than zero.' }));
    } else {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  // Handle unit change for a field
  const handleUnitChange = (key: string, val: LengthUnit) => {
    setUnits(prev => ({ ...prev, [key]: val }));
  };

  // Calculate results incorporating What-If percentages
  const getModifiedInputs = () => {
    const copy = { ...inputs };
    if (!whatIfEnabled) return copy;

    const applyShift = (valStr: string, pct: number) => {
      const val = parseFloat(valStr);
      if (isNaN(val)) return '';
      return (val * (1 + pct / 100)).toFixed(4);
    };

    if (copy['length']) copy['length'] = applyShift(copy['length'], whatIfLength);
    if (copy['width']) copy['width'] = applyShift(copy['width'], whatIfWidth);
    if (copy['thickness']) copy['thickness'] = applyShift(copy['thickness'], whatIfThickness);
    if (copy['depth']) copy['depth'] = applyShift(copy['depth'], whatIfThickness);
    if (copy['height']) copy['height'] = applyShift(copy['height'], whatIfLength);
    if (copy['curbHeight']) copy['curbHeight'] = applyShift(copy['curbHeight'], whatIfThickness);

    return copy;
  };

  const modifiedInputs = getModifiedInputs();
  const rawCalc = runCalculation(activeTab, modifiedInputs, units);

  // Waste Calculation
  const activeWastePct = parseFloat(wastePct) || 0;
  const modifiedWastePct = whatIfEnabled ? activeWastePct * (1 + whatIfWaste / 100) : activeWastePct;
  const totalVolumeM3 = rawCalc.volumeM3 * (1 + modifiedWastePct / 100);

  // Density Selection / Calculation
  const defaultDensityKgM3 = 2400; // standard concrete density
  const userDensity = parseFloat(concreteDensity) || 0;
  const activeDensityKgM3 = userDensity > 0
    ? (unitSystem === 'metric' ? userDensity : userDensity * 16.0185) // lb/ft³ to kg/m³
    : defaultDensityKgM3;

  const totalWeightKg = totalVolumeM3 * activeDensityKgM3;

  // Bag Selection and Counts
  const bagOptions: Record<string, { weight: number; label: string; volumeM3: number }> = {
    '80lb': { weight: 80, label: '80 lb Bag', volumeM3: 0.01699 },
    '60lb': { weight: 60, label: '60 lb Bag', volumeM3: 0.01274 },
    '40lb': { weight: 40, label: '40 lb Bag', volumeM3: 0.00849 },
    '50kg': { weight: 50, label: '50 kg Bag', volumeM3: 0.03500 },
    '40kg': { weight: 40, label: '40 kg Bag', volumeM3: 0.02800 },
    '25kg': { weight: 25, label: '25 kg Bag', volumeM3: 0.01750 },
    '20kg': { weight: 20, label: '20 kg Bag', volumeM3: 0.01400 },
  };

  const activeBagType = bagSize || '80lb';
  let bagVolumeM3 = 0.01699;
  let bagWeightLb = 80;

  if (activeBagType === 'custom') {
    const customWt = parseFloat(customBagWeight) || 80;
    // Standard dry mix weight is roughly 133 lbs per cu ft, yield yield factor ~0.0075 cu ft per lb
    const customVolCuFt = customWt * 0.0075;
    bagVolumeM3 = customVolCuFt * 0.0283168;
    bagWeightLb = customWt;
  } else if (bagOptions[activeBagType]) {
    bagVolumeM3 = bagOptions[activeBagType].volumeM3;
    bagWeightLb = activeBagType.endsWith('kg') ? bagOptions[activeBagType].weight * 2.20462 : bagOptions[activeBagType].weight;
  }

  const bagsRequired = totalVolumeM3 > 0 ? Math.ceil(totalVolumeM3 / bagVolumeM3) : 0;

  // Ready Mix Truck Loads
  const truckCapacityYd3 = 10;
  const totalYd3 = fromM3(totalVolumeM3, 'yd³');
  const trucksRequired = totalYd3 > 0 ? Math.ceil(totalYd3 / truckCapacityYd3) : 0;

  // Material Estimator (Dry mix parts)
  let cementM3 = 0, sandM3 = 0, gravelM3 = 0, waterLiters = 0;
  let mixRatioParsed = false;
  let partsSum = 0;

  if (mixRatio) {
    const parts = mixRatio.split(':').map(p => parseFloat(p));
    if (parts.length === 3 && parts.every(p => !isNaN(p) && p > 0)) {
      mixRatioParsed = true;
      const [cementPart, sandPart, gravelPart] = parts;
      partsSum = cementPart + sandPart + gravelPart;

      // 1.54 shrink multiplier for dry mix
      const totalDryVolM3 = totalVolumeM3 * 1.54;
      cementM3 = (cementPart / partsSum) * totalDryVolM3;
      sandM3 = (sandPart / partsSum) * totalDryVolM3;
      gravelM3 = (gravelPart / partsSum) * totalDryVolM3;

      // Water estimated based on standard water-cement ratio of 0.50 by weight
      const cementWeightKg = cementM3 * 1440; // bulk density of cement
      waterLiters = cementWeightKg * 0.5;
    }
  }

  // Cost Estimation
  const activeCostPerUnit = parseFloat(costPerUnit) || 0;
  const modifiedCostPerUnit = whatIfEnabled ? activeCostPerUnit * (1 + whatIfCost / 100) : activeCostPerUnit;

  const unitCostVolume = unitSystem === 'imperial' ? fromM3(totalVolumeM3, 'yd³') : totalVolumeM3;
  const rawMaterialCost = totalVolumeM3 > 0 ? unitCostVolume * modifiedCostPerUnit : 0;

  const extraDeliveryCost = parseFloat(deliveryCost) || 0;
  const extraPumpCost = parseFloat(pumpCost) || 0;
  const extraLaborCost = parseFloat(laborCost) || 0;
  const extraOtherCost = parseFloat(otherCost) || 0;

  const totalCostValue = rawMaterialCost + extraDeliveryCost + extraPumpCost + extraLaborCost + extraOtherCost;

  // Cost per Area (Applicable for Slab, Footing, Wall etc.)
  let totalAreaSqUnit = 0;
  let areaUnit = unitSystem === 'imperial' ? 'sq ft' : 'sq m';

  if (activeTab === 'slab' || activeTab === 'footing') {
    const len = parseFloat(modifiedInputs['length']) || 0;
    const wid = parseFloat(modifiedInputs['width']) || 0;
    if (len > 0 && wid > 0) {
      const lenM = toMeters(len, units['length']);
      const widM = toMeters(wid, units['width']);
      const areaM2 = lenM * widM;
      totalAreaSqUnit = unitSystem === 'imperial' ? areaM2 * 10.7639 : areaM2;
    }
  }

  const costPerArea = totalAreaSqUnit > 0 ? totalCostValue / totalAreaSqUnit : 0;

  // Action: Clear All Inputs
  const handleClearAll = () => {
    setInputs({});
    setWastePct('');
    setBagSize('');
    setCustomBagWeight('');
    setConcreteDensity('');
    setMixRatio('');
    setCostPerUnit('');
    setDeliveryCost('');
    setPumpCost('');
    setLaborCost('');
    setOtherCost('');
    setWhatIfEnabled(false);
    setWhatIfThickness(0);
    setWhatIfLength(0);
    setWhatIfWidth(0);
    setWhatIfWaste(0);
    setWhatIfCost(0);
    setValidationErrors({});
    setExampleLoaded(false);
  };

  // Action: Load Example Data
  const handleLoadExample = () => {
    setExampleLoaded(true);
    setUnitSystem('imperial');
    setInputs({
      length: '24',
      width: '16',
      thickness: '4',
      depth: '1.5',
      height: '8',
      side: '1.5',
      sideA: '1.2',
      sideB: '1.2',
      diameter: '12',
      outerDia: '18',
      innerDia: '12',
      numSteps: '5',
      rise: '7',
      run: '11',
      landingL: '4',
      landingW: '4',
      landingT: '4',
      numHoles: '10',
      curbHeight: '12',
      curbWidth: '6',
      gutterWidth: '12',
      gutterThickness: '6',
      numBlocks: '120'
    });
    setWastePct('10');
    setBagSize('80lb');
    setMixRatio('1:2:4');
    setCostPerUnit('145');
    setDeliveryCost('150');
    setPumpCost('250');
    setLaborCost('800');
    setOtherCost('100');
  };

  // Copy results clipboard action
  const handleCopyResults = () => {
    let txt = `CALCULATOORA - CONCRETE ESTIMATE REPORT\n`;
    txt += `----------------------------------------\n`;
    txt += `Mode: ${activeTab.toUpperCase()}\n`;
    txt += `Volume: ${fromM3(totalVolumeM3, 'yd³').toFixed(3)} Cubic Yards (${totalVolumeM3.toFixed(3)} m³)\n`;
    txt += `Bags Needed (${activeBagType}): ${bagsRequired} bags\n`;
    txt += `Estimated Total Weight: ${(unitSystem === 'imperial' ? totalWeightKg * 2.204 : totalWeightKg).toFixed(0)} ${unitSystem === 'imperial' ? 'lbs' : 'kg'}\n`;
    if (totalCostValue > 0) {
      txt += `Estimated Grand Total Cost: ${currencySymbol}${totalCostValue.toFixed(2)}\n`;
    }
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download visual chart or block structure as PNG image
  const handleDownloadPNG = () => {
    if (containerRef.current) {
      html2canvas(containerRef.current).then(canvas => {
        const link = document.createElement('a');
        link.download = `concrete_calculator_estimate_${activeTab}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  // Print results
  const handlePrint = () => {
    window.print();
  };

  // Smart Insights Generation
  const generateInsights = (): string[] => {
    const list: string[] = [];
    if (totalVolumeM3 <= 0) {
      return ["Please input active values to calculate insights dynamically."];
    }

    const yd3 = fromM3(totalVolumeM3, 'yd³');
    const m3 = totalVolumeM3;

    if (activeTab === 'slab') {
      const currentThick = parseFloat(inputs['thickness']) || 0;
      if (currentThick > 0) {
        const thickerVal = currentThick + (unitSystem === 'imperial' ? 1 : 2.5); // +1 inch or +2.5 cm
        const addedPct = (unitSystem === 'imperial' ? 1 / currentThick : 2.5 / currentThick) * 100;
        list.push(`⚠️ Increasing slab thickness by ${unitSystem === 'imperial' ? '1 inch' : '2.5 cm'} adds approximately ${addedPct.toFixed(0)}% more concrete volume.`);
      }
    }

    if (activeWastePct === 0) {
      list.push(`💡 Tip: Adding a 5% to 10% waste allowance is highly recommended to cover spills, uneven grades, and form flex.`);
    } else if (activeWastePct < 5) {
      list.push(`⚠️ Your 3% waste allowance is thin. A 5% allowance decreases risk of short order fees.`);
    }

    if (trucksRequired > 0) {
      list.push(`🚚 Ordering ready-mix? Your job requires about ${trucksRequired} standard concrete trucks (assuming 10 yd³ capacity per truck).`);
    }

    if (bagsRequired > 40) {
      list.push(`🏗️ Manual Mixing Alert: Over 40 bags of concrete required (${bagsRequired} bags). Consider ordering a ready-mix truck to save labor.`);
    }

    return list;
  };

  const insights = generateInsights();

  // Chart Dataset Compilation
  const getMaterialPieData = () => {
    if (!mixRatioParsed || totalVolumeM3 <= 0) return [];
    return [
      { name: 'Cement', value: Math.round(cementM3 * 100) / 100, color: '#3b82f6' },
      { name: 'Sand', value: Math.round(sandM3 * 100) / 100, color: '#f59e0b' },
      { name: 'Gravel', value: Math.round(gravelM3 * 100) / 100, color: '#10b981' }
    ];
  };

  const getCostChartData = () => {
    const data = [];
    if (rawMaterialCost > 0) data.push({ name: 'Materials', amount: Math.round(rawMaterialCost) });
    if (extraDeliveryCost > 0) data.push({ name: 'Delivery', amount: Math.round(extraDeliveryCost) });
    if (extraPumpCost > 0) data.push({ name: 'Pump', amount: Math.round(extraPumpCost) });
    if (extraLaborCost > 0) data.push({ name: 'Labor', amount: Math.round(extraLaborCost) });
    if (extraOtherCost > 0) data.push({ name: 'Other', amount: Math.round(extraOtherCost) });
    return data;
  };

  return (
    <div className="bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 min-h-screen text-neutral-800 dark:text-neutral-100 pb-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 border-b border-neutral-200 dark:border-neutral-800 gap-6">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Construction className="h-4 w-4" /> SEO Standard Built
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mt-1 flex items-center gap-3">
              <Calculator className="h-9 w-9 text-blue-600 dark:text-cyan-400" />
              Concrete Calculator
            </h1>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400 max-w-2xl text-sm leading-relaxed">
              Pristine, construction-grade interactive calculator. Calculate volume requirements, cement bags, material parts, cost and weight distributions with dynamic realtime updates.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={handleLoadExample}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" /> Load Example
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" /> Clear All
            </button>
            <div className="bg-neutral-200 dark:bg-neutral-800 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setUnitSystem('imperial')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${unitSystem === 'imperial' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow' : 'text-neutral-500'}`}
              >
                Imperial
              </button>
              <button
                onClick={() => setUnitSystem('metric')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${unitSystem === 'metric' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow' : 'text-neutral-500'}`}
              >
                Metric
              </button>
            </div>
          </div>
        </div>

        {/* WORKSTATION GRID */}
        <div ref={containerRef} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT PANELS: FORM CONTROLS */}
          <div className="lg:col-span-7 space-y-8">

            {/* TAB SELECTOR */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-3">
                Calculation Mode
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
                {([
                  { id: 'slab', label: 'Slab' },
                  { id: 'footing', label: 'Footing' },
                  { id: 'column', label: 'Column' },
                  { id: 'wall', label: 'Wall' },
                  { id: 'stair', label: 'Stair' },
                  { id: 'beam', label: 'Beam' },
                  { id: 'cylinder', label: 'Cylinder' },
                  { id: 'tube', label: 'Tube' },
                  { id: 'ring', label: 'Ring' },
                  { id: 'hole', label: 'Hole/Post' },
                  { id: 'curb', label: 'Curb' },
                  { id: 'block', label: 'Block Fill' }
                ] as { id: CalcMode; label: string }[]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10 dark:bg-cyan-500 dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN CALCULATION INPUTS */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
                Dimensions & Primary Inputs
              </h3>

              {/* DYNAMIC SHAPE-SPECIFIC FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Length Block */}
                {(activeTab === 'slab' || activeTab === 'footing' || activeTab === 'wall' || activeTab === 'stair' || activeTab === 'beam' || activeTab === 'curb') && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                      Length {activeTab === 'stair' && '(Landing Length)'}
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="e.g. 10"
                        value={inputs[activeTab === 'stair' ? 'landingL' : 'length'] || ''}
                        onChange={(e) => handleInputChange(activeTab === 'stair' ? 'landingL' : 'length', e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={units[activeTab === 'stair' ? 'landingL' : 'length'] || 'ft'}
                        onChange={(e) => handleUnitChange(activeTab === 'stair' ? 'landingL' : 'length', e.target.value as LengthUnit)}
                        className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold rounded-xl px-2"
                      >
                        {['ft', 'yd', 'in', 'm', 'cm', 'mm'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Width Block */}
                {(activeTab === 'slab' || activeTab === 'footing' || activeTab === 'beam' || activeTab === 'curb' || activeTab === 'stair') && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                      Width {activeTab === 'stair' && '(Stair/Landing Width)'}
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        value={inputs[activeTab === 'stair' ? 'width' : 'width'] || ''}
                        onChange={(e) => handleInputChange(activeTab === 'stair' ? 'width' : 'width', e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={units[activeTab === 'stair' ? 'width' : 'width'] || 'ft'}
                        onChange={(e) => handleUnitChange(activeTab === 'stair' ? 'width' : 'width', e.target.value as LengthUnit)}
                        className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold rounded-xl px-2"
                      >
                        {['ft', 'yd', 'in', 'm', 'cm', 'mm'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Thickness / Depth Block */}
                {(activeTab === 'slab' || activeTab === 'footing' || activeTab === 'beam' || activeTab === 'wall' || activeTab === 'stair') && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                      {activeTab === 'slab' || activeTab === 'wall' ? 'Thickness' : activeTab === 'stair' ? 'Landing Thickness' : 'Depth'}
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="e.g. 4"
                        value={inputs[activeTab === 'stair' ? 'landingT' : activeTab === 'slab' || activeTab === 'wall' ? 'thickness' : 'depth'] || ''}
                        onChange={(e) => handleInputChange(activeTab === 'stair' ? 'landingT' : activeTab === 'slab' || activeTab === 'wall' ? 'thickness' : 'depth', e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={units[activeTab === 'stair' ? 'landingT' : activeTab === 'slab' || activeTab === 'wall' ? 'thickness' : 'depth'] || 'in'}
                        onChange={(e) => handleUnitChange(activeTab === 'stair' ? 'landingT' : activeTab === 'slab' || activeTab === 'wall' ? 'thickness' : 'depth', e.target.value as LengthUnit)}
                        className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold rounded-xl px-2"
                      >
                        {['in', 'ft', 'yd', 'cm', 'mm', 'm'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Stair Stair-Specific Steps */}
                {activeTab === 'stair' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                        Number of Steps
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        value={inputs['numSteps'] || ''}
                        onChange={(e) => handleInputChange('numSteps', e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                        Rise (Height per Step)
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="e.g. 7"
                          value={inputs['rise'] || ''}
                          onChange={(e) => handleInputChange('rise', e.target.value)}
                          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-sm font-semibold"
                        />
                        <select
                          value={units['rise'] || 'in'}
                          onChange={(e) => handleUnitChange('rise', e.target.value as LengthUnit)}
                          className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold rounded-xl px-2"
                        >
                          {['in', 'cm', 'mm', 'm', 'ft'].map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                        Run (Depth per Step)
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="e.g. 11"
                          value={inputs['run'] || ''}
                          onChange={(e) => handleInputChange('run', e.target.value)}
                          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-sm font-semibold"
                        />
                        <select
                          value={units['run'] || 'in'}
                          onChange={(e) => handleUnitChange('run', e.target.value as LengthUnit)}
                          className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold rounded-xl px-2"
                        >
                          {['in', 'cm', 'mm', 'm', 'ft'].map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Height / Diameter for cylinders/columns */}
                {(activeTab === 'cylinder' || activeTab === 'column' || activeTab === 'hole' || activeTab === 'tube' || activeTab === 'ring') && (
                  <>
                    {activeTab === 'column' && (
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                          Column Cross-Section Type
                        </label>
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl flex gap-1">
                          {['square', 'rectangular', 'circular'].map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => handleInputChange('columnType', type)}
                              className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition ${ (inputs['columnType'] || 'square') === type ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow' : 'text-neutral-500'}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show side or diameter fields dynamically */}
                    {((activeTab === 'column' && (inputs['columnType'] || 'square') === 'square')) && (
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Side Length</label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            placeholder="e.g. 1.5"
                            value={inputs['side'] || ''}
                            onChange={(e) => handleInputChange('side', e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-sm font-semibold"
                          />
                          <select
                            value={units['side'] || 'ft'}
                            onChange={(e) => handleUnitChange('side', e.target.value as LengthUnit)}
                            className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 text-xs font-bold rounded-xl px-2"
                          >
                            {['ft', 'm', 'cm', 'in'].map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {((activeTab === 'column' && (inputs['columnType'] || 'square') === 'rectangular')) && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Side A</label>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              placeholder="e.g. 1"
                              value={inputs['sideA'] || ''}
                              onChange={(e) => handleInputChange('sideA', e.target.value)}
                              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 p-2.5 rounded-xl text-sm font-semibold"
                            />
                            <select
                              value={units['sideA'] || 'ft'}
                              onChange={(e) => handleUnitChange('sideA', e.target.value as LengthUnit)}
                              className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 text-xs font-bold rounded-xl px-2"
                            >
                              {['ft', 'm', 'cm', 'in'].map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Side B</label>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              placeholder="e.g. 1.5"
                              value={inputs['sideB'] || ''}
                              onChange={(e) => handleInputChange('sideB', e.target.value)}
                              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 p-2.5 rounded-xl text-sm font-semibold"
                            />
                            <select
                              value={units['sideB'] || 'ft'}
                              onChange={(e) => handleUnitChange('sideB', e.target.value as LengthUnit)}
                              className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 text-xs font-bold rounded-xl px-2"
                            >
                              {['ft', 'm', 'cm', 'in'].map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Circular column / cylinder / hole */}
                    {(activeTab === 'cylinder' || activeTab === 'hole' || (activeTab === 'column' && (inputs['columnType'] || 'square') === 'circular')) && (
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Diameter</label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            placeholder="e.g. 12"
                            value={inputs['diameter'] || ''}
                            onChange={(e) => handleInputChange('diameter', e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-sm font-semibold"
                          />
                          <select
                            value={units['diameter'] || 'in'}
                            onChange={(e) => handleUnitChange('diameter', e.target.value as LengthUnit)}
                            className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 text-xs font-bold rounded-xl px-2"
                          >
                            {['in', 'cm', 'mm', 'ft', 'm'].map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Tube/Ring inner/outer */}
                    {(activeTab === 'tube' || activeTab === 'ring') && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Outer Diameter</label>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              placeholder="e.g. 18"
                              value={inputs['outerDia'] || ''}
                              onChange={(e) => handleInputChange('outerDia', e.target.value)}
                              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 p-2.5 rounded-xl text-sm font-semibold"
                            />
                            <select
                              value={units['outerDia'] || 'in'}
                              onChange={(e) => handleUnitChange('outerDia', e.target.value as LengthUnit)}
                              className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 text-xs font-bold rounded-xl px-2"
                            >
                              {['in', 'cm', 'mm', 'ft', 'm'].map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Inner Diameter</label>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              placeholder="e.g. 12"
                              value={inputs['innerDia'] || ''}
                              onChange={(e) => handleInputChange('innerDia', e.target.value)}
                              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 p-2.5 rounded-xl text-sm font-semibold"
                            />
                            <select
                              value={units['innerDia'] || 'in'}
                              onChange={(e) => handleUnitChange('innerDia', e.target.value as LengthUnit)}
                              className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 text-xs font-bold rounded-xl px-2"
                            >
                              {['in', 'cm', 'mm', 'ft', 'm'].map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Height / Depth fields for column/cylinder/holes/tubes/rings */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                        {activeTab === 'hole' ? 'Depth' : 'Height'}
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="e.g. 8"
                          value={inputs[activeTab === 'hole' ? 'depth' : 'height'] || ''}
                          onChange={(e) => handleInputChange(activeTab === 'hole' ? 'depth' : 'height', e.target.value)}
                          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-sm font-semibold"
                        />
                        <select
                          value={units[activeTab === 'hole' ? 'depth' : 'height'] || 'ft'}
                          onChange={(e) => handleUnitChange(activeTab === 'hole' ? 'depth' : 'height', e.target.value as LengthUnit)}
                          className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 text-xs font-bold rounded-xl px-2"
                        >
                          {['ft', 'm', 'yd', 'in', 'cm'].map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Multi-Hole Option */}
                    {activeTab === 'hole' && (
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                          Number of Holes
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          value={inputs['numHoles'] || ''}
                          onChange={(e) => handleInputChange('numHoles', e.target.value)}
                          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-sm font-semibold"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Curb Specifications */}
                {activeTab === 'curb' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Curb Height</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="e.g. 12"
                          value={inputs['curbHeight'] || ''}
                          onChange={(e) => handleInputChange('curbHeight', e.target.value)}
                          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 p-2.5 rounded-xl text-sm font-semibold"
                        />
                        <select
                          value={units['curbHeight'] || 'in'}
                          onChange={(e) => handleUnitChange('curbHeight', e.target.value as LengthUnit)}
                          className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 text-xs font-bold rounded-xl px-2"
                        >
                          {['in', 'cm', 'mm', 'ft', 'm'].map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Curb Width</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="e.g. 6"
                          value={inputs['curbWidth'] || ''}
                          onChange={(e) => handleInputChange('curbWidth', e.target.value)}
                          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 p-2.5 rounded-xl text-sm font-semibold"
                        />
                        <select
                          value={units['curbWidth'] || 'in'}
                          onChange={(e) => handleUnitChange('curbWidth', e.target.value as LengthUnit)}
                          className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 text-xs font-bold rounded-xl px-2"
                        >
                          {['in', 'cm', 'mm', 'ft', 'm'].map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Gutter Width</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="e.g. 12"
                          value={inputs['gutterWidth'] || ''}
                          onChange={(e) => handleInputChange('gutterWidth', e.target.value)}
                          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 p-2.5 rounded-xl text-sm font-semibold"
                        />
                        <select
                          value={units['gutterWidth'] || 'in'}
                          onChange={(e) => handleUnitChange('gutterWidth', e.target.value as LengthUnit)}
                          className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 text-xs font-bold rounded-xl px-2"
                        >
                          {['in', 'cm', 'mm', 'ft', 'm'].map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Gutter Thickness</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="e.g. 6"
                          value={inputs['gutterThickness'] || ''}
                          onChange={(e) => handleInputChange('gutterThickness', e.target.value)}
                          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 p-2.5 rounded-xl text-sm font-semibold"
                        />
                        <select
                          value={units['gutterThickness'] || 'in'}
                          onChange={(e) => handleUnitChange('gutterThickness', e.target.value as LengthUnit)}
                          className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 text-xs font-bold rounded-xl px-2"
                        >
                          {['in', 'cm', 'mm', 'ft', 'm'].map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Block Fill Settings */}
                {activeTab === 'block' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Number of Blocks</label>
                      <input
                        type="number"
                        placeholder="e.g. 100"
                        value={inputs['numBlocks'] || ''}
                        onChange={(e) => handleInputChange('numBlocks', e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Block Core Size</label>
                      <select
                        value={inputs['blockSize'] || '8x8x16'}
                        onChange={(e) => handleInputChange('blockSize', e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-bold text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="8x8x16">Standard 8" x 8" x 16" (yields ~0.22 ft³ fill)</option>
                        <option value="6x8x16">Standard 6" x 8" x 16" (yields ~0.17 ft³ fill)</option>
                        <option value="12x8x16">Standard 12" x 8" x 16" (yields ~0.33 ft³ fill)</option>
                        <option value="custom">Custom Core Fill Volume</option>
                      </select>
                    </div>

                    {(inputs['blockSize'] === 'custom') && (
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Custom Fill per Block (ft³)</label>
                        <input
                          type="number"
                          placeholder="e.g. 0.25"
                          value={inputs['customFillVol'] || ''}
                          onChange={(e) => handleInputChange('customFillVol', e.target.value)}
                          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-semibold"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Show validation alert if positive constraints triggered */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="bg-rose-50 dark:bg-rose-950/20 p-3 rounded-2xl border border-rose-100 dark:border-rose-950/40 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Please check dimensions. Negative values and zeroes are rejected for stability.</span>
                </div>
              )}
            </div>

            {/* OPTIONAL SPECIFICATIONS: BAG SIZE, DENSITY, WASTE, MIX RATIOS */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-500" />
                Optional Parameters & Concrete Specs
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">Waste Percentage (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    value={wastePct}
                    onChange={(e) => setWastePct(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">Mix Ratio (Cement:Sand:Gravel)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1:2:4"
                    value={mixRatio}
                    onChange={(e) => setMixRatio(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-semibold"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">Ratios enable the raw material aggregates breakdown estimator.</span>
                </div>

                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">Bag Size For Calculation</label>
                  <select
                    value={bagSize}
                    onChange={(e) => setBagSize(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-bold text-neutral-700 dark:text-neutral-200"
                  >
                    <option value="80lb">80 lb bag (0.60 ft³ yield)</option>
                    <option value="60lb">60 lb bag (0.45 ft³ yield)</option>
                    <option value="40lb">40 lb bag (0.30 ft³ yield)</option>
                    <option value="50kg">50 kg bag (35 L yield)</option>
                    <option value="40kg">40 kg bag (28 L yield)</option>
                    <option value="25kg">25 kg bag (17.5 L yield)</option>
                    <option value="20kg">20 kg bag (14 L yield)</option>
                    <option value="custom">Custom Bag Weight (lb)</option>
                  </select>
                </div>

                {bagSize === 'custom' && (
                  <div>
                    <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">Custom Bag Weight (lbs)</label>
                    <input
                      type="number"
                      placeholder="e.g. 80"
                      value={customBagWeight}
                      onChange={(e) => setCustomBagWeight(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-semibold"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                    Concrete Density ({unitSystem === 'imperial' ? 'lb/ft³' : 'kg/m³'})
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={concreteDensity}
                    onChange={(e) => setConcreteDensity(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-semibold"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">Default density matches normal weight structural concrete.</span>
                </div>
              </div>
            </div>

            {/* COST ESTIMATION CARD */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Optional Cost & Labor Estimator
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                    Concrete Cost per {unitSystem === 'imperial' ? 'Cubic Yard' : 'Cubic Meter'} ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 145"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">Delivery Cost ({currencySymbol})</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={deliveryCost}
                    onChange={(e) => setDeliveryCost(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">Pump Cost ({currencySymbol})</label>
                  <input
                    type="number"
                    placeholder="e.g. 250"
                    value={pumpCost}
                    onChange={(e) => setPumpCost(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">Labor Cost ({currencySymbol})</label>
                  <input
                    type="number"
                    placeholder="e.g. 800"
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">Other Costs ({currencySymbol})</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={otherCost}
                    onChange={(e) => setOtherCost(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 rounded-xl p-2.5 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* WHAT-IF INTERACTIVE SLIDERS */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-blue-500" />
                  What-If Interactive Analysis
                </span>
                <button
                  type="button"
                  onClick={() => setWhatIfEnabled(!whatIfEnabled)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${whatIfEnabled ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'}`}
                >
                  {whatIfEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {whatIfEnabled ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Length Shift</span>
                      <span>{whatIfLength > 0 ? `+${whatIfLength}` : whatIfLength}%</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="100"
                      value={whatIfLength}
                      onChange={(e) => setWhatIfLength(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Width Shift</span>
                      <span>{whatIfWidth > 0 ? `+${whatIfWidth}` : whatIfWidth}%</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="100"
                      value={whatIfWidth}
                      onChange={(e) => setWhatIfWidth(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Thickness / Depth Shift</span>
                      <span>{whatIfThickness > 0 ? `+${whatIfThickness}` : whatIfThickness}%</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="100"
                      value={whatIfThickness}
                      onChange={(e) => setWhatIfThickness(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Concrete Cost per Unit Shift</span>
                      <span>{whatIfCost > 0 ? `+${whatIfCost}` : whatIfCost}%</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="100"
                      value={whatIfCost}
                      onChange={(e) => setWhatIfCost(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-neutral-400">Toggle "Enabled" to slide length, width, thickness, and material pricing values up and down for immediate forecasting.</p>
              )}
            </div>

          </div>

          {/* RIGHT PANELS: LIVE RESULTS & VISUALIZATIONS */}
          <div className="lg:col-span-5 space-y-8">

            {/* CORE METRICS SCORECARD */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-blue-900/40 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
                  Total Concrete Volume
                </span>
                <div className="text-4xl font-extrabold mt-1">
                  {fromM3(totalVolumeM3, 'yd³').toFixed(3)} <span className="text-xl text-blue-200">cu yd</span>
                </div>
                <div className="text-sm font-semibold text-blue-200 mt-1">
                  {totalVolumeM3.toFixed(3)} m³ | {fromM3(totalVolumeM3, 'ft³').toFixed(1)} cu ft
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-blue-800/60 pt-4">
                <div>
                  <span className="text-[10px] text-blue-300 font-bold block uppercase">Bags Required ({activeBagType})</span>
                  <span className="text-2xl font-bold">{bagsRequired}</span>
                </div>
                <div>
                  <span className="text-[10px] text-blue-300 font-bold block uppercase">Total Weight</span>
                  <span className="text-xl font-bold">
                    {(unitSystem === 'imperial' ? totalWeightKg * 2.204 : totalWeightKg).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    <span className="text-xs ml-1">{unitSystem === 'imperial' ? 'lbs' : 'kg'}</span>
                  </span>
                </div>
              </div>

              {/* Ready mix truck count illustration */}
              {totalVolumeM3 > 0 && (
                <div className="bg-blue-950/40 p-4 rounded-2xl border border-blue-800/40 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-blue-300">Ready Mix Transport Capacity</span>
                    <span className="font-bold">{trucksRequired} Truck Loads</span>
                  </div>
                  {/* Miniature Truck SVG Track */}
                  <div className="flex gap-1 items-center h-8 bg-blue-900/30 rounded-lg p-1 overflow-x-auto">
                    {Array.from({ length: Math.min(trucksRequired, 8) }).map((_, i) => (
                      <div key={i} className="animate-pulse bg-blue-400 text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        🚚 {i + 1}
                      </div>
                    ))}
                    {trucksRequired > 8 && <span className="text-xs text-blue-300">+{trucksRequired - 8} more</span>}
                  </div>
                </div>
              )}

              {/* Cost grand total */}
              {totalCostValue > 0 && (
                <div className="border-t border-blue-800/60 pt-4 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-blue-300 font-bold block uppercase">Grand Total Cost</span>
                    {totalAreaSqUnit > 0 && (
                      <span className="text-xs text-blue-200 block">Cost/{areaUnit}: {currencySymbol}{costPerArea.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-emerald-300">
                    {currencySymbol}{totalCostValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}

              {/* Export Panel inside Scorecard */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopyResults}
                  className="flex-1 py-2 bg-blue-800/50 hover:bg-blue-800/80 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy Results'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  className="p-2 bg-blue-800/50 hover:bg-blue-800/80 rounded-xl transition"
                  title="Download Estimator Snapshot as PNG"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 bg-blue-800/50 hover:bg-blue-800/80 rounded-xl transition"
                  title="Print Estimate"
                >
                  <Printer className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* DYNAMIC SVG VOLUME DIAGRAM */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Interactive Shape Preview (Isometric)
              </h4>
              <div className="h-48 bg-neutral-50 dark:bg-neutral-950/40 rounded-2xl flex items-center justify-center border border-neutral-100 dark:border-neutral-800/60 p-4 relative overflow-hidden">
                <svg className="w-full h-full max-w-[280px]" viewBox="0 0 100 100">
                  {/* Dynamic renders based on shape */}
                  {activeTab === 'slab' && (
                    <g transform="translate(10, 15)">
                      <polygon points="40,20 70,35 40,50 10,35" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
                      <polygon points="10,35 40,50 40,65 10,50" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
                      <polygon points="40,50 70,35 70,50 40,65" fill="#4b5563" stroke="#374151" strokeWidth="1" />
                      <text x="40" y="15" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#3b82f6" className="dark:fill-cyan-400">Length</text>
                      <text x="12" y="44" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#3b82f6" className="dark:fill-cyan-400">Width</text>
                      <text x="58" y="58" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#3b82f6" className="dark:fill-cyan-400">Thick</text>
                    </g>
                  )}
                  {activeTab === 'cylinder' && (
                    <g transform="translate(15, 10)">
                      <ellipse cx="35" cy="20" rx="18" ry="8" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
                      <path d="M17,20 L17,65 A18,8 0 0,0 53,65 L53,20 Z" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
                      <ellipse cx="35" cy="65" rx="18" ry="8" fill="#4b5563" stroke="#374151" strokeWidth="1" />
                      <text x="35" y="10" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#3b82f6">Diameter</text>
                      <text x="63" y="45" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#3b82f6">Height</text>
                    </g>
                  )}
                  {activeTab === 'stair' && (
                    <g transform="translate(15, 15)">
                      <polygon points="10,50 20,50 20,40 30,40 30,30 40,30 40,20 55,20 55,55 10,55" fill="#9ca3af" stroke="#4b5563" />
                      <path d="M10,50 L55,55 L55,60 L10,55 Z" fill="#6b7280" stroke="#374151" />
                      <text x="32" y="15" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#3b82f6">Stair Layout</text>
                    </g>
                  )}
                  {activeTab === 'column' && (
                    <g transform="translate(15, 10)">
                      <polygon points="35,15 55,25 35,35 15,25" fill="#9ca3af" stroke="#4b5563" />
                      <polygon points="15,25 35,35 35,70 15,60" fill="#6b7280" stroke="#4b5563" />
                      <polygon points="35,35 55,25 55,60 35,70" fill="#4b5563" stroke="#374151" />
                      <text x="35" y="10" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#3b82f6">Column Profile</text>
                    </g>
                  )}
                  {/* Default fallback isometric cube */}
                  {['slab', 'cylinder', 'stair', 'column'].indexOf(activeTab) === -1 && (
                    <g transform="translate(15, 15)">
                      <polygon points="35,15 60,30 35,45 10,30" fill="#9ca3af" stroke="#4b5563" />
                      <polygon points="10,30 35,45 35,75 10,60" fill="#6b7280" stroke="#4b5563" />
                      <polygon points="35,45 60,30 60,60 35,75" fill="#4b5563" stroke="#374151" />
                      <text x="35" y="10" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#3b82f6">Isometric Structure</text>
                    </g>
                  )}
                </svg>
                <div className="absolute bottom-2 left-2 text-[10px] bg-neutral-200/60 dark:bg-neutral-800/60 px-2 py-0.5 rounded font-mono">
                  Scale: Adaptive
                </div>
              </div>
            </div>

            {/* DYNAMIC RECHARTS BREAKDOWNS */}
            {totalVolumeM3 > 0 && (
              <div className="space-y-6">
                {/* Aggregate Mix ratio breakdown chart */}
                {mixRatioParsed && (
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      Estimated Materials Breakdown (Dry Volume)
                    </h4>
                    <div className="h-44 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getMaterialPieData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={55}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}m³`}
                          >
                            {getMaterialPieData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} m³`, 'Volume']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {waterLiters > 0 && (
                      <p className="text-[10px] text-neutral-500 text-center font-semibold">
                        💧 Estimated Water Required: {waterLiters.toFixed(0)} Liters ({(waterLiters * 0.264172).toFixed(1)} Gallons)
                      </p>
                    )}
                  </div>
                )}

                {/* Cost Distribution Chart */}
                {totalCostValue > rawMaterialCost && (
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      Project Cost Distribution
                    </h4>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getCostChartData()}>
                          <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                          <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                          <Tooltip formatter={(value) => [`${currencySymbol}${value}`, 'Amount']} />
                          <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RULE-BASED SMART INSIGHTS */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Live Project Insights
              </h4>
              <ul className="space-y-3 text-xs">
                {insights.map((insight, idx) => (
                  <li key={idx} className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/80 leading-relaxed">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            {/* FORMULA & STEP-BY-STEP SOLUTION PANEL */}
            {totalVolumeM3 > 0 && (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Step-by-Step Mechanical Solution
                </h4>
                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <span className="block text-[10px] text-blue-500 uppercase font-bold">1. Primary Formula</span>
                    <span className="text-neutral-800 dark:text-neutral-200">{rawCalc.formula}</span>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <span className="block text-[10px] text-blue-500 uppercase font-bold">2. Substitution</span>
                    <pre className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">{rawCalc.substitution}</pre>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <span className="block text-[10px] text-blue-500 uppercase font-bold">3. Calculation Results</span>
                    <span className="text-neutral-800 dark:text-neutral-200">{rawCalc.calculation}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* EDUCATIONAL COMPREHENSIVE SEO CONTENT SECTION */}
        <EducationalContent />

      </div>
    </div>
  );
}
