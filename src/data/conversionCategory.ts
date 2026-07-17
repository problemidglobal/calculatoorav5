import { Calculator } from '../types';

export const CONVERSION_CALCULATORS: Calculator[] = [
  {
    id: 'conv-length',
    name: 'Universal Length Converter',
    slug: 'length-converter',
    category: 'conversion',
    description: 'Convert length measurements between Metric (mm, cm, m, km) and Imperial (in, ft, yd, mi) units.',
    seoTitle: 'Universal Length Unit Converter | Calculatoora',
    seoDescription: 'Convert length units including meters, miles, inches, yards, and feet with standard scalar conversions.',
    inputs: [
      { id: 'lengthVal', label: 'Enter Length Value', type: 'number', defaultValue: 10 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'm', options: [
        { label: 'Millimeters (mm)', value: 'mm' },
        { label: 'Centimeters (cm)', value: 'cm' },
        { label: 'Meters (m)', value: 'm' },
        { label: 'Kilometers (km)', value: 'km' },
        { label: 'Inches (in)', value: 'in' },
        { label: 'Feet (ft)', value: 'ft' },
        { label: 'Yards (yd)', value: 'yd' },
        { label: 'Miles (mi)', value: 'mi' }
      ]}
    ],
    formula: 'Conversions use standard metric multipliers (e.g. 1 inch = 25.4 mm).',
    explanation: 'Converting length units is essential for construction, design, and travel across metric and imperial systems.',
    example: 'A value of 10 Meters converts to exactly 32.81 Feet or 393.70 Inches.',
    faq: [
      { question: 'What is the precise conversion ratio for inches to cm?', answer: 'One inch is defined as exactly 2.54 centimeters.' }
    ],
    relatedSlugs: ['area-converter-tool', 'volume-converter-tool'],
    calculate: (inputs) => {
      const val = Number(inputs.lengthVal || 10);
      const from = inputs.fromUnit || 'm';

      // base representation in meters
      let m = val;
      if (from === 'mm') m = val / 1000;
      else if (from === 'cm') m = val / 100;
      else if (from === 'km') m = val * 1000;
      else if (from === 'in') m = val * 0.0254;
      else if (from === 'ft') m = val * 0.3048;
      else if (from === 'yd') m = val * 0.9144;
      else if (from === 'mi') m = val * 1609.344;

      const mm = m * 1000;
      const cm = m * 100;
      const km = m / 1000;
      const inchVal = m / 0.0254;
      const ft = m / 0.3048;
      const yd = m / 0.9144;
      const mi = m / 1609.344;

      return {
        results: [
          { label: 'Meters (m)', value: `${m.toFixed(4)} m`, isPrimary: true },
          { label: 'Kilometers (km)', value: `${km.toFixed(6)} km` },
          { label: 'Centimeters (cm)', value: `${cm.toFixed(2)} cm` },
          { label: 'Inches (in)', value: `${inchVal.toFixed(2)} in` },
          { label: 'Feet (ft)', value: `${ft.toFixed(2)} ft` },
          { label: 'Yards (yd)', value: `${yd.toFixed(2)} yd` },
          { label: 'Miles (mi)', value: `${mi.toFixed(6)} mi` }
        ]
      };
    }
  },
  {
    id: 'conv-weight',
    name: 'Universal Weight Converter',
    slug: 'weight-converter-tool',
    category: 'conversion',
    description: 'Convert weight and mass measurements between Megagrams, Kilograms, Grams, Pounds, Ounces, and Tons.',
    seoTitle: 'Universal Weight Mass Converter | Calculatoora',
    seoDescription: 'Convert mass units including grams, kilograms, pounds, ounces, and metric tons.',
    inputs: [
      { id: 'weightVal', label: 'Enter Weight Value', type: 'number', defaultValue: 15 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'kg', options: [
        { label: 'Grams (g)', value: 'g' },
        { label: 'Kilograms (kg)', value: 'kg' },
        { label: 'Pounds (lb)', value: 'lb' },
        { label: 'Ounces (oz)', value: 'oz' },
        { label: 'Tons US (t)', value: 'ton' }
      ]}
    ],
    formula: '1 kg = 2.20462 lb; 1 lb = 16 oz.',
    explanation: 'Converting weight units is vital for cooking, shipping, manufacturing, and scientific research.',
    example: 'An input value of 15 Kilograms converts to exactly 33.07 Pounds or 529.11 Ounces.',
    faq: [
      { question: 'What is the difference between mass and weight?', answer: 'Mass measures the amount of matter in an object, while weight is the force exerted on that mass by gravity.' }
    ],
    relatedSlugs: ['length-converter', 'volume-converter-tool'],
    calculate: (inputs) => {
      const val = Number(inputs.weightVal || 15);
      const from = inputs.fromUnit || 'kg';

      let kg = val;
      if (from === 'g') kg = val / 1000;
      else if (from === 'lb') kg = val * 0.45359237;
      else if (from === 'oz') kg = val * 0.02834952;
      else if (from === 'ton') kg = val * 907.18474;

      return {
        results: [
          { label: 'Kilograms (kg)', value: `${kg.toFixed(3)} kg`, isPrimary: true },
          { label: 'Grams (g)', value: `${(kg * 1000).toLocaleString()} g` },
          { label: 'Pounds (lb)', value: `${(kg / 0.45359237).toFixed(2)} lb` },
          { label: 'Ounces (oz)', value: `${(kg / 0.02834952).toFixed(2)} oz` }
        ]
      };
    }
  },
  {
    id: 'conv-temp',
    name: 'Temperature Scale Converter',
    slug: 'temperature-converter-tool',
    category: 'conversion',
    description: 'Convert temperatures between Fahrenheit, Celsius, and Kelvin scales.',
    seoTitle: 'Temperature Celsius Kelvin Fahrenheit Converter | Calculatoora',
    seoDescription: 'Perform rapid temperature scale conversions between Fahrenheit, Celsius, and Kelvin.',
    inputs: [
      { id: 'temp', label: 'Temperature Value', type: 'number', defaultValue: 25 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'C', options: [
        { label: 'Celsius (°C)', value: 'C' },
        { label: 'Fahrenheit (°F)', value: 'F' },
        { label: 'Kelvin (K)', value: 'K' }
      ]}
    ],
    formula: 'F = C * 1.8 + 32; K = C + 273.15',
    explanation: 'Converting temperature scales is essential for weather forecasting, science, cooking, and international manufacturing.',
    example: 'A temperature of 25°C converts to exactly 77°F or 298.15K.',
    faq: [
      { question: 'What is absolute zero?', answer: 'The lowest possible temperature limit (0 Kelvin, or -273.15°C), where physical atomic motion stops entirely.' }
    ],
    relatedSlugs: ['length-converter'],
    calculate: (inputs) => {
      const temp = Number(inputs.temp || 25);
      const from = inputs.fromUnit || 'C';

      let c = temp;
      if (from === 'F') c = (temp - 32) / 1.8;
      else if (from === 'K') c = temp - 273.15;

      const f = (c * 1.8) + 32;
      const k = c + 273.15;

      return {
        results: [
          { label: 'Celsius (°C)', value: `${c.toFixed(1)} °C`, isPrimary: true },
          { label: 'Fahrenheit (°F)', value: `${f.toFixed(1)} °F` },
          { label: 'Kelvin (K)', value: `${k.toFixed(2)} K` }
        ]
      };
    }
  },
  {
    id: 'conv-area',
    name: 'Universal Area Converter',
    slug: 'area-converter-tool',
    category: 'conversion',
    description: 'Convert surface area measurements between square meters, square feet, square yards, acres, and hectares.',
    seoTitle: 'Universal Area Unit Converter | Calculatoora',
    seoDescription: 'Convert area measurements between hectares, acres, square meters, yards, and square feet.',
    inputs: [
      { id: 'area', label: 'Enter Area Value', type: 'number', defaultValue: 100 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'sqkm', options: [
        { label: 'Square Meters (m²)', value: 'sqm' },
        { label: 'Square Kilometers (km²)', value: 'sqkm' },
        { label: 'Square Feet (ft²)', value: 'sqft' },
        { label: 'Square Yards (yd²)', value: 'sqyd' },
        { label: 'Acres', value: 'acre' },
        { label: 'Hectares (ha)', value: 'ha' }
      ]}
    ],
    formula: '1 Hectare = 10,000 m²; 1 Acre = 43,560 sq ft.',
    explanation: 'Converting area scales is vital for agriculture, real estate, land surveying, and urban planning.',
    example: 'A value of 100 Acres converts to approximately 40.46 Hectares or 4,356,000 Square Feet.',
    faq: [
      { question: 'What is a Hectare?', answer: 'A metric unit of area equal to a square with 100-meter sides (10,000 square meters), commonly used in land measurement.' }
    ],
    relatedSlugs: ['length-converter', 'volume-converter-tool'],
    calculate: (inputs) => {
      const val = Number(inputs.area || 100);
      const from = inputs.fromUnit || 'sqkm';

      // base sqm converter
      let sqm = val;
      if (from === 'sqkm') sqm = val * 1000000;
      else if (from === 'sqft') sqm = val * 0.09290304;
      else if (from === 'sqyd') sqm = val * 0.83612736;
      else if (from === 'acre') sqm = val * 4046.8564;
      else if (from === 'ha') sqm = val * 10000;

      const sqkm = sqm / 1000000;
      const sqft = sqm / 0.09290304;
      const sqyd = sqm / 0.83612736;
      const acre = sqm / 4046.8564;
      const ha = sqm / 10000;

      return {
        results: [
          { label: 'Square Meters (m²)', value: `${sqm.toLocaleString(undefined, { maximumFractionDigits: 1 })} sqm`, isPrimary: true },
          { label: 'Square Kilometers (km²)', value: `${sqkm.toFixed(6)} km²` },
          { label: 'Square Feet (ft²)', value: `${sqft.toLocaleString(undefined, { maximumFractionDigits: 1 })} sq ft` },
          { label: 'Square Yards (yd²)', value: `${sqyd.toFixed(2)} yd²` },
          { label: 'Acres', value: `${acre.toFixed(4)} Acres` },
          { label: 'Hectares (ha)', value: `${ha.toFixed(4)} ha` }
        ]
      };
    }
  },
  {
    id: 'conv-volume',
    name: 'Universal Volume Converter',
    slug: 'volume-converter-tool',
    category: 'conversion',
    description: 'Convert fluid volumes between Liters, Gallons, Quarts, Pints, Milliliters, and Cubic Feet.',
    seoTitle: 'Universal Fluid Volume Unit Converter | Calculatoora',
    seoDescription: 'Convert volume units including liters, gallons, pints, milliliters, and cubic feet.',
    inputs: [
      { id: 'volume', label: 'Enter Volume Value', type: 'number', defaultValue: 5 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'gal', options: [
        { label: 'Milliliters (ml)', value: 'ml' },
        { label: 'Liters (L)', value: 'l' },
        { label: 'Gallons US (gal)', value: 'gal' },
        { label: 'Quarts US (qt)', value: 'qt' },
        { label: 'Pints US (pt)', value: 'pt' },
        { label: 'Cubic Feet (cu ft)', value: 'cuft' }
      ]}
    ],
    formula: '1 Gallon = 3.78541 Liters; 1 Cubic Foot = 7.4805 Gallons.',
    explanation: 'Converting volume scales is vital for chemistry, fluid transport, shipping logistics, and cooking.',
    example: 'An input value of 5 Gallons US converts to approximately 18.92 Liters or 640 Fluid Ounces.',
    faq: [
      { question: 'Is a US gallon equal to a UK Imperial gallon?', answer: 'No. A US Gallon is 3.785 liters, while a UK Imperial Gallon is larger, holding exactly 4.546 liters.' }
    ],
    relatedSlugs: ['area-converter-tool', 'length-converter'],
    calculate: (inputs) => {
      const val = Number(inputs.volume || 5);
      const from = inputs.fromUnit || 'gal';

      // base liters
      let l = val;
      if (from === 'ml') l = val / 1000;
      else if (from === 'gal') l = val * 3.78541178;
      else if (from === 'qt') l = val * 0.946352946;
      else if (from === 'pt') l = val * 0.473176473;
      else if (from === 'cuft') l = val * 28.3168466;

      const ml = l * 1000;
      const gal = l / 3.78541178;
      const qt = l / 0.946352946;
      const pt = l / 0.473176473;
      const cuft = l / 28.3168466;

      return {
        results: [
          { label: 'Liters (L)', value: `${l.toFixed(3)} L`, isPrimary: true },
          { label: 'Milliliters (ml)', value: `${ml.toLocaleString(undefined, { maximumFractionDigits: 0 })} ml` },
          { label: 'Gallons (gal)', value: `${gal.toFixed(3)} gal` },
          { label: 'Quarts (qt)', value: `${qt.toFixed(2)} qt` },
          { label: 'Pints (pt)', value: `${pt.toFixed(2)} pt` },
          { label: 'Cubic Feet (cu ft)', value: `${cuft.toFixed(4)} cu ft` }
        ]
      };
    }
  },
  {
    id: 'conv-speed',
    name: 'Universal Speed Converter',
    slug: 'speed-converter-tool',
    category: 'conversion',
    description: 'Convert speeds between MPH, km/h, Knots, and Meters per Second.',
    seoTitle: 'Universal Speed Unit Converter | Calculatoora',
    seoDescription: 'Convert vehicle speeds between km/h, mph, knots, and meters per second.',
    inputs: [
      { id: 'speedVal', label: 'Enter Speed Value', type: 'number', defaultValue: 60 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'mph', options: [
        { label: 'Miles per hour (mph)', value: 'mph' },
        { label: 'Kilometers per hour (km/h)', value: 'kmh' },
        { label: 'Meters per second (m/s)', value: 'ms' },
        { label: 'Knots (kt)', value: 'kt' }
      ]}
    ],
    formula: '1 mph = 1.60934 km/h; 1 knot = 1.852 km/h.',
    explanation: 'Converting speed scales is essential for travel, physics, flight calculations, and maritime navigation.',
    example: 'An input value of 60 Miles per hour (mph) converts to 96.56 Kilometers per hour (km/h).',
    faq: [
      { question: 'What is a Knot?', answer: 'A unit of speed equal to one nautical mile per hour (approximately 1.151 mph), commonly used in aviation and maritime contexts.' }
    ],
    relatedSlugs: ['temperature-converter-tool', 'length-converter'],
    calculate: (inputs) => {
      const val = Number(inputs.speedVal || 60);
      const from = inputs.fromUnit || 'mph';

      let kmh = val;
      if (from === 'mph') kmh = val * 1.609344;
      else if (from === 'ms') kmh = val * 3.6;
      else if (from === 'kt') kmh = val * 1.852;

      const mph = kmh / 1.609344;
      const ms = kmh / 3.6;
      const kt = kmh / 1.852;

      return {
        results: [
          { label: 'Kilometers per hour (km/h)', value: `${kmh.toFixed(2)} km/h`, isPrimary: true },
          { label: 'Miles per hour (mph)', value: `${mph.toFixed(2)} mph` },
          { label: 'Meters per second (m/s)', value: `${ms.toFixed(2)} m/s` },
          { label: 'Knots (kt)', value: `${kt.toFixed(2)} knots` }
        ]
      };
    }
  },
  {
    id: 'conv-time',
    name: 'Universal Time Converter',
    slug: 'time-converter-tool',
    category: 'conversion',
    description: 'Convert intervals between Seconds, Minutes, Hours, Days, Weeks, Months, and Years.',
    seoTitle: 'Universal Time Interval Converter | Calculatoora',
    seoDescription: 'Convert time segments between hours, days, segments, minutes, and calendar years.',
    inputs: [
      { id: 'time', label: 'Enter Time Value', type: 'number', defaultValue: 72 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'h', options: [
        { label: 'Seconds (s)', value: 's' },
        { label: 'Minutes (m)', value: 'm' },
        { label: 'Hours (h)', value: 'h' },
        { label: 'Days (d)', value: 'd' },
        { label: 'Weeks (w)', value: 'w' }
      ]}
    ],
    formula: '1 Day = 24 Hours; 1 Hour = 60 Minutes = 3,600 Seconds.',
    explanation: 'Converting time intervals is standard for project planning, coding, astronomy, and physics calculations.',
    example: 'An input value of 72 Hours converts to exactly 3 Days or 4,320 Minutes.',
    faq: [
      { question: 'Why does a calendar year have 365.24 days?', answer: 'The fractional decimal day requires adding a leap year day every four years to keep our calendar aligned with Earth\'s orbit around the Sun.' }
    ],
    relatedSlugs: ['speed-converter-tool'],
    calculate: (inputs) => {
      const val = Number(inputs.time || 72);
      const from = inputs.fromUnit || 'h';

      // base in seconds
      let s = val;
      if (from === 'm') s = val * 60;
      else if (from === 'h') s = val * 3600;
      else if (from === 'd') s = val * 86400;
      else if (from === 'w') s = val * 604800;

      const ss = s;
      const min = s / 60;
      const hr = s / 3600;
      const day = s / 86400;
      const week = s / 604800;

      return {
        results: [
          { label: 'Hours (h)', value: `${hr.toFixed(2)} Hours`, isPrimary: true },
          { label: 'Days (d)', value: `${day.toFixed(2)} Days` },
          { label: 'Minutes (m)', value: `${min.toLocaleString(undefined, { maximumFractionDigits: 0 })} mins` },
          { label: 'Seconds (s)', value: `${ss.toLocaleString(undefined, { maximumFractionDigits: 0 })} seconds` },
          { label: 'Weeks (w)', value: `${week.toFixed(3)} weeks` }
        ]
      };
    }
  },
  {
    id: 'conv-data-storage',
    name: 'Data Storage Unit Converter',
    slug: 'data-storage-converter',
    category: 'conversion',
    description: 'Convert data units between Bytes, Kilobytes (KB), Megabytes (MB), Gigabytes (GB), and Terabytes (TB).',
    seoTitle: 'Digital Data Storage Unit Converter | Calculatoora',
    seoDescription: 'Convert digital storage measurements between Kilobytes, Megabytes, Gigabytes, and Terabytes using base-10 and base-2 scales.',
    inputs: [
      { id: 'dataVal', label: 'Enter Data Storage Value', type: 'number', defaultValue: 120 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'gb', options: [
        { label: 'Bytes (B)', value: 'b' },
        { label: 'Kilobytes (KB - 1,000 B)', value: 'kb' },
        { label: 'Megabytes (MB - 1,000 KB)', value: 'mb' },
        { label: 'Gigabytes (GB - 1,000 MB)', value: 'gb' },
        { label: 'Terabytes (TB - 1,000 GB)', value: 'tb' }
      ]},
      { id: 'format', label: 'Binary Standard (1,024 Base)', type: 'select', defaultValue: 'no', options: [
        { label: 'Decimal Base (1,000)', value: 'no' },
        { label: 'Binary Base (1,024)', value: 'yes' }
      ]}
    ],
    formula: 'Decimal: MB = GB * 1000; Binary: MB = GB * 1024',
    explanation: 'Converting data units is essential for calculating server disk space, bandwidth, and application bundle sizes.',
    example: 'An input value of 120 Gigabytes (Decimal) converts to 120,000 Megabytes, or 122,880 Megabytes using the Binary (1024) standard.',
    faq: [
      { question: 'What is the difference between decimal and binary data scales?', answer: 'Decimal scales use powers of 10 (1 KB = 1,000 Bytes, used by network providers), while binary scales use powers of 2 (1 KiB = 1,024 Bytes, used by operating systems).' }
    ],
    relatedSlugs: ['json-size-calc', 'xml-size-calc'],
    calculate: (inputs) => {
      const val = Number(inputs.dataVal || 120);
      const from = inputs.fromUnit || 'gb';
      const isBinary = inputs.format === 'yes';

      const base = isBinary ? 1024 : 1000;

      // Base: Bytes
      let bytes = val;
      if (from === 'kb') bytes = val * base;
      else if (from === 'mb') bytes = val * Math.pow(base, 2);
      else if (from === 'gb') bytes = val * Math.pow(base, 3);
      else if (from === 'tb') bytes = val * Math.pow(base, 4);

      const b = bytes;
      const kb = bytes / base;
      const mb = bytes / Math.pow(base, 2);
      const gb = bytes / Math.pow(base, 3);
      const tb = bytes / Math.pow(base, 4);

      return {
        results: [
          { label: 'Gigabytes (GB)', value: `${gb.toFixed(3)} GB`, isPrimary: true },
          { label: 'Megabytes (MB)', value: `${mb.toLocaleString(undefined, { maximumFractionDigits: 1 })} MB` },
          { label: 'Terabytes (TB)', value: `${tb.toFixed(5)} TB` },
          { label: 'Kilobytes (KB)', value: `${kb.toLocaleString(undefined, { maximumFractionDigits: 0 })} KB` },
          { label: 'Bytes (B)', value: `${b.toLocaleString(undefined, { maximumFractionDigits: 0 })} B` }
        ]
      };
    }
  },
  {
    id: 'conv-energy',
    name: 'Universal Energy Converter',
    slug: 'energy-converter-tool',
    category: 'conversion',
    description: 'Convert energy measurements between Joules, Kilojoules, Calories, Kilocalories, and Watt-hours.',
    seoTitle: 'Universal Energy Unit Converter | Calculatoora',
    seoDescription: 'Convert energy metrics between Joules, Kilocalories, Kilojoules, and electrical Watt-hours.',
    inputs: [
      { id: 'energy', label: 'Enter Energy Value', type: 'number', defaultValue: 1000 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'j', options: [
        { label: 'Joules (J)', value: 'j' },
        { label: 'Kilojoules (kJ)', value: 'kj' },
        { label: 'Calories (cal)', value: 'cal' },
        { label: 'Kilocalories (kcal / nutritional Cal)', value: 'kcal' },
        { label: 'Watt-Hours (Wh)', value: 'wh' }
      ]}
    ],
    formula: '1 calorie = 4.184 Joules; 1 Wh = 3600 Joules.',
    explanation: 'Converting energy scales is crucial for physics, chemistry, thermodynamics, nutrition, and electrical utility grid management.',
    example: 'An input value of 1,000 Joules converts to approximately 239 Calories or 0.278 Watt-Hours.',
    faq: [
      { question: 'What is the relationship between a Joule and a Watt?', answer: 'One Joule is equal to one Watt of power expended over one second.' }
    ],
    relatedSlugs: ['power-converter-tool', 'wavelength-calculator'],
    calculate: (inputs) => {
      const val = Number(inputs.energy || 1000);
      const from = inputs.fromUnit || 'j';

      // base representation: Joules
      let j = val;
      if (from === 'kj') j = val * 1000;
      else if (from === 'cal') j = val * 4.184;
      else if (from === 'kcal') j = val * 4184;
      else if (from === 'wh') j = val * 3600;

      const kj = j / 1000;
      const cal = j / 4.184;
      const kcal = j / 4184;
      const wh = j / 3600;

      return {
        results: [
          { label: 'Joules (J)', value: `${j.toLocaleString(undefined, { maximumFractionDigits: 1 })} J`, isPrimary: true },
          { label: 'Kilojoules (kJ)', value: `${kj.toFixed(3)} kJ` },
          { label: 'Calories (cal)', value: `${cal.toLocaleString(undefined, { maximumFractionDigits: 1 })} cal` },
          { label: 'Kilocalories (kcal)', value: `${kcal.toFixed(3)} kcal` },
          { label: 'Watt-Hours (Wh)', value: `${wh.toFixed(4)} Wh` }
        ]
      };
    }
  },
  {
    id: 'conv-pressure',
    name: 'Atmospheric Pressure Converter',
    slug: 'pressure-converter-tool',
    category: 'conversion',
    description: 'Convert pressure measurements between Pascals, Kilopascals, Atmospheres, Bars, and PSI.',
    seoTitle: 'Universal Pressure Unit Converter | Calculatoora',
    seoDescription: 'Convert pressure measurements between Pascals, Kilopascals, Bar, PSI, and Atmospheres.',
    inputs: [
      { id: 'pressVal', label: 'Enter Pressure Value', type: 'number', defaultValue: 1 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'atm', options: [
        { label: 'Atmosphere (atm)', value: 'atm' },
        { label: 'Pascals (Pa)', value: 'pa' },
        { label: 'Kilopascals (kPa)', value: 'kpa' },
        { label: 'Bar', value: 'bar' },
        { label: 'Pounds per sq inch (psi)', value: 'psi' }
      ]}
    ],
    formula: '1 atm = 101,325 Pa = 14.6959 psi.',
    explanation: 'Converting pressure scales is vital for weather forecasting, deep-sea exploration, aviation, and engineering design.',
    example: 'An input value of 1 Atmosphere (atm) converts to 101.32 Kilopascals (kPa) or 14.70 PSI.',
    faq: [
      { question: 'What is standard atmospheric temperature and pressure?', answer: 'Often abbreviated as STP, standard reference conditions are defined as 0°C (273.15 K) and exactly 1 Bar of pressure.' }
    ],
    relatedSlugs: ['energy-converter-tool', 'power-converter-tool'],
    calculate: (inputs) => {
      const val = Number(inputs.pressVal || 1);
      const from = inputs.fromUnit || 'atm';

      // base representation: Pascals
      let pa = val;
      if (from === 'atm') pa = val * 101325;
      else if (from === 'kpa') pa = val * 1000;
      else if (from === 'bar') pa = val * 100000;
      else if (from === 'psi') pa = val * 6894.75729;

      const atm = pa / 101325;
      const kpa = pa / 1000;
      const bar = pa / 100000;
      const psi = pa / 6894.75729;

      return {
        results: [
          { label: 'Pascals (Pa)', value: `${pa.toLocaleString(undefined, { maximumFractionDigits: 1 })} Pa`, isPrimary: true },
          { label: 'Atmosphere (atm)', value: `${atm.toFixed(4)} atm` },
          { label: 'Kilopascals (kPa)', value: `${kpa.toFixed(3)} kPa` },
          { label: 'Bar', value: `${bar.toFixed(4)} bar` },
          { label: 'PSI (lbs/sq in)', value: `${psi.toFixed(3)} psi` }
        ]
      };
    }
  },
  {
    id: 'conv-power',
    name: 'Universal Power Converter',
    slug: 'power-converter-tool',
    category: 'conversion',
    description: 'Convert power metrics between Watts, Kilowatts, Megawatts, Horsepower, and BTUs/hour.',
    seoTitle: 'Universal Power Metric Converter | Calculatoora',
    seoDescription: 'Convert power metrics including Watts, Kilowatts, Horsepower, and BTUs/hour.',
    inputs: [
      { id: 'power', label: 'Enter Power Value', type: 'number', defaultValue: 100 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'kw', options: [
        { label: 'Watts (W)', value: 'w' },
        { label: 'Kilowatts (kW)', value: 'kw' },
        { label: 'Horsepower (hp)', value: 'hp' },
        { label: 'BTUs per hour (BTU/h)', value: 'btuh' }
      ]}
    ],
    formula: '1 Horsepower (hp) = 745.7 Watts; 1 kW = 3,412.14 BTU/h.',
    explanation: 'Converting power metrics is essential for sizing HVAC units, assessing engine strength, and evaluating grid power.',
    example: 'An input value of 100 Kilowatts (kW) converts to approximately 134.10 Horsepower.',
    faq: [
      { question: 'What is Horsepower?', answer: 'A unit of power originally developed to compare steam engine performance with the draft strength of working horses.' }
    ],
    relatedSlugs: ['energy-converter-tool', 'pressure-converter-tool'],
    calculate: (inputs) => {
      const val = Number(inputs.power || 100);
      const from = inputs.fromUnit || 'kw';

      // base representation: Watts
      let w = val;
      if (from === 'kw') w = val * 1000;
      else if (from === 'hp') w = val * 745.699872;
      else if (from === 'btuh') w = val * 0.29307107;

      const kw = w / 1000;
      const hp = w / 745.699872;
      const btuh = w / 0.29307107;

      return {
        results: [
          { label: 'Watts (W)', value: `${w.toLocaleString(undefined, { maximumFractionDigits: 1 })} W`, isPrimary: true },
          { label: 'Kilowatts (kW)', value: `${kw.toFixed(3)} kW` },
          { label: 'Horsepower (hp)', value: `${hp.toFixed(2)} hp` },
          { label: 'BTU per hour (BTU/h)', value: `${btuh.toLocaleString(undefined, { maximumFractionDigits: 1 })} BTU/h` }
        ]
      };
    }
  }
];
