import { UnitSystem, LengthUnit, AreaUnit, VolumeUnit, RoomData } from './types';

// Standard conversion rates to Meter / Square Meter / Cubic Meter
export const LENGTH_CONVERSION: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144
};

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  const inMeters = value * LENGTH_CONVERSION[from];
  return inMeters / LENGTH_CONVERSION[to];
}

export function convertArea(value: number, from: 'sq_m' | 'sq_ft', to: 'sq_m' | 'sq_ft'): number {
  if (from === to) return value;
  if (from === 'sq_m') return value * 10.76391; // m2 to ft2
  return value / 10.76391; // ft2 to m2
}

export function convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number {
  if (from === to) return value;
  // standard conversions to cubic meters
  const toCuM: Record<VolumeUnit, number> = {
    cu_m: 1,
    cu_yd: 0.764554857984,
    liter: 0.001
  };
  const inCuM = value * toCuM[from];
  return inCuM / toCuM[to];
}

// Material specs and standard contractor coverage metrics
export const MATERIAL_SPECS = {
  brick: {
    // Standard sizes: 190 x 90 x 90 mm
    metric: { length: 0.19, height: 0.09, joint: 0.01, name: 'Standard Modular (190×90×90 mm)' },
    imperial: { length: 8 / 12, height: 2.25 / 12, joint: 0.375 / 12, name: 'Standard Modular (8" x 2-1/4" x 3-5/8")' }
  },
  block: {
    // Concrete block size: 390 x 190 x 190 mm (8x8x16 in)
    metric: { length: 0.39, height: 0.19, joint: 0.01, name: 'Standard Block (390×190×190 mm)' },
    imperial: { length: 15.625 / 12, height: 7.625 / 12, joint: 0.375 / 12, name: 'Standard Block (16" x 8" x 8")' }
  },
  drywall: {
    metric: { area: 2.88, name: 'Standard Sheet (1.2m x 2.4m)' }, // 2.88 m2
    imperial: { area: 32, name: 'Standard Sheet (4ft x 8ft)' } // 32 sq ft
  },
  tile: {
    metric: { area: 0.3 * 0.3, name: 'Square Tile (300×300 mm)' }, // 0.09 m2
    imperial: { area: 1, name: 'Square Tile (12" x 12")' } // 1 sq ft
  },
  paint: {
    metric: { coveragePerLiter: 10, name: 'Standard Emulsion (10 m²/L)' },
    imperial: { coveragePerGallon: 350, name: 'Standard Latex (350 sq ft/gal)' }
  },
  pavingStone: {
    metric: { area: 0.2 * 0.1, name: 'Rectangular Paver (200×100 mm)' }, // 0.02 m2
    imperial: { area: 0.222, name: 'Standard Paver (4" x 8" = 0.222 sq ft)' } // 0.222 sq ft
  },
  roofingSheet: {
    metric: { area: 2.0, name: 'Corrugated Sheet (2.0 m²)' },
    imperial: { area: 21.5, name: 'Corrugated Sheet (3ft x 7ft = 21.5 sq ft)' }
  }
};

export interface MaterialEstimate {
  key: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  description: string;
}

export function calculateMaterials({
  areaSqM,
  volumeCuM,
  unitSystem,
  prices = {}
}: {
  areaSqM: number;
  volumeCuM: number;
  unitSystem: UnitSystem;
  prices?: Record<string, number>;
}): MaterialEstimate[] {
  const isMetric = unitSystem === 'metric';
  const areaSqFt = areaSqM * 10.76391;
  const volumeCuYd = volumeCuM / 0.764554857984;

  const cost = (key: string, qty: number, defaultPrice: number) => {
    const price = prices[key] !== undefined ? prices[key] : defaultPrice;
    return qty * price;
  };

  const list: MaterialEstimate[] = [];

  // 1. Concrete (Volume-based)
  // Concrete uses Cement, Sand, Gravel as subcomponents or is estimated as direct mixed volume
  const concreteQty = isMetric ? volumeCuM : volumeCuYd;
  const concreteUnit = isMetric ? 'm³' : 'yd³';
  list.push({
    key: 'concrete',
    name: 'Poured Concrete',
    quantity: concreteQty,
    unit: concreteUnit,
    estimatedCost: cost('concrete', concreteQty, isMetric ? 120 : 150),
    description: 'Structural foundation, slab, or driveway poured concrete slurry.'
  });

  // 2. Cement (bags of 50kg or 94lb)
  // Standard mix 1:2:4 has 350 kg cement per m3 concrete (approx 7 bags of 50kg, or 7.5 bags of 94lb per yd3)
  const cementQty = volumeCuM * (isMetric ? 7 : 7.5);
  const cementUnit = isMetric ? 'bags (50kg)' : 'bags (94lb)';
  list.push({
    key: 'cement',
    name: 'Portland Cement',
    quantity: cementQty,
    unit: cementUnit,
    estimatedCost: cost('cement', cementQty, isMetric ? 8 : 12),
    description: 'Component of concrete mix or bricklaying mortar compound.'
  });

  // 3. Sand
  // Standard mix requires ~0.5 m3 sand per m3 concrete, or ~0.55 yd3 sand per yd3 concrete
  const sandQty = volumeCuM * (isMetric ? 0.5 : 0.55 * 1.30795); // roughly cubic yards or cubic meters
  const sandUnit = isMetric ? 'm³' : 'yd³';
  list.push({
    key: 'sand',
    name: 'Construction Sand',
    quantity: sandQty,
    unit: sandUnit,
    estimatedCost: cost('sand', sandQty, isMetric ? 30 : 40),
    description: 'Fine aggregate needed for concrete mixes and brick mortars.'
  });

  // 4. Gravel
  // Standard mix requires ~0.8 m3 gravel per m3 concrete, or ~0.85 yd3 sand per yd3 concrete
  const gravelQty = volumeCuM * (isMetric ? 0.8 : 0.85 * 1.30795);
  const gravelUnit = isMetric ? 'm³' : 'yd³';
  list.push({
    key: 'gravel',
    name: 'Coarse Gravel',
    quantity: gravelQty,
    unit: gravelUnit,
    estimatedCost: cost('gravel', gravelQty, isMetric ? 35 : 45),
    description: 'Coarse aggregate backing structural concrete poured cores.'
  });

  // 5. Bricks
  // Wall-area based
  const brickSpec = isMetric ? MATERIAL_SPECS.brick.metric : MATERIAL_SPECS.brick.imperial;
  const brickEffArea = (brickSpec.length + brickSpec.joint) * (brickSpec.height + brickSpec.joint); // in m2 or ft2
  const activeArea = isMetric ? areaSqM : areaSqFt;
  const rawBricks = activeArea / brickEffArea;
  const brickQty = Math.ceil(isNaN(rawBricks) || rawBricks <= 0 ? 0 : rawBricks);
  list.push({
    key: 'bricks',
    name: 'Masonry Bricks',
    quantity: brickQty,
    unit: 'units',
    estimatedCost: cost('bricks', brickQty, isMetric ? 0.6 : 0.75),
    description: `Bricks with standard ${isMetric ? '10mm' : '3/8"'} mortar joint spacing.`
  });

  // 6. Blocks
  const blockSpec = isMetric ? MATERIAL_SPECS.block.metric : MATERIAL_SPECS.block.imperial;
  const blockEffArea = (blockSpec.length + blockSpec.joint) * (blockSpec.height + blockSpec.joint);
  const rawBlocks = activeArea / blockEffArea;
  const blockQty = Math.ceil(isNaN(rawBlocks) || rawBlocks <= 0 ? 0 : rawBlocks);
  list.push({
    key: 'blocks',
    name: 'Concrete Blocks',
    quantity: blockQty,
    unit: 'units',
    estimatedCost: cost('blocks', blockQty, isMetric ? 2.5 : 3.5),
    description: 'Standard hollow-core backing concrete foundation masonry blocks.'
  });

  // 7. Steel Rebar
  // Typically 5 meters of rebar per square meter of slab grid (or 1.5 ft per sq ft)
  const steelQty = areaSqM * (isMetric ? 5 : 16.4); // linear meters or feet
  const steelUnit = isMetric ? 'meters' : 'feet';
  list.push({
    key: 'steel',
    name: 'Steel Rebar',
    quantity: steelQty,
    unit: steelUnit,
    estimatedCost: cost('steel', steelQty, isMetric ? 3 : 1),
    description: 'Reinforcement bars for slab core tension mitigation.'
  });

  // 8. Structural Wood (Studs)
  // Typically 3.5 linear meters per sq m (or 1.15 linear feet per sq ft)
  const woodQty = areaSqM * (isMetric ? 3.5 : 11.5);
  const woodUnit = isMetric ? 'meters' : 'feet';
  list.push({
    key: 'wood',
    name: 'Structural Lumber',
    quantity: woodQty,
    unit: woodUnit,
    estimatedCost: cost('wood', woodQty, isMetric ? 4 : 1.5),
    description: 'Framer studs, wall plates, ceiling trusses, and general blocking.'
  });

  // 9. Drywall Sheets
  const drywallSpec = isMetric ? MATERIAL_SPECS.drywall.metric : MATERIAL_SPECS.drywall.imperial;
  const rawDrywall = activeArea / drywallSpec.area;
  const drywallQty = Math.ceil(isNaN(rawDrywall) || rawDrywall <= 0 ? 0 : rawDrywall);
  list.push({
    key: 'drywall',
    name: 'Drywall Sheets',
    quantity: drywallQty,
    unit: 'sheets',
    estimatedCost: cost('drywall', drywallQty, isMetric ? 12 : 15),
    description: 'Standard plasterboards for wall and ceiling panel cladding.'
  });

  // 10. Floor Tiles
  const tileSpec = isMetric ? MATERIAL_SPECS.tile.metric : MATERIAL_SPECS.tile.imperial;
  const rawTiles = activeArea / tileSpec.area;
  const tileQty = Math.ceil(isNaN(rawTiles) || rawTiles <= 0 ? 0 : rawTiles);
  list.push({
    key: 'tiles',
    name: 'Ceramic Tiles',
    quantity: tileQty,
    unit: 'pieces',
    estimatedCost: cost('tiles', tileQty, isMetric ? 3 : 4),
    description: 'Interlocking glazed floor or backing wall cladding tiling.'
  });

  // 11. Liquid Paint
  const paintCoverage = isMetric ? MATERIAL_SPECS.paint.metric.coveragePerLiter : MATERIAL_SPECS.paint.imperial.coveragePerGallon / 10.76391;
  const paintQty = parseFloat((areaSqM / paintCoverage).toFixed(1));
  const paintUnit = isMetric ? 'liters' : 'gallons';
  list.push({
    key: 'paint',
    name: 'Protective Paint',
    quantity: paintQty,
    unit: paintUnit,
    estimatedCost: cost('paint', paintQty, isMetric ? 15 : 45),
    description: 'Aesthetic surface coating coverage including double coats.'
  });

  // 12. Thermal Insulation
  const insulationQty = isMetric ? areaSqM : areaSqFt;
  const insulationUnit = isMetric ? 'm²' : 'ft²';
  list.push({
    key: 'insulation',
    name: 'Fiberglass Insulation',
    quantity: insulationQty,
    unit: insulationUnit,
    estimatedCost: cost('insulation', insulationQty, isMetric ? 10 : 1.2),
    description: 'R-Value rated fiberglass batts or rolls for thermal shielding.'
  });

  // 13. Roofing Sheets
  const roofingSpec = isMetric ? MATERIAL_SPECS.roofingSheet.metric : MATERIAL_SPECS.roofingSheet.imperial;
  const rawRoofing = activeArea / roofingSpec.area;
  const roofingQty = Math.ceil(isNaN(rawRoofing) || rawRoofing <= 0 ? 0 : rawRoofing);
  list.push({
    key: 'roofing',
    name: 'Roofing Sheets',
    quantity: roofingQty,
    unit: 'sheets',
    estimatedCost: cost('roofing', roofingQty, isMetric ? 18 : 25),
    description: 'Heavy duty weatherproofing corrugation metal roofing panels.'
  });

  // 14. Paving Stones
  const pavingSpec = isMetric ? MATERIAL_SPECS.pavingStone.metric : MATERIAL_SPECS.pavingStone.imperial;
  const rawPaving = activeArea / pavingSpec.area;
  const pavingQty = Math.ceil(isNaN(rawPaving) || rawPaving <= 0 ? 0 : rawPaving);
  list.push({
    key: 'pavingStones',
    name: 'Paving Stones',
    quantity: pavingQty,
    unit: 'units',
    estimatedCost: cost('pavingStones', pavingQty, isMetric ? 1.5 : 2.0),
    description: 'Heavy duty interlocking clay pavers for driveways or patios.'
  });

  return list;
}

// Rule-based insights generator
export function generateInsights({
  totalCost,
  materialCost,
  laborCost,
  wastePercent,
  areaSqM,
  concreteVolume,
  unitSystem
}: {
  totalCost: number;
  materialCost: number;
  laborCost: number;
  wastePercent: number;
  areaSqM: number;
  concreteVolume: number;
  unitSystem: UnitSystem;
}): string[] {
  const insights: string[] = [];
  const isMetric = unitSystem === 'metric';

  if (totalCost > 0) {
    const matRatio = (materialCost / totalCost) * 100;
    const labRatio = (laborCost / totalCost) * 100;

    if (matRatio > 0) {
      insights.push(`Material costs account for approximately ${matRatio.toFixed(0)}% of the total estimate.`);
    }
    if (labRatio > 0) {
      insights.push(`Labor expenses make up roughly ${labRatio.toFixed(0)}% of your estimated budget.`);
    }
  }

  if (wastePercent > 0 && materialCost > 0) {
    const wasteCost = (materialCost * (wastePercent / 100)) / (1 + wastePercent / 100);
    insights.push(`Your selected ${wastePercent}% waste buffer adds approximately $${wasteCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} to the material expenditure. Increasing this allowance from 5% to 10% on standard builds offsets onsite cuts, transit damage, and layout errors.`);
  } else {
    insights.push(`Standard construction planning recommends adding a 5% to 10% waste buffer to safeguard against onsite cuts, transit breakage, and installation errors.`);
  }

  if (areaSqM > 0) {
    const areaVal = isMetric ? areaSqM : areaSqM * 10.76391;
    const areaUnit = isMetric ? 'm²' : 'sq ft';
    insights.push(`Your calculated construction envelope covers a structural footprint of ${areaVal.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${areaUnit}.`);
  }

  if (concreteVolume > 0) {
    const volVal = isMetric ? concreteVolume : concreteVolume / 0.764554857984;
    const volUnit = isMetric ? 'm³' : 'cubic yards';
    insights.push(`The project requires concrete pouring of approximately ${volVal.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${volUnit}. Ensure local batch plants are notified 48 hours prior to the pour.`);
  }

  insights.push(`Rule of Thumb: Foundations generally require 4-inch minimum gravel compaction support underneath poured concrete to prevent seasonal structural shift.`);

  return insights;
}

// Sample load project
export const LOADED_SAMPLE_PROJECT = {
  unitSystem: 'imperial' as UnitSystem,
  projectType: 'residential_house' as 'residential_house',
  
  // Area Calculator
  areaLength: '45',
  areaWidth: '30',
  areaLengthUnit: 'ft' as LengthUnit,
  areaWidthUnit: 'ft' as LengthUnit,

  // Volume Calculator
  volumeLength: '45',
  volumeWidth: '30',
  volumeHeight: '10',
  volumeLengthUnit: 'ft' as LengthUnit,
  volumeWidthUnit: 'ft' as LengthUnit,
  volumeHeightUnit: 'ft' as LengthUnit,

  // Material type selection
  materialType: 'concrete',

  // Estimator Costs
  materialCost: '4500',
  laborCostInput: '3200',
  equipmentCost: '1200',
  transportationCost: '450',
  wastePercent: '10',
  taxPercent: '8',
  otherCosts: '600',

  // Material Waste
  wasteEstPercent: '10',

  // Labor
  workersCount: '4',
  workingHoursPerDay: '8',
  hourlyRate: '35',

  // Timeline
  workingDaysPerWeek: '5',
  crewSize: '4',
  estimatedDailyProgress: '150', // in sq ft

  // Rooms list
  rooms: [
    { id: 'room-1', name: 'Master Living Suite', length: '20', width: '15', height: '10' },
    { id: 'room-2', name: 'Fitted Kitchen & Dining', length: '15', width: '12', height: '10' },
    { id: 'room-3', name: 'Double Guest Bedroom', length: '12', width: '10', height: '10' }
  ]
};
