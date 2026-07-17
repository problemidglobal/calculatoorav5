export interface Unit {
  key: string;
  name: string;
  factor: number; // Multiplied to get base unit, or custom conversion logic
}

export const UNIT_CATEGORIES = [
  "Length",
  "Mass",
  "Area",
  "Volume",
  "Temperature",
  "Speed",
  "Pressure",
  "Energy",
  "Power",
  "Torque",
  "Time",
  "Data Storage",
  "Fuel Economy",
  "Angle"
] as const;

export type UnitCategory = typeof UNIT_CATEGORIES[number];

export const UNITS_DATA: Record<UnitCategory, Unit[]> = {
  Length: [
    { key: "m", name: "Meters (m)", factor: 1 },
    { key: "km", name: "Kilometers (km)", factor: 1000 },
    { key: "cm", name: "Centimeters (cm)", factor: 0.01 },
    { key: "mm", name: "Millimeters (mm)", factor: 0.001 },
    { key: "um", name: "Micrometers (μm)", factor: 1e-6 },
    { key: "nm", name: "Nanometers (nm)", factor: 1e-9 },
    { key: "mi", name: "Miles (mi)", factor: 1609.344 },
    { key: "yd", name: "Yards (yd)", factor: 0.9144 },
    { key: "ft", name: "Feet (ft)", factor: 0.3048 },
    { key: "in", name: "Inches (in)", factor: 0.0254 },
    { key: "nmi", name: "Nautical Miles (nmi)", factor: 1852 }
  ],
  Mass: [
    { key: "kg", name: "Kilograms (kg)", factor: 1 },
    { key: "g", name: "Grams (g)", factor: 0.001 },
    { key: "mg", name: "Milligrams (mg)", factor: 1e-6 },
    { key: "ug", name: "Micrograms (μg)", factor: 1e-9 },
    { key: "ton", name: "Metric Tons (t)", factor: 1000 },
    { key: "lb", name: "Pounds (lb)", factor: 0.45359237 },
    { key: "oz", name: "Ounces (oz)", factor: 0.0283495231 },
    { key: "stone", name: "Stones (st)", factor: 6.35029318 }
  ],
  Area: [
    { key: "m2", name: "Square Meters (m²)", factor: 1 },
    { key: "km2", name: "Square Kilometers (km²)", factor: 1e6 },
    { key: "cm2", name: "Square Centimeters (cm²)", factor: 1e-4 },
    { key: "mm2", name: "Square Millimeters (mm²)", factor: 1e-6 },
    { key: "mi2", name: "Square Miles (mi²)", factor: 2.58998811e6 },
    { key: "yd2", name: "Square Yards (yd²)", factor: 0.83612736 },
    { key: "ft2", name: "Square Feet (ft²)", factor: 0.09290304 },
    { key: "in2", name: "Square Inches (in²)", factor: 0.00064516 },
    { key: "ha", name: "Hectares (ha)", factor: 10000 },
    { key: "acre", name: "Acres (ac)", factor: 4046.856422 }
  ],
  Volume: [
    { key: "m3", name: "Cubic Meters (m³)", factor: 1000 }, // We use liters as base for easier volume factors
    { key: "l", name: "Liters (L)", factor: 1 },
    { key: "ml", name: "Milliliters (mL)", factor: 0.001 },
    { key: "cm3", name: "Cubic Centimeters (cm³)", factor: 0.001 },
    { key: "gal", name: "Gallons (US gal)", factor: 3.78541178 },
    { key: "qt", name: "Quarts (US qt)", factor: 0.946352946 },
    { key: "pt", name: "Pints (US pt)", factor: 0.473176473 },
    { key: "cup", name: "Cups (US cup)", factor: 0.236588236 },
    { key: "floz", name: "Fluid Ounces (US fl oz)", factor: 0.029573529 },
    { key: "gal_uk", name: "Gallons (UK gal)", factor: 4.54609 }
  ],
  Temperature: [
    { key: "C", name: "Celsius (°C)", factor: 1 },
    { key: "F", name: "Fahrenheit (°F)", factor: 1 },
    { key: "K", name: "Kelvin (K)", factor: 1 },
    { key: "R", name: "Rankine (°R)", factor: 1 }
  ],
  Speed: [
    { key: "m_s", name: "Meters per Second (m/s)", factor: 1 },
    { key: "km_h", name: "Kilometers per Hour (km/h)", factor: 1 / 3.6 },
    { key: "mi_h", name: "Miles per Hour (mph)", factor: 0.44704 },
    { key: "knot", name: "Knots (kt)", factor: 0.514444 },
    { key: "ft_s", name: "Feet per Second (ft/s)", factor: 0.3048 },
    { key: "c_light", name: "Speed of Light (c)", factor: 299792458 }
  ],
  Pressure: [
    { key: "Pa", name: "Pascals (Pa)", factor: 1 },
    { key: "kPa", name: "Kilopascals (kPa)", factor: 1000 },
    { key: "atm", name: "Atmospheres (atm)", factor: 101325 },
    { key: "bar", name: "Bars (bar)", factor: 100000 },
    { key: "mbar", name: "Millibars (mbar)", factor: 100 },
    { key: "psi", name: "Pounds per Sq Inch (psi)", factor: 6894.75729 },
    { key: "torr", name: "Torr / mmHg", factor: 133.322368 }
  ],
  Energy: [
    { key: "J", name: "Joules (J)", factor: 1 },
    { key: "kJ", name: "Kilojoules (kJ)", factor: 1000 },
    { key: "cal", name: "Calories (cal)", factor: 4.184 },
    { key: "kcal", name: "Kilocalories (kcal)", factor: 4184 },
    { key: "Wh", name: "Watt-hours (Wh)", factor: 3600 },
    { key: "kWh", name: "Kilowatt-hours (kWh)", factor: 3.6e6 },
    { key: "eV", name: "Electronvolts (eV)", factor: 1.602176634e-19 },
    { key: "btu", name: "British Thermal Units (BTU)", factor: 1055.05585 },
    { key: "ft_lb", name: "Foot-pounds (ft·lb)", factor: 1.355818 }
  ],
  Power: [
    { key: "W", name: "Watts (W)", factor: 1 },
    { key: "kW", name: "Kilowatts (kW)", factor: 1000 },
    { key: "MW", name: "Megawatts (MW)", factor: 1e6 },
    { key: "hp", name: "Horsepower (hp, Imperial)", factor: 745.699872 },
    { key: "btu_h", name: "BTUs per Hour (BTU/h)", factor: 0.293071 }
  ],
  Torque: [
    { key: "Nm", name: "Newton-meters (N·m)", factor: 1 },
    { key: "ft_lb_t", name: "Foot-pounds (ft·lb)", factor: 1.355818 },
    { key: "in_lb_t", name: "Inch-pounds (in·lb)", factor: 0.1129848 },
    { key: "kgm", name: "Kilogram-force meters (kgf·m)", factor: 9.80665 }
  ],
  Time: [
    { key: "s", name: "Seconds (s)", factor: 1 },
    { key: "ms", name: "Milliseconds (ms)", factor: 0.001 },
    { key: "us", name: "Microseconds (μs)", factor: 1e-6 },
    { key: "ns", name: "Nanoseconds (ns)", factor: 1e-9 },
    { key: "min", name: "Minutes (min)", factor: 60 },
    { key: "h", name: "Hours (hr)", factor: 3600 },
    { key: "d", name: "Days (d)", factor: 86400 },
    { key: "wk", name: "Weeks (wk)", factor: 604800 },
    { key: "mo", name: "Months (mo, avg)", factor: 2.628e6 },
    { key: "yr", name: "Years (yr, avg)", factor: 3.1536e7 }
  ],
  "Data Storage": [
    { key: "bit", name: "Bits (b)", factor: 0.125 }, // Base unit: Bytes
    { key: "B", name: "Bytes (B)", factor: 1 },
    { key: "KB", name: "Kilobytes (KB, 10³)", factor: 1000 },
    { key: "MB", name: "Megabytes (MB, 10⁶)", factor: 1e6 },
    { key: "GB", name: "Gigabytes (GB, 10⁹)", factor: 1e9 },
    { key: "TB", name: "Terabytes (TB, 10¹²)", factor: 1e12 },
    { key: "PB", name: "Petabytes (PB, 10¹⁵)", factor: 1e15 },
    { key: "KiB", name: "Kibibytes (KiB, 2¹⁰)", factor: 1024 },
    { key: "MiB", name: "Mebibytes (MiB, 2²⁰)", factor: 1048576 },
    { key: "GiB", name: "Gibibytes (GiB, 2³⁰)", factor: 1073741824 },
    { key: "TiB", name: "Tebibytes (TiB, 2⁴⁰)", factor: 1099511627776 }
  ],
  "Fuel Economy": [
    { key: "mpg", name: "Miles per Gallon (mpg US)", factor: 1 },
    { key: "l_100", name: "Liters per 100km (L/100km)", factor: 1 },
    { key: "km_l", name: "Kilometers per Liter (km/L)", factor: 1 }
  ],
  Angle: [
    { key: "rad", name: "Radians (rad)", factor: 1 },
    { key: "deg", name: "Degrees (°)", factor: Math.PI / 180 },
    { key: "grad", name: "Gradians (grad)", factor: Math.PI / 200 },
    { key: "arcmin", name: "Arcminutes (arcmin)", factor: Math.PI / 10800 },
    { key: "arcsec", name: "Arcseconds (arcsec)", factor: Math.PI / 648000 }
  ]
};

export function convertUnit(value: number, fromUnit: string, toUnit: string, category: UnitCategory): number {
  if (fromUnit === toUnit) return value;

  // 1. Specific non-linear transformations: Temperature
  if (category === "Temperature") {
    let kelvin = value;
    if (fromUnit === "C") kelvin = value + 273.15;
    else if (fromUnit === "F") kelvin = ((value - 32) * 5) / 9 + 273.15;
    else if (fromUnit === "R") kelvin = (value * 5) / 9;

    if (toUnit === "C") return kelvin - 273.15;
    if (toUnit === "F") return ((kelvin - 273.15) * 9) / 5 + 32;
    if (toUnit === "R") return (kelvin * 9) / 5;
    return kelvin; // Kelvin
  }

  // 2. Specific non-linear transformations: Fuel Economy
  if (category === "Fuel Economy") {
    // We convert everything to km/L first, then convert to target
    let kmL = value;
    if (fromUnit === "mpg") kmL = value * 0.425143707;
    else if (fromUnit === "l_100") kmL = value === 0 ? 0 : 100 / value;

    if (toUnit === "mpg") return kmL / 0.425143707;
    if (toUnit === "l_100") return kmL === 0 ? 0 : 100 / kmL;
    return kmL; // km_l
  }

  // 3. Linear transformations via standard multiplier factor
  const units = UNITS_DATA[category];
  const fromObj = units.find((u) => u.key === fromUnit);
  const toObj = units.find((u) => u.key === toUnit);

  if (!fromObj || !toObj) return value;

  const baseValue = value * fromObj.factor;
  return baseValue / toObj.factor;
}
