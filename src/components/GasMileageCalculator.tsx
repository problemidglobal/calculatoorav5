import React, { useState, useEffect, useRef } from 'react';
import { 
  Car, Fuel, DollarSign, Gauge, HelpCircle, Plus, Trash2, 
  ArrowRightLeft, FileSpreadsheet, FileText, Clipboard, Sparkles, Check, Info, 
  TrendingDown, TrendingUp, Award, Calendar, Layers, Sliders, ChevronDown, 
  ChevronUp, AlertCircle, Download, Printer, Copy, RotateCcw, Compass, HelpCircle as HelpIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  AreaChart, Area, LineChart, Line, RadialBarChart, RadialBar
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { convertEconomy, convertDistance, convertVolume } from '../utils/fuelMath';

// Types for our component
type CalcTab = 'odometer' | 'trip' | 'converter' | 'log';

interface TripRow {
  id: string;
  date: string;
  distance: string;
  fuelUsed: string;
  fuelPrice: string;
  notes: string;
}

interface ComparisonVehicle {
  id: string;
  name: string;
  mpg: string;
  tankCapacity: string;
  fuelPrice: string;
  annualDistance: string;
}

export default function GasMileageCalculator() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState<CalcTab>('odometer');
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Load Example / Reset state flags
  const [isExampleLoaded, setIsExampleLoaded] = useState(false);

  // Success Feedback States
  const [copied, setCopied] = useState<boolean>(false);
  const [showPrintView, setShowPrintView] = useState<boolean>(false);

  // 1. Vehicle Information (Optional)
  const [vehicleName, setVehicleName] = useState<string>('');
  const [manufacturer, setManufacturer] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('');
  const [transmission, setTransmission] = useState<string>('');
  const [engineSize, setEngineSize] = useState<string>('');
  const [driveType, setDriveType] = useState<string>('');

  // 2. Odometer Mode Inputs (Starts completely empty)
  const [odomStart, setOdomStart] = useState<string>('');
  const [odomEnd, setOdomEnd] = useState<string>('');
  const [odomFuel, setOdomFuel] = useState<string>('');

  // 3. Trip Distance Mode Inputs (Starts completely empty)
  const [tripDist, setTripDist] = useState<string>('');
  const [tripFuel, setTripFuel] = useState<string>('');

  // 4. Fuel Economy Converter Inputs (Starts completely empty)
  const [convMpgUs, setConvMpgUs] = useState<string>('');
  const [convMpgUk, setConvMpgUk] = useState<string>('');
  const [convKmL, setConvKmL] = useState<string>('');
  const [convL100, setConvL100] = useState<string>('');

  // 5. Mileage Log Analyzer Rows (Starts completely empty)
  const [logRows, setLogRows] = useState<TripRow[]>([]);

  // 6. Optional Inputs
  const [tankCapacity, setTankCapacity] = useState<string>('');
  const [currentFuel, setCurrentFuel] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');
  const [avgDailyDistance, setAvgDailyDistance] = useState<string>('');
  const [monthlyDistance, setMonthlyDistance] = useState<string>('');
  const [annualDistance, setAnnualDistance] = useState<string>('');

  // 7. Multi-Vehicle Comparison (Up to 5 vehicles)
  const [comparisonVehicles, setComparisonVehicles] = useState<ComparisonVehicle[]>([
    { id: '1', name: '', mpg: '', tankCapacity: '', fuelPrice: '', annualDistance: '' },
    { id: '2', name: '', mpg: '', tankCapacity: '', fuelPrice: '', annualDistance: '' }
  ]);

  // 8. What-If Interactive Sliders
  const [whatIfEnabled, setWhatIfEnabled] = useState<boolean>(false);
  const [whatIfFuelPriceDelta, setWhatIfFuelPriceDelta] = useState<number>(0); // percentage change, e.g. -10% to +100%
  const [whatIfFuelUsedDelta, setWhatIfFuelUsedDelta] = useState<number>(0); // percentage change
  const [whatIfDistanceDelta, setWhatIfDistanceDelta] = useState<number>(0); // percentage change
  const [whatIfTankCapDelta, setWhatIfTankCapDelta] = useState<number>(0); // percentage change

  // --- VALIDATION ERROR STATE ---
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // --- UNIT SYMBOLS & HELPERS ---
  const dUnit = unitSystem === 'imperial' ? 'mi' : 'km';
  const vUnit = unitSystem === 'imperial' ? 'gal' : 'L';
  const feUnit = unitSystem === 'imperial' ? 'MPG (US)' : 'L/100 km';

  // --- ACTIONS: CLEAR ALL ---
  const handleClearAll = () => {
    // Clear vehicle info
    setVehicleName('');
    setManufacturer('');
    setModel('');
    setYear('');
    setFuelType('');
    setTransmission('');
    setEngineSize('');
    setDriveType('');

    // Clear active mode inputs
    setOdomStart('');
    setOdomEnd('');
    setOdomFuel('');
    setTripDist('');
    setTripFuel('');
    
    // Clear converter fields
    setConvMpgUs('');
    setConvMpgUk('');
    setConvKmL('');
    setConvL100('');

    // Clear mileage log
    setLogRows([]);

    // Clear optional inputs
    setTankCapacity('');
    setCurrentFuel('');
    setFuelPrice('');
    setAvgDailyDistance('');
    setMonthlyDistance('');
    setAnnualDistance('');

    // Reset What-If Sliders
    setWhatIfEnabled(false);
    setWhatIfFuelPriceDelta(0);
    setWhatIfFuelUsedDelta(0);
    setWhatIfDistanceDelta(0);
    setWhatIfTankCapDelta(0);

    // Reset multi-vehicle comparison to 2 empty rows
    setComparisonVehicles([
      { id: '1', name: '', mpg: '', tankCapacity: '', fuelPrice: '', annualDistance: '' },
      { id: '2', name: '', mpg: '', tankCapacity: '', fuelPrice: '', annualDistance: '' }
    ]);

    setValidationErrors({});
    setIsExampleLoaded(false);
  };

  // --- ACTIONS: LOAD EXAMPLE ---
  const handleLoadExample = () => {
    setIsExampleLoaded(true);
    setValidationErrors({});

    // Populate Vehicle Info
    setVehicleName('Model 3 Dual Motor');
    setManufacturer('Tesla');
    setModel('Model 3');
    setYear('2023');
    setFuelType('Premium Gasoline');
    setTransmission('Automatic');
    setEngineSize('2.0L Turbo Hybrid equivalent');
    setDriveType('AWD');

    // Populate active tab inputs
    if (activeTab === 'odometer') {
      setOdomStart('12500');
      setOdomEnd('12880');
      setOdomFuel('12.5');
    } else if (activeTab === 'trip') {
      setTripDist('380');
      setTripFuel('14.2');
    } else if (activeTab === 'converter') {
      setConvMpgUs('28');
      setConvMpgUk('33.6');
      setConvKmL('11.9');
      setConvL100('8.4');
    }

    // Populate mileage log analyzer rows
    setLogRows([
      { id: '1', date: '2026-07-01', distance: '350', fuelUsed: '12.8', fuelPrice: '3.65', notes: 'Commute to work, dry conditions' },
      { id: '2', date: '2026-07-08', distance: '410', fuelUsed: '13.9', fuelPrice: '3.79', notes: 'Weekend road trip, highway cruise' },
      { id: '3', date: '2026-07-15', distance: '320', fuelUsed: '13.1', fuelPrice: '3.82', notes: 'Heavy city traffic and rainy days' }
    ]);

    // Populate optional inputs
    setTankCapacity('14.5');
    setCurrentFuel('3.2');
    setFuelPrice('3.79');
    setAvgDailyDistance('35');
    setMonthlyDistance('1050');
    setAnnualDistance('12500');

    // Populate comparison vehicles
    setComparisonVehicles([
      { id: '1', name: 'My Commuter Sedan', mpg: '28', tankCapacity: '14.5', fuelPrice: '3.79', annualDistance: '12500' },
      { id: '2', name: 'Eco Hybrid Alternative', mpg: '52', tankCapacity: '11.0', fuelPrice: '3.79', annualDistance: '12500' },
      { id: '3', name: 'Premium Performance SUV', mpg: '18', tankCapacity: '18.5', fuelPrice: '4.25', annualDistance: '12500' }
    ]);
  };

  // --- REALTIME MATH ENGINE FOR ACTIVE CALCULATOR MODE ---
  const runActiveCalculations = () => {
    let rawDist = 0;
    let rawFuel = 0;
    let computedMpgUs = 0;
    let computedMpgUk = 0;
    let computedKmL = 0;
    let computedL100 = 0;
    let hasCalculation = false;

    // Apply slider modifiers if enabled
    const fuelPriceMultiplier = whatIfEnabled ? (1 + whatIfFuelPriceDelta / 100) : 1;
    const fuelUsedMultiplier = whatIfEnabled ? (1 + whatIfFuelUsedDelta / 100) : 1;
    const distanceMultiplier = whatIfEnabled ? (1 + whatIfDistanceDelta / 100) : 1;
    const tankCapMultiplier = whatIfEnabled ? (1 + whatIfTankCapDelta / 100) : 1;

    // Validate inputs reactively on type
    const errors: Record<string, string> = {};

    if (activeTab === 'odometer') {
      const start = Number(odomStart);
      const end = Number(odomEnd);
      const fuel = Number(odomFuel);

      if (odomStart && odomEnd && odomFuel) {
        if (start < 0) errors.odomStart = 'Starting odometer cannot be negative';
        if (end < 0) errors.odomEnd = 'Ending odometer cannot be negative';
        if (fuel <= 0) errors.odomFuel = 'Fuel added must be greater than zero';
        if (end <= start) errors.odomEnd = 'Ending odometer must be greater than starting odometer';

        if (Object.keys(errors).length === 0) {
          rawDist = (end - start) * distanceMultiplier;
          rawFuel = fuel * fuelUsedMultiplier;
          hasCalculation = true;
        }
      }
    } else if (activeTab === 'trip') {
      const dist = Number(tripDist);
      const fuel = Number(tripFuel);

      if (tripDist && tripFuel) {
        if (dist <= 0) errors.tripDist = 'Trip distance must be greater than zero';
        if (fuel <= 0) errors.tripFuel = 'Fuel used must be greater than zero';

        if (Object.keys(errors).length === 0) {
          rawDist = dist * distanceMultiplier;
          rawFuel = fuel * fuelUsedMultiplier;
          hasCalculation = true;
        }
      }
    }

    if (hasCalculation && rawFuel > 0 && rawDist > 0) {
      if (unitSystem === 'imperial') {
        // Miles and Gallons (US)
        computedMpgUs = rawDist / rawFuel;
        computedMpgUk = computedMpgUs * 1.20095;
        computedKmL = (rawDist * 1.60934) / (rawFuel * 3.78541);
        computedL100 = 100 / computedKmL;
      } else {
        // Kilometers and Liters
        computedKmL = rawDist / rawFuel;
        computedL100 = 100 / computedKmL;
        computedMpgUs = 235.215 / computedL100;
        computedMpgUk = computedMpgUs * 1.20095;
      }
    }

    return {
      hasCalculation,
      distance: rawDist,
      fuelUsed: rawFuel,
      mpgUs: computedMpgUs,
      mpgUk: computedMpgUk,
      kmL: computedKmL,
      l100: computedL100,
      errors
    };
  };

  const activeCalc = runActiveCalculations();

  // Sync validation errors from active calc
  useEffect(() => {
    setValidationErrors(activeCalc.errors);
  }, [odomStart, odomEnd, odomFuel, tripDist, tripFuel, activeTab, unitSystem, whatIfEnabled, whatIfDistanceDelta, whatIfFuelUsedDelta]);

  // --- RECONCILE CONVERTER TABS (Immediate Reactive Sync) ---
  const handleConverterInput = (field: 'us' | 'uk' | 'kml' | 'l100', valString: string) => {
    if (field === 'us') {
      setConvMpgUs(valString);
      const val = Number(valString);
      if (val > 0) {
        setConvMpgUk((val * 1.20095).toFixed(2));
        setConvKmL((val * 0.425144).toFixed(2));
        setConvL100((235.215 / val).toFixed(2));
      } else {
        setConvMpgUk(''); setConvKmL(''); setConvL100('');
      }
    } else if (field === 'uk') {
      setConvMpgUk(valString);
      const val = Number(valString);
      if (val > 0) {
        setConvMpgUs((val * 0.832674).toFixed(2));
        setConvKmL((val * 0.354006).toFixed(2));
        setConvL100((282.481 / val).toFixed(2));
      } else {
        setConvMpgUs(''); setConvKmL(''); setConvL100('');
      }
    } else if (field === 'kml') {
      setConvKmL(valString);
      const val = Number(valString);
      if (val > 0) {
        setConvL100((100 / val).toFixed(2));
        setConvMpgUs((val * 2.35215).toFixed(2));
        setConvMpgUk((val * 2.82481).toFixed(2));
      } else {
        setConvL100(''); setConvMpgUs(''); setConvMpgUk('');
      }
    } else if (field === 'l100') {
      setConvL100(valString);
      const val = Number(valString);
      if (val > 0) {
        setConvKmL((100 / val).toFixed(2));
        setConvMpgUs((235.215 / val).toFixed(2));
        setConvMpgUk((282.481 / val).toFixed(2));
      } else {
        setConvKmL(''); setConvMpgUs(''); setConvMpgUk('');
      }
    }
  };

  // --- RECONCILE MILEAGE LOG ANALYZER ---
  const handleAddLogRow = () => {
    const newId = (logRows.length + 1).toString() + '-' + Date.now();
    setLogRows([...logRows, { id: newId, date: '', distance: '', fuelUsed: '', fuelPrice: '', notes: '' }]);
  };

  const handleRemoveLogRow = (id: string) => {
    setLogRows(logRows.filter(row => row.id !== id));
  };

  const handleUpdateLogRow = (id: string, field: keyof TripRow, value: string) => {
    setLogRows(logRows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const calculateLogMetrics = () => {
    const validRows = logRows.filter(row => Number(row.distance) > 0 && Number(row.fuelUsed) > 0);
    if (validRows.length === 0) return null;

    let totalDist = 0;
    let totalFuel = 0;
    let totalCost = 0;
    let costRowEntries = 0;

    let bestMpg = 0;
    let worstMpg = Infinity;

    validRows.forEach(row => {
      const d = Number(row.distance);
      const f = Number(row.fuelUsed);
      const p = Number(row.fuelPrice || 0);

      totalDist += d;
      totalFuel += f;

      const rowMpg = unitSystem === 'imperial' ? (d / f) : (235.215 / ((f / d) * 100)); // normalized to US MPG for comparison or direct representation
      const rowVal = unitSystem === 'imperial' ? (d / f) : (f / d) * 100;

      if (unitSystem === 'imperial') {
        if (rowVal > bestMpg) bestMpg = rowVal;
        if (rowVal < worstMpg) worstMpg = rowVal;
      } else {
        // In metric, lower L/100km is "better" economy
        if (rowVal < worstMpg || worstMpg === Infinity) worstMpg = rowVal; // actually best!
        if (rowVal > bestMpg) bestMpg = rowVal; // actually worst!
      }

      if (p > 0) {
        totalCost += f * p;
        costRowEntries += f;
      }
    });

    const avgEconomy = unitSystem === 'imperial' ? (totalDist / totalFuel) : (totalFuel / totalDist) * 100;
    const avgCostPerDist = costRowEntries > 0 ? (totalCost / totalDist) : 0;

    return {
      totalDist,
      totalFuel,
      avgEconomy,
      bestMpg: unitSystem === 'imperial' ? bestMpg : worstMpg, // Best L/100km is lower
      worstMpg: unitSystem === 'imperial' ? worstMpg : bestMpg, // Worst L/100km is higher
      avgCostPerDist,
      validCount: validRows.length
    };
  };

  const logMetrics = calculateLogMetrics();

  // --- FUEL EFFICIENCY SCORE ENGINE ---
  const calculateEfficiencyScore = (mpgUs: number) => {
    if (mpgUs <= 0) return { score: 0, label: 'N/A', color: 'text-neutral-400 border-neutral-300 bg-neutral-50 dark:bg-neutral-800/40', text: 'Please enter calculations.' };
    
    // Efficiency grading criteria based on real-world vehicle thresholds
    if (mpgUs >= 45) {
      return {
        score: 98,
        label: 'Excellent',
        color: 'text-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
        text: 'This fuel economy matches highly optimized hybrid, plug-in, or electric equivalent configurations. Your vehicle operates with exceptional efficiency, significantly lowering carbon output and fuel expenses.'
      };
    } else if (mpgUs >= 32) {
      return {
        score: 85,
        label: 'Very Good',
        color: 'text-teal-500 border-teal-500 bg-teal-50 dark:bg-teal-950/20',
        text: 'Superb economy typical of compact sedans or highly modern subcompact crossovers. It represents very low consumption during normal highway driving commutes.'
      };
    } else if (mpgUs >= 23) {
      return {
        score: 65,
        label: 'Average',
        color: 'text-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-950/20',
        text: 'Average standard for typical midsize family sedans, small SUVs, and utility crossovers. Consistent with multi-purpose everyday commuter vehicles.'
      };
    } else if (mpgUs >= 16) {
      return {
        score: 45,
        label: 'Below Average',
        color: 'text-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-950/20',
        text: 'Fuel economy meets standards for full-size pickups, performance vehicles, or cargo vans. High payload capacities and heavy frames lead to higher operational fuel costs.'
      };
    } else {
      return {
        score: 25,
        label: 'Poor',
        color: 'text-rose-500 border-rose-500 bg-rose-50 dark:bg-rose-950/20',
        text: 'High-consumption output typical of commercial heavy machinery, old classic V8 engines, or high-performance supercars. High fuel frequency increases financial and ecological footprints.'
      };
    }
  };

  // Resolve current active economy for results displaying
  const activeMpgUs = activeTab === 'log' 
    ? (logMetrics ? (unitSystem === 'imperial' ? logMetrics.avgEconomy : convertEconomy(logMetrics.avgEconomy, 'L_100km', 'mpg_us')) : 0)
    : activeCalc.mpgUs;

  const currentEconomyVal = activeTab === 'log' 
    ? (logMetrics ? logMetrics.avgEconomy : 0)
    : (unitSystem === 'imperial' ? activeCalc.mpgUs : activeCalc.l100);

  const efficiencyRating = calculateEfficiencyScore(activeMpgUs);

  // --- DETAILED ANNUAL AND MONTHLY ANALYSIS ---
  const calculateAnnualMetrics = () => {
    if (activeMpgUs <= 0) return null;

    const price = Number(fuelPrice) * (whatIfEnabled ? (1 + whatIfFuelPriceDelta / 100) : 1);
    let milesPerYear = Number(annualDistance);
    if (!milesPerYear && monthlyDistance) milesPerYear = Number(monthlyDistance) * 12;
    if (!milesPerYear && avgDailyDistance) milesPerYear = Number(avgDailyDistance) * 365.25;

    if (!milesPerYear) return null;

    // Standardize distance to target unit system (Miles for calculations)
    const annualDistMiles = unitSystem === 'imperial' ? milesPerYear : milesPerYear * 0.621371;

    // Fuel consumed in gallons US
    const annualGallonsUs = annualDistMiles / activeMpgUs;
    const annualLiters = annualGallonsUs * 3.78541;

    const annualFuelConsumption = unitSystem === 'imperial' ? annualGallonsUs : annualLiters;
    const annualFuelCost = price > 0 ? annualGallonsUs * price : 0;

    return {
      consumption: annualFuelConsumption,
      annualCost: annualFuelCost,
      monthlyCost: annualFuelCost / 12,
      weeklyCost: annualFuelCost / 52.17
    };
  };

  const annualMetrics = calculateAnnualMetrics();

  // --- RECONCILE MULTI-VEHICLE COMPARISON ---
  const handleUpdateComparison = (id: string, field: keyof ComparisonVehicle, value: string) => {
    setComparisonVehicles(comparisonVehicles.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleAddComparisonVehicle = () => {
    if (comparisonVehicles.length >= 5) return;
    const newId = (comparisonVehicles.length + 1).toString();
    setComparisonVehicles([...comparisonVehicles, { id: newId, name: '', mpg: '', tankCapacity: '', fuelPrice: '', annualDistance: '' }]);
  };

  const handleRemoveComparisonVehicle = (id: string) => {
    if (comparisonVehicles.length <= 1) return;
    setComparisonVehicles(comparisonVehicles.filter(v => v.id !== id));
  };

  const getCalculatedComparisonList = () => {
    const list = comparisonVehicles.map(v => {
      const mpg = Number(v.mpg || activeMpgUs);
      const price = Number(v.fuelPrice || fuelPrice) * (whatIfEnabled ? (1 + whatIfFuelPriceDelta / 100) : 1);
      const capacity = Number(v.tankCapacity || tankCapacity) * (whatIfEnabled ? (1 + whatIfTankCapDelta / 100) : 1);
      
      let distanceMiles = 12000; // default for comparative metrics if none input
      if (v.annualDistance) {
        distanceMiles = unitSystem === 'imperial' ? Number(v.annualDistance) : Number(v.annualDistance) * 0.621371;
      } else if (annualDistance) {
        distanceMiles = unitSystem === 'imperial' ? Number(annualDistance) : Number(annualDistance) * 0.621371;
      }

      // Fuel economy conversions
      const calculatedMpgUs = mpg;
      const calculatedMpgUk = mpg * 1.20095;
      const calculatedKmL = mpg * 0.425144;
      const calculatedL100 = 235.215 / mpg;

      // Annual volume (gallons US)
      const annualGalUs = distanceMiles / mpg;
      const annualCost = price > 0 ? annualGalUs * price : 0;
      const drivingRange = capacity * mpg;

      const scoreObj = calculateEfficiencyScore(calculatedMpgUs);

      return {
        ...v,
        mpgUs: calculatedMpgUs,
        mpgUk: calculatedMpgUk,
        kmL: calculatedKmL,
        l100: calculatedL100,
        annualCost,
        drivingRange,
        score: scoreObj.score,
        scoreLabel: scoreObj.label,
        hasEconomy: mpg > 0
      };
    });

    const activeEntries = list.filter(v => v.hasEconomy);
    
    // Highlights
    let bestEconomyId = '';
    let lowestCostId = '';
    let longestRangeId = '';

    if (activeEntries.length > 0) {
      const sortedByEco = [...activeEntries].sort((a, b) => b.mpgUs - a.mpgUs);
      bestEconomyId = sortedByEco[0].id;

      const sortedByCost = [...activeEntries].filter(v => v.annualCost > 0).sort((a, b) => a.annualCost - b.annualCost);
      if (sortedByCost.length > 0) lowestCostId = sortedByCost[0].id;

      const sortedByRange = [...activeEntries].filter(v => v.drivingRange > 0).sort((a, b) => b.drivingRange - a.drivingRange);
      if (sortedByRange.length > 0) longestRangeId = sortedByRange[0].id;
    }

    return { list, bestEconomyId, lowestCostId, longestRangeId };
  };

  const comparisonCalculated = getCalculatedComparisonList();

  // --- SMART RULE-BASED INSIGHTS ---
  const generateSmartInsights = () => {
    const insights: string[] = [];
    
    if (activeMpgUs > 0) {
      insights.push(`Your overall fuel economy is ${currentEconomyVal.toFixed(2)} ${feUnit}.`);

      if (activeMpgUs > 35) {
        insights.push(`🌟 Outstanding! Your vehicle operates highly efficiently, reducing environmental carbon footprint and lowering standard refueling expenses.`);
      }

      if (fuelPrice) {
        const price = Number(fuelPrice) * (whatIfEnabled ? (1 + whatIfFuelPriceDelta / 100) : 1);
        const distUnitText = unitSystem === 'imperial' ? 'mile' : 'kilometer';
        const costPerDistVal = unitSystem === 'imperial' ? (price / activeMpgUs) : ((activeMpgUs / 100) * price);
        insights.push(`💸 It costs approximately ${currencySymbol}${costPerDistVal.toFixed(3)} in fuel to drive each ${distUnitText}.`);
      }

      // Propose potential savings with a 10% efficiency boost
      const deltaEconomy = unitSystem === 'imperial' ? activeMpgUs * 1.1 : activeMpgUs * 0.9;
      let annualDistMiles = Number(annualDistance);
      if (!annualDistMiles && monthlyDistance) annualDistMiles = Number(monthlyDistance) * 12;
      if (!annualDistMiles && avgDailyDistance) annualDistMiles = Number(avgDailyDistance) * 365.25;

      if (annualDistMiles && fuelPrice) {
        const price = Number(fuelPrice) * (whatIfEnabled ? (1 + whatIfFuelPriceDelta / 100) : 1);
        const milesNormalized = unitSystem === 'imperial' ? annualDistMiles : annualDistMiles * 0.621371;
        const currentAnnualGal = milesNormalized / activeMpgUs;
        const improvedAnnualGal = milesNormalized / (activeMpgUs * 1.1);
        const savedGal = currentAnnualGal - improvedAnnualGal;
        const savedCost = savedGal * price;
        insights.push(`🎯 Optimizing your driving habits (smooth braking, correct tire pressure) to boost efficiency by 10% would save you roughly ${savedGal.toFixed(1)} ${vUnit} of fuel, keeping ${currencySymbol}${savedCost.toFixed(2)} in your wallet annually!`);
      }
    } else {
      insights.push(`Please input odometer readings, trip distances, or log entries to reveal personalized fuel efficiency intelligence.`);
    }

    if (activeTab === 'log' && logRows.length > 0) {
      const validRows = logRows.filter(r => Number(r.distance) > 0 && Number(r.fuelUsed) > 0);
      if (validRows.length > 0) {
        insights.push(`📊 Your logs contain ${validRows.length} completed track logs. Regularly logging fuel helps capture long-term performance shifts.`);
      }
    }

    return insights;
  };

  const smartInsights = generateSmartInsights();

  // --- ACTIONS: EXPORT EXCEL/CSV ---
  const handleExportCSV = () => {
    let headers = '';
    let rows = '';

    if (activeTab === 'log') {
      headers = 'Date,Distance,Fuel Used,Fuel Price,Notes\n';
      rows = logRows.map(row => `${row.date},${row.distance},${row.fuelUsed},${row.fuelPrice},"${row.notes.replace(/"/g, '""')}"`).join('\n');
    } else {
      headers = 'Metric,Value\n';
      headers += `Distance Travelled,${activeCalc.distance.toFixed(1)} ${dUnit}\n`;
      headers += `Fuel Used,${activeCalc.fuelUsed.toFixed(1)} ${vUnit}\n`;
      headers += `US MPG,${activeCalc.mpgUs.toFixed(2)}\n`;
      headers += `UK MPG,${activeCalc.mpgUk.toFixed(2)}\n`;
      headers += `km/L,${activeCalc.kmL.toFixed(2)}\n`;
      headers += `L/100km,${activeCalc.l100.toFixed(2)}\n`;
    }

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gas_mileage_report_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- ACTIONS: COPY RESULTS ---
  const handleCopyResults = () => {
    let text = `========================================\n`;
    text += `    CALCULATOORA - GAS MILEAGE REPORT\n`;
    text += `========================================\n`;
    if (vehicleName) text += `Vehicle: ${year} ${manufacturer} ${model} (${vehicleName})\n`;
    text += `Mode: ${activeTab === 'odometer' ? 'Mileage from Odometer' : activeTab === 'trip' ? 'Mileage from Trip Distance' : activeTab === 'converter' ? 'Conversions' : 'Mileage Log Analyzer'}\n`;
    text += `Unit System: ${unitSystem.toUpperCase()}\n`;
    text += `----------------------------------------\n`;
    
    if (activeTab !== 'log') {
      text += `Distance: ${activeCalc.distance.toFixed(1)} ${dUnit}\n`;
      text += `Fuel Used: ${activeCalc.fuelUsed.toFixed(1)} ${vUnit}\n`;
      text += `US MPG: ${activeCalc.mpgUs.toFixed(2)} MPG\n`;
      text += `UK MPG: ${activeCalc.mpgUk.toFixed(2)} MPG\n`;
      text += `km/L: ${activeCalc.kmL.toFixed(2)} km/L\n`;
      text += `L/100km: ${activeCalc.l100.toFixed(2)} L/100km\n`;
      if (fuelPrice) {
        const cost = activeCalc.fuelUsed * Number(fuelPrice);
        text += `Fuel Cost: ${currencySymbol}${cost.toFixed(2)}\n`;
      }
    } else if (logMetrics) {
      text += `Total Logs Logged: ${logMetrics.validCount}\n`;
      text += `Total Logged Distance: ${logMetrics.totalDist.toFixed(1)} ${dUnit}\n`;
      text += `Average Fuel Economy: ${logMetrics.avgEconomy.toFixed(2)} ${feUnit}\n`;
      text += `Best Fuel Economy Achievement: ${logMetrics.bestMpg.toFixed(2)} ${feUnit}\n`;
      text += `Worst Fuel Economy Achievement: ${logMetrics.worstMpg.toFixed(2)} ${feUnit}\n`;
    }

    text += `----------------------------------------\n`;
    text += `Efficiency Score: ${efficiencyRating.score}/100 (${efficiencyRating.label})\n`;
    text += `Explanation: ${efficiencyRating.text}\n`;
    text += `========================================\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- ACTIONS: PRINT ---
  const handlePrint = () => {
    window.print();
  };

  // --- CHART DATA COMPILERS ---
  const getEconomyComparisonChartData = () => {
    if (activeMpgUs <= 0) return [];
    return [
      { name: 'MPG (US)', value: activeMpgUs },
      { name: 'MPG (UK)', value: activeMpgUs * 1.20095 },
      { name: 'km/L', value: activeMpgUs * 0.425144 },
    ];
  };

  const getLogTrendChartData = () => {
    return logRows
      .filter(row => Number(row.distance) > 0 && Number(row.fuelUsed) > 0)
      .map((row, index) => {
        const d = Number(row.distance);
        const f = Number(row.fuelUsed);
        const rowMpg = unitSystem === 'imperial' ? (d / f) : (f / d) * 100;
        return {
          name: row.date || `Trip ${index + 1}`,
          Economy: Number(rowMpg.toFixed(2)),
          Distance: d,
          Volume: f
        };
      });
  };

  const getAnnualCostChartData = () => {
    if (!annualMetrics) return [];
    return [
      { name: 'Weekly Cost', value: Number(annualMetrics.weeklyCost.toFixed(2)) },
      { name: 'Monthly Cost', value: Number(annualMetrics.monthlyCost.toFixed(2)) },
      { name: 'Annual Cost', value: Number(annualMetrics.annualCost.toFixed(2)) }
    ];
  };

  const getVehicleComparisonChartData = () => {
    return comparisonCalculated.list
      .filter(v => v.hasEconomy)
      .map(v => ({
        name: v.name || `Vehicle ${v.id}`,
        'Fuel Economy (MPG)': Number(v.mpgUs.toFixed(1)),
        'Annual Fuel Cost': Number(v.annualCost.toFixed(0)),
        'Driving Range': Number(v.drivingRange.toFixed(0))
      }));
  };

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 min-h-screen pb-16 text-neutral-800 dark:text-neutral-100 transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
              <Gauge className="h-9 w-9 text-blue-600 dark:text-cyan-400" />
              Gas Mileage Calculator
            </h1>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400 max-w-2xl text-sm sm:text-base">
              The world's most advanced client-side MPG & fuel efficiency workstation. Monitor vehicle logs, evaluate optional factors, compare multi-car lineups, and solve equations with real-time feedback.
            </p>
          </div>
          
          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleLoadExample}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-all active:scale-95"
              id="load-example-btn"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Load Example
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold text-xs rounded-xl transition-all active:scale-95"
              id="clear-all-btn"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear All
            </button>
            <div className="bg-neutral-200 dark:bg-neutral-800 p-0.5 rounded-xl flex items-center">
              <button
                onClick={() => setUnitSystem('imperial')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${unitSystem === 'imperial' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow' : 'text-neutral-500 dark:text-neutral-400'}`}
              >
                Imperial
              </button>
              <button
                onClick={() => setUnitSystem('metric')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${unitSystem === 'metric' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow' : 'text-neutral-500 dark:text-neutral-400'}`}
              >
                Metric
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CONTROL SUITE & INPUT FORM */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* OPTIONAL VEHICLE PROFILE CARD */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4 flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehicle Information (Optional)
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-neutral-500 mb-1">Vehicle Name</label>
                <input
                  type="text"
                  placeholder="e.g. Daily Commuter Sedan"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  id="vehicle-name-input"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Manufacturer</label>
                <input
                  type="text"
                  placeholder="e.g. Toyota"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Model</label>
                <input
                  type="text"
                  placeholder="e.g. Camry"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2022"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Fuel Type</label>
                <input
                  type="text"
                  placeholder="e.g. Regular Gas"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            
            {/* Show expanded vehicle info parameters */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-neutral-500 mb-0.5">Transmission</label>
                <input
                  type="text"
                  placeholder="Automatic"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2 rounded border border-neutral-200 dark:border-neutral-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-0.5">Engine Size</label>
                <input
                  type="text"
                  placeholder="2.5L"
                  value={engineSize}
                  onChange={(e) => setEngineSize(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2 rounded border border-neutral-200 dark:border-neutral-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-0.5">Drive Type</label>
                <input
                  type="text"
                  placeholder="FWD"
                  value={driveType}
                  onChange={(e) => setDriveType(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2 rounded border border-neutral-200 dark:border-neutral-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* INTERACTIVE WORKSTATION CALCULATION TABS */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col">
            <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-6 pb-2 overflow-x-auto gap-4 whitespace-nowrap scrollbar-none">
              {(['odometer', 'trip', 'converter', 'log'] as CalcTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === tab ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400' : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'}`}
                >
                  {tab === 'odometer' && 'Mileage from Odometer'}
                  {tab === 'trip' && 'Mileage from Trip'}
                  {tab === 'converter' && 'Converter'}
                  {tab === 'log' && 'Mileage Log'}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="flex-grow space-y-4">
              {activeTab === 'odometer' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Starting Odometer ({dUnit})</label>
                    <input
                      type="number"
                      placeholder="e.g. 12500"
                      value={odomStart}
                      onChange={(e) => setOdomStart(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition"
                      id="odom-start-input"
                    />
                    {validationErrors.odomStart && <p className="text-rose-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {validationErrors.odomStart}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Ending Odometer ({dUnit})</label>
                    <input
                      type="number"
                      placeholder="e.g. 12880"
                      value={odomEnd}
                      onChange={(e) => setOdomEnd(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition"
                      id="odom-end-input"
                    />
                    {validationErrors.odomEnd && <p className="text-rose-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {validationErrors.odomEnd}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Fuel Added ({vUnit})</label>
                    <input
                      type="number"
                      placeholder="e.g. 32"
                      value={odomFuel}
                      onChange={(e) => setOdomFuel(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition"
                      id="odom-fuel-input"
                    />
                    {validationErrors.odomFuel && <p className="text-rose-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {validationErrors.odomFuel}</p>}
                  </div>
                </div>
              )}

              {activeTab === 'trip' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Trip Distance ({dUnit})</label>
                    <input
                      type="number"
                      placeholder="e.g. 380"
                      value={tripDist}
                      onChange={(e) => setTripDist(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition"
                      id="trip-dist-input"
                    />
                    {validationErrors.tripDist && <p className="text-rose-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {validationErrors.tripDist}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Fuel Used ({vUnit})</label>
                    <input
                      type="number"
                      placeholder="e.g. 14.2"
                      value={tripFuel}
                      onChange={(e) => setTripFuel(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition"
                      id="trip-fuel-input"
                    />
                    {validationErrors.tripFuel && <p className="text-rose-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {validationErrors.tripFuel}</p>}
                  </div>
                </div>
              )}

              {activeTab === 'converter' && (
                <div className="space-y-4">
                  <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl mb-2 text-xs text-neutral-500 flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <span>Type any value below to see instant, multi-unit economy conversions in real time.</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">MPG (US)</label>
                    <input
                      type="number"
                      placeholder="e.g. 25"
                      value={convMpgUs}
                      onChange={(e) => handleConverterInput('us', e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">MPG (UK)</label>
                    <input
                      type="number"
                      placeholder="e.g. 30"
                      value={convMpgUk}
                      onChange={(e) => handleConverterInput('uk', e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">km/L</label>
                    <input
                      type="number"
                      placeholder="e.g. 10.6"
                      value={convKmL}
                      onChange={(e) => handleConverterInput('kml', e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">L/100km</label>
                    <input
                      type="number"
                      placeholder="e.g. 9.4"
                      value={convL100}
                      onChange={(e) => handleConverterInput('l100', e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'log' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Unlimited Trip Logger</span>
                    <button
                      onClick={handleAddLogRow}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 dark:bg-cyan-950/30 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 font-bold text-xs rounded-lg transition"
                      id="add-log-row-btn"
                    >
                      <Plus className="h-3 w-3" />
                      Add Row
                    </button>
                  </div>
                  
                  {logRows.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                      <FileSpreadsheet className="h-8 w-8 mx-auto text-neutral-300 dark:text-neutral-700 mb-2" />
                      <p className="text-xs text-neutral-400">Your mileage log is currently empty.</p>
                      <button
                        onClick={handleAddLogRow}
                        className="mt-3 px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-700 dark:text-neutral-200 text-xs font-semibold rounded-lg transition"
                      >
                        Add Your First Trip Row
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {logRows.map((row, index) => (
                        <div key={row.id} className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-800/80 relative space-y-2">
                          <button
                            onClick={() => handleRemoveLogRow(row.id)}
                            className="absolute top-2 right-2 text-neutral-400 hover:text-rose-500 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-[10px] font-bold text-neutral-400">Row #{index + 1}</span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="text-[10px] text-neutral-500">Date (optional)</label>
                              <input
                                type="date"
                                value={row.date}
                                onChange={(e) => handleUpdateLogRow(row.id, 'date', e.target.value)}
                                className="w-full p-1 bg-white dark:bg-neutral-800 border rounded"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-500">Notes (optional)</label>
                              <input
                                type="text"
                                placeholder="highway, heavy traffic..."
                                value={row.notes}
                                onChange={(e) => handleUpdateLogRow(row.id, 'notes', e.target.value)}
                                className="w-full p-1 bg-white dark:bg-neutral-800 border rounded"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-500">Dist ({dUnit})</label>
                              <input
                                type="number"
                                placeholder="350"
                                value={row.distance}
                                onChange={(e) => handleUpdateLogRow(row.id, 'distance', e.target.value)}
                                className="w-full p-1 bg-white dark:bg-neutral-800 border rounded"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-500">Fuel ({vUnit})</label>
                              <input
                                type="number"
                                placeholder="12.5"
                                value={row.fuelUsed}
                                onChange={(e) => handleUpdateLogRow(row.id, 'fuelUsed', e.target.value)}
                                className="w-full p-1 bg-white dark:bg-neutral-800 border rounded"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-[10px] text-neutral-500">Price/Unit (optional)</label>
                              <input
                                type="number"
                                placeholder="3.79"
                                value={row.fuelPrice}
                                onChange={(e) => handleUpdateLogRow(row.id, 'fuelPrice', e.target.value)}
                                className="w-full p-1 bg-white dark:bg-neutral-800 border rounded"
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

          {/* OPTIONAL EXTRAS CARD */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Optional Inputs & Distances
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">Tank Capacity ({vUnit})</label>
                <input
                  type="number"
                  placeholder="e.g. 14.5"
                  value={tankCapacity}
                  onChange={(e) => setTankCapacity(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg border focus:outline-none"
                  id="tank-capacity-input"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Current Fuel ({vUnit})</label>
                <input
                  type="number"
                  placeholder="e.g. 3.2"
                  value={currentFuel}
                  onChange={(e) => setCurrentFuel(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg border focus:outline-none"
                  id="current-fuel-input"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Fuel Price ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="e.g. 3.79"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg border focus:outline-none"
                  id="fuel-price-input"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Daily Dist ({dUnit})</label>
                <input
                  type="number"
                  placeholder="e.g. 35"
                  value={avgDailyDistance}
                  onChange={(e) => setAvgDailyDistance(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg border focus:outline-none"
                  id="daily-distance-input"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Monthly Dist ({dUnit})</label>
                <input
                  type="number"
                  placeholder="e.g. 1050"
                  value={monthlyDistance}
                  onChange={(e) => setMonthlyDistance(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg border focus:outline-none"
                  id="monthly-distance-input"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Annual Dist ({dUnit})</label>
                <input
                  type="number"
                  placeholder="e.g. 12500"
                  value={annualDistance}
                  onChange={(e) => setAnnualDistance(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg border focus:outline-none"
                  id="annual-distance-input"
                />
              </div>
            </div>
          </div>

        </div>

        {/* MIDDLE & RIGHT COLUMNS: MAIN RESULTS / VISUALIZATIONS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* QUICK SUMMARY METRICS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white/80 dark:bg-neutral-900/80 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Mileage</span>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white block">
                  {activeMpgUs > 0 ? activeMpgUs.toFixed(1) : '--'}
                </span>
                <span className="text-xs text-neutral-500">MPG (US) Equiv</span>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-neutral-900/80 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Selected Unit Economy</span>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white block">
                  {activeMpgUs > 0 ? currentEconomyVal.toFixed(2) : '--'}
                </span>
                <span className="text-xs text-neutral-500">{feUnit}</span>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-neutral-900/80 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Efficiency Rating</span>
              <div className="mt-2">
                <span className={`text-xl sm:text-2xl font-extrabold tracking-tight block ${activeMpgUs > 0 ? 'text-blue-600 dark:text-cyan-400' : 'text-neutral-400'}`}>
                  {activeMpgUs > 0 ? efficiencyRating.label : 'N/A'}
                </span>
                <span className="text-xs text-neutral-500">{activeMpgUs > 0 ? `Score: ${efficiencyRating.score}/100` : 'Inputs required'}</span>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-neutral-900/80 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Fuel Cost Estimate</span>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white block">
                  {activeMpgUs > 0 && fuelPrice ? `${currencySymbol}${( (activeCalc.fuelUsed || (logMetrics ? logMetrics.totalFuel : 0)) * Number(fuelPrice) * (whatIfEnabled ? (1 + whatIfFuelPriceDelta / 100) : 1)).toFixed(2)}` : '--'}
                </span>
                <span className="text-xs text-neutral-500">{fuelPrice ? 'Calculated' : 'Fuel Price needed'}</span>
              </div>
            </div>

          </div>

          {/* MAIN RESULTS BOARD */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Professional Gas Mileage Report</h2>
                <p className="text-xs text-neutral-500">Includes real-time efficiency metrics and performance comparisons.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyResults}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold text-xs rounded-xl transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold text-xs rounded-xl transition"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold text-xs rounded-xl transition"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  CSV
                </button>
              </div>
            </div>

            {/* RESULTS METRICS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Fuel Economy breakdown</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="text-xs text-neutral-500 font-medium">MPG (US)</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">{activeMpgUs > 0 ? activeMpgUs.toFixed(2) : '--'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="text-xs text-neutral-500 font-medium">MPG (UK)</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">{activeMpgUs > 0 ? (activeMpgUs * 1.20095).toFixed(2) : '--'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="text-xs text-neutral-500 font-medium">km/L</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">{activeMpgUs > 0 ? (activeMpgUs * 0.425144).toFixed(2) : '--'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="text-xs text-neutral-500 font-medium">L/100km</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">{activeMpgUs > 0 ? (235.215 / activeMpgUs).toFixed(2) : '--'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Cost and Consumption Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="text-xs text-neutral-500 font-medium">Cost per Mile</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      {activeMpgUs > 0 && fuelPrice ? `${currencySymbol}${((Number(fuelPrice) * (whatIfEnabled ? (1 + whatIfFuelPriceDelta / 100) : 1)) / activeMpgUs).toFixed(3)}` : '--'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="text-xs text-neutral-500 font-medium">Cost per Kilometer</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      {activeMpgUs > 0 && fuelPrice ? `${currencySymbol}${(((Number(fuelPrice) * (whatIfEnabled ? (1 + whatIfFuelPriceDelta / 100) : 1)) / activeMpgUs) * 0.621371).toFixed(3)}` : '--'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="text-xs text-neutral-500 font-medium">Average Consumption</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      {activeMpgUs > 0 ? `${(unitSystem === 'imperial' ? (1 / activeMpgUs) : (235.215 / activeMpgUs / 100)).toFixed(4)} ${vUnit}/${dUnit}` : '--'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="text-xs text-neutral-500 font-medium">Driving Range</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      {activeMpgUs > 0 && tankCapacity ? `${(Number(tankCapacity) * (whatIfEnabled ? (1 + whatIfTankCapDelta / 100) : 1) * (unitSystem === 'imperial' ? activeMpgUs : activeMpgUs * 1.60934)).toFixed(0)} ${dUnit}` : '--'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* EDUCATIONAL EFFICIENCY SCORE RATING DISPLAY */}
            {activeMpgUs > 0 && (
              <div className={`p-5 rounded-2xl border transition-all ${efficiencyRating.color}`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/60 dark:bg-neutral-900/60 rounded-xl font-black text-xl shadow-sm shrink-0">
                    {efficiencyRating.score}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold tracking-tight flex items-center gap-2">
                      <Award className="h-4 w-4 shrink-0" />
                      Vehicle efficiency rank is rated {efficiencyRating.label}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed opacity-90">{efficiencyRating.text}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* DYNAMIC ANNUAL FUEL FORECASTS */}
          {annualMetrics && (
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Estimated Annual Fuel Analysis
                </h3>
                <p className="text-xs text-neutral-500">Projections based on your designated annual distance inputs.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Weekly Cost</span>
                  <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white block mt-1">{currencySymbol}{annualMetrics.weeklyCost.toFixed(2)}</span>
                </div>
                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Monthly Cost</span>
                  <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white block mt-1">{currencySymbol}{annualMetrics.monthlyCost.toFixed(2)}</span>
                </div>
                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Annual Cost</span>
                  <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white block mt-1">{currencySymbol}{annualMetrics.annualCost.toFixed(2)}</span>
                </div>
                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Annual Consumption</span>
                  <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white block mt-1">{annualMetrics.consumption.toFixed(1)} {vUnit}</span>
                </div>
              </div>
            </div>
          )}

          {/* WHAT-IF SLIDERS */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                  What-If Interactive Adjustment Sliders
                </h3>
                <p className="text-xs text-neutral-500">Tune operational params instantly to watch direct efficiency and savings swings.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={whatIfEnabled}
                  onChange={(e) => setWhatIfEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-xs font-bold text-neutral-500 uppercase">Enable</span>
              </label>
            </div>

            {whatIfEnabled && (
              <div className="space-y-4 pt-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Fuel Price Change: <strong>{whatIfFuelPriceDelta > 0 ? `+${whatIfFuelPriceDelta}` : whatIfFuelPriceDelta}%</strong></span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="150"
                    value={whatIfFuelPriceDelta}
                    onChange={(e) => setWhatIfFuelPriceDelta(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Fuel Used Modifier: <strong>{whatIfFuelUsedDelta > 0 ? `+${whatIfFuelUsedDelta}` : whatIfFuelUsedDelta}%</strong></span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={whatIfFuelUsedDelta}
                    onChange={(e) => setWhatIfFuelUsedDelta(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Driving Distance Modifier: <strong>{whatIfDistanceDelta > 0 ? `+${whatIfDistanceDelta}` : whatIfDistanceDelta}%</strong></span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="100"
                    value={whatIfDistanceDelta}
                    onChange={(e) => setWhatIfDistanceDelta(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Tank Capacity Modifier: <strong>{whatIfTankCapDelta > 0 ? `+${whatIfTankCapDelta}` : whatIfTankCapDelta}%</strong></span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={whatIfTankCapDelta}
                    onChange={(e) => setWhatIfTankCapDelta(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* MULTI-VEHICLE COMPARISON SUITE */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Multi-Vehicle Comparison Suite
                </h3>
                <p className="text-xs text-neutral-500">Benchmark up to five vehicles side-by-side to highlight superior performers.</p>
              </div>
              <button
                onClick={handleAddComparisonVehicle}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-cyan-950/30 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 font-bold text-xs rounded-xl transition self-start sm:self-auto"
                id="add-comparison-vehicle-btn"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Vehicle
              </button>
            </div>

            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-neutral-50 dark:bg-neutral-800/40 text-neutral-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Vehicle Details</th>
                    <th className="p-3">Fuel Economy ({feUnit})</th>
                    <th className="p-3">Tank Cap ({vUnit})</th>
                    <th className="p-3">Fuel Price</th>
                    <th className="p-3">Annual Cost</th>
                    <th className="p-3">Est Range ({dUnit})</th>
                    <th className="p-3">Rank</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {comparisonCalculated.list.map((veh, index) => (
                    <tr key={veh.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10">
                      <td className="p-3">
                        <input
                          type="text"
                          placeholder={`Vehicle Name (e.g. SUV)`}
                          value={veh.name}
                          onChange={(e) => handleUpdateComparison(veh.id, 'name', e.target.value)}
                          className="bg-transparent font-medium border-b border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 focus:outline-none w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          placeholder={`${activeMpgUs > 0 ? currentEconomyVal.toFixed(1) : '30'}`}
                          value={veh.mpg}
                          onChange={(e) => handleUpdateComparison(veh.id, 'mpg', e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 focus:outline-none w-20 font-bold"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          placeholder={`${tankCapacity || '14.5'}`}
                          value={veh.tankCapacity}
                          onChange={(e) => handleUpdateComparison(veh.id, 'tankCapacity', e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 focus:outline-none w-16"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          placeholder={`${fuelPrice || '3.79'}`}
                          value={veh.fuelPrice}
                          onChange={(e) => handleUpdateComparison(veh.id, 'fuelPrice', e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 focus:outline-none w-16"
                        />
                      </td>
                      <td className="p-3 font-semibold text-neutral-900 dark:text-white">
                        {veh.hasEconomy ? `${currencySymbol}${veh.annualCost.toFixed(0)}` : '--'}
                        {comparisonCalculated.lowestCostId === veh.id && veh.annualCost > 0 && (
                          <span className="ml-1 text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1 py-0.5 rounded uppercase">Best Cost</span>
                        )}
                      </td>
                      <td className="p-3">
                        {veh.hasEconomy && veh.drivingRange > 0 ? `${veh.drivingRange.toFixed(0)} ${dUnit}` : '--'}
                        {comparisonCalculated.longestRangeId === veh.id && veh.drivingRange > 0 && (
                          <span className="ml-1 text-[9px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold px-1 py-0.5 rounded uppercase">Best Range</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">{veh.hasEconomy ? veh.scoreLabel : '--'}</span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleRemoveComparisonVehicle(veh.id)}
                          disabled={comparisonCalculated.list.length <= 1}
                          className="text-neutral-400 hover:text-rose-500 disabled:opacity-30 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CHARTS AND VISUALIZATIONS SECTION */}
          {activeMpgUs > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* FUEL ECONOMY COMPARISON BAR CHART */}
              <div className="bg-white/80 dark:bg-neutral-900/80 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Fuel Economy Equivalence</h4>
                  <p className="text-[10px] text-neutral-500">Benchmark your logged vehicle against other common units.</p>
                </div>
                <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getEconomyComparisonChartData()}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                      <YAxis stroke="#888888" fontSize={11} />
                      <Tooltip contentStyle={{ background: '#222222', border: 'none', borderRadius: '8px', color: '#ffffff' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                        {getEconomyComparisonChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#06b6d4' : '#14b8a6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ESTIMATED MULTI-VEHICLE COST COMPARISON */}
              {getVehicleComparisonChartData().length > 0 && (
                <div className="bg-white/80 dark:bg-neutral-900/80 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Comparative Annual Fuel Costs</h4>
                    <p className="text-[10px] text-neutral-500">Visual review of estimated yearly spend per vehicle model.</p>
                  </div>
                  <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getVehicleComparisonChartData()}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                        <YAxis stroke="#888888" fontSize={11} />
                        <Tooltip contentStyle={{ background: '#222222', border: 'none', borderRadius: '8px', color: '#ffffff' }} />
                        <Bar dataKey="Annual Fuel Cost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* TRIP TREND HISTORY AREA CHART */}
              {activeTab === 'log' && getLogTrendChartData().length > 0 && (
                <div className="bg-white/80 dark:bg-neutral-900/80 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Log Mileage Trend History</h4>
                    <p className="text-[10px] text-neutral-500">Track fuel economy changes over logged trips over time.</p>
                  </div>
                  <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getLogTrendChartData()}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                        <YAxis stroke="#888888" fontSize={11} />
                        <Tooltip contentStyle={{ background: '#222222', border: 'none', borderRadius: '8px', color: '#ffffff' }} />
                        <Area type="monotone" dataKey="Economy" stroke="#3b82f6" fillOpacity={0.1} fill="url(#colorEco)" />
                        <defs>
                          <linearGradient id="colorEco" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP BY STEP WORKED SOLUTION CARD */}
          {activeMpgUs > 0 && (
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-2">
                  <Compass className="h-4 w-4" />
                  Step-by-Step Mathematical Solution
                </h3>
                <p className="text-xs text-neutral-500">Comprehensive breakdown of the formulas and numbers used to compile this report.</p>
              </div>
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl space-y-3 font-mono leading-relaxed">
                  <p><strong>1. Formula Definition:</strong></p>
                  {unitSystem === 'imperial' ? (
                    <p className="text-blue-600 dark:text-cyan-400 font-bold">
                      Gas Mileage (MPG) = Total Distance Travelled (miles) / Total Fuel Added (gallons)
                    </p>
                  ) : (
                    <p className="text-blue-600 dark:text-cyan-400 font-bold">
                      Fuel Consumption (L/100km) = (Total Fuel Added (liters) / Total Distance Travelled (kilometers)) * 100
                    </p>
                  )}
                  
                  <p><strong>2. Substitution & Math:</strong></p>
                  {activeTab === 'odometer' && odomStart && odomEnd && odomFuel && (
                    <>
                      <p>• Distance = Ending Odometer ({odomEnd}) - Starting Odometer ({odomStart}) = {Number(odomEnd) - Number(odomStart)} {dUnit}</p>
                      <p>• Fuel Added = {odomFuel} {vUnit}</p>
                      {unitSystem === 'imperial' ? (
                        <p className="text-neutral-800 dark:text-white">
                          • MPG = {Number(odomEnd) - Number(odomStart)} / {odomFuel} = <strong>{((Number(odomEnd) - Number(odomStart)) / Number(odomFuel)).toFixed(2)} MPG</strong>
                        </p>
                      ) : (
                        <p className="text-neutral-800 dark:text-white">
                          • L/100km = ({odomFuel} / {Number(odomEnd) - Number(odomStart)}) * 100 = <strong>{((Number(odomFuel) / (Number(odomEnd) - Number(odomStart))) * 100).toFixed(2)} L/100 km</strong>
                        </p>
                      )}
                    </>
                  )}

                  {activeTab === 'trip' && tripDist && tripFuel && (
                    <>
                      <p>• Distance = {tripDist} {dUnit}</p>
                      <p>• Fuel Used = {tripFuel} {vUnit}</p>
                      {unitSystem === 'imperial' ? (
                        <p className="text-neutral-800 dark:text-white">
                          • MPG = {tripDist} / {tripFuel} = <strong>{(Number(tripDist) / Number(tripFuel)).toFixed(2)} MPG</strong>
                        </p>
                      ) : (
                        <p className="text-neutral-800 dark:text-white">
                          • L/100km = ({tripFuel} / {tripDist}) * 100 = <strong>{((Number(tripFuel) / Number(tripDist)) * 100).toFixed(2)} L/100 km</strong>
                        </p>
                      )}
                    </>
                  )}

                  {activeTab === 'log' && logMetrics && (
                    <>
                      <p>• Normalized Total Distance across logged trip records = {logMetrics.totalDist.toFixed(1)} {dUnit}</p>
                      <p>• Total Fuel Added = {logMetrics.totalFuel.toFixed(1)} {vUnit}</p>
                      {unitSystem === 'imperial' ? (
                        <p className="text-neutral-800 dark:text-white">
                          • Average MPG = {logMetrics.totalDist.toFixed(1)} / {logMetrics.totalFuel.toFixed(1)} = <strong>{logMetrics.avgEconomy.toFixed(2)} MPG</strong>
                        </p>
                      ) : (
                        <p className="text-neutral-800 dark:text-white">
                          • Average L/100km = ({logMetrics.totalFuel.toFixed(1)} / {logMetrics.totalDist.toFixed(1)}) * 100 = <strong>{logMetrics.avgEconomy.toFixed(2)} L/100 km</strong>
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SMART INSIGHTS LIST */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
              Dynamic Mileage Insights
            </h3>
            <div className="space-y-3">
              {smartInsights.map((insight, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* COMPREHENSIVE SEO EDUCATIONAL CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 border-t border-neutral-200 dark:border-neutral-800 pt-12 space-y-12">
        
        <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300 space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Ultimate Gas Mileage & Fuel Efficiency Guide</h2>
            <p className="text-sm leading-relaxed">
              When it comes to vehicle operation costs, understanding and optimizing your vehicle's <strong>gas mileage</strong> (or fuel economy) is one of the single most direct paths to saving money and minimizing environmental footprints. Fuel costs can represent a massive portion of the total cost of car ownership over time. Accurate estimation, diagnostic logging, and mathematical conversion help you take direct control over these metrics.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">What Is Gas Mileage and Fuel Economy?</h3>
              <p className="leading-relaxed">
                In simple terms, <strong>gas mileage</strong> measures how far a vehicle can travel on a given volume of fuel. Standard imperial systems express this metric as <strong>Miles Per Gallon (MPG)</strong>, while metric regions express efficiency as the rate of consumption: <strong>Liters per 100 Kilometers (L/100km)</strong> or <strong>Kilometers per Liter (km/L)</strong>.
              </p>
              <p className="leading-relaxed">
                Measuring gas mileage helps you detect potential hidden engine or fuel system issues early. A sudden drop in fuel efficiency is often the first warning indicator that a vehicle requires spark plug replacements, tire inflation adjustments, or oxygen sensor cleaning.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">How Gas Mileage (MPG) Is Formulated</h3>
              <p className="leading-relaxed">
                To calculate MPG manually, the formula is simple:
              </p>
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl font-mono text-xs border border-neutral-200 dark:border-neutral-700">
                Gas Mileage (MPG) = Distance Travelled (Miles) ÷ Fuel Consumed (Gallons)
              </div>
              <p className="leading-relaxed">
                For example, if you set your trip odometer to zero, drive exactly 350 miles, and then refill your fuel tank to full with 14 gallons of gasoline, your calculation is:
              </p>
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl font-mono text-xs border border-neutral-200 dark:border-neutral-700">
                MPG = 350 ÷ 14 = 25 MPG
              </div>
            </div>
          </section>

          <section className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Ways to Improve Your Vehicle's Gas Mileage</h3>
            <p className="leading-relaxed">
              Improving your fuel economy doesn't always require purchasing a new hybrid or electric vehicle. Minor shifts in driving behavior and vehicle care have profound effects:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Maintain Correct Tire Pressure:</strong> Under-inflated tires increase rolling resistance, degrading gas mileage by up to 3%. Check tire specs inside your driver-side door jamb.</li>
              <li><strong>Drive Smoothly:</strong> Rapid acceleration and sudden, hard braking reduce efficiency by up to 33% on the highway and 5% around town.</li>
              <li><strong>Reduce Excess Vehicle Weight:</strong> Clearing heavy clutter from your trunk can improve mileage. Every extra 100 lbs (45 kg) of cargo reduces efficiency by ~1%.</li>
              <li><strong>Limit Excessive Idling:</strong> Idling can burn a quarter to a half-gallon of fuel per hour. Modern vehicles require no warming up; gentle driving from start is safer and more efficient.</li>
              <li><strong>Avoid High Speeds:</strong> Fuel efficiency drops sharply at speeds above 50 mph (80 km/h). Maintaining steady highway speeds around 60–65 mph maximizes range.</li>
            </ul>
          </section>

          <section className="bg-neutral-100 dark:bg-neutral-800/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Frequently Asked Questions (FAQ)</h3>
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white">Is a US Gallon the same as a UK Gallon?</h4>
                <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                  No. A US liquid gallon is exactly 3.78541 liters, whereas a UK imperial gallon is roughly 20% larger, matching exactly 4.54609 liters. This is why MPG values in the United Kingdom are always numerically higher than US MPG values for the exact same vehicle fuel efficiency.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white">Why does cold weather degrade gas mileage?</h4>
                <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                  Cold outdoor air increases aerodynamic drag because the air is denser. Engine operating fluids also experience greater viscosity when cold, increasing mechanical friction until the motor fully warms up.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white">What causes a sudden drop in fuel efficiency?</h4>
                <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                  Sudden efficiency losses are typically caused by fouled spark plugs, dirty engine air filters, sticky brake calipers, failing fuel injectors, or old, faulty engine oxygen sensors.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3 text-xs sm:text-sm">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Related Workstation Calculators</h3>
            <p className="leading-relaxed">Explore other related calculators inside the Calculatoora universe to maximize road budget planning:</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg font-semibold text-[11px]">Fuel Cost Calculator</span>
              <span className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg font-semibold text-[11px]">Trip Fuel Calculator</span>
              <span className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg font-semibold text-[11px]">Distance Calculator</span>
              <span className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg font-semibold text-[11px]">Car Loan Calculator</span>
              <span className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg font-semibold text-[11px]">Car Depreciation Calculator</span>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
