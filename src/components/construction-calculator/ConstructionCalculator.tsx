import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Trash2, 
  Sparkles, 
  Calculator, 
  DollarSign, 
  Clock, 
  Plus, 
  HelpCircle, 
  Info, 
  RefreshCw, 
  ArrowLeftRight,
  TrendingUp,
  Sliders,
  CheckCircle,
  FileText
} from 'lucide-react';
import { 
  UnitSystem, 
  ProjectType, 
  RoomData, 
  LengthUnit, 
  AreaUnit, 
  VolumeUnit, 
  CalculatorState 
} from './types';
import { 
  convertLength, 
  calculateMaterials, 
  generateInsights, 
  LOADED_SAMPLE_PROJECT, 
  MATERIAL_SPECS 
} from './helpers';
import Visualizations from './Visualizations';
import FormulaBreakdown from './FormulaBreakdown';
import EducationalContent from './EducationalContent';

const INITIAL_STATE: CalculatorState = {
  unitSystem: 'imperial',
  projectType: 'residential_house',
  
  // Module 1: Area Calculator
  areaLength: '',
  areaWidth: '',
  areaLengthUnit: 'ft',
  areaWidthUnit: 'ft',

  // Module 2: Volume Calculator
  volumeLength: '',
  volumeWidth: '',
  volumeHeight: '',
  volumeLengthUnit: 'ft',
  volumeWidthUnit: 'ft',
  volumeHeightUnit: 'ft',

  materialType: 'concrete',

  // Project Cost Estimator inputs
  materialCost: '',
  laborCostInput: '',
  equipmentCost: '',
  transportationCost: '',
  wastePercent: '',
  taxPercent: '',
  otherCosts: '',

  // Material Waste Estimator
  wasteEstPercent: '',

  // Labor Estimator inputs
  workersCount: '',
  workingHoursPerDay: '',
  hourlyRate: '',

  // Project Timeline inputs
  workingDaysPerWeek: '',
  crewSize: '',
  estimatedDailyProgress: '',

  // Rooms list (empty by default)
  rooms: []
};

// Standard contractor rates for What-If sliders
const DEFAULT_SLIDERS = {
  sizeMultiplier: 100, // percentage 50 - 150
  priceMultiplier: 100, // percentage 50 - 150
  wastePctOverride: -1, // default uses input, positive overrides
  laborRateOverride: -1 // default uses input, positive overrides
};

export default function ConstructionCalculator() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [sliders, setSliders] = useState(DEFAULT_SLIDERS);
  const [activeModule, setActiveModule] = useState<'area' | 'volume' | 'materials' | 'rooms'>('area');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Quick state update helper
  const updateField = (key: keyof CalculatorState, value: any) => {
    setState(prev => {
      // Validation Check
      if (typeof value === 'string' && value !== '') {
        const num = Number(value);
        if (!isNaN(num) && num < 0) {
          setValidationError(`Negative value entered for '${String(key).replace(/([A-Z])/g, ' $1')}'. Please enter a positive value.`);
          return prev;
        }
      }
      setValidationError(null);
      return { ...prev, [key]: value };
    });
  };

  const handleLoadExample = () => {
    setState(LOADED_SAMPLE_PROJECT);
    setSliders(DEFAULT_SLIDERS);
    setValidationError(null);
  };

  const handleClearAll = () => {
    setState(INITIAL_STATE);
    setSliders(DEFAULT_SLIDERS);
    setValidationError(null);
  };

  // Convert inputs helper to meters / cubic meters for uniform estimation calculations
  const parsedDimensions = useMemo(() => {
    const isMetric = state.unitSystem === 'metric';
    
    // Parse Module 1 Area
    const aLen = parseFloat(state.areaLength) || 0;
    const aWid = parseFloat(state.areaWidth) || 0;
    const sizeMult = sliders.sizeMultiplier / 100;
    
    const aLenConverted = convertLength(aLen * sizeMult, state.areaLengthUnit, 'm');
    const aWidConverted = convertLength(aWid * sizeMult, state.areaWidthUnit, 'm');
    const areaSqM = aLenConverted * aWidConverted;

    // Parse Module 2 Volume
    const vLen = parseFloat(state.volumeLength) || 0;
    const vWid = parseFloat(state.volumeWidth) || 0;
    const vHt = parseFloat(state.volumeHeight) || 0;

    const vLenConverted = convertLength(vLen * sizeMult, state.volumeLengthUnit, 'm');
    const vWidConverted = convertLength(vWid * sizeMult, state.volumeWidthUnit, 'm');
    const vHtConverted = convertLength(vHt, state.volumeHeightUnit, 'm');
    const volumeCuM = vLenConverted * vWidConverted * vHtConverted;

    // Determine working base area and volume based on selected active module
    let finalAreaSqM = areaSqM;
    let finalVolumeCuM = volumeCuM;

    if (activeModule === 'volume') {
      finalAreaSqM = vLenConverted * vWidConverted;
    } else if (activeModule === 'rooms') {
      // Sum up room areas
      let totalRoomAreaSqM = 0;
      let totalRoomVolumeCuM = 0;
      state.rooms.forEach(r => {
        const rLen = parseFloat(r.length) || 0;
        const rWid = parseFloat(r.width) || 0;
        const rHt = parseFloat(r.height) || 0;
        const rLenM = convertLength(rLen, isMetric ? 'm' : 'ft', 'm');
        const rWidM = convertLength(rWid, isMetric ? 'm' : 'ft', 'm');
        const rHtM = convertLength(rHt, isMetric ? 'm' : 'ft', 'm');
        totalRoomAreaSqM += rLenM * rWidM;
        totalRoomVolumeCuM += rLenM * rWidM * rHtM;
      });
      finalAreaSqM = totalRoomAreaSqM;
      finalVolumeCuM = totalRoomVolumeCuM;
    }

    return {
      areaSqM: finalAreaSqM,
      volumeCuM: finalVolumeCuM,
      rawLength: activeModule === 'volume' ? vLen : aLen,
      rawWidth: activeModule === 'volume' ? vWid : aWid,
      rawHeight: activeModule === 'volume' ? vHt : 0,
      areaSqFt: finalAreaSqM * 10.76391,
      volumeCuYd: finalVolumeCuM / 0.764554857984,
      perimeter: (activeModule === 'volume' ? vLen + vWid : aLen + aWid) * 2,
    };
  }, [state, activeModule, sliders.sizeMultiplier]);

  // Pricing multipliers & material lists
  const materialsList = useMemo(() => {
    const wastePct = sliders.wastePctOverride >= 0 
      ? sliders.wastePctOverride 
      : (parseFloat(state.wasteEstPercent || state.wastePercent) || 0);

    // Apply sliders.priceMultiplier to material standard prices
    const priceMultiplier = sliders.priceMultiplier / 100;
    const baseMaterials = calculateMaterials({
      areaSqM: parsedDimensions.areaSqM,
      volumeCuM: parsedDimensions.volumeCuM,
      unitSystem: state.unitSystem,
      prices: {
        concrete: (state.unitSystem === 'metric' ? 120 : 150) * priceMultiplier,
        cement: (state.unitSystem === 'metric' ? 8 : 12) * priceMultiplier,
        sand: (state.unitSystem === 'metric' ? 30 : 40) * priceMultiplier,
        gravel: (state.unitSystem === 'metric' ? 35 : 45) * priceMultiplier,
        bricks: (state.unitSystem === 'metric' ? 0.6 : 0.75) * priceMultiplier,
        blocks: (state.unitSystem === 'metric' ? 2.5 : 3.5) * priceMultiplier,
        steel: (state.unitSystem === 'metric' ? 3 : 1) * priceMultiplier,
        wood: (state.unitSystem === 'metric' ? 4 : 1.5) * priceMultiplier,
        drywall: (state.unitSystem === 'metric' ? 12 : 15) * priceMultiplier,
        tiles: (state.unitSystem === 'metric' ? 3 : 4) * priceMultiplier,
        paint: (state.unitSystem === 'metric' ? 15 : 45) * priceMultiplier,
        insulation: (state.unitSystem === 'metric' ? 10 : 1.2) * priceMultiplier,
        roofing: (state.unitSystem === 'metric' ? 18 : 25) * priceMultiplier,
        pavingStones: (state.unitSystem === 'metric' ? 1.5 : 2.0) * priceMultiplier
      }
    });

    // If waste buffer added, multiply materials quantity
    return baseMaterials.map(m => {
      const boostedQty = m.quantity * (1 + wastePct / 100);
      return {
        ...m,
        quantity: parseFloat(boostedQty.toFixed(2)),
        estimatedCost: parseFloat((m.estimatedCost * (1 + wastePct / 100)).toFixed(2))
      };
    });
  }, [parsedDimensions, state.unitSystem, state.wastePercent, state.wasteEstPercent, sliders.priceMultiplier, sliders.wastePctOverride]);

  // Unified Cost calculations
  const costDetails = useMemo(() => {
    const rawMat = materialsList.reduce((sum, item) => sum + item.estimatedCost, 0);
    const taxRate = (parseFloat(state.taxPercent) || 0) / 100;

    // Labor Calculation from Labor Estimator or input
    let finalLabor = parseFloat(state.laborCostInput) || 0;
    const hoursPerDay = parseFloat(state.workingHoursPerDay) || 8;
    const rateVal = sliders.laborRateOverride >= 0 ? sliders.laborRateOverride : (parseFloat(state.hourlyRate) || 0);
    const workersCountVal = parseFloat(state.workersCount) || 0;

    // Determine completion days if estimatedDailyProgress exists
    let calculatedDays = 0;
    const progressSqUnit = parseFloat(state.estimatedDailyProgress) || 0;
    const workingArea = state.unitSystem === 'metric' ? parsedDimensions.areaSqM : parsedDimensions.areaSqFt;
    if (progressSqUnit > 0 && workingArea > 0) {
      calculatedDays = workingArea / progressSqUnit;
    }

    if (workersCountVal > 0 && rateVal > 0 && calculatedDays > 0) {
      // Derived labor cost
      finalLabor = workersCountVal * hoursPerDay * rateVal * calculatedDays;
    } else if (workersCountVal > 0 && rateVal > 0) {
      // Fallback fallback manual work days (e.g. 10 days base if not computed)
      finalLabor = workersCountVal * hoursPerDay * rateVal * 5; 
    }

    const equip = parseFloat(state.equipmentCost) || 0;
    const transport = parseFloat(state.transportationCost) || 0;
    const other = parseFloat(state.otherCosts) || 0;

    const subtotal = rawMat + finalLabor + equip + transport + other;
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + tax;

    return {
      materials: rawMat,
      labor: finalLabor,
      equipment: equip,
      transport: transport,
      other: other,
      tax: tax,
      grandTotal: grandTotal,
      daysNeeded: calculatedDays || 5, // fallback for schedule display
      costPerSqM: parsedDimensions.areaSqM > 0 ? grandTotal / parsedDimensions.areaSqM : 0,
      costPerSqFt: parsedDimensions.areaSqFt > 0 ? grandTotal / parsedDimensions.areaSqFt : 0
    };
  }, [materialsList, state, parsedDimensions, sliders.laborRateOverride]);

  // Smart rule insights
  const insights = useMemo(() => {
    return generateInsights({
      totalCost: costDetails.grandTotal,
      materialCost: costDetails.materials,
      laborCost: costDetails.labor,
      wastePercent: parseFloat(state.wastePercent || state.wasteEstPercent) || 0,
      areaSqM: parsedDimensions.areaSqM,
      concreteVolume: parsedDimensions.volumeCuM,
      unitSystem: state.unitSystem
    });
  }, [costDetails, state.wastePercent, state.wasteEstPercent, parsedDimensions, state.unitSystem]);

  // Room list handling
  const handleAddRoom = () => {
    const newRoom: RoomData = {
      id: `room-${Date.now()}`,
      name: `Room ${state.rooms.length + 1}`,
      length: '',
      width: '',
      height: ''
    };
    updateField('rooms', [...state.rooms, newRoom]);
  };

  const handleUpdateRoom = (id: string, field: keyof RoomData, val: string) => {
    if (val !== '' && Number(val) < 0) return; // ignore negative
    const updated = state.rooms.map(r => {
      if (r.id === id) {
        return { ...r, [field]: val };
      }
      return r;
    });
    updateField('rooms', updated);
  };

  const handleRemoveRoom = (id: string) => {
    const filtered = state.rooms.filter(r => r.id !== id);
    updateField('rooms', filtered);
  };

  return (
    <div className="space-y-8 select-none font-sans antialiased text-neutral-900 dark:text-neutral-100 max-w-7xl mx-auto">
      
      {/* Top Welcome Title & Pitch Banner */}
      <div className="relative rounded-3xl bg-neutral-950 p-8 text-white overflow-hidden border border-neutral-850 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Ultimate Contractor Core
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Construction Calculator
            </h1>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Plan, budget, and estimate construction quantities with millimetric precision. Fully functional offline-first calculator optimized for professional contractors, builders, and custom architectural renovators.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleLoadExample}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Load Example
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 text-neutral-200 border border-neutral-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Validation Banner */}
      {validationError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
          <Info className="w-4 h-4 flex-shrink-0" />
          {validationError}
        </div>
      )}

      {/* Main Core Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Inputs & Adjusters (Columns 1-7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Layout Unit System and Project Type */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 space-y-6 shadow-sm">
            <h3 className="text-sm font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-500" />
              1. Project Setup Config
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Unit System */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Unit Standards</label>
                <div className="grid grid-cols-2 p-1 bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200/55 dark:border-neutral-800">
                  <button
                    onClick={() => updateField('unitSystem', 'imperial')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      state.unitSystem === 'imperial'
                        ? 'bg-white dark:bg-neutral-900 shadow-sm text-blue-600 dark:text-cyan-400'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Imperial (ft/in)
                  </button>
                  <button
                    onClick={() => updateField('unitSystem', 'metric')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      state.unitSystem === 'metric'
                        ? 'bg-white dark:bg-neutral-900 shadow-sm text-blue-600 dark:text-cyan-400'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Metric (m/cm)
                  </button>
                </div>
              </div>

              {/* Project Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Structural Target</label>
                <select
                  value={state.projectType}
                  onChange={(e) => updateField('projectType', e.target.value as ProjectType)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="residential_house">Residential House</option>
                  <option value="apartment">Apartment</option>
                  <option value="garage">Garage</option>
                  <option value="driveway">Driveway</option>
                  <option value="patio">Patio</option>
                  <option value="foundation">Foundation Slab</option>
                  <option value="wall">Brick Wall</option>
                  <option value="roof">Truss Roof</option>
                  <option value="floor">Subflooring Grid</option>
                  <option value="room">Single Room Envelope</option>
                  <option value="custom_project">Custom Project</option>
                </select>
              </div>
            </div>
          </div>

          {/* Module Selection */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-100 dark:border-neutral-850 pb-3 gap-2">
              <h3 className="text-sm font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-500" />
                2. Calculation Modules
              </h3>
              <p className="text-[10px] text-neutral-400 font-semibold">Switch modules instantly</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'area', label: 'Area Plan' },
                { id: 'volume', label: 'Volume Plan' },
                { id: 'materials', label: 'Materials' },
                { id: 'rooms', label: 'Room-by-Room' }
              ].map(mod => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id as any)}
                  className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    activeModule === mod.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-850 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  {mod.label}
                </button>
              ))}
            </div>

            {/* Render selected active module form */}
            <div className="space-y-4 pt-2">
              {activeModule === 'area' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block">Length</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="e.g. 45"
                        value={state.areaLength}
                        onChange={(e) => updateField('areaLength', e.target.value)}
                        className="w-full pl-3 pr-16 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      <select
                        value={state.areaLengthUnit}
                        onChange={(e) => updateField('areaLengthUnit', e.target.value as LengthUnit)}
                        className="absolute right-1.5 top-1.5 bg-neutral-200 dark:bg-neutral-900 border-none rounded-lg text-[10px] font-bold px-2 py-1 outline-none"
                      >
                        <option value="ft">ft</option>
                        <option value="in">in</option>
                        <option value="yd">yd</option>
                        <option value="m">m</option>
                        <option value="cm">cm</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block">Width</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="e.g. 30"
                        value={state.areaWidth}
                        onChange={(e) => updateField('areaWidth', e.target.value)}
                        className="w-full pl-3 pr-16 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      <select
                        value={state.areaWidthUnit}
                        onChange={(e) => updateField('areaWidthUnit', e.target.value as LengthUnit)}
                        className="absolute right-1.5 top-1.5 bg-neutral-200 dark:bg-neutral-900 border-none rounded-lg text-[10px] font-bold px-2 py-1 outline-none"
                      >
                        <option value="ft">ft</option>
                        <option value="in">in</option>
                        <option value="yd">yd</option>
                        <option value="m">m</option>
                        <option value="cm">cm</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeModule === 'volume' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block">Length</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="e.g. 45"
                        value={state.volumeLength}
                        onChange={(e) => updateField('volumeLength', e.target.value)}
                        className="w-full pl-3 pr-14 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      <select
                        value={state.volumeLengthUnit}
                        onChange={(e) => updateField('volumeLengthUnit', e.target.value as LengthUnit)}
                        className="absolute right-1 top-1 bg-neutral-200 dark:bg-neutral-900 border-none rounded-lg text-[9px] font-bold px-1.5 py-1"
                      >
                        <option value="ft">ft</option>
                        <option value="in">in</option>
                        <option value="yd">yd</option>
                        <option value="m">m</option>
                        <option value="cm">cm</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block">Width</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="e.g. 30"
                        value={state.volumeWidth}
                        onChange={(e) => updateField('volumeWidth', e.target.value)}
                        className="w-full pl-3 pr-14 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      <select
                        value={state.volumeWidthUnit}
                        onChange={(e) => updateField('volumeWidthUnit', e.target.value as LengthUnit)}
                        className="absolute right-1 top-1 bg-neutral-200 dark:bg-neutral-900 border-none rounded-lg text-[9px] font-bold px-1.5 py-1"
                      >
                        <option value="ft">ft</option>
                        <option value="in">in</option>
                        <option value="yd">yd</option>
                        <option value="m">m</option>
                        <option value="cm">cm</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block">Height / Thickness</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="e.g. 10"
                        value={state.volumeHeight}
                        onChange={(e) => updateField('volumeHeight', e.target.value)}
                        className="w-full pl-3 pr-14 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      <select
                        value={state.volumeHeightUnit}
                        onChange={(e) => updateField('volumeHeightUnit', e.target.value as LengthUnit)}
                        className="absolute right-1 top-1 bg-neutral-200 dark:bg-neutral-900 border-none rounded-lg text-[9px] font-bold px-1.5 py-1"
                      >
                        <option value="ft">ft</option>
                        <option value="in">in</option>
                        <option value="yd">yd</option>
                        <option value="m">m</option>
                        <option value="cm">cm</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeModule === 'materials' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl text-xs text-neutral-600 dark:text-neutral-400">
                    <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      Dynamic Takeoff Engine Active
                    </h4>
                    Materials quantities are calculated dynamically based on the dimensions entered in the Area and Volume tabs above. Choose standard waste rates below.
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 block">Focus Material Type</label>
                      <select
                        value={state.materialType}
                        onChange={(e) => updateField('materialType', e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium outline-none"
                      >
                        <option value="concrete">Poured Concrete</option>
                        <option value="bricks">Bricks &amp; Mortar</option>
                        <option value="blocks">Hollow Core Blocks</option>
                        <option value="drywall">Drywall Cladding</option>
                        <option value="tiles">Floor Tiling</option>
                        <option value="paint">Emulsion Paint</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 block">Estimated Wastage Allowance (%)</label>
                      <input
                        type="number"
                        placeholder="e.g. 10"
                        value={state.wasteEstPercent}
                        onChange={(e) => updateField('wasteEstPercent', e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeModule === 'rooms' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Room-by-Room Materials Tracker
                    </span>
                    <button
                      onClick={handleAddRoom}
                      className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer select-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Room
                    </button>
                  </div>

                  {state.rooms.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-500">
                      No rooms added yet. Click &quot;Add Room&quot; to begin detailing.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                      {state.rooms.map((room) => (
                        <div 
                          key={room.id}
                          className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-850 space-y-2 relative"
                        >
                          <button
                            onClick={() => handleRemoveRoom(room.id)}
                            className="absolute right-2 top-2 text-neutral-400 hover:text-red-500 transition"
                            title="Remove this room"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-400">Name</label>
                              <input
                                type="text"
                                placeholder="Living Room"
                                value={room.name}
                                onChange={(e) => handleUpdateRoom(room.id, 'name', e.target.value)}
                                className="w-full px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-400">Length ({state.unitSystem === 'metric' ? 'm' : 'ft'})</label>
                              <input
                                type="number"
                                placeholder="15"
                                value={room.length}
                                onChange={(e) => handleUpdateRoom(room.id, 'length', e.target.value)}
                                className="w-full px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-400">Width ({state.unitSystem === 'metric' ? 'm' : 'ft'})</label>
                              <input
                                type="number"
                                placeholder="12"
                                value={room.width}
                                onChange={(e) => handleUpdateRoom(room.id, 'width', e.target.value)}
                                className="w-full px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-400">Height ({state.unitSystem === 'metric' ? 'm' : 'ft'})</label>
                              <input
                                type="number"
                                placeholder="10"
                                value={room.height}
                                onChange={(e) => handleUpdateRoom(room.id, 'height', e.target.value)}
                                className="w-full px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Project Cost Estimator */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 space-y-6 shadow-sm">
            <h3 className="text-sm font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              3. Project Cost Estimator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Base Material Cost ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 4500"
                  value={state.materialCost}
                  onChange={(e) => updateField('materialCost', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Base Labor Cost ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 3200"
                  value={state.laborCostInput}
                  onChange={(e) => updateField('laborCostInput', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Equipment Cost ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 1200"
                  value={state.equipmentCost}
                  onChange={(e) => updateField('equipmentCost', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Transportation ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 450"
                  value={state.transportationCost}
                  onChange={(e) => updateField('transportationCost', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Waste contingency (%)</label>
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={state.wastePercent}
                  onChange={(e) => updateField('wastePercent', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Municipal Tax (%)</label>
                <input
                  type="number"
                  placeholder="e.g. 8"
                  value={state.taxPercent}
                  onChange={(e) => updateField('taxPercent', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="text-xs font-bold text-neutral-500 block">Other Indirect Costs ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 600"
                  value={state.otherCosts}
                  onChange={(e) => updateField('otherCosts', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Labor Estimator & Timeline Section */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 space-y-6 shadow-sm">
            <h3 className="text-sm font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              4. Labor &amp; Timeline Estimator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Workers Count</label>
                <input
                  type="number"
                  placeholder="e.g. 4"
                  value={state.workersCount}
                  onChange={(e) => updateField('workersCount', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Hours Per Day</label>
                <input
                  type="number"
                  placeholder="e.g. 8"
                  value={state.workingHoursPerDay}
                  onChange={(e) => updateField('workingHoursPerDay', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Hourly Rate ($/hr)</label>
                <input
                  type="number"
                  placeholder="e.g. 35"
                  value={state.hourlyRate}
                  onChange={(e) => updateField('hourlyRate', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Work Days / Wk</label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  value={state.workingDaysPerWeek}
                  onChange={(e) => updateField('workingDaysPerWeek', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Crew Size</label>
                <input
                  type="number"
                  placeholder="e.g. 4"
                  value={state.crewSize}
                  onChange={(e) => updateField('crewSize', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 block">Daily Progress ({state.unitSystem === 'metric' ? 'm²/day' : 'ft²/day'})</label>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={state.estimatedDailyProgress}
                  onChange={(e) => updateField('estimatedDailyProgress', e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* What-If Interactive Analysis Sliders */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 space-y-6 shadow-sm">
            <h3 className="text-sm font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              5. Interactive What-If Analysis
            </h3>
            <p className="text-xs text-neutral-500">
              Dynamically scale your structural sizes, local resource pricing, and contractor rates to find optimal cost-savings curves.
            </p>

            <div className="space-y-5">
              {/* Size multiplier */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-neutral-600 dark:text-neutral-400">Scale Project Size</span>
                  <span className="text-blue-500">{sliders.sizeMultiplier}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={sliders.sizeMultiplier}
                  onChange={(e) => setSliders(prev => ({ ...prev, sizeMultiplier: Number(e.target.value) }))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-neutral-400">
                  <span>50% (Compact)</span>
                  <span>100% (Perfect Scale)</span>
                  <span>150% (Expanded)</span>
                </div>
              </div>

              {/* Price multiplier */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-neutral-600 dark:text-neutral-400">Scale Materials Price Curve</span>
                  <span className="text-emerald-500">{sliders.priceMultiplier}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={sliders.priceMultiplier}
                  onChange={(e) => setSliders(prev => ({ ...prev, priceMultiplier: Number(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-neutral-400">
                  <span>50% (Bulk Discount)</span>
                  <span>100% (Market Average)</span>
                  <span>150% (Surcharge / Premium)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Hand: Output Panel & Graphs (Columns 8-12) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Quick Metrics Cards */}
          <div className="bg-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 shadow-xl space-y-6">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Realtime Core Estimates
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                <div className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">PROJECTED AREA</div>
                <div className="text-lg font-black text-blue-400 mt-1">
                  {(state.unitSystem === 'metric' ? parsedDimensions.areaSqM : parsedDimensions.areaSqFt).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">{state.unitSystem === 'metric' ? 'm²' : 'sq ft'}</div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                <div className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">PROJECTED VOLUME</div>
                <div className="text-lg font-black text-cyan-400 mt-1">
                  {(state.unitSystem === 'metric' ? parsedDimensions.volumeCuM : parsedDimensions.volumeCuYd).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">{state.unitSystem === 'metric' ? 'Cubic Meters' : 'Cubic Yards'}</div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                <div className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">ESTIMATED PERIMETER</div>
                <div className="text-lg font-black text-purple-400 mt-1">
                  {parsedDimensions.perimeter.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">{state.unitSystem === 'metric' ? 'meters' : 'feet'}</div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
                <div className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">BUDGET TOTAL</div>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  ${costDetails.grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Taxes included</div>
              </div>
            </div>

            {/* Cost efficiency benchmarks */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-400">
                <span>Unit Square Cost:</span>
                <span className="text-neutral-200 font-bold">
                  ${(state.unitSystem === 'metric' ? costDetails.costPerSqM : costDetails.costPerSqFt).toFixed(2)} / {state.unitSystem === 'metric' ? 'm²' : 'sq ft'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Est. Materials:</span>
                <span className="text-neutral-200 font-bold">${costDetails.materials.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Est. Labor:</span>
                <span className="text-neutral-200 font-bold">${costDetails.labor.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

          {/* Visualizations Card */}
          <Visualizations
            areaSqM={parsedDimensions.areaSqM}
            volumeCuM={parsedDimensions.volumeCuM}
            length={parsedDimensions.rawLength}
            width={parsedDimensions.rawWidth}
            height={parsedDimensions.rawHeight}
            unitSystem={state.unitSystem}
            materials={materialsList}
            rooms={state.rooms}
            costDetails={costDetails}
            timeline={{
              workingDaysPerWeek: parseFloat(state.workingDaysPerWeek) || 5,
              crewSize: parseFloat(state.crewSize) || 4,
              daysNeeded: costDetails.daysNeeded
            }}
          />

          {/* Smart Insights Panel */}
          <div className="bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent rounded-2xl p-6 border border-blue-500/15 space-y-4">
            <h4 className="text-sm font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Smart Construction Insights
            </h4>
            <div className="space-y-3">
              {insights.map((ins, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Multi-Material Summary Table */}
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          6. Multi-Material Summary Table
        </h3>

        <div className="overflow-x-auto rounded-xl border border-neutral-150 dark:border-neutral-850">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800 text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Material / Standard Product</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Unit</th>
                <th className="px-4 py-3 text-right">Est. Cost</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Contractor Spec</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
              {materialsList.map((m) => (
                <tr key={m.key} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/40">
                  <td className="px-4 py-3 font-bold text-neutral-900 dark:text-white">{m.name}</td>
                  <td className="px-4 py-3 text-blue-600 dark:text-cyan-400 font-mono font-bold">
                    {m.quantity > 0 ? m.quantity.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—'}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{m.unit}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {m.estimatedCost > 0 ? `$${m.estimatedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-neutral-400 text-[10px] hidden sm:table-cell">{m.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step-by-Step Solution Breakdown */}
      <FormulaBreakdown
        unitSystem={state.unitSystem}
        length={parsedDimensions.rawLength}
        width={parsedDimensions.rawWidth}
        height={parsedDimensions.rawHeight}
        areaSqM={parsedDimensions.areaSqM}
        volumeCuM={parsedDimensions.volumeCuM}
        costDetails={costDetails}
      />

      {/* Related Calculators */}
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 space-y-4 shadow-sm">
        <h4 className="text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
          Related Construction &amp; Material Calculators
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Concrete Calculator', link: '#/construction/concrete-calculator' },
            { label: 'Brick Calculator', link: '#' },
            { label: 'Tile Calculator', link: '#' },
            { label: 'Paint Calculator', link: '#' },
            { label: 'Roofing Calculator', link: '#' },
            { label: 'Drywall Calculator', link: '#' },
            { label: 'Gravel Calculator', link: '#' },
            { label: 'Sand Calculator', link: '#' },
            { label: 'Asphalt Calculator', link: '#' },
            { label: 'Flooring Calculator', link: '#' },
            { label: 'Stair Calculator', link: '#' },
            { label: 'Fence Calculator', link: '#' },
            { label: 'Deck Calculator', link: '#' },
            { label: 'Foundation Calculator', link: '#' }
          ].map((calc, idx) => (
            <a
              key={idx}
              href={calc.link}
              className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-950 hover:bg-neutral-200 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium border border-neutral-200/50 dark:border-neutral-800 transition"
            >
              {calc.label}
            </a>
          ))}
        </div>
      </div>

      {/* Rich Educational and SEO Text Section */}
      <EducationalContent />

    </div>
  );
}
