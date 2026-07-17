import { Calculator } from '../types';

export const V22_PART3_CALCULATORS: Calculator[] = [
  // ====================================== ENGINEERING CONTINUED ======================================
  {
    id: 'mechanical-power',
    name: 'Mechanical Power & Torque Calculator',
    slug: 'mechanical-power',
    category: 'engineering',
    description: 'Calculate torque, rotational speed, and horsepower conversions for active motors and mechanical linkages.',
    formula: 'Power (HP) = Torque (N-m) * Rotational Speed (RPM) / 7127\nTorque (N-m) = Power (kW) * 9549 / RPM',
    explanation: 'Sizers rotational drivetrain variables, assisting engine calibrators and robotics engineers configuring gear ratios and electrical motors.',
    example: 'An engine spinning at 3,000 RPM producing 250 N-m of physical force yields approximately 105 horsepower.',
    inputs: [
      { id: 'rpm', label: 'Rotational Shaft Speed (RPM)', type: 'number', defaultValue: 3000, min: 100 },
      { id: 'torqueNm', label: 'Shaft Force Torque (Newton-Meters)', type: 'number', defaultValue: 250, min: 1 }
    ],
    faq: [
      { question: 'What is the relationship between torque and horsepower?', answer: 'Torque represents the raw rotational force potential a motor can apply. Horsepower models the velocity of delivering that work over calendar time (torque * RPM).' }
    ],
    relatedSlugs: ['engineering-material', 'structural-safety'],
    seoTitle: 'Rotational Shaft Torque & Motor Horsepower Calculator',
    seoDescription: 'Convert shaft rotational speeds and force torques into kilwatt electrical power indices and horsepowers.',
    calculate: (inputs) => {
      const rpm = Number(inputs.rpm || 3000);
      const torque = Number(inputs.torqueNm || 250);
      const hp = (torque * rpm) / 7120.6; // exact constant for torque in N-m to hp
      const kw = hp * 0.7457; // kW conversion
      return {
        results: [
          { label: 'Calculated Horsepower', value: hp.toFixed(1) + ' HP', isPrimary: true },
          { label: 'Shaft Electrical Power Output', value: kw.toFixed(2) + ' kW' },
          { label: 'Work performed per hour equivalent', value: (kw * 3.6).toFixed(1) + ' MegaJoules (MJ)' }
        ],
        chartData: [
          { name: 'RPM Factor', value: rpm },
          { name: 'Torque Load', value: torque }
        ]
      };
    }
  },
  {
    id: 'energy-efficiency',
    name: 'Energy Efficiency Calculator',
    slug: 'energy-efficiency',
    category: 'engineering',
    description: 'Analyze Coefficient of Performance (COP) and compile heating/cooling appliance electric energy savings.',
    formula: 'COP = Useful Heat Output / Work Input\nAnnual Savings = Output Capacity * Delta Hours * (1/COP_old - 1/COP_new) * Power Price',
    explanation: 'Models energy savings of upgrading ventilation and mechanical heating equipment. Helps calculate heat pump return on investments.',
    example: 'Replacing a resistance heater (COP 1.0) with an advanced heat pump (COP 3.5) reduces active heating utility cost by ~71%.',
    inputs: [
      { id: 'powerPrice', label: 'Local Electricity Fee ($/kWh)', type: 'number', defaultValue: 0.16, min: 0.01, step: 0.01 },
      { id: 'heatLoad', label: 'Annual Building Thermal Delivery (kWh)', type: 'number', defaultValue: 10000, min: 100 },
      { id: 'currentCOP', label: 'Current System COP Efficiency', type: 'number', defaultValue: 1.0, min: 0.5, step: 0.1 },
      { id: 'proposedCOP', label: 'Proposed Upgrade COP Efficiency', type: 'number', defaultValue: 3.5, min: 0.5, step: 0.1 }
    ],
    faq: [
      { question: 'Why can heat pump COP exceed 1.0?', answer: 'Heat pumps do not create heat through fuel conversion. Instead, they leverage refrigeration cycles to pump thermal energy from outdoor air, magnifying input efficiencies.' }
    ],
    relatedSlugs: ['thermal', 'mechanical-power'],
    seoTitle: 'HVAC COP Upgrade & Electric Energy Savings Calculator',
    seoDescription: 'Calculate the annual dollar bill savings of upgrading home heat pumps or air conditioners to high COP systems.',
    calculate: (inputs) => {
      const price = Number(inputs.powerPrice || 0.16);
      const load = Number(inputs.heatLoad || 10000);
      const copOld = Number(inputs.currentCOP || 1.0);
      const copNew = Number(inputs.proposedCOP || 3.5);
      
      const currentCost = (load / copOld) * price;
      const proposedCost = (load / copNew) * price;
      const annualSaved = Math.max(0, currentCost - proposedCost);
      return {
        results: [
          { label: 'Annual Utility Savings', value: '$' + annualSaved.toFixed(2), isPrimary: true },
          { label: 'Baseline Heating Cost', value: '$' + currentCost.toFixed(2) },
          { label: 'Proposed System Cost', value: '$' + proposedCost.toFixed(2) }
        ],
        chartData: [
          { name: 'Resistance Cost', value: currentCost },
          { name: 'Heat Pump Cost', value: proposedCost }
        ]
      };
    }
  },

  // ====================================== CONSTRUCTION ======================================
  {
    id: 'building-cost',
    name: 'Building Cost Calculator',
    slug: 'building-cost',
    category: 'construction',
    description: 'Calculate square-foot construction budgets based on building parameters and finishing levels.',
    formula: 'Total Cost = Floor Square Footage * Finishes Standard Multiplier Rate * Region Factor',
    explanation: 'Generates residential and light commercial structural build outlays based on building specs and finishes.',
    example: 'A 2,000 sq ft construction with mid-tier custom finishes averages around $360,000.',
    inputs: [
      { id: 'areaSqft', label: 'Total Building Area (Sq Ft)', type: 'number', defaultValue: 1500, min: 50 },
      { id: 'finishes', label: 'Desired Finishing level', type: 'select', defaultValue: 150, options: [
        { label: 'Economy Builder Grade (~$120/sqft)', value: 120 },
        { label: 'Standard Premium Grade (~$180/sqft)', value: 180 },
        { label: 'Custom Luxury Architect Grade (~$300/sqft)', value: 300 }
      ]}
    ],
    faq: [
      { question: 'What is excluded in square-foot estimates?', answer: 'Standard square foot estimates usually omit active land acquiring costs, structural utility hookups, and professional architect fees.' }
    ],
    relatedSlugs: ['construction-material', 'concrete-calculator'],
    seoTitle: 'Residential Build Square-Foot Project Budget Calculator',
    seoDescription: 'Estimate the prospective building expenditures for custom homes and extensions using sq ft pricing.',
    calculate: (inputs) => {
      const area = Number(inputs.areaSqft || 1500);
      const scale = Number(inputs.finishes || 150);
      const baseCost = area * scale;
      const contingency = baseCost * 0.15; // 15% overrun buffer
      const totals = baseCost + contingency;
      return {
        results: [
          { label: 'Estimated Project Outlay', value: '$' + totals.toLocaleString(undefined, { maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Base Construction Estimate', value: '$' + baseCost.toLocaleString() },
          { label: 'Contingency Reserve Fund (15%)', value: '$' + contingency.toLocaleString() }
        ],
        chartData: [
          { name: 'Core Shell', value: baseCost * 0.4 },
          { name: 'Interior Finishes', value: baseCost * 0.45 },
          { name: 'Overrun Buffer', value: contingency }
        ]
      };
    }
  },
  {
    id: 'construction-material',
    name: 'Construction Material Sizer',
    slug: 'construction-material',
    category: 'construction',
    description: 'Sizer stud counts, wall drywall boards, and fastening screws for wood framing projects.',
    formula: 'Studs count = (Wall Length in Inches / Spacing Inches) + Start/End Stud Multipliers',
    explanation: 'Uses standard carpentry calculations (such as 16-inch center stud layouts) to build high-quality timber shopping lists for renovation walls.',
    example: 'A 40-foot wall framed on 16-inch centers with single plates requires approximately 33 vertical structural studs.',
    inputs: [
      { id: 'wallLength', label: 'Wall Total Length (Feet)', type: 'number', defaultValue: 24, min: 1 },
      { id: 'spacing', label: 'On-Center Wood Stud Spacing', type: 'select', defaultValue: 16, options: [
        { label: '16 inches on center (Standard residential)', value: 16 },
        { label: '24 inches on center (Infill / Light load)', value: 24 }
      ]},
      { id: 'drywallSize', label: 'Drywall Board Panel Size', type: 'select', defaultValue: 32, options: [
        { label: '4ft x 8ft panel (32 sq ft coverage)', value: 32 },
        { label: '4ft x 12ft panel (48 sq ft coverage)', value: 48 }
      ]}
    ],
    faq: [
      { question: 'Why add extra studs to the raw estimate?', answer: 'Always buy 10-15% surplus studs. In practice, extra lumber is required for double plates, door framing headers, and window junctions.' }
    ],
    relatedSlugs: ['building-cost', 'brick-calculator'],
    seoTitle: 'Wall Framing Studs & Sheetrock Sizer',
    seoDescription: 'Calculate the volume of structural timber studs and drywall panels needed to erect custom partition walls.',
    calculate: (inputs) => {
      const len = Number(inputs.wallLength || 24);
      const space = Number(inputs.spacing || 16);
      const drywallArea = Number(inputs.drywallSize || 32);
      
      const wallInches = len * 12;
      const studsRaw = Math.ceil(wallInches / space) + 2; // add corner caps
      const platesCount = Math.ceil(len * 3 / 8); // 3 horizontal plates (bottom + double top) based on 8ft studs
      const boardSqft = len * 8.5; // assume standard 8.5ft high ceilings
      const drywallCount = Math.ceil(boardSqft / drywallArea);
      return {
        results: [
          { label: 'Required vertical studs', value: studsRaw + platesCount, isPrimary: true },
          { label: 'Drywall board panels', value: drywallCount, unit: 'sheets' },
          { label: 'Fastening screws estimate', value: (drywallCount * 40), unit: 'screws' }
        ],
        chartData: [
          { name: 'Vertical studs', value: studsRaw },
          { name: 'Horizontal plates', value: platesCount }
        ]
      };
    }
  },
  {
    id: 'concrete-calculator',
    name: 'Concrete Volumetric Sizer',
    slug: 'concrete',
    category: 'construction',
    description: 'Calculate cubic volume requirements and concrete bag counts for floor slabs, columns, and foundations.',
    formula: 'Volume (Cubic Yards) = Length(ft) * Width(ft) * Thickness(in) / 324',
    explanation: 'Finds precise mixing volumes in cubic yards or cubic meters, then tells you how many physical 80lb pre-mix bags are required.',
    example: 'An 10ft x 12ft deck slab poured 4 inches deep takes 1.48 cubic yards, or about 67 bags (80 lb).',
    inputs: [
      { id: 'lengthF', label: 'Pour Length (Feet)', type: 'number', defaultValue: 12, min: 1 },
      { id: 'widthF', label: 'Pour Width (Feet)', type: 'number', defaultValue: 10, min: 1 },
      { id: 'depthIn', label: 'Pour Thickness/Depth (Inches)', type: 'number', defaultValue: 4, min: 1, max: 24 }
    ],
    faq: [
      { question: 'What is the strength of standard bag concrete?', answer: 'Pre-mixed aggregate concrete typically achieves 3,500 to 4,000 PSI strength ratings after curing for 28 full calendar days.' }
    ],
    relatedSlugs: ['building-cost', 'construction-material'],
    seoTitle: 'Cubic Yard Slab Pour Concrete Bag Sizer',
    seoDescription: 'Accurately size cubic yards and bag count metrics for backyard deck slabs or footing installations.',
    calculate: (inputs) => {
      const l = Number(inputs.lengthF || 12);
      const w = Number(inputs.widthF || 10);
      const d = Number(inputs.depthIn || 4);
      
      const cuFt = l * w * (d / 12);
      const cuYd = cuFt / 27;
      const bags80 = Math.ceil(cuFt / 0.6); // 1 bag of 80lb creates ~0.6 cubic feet of concrete
      return {
        results: [
          { label: 'Required Volume', value: cuYd.toFixed(2) + ' Cubic Yards', isPrimary: true },
          { label: 'Cubic Feet volume', value: cuFt.toFixed(1) + ' Cubic Feet' },
          { label: 'Pre-mix 80lb Bags needed', value: bags80 + ' Bags' }
        ],
        chartData: [
          { name: 'Actual Pour Volume', value: cuFt },
          { name: 'Surplus Margining', value: cuFt * 0.1 }
        ]
      };
    }
  },
  {
    id: 'brick-calculator',
    name: 'Brick & Wall Mortar Calculator',
    slug: 'brick',
    category: 'construction',
    description: 'Calculate brick count, mortar volume, and cost based on wall square footage and brick size.',
    formula: 'Bricks Count = Wall Area / Single Brick Exposure Area including joints',
    explanation: 'Sizes masonry scopes by checking wall square footages against standard brick dimensions and vertical bonding styles.',
    example: 'A 100 sq ft wall built with standard red bricks requires approximately 685 bricks and 5 bags of masonry mortar.',
    inputs: [
      { id: 'wallArea', label: 'Total Wall Surface Area (Sq Ft)', type: 'number', defaultValue: 120, min: 1 },
      { id: 'brickType', label: 'Standard Brick Dimensions', type: 'select', defaultValue: 'standard', options: [
        { label: 'Standard Modular Red (8 x 2.25 x 3.6 inches)', value: 6.85 },
        { label: 'Roman Architectural (12 x 1.6 x 3.6 inches)', value: 5.4 },
        { label: 'Large Utility Block (12 x 4 x 4 inches)', value: 3.5 }
      ]}
    ],
    faq: [
      { question: 'What Mortar Mix is recommended for standard walls?', answer: 'Type N mortar is standard for non-load-bearing exterior walls, while Type S is preferred for heavier structural applications.' }
    ],
    relatedSlugs: ['construction-material', 'paint-calculator'],
    seoTitle: 'Wall Face Brick Count & Mortar Bag Sizer',
    seoDescription: 'Weigh wall square footage against modular brick configurations to generate count and mortar metrics.',
    calculate: (inputs) => {
      const area = Number(inputs.wallArea || 120);
      const mult = Number(inputs.brickType || 6.85); // bricks per sq ft
      const rawBricks = Math.ceil(area * mult);
      const withWaste = Math.ceil(rawBricks * 1.10); // 10% waste buffer for half-cuts
      const mortarBags = Math.ceil(withWaste * 0.0075); // approx .75 bags of premixed mortar per 100 bricks
      return {
        results: [
          { label: 'Bricks Needed (with waste)', value: withWaste.toLocaleString(), isPrimary: true },
          { label: 'Theoretical Bricks Count', value: rawBricks.toLocaleString() },
          { label: 'Pre-mixed Mortar Bags (80lb)', value: Math.max(1, mortarBags) + ' Bags' }
        ],
        chartData: [
          { name: 'Net Bricks Used', value: rawBricks },
          { name: 'Cut Waste & Chipping', value: withWaste - rawBricks }
        ]
      };
    }
  },
  {
    id: 'paint-calculator',
    name: 'Paint Surface Coverage Calculator',
    slug: 'paint',
    category: 'construction',
    description: 'Compute gallon/liter requirements to paint customized room walls based on door/window offsets.',
    formula: 'Paint Volume = (Wall Area - Openings Area) * Coats Count / 350 sq ft per Gallon',
    explanation: 'Assesses room paint purchasing by taking wall dimension properties and subtracting doors and windows.',
    example: 'A room with 400 sq ft of wall space requiring two coats takes exactly 2.0 gallons of paint.',
    inputs: [
      { id: 'perimeterFt', label: 'Total Wall Perimeter Width (Feet)', type: 'number', defaultValue: 48, min: 5 },
      { id: 'ceilingHeight', label: 'Ceiling Clearance Height (Feet)', type: 'number', defaultValue: 9, min: 6 },
      { id: 'coatCount', label: 'Number of paint coats', type: 'select', defaultValue: 2, options: [
        { label: '1 coat - Basic Refresh', value: 1 },
        { label: '2 coats - Clean standard coverage', value: 2 },
        { label: '3 coats - Strong color transition', value: 3 }
      ]},
      { id: 'openingsCount', label: 'Doors and Large Windows (subtracts 21 sq ft each)', type: 'number', defaultValue: 2, min: 0 }
    ],
    faq: [
      { question: 'What is the average coverage of one gallon of paint?', answer: 'A single gallon of standard latex acrylic house paint covers approximately 350 to 400 square feet of smooth wall area.' }
    ],
    relatedSlugs: ['construction-material', 'flooring-calculator'],
    seoTitle: 'Indoor Wall Paint Gallon & Liter Coverage Sizer',
    seoDescription: 'Scale room dimensions and deduct doors to discover the exact paint volume required for home remodels.',
    calculate: (inputs) => {
      const per = Number(inputs.perimeterFt || 48);
      const h = Number(inputs.ceilingHeight || 9);
      const coats = Number(inputs.coatCount || 2);
      const ops = Number(inputs.openingsCount || 2);
      
      const rawSqft = per * h;
      const adjustedSqft = Math.max(20, rawSqft - (ops * 21));
      const totalCoverageSqft = adjustedSqft * coats;
      const gallonsNeeded = Math.ceil(totalCoverageSqft / 350);
      return {
        results: [
          { label: 'Recommended Paint volume', value: gallonsNeeded + ' Gallons', isPrimary: true },
          { label: 'Net Wall Surface Area', value: adjustedSqft + ' Sq Ft' },
          { label: 'Required Coat coverage', value: totalCoverageSqft + ' Sq Ft total' }
        ],
        chartData: [
          { name: 'Net Painted Wall', value: adjustedSqft },
          { name: 'Blocked Openings', value: ops * 21 }
        ]
      };
    }
  },
  {
    id: 'flooring-calculator',
    name: 'Flooring Plank & Tile Sizer',
    slug: 'flooring',
    category: 'construction',
    description: 'Calculate plank and tile volume requirements for floor plans including diagonal waste margins.',
    formula: 'Required Tiles = Floor Area * (1 + Waste Buffer %) / Individual Tile Coverage',
    explanation: 'Sizes dynamic floorboard layouts, ensuring you secure enough tile boards, luxury vinyl planks (LVP), or adhesive before beginning.',
    example: 'Tiling a 200 sq ft bathroom with 12x12 inch tiles with a 10% waste buffer requires exactly 220 physical tiles.',
    inputs: [
      { id: 'floorLength', label: 'Floor Plan Length (Feet)', type: 'number', defaultValue: 14, min: 1 },
      { id: 'floorWidth', label: 'Floor Plan Width (Feet)', type: 'number', defaultValue: 12, min: 1 },
      { id: 'wastePct', label: 'Layout Waste Buffer (%)', type: 'select', defaultValue: 10, options: [
        { label: '5% Buffer - Simple straight grids', value: 5 },
        { label: '10% Buffer - Offset patterns / planks', value: 10 },
        { label: '15% Buffer - Diagonal / Herringbone runs', value: 15 }
      ]}
    ],
    faq: [
      { question: 'Why does herringbone need more waste buffer?', answer: 'Herringbone and diagonal layouts require numerous angled cuts along wall borders, creating scrap pieces that cannot be re-used.' }
    ],
    relatedSlugs: ['paint-calculator', 'building-cost'],
    seoTitle: 'Tile board & luxury LVP Vinyl Floor Sizer',
    seoDescription: 'Find when your floor layout requires higher tile volumes by modeling herringbone and diagonal spacing wastes.',
    calculate: (inputs) => {
      const l = Number(inputs.floorLength || 14);
      const w = Number(inputs.floorWidth || 12);
      const buf = Number(inputs.wastePct || 10) / 100;
      
      const netSqft = l * w;
      const grossSqft = netSqft * (1 + buf);
      const plankCoverage = 1.0; // assume 1 sq ft per tile or plank for standardized scaling
      const plankCount = Math.ceil(grossSqft / plankCoverage);
      return {
        results: [
          { label: 'Required Planks/Tiles (1 sqft each)', value: plankCount + ' Planks', isPrimary: true },
          { label: 'Net Floor Surface Area', value: netSqft + ' Sq Ft' },
          { label: 'Allocated Scrap Waste', value: (grossSqft - netSqft).toFixed(1) + ' Sq Ft' }
        ],
        chartData: [
          { name: 'Floor space', value: netSqft },
          { name: 'Scrap Waste', value: grossSqft - netSqft }
        ]
      };
    }
  },

  // ====================================== ARCHITECTURE & DESIGN ======================================
  {
    id: 'room-planner',
    name: 'Room Clearance Planner',
    slug: 'room-planner',
    category: 'architecture-design',
    description: 'Calculate circulation clearances and layout volumes for standard room pathways and clearances.',
    formula: 'Remaining Area = Room Total Sqft - Furniture Placements Sqft',
    explanation: 'Helps architectural designers and interior decorators verify furniture layouts against standard wheelchair and pedestrian code clearances.',
    example: 'A 240 sq ft living room outfitted with 100 sq ft of sofas and secondary tables leaves a comfortable 58% open circulation layout.',
    inputs: [
      { id: 'roomArea', label: 'Total Room Footprint (Sq Ft)', type: 'number', defaultValue: 240, min: 20 },
      { id: 'furnitureSqft', label: 'Cumulative Furniture Outline Area ($)', type: 'number', defaultValue: 95, min: 10 }
    ],
    faq: [
      { question: 'What is the minimum architectural hallway clearance?', answer: 'Standard residential pathways require a minimum 36-inch (91 cm) clearance. ADA commercial guidelines enforce 60 inches for wheelchair turning circles.' }
    ],
    relatedSlugs: ['space-calculator', 'area-distribution'],
    seoTitle: 'Interior Circulation Area & Furniture Sizing Calculator',
    seoDescription: 'Plan your interior room layouts to ensure compliance with spatial clearance codes and circulation parameters.',
    calculate: (inputs) => {
      const total = Number(inputs.roomArea || 240);
      const furn = Number(inputs.furnitureSqft || 95);
      const free = Math.max(10, total - furn);
      const freeRatio = (free / total) * 100;
      return {
        results: [
          { label: 'Discretionary Circulation space', value: freeRatio.toFixed(1) + '%', isPrimary: true },
          { label: 'Net Open Floor space', value: free + ' Sq Ft' },
          { label: 'Cluttered Density Classification', value: freeRatio > 55 ? 'Comfortable Circulation' : freeRatio > 35 ? 'Standard Dense Layout' : 'Hazardous Structural Overload' }
        ],
        chartData: [
          { name: 'Furniture Footprint', value: furn },
          { name: 'Pedestrian Flow', value: free }
        ]
      };
    }
  },
  {
    id: 'space-calculator',
    name: 'Commercial Space Density Calculator',
    slug: 'space',
    category: 'architecture-design',
    description: 'Calculate Gross spacing requirements for offices and public assemblies based on occupant density parameters.',
    formula: 'Required Gross Area = Target Occupant Count * Density Standard Multipliers (Sq Ft per Person)',
    explanation: 'Balances floor ratios matching local environmental building safety regulations for corporate workspace layouts.',
    example: 'An office designed to safely accommodate 65 programmers at 150 sq ft per workstation requires a 9,750 sq ft suite.',
    inputs: [
      { id: 'occupants', label: 'Max Intended Occupant Count', type: 'number', defaultValue: 50, min: 1 },
      { id: 'buildingType', label: 'Building Assembly Layout Type', type: 'select', defaultValue: 100, options: [
        { label: 'Open Cubicle Office (100 sqft/person)', value: 100 },
        { label: 'Private Administrative Desks (150 sqft/person)', value: 150 },
        { label: 'Recreational Assembly/Dining (15 sqft/person)', value: 15 },
        { label: 'Educational Classrooms (20 sqft/person)', value: 20 }
      ]}
    ],
    faq: [
      { question: 'Why does dining assembly need so little area?', answer: 'Assembly layouts with standing rooms or tightly backed tables can pack occupants tightly under health and safety indexes compared to dedicated office layouts.' }
    ],
    relatedSlugs: ['room-planner', 'area-distribution'],
    seoTitle: 'Commercial Building Occupant Floor Density Sizer',
    seoDescription: 'Size office floors and assembly spaces to match municipal fire capacity zoning indexes.',
    calculate: (inputs) => {
      const occ = Number(inputs.occupants || 50);
      const target = Number(inputs.buildingType || 100);
      const grossArea = occ * target;
      return {
        results: [
          { label: 'Minimum Floor area Required', value: grossArea.toLocaleString() + ' Sq Ft', isPrimary: true },
          { label: 'Required Sizer Floor Area in Sq Meters', value: Math.round(grossArea * 0.0929) + ' m²' }
        ],
        chartData: [
          { name: 'Estimated Spacing Spans', value: grossArea }
        ]
      };
    }
  },
  {
    id: 'area-distribution',
    name: 'Area Distribution Calculator',
    slug: 'area-distribution',
    category: 'architecture-design',
    description: 'Evaluate structural footprints, paved concrete paths, and green space ratios for site master-plans.',
    formula: 'Gross Site = Structure Footprint + Paved Ways + Green Spaces',
    explanation: 'Ensures construction blueprints comply with municipal zoning regulations protecting natural topsoils and drainage basins.',
    example: 'On a 10,000 sq ft parcel hosting a 4,000 sq ft house floor plan, building pathways and lawns leaves a 35% natural green ratio.',
    inputs: [
      { id: 'siteTotal', label: 'Total Land Site Area (Sq Ft)', type: 'number', defaultValue: 15000, min: 100 },
      { id: 'buildingFootprint', label: 'Building Foundation Area (Sq Ft)', type: 'number', defaultValue: 4500, min: 0 },
      { id: 'pavedFootprint', label: 'Driveways & Concrete Patios (Sq Ft)', type: 'number', defaultValue: 2500, min: 0 }
    ],
    faq: [
      { question: 'What is a maximum lot occupancy rating?', answer: 'LOT coverage limits define what percentage of a parcel can host structural roofs, forcing the rest to stay permeable to absorb heavy rainfall.' }
    ],
    relatedSlugs: ['space-calculator', 'building-efficiency-calc'],
    seoTitle: 'Zoning Permeability & Lot Occupancy Ratio Calculator',
    seoDescription: 'Check site design envelopes to ensure compliance with municipal green space drainage guidelines.',
    calculate: (inputs) => {
      const site = Number(inputs.siteTotal || 15000);
      const build = Number(inputs.buildingFootprint || 4500);
      const pave = Number(inputs.pavedFootprint || 2500);
      const green = Math.max(0, site - (build + pave));
      return {
        results: [
          { label: 'Natural Green permeability', value: ((green / site) * 100).toFixed(1) + '%', isPrimary: true },
          { label: 'Net Grass & Lawn Area', value: green + ' Sq Ft' },
          { label: 'Building Lot Coverage Score', value: ((build / site) * 100).toFixed(1) + '%' }
        ],
        chartData: [
          { name: 'Foundation', value: build },
          { name: 'Driveway', value: pave },
          { name: 'Greenery lawn', value: green }
        ]
      };
    }
  },
  {
    id: 'building-efficiency-calc',
    name: 'Building Efficiency Calculator',
    slug: 'building-efficiency',
    category: 'architecture-design',
    description: 'Calculate architectural net-to-gross area ratio (Usable internal area divided by Total floor envelopes).',
    formula: 'Efficiency Rating (%) = Usable Net Area / Gross Building Area * 100',
    explanation: 'Ratios structural design success from a lease perspective. Low ratings highlight bloated stairwells, thick interior walls, or redundant lobbies.',
    example: 'A building containing 12,000 net sq ft of rentable offices within a 15,000 gross shell functions at 80% efficiency.',
    inputs: [
      { id: 'grossArea', label: 'Gross Enclosed Building Space (Sq Ft)', type: 'number', defaultValue: 10000, min: 50 },
      { id: 'structuralLosses', label: 'Stairwells, Structural Pillars & HVAC Ducts (Sq Ft)', type: 'number', defaultValue: 1800, min: 5 }
    ],
    faq: [
      { question: 'What is a profitable commercial net ratio?', answer: 'For standard commercial real estate, net plate efficiencies above 80-85% are highly profitable, presenting minimal lease dead spaces.' }
    ],
    relatedSlugs: ['room-planner', 'shape-clearance-calc'],
    seoTitle: 'Architectural Rentable Net-to-Gross Area Calculator',
    seoDescription: 'Evaluate design space optimization by tracing non-lease spatial losses inside building shells.',
    calculate: (inputs) => {
      const gross = Number(inputs.grossArea || 10000);
      const lost = Number(inputs.structuralLosses || 1800);
      const net = Math.max(10, gross - lost);
      const rat = (net / gross) * 100;
      return {
        results: [
          { label: 'Net Architectural Efficiency', value: rat.toFixed(1) + '%', isPrimary: true },
          { label: 'Net Rentable Floor Space', value: net + ' Sq Ft' },
          { label: 'Circulation & Pillar Loss', value: ((lost / gross) * 100).toFixed(1) + '%' }
        ],
        chartData: [
          { name: 'Leasable Space', value: net },
          { name: 'Internal Columns', value: lost }
        ]
      };
    }
  },

  // ====================================== AGRICULTURE ======================================
  {
    id: 'crop-planning',
    name: 'Crop Seeding & Row Planner',
    slug: 'crop-planning',
    category: 'agriculture',
    description: 'Calculate required seed quantities, row spacings, and planting timelines based on field dimensions.',
    formula: 'Required Seeds Count = Acreage Sqft / (Row Spacing * Plant Spacing)',
    explanation: 'Assists small farmers and horticulturalists preparing seed counts to cover planting plans cleanly.',
    example: 'Planting a half-acre field (21,780 sq ft) with rows spaced 2ft and plants spaced 1ft requires around 10,890 individual seeds.',
    inputs: [
      { id: 'fieldArea', label: 'Target Field Planting Area (Sq Ft)', type: 'number', defaultValue: 43560, min: 100 },
      { id: 'rowSpacing', label: 'Row-to-Row Spacing (Feet)', type: 'number', defaultValue: 2.5, min: 0.5, step: 0.1 },
      { id: 'plantSpacing', label: 'Plant-to-Plant Row Spacing (Feet)', type: 'number', defaultValue: 1.0, min: 0.1, step: 0.1 }
    ],
    faq: [
      { question: 'Why add a germination buffer?', answer: 'Always buy 15% surplus seeds. In nature, a portion of seeds will fail to germinate, and other plants may be lost to pests.' }
    ],
    relatedSlugs: ['irrigation', 'yield-calculator'],
    seoTitle: 'Agricultural Crop Seeding Row Spacing Sizer',
    seoDescription: 'Size physical seed numbers needed for planting plots based on row clearance dimensions.',
    calculate: (inputs) => {
      const area = Number(inputs.fieldArea || 43560);
      const row = Number(inputs.rowSpacing || 2.5);
      const plant = Number(inputs.plantSpacing || 1.0);
      
      const singleArea = row * plant;
      const baseSeeds = Math.ceil(area / singleArea);
      const totalSeeds = Math.ceil(baseSeeds * 1.15); // 15% germination offset
      return {
        results: [
          { label: 'Estimated Seeds Needed (Germination Buffer)', value: totalSeeds.toLocaleString(), isPrimary: true },
          { label: 'Theoretical Plants Spaced', value: baseSeeds.toLocaleString() },
          { label: 'Square feet per plant', value: singleArea.toFixed(2) + ' sqft' }
        ],
        chartData: [
          { name: 'Viable Plants', value: baseSeeds },
          { name: 'Seed Failure Surplus', value: totalSeeds - baseSeeds }
        ]
      };
    }
  },
  {
    id: 'farm-budget',
    name: 'Agricultural Seasonal Budget Calculator',
    slug: 'farm-budget',
    category: 'agriculture',
    description: 'Project seasonal crop revenues, variable cost structures, and net farming returns.',
    formula: 'Net Return = (Acreage * Target Yield * Price Per Unit) - Seed Cost - Fertilizer - Water - Labor',
    explanation: 'Models business unit economics for farms. Evaluates raw crop market value against inputs pricing arrays.',
    example: 'An 10-acre organic potato field yielding 20,000 lbs per acre at $0.60/lb returns $120,000 gross and $45,000 net after expenses.',
    inputs: [
      { id: 'acres', label: 'Active Cultivated Land (Acres)', type: 'number', defaultValue: 5, min: 0.1 },
      { id: 'yieldPerAcre', label: 'Expected Crop Harvest Yield (lbs/Acre)', type: 'number', defaultValue: 15000, min: 100 },
      { id: 'marketPrice', label: 'Forecast Crop Market Value ($/lbs)', type: 'number', defaultValue: 0.75, min: 0.05, step: 0.05 },
      { id: 'expensePerAcre', label: 'Average Input Expenses (Fertilizer, Seed, Water) ($/Acre)', type: 'number', defaultValue: 4500, min: 100, step: 100 }
    ],
    faq: [
      { question: 'What is a typical farm profit margin?', answer: 'Traditional grain scales operate at thin 10-15% net margins. Specialty organic root vegetables can return 30-40% margins depending on location.' }
    ],
    relatedSlugs: ['crop-planning', 'yield-calculator'],
    seoTitle: 'Seasonal Farm Crop Revenue & Margin Planner',
    seoDescription: 'Plan agricultural profitability by mapping acreage, expected harvest yields, and mechanical expenses.',
    calculate: (inputs) => {
      const acres = Number(inputs.acres || 5);
      const yPerA = Number(inputs.yieldPerAcre || 15000);
      const price = Number(inputs.marketPrice || 0.75);
      const costPerA = Number(inputs.expensePerAcre || 4500);
      
      const grossRev = acres * yPerA * price;
      const totalCost = acres * costPerA;
      const netProfit = Math.max(-totalCost, grossRev - totalCost);
      const margin = (netProfit / grossRev) * 100;
      return {
        results: [
          { label: 'Projected Net Return', value: '$' + Math.round(netProfit).toLocaleString(), isPrimary: true },
          { label: 'Gross Farm Revenue', value: '$' + Math.round(grossRev).toLocaleString() },
          { label: 'Net Profit Margin Ratio', value: margin.toFixed(1) + '%' }
        ],
        chartData: [
          { name: 'Crop Sales Revenues', value: grossRev },
          { name: 'Operational Inputs Cost', value: totalCost }
        ]
      };
    }
  },
  {
    id: 'irrigation',
    name: 'Field Irrigation Sizer',
    slug: 'irrigation',
    category: 'agriculture',
    description: 'Calculate daily crop water requirements in gallons or liters based on local climate and acreage.',
    formula: 'Daily Water (Gallons) = Acreage Sqft * (Daily Transpiration Inch / 12) * 7.48',
    explanation: 'Sizers active water tank volumes. Combines transpiration indicators with farm dimensions to prevent mud pooling or plant dehydration.',
    example: 'An 1 acre field tracking 0.2 inches of daily solar evaporation consumes ~5,430 gallons of water per day.',
    inputs: [
      { id: 'sqftArea', label: 'Field Total Spans (Sq Ft)', type: 'number', defaultValue: 21780, min: 100 },
      { id: 'evapoInches', label: 'Daily Water Demand Depth (Inches)', type: 'number', defaultValue: 0.15, min: 0.01, max: 2.0, step: 0.01 }
    ],
    faq: [
      { question: 'What is plant Evapotranspiration?', answer: 'Evapotranspiration models combined soils evaporation and plant leaf transpiration water vapor releases into local atmospheres daily.' }
    ],
    relatedSlugs: ['crop-planning', 'fertilizer-calculator'],
    seoTitle: 'Daily Field Crop Water Irrigation Sizer',
    seoDescription: 'Determine total daily gallon volumes required to water plant fields by tracking transpiration depth metrics.',
    calculate: (inputs) => {
      const area = Number(inputs.sqftArea || 21780);
      const evap = Number(inputs.evapoInches || 0.15);
      const cuFt = area * (evap / 12);
      const gals = cuFt * 7.48052; // Gallons per cubic foot
      return {
        results: [
          { label: 'Required daily Irrigation Volume', value: Math.ceil(gals).toLocaleString() + ' Gallons/day', isPrimary: true },
          { label: 'Liters Equivalent Volume', value: Math.ceil(gals * 3.78541).toLocaleString() + ' Liters/day' }
        ],
        chartData: [
          { name: 'Irrigated Area', value: area / 100 }
        ]
      };
    }
  },
  {
    id: 'fertilizer-calculator',
    name: 'Fertilizer N-P-K Blend Calculator',
    slug: 'fertilizer',
    category: 'agriculture',
    description: 'Calculate precise N-P-K (Nitrogen, Phosphorus, Potassium) elemental weights needed to meet soil deficiencies.',
    formula: 'Required Bag Weight = Targeted Nutrient Weight / Percentage Ratio in Bag',
    explanation: 'Converts target soil nitrogen deficits into commercial fertilizer bag buying structures.',
    example: 'To supply 2 lbs of pure Nitrogen using a standard 10-10-10 fertilizer bag requires purchasing exactly 20 lbs of product.',
    inputs: [
      { id: 'targetNutrient', label: 'Target Nutrient Quantity Required (lbs)', type: 'number', defaultValue: 5, min: 0.5 },
      { id: 'nutrientFocus', label: 'Nutrient element being corrected', type: 'select', defaultValue: 'n', options: [
        { label: 'Nitrogen (N) - Leaf and stem structure', value: 'n' },
        { label: 'Phosphorus (P) - Core root development', value: 'p' },
        { label: 'Potassium (K) - General plant vigor', value: 'k' }
      ]},
      { id: 'bagRatio', label: 'Bag Content N-P-K Ratios (%)', type: 'select', defaultValue: 10, options: [
        { label: 'Balanced general soil food (10-10-10)', value: 10 },
        { label: 'High concentrated lawn food (20-10-10)', value: 20 },
        { label: 'High organic compost mix (5-5-5)', value: 5 }
      ]}
    ],
    faq: [
      { question: 'What do the three numbers on a fertilizer bag represent?', answer: 'The numbers indicate the percent concentration of Nitrogen (N), Phosphate (P2O5), and Potash (K2O), in that order.' }
    ],
    relatedSlugs: ['crop-planning', 'irrigation'],
    seoTitle: 'Fertilizer Soil Nutrient NPK Blend Sizer',
    seoDescription: 'Calculate the physical weight of blended fertilizer bags needed to reach precise soil NPK replenishment scores.',
    calculate: (inputs) => {
      const target = Number(inputs.targetNutrient || 5);
      const percentVal = Number(inputs.bagRatio || 10) / 100;
      const bagWeight = target / percentVal;
      return {
        results: [
          { label: 'Fertilizer product Weight Required', value: bagWeight.toFixed(1) + ' lbs', isPrimary: true },
          { label: 'Active elemental portion', value: target + ' lbs' },
          { label: 'Sand and Filler base material', value: (bagWeight - target).toFixed(1) + ' lbs' }
        ],
        chartData: [
          { name: 'Active Nutrient', value: target },
          { name: 'Filler Base', value: bagWeight - target }
        ]
      };
    }
  },
  {
    id: 'yield-calculator',
    name: 'Crop Yield Potential Calculator',
    slug: 'yield',
    category: 'agriculture',
    description: 'Predict aggregate seasonal crop harvest weights using cultivation area indexes and typical density ratios.',
    formula: 'Yield Weight = Planting Area Sqft * Average Crop yield per Sqft',
    explanation: 'Helps farmers forecast historical agricultural output bins ahead of seasonal wholesale distributions.',
    example: 'Cultivating 15,000 sq ft of tomatoes averaging 0.8 lbs per square foot outputs a 12,000 lb wholesale shipment.',
    inputs: [
      { id: 'areaSqft', label: 'Plantation Area (Sq Ft)', type: 'number', defaultValue: 10000, min: 10 },
      { id: 'cropYieldPreset', label: 'Typical Crop Yield Density (lbs/sqft)', type: 'select', defaultValue: 0.6, options: [
        { label: 'Specialty Leafy Greens / Lettuce (~0.4 lbs/sqft)', value: 0.4 },
        { label: 'Summer Tomatoes / Peppers (~0.8 lbs/sqft)', value: 0.8 },
        { label: 'Organic Potatoes / Root crops (~0.5 lbs/sqft)', value: 0.5 },
        { label: 'Sweet Corn ears (~0.3 lbs/sqft)', value: 0.3 }
      ]}
    ],
    faq: [
      { question: 'How can crop density be elevated?', answer: 'Deploy raised trellis networks, drip lines, continuous soil moisture audits, and structural organic crop rotation schedules.' }
    ],
    relatedSlugs: ['crop-planning', 'farm-budget'],
    seoTitle: 'Agricultural Crop Harvest Mass Weight Calculator',
    seoDescription: 'Model prospective farm harvest volumes by matching plantation sizes with typical historical yield densities.',
    calculate: (inputs) => {
      const area = Number(inputs.areaSqft || 10000);
      const yd = Number(inputs.cropYieldPreset || 0.6);
      const lbs = area * yd;
      return {
        results: [
          { label: 'Forecast Harvest Volume', value: lbs.toLocaleString() + ' lbs', isPrimary: true },
          { label: 'Harvest Weight in Metric Tons', value: (lbs * 0.000453592).toFixed(2) + ' Tons' }
        ],
        chartData: [
          { name: 'Harvest Yield', value: lbs }
        ]
      };
    }
  },

  // ====================================== FOOD & CULINARY ======================================
  {
    id: 'recipe-scaling',
    name: 'Recipe Portion Scaling Calculator',
    slug: 'recipe-scaling',
    category: 'food',
    description: 'Scale recipe portions up or down while preserving ingredient bakers percentages.',
    formula: 'Scaled Weight = Original Weight * (Target Servings / Original Servings)',
    explanation: 'Adapts standard kitchen recipes for banquet sizes or restaurant menus without altering seasoning balances.',
    example: 'Scaling a recipe built for 4 portions up to 25 portions multiplies every ingredient by 6.25.',
    inputs: [
      { id: 'ingName', label: 'Primary Test Ingredient Weight (g)', type: 'number', defaultValue: 400, min: 1 },
      { id: 'origServings', label: 'Original Portion Yield Count', type: 'number', defaultValue: 4, min: 1 },
      { id: 'targetServings', label: 'Target Portion Yield Count', type: 'number', defaultValue: 12, min: 1 }
    ],
    faq: [
      { question: 'Why scale doughs using Bakers Percentages?', answer: 'Doughs rely on flour hydration ratios (e.g. 70% water). Bakers percentages treat flour as a constant 100%, allowing scalable water weights.' }
    ],
    relatedSlugs: ['food-cost', 'nutrition-cost'],
    seoTitle: 'Culinary Serving Yield scaling calculator',
    seoDescription: 'Scale baker percentages and portion sizing weights instantly when hosting banquets or commercial restaurant nights.',
    calculate: (inputs) => {
      const origW = Number(inputs.ingName || 400);
      const fromS = Number(inputs.origServings || 4);
      const toS = Number(inputs.targetServings || 12);
      
      const multiplier = toS / fromS;
      const finalW = origW * multiplier;
      return {
        results: [
          { label: 'Scaled Ingredient Weight', value: finalW.toLocaleString() + ' g', isPrimary: true },
          { label: 'Recipe scaling multiplier', value: multiplier.toFixed(2) + 'x force' }
        ],
        chartData: [
          { name: 'Original', value: origW },
          { name: 'Scaled', value: finalW }
        ]
      };
    }
  },
  {
    id: 'food-cost',
    name: 'Recipe Ingredient Sizing margin Calculator',
    slug: 'food-cost',
    category: 'food',
    description: 'Analyze wholesale recipe ingredient prices to establish serving margins and recommended menu prices.',
    formula: 'Menu Cost = Portional Cost / Target Food Cost Percentage (typically 28-35%)',
    explanation: 'Quantifies plate cost structures to prevent restaurant margin bleed, matching wholesale outlays on meats and spices.',
    example: 'A single steak plate costing $4.50 in ingredients, budgeted at a 30% crop cost tier, should retail for $15.00.',
    inputs: [
      { id: 'bulkCost', label: 'Bulk Wholesale Ingredient Cost ($)', type: 'number', defaultValue: 45, min: 1 },
      { id: 'servingsBulk', label: 'Portions Extracted From Bulk Pack', type: 'number', defaultValue: 12, min: 1 },
      { id: 'targetPct', label: 'Target Food Cost Level (%)', type: 'select', defaultValue: 30, options: [
        { label: 'Fine Dining Gourmet Premium (25% food cost)', value: 25 },
        { label: 'Standard Casual Restaurant (30% food cost)', value: 30 },
        { label: 'High volume canteen buffet (35% food cost)', value: 35 }
      ]}
    ],
    faq: [
      { question: 'What is a typical restaurant food cost percentage?', answer: 'Healthy commercial kitchens keep food costs tightly between 28% and 32% of retail price, covering other staff and rent overheads.' }
    ],
    relatedSlugs: ['recipe-scaling', 'restaurant-profit'],
    seoTitle: 'Commercial Restaurant Plate Cost Margin Calculator',
    seoDescription: 'Price your menu options by analyzing wholesale ingredient costs against target profit margins.',
    calculate: (inputs) => {
      const bulk = Number(inputs.bulkCost || 45);
      const serv = Number(inputs.servingsBulk || 12);
      const target = Number(inputs.targetPct || 30) / 100;
      
      const costPerServing = bulk / serv;
      const retailRec = costPerServing / target;
      const plateProfit = retailRec - costPerServing;
      return {
        results: [
          { label: 'Recommended Selling Price', value: '$' + retailRec.toFixed(2), isPrimary: true },
          { label: 'Raw Cost per Portion', value: '$' + costPerServing.toFixed(2) },
          { label: 'Single plate Net profit', value: '$' + plateProfit.toFixed(2) }
        ],
        chartData: [
          { name: 'Plate Cost', value: costPerServing },
          { name: 'Menu Margin Profit', value: plateProfit }
        ]
      };
    }
  },
  {
    id: 'nutrition-cost',
    name: 'Macronutrient Cost Sizer',
    slug: 'nutrition-cost',
    category: 'food',
    description: 'Determine price efficiency across foods by sizing raw cost-per-gram ratios for proteins or healthy fats.',
    formula: 'Cost Per Gram of Protein = (Package retail Cost / (Mass of Package * Protein concentration))',
    explanation: 'Sizes dynamic protein purchasing, highlighting if eggs, chicken thighs, or powdered supplements provide maximum nutrients per dollar spent.',
    example: 'A 2 kg chicken breast carton costing $14.50 containing 480g of protein returns a cost of $0.03 per gram of pure protein.',
    inputs: [
      { id: 'foodPrice', label: 'Retail Package Price ($)', type: 'number', defaultValue: 15.00, min: 0.1 },
      { id: 'packageMass', label: 'Package Total Weight (grams)', type: 'number', defaultValue: 1000, min: 10 },
      { id: 'proteinDensity', label: 'Nutrient Density per 100 grams (g)', type: 'number', defaultValue: 24, min: 1, max: 100 }
    ],
    faq: [
      { question: 'Which foods offer cheap protein?', answer: 'Canned tuna, chicken eggs, dry lentils, and whey isolate powders consistently yield optimal nutrient density scores.' }
    ],
    relatedSlugs: ['recipe-scaling', 'food-cost'],
    seoTitle: 'Protein Dollar Cost Sizer & Density Calculator',
    seoDescription: 'Calculate and compare cost-per-gram metrics for proteins in grocery items to maximize nutritional value.',
    calculate: (inputs) => {
      const price = Number(inputs.foodPrice || 15.00);
      const mass = Number(inputs.packageMass || 1000);
      const density = Number(inputs.proteinDensity || 24);
      
      const totalNutrientGrams = (mass / 100) * density;
      const costPerGram = price / totalNutrientGrams;
      return {
        results: [
          { label: 'Cost Per Gram of Nutrient', value: '$' + costPerGram.toFixed(3), isPrimary: true },
          { label: 'Total Nutrient in Pack', value: totalNutrientGrams.toFixed(0) + ' g' },
          { label: 'Protein weight percentage', value: density + '%' }
        ],
        chartData: [
          { name: 'Pure nutrients cost proportion', value: totalNutrientGrams * costPerGram },
          { name: 'General food moisture/carbs weight', value: mass - totalNutrientGrams }
        ]
      };
    }
  },
  {
    id: 'restaurant-profit',
    name: 'Restaurant Profit Calculator',
    slug: 'restaurant-profit',
    category: 'food',
    description: 'Calculate restaurant food costs, labor overhead, and daily table turn profitability thresholds.',
    formula: 'Daily Profit = (Table Count * Turnover Rate * Bill Average) - Daily Rent - Staff Wages - Food Outlay',
    explanation: 'Exposes financial parameters tracking operational costs against busy table flows inside commercial restaurants.',
    example: 'Operating 20 tables returning 3 turnover loops daily with a $45 ticket average generates $2,700 gross revenues.',
    inputs: [
      { id: 'tables', label: 'Physical Table Count in Dining Room', type: 'number', defaultValue: 15, min: 1 },
      { id: 'tableTurn', label: 'Average Daily Table Turnover loop', type: 'number', defaultValue: 2.5, min: 0.5, step: 0.1 },
      { id: 'avgTicket', label: 'Average Ticket Spend Value ($)', type: 'number', defaultValue: 55, min: 5 },
      { id: 'laborRentDaily', label: 'Daily Staff Labor & Building Rent ($)', type: 'number', defaultValue: 1200, min: 100, step: 50 }
    ],
    faq: [
      { question: 'What is Table Turnover?', answer: 'Table Turnover measures how many times a single table gets cleared and re-seated with new paying guests during a single business day.' }
    ],
    relatedSlugs: ['food-cost', 'recipe-scaling'],
    seoTitle: 'Daily Dining Room Table Turnover Profit Planner',
    seoDescription: 'Measure daily dining revenues and profit thresholds by modeling cover average tickets and table loop turnovers.',
    calculate: (inputs) => {
      const tab = Number(inputs.tables || 15);
      const turn = Number(inputs.tableTurn || 2.5);
      const tick = Number(inputs.avgTicket || 55);
      const opex = Number(inputs.laborRentDaily || 1200);
      
      const grossIncome = tab * turn * tick;
      const foodCosts = grossIncome * 0.3; // assume 30% standard food cost
      const netDailyProfit = grossIncome - opex - foodCosts;
      return {
        results: [
          { label: 'Projected Daily Net Profit', value: '$' + Math.round(netDailyProfit).toLocaleString(), isPrimary: true },
          { label: 'Daily Gross Sales Income', value: '$' + Math.round(grossIncome).toLocaleString() },
          { label: 'Food Costs Outlay (30% assumption)', value: '$' + Math.round(foodCosts).toLocaleString() }
        ],
        chartData: [
          { name: 'Dinner Sales', value: grossIncome },
          { name: 'Ingredients', value: foodCosts },
          { name: 'Wages/Rent', value: opex }
        ]
      };
    }
  }
];
