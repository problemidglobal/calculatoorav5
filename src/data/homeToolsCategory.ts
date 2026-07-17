import { Calculator } from '../types';

export const HOME_TOOLS_CALCULATORS: Calculator[] = [
  {
    id: 'home-paint',
    name: 'Room Wall Paint Calculator',
    slug: 'paint-calc',
    category: 'home-tools',
    description: 'Calculate gallons of paint needed to coat rooms based on wall sizes, windows, and doors.',
    seoTitle: 'Room Wall Paint Volume Solver | Calculatoora',
    seoDescription: 'Accurately calculate required paint gallons based on room dimensions, doors, windows, and planned coats.',
    inputs: [
      { id: 'width', label: 'Room Width (Feet)', type: 'number', defaultValue: 14 },
      { id: 'length', label: 'Room Length (Feet)', type: 'number', defaultValue: 16 },
      { id: 'height', label: 'Wall Height (Feet)', type: 'number', defaultValue: 8 },
      { id: 'coats', label: 'Number of Paint Coats', type: 'number', defaultValue: 2 },
      { id: 'doors', label: 'Number of Doors to exclude', type: 'number', defaultValue: 1 },
      { id: 'windows', label: 'Number of Windows to exclude', type: 'number', defaultValue: 2 }
    ],
    formula: 'Surface = 2*(Width + Length)*Height - Doors*21 - Windows*15; Gallons = (Surface * Coats) / 350',
    explanation: 'Calculating wall square footage is key to buying the right amount of paint, saving money and reducing waste.',
    example: 'A 14x16 room with 8-foot walls, 1 door, and 2 windows requires approximately 2.37 gallons of paint for 2 coats.',
    faq: [
      { question: 'How much area does one gallon of paint cover?', answer: 'One standard gallon of wall paint generally covers approximately 350 square feet of smooth wall space.' }
    ],
    relatedSlugs: ['room-area', 'flooring-calc'],
    calculate: (inputs) => {
      const w = Number(inputs.width || 14);
      const l = Number(inputs.length || 16);
      const h = Number(inputs.height || 8);
      const coats = Number(inputs.coats || 2);
      const d = Number(inputs.doors || 1);
      const win = Number(inputs.windows || 2);

      const wallArea = 2 * (w + l) * h;
      const doorDeduct = d * 21; // 21 sq ft average for standards doors
      const windowDeduct = win * 15; // 15 sq ft average for standard windows
      
      const netArea = Math.max(0, wallArea - doorDeduct - windowDeduct);
      const totalSqFt = netArea * coats;
      const gallonsNeeded = totalSqFt / 350; // standard paint coverage

      return {
        results: [
          { label: 'Required Paint volume', value: `${gallonsNeeded.toFixed(2)} Gallons`, isPrimary: true },
          { label: 'Wall Surface Area (net)', value: `${netArea.toFixed(0)} sq ft` },
          { label: 'Total Painted surface area', value: `${totalSqFt.toFixed(0)} sq ft` }
        ]
      };
    }
  },
  {
    id: 'home-flooring',
    name: 'Hardwood & Carpet Flooring Estimator',
    slug: 'flooring-calc',
    category: 'home-tools',
    description: 'Calculate the volume of carpet or hardwood flooring needed for rooms, factoring in standard waste margins.',
    seoTitle: 'Flooring Yards & Hardwood Estimator | Calculatoora',
    seoDescription: 'Input room measurements and waste buffers to calculate required flooring boards or carpet yards.',
    inputs: [
      { id: 'w', label: 'Room Width (Feet)', type: 'number', defaultValue: 12 },
      { id: 'l', label: 'Room Length (Feet)', type: 'number', defaultValue: 15 },
      { id: 'waste', label: 'Waste Buffer Allowance (%)', type: 'range', defaultValue: 10, min: 0, max: 20, step: 1 }
    ],
    formula: 'Area = Width * Length; Required = Area * (1 + Waste / 100)',
    explanation: 'Installing flooring requires cutting boards or rolls to fit. Adding a 10% waste buffer ensures you have enough material to complete the job.',
    example: 'A 12x15 room requires 180 sq ft of flooring. Adding a 10% waste buffer increases the purchase estimate to 198 sq ft.',
    faq: [
      { question: 'Why plan for waste?', answer: 'Cutting material to fit corners, doorways, and diagonal layouts creates unusable offcuts, requiring an extra buffer.' }
    ],
    relatedSlugs: ['room-area', 'tile-calc'],
    calculate: (inputs) => {
      const w = Number(inputs.w || 12);
      const l = Number(inputs.l || 15);
      const waste = Number(inputs.waste || 10) / 100;

      const area = w * l;
      const total = area * (1 + waste);
      const sqYards = total / 9; // 9 sq ft per square yard (standard carpet)

      return {
        results: [
          { label: 'Required Flooring Material', value: `${total.toFixed(1)} sq ft`, isPrimary: true },
          { label: 'Base Room Area', value: `${area.toFixed(1)} sq ft` },
          { label: 'Carpet Equivalent yards', value: `${sqYards.toFixed(1)} sq yds` }
        ],
        chartData: [
          { name: 'Room Floor space', value: area, color: '#39FF14' },
          { name: 'Offcut Waste', value: total - area, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'home-tile',
    name: 'Wall & Floor Tile Calculator',
    slug: 'tile-calc',
    category: 'home-tools',
    description: 'Calculate the number of tiles needed to cover a floor or wall based on tile size and grout lines.',
    seoTitle: 'Tile Coverage and Spacing Solver | Calculatoora',
    seoDescription: 'Obtain precise tile quantities and box estimates based on wall surfaces, tile inches, and layout grout widths.',
    inputs: [
      { id: 'wFeets', label: 'Area Width (Feet)', type: 'number', defaultValue: 10 },
      { id: 'lFeets', label: 'Area Length (Feet)', type: 'number', defaultValue: 12 },
      { id: 'tileInW', label: 'Tile Width (Inches)', type: 'number', defaultValue: 12 },
      { id: 'tileInL', label: 'Tile Length (Inches)', type: 'number', defaultValue: 12 },
      { id: 'groutIn', label: 'Grout Joint Width (Inches)', type: 'number', defaultValue: 0.125 },
      { id: 'waste', label: 'Waste Buffer (%)', type: 'range', defaultValue: 10, min: 0, max: 20, step: 5 }
    ],
    formula: 'TileArea = (TileW + Grout) * (TileL + Grout) / 144; TilesCount = FloorArea / TileArea * (1 + Waste/100)',
    explanation: 'Calculating tile layouts helps you buy the right amount of material and avoid mid-project delays.',
    example: 'Tiling a 10x12 floor with 12x12 inch tiles and 1/8 inch grout joints requires approximately 132 tiles, including a 10% waste buffer.',
    faq: [
      { question: 'How wide should grout lines be?', answer: 'Standard grout joint widths are 1/16 to 1/8 inch for wall tiles and 1/8 to 1/4 inch for floor tiles.' }
    ],
    relatedSlugs: ['flooring-calc', 'room-area'],
    calculate: (inputs) => {
      const w = Number(inputs.wFeets || 10);
      const l = Number(inputs.lFeets || 12);
      const tw = Number(inputs.tileInW || 12);
      const tl = Number(inputs.tileInL || 12);
      const grout = Number(inputs.groutIn || 0.125);
      const waste = Number(inputs.waste || 10) / 100;

      const floorSqIn = w * 12 * (l * 12);
      const singleTileSqIn = (tw + grout) * (tl + grout);
      
      const tilesBase = floorSqIn / singleTileSqIn;
      const totalTiles = Math.ceil(tilesBase * (1 + waste));

      return {
        results: [
          { label: 'Projected Tiles Count', value: `${totalTiles} Tiles`, isPrimary: true },
          { label: 'Overall Tiled Area', value: `${w * l} sq ft` },
          { label: 'Single Tile Surface', value: `${((tw * tl) / 144).toFixed(3)} sq ft` }
        ]
      };
    }
  },
  {
    id: 'home-room-area',
    name: 'Room Area & Volume Solver',
    slug: 'room-area',
    category: 'home-tools',
    description: 'Calculate room square footage, perimeter, and cubic volume for HVAC or renovation planning.',
    seoTitle: 'Room Surface Area & Volume Calculator | Calculatoora',
    seoDescription: 'Find room perimeters, square footage, and cubic volume based on wall lengths and ceiling heights.',
    inputs: [
      { id: 'width', label: 'Room Width (Feet)', type: 'number', defaultValue: 14 },
      { id: 'length', label: 'Room Length (Feet)', type: 'number', defaultValue: 18 },
      { id: 'height', label: 'Ceiling Height (Feet)', type: 'number', defaultValue: 9 }
    ],
    formula: 'Area = W * L; Perimeter = 2*(W + L); Volume = W * L * H',
    explanation: 'Calculating room volume (cubic feet) is essential for selecting the right HVAC systems and air purifiers.',
    example: 'A 14x18 room with 9-foot ceilings has a 252 sq ft floor area, a 64-foot perimeter, and 2,268 cubic feet of volume.',
    faq: [
      { question: 'Why does ceiling height affect HVAC needs?', answer: 'Higher ceilings increase room volume, requiring more heating or cooling capacity to maintain comfortable temperatures.' }
    ],
    relatedSlugs: ['paint-calc', 'flooring-calc'],
    calculate: (inputs) => {
      const w = Number(inputs.width || 14);
      const l = Number(inputs.length || 18);
      const h = Number(inputs.height || 9);

      const area = w * l;
      const perimeter = 2 * (w + l);
      const volume = w * l * h;

      return {
        results: [
          { label: 'Floor Area Surface', value: `${area} sq ft`, isPrimary: true },
          { label: 'Room Volume space', value: `${volume.toLocaleString()} cu ft` },
          { label: 'Wall Perimeter', value: `${perimeter} ft` }
        ]
      };
    }
  },
  {
    id: 'home-furniture-space',
    name: 'Furniture Spacing Clearances',
    slug: 'furniture-space-calc',
    category: 'home-tools',
    description: 'Calculate recommended walking clearance distances around couches, dining tables, and beds.',
    seoTitle: 'Room Furniture Clearance Solver | Calculatoora',
    seoDescription: 'Plan room furniture placements using standard walking flow clearance recommendations.',
    inputs: [
      { id: 'hallType', label: 'Target Room Scenario', type: 'select', defaultValue: 'dining', options: [
        { label: 'Dining Room Table clearances', value: 'dining' },
        { label: 'Living Room Coffee Table flow', value: 'living' },
        { label: 'Bedroom spacing around beds', value: 'bed' }
      ]},
      { id: 'furnWidth', label: 'Furniture width/diameter (Inches)', type: 'number', defaultValue: 42 }
    ],
    formula: 'Requires standard walking clearances (typically 18 to 36 inches from walls).',
    explanation: 'Planning walking paths around furniture keeps rooms functional and prevents tight, cluttered layouts.',
    example: 'Setting up a 42-inch dining table requires at least 32 inches of clearance on all sides to allow chairs to pull out comfortably.',
    faq: [
      { question: 'What is the minimum walking pathway width?', answer: 'For comfortable daily flow, keep major walking paths at least 30 to 36 inches wide.' }
    ],
    relatedSlugs: ['room-area', 'paint-calc'],
    calculate: (inputs) => {
      const scenario = inputs.hallType || 'dining';
      const size = Number(inputs.furnWidth || 42);

      let pathway = '30 - 36 inches';
      let info = 'Allows pulling out chairs and walking behind seated guests comfortably.';
      
      if (scenario === 'living') {
        pathway = '14 - 18 inches';
        info = 'Keeps the coffee table within easy reach of the couch while allowing walking space.';
      } else if (scenario === 'bed') {
        pathway = '24 - 30 inches';
        info = 'Provides walking space between beds, closets, and adjacent walls.';
      }

      return {
        results: [
          { label: 'Recommended Clearance Pathway', value: pathway, isPrimary: true },
          { label: 'Minimum Room Footprint Needed', value: `${size + 60} inches wide` },
          { label: 'Interior Design Advice', value: info }
        ]
      };
    }
  },
  {
    id: 'home-garden-mulch',
    name: 'Garden Soil & Mulch Calculator',
    slug: 'garden-mulch-calc',
    category: 'home-tools',
    description: 'Calculate the volume of soil or mulch cubic yards needed to cover garden beds.",',
    seoTitle: 'Garden Soil & Mulch Volume Solver | Calculatoora',
    seoDescription: 'Find cubic yards of soil or mulch needed for garden beds based on dimensions and depth.',
    inputs: [
      { id: 'wFt', label: 'Garden Bed Width (Feet)', type: 'number', defaultValue: 6 },
      { id: 'lFt', label: 'Garden Bed Length (Feet)', type: 'number', defaultValue: 20 },
      { id: 'depthIn', label: 'Desired Depth (Inches)', type: 'number', defaultValue: 3 }
    ],
    formula: 'Cubic Yards = (Width * Length * (Depth / 12)) / 27',
    explanation: 'Calculating mulch or soil bulk volume helps gardeners purchase the right weight or bag count for landscaping projects.',
    example: 'A 6x20 foot garden bed with a 3-inch layer of mulch requires approximately 1.11 cubic yards of material.',
    faq: [
      { question: 'What is the optimal mulch depth?', answer: 'A 2 to 3-inch layer of mulch is optimal for weed suppression and moisture retention. Deeper layers can suffocate plant roots.' }
    ],
    relatedSlugs: ['room-area', 'concrete-volume-calc'],
    calculate: (inputs) => {
      const w = Number(inputs.wFt || 6);
      const l = Number(inputs.lFt || 20);
      const d = Number(inputs.depthIn || 3);

      const cubicFeet = w * l * (d / 12);
      const cubicYards = cubicFeet / 27; // 27 cubic feet per cubic yard

      const bags2cf = cubicFeet / 2; // standard 2 cubic foot retail bag

      return {
        results: [
          { label: 'Required Bulk Mulch Volume', value: `${cubicYards.toFixed(2)} Cubic Yards`, isPrimary: true },
          { label: 'Combined Cubic Feet', value: `${cubicFeet.toFixed(1)} cu ft` },
          { label: 'Equivalent Retail Bags (2 cu ft)', value: `${Math.ceil(bags2cf)} Bags` }
        ]
      };
    }
  },
  {
    id: 'home-concrete-volume',
    name: 'Concrete Slab Slab Calculator',
    slug: 'concrete-volume-calc',
    category: 'home-tools',
    description: 'Calculate required cubic yards of concrete mix to pour slabs, patios, and footings.',
    seoTitle: 'Concrete Slab Volume Solver | Calculatoora',
    seoDescription: 'Input target length, width, and thickness to calculate required bulk concrete cubic yards and bag count.',
    inputs: [
      { id: 'w', label: 'Slab Width (Feet)', type: 'number', defaultValue: 10 },
      { id: 'l', label: 'Slab Length (Feet)', type: 'number', defaultValue: 12 },
      { id: 'thick', label: 'Slab Thickness (Inches)', type: 'number', defaultValue: 4 },
      { id: 'bagSize', label: 'Target Bag Size (Pounds)', type: 'select', defaultValue: '80', options: [
        { label: '60 lb bag (0.45 cu ft coverage)', value: '60' },
        { label: '80 lb bag (0.60 cu ft coverage)', value: '80' }
      ]}
    ],
    formula: 'Cubic Yards = (Width * Length * (Thickness / 12)) / 27',
    explanation: 'Concrete projects require precise calculations to buy the correct volume of ready-mix concrete or dry bags.',
    example: 'A 10x12 foot patio slab with a 4-inch concrete thickness requires approximately 1.48 cubic yards of concrete or sixty-seven 80-pound bags.',
    faq: [
      { question: 'Should I add an extra safety margin to concrete estimates?', answer: 'Yes, adding a 5% to 10% safety margin covers spillage, unlevel terrain, and settling during the pour.' }
    ],
    relatedSlugs: ['garden-mulch-calc', 'room-area'],
    calculate: (inputs) => {
      const w = Number(inputs.w || 10);
      const l = Number(inputs.l || 12);
      const t = Number(inputs.thick || 4);
      const sizeBags = inputs.bagSize || '80';

      const cuFt = w * l * (t / 12);
      const cuYards = cuFt / 27;

      let coveragePerBag = 0.6; // 80lb standard
      if (sizeBags === '60') coveragePerBag = 0.45;

      const bagsTotal = Math.ceil(cuFt / coveragePerBag);

      return {
        results: [
          { label: 'Required Bulk Volume', value: `${cuYards.toFixed(2)} Cubic Yards`, isPrimary: true },
          { label: 'Required dry Mix bags count', value: `${bagsTotal} Bags (${sizeBags} lbs each)` },
          { label: 'Cubic Feet volume', value: `${cuFt.toFixed(1)} cu ft` }
        ]
      };
    }
  }
];
