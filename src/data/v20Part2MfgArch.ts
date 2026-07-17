import { Calculator } from '../types';

export const V20_PART2_CALCULATORS: Calculator[] = [
  // ====================================== MANUFACTURING QUALITY ======================================
  {
    id: 'quality-rate',
    name: 'Quality Rate Calculator',
    slug: 'quality-rate',
    category: 'manufacturing',
    description: 'Calculate your factory\'s quality yield percentage and First Pass Yield (FPY) metrics.',
    formula: 'Quality Rate = (Good Units Produced / Total Units Produced) * 100',
    explanation: 'Measures process reliability inside manufacturing environments. It defines the percentage of units that exit production loops without needing salvage work, repair, or scrap write-offs.',
    example: 'Generating 9,500 functional circuit boards out of a 10,000 board run yields a 95% quality rate.',
    inputs: [
      { id: 'totalProduced', label: 'Total Units Produced (Batch Size)', type: 'number', defaultValue: 5000, min: 1 },
      { id: 'goodUnits', label: 'Good Units Produced (No Defects)', type: 'number', defaultValue: 4850, min: 0 }
    ],
    faq: [
      { question: 'Why is Quality Rate critical in Six Sigma?', answer: 'In Six Sigma systems, high quality means minimal standard deviation from specifications, aiming for 3.4 defects per million opportunities (99.99966%).' }
    ],
    relatedSlugs: ['defect-rate', 'production-loss', 'efficiency-rate'],
    seoTitle: 'Manufacturing Quality Rate Calculator | Yield & FPY Solver',
    seoDescription: 'Obtain manufacturing process accuracy indices. Calculate quality percentages and verify Six Sigma product rates from bad batch audits.',
    calculate: (inputs) => {
      const total = Number(inputs.totalProduced || 1);
      const good = Number(inputs.goodUnits || 0);

      const validatedGood = Math.min(total, good);
      const qualityRate = (validatedGood / total) * 100;
      const defectRate = 100 - qualityRate;

      return {
        results: [
          { label: 'Quality Rate Yield', value: `${qualityRate.toFixed(2)}%`, isPrimary: true },
          { label: 'Process Loss / Defect Rate', value: `${defectRate.toFixed(2)}%`, isPrimary: true },
          { label: 'Good Units Out', value: validatedGood.toLocaleString() },
          { label: 'Defective Units Out', value: (total - validatedGood).toLocaleString() }
        ]
      };
    }
  },
  {
    id: 'defect-rate',
    name: 'Defect Rate Calculator',
    slug: 'defect-rate',
    category: 'manufacturing',
    description: 'Calculate product defect ratios and model parts-per-million (PPM) thresholds.',
    formula: 'Defect Rate = (Defective Units / Total Inspected) * 100',
    explanation: 'Audits product quality standards. Helps operators keep track of structural flaws, design imperfections, and logistics damages across production batches.',
    example: 'Finding 25 flawed gearboxes during a standard inspection of 2,000 models represents a 1.25% defect rate.',
    inputs: [
      { id: 'inspected', label: 'Total Units Inspected', type: 'number', defaultValue: 10000, min: 1 },
      { id: 'defective', label: 'Defective Units Found', type: 'number', defaultValue: 45, min: 0 }
    ],
    faq: [
      { question: 'What is PPM and why is it preferred over raw percentages?', answer: 'PPM stands for Parts Per Million. In precise modern electronics (chips, sensors), defect scales are extremely tiny. A defect of 0.0045% translates to 45 PPM, which is much more practical for high-precision reporting.' }
    ],
    relatedSlugs: ['quality-rate', 'waste-percentage', 'production-yield'],
    seoTitle: 'Quality Defect Rate & PPM Calculator | Six Sigma Audits',
    seoDescription: 'Track product defect levels instantly. Convert raw compliance logs into percentage ratios and Parts Per Million (PPM) counts.',
    calculate: (inputs) => {
      const inspected = Number(inputs.inspected || 1);
      const defective = Number(inputs.defective || 0);

      const validatedDefects = Math.min(inspected, defective);
      const rate = (validatedDefects / inspected) * 100;
      const ppm = (validatedDefects / inspected) * 1000000;

      return {
        results: [
          { label: 'Defect Rate', value: `${rate.toFixed(3)}%`, isPrimary: true },
          { label: 'Defect PPM Index', value: `${Math.round(ppm).toLocaleString()} PPM`, isPrimary: true },
          { label: 'Pass Rate (Acceptable Quality)', value: `${(100 - rate).toFixed(3)}%` }
        ]
      };
    }
  },
  {
    id: 'production-loss',
    name: 'Production Loss Calculator',
    slug: 'production-loss',
    category: 'manufacturing',
    description: 'Calculate the total volume of lost production and estimate the associated financial impact.',
    formula: 'Value of Loss = (Target Output - Actual Output) * Cost per Unit',
    explanation: 'Quantifies the financial cost of underperformance, helping floor managers justify maintenance investments and identify efficiency bottlenecks.',
    example: 'Failing to hit a daily target of 8,000 sodas, delivering only 7,200 at a manufacturing unit-margin of $0.40.',
    inputs: [
      { id: 'targetOutput', label: 'Target / Standard Production Output', type: 'number', defaultValue: 12000, min: 1 },
      { id: 'actualOutput', label: 'Actual Production Output', type: 'number', defaultValue: 10300, min: 0 },
      { id: 'costPerUnit', label: 'Production Cost / Margin per Unit ($)', type: 'number', defaultValue: 1.85, min: 0, step: 0.1 }
    ],
    faq: [
      { question: 'What are the main causes or categories of production loss?', answer: 'The "Six Big Losses" are unplanned downtime, setups/adjustments, idling/minor stops, reduced operating speed, startup defects, and production defects.' }
    ],
    relatedSlugs: ['quality-rate', 'machine-downtime', 'efficiency-rate'],
    seoTitle: 'Production Volume Loss & Cost Calculator | Manufacturing Loss Solver',
    seoDescription: 'Calculate lost production capacity value. See total lost units, output deficit value, and overall volume utilization percentages.',
    calculate: (inputs) => {
      const target = Number(inputs.targetOutput || 1);
      const actual = Number(inputs.actualOutput || 0);
      const unitCost = Number(inputs.costPerUnit || 0);

      const lostUnits = Math.max(0, target - actual);
      const financialLoss = lostUnits * unitCost;
      const efficiencyLoss = (lostUnits / target) * 100;

      return {
        results: [
          { label: 'Total Lost Production Worth', value: financialLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Target Deficit (Lost Units)', value: lostUnits.toLocaleString(), unit: 'units', isPrimary: true },
          { label: 'Overall Volume Deficit', value: `${efficiencyLoss.toFixed(1)}%` },
          { label: 'Capacity Utilization Rate', value: `${(100 - efficiencyLoss).toFixed(1)}%` }
        ]
      };
    }
  },
  {
    id: 'waste-percentage',
    name: 'Waste Percentage Calculator',
    slug: 'waste-percentage',
    category: 'manufacturing',
    description: 'Calculate raw material scrap percentages and measure material yield efficiency levels.',
    formula: 'Waste % = ((Total Input Mass - Sold Output Mass) / Total Input Mass) * 100',
    explanation: 'Tracks raw resource conversion efficiency inside manufacturing plants. Helps designers and floor supervisors monitor scrap rates and optimize sheet-cutting or molding layouts.',
    example: 'Using 10,000 lbs of steel sheets to produce 8,200 lbs of finished automotive stamped frames.',
    inputs: [
      { id: 'inputMass', label: 'Total Raw Material Input Weight (kg/lbs)', type: 'number', defaultValue: 2500, min: 1 },
      { id: 'outputMass', label: 'Sold Product Output Weight (kg/lbs)', type: 'number', defaultValue: 2125, min: 0 },
      { id: 'materialUnitCost', label: 'Raw Material Cost per Weight Unit ($/kg-lbs)', type: 'number', defaultValue: 3.5, min: 0, step: 0.1 }
    ],
    faq: [
      { question: 'How is waste different from reject?', answer: 'Waste includes inevitable process scrap, like trimmed metal edges, dust, chemical vapor releases, and wood trimmings, whereas rejects are finished products that failed inspection.' }
    ],
    relatedSlugs: ['defect-rate', 'production-yield', 'quality-rate'],
    seoTitle: 'Material Waste Percentage & Scrap Cost Calculator',
    seoDescription: 'Accurately audit physical material loss ratios. Compute gross inputs, product weights, and estimate scrap expense values.',
    calculate: (inputs) => {
      const input = Number(inputs.inputMass || 1);
      const output = Number(inputs.outputMass || 0);
      const materialCost = Number(inputs.materialUnitCost || 0);

      const validatedOutput = Math.min(input, output);
      const wasteMass = input - validatedOutput;
      const wastePercent = (wasteMass / input) * 100;
      const lostMaterialCost = wasteMass * materialCost;

      return {
        results: [
          { label: 'Material Waste Rate', value: `${wastePercent.toFixed(1)}%`, isPrimary: true },
          { label: 'Financial Cost of Scrap Materials', value: lostMaterialCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Scraped Material Mass', value: wasteMass.toLocaleString(), unit: 'mass units' },
          { label: 'Net Material Conversion Yield', value: `${(100 - wastePercent).toFixed(1)}%` }
        ]
      };
    }
  },
  {
    id: 'efficiency-rate',
    name: 'Overall Equipment Effectiveness (OEE) Calculator',
    slug: 'efficiency-rate',
    category: 'manufacturing',
    description: 'Calculate Overall Equipment Effectiveness (OEE) using standard Availability, Performance, and Quality metrics.',
    formula: 'OEE = Availability % * Performance % * Quality %',
    explanation: 'OEE is the gold standard KPI for manufacturing productivity. It helps you understand if your equipment is running at full speed and of good status.',
    example: 'A machine with 85% availability, 90% production speed performance, and 98% quality rate scores a highly respectable OEE.',
    inputs: [
      { id: 'availability', label: 'Availability Rate (%) (e.g. uptime)', type: 'number', defaultValue: 88, min: 0, max: 100, step: 0.1 },
      { id: 'performance', label: 'Performance Rate (%) (e.g. machine speed)', type: 'number', defaultValue: 92, min: 0, max: 100, step: 0.1 },
      { id: 'quality', label: 'Quality Rate (%) (e.g. non-defect ratio)', type: 'number', defaultValue: 97, min: 0, max: 100, step: 0.1 }
    ],
    faq: [
      { question: 'What is considered a world-class OEE score?', answer: 'A world-class OEE score is considered to be 85% or higher. Typical manufacturing plants hover around 60%, leaving significant room for optimization.' }
    ],
    relatedSlugs: ['quality-rate', 'machine-downtime', 'production-loss'],
    seoTitle: 'OEE Overall Equipment Effectiveness Calculator | Manufacturing KPI Solver',
    seoDescription: 'Perform rapid OEE audits on factory assets. Combine machinery availability, production speed, and quality output scores instantly.',
    calculate: (inputs) => {
      const avail = Number(inputs.availability || 0) / 100;
      const perf = Number(inputs.performance || 0) / 100;
      const qual = Number(inputs.quality || 0) / 100;

      const oee = avail * perf * qual * 100;

      return {
        results: [
          { label: 'Overall Equipment Effectiveness (OEE)', value: `${oee.toFixed(1)}%`, isPrimary: true },
          { label: 'Ideal Benchmark Target', value: '85.0%', unit: 'or higher' },
          { label: 'Uptime / Availability Loss Factor', value: `${((1 - avail) * 100).toFixed(1)}%` },
          { label: 'Speed / Performance Loss Factor', value: `${((1 - perf) * 100).toFixed(1)}%` }
        ]
      };
    }
  },
  {
    id: 'machine-downtime',
    name: 'Machine Downtime Calculator',
    slug: 'machine-downtime',
    category: 'manufacturing',
    description: 'Track unplanned equipment shutdowns and calculate the total financial leak caused by idle staff or production stops.',
    formula: 'Financial Loss = Downtime Duration * Cost Per Hour',
    explanation: 'Quantifies the hourly financial cost of inactive machinery. Accounts for lost operator labor and missing unit production value.',
    example: '6 hours of unscheduled robotic lift maintenance, where idle production is valued at $850 per hour.',
    inputs: [
      { id: 'plannedHours', label: 'Planned Weekly Operating Hours', type: 'number', defaultValue: 120, min: 1 },
      { id: 'downtimeHours', label: 'Unplanned Downtime Duration (Hours)', type: 'number', defaultValue: 8.5, min: 0, max: 168, step: 0.5 },
      { id: 'hourlyLossRate', label: 'Hourly Financial Loss Rate ($/hour)', type: 'number', defaultValue: 650, min: 0 }
    ],
    faq: [
      { question: 'Why is unscheduled downtime so expensive?', answer: 'Unscheduled downtime is costly because it forces operators to wait, misses shipping deadlines, and can damage materials stranded inside the line.' }
    ],
    relatedSlugs: ['efficiency-rate', 'production-loss', 'quality-rate'],
    seoTitle: 'Unplanned Machine Downtime & Labor Loss Calculator',
    seoDescription: 'Calculate direct financial losses from manufacturing equipment halts. Compute total uptime ratios, idle hours, and cost impact.',
    calculate: (inputs) => {
      const planned = Number(inputs.plannedHours || 1);
      const downtime = Number(inputs.downtimeHours || 0);
      const rate = Number(inputs.hourlyLossRate || 0);

      const validatedDowntime = Math.min(planned, downtime);
      const activeRunningHours = planned - validatedDowntime;
      const uptimePercentage = (activeRunningHours / planned) * 100;
      const financialLoss = validatedDowntime * rate;

      return {
        results: [
          { label: 'Financial Cost of Halts', value: financialLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Machine Uptime Rate', value: `${uptimePercentage.toFixed(1)}%`, isPrimary: true },
          { label: 'Actual Active Running Hours', value: activeRunningHours.toLocaleString(), unit: 'hrs' },
          { label: 'Total Downtime Hours', value: validatedDowntime.toLocaleString(), unit: 'hrs' }
        ]
      };
    }
  },
  {
    id: 'production-yield',
    name: 'Production Yield Calculator',
    slug: 'production-yield',
    category: 'manufacturing',
    description: 'Calculate the physical yield ratio of perfect merchandise compared to raw target volumes.',
    formula: 'Yield Percentage = (Actual Final Output / Expected Target Output) * 100',
    explanation: 'Tracks raw material structural output efficiency. Useful in aerospace stamping, wood milling, or chemical bottling processes.',
    example: 'Expecting 5,000 gallons of chemical compound but yielding 4,820 usable gallons.',
    inputs: [
      { id: 'expectedVolume', label: 'Expected Target Volume (Ideal)', type: 'number', defaultValue: 5000, min: 1 },
      { id: 'actualVolume', label: 'Actual Usable Output Volume', type: 'number', defaultValue: 4850, min: 0 }
    ],
    faq: [
      { question: 'What is first pass yield vs final yield?', answer: 'First pass yield measures units done perfectly on first run without adjustments, while final yield includes recycled, reworked, or salvaged units too.' }
    ],
    relatedSlugs: ['quality-rate', 'waste-percentage', 'defect-rate'],
    seoTitle: 'Production Yield & Output Volume Calculator | Calculatoora',
    seoDescription: 'Audit chemical, mechanical, or raw material volume yields. Compare ideal output weights against actual final numbers.',
    calculate: (inputs) => {
      const ideal = Number(inputs.expectedVolume || 1);
      const actual = Number(inputs.actualVolume || 0);

      const validatedActual = Math.min(ideal, actual);
      const yieldPercent = (validatedActual / ideal) * 100;
      const volumeLoss = ideal - validatedActual;

      return {
        results: [
          { label: 'Final Product Yield', value: `${yieldPercent.toFixed(1)}%`, isPrimary: true },
          { label: 'Undelivered / Lost Volume', value: volumeLoss.toLocaleString(), isPrimary: true },
          { label: 'Conversion Performance Index', value: yieldPercent > 98 ? 'Excellent (Optimal)' : yieldPercent > 90 ? 'Acceptable' : 'Suboptimal (Investigate)' }
        ]
      };
    }
  },

  // ====================================== ARCHITECTURE & DESIGN ======================================
  {
    id: 'room-area',
    name: 'Room Area Calculator',
    slug: 'room-area',
    category: 'architecture-design',
    description: 'Calculate total floor dimensions, perimeter walls, and ceiling square footage of any rectangular interior room.',
    formula: 'Floor Area = Length * Width | Wall Area = 2 * Height * (Length + Width)',
    explanation: 'Helps architects and decorators calculate carpet, hardwood, baseboard, dynamic wallpaper, and paint requirements.',
    example: 'A room 12 ft wide, 15 ft long with 8 ft ceiling heights has 180 sq ft of flooring.',
    inputs: [
      { id: 'length', label: 'Room Length (Feet / Meters)', type: 'number', defaultValue: 15, min: 0.1, step: 0.1 },
      { id: 'width', label: 'Room Width (Feet / Meters)', type: 'number', defaultValue: 12, min: 0.1, step: 0.1 },
      { id: 'height', label: 'Room Height (Feet / Meters)', type: 'number', defaultValue: 8.5, min: 0.1, step: 0.1 }
    ],
    faq: [
      { question: 'Should I do floor calculations in feet or meters?', answer: 'The calculations are mathematically equivalent. Just keep all input units (length, width, height) consistent (all feet or all meters).' }
    ],
    relatedSlugs: ['wall-area', 'material-estimate', 'building-area'],
    seoTitle: 'Room Floor & Wall Surface Area Calculator | Decorating Dimensions',
    seoDescription: 'Accurately map empty rooms. Calculate total flooring, wall surface areas, baseboard perimeter limits, and ceiling dimensions.',
    calculate: (inputs) => {
      const length = Number(inputs.length || 0);
      const width = Number(inputs.width || 0);
      const height = Number(inputs.height || 0);

      const floorArea = length * width;
      const perimeter = 2 * (length + width);
      const wallArea = perimeter * height;

      return {
        results: [
          { label: 'Total Floor Area', value: floorArea.toFixed(1), unit: 'sq units', isPrimary: true },
          { label: 'Total Wall Surface Area', value: wallArea.toFixed(1), unit: 'sq units', isPrimary: true },
          { label: 'Baseboard Wall Perimeter', value: perimeter.toFixed(1), unit: 'units' },
          { label: 'Ceiling Surface Area', value: floorArea.toFixed(1), unit: 'sq units' }
        ]
      };
    }
  },
  {
    id: 'building-area',
    name: 'Building Footprint Area Calculator',
    slug: 'building-area',
    category: 'architecture-design',
    description: 'Calculate the building footprint area, compile buildable plot availability, and model total lot utilization rates.',
    formula: 'Footprint Area = Lot Area * Coverage Ratio % | Gross Floor Area = Footprint Area * Floors Count',
    explanation: 'Provides architectural designers with basic building-mass data. Solves maximum permissible footprint limitations enforced by zoning laws.',
    example: 'A building lot sizing of 10,000 sq ft under 40% lot coverage limitations gives a 4,000 sq ft permissible ground blueprint.',
    inputs: [
      { id: 'lotSize', label: 'Lot Total Surface Dimensions (Sq. Footage/Sq. Meters)', type: 'number', defaultValue: 8000, min: 1 },
      { id: 'maxCoverage', label: 'Permissible Lot Coverage Rate (%)', type: 'number', defaultValue: 45, min: 1, max: 100 },
      { id: 'floorsCount', label: 'Planned Multi-Story Floors Count', type: 'number', defaultValue: 2, min: 1, max: 150 }
    ],
    faq: [
      { question: 'What does Building Footprint mean?', answer: 'It is the ground space bounded by the exterior vertical walls of the building. Cantilevers or balconies might impact this based on municipal definitions.' }
    ],
    relatedSlugs: ['floor-area-calculator', 'design-cost', 'room-area'],
    seoTitle: 'Building Footprint & Gross Floor Area (GFA) Calculator',
    seoDescription: 'Calculate maximum allowable building footprint sizes and estimate total cross-floor gross areas of design drafts.',
    calculate: (inputs) => {
      const lot = Number(inputs.lotSize || 1);
      const limit = Number(inputs.maxCoverage || 100) / 100;
      const floors = Number(inputs.floorsCount || 1);

      const maxFootprint = lot * limit;
      const totalAreaAllFloors = maxFootprint * floors;

      return {
        results: [
          { label: 'Maximum Floor Footprint Permitted', value: Math.round(maxFootprint).toLocaleString(), unit: 'sq units', isPrimary: true },
          { label: 'Total Gross Floor Area (GFA)', value: Math.round(totalAreaAllFloors).toLocaleString(), unit: 'sq units', isPrimary: true },
          { label: 'Percentage Lot Remaining Unbuilt', value: `${(100 - (limit * 100)).toFixed(0)}%` }
        ]
      };
    }
  },
  {
    id: 'floor-area-calculator',
    name: 'Floor Area Ratio (FAR) Calculator',
    slug: 'floor-area-calculator',
    category: 'architecture-design',
    description: 'Find your Floor Area Ratio (FAR) to check zoning standard compliance of architectural drafts.',
    formula: 'Floor Area Ratio (FAR) = Gross Floor Area (GFA) / Total Lot Area',
    explanation: 'FAR controls building density on land parcels. Used heavily by urban planners and developers to maximize buildable volume safety.',
    example: 'Building an overall GFA of 12,000 sq ft on a 10,000 sq ft block results in a FAR index of 1.20.',
    inputs: [
      { id: 'lotArea', label: 'Total Lot Land Area (Sq. Ft / Sq. M)', type: 'number', defaultValue: 6000, min: 1 },
      { id: 'gfa', label: 'Gross Floor Area (All levels summed) (GFA)', type: 'number', defaultValue: 4800, min: 1 }
    ],
    faq: [
      { question: 'Why do municipalities regulate FAR ratios?', answer: 'It manages city density, traffic thresholds, and ensures solar access. Higher FAR ratios (E.g. 5 to 15) are common in CBD core zones, whereas low ratios (0.3 to 0.8) denote suburb zones.' }
    ],
    relatedSlugs: ['building-area', 'stair-calculator', 'design-cost'],
    seoTitle: 'Floor Area Ratio (FAR) Calculator | Municipal Zoning Solver',
    seoDescription: 'Determine the Floor Area Ratio (FAR) of raw blueprint parameters. Check if GFA parameters conform to land zoning densities.',
    calculate: (inputs) => {
      const lot = Number(inputs.lotArea || 1);
      const gfa = Number(inputs.gfa || 1);

      const far = gfa / lot;

      let compliantText = 'Typically compliant with suburban zoning (low-density rules)';
      if (far > 3.0) compliantText = 'High density - requires urban multi-family or commercial zoning';
      else if (far > 1.0) compliantText = 'Medium density structure - requires corresponding administrative waivers';

      return {
        results: [
          { label: 'Zoning Floor Area Ratio (FAR)', value: far.toFixed(2), isPrimary: true },
          { label: 'Lot Coverage Index', value: `${((gfa / lot) * 100).toFixed(0)}%`, isPrimary: true },
          { label: 'Density Assessment', value: compliantText }
        ]
      };
    }
  },
  {
    id: 'stair-calculator',
    name: 'Stair Calculator',
    slug: 'stair-calculator',
    category: 'architecture-design',
    description: 'Calculate step rises, tread lengths, stringer angles, and stair run parameters to fit architectural layouts.',
    formula: 'Riser Count = Vertical Rise / Target Drop Rise (normally 7 inches)',
    explanation: 'Designed to compute accurate rises and treads according to international safety standards. Prevents accidental tripping risks.',
    example: 'A design vertical rise of 105 inches with a target individual tread height of 7 inches solves riser layouts.',
    inputs: [
      { id: 'totalRise', label: 'Total Vertical Rise Height (Inches)', type: 'number', defaultValue: 105, min: 5 },
      { id: 'targetRiser', label: 'Target / Standard Riser Height (Inches)', type: 'number', defaultValue: 7, min: 4, max: 9, step: 0.1 },
      { id: 'treadWidth', label: 'Standard Individual Tread Run (Inches)', type: 'number', defaultValue: 10, min: 8, max: 14 }
    ],
    faq: [
      { question: 'What is the "stair builder law" of step proportion?', answer: 'The classical safety guideline is the "Riser plus Tread rule": (2 * Riser Height) + Tread Run should equal between 24 and 25 inches for maximum skeletal comfort.' }
    ],
    relatedSlugs: ['room-area', 'wall-area', 'material-estimate'],
    seoTitle: 'Architectural Stair Run & Riser Calculator | Construction Tool',
    seoDescription: 'Obtain construction staircase specifications. Find optimal tread quantities, actual riser heights, stringer run lengths, and layout angles.',
    calculate: (inputs) => {
      const totalRise = Number(inputs.totalRise || 1);
      const targetRiser = Number(inputs.targetRiser || 7);
      const tread = Number(inputs.treadWidth || 10);

      const riserCount = Math.round(totalRise / targetRiser);
      const actualRiserHeight = totalRise / riserCount;
      const treadCount = riserCount - 1;
      const totalRunLength = treadCount * tread;

      // Pythagorean stringer calculation
      const stringerLength = Math.sqrt(Math.pow(totalRise, 2) + Math.pow(totalRunLength, 2));
      const angleRad = Math.atan(totalRise / totalRunLength);
      const angleDeg = angleRad * (180 / Math.PI);

      return {
        results: [
          { label: 'Total Risers (Steps Count)', value: riserCount, isPrimary: true },
          { label: 'Calculated Riser Height', value: `${actualRiserHeight.toFixed(2)} in`, isPrimary: true },
          { label: 'Total Run Distance', value: `${totalRunLength.toFixed(1)} in`, unit: `(${treadCount} treads)` },
          { label: 'Staircase Ascent Angle', value: `${angleDeg.toFixed(1)}°` },
          { label: 'Est. Stringer Board Length Required', value: `${stringerLength.toFixed(1)} in` }
        ]
      };
    }
  },
  {
    id: 'roof-area',
    name: 'Roof Area & Material Calculator',
    slug: 'roof-area',
    category: 'architecture-design',
    description: 'Calculate the true pitch surface area of a roof and estimate the shingle shingles counts required for roofing.',
    formula: 'Pitch Multiplier = Sqrt(1 + (Rise/Run)^2) | Roof Area = Flat Footprint Area * Pitch Multiplier',
    explanation: 'Roof pitch slopes change the required square footage compared to flat blueprints. This calculator implements pitch multipliers and provides standard roofing squares.',
    example: 'A building 30x40 ft with a roof pitch slope of 6/12 has a significant area increase.',
    inputs: [
      { id: 'roofLength', label: 'Flat Building Overhang Length (Feet)', type: 'number', defaultValue: 40, min: 1 },
      { id: 'roofWidth', label: 'Flat Building Overhang Width (Feet)', type: 'number', defaultValue: 30, min: 1 },
      { id: 'roofPitch', label: 'Roof Pitch slope (Inches of Rise per 12" Run)', type: 'select', defaultValue: '6', options: [
        { label: 'Flat / No slope (0/12)', value: '0' },
        { label: 'Low Slope (3/12)', value: '3' },
        { label: 'Standard Gable (4/12)', value: '4' },
        { label: 'Medium Slope (6/12)', value: '6' },
        { label: 'Steep Slope (9/12)', value: '9' },
        { label: 'Mansard Slope (12/12)', value: '12' }
      ]},
      { id: 'wasteBuffer', label: 'Waste Coverage Buffer Allowance (%)', type: 'number', defaultValue: 10, min: 0, max: 50 }
    ],
    faq: [
      { question: 'What is a "roofing square"?', answer: 'A "square" is a standard commercial unit of roofing material, defined as exactly 100 square feet of shingles or tin layout panel area.' }
    ],
    relatedSlugs: ['room-area', 'wall-area', 'material-estimate'],
    seoTitle: 'Roof Pitched Surface Area & Shingle Bundle Calculator',
    seoDescription: 'Find pitched roof areas based on building footprints and rise ratios. Projects the necessary roofing shingles squares to buy.',
    calculate: (inputs) => {
      const length = Number(inputs.roofLength || 1);
      const width = Number(inputs.roofWidth || 1);
      const pitchValue = Number(inputs.roofPitch || 0);
      const waste = Number(inputs.wasteBuffer || 10) / 100;

      const baseFlatArea = length * width;
      const multiplier = Math.sqrt(1 + Math.pow(pitchValue / 12, 2));
      const pitchArea = baseFlatArea * multiplier;
      const totalAreaWithWaste = pitchArea * (1 + waste);
      const roofingSquares = totalAreaWithWaste / 100;
      const bundles = roofingSquares * 3; // 3 bundles per square typically

      return {
        results: [
          { label: 'Calculated Roof Surface Area', value: pitchArea.toFixed(1), unit: 'sq ft', isPrimary: true },
          { label: 'Total Roofing Squares Required', value: roofingSquares.toFixed(2), unit: 'squares', isPrimary: true },
          { label: 'Bundles of Shingles to Buy', value: Math.ceil(bundles), unit: 'bundles' },
          { label: 'Flat Base Ground Area', value: baseFlatArea.toFixed(1), unit: 'sq ft' }
        ]
      };
    }
  },
  {
    id: 'wall-area',
    name: 'Wall Area & Paint Calculator',
    slug: 'wall-area',
    category: 'architecture-design',
    description: 'Calculate net paintable wall surface areas by inputting room boundaries and subtracting door and window openings.',
    formula: 'Net Wall Area = Wall Area - (Doors Count * Door Size) - (Windows Count * Window Size)',
    explanation: 'Simplifies wallpaper, dry-wall, paint, and framing cost calculations. Applies standard sizing defaults for architectural windows and doors.',
    example: 'A master room with 4 perimeter walls, subtracting 2 standard glass windows and 1 entry door.',
    inputs: [
      { id: 'roomPerimeter', label: 'Sum of All Wall Lengths (Total Perimeter) (Ft/M)', type: 'number', defaultValue: 50, min: 1 },
      { id: 'wallHeight', label: 'Ceiling Wall Height (Feet/Meters)', type: 'number', defaultValue: 9, min: 1 },
      { id: 'doorsCount', label: 'Number of Typical Interior Doors', type: 'number', defaultValue: 2, min: 0 },
      { id: 'windowsCount', label: 'Number of Typical Glass Windows', type: 'number', defaultValue: 3, min: 0 }
    ],
    faq: [
      { question: 'What is the default size of standard doors and windows?', answer: 'This calculator assumes 21 square feet per typical interior door (3ft x 7ft) and 15 square feet per standard residential window (3ft x 5ft) for deductions.' }
    ],
    relatedSlugs: ['room-area', 'material-estimate', 'roof-area'],
    seoTitle: 'Wall Surface Area Paint Coverage Calculator | Building Estimates',
    seoDescription: 'Accurately subtract windows and doors to calculate net design wall spaces. Generates standard gallons of paint requirements.',
    calculate: (inputs) => {
      const perimeter = Number(inputs.roomPerimeter || 0);
      const height = Number(inputs.wallHeight || 0);
      const doors = Number(inputs.doorsCount || 0);
      const windows = Number(inputs.windowsCount || 0);

      const grossArea = perimeter * height;
      const doorDeduction = doors * 21; // 21 square feet
      const windowDeduction = windows * 15; // 15 square feet
      const netPaintableWallArea = Math.max(0, grossArea - doorDeduction - windowDeduction);

      const estGallonsOfPaint = netPaintableWallArea / 350; // 350 sq ft per gallon reference

      return {
        results: [
          { label: 'Net Paintable Surface Area', value: netPaintableWallArea.toFixed(1), unit: 'sq units', isPrimary: true },
          { label: 'Est. Gallons of Paint Required', value: estGallonsOfPaint.toFixed(1), unit: 'gallons', isPrimary: true },
          { label: 'Gross Wall Area (No Deductions)', value: grossArea.toFixed(1), unit: 'sq units' },
          { label: 'Total Openings Deduced', value: (doorDeduction + windowDeduction).toFixed(1), unit: 'sq units' }
        ]
      };
    }
  },
  {
    id: 'material-estimate',
    name: 'Material Wall Tile Estimate Calculator',
    slug: 'material-estimate',
    category: 'architecture-design',
    description: 'Calculate tile bulk counts for walls, siding panels, or flooring layouts with waste compensation adjustments.',
    formula: 'Required Tiles = (Target Area / Individual Tile Surface Area) * (1 + Waste Rate)',
    explanation: 'Solves commercial floor tile quantities. Select standard size presets (e.g., 12"x12", 24"x24", etc.) to verify exact order budgets.',
    example: 'Tiling an 8ft x 15ft modern bathroom floor using standard 12in tiles and a 10% cutting offset.',
    inputs: [
      { id: 'coverageArea', label: 'Total Surface Area to Cover (Sq. Ft)', type: 'number', defaultValue: 120, min: 1 },
      { id: 'tileSizePreset', label: 'Tile Dimensions Size Selection', type: 'select', defaultValue: '12x12', options: [
        { label: 'Large Format (24" x 24")', value: '576' },
        { label: 'Medium Square (12" x 12")', value: '144' },
        { label: 'Subway Tile (3" x 6")', value: '18' },
        { label: 'Hexagon Accent (6" x 6")', value: '36' }
      ]},
      { id: 'wastePercent', label: 'Waste Planning Buffer (%)', type: 'number', defaultValue: 10, min: 0, max: 50 }
    ],
    faq: [
      { question: 'Why is a 10% waste buffer always recommended?', answer: 'Placing tiles at the perimeter borders or molding edges requires custom cuts, resulting in offcuts that often cannot be reused elsewhere.' }
    ],
    relatedSlugs: ['room-area', 'wall-area', 'design-cost'],
    seoTitle: 'Tile Bulk Order Estimate Calculator | Area Surface Solver',
    seoDescription: 'Calculate standard commercial tile layout counts, helping builders purchase appropriate packaging quantities based on waste margins.',
    calculate: (inputs) => {
      const area = Number(inputs.coverageArea || 1);
      const tileSqIn = Number(inputs.tileSizePreset || '144');
      const waste = Number(inputs.wastePercent || 0) / 100;

      const tileSqFt = tileSqIn / 144;
      const baseTilesCount = area / tileSqFt;
      const aggregateTilesCount = baseTilesCount * (1 + waste);

      return {
        results: [
          { label: 'Total Tiles to Order', value: Math.ceil(aggregateTilesCount), unit: 'tiles', isPrimary: true },
          { label: 'Base Tiles Required (Net)', value: Math.ceil(baseTilesCount), unit: 'tiles' },
          { label: 'Waste Backup Tile Count', value: Math.ceil(aggregateTilesCount - baseTilesCount), unit: 'tiles' },
          { label: 'Cost Reference (at $4/tile)', value: (Math.ceil(aggregateTilesCount) * 4).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'design-cost',
    name: 'Architectural Design Cost Calculator',
    slug: 'design-cost',
    category: 'architecture-design',
    description: 'Calculate structural design fees and estimate professional architectural draft costs based on project budgets.',
    formula: 'Total Fee = Project Construction Cost * Architectural Fee % + Revision Expenses',
    explanation: 'Models layout designing cost structures. Lets building developers plan appropriate design budgets using fixed or percentage pricing schemes.',
    example: 'A building with $350K budgeted construction costs, hiring an architect at a standard 8% commission structure.',
    inputs: [
      { id: 'constructionBudget', label: 'Project Est. Construction Budget ($)', type: 'number', defaultValue: 250000, min: 1000 },
      { id: 'feeType', label: 'Architect Fee Charging Structure', type: 'select', defaultValue: 'percentage', options: [
        { label: 'Percentage of Overall Build (6%-12%)', value: 'percentage' },
        { label: 'Flat Firm Rate Structure', value: 'flat' }
      ]},
      { id: 'feeRateValue', label: 'Architect Rate (Fee Percentage % OR Flat Cash $)', type: 'number', defaultValue: 8.5, min: 0.1 },
      { id: 'revisions', label: 'Excess Layout Revision Rounds', type: 'number', defaultValue: 2, min: 0 }
    ],
    faq: [
      { question: 'What is the standard percent rate of architectural design fees?', answer: 'Residential architectural fees range between 8% and 15% of the total cost of construction. Commercial developments scale lower, averaging 5% to 10%.' }
    ],
    relatedSlugs: ['building-area', 'floor-area-calculator', 'room-area'],
    seoTitle: 'Architectural Fee & Engineering Design Cost Calculator',
    seoDescription: 'Determine professional design fees using standard percentage parameters or flat contract estimates. Outlines revision expenses.',
    calculate: (inputs) => {
      const budget = Number(inputs.constructionBudget || 0);
      const isPercentage = inputs.feeType === 'percentage';
      const rate = Number(inputs.feeRateValue || 0);
      const revisionsCount = Number(inputs.revisions || 0);

      const baseFee = isPercentage ? (budget * (rate / 100)) : rate;
      const revisionOverhead = revisionsCount * 750; // flat estimate of $750 per detailed revision
      const totalCost = baseFee + revisionOverhead;

      return {
        results: [
          { label: 'Total Design & Architectural Cost', value: totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Base Architectural Fee', value: baseFee.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Revision Hourly/Markup Cost', value: revisionOverhead.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Design Cost ratio relative to Construction', value: `${((totalCost / budget) * 100).toFixed(1)}%` }
        ]
      };
    }
  }
];
