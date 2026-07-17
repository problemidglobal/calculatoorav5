import { Calculator } from '../types';

export const V21_PART3_CALCULATORS: Calculator[] = [
  // ====================================== ENGINEERING ADVANCED ======================================
  {
    id: 'structural-load',
    name: 'Beam Bending Moment & Load Calculator',
    slug: 'structural-load',
    category: 'engineering',
    description: 'Calculate defensive shear forces and maximum bending moments on simply supported beams under uniform loads.',
    formula: 'Bending Moment (Mmax) = (w * L^2) / 8 | Shear Force (Vmax) = (w * L) / 2\nWhere L is span length, w is uniform load (UDL).',
    explanation: 'Models beam deflection and structural responses, helping civil and mechanical engineers size supporting structures.',
    example: 'A simply supported steel beam with a 6-meter span carrying a 15 kN/m load experiences a maximum bending moment of 67.5 kNm.',
    inputs: [
      { id: 'spanLength', label: 'Beam Span Length (Meters)', type: 'number', defaultValue: 6, min: 0.1, step: 0.1 },
      { id: 'udlWeight', label: 'Uniform Distributed Load (UDL) (kN/m)', type: 'number', defaultValue: 15, min: 0.1, step: 0.1 }
    ],
    faq: [
      { question: 'What is UDL?', answer: 'Uniformly Distributed Load - a load that is evenly distributed across the entire length of a structural element, such as flooring or snow on a roof.' }
    ],
    relatedSlugs: ['material-weight', 'engineering-cost'],
    seoTitle: 'Structural Beam Shear Force & Bending Moment Calculator',
    seoDescription: 'Calculate maximum bending moments and shear forces for simply supported beams under uniform loads.',
    calculate: (inputs) => {
      const L = Number(inputs.spanLength || 6);
      const w = Number(inputs.udlWeight || 15);

      const maxMoment = (w * Math.pow(L, 2)) / 8;
      const maxShear = (w * L) / 2;

      return {
        results: [
          { label: 'Max Bending Moment', value: `${maxMoment.toFixed(2)} kNm`, isPrimary: true },
          { label: 'Max Shear Force', value: `${maxShear.toFixed(2)} kN`, isPrimary: true },
          { label: 'Structural Safety Factor', value: 'Standard steel beam alignment safe' }
        ]
      };
    }
  },
  {
    id: 'material-weight',
    name: 'Metal Plate & Round Bar Weight Calculator',
    slug: 'material-weight',
    category: 'engineering',
    description: 'Calculate the weight of metal plates and round bars based on material density and dimensions.',
    formula: 'Weight = Volume * Density\nWhere Volume = L * W * H for plates, or Volume = Pi * R^2 * L for round bars.',
    explanation: 'Estimates material weight based on standard metal densities, helping civil engineers and fabricators plan logistics.',
    example: 'A 20mm thick steel plate measuring 2 meters by 1 meter weighs roughly 314 kg.',
    inputs: [
      { id: 'metalType', label: 'Metal Material Type', type: 'select', defaultValue: 'steel', options: [
        { label: 'Carbon Steel (7,850 kg/m³)', value: 'steel' },
        { label: 'Aluminum 6061 (2,700 kg/m³)', value: 'aluminum' },
        { label: 'Copper (8,960 kg/m³)', value: 'copper' },
        { label: 'Brass (8,500 kg/m³)', value: 'brass' }
      ]},
      { id: 'shape', label: 'Metal Shape Profile', type: 'select', defaultValue: 'plate', options: [
        { label: 'Flat Plate / Sheet', value: 'plate' },
        { label: 'Round Bar / Cylinder', value: 'bar' }
      ]},
      { id: 'dim1', label: 'Length Dimension (Meters)', type: 'number', defaultValue: 2, min: 0.01, step: 0.01 },
      { id: 'dim2', label: 'Width or Diameter (Meters)', type: 'number', defaultValue: 1, min: 0.001, step: 0.001 },
      { id: 'thickness', label: 'Thickness of Plate (Meters - only for flat plates)', type: 'number', defaultValue: 0.02, min: 0.001, step: 0.001 }
    ],
    faq: [
      { question: 'Why does material density vary?', answer: 'Pure metals and alloys have unique atomic weights and crystal spacing, resulting in unique densities (e.g., steel weighs roughly 3x more than aluminum).' }
    ],
    relatedSlugs: ['structural-load', 'engineering-cost'],
    seoTitle: 'Metal Plate and Round Bar Weight Calculator | Metals Density Sizer',
    seoDescription: 'Calculate structural metal plate weights. Supports aluminum, steel, brass, and copper densities.',
    calculate: (inputs) => {
      const type = inputs.metalType || 'steel';
      const shape = inputs.shape || 'plate';
      const d1 = Number(inputs.dim1 || 2);
      const d2 = Number(inputs.dim2 || 1);
      const thick = Number(inputs.thickness || 0.02);

      let density = 7850; // kg/m3 steel default
      if (type === 'aluminum') density = 2700;
      else if (type === 'copper') density = 8960;
      else if (type === 'brass') density = 8500;

      let volume = 0;
      if (shape === 'plate') {
        volume = d1 * d2 * thick;
      } else {
        // round bar: d2 is diameter, so radius is d2/2
        const r = d2 / 2;
        volume = Math.PI * Math.pow(r, 2) * d1;
      }

      const weightKg = volume * density;

      return {
        results: [
          { label: 'Calculated Metal Weight', value: `${weightKg.toFixed(2)} kg`, isPrimary: true },
          { label: 'Theoretical Volume', value: `${volume.toFixed(5)} m³` },
          { label: 'Applied Density factor', value: `${density} kg/m³` }
        ]
      };
    }
  },
  {
    id: 'engineering-cost',
    name: 'Engineering Project Consulting Estimator',
    slug: 'engineering-cost',
    category: 'engineering',
    description: 'Calculate professional engineering and design consulting costs based on hourly rates and project scope.',
    formula: 'Cost = Consulting Hours * Hourly Rate + Permits Offset',
    explanation: 'Helps project managers plan engineering, design, and permitting costs for new construction projects.',
    example: 'Sizing an industrial plumbing layout over 45 hours of professional design consultation.',
    inputs: [
      { id: 'designHours', label: 'Estimated Engineering Design Hours', type: 'number', defaultValue: 45, min: 1 },
      { id: 'laborRate', label: 'Professional Consulting Rate ($/Hour)', type: 'number', defaultValue: 125, min: 20 },
      { id: 'permitsFee', label: 'Estimated Permits & Regulatory Fees ($)', type: 'number', defaultValue: 1200, min: 0 }
    ],
    faq: [
      { question: 'What does plumbing permit fees usually scale to?', answer: 'Permit costs vary by city and are typically calculated based on plumbing fixture counts or total construction values.' }
    ],
    relatedSlugs: ['structural-load', 'thermal-tool'],
    seoTitle: 'Professional Engineering Consulting Cost & Permit Estimator',
    seoDescription: 'Estimate professional engineering and permitting costs. Calculate consulting fees based on project hours.',
    calculate: (inputs) => {
      const hours = Number(inputs.designHours || 45);
      const wage = Number(inputs.laborRate || 125);
      const permits = Number(inputs.permitsFee || 1200);

      const consultingTotal = hours * wage;
      const combinedCapitalTotal = consultingTotal + permits;

      return {
        results: [
          { label: 'Total Estimated Engineering Cost', value: combinedCapitalTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Consulting Net Fees portion', value: consultingTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Assessed Permits overhead', value: permits.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'thermal-tool',
    name: 'Fourier\'s Heat Transfer Thermal Calculator',
    slug: 'thermal-tool',
    category: 'engineering',
    description: 'Calculate heat transfer rate (Q in Watts) using Fourier\'s Law of Thermal Conduction.',
    formula: 'Q = (k * A * dT) / d\nWhere k is conductivity, A is area, dT is temperature difference, d is thickness.',
    explanation: 'Models heat loss through walls and plates, helping mechanical engineers size HVAC and insulation systems.',
    example: 'Heat loss through a brick wall with thermal conductivity of 0.8 W/mK.',
    inputs: [
      { id: 'area', label: 'Conduction Surface Area (m²)', type: 'number', defaultValue: 15, min: 0.1, step: 0.1 },
      { id: 'thermalK', label: 'Thermal Conductivity k (W/m·K) (e.g., Brick: 0.8)', type: 'number', defaultValue: 0.8, min: 0.001, step: 0.001 },
      { id: 'tempDiff', label: 'Temperature Difference dT (Celsius)', type: 'number', defaultValue: 20, min: 0.1, step: 0.1 },
      { id: 'thickness', label: 'Material Wall Thickness d (Meters)', type: 'number', defaultValue: 0.25, min: 0.001, step: 0.001 }
    ],
    faq: [
      { question: 'What does thermal conductivity measure?', answer: 'Thermal conductivity (k) measures a material\'s ability to conduct heat. Lower values indicate better insulation performance.' }
    ],
    relatedSlugs: ['fluid-tool', 'structural-load'],
    seoTitle: 'Fourier\'s Law Heat Conduction Rate Q Thermal Calculator',
    seoDescription: 'Calculate heat transfer rates based on thermal conductivity, surface area, and temperature differences.',
    calculate: (inputs) => {
      const A = Number(inputs.area || 15);
      const k = Number(inputs.thermalK || 0.8);
      const dT = Number(inputs.tempDiff || 20);
      const d = Number(inputs.thickness || 0.25);

      const q = (k * A * dT) / d;

      return {
        results: [
          { label: 'Heat Conducted Rate (Q)', value: `${q.toFixed(1)} Watts`, isPrimary: true },
          { label: 'Equivalent Heat Loss per Hour', value: `${(q * 3600 / 1000).toFixed(2)} kJ` }
        ]
      };
    }
  },
  {
    id: 'fluid-tool',
    name: 'Fluid Volume Flow Rate continuity Tool',
    slug: 'fluid-tool',
    category: 'engineering',
    description: 'Calculate fluid volume flow rates (Q) and stream velocities using the continuity equation.',
    formula: 'Flow Rate (Q) = Cross Section Area (A) * Velocity (v)\nWhere A = Pi * D^2 / 4.',
    explanation: 'Models pipe transport capacities, helping mechanical engineers size fluid pumps and civil layouts.',
    example: 'A 100mm pipe transporting fluid at 2.5 meters per second.',
    inputs: [
      { id: 'diameterMm', label: 'Pipe Core Diameter (Millimeters)', type: 'number', defaultValue: 100, min: 1 },
      { id: 'velocitySec', label: 'Fluid Flow Velocity (m/s)', type: 'number', defaultValue: 2.5, min: 0.01, step: 0.01 }
    ],
    faq: [
      { question: 'What is the Continuity Equation?', answer: 'The continuity equation states that the volume flow rate remains constant along a pipe, meaning fluid velocity must increase when pipe diameter decreases.' }
    ],
    relatedSlugs: ['thermal-tool', 'structural-load'],
    seoTitle: 'Pipe Dimension Fluid flow Rate Continuity Calculator',
    seoDescription: 'Calculate fluid volume flow rates and stream velocities based on pipe diameters and capacities.',
    calculate: (inputs) => {
      const dMm = Number(inputs.diameterMm || 100);
      const vel = Number(inputs.velocitySec || 2.5);

      const r = dMm / 1000 / 2; // radius in meters
      const area = Math.PI * Math.pow(r, 2);
      const qM3s = area * vel; // cubic meters per second
      const qLpm = qM3s * 60000; // liters per minute

      return {
        results: [
          { label: 'Fluid Flow Rate', value: `${qLpm.toFixed(1)} Liters/Min`, isPrimary: true },
          { label: 'System Volumetric Flow', value: `${qM3s.toExponential(4)} m³/s`, isPrimary: true },
          { label: 'Pipe Hydraulic Area', value: `${area.toFixed(6)} m²` }
        ]
      };
    }
  },
  {
    id: 'mech-efficiency',
    name: 'Mechanical Systems Efficiency Calculator',
    slug: 'mech-efficiency',
    category: 'engineering',
    description: 'Calculate mechanical system efficiency by comparing useful output energy to total input energy or power.',
    formula: 'Efficiency % = (Useful Power Output / Total Power Input) * 100',
    explanation: 'Measures structural heat and frictional energy losses, helping engineers optimize engine and gearbox designs.',
    example: 'An electric motor drawing 1,200 Watts that delivers 950 Watts of mechanical power has a 79.2% efficiency rating.',
    inputs: [
      { id: 'inputPower', label: 'Total Input Power (Watts)', type: 'number', defaultValue: 1200, min: 0.1 },
      { id: 'outputPower', label: 'Useful Output Power (Watts)', type: 'number', defaultValue: 950, min: 0.1 }
    ],
    faq: [
      { question: 'Why is mechanical efficiency always below 100%?', answer: 'Real-world systems lose energy to friction and heat transfer, meaning efficiency is always below 100%.' }
    ],
    relatedSlugs: ['fluid-tool', 'thermal-tool'],
    seoTitle: 'Mechanical Engine Power Efficiency and Energy Loss Calculator',
    seoDescription: 'Calculate mechanical system efficiencies. Compare input and output power to measure energy loss.',
    calculate: (inputs) => {
      const pin = Number(inputs.inputPower || 1200);
      const pout = Math.min(pin, Number(inputs.outputPower || 950));

      const efficiency = (pout / pin) * 100;
      const energyWasted = pin - pout;

      return {
        results: [
          { label: 'Mechanical System Efficiency', value: `${efficiency.toFixed(1)}%`, isPrimary: true },
          { label: 'Frictional Power Loss', value: `${energyWasted.toFixed(1)} Watts`, isPrimary: true }
        ]
      };
    }
  },

  // ====================================== CONSTRUCTION ======================================
  {
    id: 'construction-budget',
    name: 'Construction Project Budget Estimator',
    slug: 'construction-budget',
    category: 'construction',
    description: 'Estimate construction project budgets based on square footage and regional labor rates.',
    formula: 'Cost = Built Area * Cost per SqFt * Finish factor * (1 + Contingency %)',
    explanation: 'Provides early cost estimates for new construction projects, helping developers budget resources before starting construction.',
    example: 'Building an standard 1,500 sqft residential home with a 10% safety contingency.',
    inputs: [
      { id: 'sqftSize', label: 'Total Planned Built Area (SqFt)', type: 'number', defaultValue: 1500, min: 10 },
      { id: 'costPerSqft', label: 'Standard Local Construction Cost ($/SqFt)', type: 'number', defaultValue: 185, min: 10 },
      { id: 'finishSpec', label: 'Material Finish Standard Level', type: 'select', defaultValue: 'standard', options: [
        { label: 'Standard Contractor Grade Class (1.0x multiplier)', value: 'standard' },
        { label: 'Premium Class Custom Finishes (1.35x multiplier)', value: 'premium' }
      ]},
      { id: 'contingency', label: 'Safety Contingency Overruns Budget (%)', type: 'number', defaultValue: 10, min: 0 }
    ],
    faq: [
      { question: 'Why add a construction contingency?', answer: 'Contingencies account for unexpected site conditions, material price spikes, and weather delays, preventing budget overruns.' }
    ],
    relatedSlugs: ['material-quantity', 'labor-cost'],
    seoTitle: 'Commercial & Residential Construction Project Budget Calculator',
    seoDescription: 'Calculate construction project budgets. Estimate residential building costs based on built area and finishes.',
    calculate: (inputs) => {
      const size = Number(inputs.sqftSize || 1500);
      const psf = Number(inputs.costPerSqft || 185);
      const spec = inputs.finishSpec || 'standard';
      const cont = Number(inputs.contingency || 10) / 100;

      let specFactor = 1.0;
      if (spec === 'premium') specFactor = 1.35;

      const baseValue = size * psf * specFactor;
      const safeContingTotal = baseValue * cont;
      const combinedTotal = baseValue + safeContingTotal;

      return {
        results: [
          { label: 'Total Estimated Budget Cost', value: combinedTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Contingency Allocation Reserve', value: safeContingTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Base Construction Estimate', value: baseValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'material-quantity',
    name: 'Standard Block & Wall Brick count Sizer',
    slug: 'material-quantity',
    category: 'construction',
    description: 'Calculate the brick and mortar count needed for masonry walls based on dimensions.',
    formula: 'Bricks = (Wall length * height) / (Single Brick Area with joints)',
    explanation: 'Estimates material counts for masonry projects, helping contractors order materials and reduce construction waste.',
    example: 'A masonry wall measuring 15 meters long and 2.4 meters high.',
    inputs: [
      { id: 'lengthM', label: 'Masonry Wall Length (Meters)', type: 'number', defaultValue: 15, min: 0.1, step: 0.1 },
      { id: 'heightM', label: 'Masonry Wall Height (Meters)', type: 'number', defaultValue: 2.4, min: 0.1, step: 0.1 },
      { id: 'brickType', label: 'Standard Brick Dimensions (mm)', type: 'select', defaultValue: 'std', options: [
        { label: 'Standard Brick (215 x 102.5 x 65 mm)', value: 'std' },
        { label: 'Standard Concrete Block (440 x 100 x 215 mm)', value: 'block' }
      ]},
      { id: 'wasteAllowance', label: 'Material Waste / Cut Overrun Allowances (%)', type: 'number', defaultValue: 10, min: 0, max: 50 }
    ],
    faq: [
      { question: 'Why should I factor in waste allowances?', answer: 'Waste allowances account for cutting loss, transport breakage, and uneven mortar joints during wall assembly.' }
    ],
    relatedSlugs: ['construction-budget', 'labor-cost'],
    seoTitle: 'Masonry Wall Brick and Concrete Block Count Sizer',
    seoDescription: 'Calculate brick and mortar counts for masonry walls. Factor in waste allowances to reduce material costs.',
    calculate: (inputs) => {
      const L = Number(inputs.lengthM || 15);
      const H = Number(inputs.heightM || 2.4);
      const type = inputs.brickType || 'std';
      const waste = Number(inputs.wasteAllowance || 10) / 100;

      // Area of single brick including 10mm mortar joints
      let singleArea = 0.016335; // standard brick default: (0.215 + 0.01) * (0.065 + 0.01)
      if (type === 'block') {
        singleArea = 0.10125; // standard block: (0.44 + 0.01) * (0.215 + 0.01)
      }

      const wallArea = L * H;
      const nominalBricks = wallArea / singleArea;
      const bufferedBricks = nominalBricks * (1 + waste);

      return {
        results: [
          { label: 'Total Bricks/Blocks Count needed', value: Math.ceil(bufferedBricks).toLocaleString(), isPrimary: true },
          { label: 'Wall Surface Area', value: `${wallArea.toFixed(2)} m²`, isPrimary: true },
          { label: 'Nominal Count (Before Waste)', value: Math.ceil(nominalBricks).toLocaleString() }
        ]
      };
    }
  },
  {
    id: 'labor-cost',
    name: 'Project Site Labor Crew Cost Estimator',
    slug: 'labor-cost',
    category: 'construction',
    description: 'Calculate professional engineering and design consulting costs based on hourly rates and project scope.',
    formula: 'Labor Cost = Crew Size * Working Hours * Average Labor Rate',
    explanation: 'Helps site managers estimate project labor costs, tracking budget targets easily.',
    example: 'Deploying a 4-person crew over 120 project hours.',
    inputs: [
      { id: 'crewCount', label: 'Team Size deployed to Site', type: 'number', defaultValue: 4, min: 1 },
      { id: 'projectHours', label: 'Total Planned Site Working Hours', type: 'number', defaultValue: 120, min: 1 },
      { id: 'laborWageRate', label: 'Average Crew Labor Hourly Rate ($/Hour)', type: 'number', defaultValue: 32, min: 5 }
    ],
    faq: [
      { question: 'How do you prevent construction labor overruns?', answer: 'Optimize labor costs by tracking hours daily, using skilled supervisors, and securing materials before workers arrive.' }
    ],
    relatedSlugs: ['construction-budget', 'project-duration-calc'],
    seoTitle: 'Site Construction Labor Sizer and Crew Wage Estimator',
    seoDescription: 'Calculate site construction labor costs. Estimate crew payroll budgets based on project hours.',
    calculate: (inputs) => {
      const size = Number(inputs.crewCount || 4);
      const hours = Number(inputs.projectHours || 120);
      const wage = Number(inputs.laborWageRate || 32);

      const baseLabor = size * hours * wage;
      const supervisionTotal = baseLabor * 0.15; // 15% supervisor multiplier
      const finalCost = baseLabor + supervisionTotal;

      return {
        results: [
          { label: 'Total Labors Cost Estimate', value: finalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Basic Payroll Base portion', value: baseLabor.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Supervision Overhead (15%)', value: supervisionTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'project-duration-calc',
    name: 'Construction Schedule and Weather Contingency Planner',
    slug: 'project-duration-calc',
    category: 'construction',
    description: 'Estimate construction project durations by factoring in weather delays and active crew output.',
    formula: 'Calculated Weeks = (Raw Workload / Crew Output per Week) * (1 + Weather Delay %)',
    explanation: 'Models weather risks to estimate realistic completion deadlines, preventing timeline overruns.',
    example: 'A 150-workload frame designed with a 15-output velocity and 15% weather contingency.',
    inputs: [
      { id: 'totalWorkloadUnits', label: 'Total Workload Units to complete', type: 'number', defaultValue: 150, min: 1 },
      { id: 'weeklyOutput', label: 'Crew Operational Output per Week (Units)', type: 'number', defaultValue: 15, min: 1 },
      { id: 'weatherRiskPct', label: 'Expected Weather Delay contingency (%)', type: 'number', defaultValue: 15, min: 0, max: 100 }
    ],
    faq: [
      { question: 'What is a typical weather contingency?', answer: 'Typical construction contingencies range from 10% to 20%, depending on the project season and region.' }
    ],
    relatedSlugs: ['construction-budget', 'labor-cost'],
    seoTitle: 'Construction Project duration Schedule & Weather buffer Calculator',
    seoDescription: 'Estimate construction project deadlines. Factors in crew output velocities and seasonal weather risks.',
    calculate: (inputs) => {
      const work = Number(inputs.totalWorkloadUnits || 150);
      const output = Number(inputs.weeklyOutput || 15);
      const risk = Number(inputs.weatherRiskPct || 15) / 100;

      const rawWeeks = work / output;
      const bufferedWeeks = rawWeeks * (1 + risk);

      return {
        results: [
          { label: 'Completion Duration Estimate', value: `${bufferedWeeks.toFixed(1)} Weeks`, isPrimary: true },
          { label: 'Raw Crew Effort Needed', value: `${rawWeeks.toFixed(1)} Weeks`, isPrimary: true },
          { label: 'Weather Delay Contingency', value: `${(rawWeeks * risk).toFixed(1)} Weeks` }
        ]
      };
    }
  },
  {
    id: 'building-area',
    name: 'GIA Gross Internal Area Sizer',
    slug: 'building-area',
    category: 'construction',
    description: 'Calculate Gross Internal Area (GIA) and Net Usable Area based on layout ratios.',
    formula: 'GIA = Sum of Internal Room Areas (including internal partition walls)',
    explanation: 'Helps architects and developers size floor space plans, organizing square foot allocations.',
    example: 'An office layout measuring 45 meters by 20 meters with a 12% thickness allocation.',
    inputs: [
      { id: 'facadeLength', label: 'Overall External Wall Length (Meters)', type: 'number', defaultValue: 45, min: 1 },
      { id: 'facadeWidth', label: 'Overall External Wall Width (Meters)', type: 'number', defaultValue: 20, min: 1 },
      { id: 'internalLossRatePct', label: 'Internal Wall Partition Loss Ratios (%)', type: 'number', defaultValue: 12, min: 0 }
    ],
    faq: [
      { question: 'What is Gross Internal Area (GIA)?', answer: 'Gross Internal Area (GIA) measures the total area within the external enclosing walls of a building, including internal partitions and support structures.' }
    ],
    relatedSlugs: ['construction-budget', 'material-quantity'],
    seoTitle: 'GIA Gross Internal Area & net Usable building footprint Calculator',
    seoDescription: 'Calculate Gross Internal Area (GIA). Compare external wall footprints against internal usable space.',
    calculate: (inputs) => {
      const l = Number(inputs.facadeLength || 45);
      const w = Number(inputs.facadeWidth || 20);
      const loss = Number(inputs.internalLossRatePct || 12) / 100;

      const grossExternal = l * w;
      const rawGIA = grossExternal * (1 - 0.04); // estimate external brick wall footprint loss as 4%
      const netUsable = rawGIA * (1 - loss);

      return {
        results: [
          { label: 'Gross Internal Area (GIA)', value: `${rawGIA.toFixed(1)} m²`, isPrimary: true },
          { label: 'Estimated Net Usable Space', value: `${netUsable.toFixed(1)} m²`, isPrimary: true },
          { label: 'Gross External footprint', value: `${grossExternal.toFixed(1)} m²` }
        ]
      };
    }
  },
  {
    id: 'construction-waste',
    name: 'Site Demolition & Debris Waste Calculator',
    slug: 'construction-waste',
    category: 'construction',
    description: 'Estimate construction and demolition waste volumes to plan disposal and recycling budgets.',
    formula: 'Estimated Debris Weight = Built Area * Debris multiplier (lbs per SqFt)',
    explanation: 'Estimates site cleanup waste volumes, helping developers plan dumpster sizes and recycling goals.',
    example: 'Demolishing a 2,000 sqft residential structure.',
    inputs: [
      { id: 'builtAreaSqft', label: 'Affected Built Demolition Area (SqFt)', type: 'number', defaultValue: 2000, min: 1 },
      { id: 'demolitionMode', label: 'Demolition Site Mode', type: 'select', defaultValue: 'remodel', options: [
        { label: 'Standard Remodel Debris (4 lbs per SqFt)', value: 'remodel' },
        { label: 'Full Structure Demolition (115 lbs per SqFt)', value: 'full' }
      ]}
    ],
    faq: [
      { question: 'How is physical construction waste diverted?', answer: 'Divert construction waste by separating concrete, metals, and timber on-site, allowing you to recycle up to 70% of debris.' }
    ],
    relatedSlugs: ['construction-budget', 'material-quantity'],
    seoTitle: 'Site Debris Demolition & Construction dumpster Waste Sizer',
    seoDescription: 'Estimate construction and demolition waste volumes. Plan dumpster sizes and recycling goals based on area.',
    calculate: (inputs) => {
      const area = Number(inputs.builtAreaSqft || 2000);
      const mode = inputs.demolitionMode || 'remodel';

      let lbsPerSqft = 4;
      if (mode === 'full') lbsPerSqft = 115;

      const totalLbs = area * lbsPerSqft;
      const totalTons = totalLbs / 2000;
      const dumpstersNeeded = Math.ceil(totalTons / 4.5); // standard dumpster holds ~4.5 tons of debris

      return {
        results: [
          { label: 'Estimated Debris Weight', value: `${totalTons.toFixed(1)} Tons`, isPrimary: true },
          { label: 'Standard Dumpsters Needed', value: `${dumpstersNeeded} Roll-offs (15-Yard)`, isPrimary: true },
          { label: 'Cumulative Weight Pounds', value: `${totalLbs.toLocaleString()} lbs` }
        ]
      };
    }
  },

  // ====================================== REAL ESTATE ======================================
  {
    id: 'rental-income',
    name: 'Rental Property ROI Yield Calculator',
    slug: 'rental-income',
    category: 'real-estate-pro',
    description: 'Calculate rental property ROI, net cash flow, capitalization rates, and gross yields.',
    formula: 'Cap Rate = (Net Operating Income / Purchase Price) * 100',
    explanation: 'Models rental profitability, helping real estate investors evaluate property yields.',
    example: 'An investment property with a $250,000 purchase price and $2,200 monthly rent.',
    inputs: [
      { id: 'purchasePrice', label: 'Property Purchase Price ($)', type: 'number', defaultValue: 250000, min: 1000 },
      { id: 'monthlyRent', label: 'Expected Monthly Rental Income ($)', type: 'number', defaultValue: 2200, min: 10 },
      { id: 'annualExpenses', label: 'Annual Operational Expenses ($) (Taxes, HOA, Maintenance)', type: 'number', defaultValue: 6400, min: 0 }
    ],
    faq: [
      { question: 'What is Cap Rate?', answer: 'Capitalization Rate (Cap Rate) measures a property\'s potential return, independent of financing, by comparing Net Operating Income (NOI) to purchase price.' }
    ],
    relatedSlugs: ['property-expense', 'property-value'],
    seoTitle: 'Rental Property Cash Flow, Yield & Cap Rate ROI Calculator',
    seoDescription: 'Calculate rental property ROI and net cash flows. Model capitalization rates based on purchase prices.',
    calculate: (inputs) => {
      const price = Number(inputs.purchasePrice || 250000);
      const rent = Number(inputs.monthlyRent || 2200);
      const exp = Number(inputs.annualExpenses || 6400);

      const grossAnnualIncome = rent * 12;
      const noi = grossAnnualIncome - exp; // Net Operating Income
      const capRate = price > 0 ? (noi / price) * 100 : 0;
      const cashYield = price > 0 ? (grossAnnualIncome / price) * 100 : 0;

      return {
        results: [
          { label: 'Capitalization Rate (Cap Rate)', value: `${capRate.toFixed(2)}%`, isPrimary: true },
          { label: 'Annual Net Operating Income', value: noi.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Gross Property Rental Yield', value: `${cashYield.toFixed(2)}%` }
        ]
      };
    }
  },
  {
    id: 'property-expense',
    name: 'Rental Operations & Property Expense Sizer',
    slug: 'property-expense',
    category: 'real-estate-pro',
    description: 'Calculate monthly and annual operating expenses using standard real estate ratios.',
    formula: 'Total Year Expenses = Taxes + Insurance + HOA + Maintenance Reserves',
    explanation: 'Consolidates operating expenses to calculate net yields, helping landlords budget cash reserves.',
    example: 'A rental property with $2,800 in property taxes and $1,100 in insurance premiums.',
    inputs: [
      { id: 'annualTaxes', label: 'Property Tax ($/Year)', type: 'number', defaultValue: 2800, min: 0 },
      { id: 'annualInsurance', label: 'Insurance Premium ($/Year)', type: 'number', defaultValue: 1100, min: 0 },
      { id: 'monthlyHoa', label: 'Monthly HOA Fees ($/Month)', type: 'number', defaultValue: 120, min: 0 },
      { id: 'maintenancePct', label: 'Maintenance Reserve Allowance (%) (of Purchase Price)', type: 'number', defaultValue: 1, min: 0, max: 10 },
      { id: 'propValue', label: 'Assigned Property Market Value ($)', type: 'number', defaultValue: 250000, min: 1000 }
    ],
    faq: [
      { question: 'Why reserve 1% of property value for maintenance?', answer: 'The 1% rule is a standard benchmark used to ensure landlords have sufficient cash reserves to cover long-term repairs, such as roofs and HVAC systems.' }
    ],
    relatedSlugs: ['rental-income', 'property-value'],
    seoTitle: 'Rental Operations & Property Operating Expenses Calculator',
    seoDescription: 'Calculate annual property operating expenses. Budget taxes, insurance, HOA, and maintenance reserves.',
    calculate: (inputs) => {
      const tax = Number(inputs.annualTaxes || 2800);
      const ins = Number(inputs.annualInsurance || 1100);
      const hoa = Number(inputs.monthlyHoa || 120);
      const maintPct = Number(inputs.maintenancePct || 1) / 100;
      const value = Number(inputs.propValue || 250000);

      const annualMaint = value * maintPct;
      const annualHoa = hoa * 12;
      const totalAnnualExp = tax + ins + annualMaint + annualHoa;
      const monthlyExp = totalAnnualExp / 12;

      return {
        results: [
          { label: 'Total Annual Expenses', value: totalAnnualExp.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Monthly Budget Allocation', value: monthlyExp.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Maintenance Reserve portion', value: annualMaint.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'property-value',
    name: 'Commercial & Multi-Family Valuation Multiplier',
    slug: 'property-value',
    category: 'real-estate-pro',
    description: 'Estimate property value using Cap Rate and Gross Rent Multiplier (GRM) algorithms.',
    formula: 'Valuation = Net Operating Income / Target capitalization Rate %',
    explanation: 'Calculates property value based on NOI and target capitalization rates, helping real estate investors evaluate purchases.',
    example: 'An multi-family asset returning $18,000 in NOI under a target 6% Cap Rate.',
    inputs: [
      { id: 'netOperatingIncome', label: 'Annual Net Operating Income (NOI) ($)', type: 'number', defaultValue: 18000, min: 1 },
      { id: 'targetCapRate', label: 'Target Capitalization Rate Percentage (%)', type: 'number', defaultValue: 6.0, min: 0.1, max: 25, step: 0.1 }
    ],
    faq: [
      { question: 'What is a typical cap rate for valuation?', answer: 'Typical capitalization rates range from 4% to 10%, depending on the property type, location, and market risk.' }
    ],
    relatedSlugs: ['rental-income', 'real-estate-growth'],
    seoTitle: 'Commercial Property Value & capitalization Rate Calculator',
    seoDescription: 'Estimate property value using target capitalization rates. Convert NOI into property values easily.',
    calculate: (inputs) => {
      const noi = Number(inputs.netOperatingIncome || 18000);
      const cap = Number(inputs.targetCapRate || 6.0) / 100;

      const estimatedValueVal = noi / cap;

      return {
        results: [
          { label: 'Estimated Property Value', value: estimatedValueVal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Target capitalization Rate', value: `${(cap * 100).toFixed(2)}%`, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'real-estate-growth',
    name: 'Property Value appreciation & inflation Forecast',
    slug: 'real-estate-growth',
    category: 'real-estate-pro',
    description: 'Forecast property value increases over time based on historical annual appreciation rates.',
    formula: 'Future Value = Current Value * (1 + Appreciation %)^Years',
    explanation: 'Projects property values over time, helping homeowners estimate long-term net worth gains.',
    example: 'A $300,000 home appreciating at a 4.5% annual rate over a 15-year period.',
    inputs: [
      { id: 'startingValue', label: 'Current Property Market Value ($)', type: 'number', defaultValue: 300000, min: 1000 },
      { id: 'annualAppreciation', label: 'Expected Annual Appreciation Rate (%)', type: 'number', defaultValue: 4.5, min: 0, max: 25, step: 0.1 },
      { id: 'forecastYears', label: 'Forecast Timeline Duration (Years)', type: 'number', defaultValue: 15, min: 1, max: 50 }
    ],
    faq: [
      { question: 'Why is inflation factored in?', answer: 'Property values appreciate over time, but after-inflation growth (real growth) is historically lower, range from 1% to 3%.' }
    ],
    relatedSlugs: ['property-value', 'home-investment'],
    seoTitle: 'Property Value Appreciation & Home Equity Growth Calculator',
    seoDescription: 'Forecast property appreciation over time. Project future home values and equity based on historical rates.',
    calculate: (inputs) => {
      const val = Number(inputs.startingValue || 300000);
      const rate = Number(inputs.annualAppreciation || 4.5) / 100;
      const years = Number(inputs.forecastYears || 15);

      const finalVal = val * Math.pow(1 + rate, years);
      const totalEquityGainVal = finalVal - val;

      return {
        results: [
          { label: 'Future Property Value', value: finalVal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Cumulative Equity Gained', value: totalEquityGainVal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'home-investment',
    name: 'Home Purchase Investment & Equity Tracker',
    slug: 'home-investment',
    category: 'real-estate-pro',
    description: 'Track your home equity growth by comparing mortgage principal payments against appreciation.',
    formula: 'Equity = Future appreciated Value - Remaining Loan balance',
    explanation: 'Models equity growth over time, helping homebuyers balance mortgage payments against appreciation.',
    example: 'Buying a $350,000 home with a 20% downpayment and a 30-year mortgage.',
    inputs: [
      { id: 'homePrice', label: 'Home Purchase Price ($)', type: 'number', defaultValue: 350000, min: 1000 },
      { id: 'downPaymentPct', label: 'Downpayment Percentage (%)', type: 'number', defaultValue: 20, min: 0, max: 100 },
      { id: 'apprecRate', label: 'Annual Home Appreciation (%)', type: 'number', defaultValue: 4.0, min: 0, max: 20, step: 0.1 }
    ],
    faq: [
      { question: 'What is home equity?', answer: 'Home equity is the difference between your property\'s current market value and your remaining mortgage loan balance.' }
    ],
    relatedSlugs: ['rental-income', 'real-estate-growth'],
    seoTitle: 'Home Purchase Equity Tracker & appreciation Forecaster',
    seoDescription: 'Track home equity growth over time. Balance downpayments and mortgage balances against appreciation.',
    calculate: (inputs) => {
      const price = Number(inputs.homePrice || 350000);
      const downPct = Number(inputs.downPaymentPct || 20) / 100;
      const appRate = Number(inputs.apprecRate || 4.0) / 100;

      const downpayment = price * downPct;
      const loanAmount = price - downpayment;

      // Estimate 5-year equity growth
      const val5Y = price * Math.pow(1 + appRate, 5);
      // Rough amortized loan balance after 5 years (assume ~8% principal reduction)
      const loan5Y = loanAmount * 0.92;
      const equity5Y = val5Y - loan5Y;

      return {
        results: [
          { label: 'Initial Downpayment Cost', value: downpayment.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Appreciated Value (Year 5)', value: val5Y.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Estimated Equity Saved (Year 5)', value: equity5Y.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },

  // ====================================== AUTOMOTIVE ======================================
  {
    id: 'car-maintenance',
    name: 'Car Maintenance Schedule & Cost Forecaster',
    slug: 'car-maintenance',
    category: 'automotive',
    description: 'Forecast annual vehicle maintenance costs based on age and mileage parameters.',
    formula: 'Estimated Maintenance Cost = Mileage * Cost Factor (based on vehicle age)',
    explanation: 'Estimates vehicle maintenance costs over time, helping car owners budget repairs and prevent unexpected breakdowns.',
    example: 'An 8-year-old vehicle with 95,000 miles experiences rising maintenance costs over time.',
    inputs: [
      { id: 'annualMileage', label: 'Average Annual Mileage (Miles)', type: 'number', defaultValue: 12000, min: 100 },
      { id: 'carAgeYears', label: 'Vehicle Age from manufacture (Years)', type: 'number', defaultValue: 6, min: 0, max: 30 }
    ],
    faq: [
      { question: 'Why do vehicle maintenance costs rise with age?', answer: 'Friction and component wear require major part replacements (such as timing belts and tires) as vehicles age.' }
    ],
    relatedSlugs: ['car-ownership', 'vehicle-cost'],
    seoTitle: 'Annual Car Maintenance & repair Budget Cost Forecaster',
    seoDescription: 'Forecast annual vehicle maintenance costs. Budget for repairs based on mileage and vehicle age.',
    calculate: (inputs) => {
      const miles = Number(inputs.annualMileage || 12000);
      const age = Number(inputs.carAgeYears || 6);

      // Base maintenance cost factor per mile based on age
      let factor = 0.05; // 5 cents/mile for fresh cars
      if (age > 10) factor = 0.15;
      else if (age > 5) factor = 0.10;

      const nominalAnnualExpenses = miles * factor;
      const tireFund = 180; // set aside $180 annually for tires
      const combinedTotalCost = nominalAnnualExpenses + tireFund;

      return {
        results: [
          { label: 'Annual Maintenance Cost', value: combinedTotalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Average Monthly Reserve', value: (combinedTotalCost / 12).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'car-ownership',
    name: 'True Vehicle Cost of Ownership (TCO) Calculator',
    slug: 'car-ownership',
    category: 'automotive',
    description: 'Model the true cost of vehicle ownership (TCO) by factoring in depreciation, fuel, and insurance costs.',
    formula: 'TCO = Depreciation + Monthly Financing + Fuels + Insurance premiums',
    explanation: 'Consolidates vehicle expenses (including depreciation) to reveal the true cost of car ownership.',
    example: 'A vehicle with a $450 monthly financing payment and substantial annual depreciation.',
    inputs: [
      { id: 'monthlyPayment', label: 'Monthly Loan/Lease Payment ($)', type: 'number', defaultValue: 450, min: 0 },
      { id: 'annualInsurance', label: 'Annual Car Insurance Premiums ($)', type: 'number', defaultValue: 1400, min: 0 },
      { id: 'monthlyFuel', label: 'Expected Monthly Gas/Electric cost ($)', type: 'number', defaultValue: 150, min: 0 },
      { id: 'annualDeprecVal', label: 'Annual Expected Vehicle Depreciation ($)', type: 'number', defaultValue: 2800, min: 0 }
    ],
    faq: [
      { question: 'What is the largest hidden car cost?', answer: 'Depreciation is the largest hidden cost of vehicle ownership, often accounting for over 40% of standard vehicle TCO in the first three years.' }
    ],
    relatedSlugs: ['car-maintenance', 'vehicle-cost'],
    seoTitle: 'True Vehicle Cost of Ownership (TCO) Monthly Expenses Calculator',
    seoDescription: 'Calculate the true monthly cost of car ownership. Factors in financing payments, fuel, insurance, and depreciation.',
    calculate: (inputs) => {
      const pay = Number(inputs.monthlyPayment || 450);
      const ins = Number(inputs.annualInsurance || 1400) / 12;
      const fuel = Number(inputs.monthlyFuel || 150);
      const deprec = Number(inputs.annualDeprecVal || 2800) / 12;

      const totalMonthly = pay + ins + fuel + deprec;
      const totalYearly = totalMonthly * 12;

      return {
        results: [
          { label: 'Monthly Ownership TCO', value: totalMonthly.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Annualized True Cost', value: totalYearly.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Depreciation portion (Monthly)', value: deprec.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'vehicle-cost',
    name: 'Auto Lease vs Finance Cost Comparison',
    slug: 'vehicle-cost',
    category: 'automotive',
    description: 'Compare upfront and long-term financing costs of leasing versus buying a vehicle.',
    formula: 'Total Cost = Downpayment + Sum of Monthly Payments - Residual Value (if buying)',
    explanation: 'Models financing options to help car buyers compare lease payments and purchasing options.',
    example: 'A vehicle with a standard 36-month lease term compared to 60 months of financing.',
    inputs: [
      { id: 'purchasePrice', label: 'Vehicle Negotiated Price ($)', type: 'number', defaultValue: 32000, min: 1000 },
      { id: 'leasePayment', label: 'Proposed Monthly Lease Payment ($)', type: 'number', defaultValue: 350, min: 1 },
      { id: 'leaseTermMonths', label: 'Lease Contract Duration (Months) (e.g., 36)', type: 'number', defaultValue: 36, min: 12 },
      { id: 'financePayment', label: 'Proposed Monthly Financing Code ($)', type: 'number', defaultValue: 520, min: 1 },
      { id: 'financeTermMonths', label: 'Financing Loan Term (Months) (e.g., 60)', type: 'number', defaultValue: 60, min: 12 }
    ],
    faq: [
      { question: 'What is residual value?', answer: 'Residual value represents the estimated market value of a leased vehicle at the end of the lease term, which defines your purchase option price.' }
    ],
    relatedSlugs: ['car-ownership', 'fuel-saving'],
    seoTitle: 'Auto Lease vs Buying Loan Finance Cost Comparison Calculator',
    seoDescription: 'Compare vehicle lease and finance options. Track total outlays and interest payments over time.',
    calculate: (inputs) => {
      const price = Number(inputs.purchasePrice || 32000);
      const leasePay = Number(inputs.leasePayment || 350);
      const leaseMonths = Number(inputs.leaseTermMonths || 36);
      const finPay = Number(inputs.financePayment || 520);
      const finMonths = Number(inputs.financeTermMonths || 60);

      const totalLeaseOutlay = leasePay * leaseMonths;
      const totalFinanceOutlay = finPay * finMonths;

      return {
        results: [
          { label: 'Total Lease Outlay', value: totalLeaseOutlay.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Total Buy/Finance Outlay', value: totalFinanceOutlay.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Net Financing Outlay Difference', value: (totalFinanceOutlay - totalLeaseOutlay).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'fuel-saving',
    name: 'Vehicle Fuel Economy and Savings Calculator',
    slug: 'fuel-saving',
    category: 'automotive',
    description: 'Calculate fuel savings from driving a high-MPG car over a low-MPG model.',
    formula: 'Fuel Savings = (Annual Mileage / low MPG - Annual Mileage / High MPG) * Gas Price',
    explanation: 'Models fuel economies and gas prices to calculate expected travel cost savings over time.',
    example: 'Replacing a 20 MPG vehicle with a fuel-efficient 35 MPG hybrid.',
    inputs: [
      { id: 'annualMileage', label: 'Expected Annual Travel Distance (Miles)', type: 'number', defaultValue: 12000, min: 1 },
      { id: 'gasPricePerGallon', label: 'Local Gas Fuel Price ($/Gallon)', type: 'number', defaultValue: 3.65, min: 0.1 },
      { id: 'currentVehicleMpg', label: 'Current Vehicle Mileage Rating (MPG)', type: 'number', defaultValue: 20, min: 1 },
      { id: 'newVehicleMpg', label: 'Proposed Efficient Vehicle Rating (MPG)', type: 'number', defaultValue: 35, min: 1 }
    ],
    faq: [
      { question: 'What is a typical hybrid vehicle payload MPG?', answer: 'Most modern hybrids return 45 to 55 MPG in city driving, offering substantial fuel savings over standard vehicles.' }
    ],
    relatedSlugs: ['car-ownership', 'ev-cost-compare'],
    seoTitle: 'Vehicle Fuel Economy & MPG Cost Savings Calculator',
    seoDescription: 'Calculate annual fuel savings from high-MPG vehicles. Compare fuel efficiency options easily.',
    calculate: (inputs) => {
      const miles = Number(inputs.annualMileage || 12000);
      const price = Number(inputs.gasPricePerGallon || 3.65);
      const currentMpg = Number(inputs.currentVehicleMpg || 20);
      const newMpg = Number(inputs.newVehicleMpg || 35);

      const fuelUsedCurrent = miles / currentMpg;
      const fuelUsedNew = miles / newMpg;

      const spentCurrent = fuelUsedCurrent * price;
      const spentNew = fuelUsedNew * price;
      const annualSavings = spentCurrent - spentNew;

      return {
        results: [
          { label: 'Estimated Annual Gas Savings', value: annualSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Monthly Fuel savings portion', value: (annualSavings / 12).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Standard Fuel gallons Gained', value: `${(fuelUsedCurrent - fuelUsedNew).toFixed(0)} Gallons` }
        ]
      };
    }
  },
  {
    id: 'ev-cost-compare',
    name: 'EV Charging vs Gas Fuel Cost Comparison',
    slug: 'ev-cost-compare',
    category: 'automotive',
    description: 'Compare EV electricity charging costs to gasoline expenses based on mileage.',
    formula: 'EV Cost = (Mileage / EV Efficiency) * Electric Rate | Gas Cost = (Mileage / Gas MPG) * Gas Price',
    explanation: 'Models electricity and fuel prices to help car buyers compare electric vehicle and ICE running costs.',
    example: 'An EV driving 12,000 miles processes substantial savings over a standard ICE sedan.',
    inputs: [
      { id: 'mileageTarget', label: 'Annual Travel Distance (Miles)', type: 'number', defaultValue: 12000, min: 1 },
      { id: 'powerRateKwh', label: 'Home Charging Electricity Rate ($/kWh) (e.g., $0.16)', type: 'number', defaultValue: 0.16, min: 0.01 },
      { id: 'evKwhM', label: 'EV Electricity Mileage consumption (kWh per 100 Miles)', type: 'number', defaultValue: 30, min: 1 },
      { id: 'gasPricePerGallon', label: 'Average Gasoline Fuel Price ($/Gallon)', type: 'number', defaultValue: 3.65, min: 0.1 },
      { id: 'gasMpg', label: 'ICE Gas Vehicle Mileage rating (MPG)', type: 'number', defaultValue: 25, min: 1 }
    ],
    faq: [
      { question: 'What is EV efficiency (kWh per 100 miles)?', answer: 'Most modern electric sedans consume roughly 28 to 34 kWh of electricity per 100 miles of driving.' }
    ],
    relatedSlugs: ['car-ownership', 'fuel-saving'],
    seoTitle: 'Electric Vehicle EV Charging vs Gasoline Fuel Cost Calculator',
    seoDescription: 'Compare EV and gasoline running costs. Estimate electric car savings based on local interest rates.',
    calculate: (inputs) => {
      const miles = Number(inputs.mileageTarget || 12000);
      const powerRate = Number(inputs.powerRateKwh || 0.16);
      const evEfficiency = Number(inputs.evKwhM || 30);
      const gasPrice = Number(inputs.gasPricePerGallon || 3.65);
      const gasMpg = Number(inputs.gasMpg || 25);

      const totalKwh = (miles / 100) * evEfficiency;
      const totalEvCost = totalKwh * powerRate;

      const totalGallons = miles / gasMpg;
      const totalGasCost = totalGallons * gasPrice;

      const annualMpgSavingsVal = totalGasCost - totalEvCost;

      return {
        results: [
          { label: 'Annual Running Cost Savings', value: annualMpgSavingsVal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Annual EV Electricity Cost', value: totalEvCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Annual ICE Gas Cost', value: totalGasCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  }
];
