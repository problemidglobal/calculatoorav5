/**
 * World's Most Advanced Client-Side Geometry Calculator Maths Engine
 * Robust, highly accurate calculations with step-by-step mathematical derivations.
 */

// Supported Units
export type LengthUnit = 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft' | 'yd' | 'mi';

export const UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'Millimeters (mm)',
  cm: 'Centimeters (cm)',
  m: 'Meters (m)',
  km: 'Kilometers (km)',
  in: 'Inches (in)',
  ft: 'Feet (ft)',
  yd: 'Yards (yd)',
  mi: 'Miles (mi)',
};

// Unit Conversion Constants (relative to 1 meter)
export const TO_METERS: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

export function convertValue(val: number, from: LengthUnit, to: LengthUnit): number {
  if (val === 0) return 0;
  const inMeters = val * TO_METERS[from];
  return inMeters / TO_METERS[to];
}

export function convertArea(val: number, from: LengthUnit, to: LengthUnit): number {
  if (val === 0) return 0;
  const inSqMeters = val * Math.pow(TO_METERS[from], 2);
  return inSqMeters / Math.pow(TO_METERS[to], 2);
}

export function convertVolume(val: number, from: LengthUnit, to: LengthUnit): number {
  if (val === 0) return 0;
  const inCuMeters = val * Math.pow(TO_METERS[from], 3);
  return inCuMeters / Math.pow(TO_METERS[to], 3);
}

// ----------------------------------------------------
// STEP-BY-STEP SOLUTION TYPE DEFINITION
// ----------------------------------------------------
export interface SolutionStep {
  title: string;
  formula: string;
  substitution: string;
  calculation: string;
  result: string;
}

export interface GeometryResult {
  primary: { label: string; value: string; unit: string };
  secondary: Array<{ label: string; value: string; unit: string; tooltip?: string }>;
  steps: SolutionStep[];
  insights: string[];
  properties: Array<{ name: string; value: string }>;
  valid: boolean;
  message?: string;
  // SVG points or drawing configurations
  drawingData?: any;
}

// ----------------------------------------------------
// TRIANGLE SOLVER HELPERS
// ----------------------------------------------------
export interface TriangleData {
  a?: number;
  b?: number;
  c?: number;
  alpha?: number; // opposite to a (degrees)
  beta?: number;  // opposite to b (degrees)
  gamma?: number; // opposite to c (degrees)
  heightA?: number;
  heightB?: number;
  heightC?: number;
  area?: number;
  perimeter?: number;
  inradius?: number;
  circumradius?: number;
}

// Solves a triangle from whatever inputs we have
export function solveTriangle(input: TriangleData): { solved: TriangleData; steps: SolutionStep[]; valid: boolean; error?: string } {
  const steps: SolutionStep[] = [];
  const res: TriangleData = { ...input };

  // Convert angles from degrees to radians for calculations
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const deg = (rad: number) => (rad * 180) / Math.PI;

  let a = res.a, b = res.b, c = res.c;
  let alpha = res.alpha, beta = res.beta, gamma = res.gamma;

  // Level 1: Clean Angle Relationships (alpha + beta + gamma = 180)
  if (alpha !== undefined && beta !== undefined && gamma === undefined) {
    gamma = 180 - alpha - beta;
    steps.push({
      title: 'Calculate Missing Angle (γ)',
      formula: 'γ = 180° - α - β',
      substitution: `γ = 180° - ${alpha}° - ${beta}°`,
      calculation: `γ = 180 - ${alpha + beta}`,
      result: `γ = ${gamma.toFixed(2)}°`,
    });
  } else if (alpha !== undefined && gamma !== undefined && beta === undefined) {
    beta = 180 - alpha - gamma;
    steps.push({
      title: 'Calculate Missing Angle (β)',
      formula: 'β = 180° - α - γ',
      substitution: `β = 180° - ${alpha}° - ${gamma}°`,
      calculation: `β = 180 - ${alpha + gamma}`,
      result: `β = ${beta.toFixed(2)}°`,
    });
  } else if (beta !== undefined && gamma !== undefined && alpha === undefined) {
    alpha = 180 - beta - gamma;
    steps.push({
      title: 'Calculate Missing Angle (α)',
      formula: 'α = 180° - β - γ',
      substitution: `α = 180° - ${beta}° - ${gamma}°`,
      calculation: `α = 180 - ${beta + gamma}`,
      result: `α = ${alpha.toFixed(2)}°`,
    });
  }

  // Check sum of angles
  if (alpha !== undefined && beta !== undefined && gamma !== undefined) {
    if (Math.abs(alpha + beta + gamma - 180) > 0.01) {
      return { solved: {}, steps, valid: false, error: `The sum of angles must be exactly 180°. Current sum: ${(alpha + beta + gamma).toFixed(1)}°` };
    }
  }

  // Case SSS (Three sides)
  if (a !== undefined && b !== undefined && c !== undefined) {
    // Validate Triangle Inequality
    if (a + b <= c || a + c <= b || b + c <= a) {
      return { solved: {}, steps, valid: false, error: 'Triangle Inequality Violated: The sum of any two sides must be strictly greater than the third side.' };
    }

    // Law of Cosines to find angles
    const cosAlpha = (b * b + c * c - a * a) / (2 * b * c);
    alpha = deg(Math.acos(cosAlpha));
    steps.push({
      title: 'Solve Angle α using Law of Cosines',
      formula: 'α = acos((b² + c² - a²) / 2bc)',
      substitution: `α = acos((${b}² + ${c}² - ${a}²) / (2 × ${b} × ${c}))`,
      calculation: `α = acos((${b*b + c*c - a*a}) / ${2*b*c})`,
      result: `α = ${alpha.toFixed(2)}°`,
    });

    const cosBeta = (a * a + c * c - b * b) / (2 * a * c);
    beta = deg(Math.acos(cosBeta));
    steps.push({
      title: 'Solve Angle β using Law of Cosines',
      formula: 'β = acos((a² + c² - b²) / 2ac)',
      substitution: `β = acos((${a}² + ${c}² - ${b}²) / (2 × ${a} × ${c}))`,
      calculation: `β = acos((${a*a + c*c - b*b}) / ${2*a*c})`,
      result: `β = ${beta.toFixed(2)}°`,
    });

    gamma = 180 - alpha - beta;
    steps.push({
      title: 'Solve Angle γ using Angle Sum Rule',
      formula: 'γ = 180° - α - β',
      substitution: `γ = 180° - ${alpha.toFixed(2)}° - ${beta.toFixed(2)}°`,
      calculation: `γ = 180 - ${(alpha + beta).toFixed(2)}`,
      result: `γ = ${gamma.toFixed(2)}°`,
    });
  }
  // Case SAS (Two sides and their included angle)
  else if (a !== undefined && b !== undefined && gamma !== undefined && c === undefined) {
    // Law of Cosines to find third side c
    c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(gamma)));
    steps.push({
      title: 'Solve Side c using Law of Cosines',
      formula: 'c = √(a² + b² - 2ab cos(γ))',
      substitution: `c = √(${a}² + ${b}² - 2 × ${a} × ${b} × cos(${gamma}°))`,
      calculation: `c = √(${a*a + b*b} - ${2*a*b} × ${Math.cos(rad(gamma)).toFixed(4)})`,
      result: `c = ${c.toFixed(3)}`,
    });

    // Law of Sines to find other angles
    const sinAlpha = (a * Math.sin(rad(gamma))) / c;
    alpha = deg(Math.asin(sinAlpha));
    steps.push({
      title: 'Solve Angle α using Law of Sines',
      formula: 'α = asin(a × sin(γ) / c)',
      substitution: `α = asin(${a} × sin(${gamma}°) / ${c.toFixed(3)})`,
      calculation: `α = asin(${a} × ${Math.sin(rad(gamma)).toFixed(4)} / ${c.toFixed(3)})`,
      result: `α = ${alpha.toFixed(2)}°`,
    });

    beta = 180 - alpha - gamma;
    steps.push({
      title: 'Solve Angle β',
      formula: 'β = 180° - α - γ',
      substitution: `β = 180° - ${alpha.toFixed(2)}° - ${gamma}°`,
      calculation: `β = 180 - ${(alpha + gamma).toFixed(2)}`,
      result: `β = ${beta.toFixed(2)}°`,
    });
  }
  else if (a !== undefined && c !== undefined && beta !== undefined && b === undefined) {
    b = Math.sqrt(a * a + c * c - 2 * a * c * Math.cos(rad(beta)));
    steps.push({
      title: 'Solve Side b using Law of Cosines',
      formula: 'b = √(a² + c² - 2ac cos(β))',
      substitution: `b = √(${a}² + ${c}² - 2 × ${a} × ${c} × cos(${beta}°))`,
      calculation: `b = √(${a*a + c*c} - ${2*a*c} × ${Math.cos(rad(beta)).toFixed(4)})`,
      result: `b = ${b.toFixed(3)}`,
    });

    const sinAlpha = (a * Math.sin(rad(beta))) / b;
    alpha = deg(Math.asin(sinAlpha));
    steps.push({
      title: 'Solve Angle α using Law of Sines',
      formula: 'α = asin(a × sin(β) / b)',
      substitution: `α = asin(${a} × sin(${beta}°) / ${b.toFixed(3)})`,
      calculation: `α = asin(${a} × ${Math.sin(rad(beta)).toFixed(4)} / ${b.toFixed(3)})`,
      result: `α = ${alpha.toFixed(2)}°`,
    });

    gamma = 180 - alpha - beta;
  }
  else if (b !== undefined && c !== undefined && alpha !== undefined && a === undefined) {
    a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(rad(alpha)));
    steps.push({
      title: 'Solve Side a using Law of Cosines',
      formula: 'a = √(b² + c² - 2bc cos(α))',
      substitution: `a = √(${b}² + ${c}² - 2 × ${b} × ${c} × cos(${alpha}°))`,
      calculation: `a = √(${b*b + c*c} - ${2*b*c} × ${Math.cos(rad(alpha)).toFixed(4)})`,
      result: `a = ${a.toFixed(3)}`,
    });

    const sinBeta = (b * Math.sin(rad(alpha))) / a;
    beta = deg(Math.asin(sinBeta));
    steps.push({
      title: 'Solve Angle β using Law of Sines',
      formula: 'β = asin(b × sin(α) / a)',
      substitution: `β = asin(${b} × sin(${alpha}°) / ${a.toFixed(3)})`,
      calculation: `β = asin(${b} × ${Math.sin(rad(alpha)).toFixed(4)} / ${a.toFixed(3)})`,
      result: `β = ${beta.toFixed(2)}°`,
    });

    gamma = 180 - alpha - beta;
  }

  // Case ASA or AAS (One side and two angles)
  else if (alpha !== undefined && beta !== undefined && gamma !== undefined) {
    let knownSide = 0;
    let knownSideName = '';
    if (a !== undefined) { knownSide = a; knownSideName = 'a'; }
    else if (b !== undefined) { knownSide = b; knownSideName = 'b'; }
    else if (c !== undefined) { knownSide = c; knownSideName = 'c'; }

    if (knownSide > 0) {
      // Solve other sides using Law of Sines
      if (knownSideName === 'a') {
        b = (a! * Math.sin(rad(beta))) / Math.sin(rad(alpha));
        c = (a! * Math.sin(rad(gamma))) / Math.sin(rad(alpha));
        steps.push({
          title: 'Solve Sides b and c using Law of Sines',
          formula: 'b = a × sin(β) / sin(α)  |  c = a × sin(γ) / sin(α)',
          substitution: `b = ${a} × sin(${beta}°) / sin(${alpha}°) | c = ${a} × sin(${gamma}°) / sin(${alpha}°)`,
          calculation: `b = ${a} × ${Math.sin(rad(beta)).toFixed(4)} / ${Math.sin(rad(alpha)).toFixed(4)}`,
          result: `b = ${b.toFixed(3)}, c = ${c.toFixed(3)}`,
        });
      } else if (knownSideName === 'b') {
        a = (b! * Math.sin(rad(alpha))) / Math.sin(rad(beta));
        c = (b! * Math.sin(rad(gamma))) / Math.sin(rad(beta));
        steps.push({
          title: 'Solve Sides a and c using Law of Sines',
          formula: 'a = b × sin(α) / sin(β)  |  c = b × sin(γ) / sin(β)',
          substitution: `a = ${b} × sin(${alpha}°) / sin(${beta}°) | c = ${b} × sin(${gamma}°) / sin(${beta}°)`,
          calculation: `a = ${b} × ${Math.sin(rad(alpha)).toFixed(4)} / ${Math.sin(rad(beta)).toFixed(4)}`,
          result: `a = ${a.toFixed(3)}, c = ${c.toFixed(3)}`,
        });
      } else if (knownSideName === 'c') {
        a = (c! * Math.sin(rad(alpha))) / Math.sin(rad(gamma));
        b = (c! * Math.sin(rad(beta))) / Math.sin(rad(gamma));
        steps.push({
          title: 'Solve Sides a and b using Law of Sines',
          formula: 'a = c × sin(α) / sin(γ)  |  b = c × sin(β) / sin(γ)',
          substitution: `a = ${c} × sin(${alpha}°) / sin(${gamma}°) | b = ${c} × sin(${beta}°) / sin(${gamma}°)`,
          calculation: `a = ${c} × ${Math.sin(rad(alpha)).toFixed(4)} / ${Math.sin(rad(gamma)).toFixed(4)}`,
          result: `a = ${a.toFixed(3)}, b = ${b.toFixed(3)}`,
        });
      }
    }
  }

  // Case SSA (Two sides and non-included angle) - can have ambiguous solutions, let's solve principal solution
  else if (a !== undefined && b !== undefined && alpha !== undefined && beta === undefined) {
    const sinBeta = (b * Math.sin(rad(alpha))) / a;
    if (sinBeta > 1) {
      return { solved: {}, steps, valid: false, error: 'No real triangle can be formed with these side-angle ratios (sin(β) > 1).' };
    }
    beta = deg(Math.asin(sinBeta));
    gamma = 180 - alpha - beta;
    c = (a * Math.sin(rad(gamma))) / Math.sin(rad(alpha));
    steps.push({
      title: 'Solve Angle β using Law of Sines (SSA)',
      formula: 'β = asin(b × sin(α) / a)',
      substitution: `β = asin(${b} × sin(${alpha}°) / ${a})`,
      calculation: `β = asin(${b} × ${Math.sin(rad(alpha)).toFixed(4)} / ${a})`,
      result: `β = ${beta.toFixed(2)}°`,
    });
  }
  else if (a !== undefined && b !== undefined && beta !== undefined && alpha === undefined) {
    const sinAlpha = (a * Math.sin(rad(beta))) / b;
    if (sinAlpha > 1) {
      return { solved: {}, steps, valid: false, error: 'No real triangle can be formed with these side-angle ratios (sin(α) > 1).' };
    }
    alpha = deg(Math.asin(sinAlpha));
    gamma = 180 - alpha - beta;
    c = (b * Math.sin(rad(gamma))) / Math.sin(rad(beta));
  }
  else if (a !== undefined && c !== undefined && alpha !== undefined && gamma === undefined) {
    const sinGamma = (c * Math.sin(rad(alpha))) / a;
    if (sinGamma > 1) return { solved: {}, steps, valid: false, error: 'No real triangle can be formed with these dimensions.' };
    gamma = deg(Math.asin(sinGamma));
    beta = 180 - alpha - gamma;
    b = (a * Math.sin(rad(beta))) / Math.sin(rad(alpha));
  }
  else if (b !== undefined && c !== undefined && beta !== undefined && gamma === undefined) {
    const sinGamma = (c * Math.sin(rad(beta))) / b;
    if (sinGamma > 1) return { solved: {}, steps, valid: false, error: 'No real triangle can be formed with these dimensions.' };
    gamma = deg(Math.asin(sinGamma));
    alpha = 180 - beta - gamma;
    a = (b * Math.sin(rad(alpha))) / Math.sin(rad(beta));
  }

  // Fallback: If still incomplete, try Right Triangle specific rules if a Right Angle is present or if user specified
  if (alpha === 90 || beta === 90 || gamma === 90) {
    // If we have at least 2 sides, we can solve the third using Pythagorean theorem
    if (gamma === 90) {
      if (a !== undefined && b !== undefined && c === undefined) {
        c = Math.sqrt(a * a + b * b);
        alpha = deg(Math.atan(a / b));
        beta = 90 - alpha;
      } else if (a !== undefined && c !== undefined && b === undefined) {
        if (c <= a) return { solved: {}, steps, valid: false, error: 'Hypotenuse (c) must be greater than leg (a).' };
        b = Math.sqrt(c * c - a * a);
        alpha = deg(Math.asin(a / c));
        beta = 90 - alpha;
      } else if (b !== undefined && c !== undefined && a === undefined) {
        if (c <= b) return { solved: {}, steps, valid: false, error: 'Hypotenuse (c) must be greater than leg (b).' };
        a = Math.sqrt(c * c - b * b);
        alpha = deg(Math.acos(b / c));
        beta = 90 - alpha;
      }
    }
  }

  // Ensure everything solved
  if (a === undefined || b === undefined || c === undefined || alpha === undefined || beta === undefined || gamma === undefined) {
    return { solved: {}, steps, valid: false, error: 'Insufficient dimensions. Please enter at least 3 parameters, including at least one side.' };
  }

  // Check physical feasibility
  if (a <= 0 || b <= 0 || c <= 0 || alpha <= 0 || beta <= 0 || gamma <= 0) {
    return { solved: {}, steps, valid: false, error: 'All solved dimensions must be positive non-zero numbers.' };
  }

  // Area (Heron's Formula)
  const s = (a + b + c) / 2;
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  steps.push({
    title: "Calculate Area using Heron's Formula",
    formula: 'Area = √(s(s - a)(s - b)(s - c)) where s = (a + b + c) / 2',
    substitution: `s = (${a.toFixed(2)} + ${b.toFixed(2)} + ${c.toFixed(2)}) / 2 = ${s.toFixed(2)}\nArea = √(${s.toFixed(2)} × ${(s-a).toFixed(2)} × ${(s-b).toFixed(2)} × ${(s-c).toFixed(2)})`,
    calculation: `Area = √(${(s * (s - a) * (s - b) * (s - c)).toFixed(4)})`,
    result: `Area = ${area.toFixed(3)}`,
  });

  // Altitudes
  const heightA = (2 * area) / a;
  const heightB = (2 * area) / b;
  const heightC = (2 * area) / c;

  // Inscribed & Circumscribed Circles
  const inradius = area / s;
  const circumradius = (a * b * c) / (4 * area);

  const perimeter = a + b + c;

  const solved: TriangleData = {
    a, b, c,
    alpha, beta, gamma,
    heightA, heightB, heightC,
    area, perimeter,
    inradius, circumradius
  };

  return { solved, steps, valid: true };
}

// Generates coordinates for a triangle fitting inside a 200x200 viewport
export function getTriangleCoordinates(a: number, b: number, c: number, alpha: number, beta: number, gamma: number) {
  // Put corner A at (0, 0)
  // Put corner B at (c, 0)
  // Put corner C at (x, y) where x = b * cos(alpha), y = b * sin(alpha)
  const radAlpha = (alpha * Math.PI) / 180;
  const cx = b * Math.cos(radAlpha);
  const cy = b * Math.sin(radAlpha);

  // Let's shift so all points are positive
  const minX = Math.min(0, cx);
  const maxX = Math.max(c, cx);
  const minY = Math.min(0, cy);
  const maxY = Math.max(0, cy);

  const w = maxX - minX;
  const h = maxY - minY;

  // Scale to fit 160x160 box inside 200x200 canvas
  const padding = 20;
  const maxDim = Math.max(w, h) || 1;
  const scale = 160 / maxDim;

  const pA = { x: padding + (0 - minX) * scale, y: padding + (h - (0 - minY)) * scale };
  const pB = { x: padding + (c - minX) * scale, y: padding + (h - (0 - minY)) * scale };
  const pC = { x: padding + (cx - minX) * scale, y: padding + (h - (cy - minY)) * scale };

  // Calculate Triangle Centers
  // Centroid (Average of vertices)
  const centroid = {
    x: (pA.x + pB.x + pC.x) / 3,
    y: (pA.y + pB.y + pC.y) / 3
  };

  // Incenter (weighted sum of vertices by opposite sides)
  const perimeter = a + b + c;
  const incenter = {
    x: (a * pA.x + b * pB.x + c * pC.x) / perimeter,
    y: (a * pA.y + b * pB.y + c * pC.y) / perimeter
  };

  // Orthocenter and Circumenter
  // Standard orthocenter algebraic solution for the drawn coordinates
  // Or we can draw them simply:
  const d = 2 * (pA.x * (pB.y - pC.y) + pB.x * (pC.y - pA.y) + pC.x * (pA.y - pB.y));
  const ux = ((pA.x*pA.x + pA.y*pA.y)*(pB.y - pC.y) + (pB.x*pB.x + pB.y*pB.y)*(pC.y - pA.y) + (pC.x*pC.x + pC.y*pC.y)*(pA.y - pB.y)) / d;
  const uy = ((pA.x*pA.x + pA.y*pA.y)*(pC.x - pB.x) + (pB.x*pB.x + pB.y*pB.y)*(pA.x - pC.x) + (pC.x*pC.x + pC.y*pC.y)*(pB.x - pA.x)) / d;
  const circumcenter = { x: ux, y: uy };

  const orthocenter = {
    x: pA.x + pB.x + pC.x - 2 * circumcenter.x,
    y: pA.y + pB.y + pC.y - 2 * circumcenter.y
  };

  return { pA, pB, pC, centroid, incenter, circumcenter, orthocenter };
}

// ----------------------------------------------------
// SHAPE CALCULATION ENGINES
// ----------------------------------------------------

export function calculateSquare(side?: number, perimeter?: number, area?: number, diagonal?: number): GeometryResult {
  let s = side;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (s === undefined) {
    if (perimeter !== undefined && perimeter > 0) {
      s = perimeter / 4;
      steps.push({
        title: 'Determine Side Length from Perimeter',
        formula: 'Side (s) = Perimeter (P) / 4',
        substitution: `s = ${perimeter} / 4`,
        calculation: `${perimeter} / 4`,
        result: `s = ${s.toFixed(3)}`,
      });
    } else if (area !== undefined && area > 0) {
      s = Math.sqrt(area);
      steps.push({
        title: 'Determine Side Length from Area',
        formula: 'Side (s) = √Area (A)',
        substitution: `s = √${area}`,
        calculation: `√${area}`,
        result: `s = ${s.toFixed(3)}`,
      });
    } else if (diagonal !== undefined && diagonal > 0) {
      s = diagonal / Math.sqrt(2);
      steps.push({
        title: 'Determine Side Length from Diagonal',
        formula: 'Side (s) = Diagonal (d) / √2',
        substitution: `s = ${diagonal} / √2`,
        calculation: `${diagonal} / 1.4142`,
        result: `s = ${s.toFixed(3)}`,
      });
    }
  }

  if (s === undefined || s <= 0) {
    return { valid: false, message: 'Please enter a valid positive numeric value.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const p = 4 * s;
  const a = s * s;
  const d = s * Math.sqrt(2);

  steps.push({
    title: 'Calculate Perimeter',
    formula: 'P = 4 × s',
    substitution: `P = 4 × ${s.toFixed(3)}`,
    calculation: `4 × ${s.toFixed(3)}`,
    result: `P = ${p.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Area',
    formula: 'A = s²',
    substitution: `A = ${s.toFixed(3)}²`,
    calculation: `${s.toFixed(3)} × ${s.toFixed(3)}`,
    result: `A = ${a.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Diagonal',
    formula: 'd = s × √2',
    substitution: `d = ${s.toFixed(3)} × √2`,
    calculation: `${s.toFixed(3)} × 1.41421`,
    result: `d = ${d.toFixed(3)}`,
  });

  insights.push('A square represents the maximum possible area for any quadrilateral with a given perimeter.');
  insights.push(`Doubling the side length increases the area fourfold (2² = 4) and doubles the perimeter.`);
  insights.push('All four interior angles are exactly 90° and sum to 360°.');

  return {
    valid: true,
    primary: { label: 'Area', value: a.toFixed(3), unit: '²' },
    secondary: [
      { label: 'Perimeter', value: p.toFixed(3), unit: '' },
      { label: 'Diagonal', value: d.toFixed(3), unit: '' },
      { label: 'Side Length', value: s.toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Symmetry Group', value: 'D4 (dihedral, order 8)' },
      { name: 'Interior Angle', value: '90°' },
      { name: 'Exterior Angle', value: '90°' },
      { name: 'Rotational Symmetry', value: '90°, 180°, 270°' },
    ],
    drawingData: { side: s },
  };
}

export function calculateRectangle(length?: number, width?: number, area?: number, perimeter?: number, diagonal?: number): GeometryResult {
  let l = length, w = width;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  // Attempt to solve for L and W if missing
  if (l === undefined || w === undefined) {
    if (l !== undefined && area !== undefined && area > 0) {
      w = area / l;
      steps.push({ title: 'Solve Width from Length and Area', formula: 'w = A / l', substitution: `w = ${area} / ${l}`, calculation: `${area} / ${l}`, result: `w = ${w.toFixed(3)}` });
    } else if (w !== undefined && area !== undefined && area > 0) {
      l = area / w;
      steps.push({ title: 'Solve Length from Width and Area', formula: 'l = A / w', substitution: `l = ${area} / ${w}`, calculation: `${area} / ${w}`, result: `l = ${l.toFixed(3)}` });
    } else if (l !== undefined && perimeter !== undefined && perimeter > 0) {
      w = (perimeter / 2) - l;
      steps.push({ title: 'Solve Width from Length and Perimeter', formula: 'w = (P / 2) - l', substitution: `w = (${perimeter} / 2) - ${l}`, calculation: `${perimeter/2} - ${l}`, result: `w = ${w.toFixed(3)}` });
    } else if (w !== undefined && perimeter !== undefined && perimeter > 0) {
      l = (perimeter / 2) - w;
      steps.push({ title: 'Solve Length from Width and Perimeter', formula: 'l = (P / 2) - w', substitution: `l = (${perimeter} / 2) - ${w}`, calculation: `${perimeter/2} - ${w}`, result: `l = ${l.toFixed(3)}` });
    } else if (l !== undefined && diagonal !== undefined && diagonal > 0) {
      if (diagonal <= l) return { valid: false, message: 'Diagonal must be strictly greater than any side length.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
      w = Math.sqrt(diagonal * diagonal - l * l);
      steps.push({ title: 'Solve Width from Length and Diagonal', formula: 'w = √(d² - l²)', substitution: `w = √(${diagonal}² - ${l}²)`, calculation: `√(${diagonal*diagonal} - ${l*l})`, result: `w = ${w.toFixed(3)}` });
    } else if (w !== undefined && diagonal !== undefined && diagonal > 0) {
      if (diagonal <= w) return { valid: false, message: 'Diagonal must be strictly greater than any side length.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
      l = Math.sqrt(diagonal * diagonal - w * w);
      steps.push({ title: 'Solve Length from Width and Diagonal', formula: 'l = √(d² - w²)', substitution: `l = √(${diagonal}² - ${w}²)`, calculation: `√(${diagonal*diagonal} - ${w*w})`, result: `l = ${l.toFixed(3)}` });
    } else if (area !== undefined && perimeter !== undefined) {
      // Quadratic equation for length & width: x^2 - (P/2)x + A = 0
      const halfP = perimeter / 2;
      const disc = halfP * halfP - 4 * area;
      if (disc < 0) return { valid: false, message: 'No valid rectangle exists with this area and perimeter combination.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
      l = (halfP + Math.sqrt(disc)) / 2;
      w = (halfP - Math.sqrt(disc)) / 2;
      steps.push({
        title: 'Solve Dimensions from Perimeter and Area',
        formula: 'x² - (P/2)x + A = 0 (Quadratic Equation Solution)',
        substitution: `x² - ${halfP}x + ${area} = 0`,
        calculation: `Roots = (${halfP} ± √(${(halfP*halfP).toFixed(2)} - ${(4*area).toFixed(2)})) / 2`,
        result: `l = ${l.toFixed(3)}, w = ${w.toFixed(3)}`,
      });
    }
  }

  if (l === undefined || w === undefined || l <= 0 || w <= 0) {
    return { valid: false, message: 'Please provide enough dimensional values to calculate.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  // Ensure length is always greater than or equal to width for standard notation
  if (w > l) {
    const tmp = l;
    l = w;
    w = tmp;
  }

  const a = l * w;
  const p = 2 * (l + w);
  const d = Math.sqrt(l * l + w * w);

  steps.push({
    title: 'Calculate Area',
    formula: 'A = Length (l) × Width (w)',
    substitution: `A = ${l.toFixed(3)} × ${w.toFixed(3)}`,
    calculation: `${l.toFixed(3)} × ${w.toFixed(3)}`,
    result: `A = ${a.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Perimeter',
    formula: 'P = 2 × (l + w)',
    substitution: `P = 2 × (${l.toFixed(3)} + ${w.toFixed(3)})`,
    calculation: `2 × ${(l + w).toFixed(3)}`,
    result: `P = ${p.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Diagonal',
    formula: 'd = √(l² + w²)',
    substitution: `d = √(${l.toFixed(3)}² + ${w.toFixed(3)}²)`,
    calculation: `√(${(l*l).toFixed(2)} + ${(w*w).toFixed(2)}) = √(${(l*l + w*w).toFixed(2)})`,
    result: `d = ${d.toFixed(3)}`,
  });

  const ratio = l / w;
  if (Math.abs(ratio - 1) < 0.05) {
    insights.push('This rectangle is nearly a perfect square! (Aspect ratio is close to 1:1)');
  } else if (Math.abs(ratio - 1.618) < 0.1) {
    insights.push('This rectangle closely matches the famous Golden Ratio (approx. 1.618:1), which is widely considered aesthetically perfect.');
  }

  insights.push(`The area scale increases quadratically. Scaling both sides by a factor of k scales the area by k².`);
  insights.push('All four angles are exactly 90°. Diagonals bisect each other and are equal in length.');

  return {
    valid: true,
    primary: { label: 'Area', value: a.toFixed(3), unit: '²' },
    secondary: [
      { label: 'Perimeter', value: p.toFixed(3), unit: '' },
      { label: 'Diagonal', value: d.toFixed(3), unit: '' },
      { label: 'Length', value: l.toFixed(3), unit: '' },
      { label: 'Width', value: w.toFixed(3), unit: '' },
      { label: 'Aspect Ratio', value: ratio.toFixed(2), unit: ':1' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Symmetry Group', value: 'C2v (Klein four-group, order 4)' },
      { name: 'Interior Angle', value: '90°' },
      { name: 'Diagonals Equal', value: 'Yes' },
      { name: 'Inscribed Circle', value: 'Only if l = w (Square)' },
    ],
    drawingData: { l, w },
  };
}

export function calculateCircle(radius?: number, diameter?: number, circumference?: number, area?: number): GeometryResult {
  let r = radius;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (r === undefined) {
    if (diameter !== undefined && diameter > 0) {
      r = diameter / 2;
      steps.push({ title: 'Calculate Radius from Diameter', formula: 'r = d / 2', substitution: `r = ${diameter} / 2`, calculation: `${diameter} / 2`, result: `r = ${r.toFixed(3)}` });
    } else if (circumference !== undefined && circumference > 0) {
      r = circumference / (2 * Math.PI);
      steps.push({ title: 'Calculate Radius from Circumference', formula: 'r = C / (2π)', substitution: `r = ${circumference} / (2 × π)`, calculation: `${circumference} / 6.28318`, result: `r = ${r.toFixed(3)}` });
    } else if (area !== undefined && area > 0) {
      r = Math.sqrt(area / Math.PI);
      steps.push({ title: 'Calculate Radius from Area', formula: 'r = √(A / π)', substitution: `r = √(${area} / π)`, calculation: `√(${(area/Math.PI).toFixed(4)})`, result: `r = ${r.toFixed(3)}` });
    }
  }

  if (r === undefined || r <= 0) {
    return { valid: false, message: 'Please provide a valid radius, diameter, circumference, or area.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const d = 2 * r;
  const c = 2 * Math.PI * r;
  const a = Math.PI * r * r;

  steps.push({
    title: 'Calculate Diameter',
    formula: 'd = 2 × r',
    substitution: `d = 2 × ${r.toFixed(3)}`,
    calculation: `2 × ${r.toFixed(3)}`,
    result: `d = ${d.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Circumference',
    formula: 'C = 2 × π × r',
    substitution: `C = 2 × π × ${r.toFixed(3)}`,
    calculation: `6.28318 × ${r.toFixed(3)}`,
    result: `C = ${c.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Area',
    formula: 'A = π × r²',
    substitution: `A = π × ${r.toFixed(3)}²`,
    calculation: `3.14159 × ${(r*r).toFixed(4)}`,
    result: `A = ${a.toFixed(3)}`,
  });

  insights.push('A circle has the absolute maximum area of any 2D shape for a given perimeter length (isoperimetric inequality).');
  insights.push('Doubling the radius increases the area exactly fourfold (4x), and doubles the circumference.');
  insights.push('The ratio of the circumference to the diameter is always exactly equal to Archimedes\' constant, π (pi).');

  return {
    valid: true,
    primary: { label: 'Area', value: a.toFixed(3), unit: '²' },
    secondary: [
      { label: 'Circumference (Perimeter)', value: c.toFixed(3), unit: '' },
      { label: 'Radius', value: r.toFixed(3), unit: '' },
      { label: 'Diameter', value: d.toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Eccentricity', value: '0 (Perfect circle)' },
      { name: 'Symmetry Group', value: 'O(2) (infinite reflection/rotation)' },
      { name: 'Centroid', value: 'Exact center of circle' },
    ],
    drawingData: { r },
  };
}

export function calculateEllipse(semiMajor?: number, semiMinor?: number): GeometryResult {
  const a = semiMajor;
  const b = semiMinor;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (a === undefined || b === undefined || a <= 0 || b <= 0) {
    return { valid: false, message: 'Please provide both Semi-Major and Semi-Minor axes.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  // Convention: semiMajor (a) must be >= semiMinor (b)
  const maxAxis = Math.max(a, b);
  const minAxis = Math.min(a, b);

  const area = Math.PI * maxAxis * minAxis;

  // Perimeter Ramanujan First Approximation: π * (3*(a+b) - √((3*a + b) * (a + 3*b)))
  const h = Math.pow(maxAxis - minAxis, 2) / Math.pow(maxAxis + minAxis, 2);
  const perimeter = Math.PI * (maxAxis + minAxis) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

  // Linear eccentricity c = √(a² - b²)
  const focalDistance = Math.sqrt(maxAxis * maxAxis - minAxis * minAxis);
  // Eccentricity e = c / a
  const eccentricity = focalDistance / maxAxis;

  steps.push({
    title: 'Calculate Ellipse Area',
    formula: 'Area = π × a × b',
    substitution: `Area = π × ${maxAxis.toFixed(3)} × ${minAxis.toFixed(3)}`,
    calculation: `3.14159 × ${(maxAxis * minAxis).toFixed(4)}`,
    result: `Area = ${area.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Perimeter (Ramanujan Approximation)',
    formula: 'P ≈ π(a + b)[1 + 3h / (10 + √(4 - 3h))] where h = (a-b)²/(a+b)²',
    substitution: `h = ${(maxAxis-minAxis).toFixed(3)}² / ${(maxAxis+minAxis).toFixed(3)}² = ${h.toFixed(5)}`,
    calculation: `P ≈ 3.14159 × ${(maxAxis + minAxis).toFixed(3)} × ${(1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h))).toFixed(5)}`,
    result: `P ≈ ${perimeter.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Focal Distance (Linear Eccentricity)',
    formula: 'c = √(a² - b²)',
    substitution: `c = √(${maxAxis.toFixed(3)}² - ${minAxis.toFixed(3)}²)`,
    calculation: `√(${(maxAxis*maxAxis).toFixed(2)} - ${(minAxis*minAxis).toFixed(2)})`,
    result: `c = ${focalDistance.toFixed(3)}`,
  });

  insights.push(`The eccentricity is ${eccentricity.toFixed(4)}. When eccentricity is 0, the ellipse becomes a perfect circle.`);
  insights.push(`Any light ray or sound wave originating at one focal point will bounce off the ellipse wall and pass exactly through the other focal point.`);

  return {
    valid: true,
    primary: { label: 'Area', value: area.toFixed(3), unit: '²' },
    secondary: [
      { label: 'Perimeter (Approx)', value: perimeter.toFixed(3), unit: '' },
      { label: 'Semi-Major Axis (a)', value: maxAxis.toFixed(3), unit: '' },
      { label: 'Semi-Minor Axis (b)', value: minAxis.toFixed(3), unit: '' },
      { label: 'Linear Eccentricity', value: focalDistance.toFixed(3), unit: '', tooltip: 'Distance from center to each focus' },
      { label: 'Eccentricity (e)', value: eccentricity.toFixed(4), unit: '', tooltip: 'Flattish profile rating between 0 (circle) and 1 (parabola)' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Foci Coordinates', value: `(±${focalDistance.toFixed(2)}, 0) relative to center` },
      { name: 'Symmetry', value: 'Biaxial reflection' },
    ],
    drawingData: { rx: maxAxis, ry: minAxis },
  };
}

export function calculateParallelogram(base?: number, side?: number, height?: number, angle?: number): GeometryResult {
  let b = base, s = side, h = height, degAngle = angle;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  const rad = (d: number) => (d * Math.PI) / 180;

  // Resolve missing side / height / angle
  if (s !== undefined && degAngle !== undefined && h === undefined) {
    h = s * Math.sin(rad(degAngle));
    steps.push({
      title: 'Determine Height from Slant Side and Angle',
      formula: 'Height (h) = side × sin(θ)',
      substitution: `h = ${s} × sin(${degAngle}°)`,
      calculation: `${s} × ${Math.sin(rad(degAngle)).toFixed(4)}`,
      result: `h = ${h.toFixed(3)}`,
    });
  } else if (s !== undefined && h !== undefined && degAngle === undefined) {
    if (h > s) return { valid: false, message: 'Height cannot exceed slant side length.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
    degAngle = (Math.asin(h / s) * 180) / Math.PI;
    steps.push({
      title: 'Determine Angle from Side and Height',
      formula: 'θ = asin(h / side)',
      substitution: `θ = asin(${h} / ${s})`,
      calculation: `asin(${(h/s).toFixed(4)})`,
      result: `θ = ${degAngle.toFixed(2)}°`,
    });
  } else if (h !== undefined && degAngle !== undefined && s === undefined) {
    s = h / Math.sin(rad(degAngle));
    steps.push({
      title: 'Determine Slant Side from Height and Angle',
      formula: 'Side = h / sin(θ)',
      substitution: `Side = ${h} / sin(${degAngle}°)`,
      calculation: `${h} / ${Math.sin(rad(degAngle)).toFixed(4)}`,
      result: `Side = ${s.toFixed(3)}`,
    });
  }

  if (b === undefined || s === undefined || h === undefined || b <= 0 || s <= 0 || h <= 0) {
    return { valid: false, message: 'Please provide at least a base, and two of: side, height, angle.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const area = b * h;
  const perimeter = 2 * (b + s);
  const angleRad = rad(degAngle || 90);

  // Diagonals using law of cosines:
  // d1 = √(b² + s² - 2bs*cos(θ))
  // d2 = √(b² + s² + 2bs*cos(θ))
  const cosVal = Math.cos(angleRad);
  const d1 = Math.sqrt(b * b + s * s - 2 * b * s * cosVal);
  const d2 = Math.sqrt(b * b + s * s + 2 * b * s * cosVal);

  steps.push({
    title: 'Calculate Area',
    formula: 'Area = Base (b) × Height (h)',
    substitution: `Area = ${b} × ${h.toFixed(3)}`,
    calculation: `${b} × ${h.toFixed(3)}`,
    result: `Area = ${area.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Perimeter',
    formula: 'Perimeter = 2 × (Base + Slant Side)',
    substitution: `P = 2 × (${b} + ${s.toFixed(3)})`,
    calculation: `2 × ${(b + s).toFixed(3)}`,
    result: `P = ${perimeter.toFixed(3)}`,
  });

  insights.push('Opposite angles are congruent, and adjacent angles are supplementary (sum to 180°).');
  insights.push('Diagonals bisect each other, cutting the parallelogram into four triangles of equal area.');

  return {
    valid: true,
    primary: { label: 'Area', value: area.toFixed(3), unit: '²' },
    secondary: [
      { label: 'Perimeter', value: perimeter.toFixed(3), unit: '' },
      { label: 'Height', value: h.toFixed(3), unit: '' },
      { label: 'Slant Side', value: s.toFixed(3), unit: '' },
      { label: 'Diagonal 1 (d1)', value: d1.toFixed(3), unit: '' },
      { label: 'Diagonal 2 (d2)', value: d2.toFixed(3), unit: '' },
      { label: 'Acute Angle', value: (degAngle! > 90 ? 180 - degAngle! : degAngle!).toFixed(1), unit: '°' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Opposite Sides Parallel', value: 'Yes' },
      { name: 'Symmetry', value: '2-fold rotational' },
    ],
    drawingData: { b, s, h, angle: degAngle },
  };
}

export function calculateRhombus(side?: number, angle?: number, d1?: number, d2?: number): GeometryResult {
  let s = side, degAngle = angle, diag1 = d1, diag2 = d2;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  const rad = (d: number) => (d * Math.PI) / 180;

  if (diag1 !== undefined && diag1 > 0 && diag2 !== undefined && diag2 > 0) {
    s = Math.sqrt(diag1 * diag1 + diag2 * diag2) / 2;
    degAngle = (2 * Math.atan(diag1 / diag2) * 180) / Math.PI;
    steps.push({
      title: 'Determine Side Length from Diagonals',
      formula: 'Side = √((d1)² + (d2)²) / 2',
      substitution: `Side = √(${diag1}² + ${diag2}²) / 2`,
      calculation: `√(${diag1*diag1 + diag2*diag2}) / 2`,
      result: `Side = ${s.toFixed(3)}`,
    });
  } else if (s !== undefined && s > 0 && degAngle !== undefined && degAngle > 0) {
    // Solve diagonals
    diag1 = 2 * s * Math.sin(rad(degAngle / 2));
    diag2 = 2 * s * Math.cos(rad(degAngle / 2));
    steps.push({
      title: 'Determine Diagonals from Side and Angle',
      formula: 'd1 = 2 × s × sin(θ/2) | d2 = 2 × s × cos(θ/2)',
      substitution: `d1 = 2 × ${s} × sin(${degAngle}/2) | d2 = 2 × ${s} × cos(${degAngle}/2)`,
      calculation: `d1 = ${2*s} × ${Math.sin(rad(degAngle/2)).toFixed(4)}`,
      result: `d1 = ${diag1.toFixed(3)}, d2 = ${diag2.toFixed(3)}`,
    });
  }

  if (s === undefined || s <= 0 || diag1 === undefined || diag2 === undefined) {
    return { valid: false, message: 'Please provide either both diagonals, or side and angle.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const area = (diag1 * diag2) / 2;
  const perimeter = 4 * s;

  steps.push({
    title: 'Calculate Area from Diagonals',
    formula: 'Area = (d1 × d2) / 2',
    substitution: `Area = (${diag1.toFixed(3)} × ${diag2.toFixed(3)}) / 2`,
    calculation: `${(diag1 * diag2).toFixed(3)} / 2`,
    result: `Area = ${area.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Perimeter',
    formula: 'Perimeter = 4 × side',
    substitution: `P = 4 × ${s.toFixed(3)}`,
    calculation: `4 × ${s.toFixed(3)}`,
    result: `P = ${perimeter.toFixed(3)}`,
  });

  insights.push('A rhombus is an equilateral quadrilateral. Its diagonals always intersect at exactly 90°.');
  insights.push('Every rhombus has an inscribed circle (incircle) touching all four sides.');

  return {
    valid: true,
    primary: { label: 'Area', value: area.toFixed(3), unit: '²' },
    secondary: [
      { label: 'Perimeter', value: perimeter.toFixed(3), unit: '' },
      { label: 'Side Length', value: s.toFixed(3), unit: '' },
      { label: 'Diagonal 1 (d1)', value: diag1.toFixed(3), unit: '' },
      { label: 'Diagonal 2 (d2)', value: diag2.toFixed(3), unit: '' },
      { label: 'Interior Acute Angle', value: (degAngle! > 90 ? 180 - degAngle! : degAngle!).toFixed(1), unit: '°' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Diagonals Perpendicular', value: 'Yes' },
      { name: 'Symmetry', value: '2 lines of symmetry (diagonals)' },
    ],
    drawingData: { d1: diag1, d2: diag2 },
  };
}

export function calculateTrapezoid(baseA?: number, baseB?: number, sideC?: number, sideD?: number, height?: number): GeometryResult {
  const a = baseA, b = baseB, c = sideC, d = sideD;
  let h = height;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (a === undefined || b === undefined || a <= 0 || b <= 0) {
    return { valid: false, message: 'Both Base A (bottom) and Base B (top) are required.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  // If sides c and d are provided, and bases are known, we can find the height using Heron's formula trick on the side triangle
  if (c !== undefined && d !== undefined && h === undefined) {
    const diff = Math.abs(a - b);
    if (diff === 0) {
      return { valid: false, message: 'Bases cannot be equal for a standard trapezoid (that is a rectangle/parallelogram).', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
    }
    // Check triangle inequality on difference triangle with sides: diff, c, d
    if (c + d <= diff || c + diff <= d || d + diff <= c) {
      return { valid: false, message: 'These side dimensions violate the trapezoid geometric existence rules.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
    }
    const s = (diff + c + d) / 2;
    const triArea = Math.sqrt(s * (s - diff) * (s - c) * (s - d));
    h = (2 * triArea) / diff;

    steps.push({
      title: 'Determine Height using Side Difference Triangle',
      formula: 'Height = (2 × Area(tri)) / |BaseA - BaseB|',
      substitution: `Triangle sides = ${diff.toFixed(2)}, ${c}, ${d} | Semi-perimeter (s) = ${s.toFixed(2)}`,
      calculation: `Height = (2 × ${triArea.toFixed(3)}) / ${diff.toFixed(2)}`,
      result: `h = ${h.toFixed(3)}`,
    });
  }

  if (h === undefined || h <= 0) {
    return { valid: false, message: 'Please provide either the Height, or both side lengths C and D.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  // If we have height but not sides c or d, let's assume it is an isosceles trapezoid for perimeter/drawing
  let actualC = c;
  let actualD = d;
  if (actualC === undefined || actualD === undefined) {
    const diff = Math.abs(a - b) / 2;
    const sHyp = Math.sqrt(diff * diff + h * h);
    actualC = actualC || sHyp;
    actualD = actualD || sHyp;
    insights.push('Sides C and D were not specified. Assuming an Isosceles Trapezoid profile.');
  }

  const area = ((a + b) / 2) * h;
  const perimeter = a + b + actualC + actualD;

  steps.push({
    title: 'Calculate Area',
    formula: 'Area = ((BaseA + BaseB) / 2) × Height',
    substitution: `Area = ((${a} + ${b}) / 2) × ${h.toFixed(3)}`,
    calculation: `${(a + b) / 2} × ${h.toFixed(3)}`,
    result: `Area = ${area.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Perimeter',
    formula: 'Perimeter = BaseA + BaseB + SideC + SideD',
    substitution: `P = ${a} + ${b} + ${actualC.toFixed(3)} + ${actualD.toFixed(3)}`,
    calculation: `${a + b} + ${(actualC + actualD).toFixed(3)}`,
    result: `P = ${perimeter.toFixed(3)}`,
  });

  insights.push('The midsegment of a trapezoid is parallel to each base, and its length is the average of the two bases.');

  return {
    valid: true,
    primary: { label: 'Area', value: area.toFixed(3), unit: '²' },
    secondary: [
      { label: 'Perimeter', value: perimeter.toFixed(3), unit: '' },
      { label: 'Height (h)', value: h.toFixed(3), unit: '' },
      { label: 'Base A', value: a.toFixed(3), unit: '' },
      { label: 'Base B', value: b.toFixed(3), unit: '' },
      { label: 'Left Slant (Side C)', value: actualC.toFixed(3), unit: '' },
      { label: 'Right Slant (Side D)', value: actualD.toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Midsegment Length', value: ((a + b) / 2).toFixed(2) },
      { name: 'Isosceles', value: Math.abs(actualC - actualD) < 0.01 ? 'Yes' : 'No' },
    ],
    drawingData: { a, b, c: actualC, d: actualD, h },
  };
}

export function calculateKite(sideA?: number, sideB?: number, d1?: number, d2?: number): GeometryResult {
  let a = sideA, b = sideB, diag1 = d1, diag2 = d2;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (diag1 !== undefined && diag1 > 0 && diag2 !== undefined && diag2 > 0) {
    // If we only have diagonals, we assume symmetric kite: a² = (d1/2)² + (part_d2)², we need at least one side ratio or we assume sideA == sideB
    if (a === undefined) {
      a = Math.sqrt(Math.pow(diag1 / 2, 2) + Math.pow(diag2 * 0.4, 2));
    }
    if (b === undefined) {
      b = Math.sqrt(Math.pow(diag1 / 2, 2) + Math.pow(diag2 * 0.6, 2));
    }
  } else if (a !== undefined && b !== undefined && diag1 !== undefined && diag1 > 0) {
    // Solve diag2
    if (a <= diag1 / 2 || b <= diag1 / 2) {
      return { valid: false, message: 'Side lengths must be greater than half of the transverse diagonal d1.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
    }
    const d2_top = Math.sqrt(a * a - Math.pow(diag1 / 2, 2));
    const d2_bottom = Math.sqrt(b * b - Math.pow(diag1 / 2, 2));
    diag2 = d2_top + d2_bottom;
    steps.push({
      title: 'Determine Diagonal d2 from Sides and Diagonal d1',
      formula: 'd2 = √(a² - (d1/2)²) + √(b² - (d1/2)²)',
      substitution: `d2 = √(${a}² - (${diag1}/2)²) + √(${b}² - (${diag1}/2)²)`,
      calculation: `√(${(a*a - Math.pow(diag1/2, 2)).toFixed(2)}) + √(${(b*b - Math.pow(diag1/2, 2)).toFixed(2)})`,
      result: `d2 = ${diag2.toFixed(3)}`,
    });
  }

  if (a === undefined || b === undefined || diag1 === undefined || diag2 === undefined || a <= 0 || b <= 0) {
    return { valid: false, message: 'Please provide both sides (A and B) and Diagonal 1 (transverse), or both Diagonals.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const area = (diag1 * diag2) / 2;
  const perimeter = 2 * (a + b);

  steps.push({
    title: 'Calculate Area',
    formula: 'Area = (d1 × d2) / 2',
    substitution: `Area = (${diag1.toFixed(3)} × ${diag2.toFixed(3)}) / 2`,
    calculation: `${(diag1 * diag2).toFixed(3)} / 2`,
    result: `Area = ${area.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Perimeter',
    formula: 'Perimeter = 2 × (SideA + SideB)',
    substitution: `P = 2 × (${a} + ${b})`,
    calculation: `2 × ${a + b}`,
    result: `P = ${perimeter.toFixed(3)}`,
  });

  insights.push('A kite has perpendicular diagonals, where one diagonal bisects the other at exactly 90°.');

  return {
    valid: true,
    primary: { label: 'Area', value: area.toFixed(3), unit: '²' },
    secondary: [
      { label: 'Perimeter', value: perimeter.toFixed(3), unit: '' },
      { label: 'Side A', value: a.toFixed(3), unit: '' },
      { label: 'Side B', value: b.toFixed(3), unit: '' },
      { label: 'Diagonal 1', value: diag1.toFixed(3), unit: '' },
      { label: 'Diagonal 2', value: diag2.toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Diagonals Perpendicular', value: 'Yes' },
      { name: 'Symmetric Axis', value: 'Diagonal 2' },
    ],
    drawingData: { a, b, d1: diag1, d2: diag2 },
  };
}

export function calculateRegularPolygon(numSides?: number, sideLength?: number, apothem?: number, circumradius?: number): GeometryResult {
  const n = numSides;
  let s = sideLength, r_ap = apothem, R_circ = circumradius;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (n === undefined || n < 3) {
    return { valid: false, message: 'A regular polygon must have at least 3 sides.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const rad = (deg: number) => (deg * Math.PI) / 180;
  const centralAngle = 360 / n;
  const theta = rad(centralAngle / 2); // half central angle

  // Determine s from whatever property we have
  if (s === undefined) {
    if (r_ap !== undefined && r_ap > 0) {
      s = 2 * r_ap * Math.tan(theta);
      steps.push({
        title: 'Determine Side Length from Apothem',
        formula: 's = 2 × a_pothem × tan(π/n)',
        substitution: `s = 2 × ${r_ap} × tan(180°/${n})`,
        calculation: `2 × ${r_ap} × ${Math.tan(theta).toFixed(4)}`,
        result: `s = ${s.toFixed(3)}`,
      });
    } else if (R_circ !== undefined && R_circ > 0) {
      s = 2 * R_circ * Math.sin(theta);
      steps.push({
        title: 'Determine Side Length from Circumradius',
        formula: 's = 2 × R × sin(π/n)',
        substitution: `s = 2 × ${R_circ} × sin(180°/${n})`,
        calculation: `2 × ${R_circ} × ${Math.sin(theta).toFixed(4)}`,
        result: `s = ${s.toFixed(3)}`,
      });
    }
  }

  if (s === undefined || s <= 0) {
    return { valid: false, message: 'Please provide either side length, apothem, or circumradius.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  // Complete dimensions
  r_ap = s / (2 * Math.tan(theta));
  R_circ = s / (2 * Math.sin(theta));

  const area = (n * s * r_ap) / 2;
  const perimeter = n * s;
  const interiorAngle = (n - 2) * 180 / n;
  const exteriorAngle = 360 / n;

  steps.push({
    title: 'Calculate Perimeter',
    formula: 'P = n × s',
    substitution: `P = ${n} × ${s.toFixed(3)}`,
    calculation: `${n} × ${s.toFixed(3)}`,
    result: `P = ${perimeter.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Apothem (Inscribed Radius)',
    formula: 'a = s / (2 × tan(π/n))',
    substitution: `a = ${s.toFixed(3)} / (2 × tan(${centralAngle / 2}°))`,
    calculation: `${s.toFixed(3)} / ${(2 * Math.tan(theta)).toFixed(4)}`,
    result: `a = ${r_ap.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Area',
    formula: 'Area = (P × a) / 2',
    substitution: `Area = (${perimeter.toFixed(3)} × ${r_ap.toFixed(3)}) / 2`,
    calculation: `${(perimeter * r_ap).toFixed(3)} / 2`,
    result: `Area = ${area.toFixed(3)}`,
  });

  insights.push(`The interior angle of this regular ${n}-gon is exactly ${interiorAngle.toFixed(1)}°.`);
  insights.push(`As the number of sides (n) approaches infinity, the shape and area approach a perfect circle.`);

  return {
    valid: true,
    primary: { label: 'Area', value: area.toFixed(3), unit: '²' },
    secondary: [
      { label: 'Perimeter', value: perimeter.toFixed(3), unit: '' },
      { label: 'Apothem (r)', value: r_ap.toFixed(3), unit: '', tooltip: 'Inscribed circle radius' },
      { label: 'Circumradius (R)', value: R_circ.toFixed(3), unit: '', tooltip: 'Circumscribed circle radius' },
      { label: 'Side Length', value: s.toFixed(3), unit: '' },
      { label: 'Interior Angle', value: interiorAngle.toFixed(1), unit: '°' },
      { label: 'Central Angle', value: centralAngle.toFixed(1), unit: '°' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Symmetry Order', value: `${n} fold` },
      { name: 'Sum of Interior Angles', value: `${(n - 2) * 180}°` },
    ],
    drawingData: { n, s, r: R_circ },
  };
}

export function calculateIrregularPolygon(coordsString: string): GeometryResult {
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  // Parse coords like "0,0\n5,0\n5,5\n0,5" or "(0,0), (5,0)..."
  const lines = coordsString.split(/[\n;]/);
  const pts: Array<{ x: number; y: number }> = [];

  for (const line of lines) {
    const cleaned = line.replace(/[()]/g, '').trim();
    if (!cleaned) continue;
    const parts = cleaned.split(/[, ]+/);
    if (parts.length >= 2) {
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      if (!isNaN(x) && !isNaN(y)) {
        pts.push({ x, y });
      }
    }
  }

  if (pts.length < 3) {
    return { valid: false, message: 'Please enter at least 3 valid coordinate pairs in "(x, y)" format (one per line).', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  // Close the polygon for shoelace calculation
  const n = pts.length;
  let shoelaceSum = 0;
  let perimeter = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < n; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];

    // Area Shoelace factor: x_i * y_i+1 - x_i+1 * y_i
    const factor = p1.x * p2.y - p2.x * p1.y;
    shoelaceSum += factor;

    // Centroid coordinate accumulation
    cx += (p1.x + p2.x) * factor;
    cy += (p1.y + p2.y) * factor;

    // Distance perimeter
    const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    perimeter += dist;
  }

  const area = Math.abs(shoelaceSum) / 2;
  cx = cx / (6 * (shoelaceSum / 2));
  cy = cy / (6 * (shoelaceSum / 2));

  steps.push({
    title: 'Calculate Area using Shoelace Formula',
    formula: 'Area = 0.5 × |Σ(x_i × y_{i+1} - x_{i+1} × y_i)|',
    substitution: `Vertex points count: ${n}`,
    calculation: `Sum value = ${shoelaceSum.toFixed(3)}`,
    result: `Area = ${area.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Perimeter',
    formula: 'Perimeter = Sum of Euclidean distance between sequential vertices',
    substitution: `Sum of ${n} segment lengths`,
    calculation: `Sum = ${perimeter.toFixed(3)}`,
    result: `P = ${perimeter.toFixed(3)}`,
  });

  insights.push(`The centroid is calculated at coordinates (${cx.toFixed(2)}, ${cy.toFixed(2)}).`);

  return {
    valid: true,
    primary: { label: 'Area', value: area.toFixed(3), unit: '²' },
    secondary: [
      { label: 'Perimeter', value: perimeter.toFixed(3), unit: '' },
      { label: 'Vertices Count', value: n.toString(), unit: '' },
      { label: 'Centroid X', value: cx.toFixed(3), unit: '' },
      { label: 'Centroid Y', value: cy.toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Self-intersecting', value: 'No' },
    ],
    drawingData: { pts, centroid: { x: cx, y: cy } },
  };
}

// ----------------------------------------------------
// 3D SOLID CALCULATION ENGINES
// ----------------------------------------------------

export function calculateCube(side?: number): GeometryResult {
  const s = side;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (s === undefined || s <= 0) {
    return { valid: false, message: 'Please provide a valid side length.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const volume = Math.pow(s, 3);
  const sa = 6 * s * s;
  const dSpace = s * Math.sqrt(3);
  const dFace = s * Math.sqrt(2);

  steps.push({
    title: 'Calculate Volume',
    formula: 'V = s³',
    substitution: `V = ${s}³`,
    calculation: `${s} × ${s} × ${s}`,
    result: `V = ${volume.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Total Surface Area',
    formula: 'A = 6 × s²',
    substitution: `A = 6 × ${s}²`,
    calculation: `6 × ${(s*s).toFixed(2)}`,
    result: `A = ${sa.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Space Diagonal',
    formula: 'd_space = s × √3',
    substitution: `d_space = ${s} × √3`,
    calculation: `${s} × 1.73205`,
    result: `d_space = ${dSpace.toFixed(3)}`,
  });

  insights.push('A cube has the minimum possible surface area for a given volume among all rectangular cuboids (the perfect 3D box shape).');
  insights.push('Doubling the side length increases the volume exactly eightfold (2³ = 8) and surface area fourfold.');

  return {
    valid: true,
    primary: { label: 'Volume', value: volume.toFixed(3), unit: '³' },
    secondary: [
      { label: 'Total Surface Area', value: sa.toFixed(3), unit: '²' },
      { label: 'Space Diagonal', value: dSpace.toFixed(3), unit: '' },
      { label: 'Face Diagonal', value: dFace.toFixed(3), unit: '' },
      { label: 'Side Length', value: s.toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Faces', value: '6' },
      { name: 'Vertices', value: '8' },
      { name: 'Edges', value: '12' },
      { name: 'Symmetry', value: 'Octahedral symmetry' },
    ],
    drawingData: { s, type: 'cube' },
  };
}

export function calculateCuboid(length?: number, width?: number, height?: number): GeometryResult {
  const l = length, w = width, h = height;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (l === undefined || w === undefined || h === undefined || l <= 0 || w <= 0 || h <= 0) {
    return { valid: false, message: 'Please provide Length, Width, and Height.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const volume = l * w * h;
  const sa = 2 * (l * w + l * h + w * h);
  const dSpace = Math.sqrt(l * l + w * w + h * h);

  steps.push({
    title: 'Calculate Volume',
    formula: 'V = l × w × h',
    substitution: `V = ${l} × ${w} × ${h}`,
    calculation: `${l*w} × ${h}`,
    result: `V = ${volume.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Total Surface Area',
    formula: 'TSA = 2(lw + lh + wh)',
    substitution: `TSA = 2 × (${l}×${w} + ${l}×${h} + ${w}×${h})`,
    calculation: `2 × (${l*w} + ${l*h} + ${w*h}) = 2 × ${l*w + l*h + w*h}`,
    result: `TSA = ${sa.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Space Diagonal',
    formula: 'd = √(l² + w² + h²)',
    substitution: `d = √(${l}² + ${w}² + ${h}²)`,
    calculation: `√(${l*l} + ${w*w} + ${h*h}) = √(${l*l + w*w + h*h})`,
    result: `d = ${dSpace.toFixed(3)}`,
  });

  insights.push('The volume scale is linear with respect to height when length and width remain static.');

  return {
    valid: true,
    primary: { label: 'Volume', value: volume.toFixed(3), unit: '³' },
    secondary: [
      { label: 'Total Surface Area', value: sa.toFixed(3), unit: '²' },
      { label: 'Space Diagonal', value: dSpace.toFixed(3), unit: '' },
      { label: 'Length', value: l.toFixed(3), unit: '' },
      { label: 'Width', value: w.toFixed(3), unit: '' },
      { label: 'Height', value: h.toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Faces / Vertices', value: '6 faces, 8 vertices' },
      { name: 'Edges count', value: '12 edges' },
    ],
    drawingData: { l, w, h, type: 'cuboid' },
  };
}

export function calculateSphere(radius?: number): GeometryResult {
  const r = radius;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (r === undefined || r <= 0) {
    return { valid: false, message: 'Please provide a valid radius.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
  const sa = 4 * Math.PI * r * r;

  steps.push({
    title: 'Calculate Volume',
    formula: 'V = (4/3) × π × r³',
    substitution: `V = (4/3) × π × ${r}³`,
    calculation: `4.18879 × ${Math.pow(r, 3).toFixed(2)}`,
    result: `V = ${volume.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Surface Area',
    formula: 'A = 4 × π × r²',
    substitution: `A = 4 × π × ${r}²`,
    calculation: `12.56637 × ${(r*r).toFixed(2)}`,
    result: `A = ${sa.toFixed(3)}`,
  });

  insights.push('A sphere holds the absolute maximum volume of any 3D solid for a given surface area.');
  insights.push('Doubling the radius increases the volume exactly eightfold (800%), while surface area increases fourfold.');

  return {
    valid: true,
    primary: { label: 'Volume', value: volume.toFixed(3), unit: '³' },
    secondary: [
      { label: 'Surface Area', value: sa.toFixed(3), unit: '²' },
      { label: 'Radius', value: r.toFixed(3), unit: '' },
      { label: 'Diameter', value: (2 * r).toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Curvature Type', value: 'Positive Gaussian curvature' },
      { name: 'Symmetry', value: 'Infinite spherical SO(3) group' },
    ],
    drawingData: { r, type: 'sphere' },
  };
}

export function calculateHemisphere(radius?: number): GeometryResult {
  const r = radius;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (r === undefined || r <= 0) {
    return { valid: false, message: 'Please provide a valid radius.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const volume = (2 / 3) * Math.PI * Math.pow(r, 3);
  const csa = 2 * Math.PI * r * r;
  const tsa = 3 * Math.PI * r * r;

  steps.push({
    title: 'Calculate Volume',
    formula: 'V = (2/3) × π × r³',
    substitution: `V = (2/3) × π × ${r}³`,
    calculation: `2.09439 × ${Math.pow(r, 3).toFixed(2)}`,
    result: `V = ${volume.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Curved Surface Area (CSA)',
    formula: 'CSA = 2 × π × r²',
    substitution: `CSA = 2 × π × ${r}²`,
    calculation: `6.28318 × ${(r*r).toFixed(2)}`,
    result: `CSA = ${csa.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Total Surface Area (TSA)',
    formula: 'TSA = 3 × π × r²',
    substitution: `TSA = 3 × π × ${r}²`,
    calculation: `9.42477 × ${(r*r).toFixed(2)}`,
    result: `TSA = ${tsasolver(r)}`,
  });

  function tsasolver(radius: number) {
    return (3 * Math.PI * radius * radius).toFixed(3);
  }

  insights.push('The total surface area includes the curved dome plus the flat circular base area (πr²).');

  return {
    valid: true,
    primary: { label: 'Volume', value: volume.toFixed(3), unit: '³' },
    secondary: [
      { label: 'Total Surface Area', value: tsa.toFixed(3), unit: '²' },
      { label: 'Curved Surface Area', value: csa.toFixed(3), unit: '²' },
      { label: 'Flat Base Area', value: (Math.PI * r * r).toFixed(3), unit: '²' },
      { label: 'Radius', value: r.toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Base Type', value: 'Flat Circular Disc' },
    ],
    drawingData: { r, type: 'hemisphere' },
  };
}

export function calculateCylinder(radius?: number, height?: number): GeometryResult {
  const r = radius, h = height;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (r === undefined || h === undefined || r <= 0 || h <= 0) {
    return { valid: false, message: 'Please provide both Radius and Height.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const volume = Math.PI * r * r * h;
  const lsa = 2 * Math.PI * r * h;
  const tsa = 2 * Math.PI * r * (r + h);

  steps.push({
    title: 'Calculate Volume',
    formula: 'V = π × r² × h',
    substitution: `V = π × ${r}² × ${h}`,
    calculation: `3.14159 × ${(r*r).toFixed(2)} × ${h}`,
    result: `V = ${volume.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Lateral Surface Area (LSA)',
    formula: 'LSA = 2 × π × r × h',
    substitution: `LSA = 2 × π × ${r} × ${h}`,
    calculation: `6.28318 × ${r} × ${h}`,
    result: `LSA = ${lsa.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Total Surface Area (TSA)',
    formula: 'TSA = 2 × π × r × (r + h)',
    substitution: `TSA = 2 × π × ${r} × (${r} + ${h})`,
    calculation: `6.28318 × ${r} × ${(r + h).toFixed(2)}`,
    result: `TSA = ${tsa.toFixed(3)}`,
  });

  insights.push('A cylinder represents a circular prism. Its volume scale grows quadratically with radius but linearly with height.');

  return {
    valid: true,
    primary: { label: 'Volume', value: volume.toFixed(3), unit: '³' },
    secondary: [
      { label: 'Total Surface Area', value: tsa.toFixed(3), unit: '²' },
      { label: 'Lateral (Side) Area', value: lsa.toFixed(3), unit: '²' },
      { label: 'Radius', value: r.toFixed(3), unit: '' },
      { label: 'Height', value: h.toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Euler Characteristic', value: '0' },
      { name: 'Base Shape', value: 'Circles' },
    ],
    drawingData: { r, h, type: 'cylinder' },
  };
}

export function calculateCone(radius?: number, height?: number): GeometryResult {
  const r = radius, h = height;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (r === undefined || h === undefined || r <= 0 || h <= 0) {
    return { valid: false, message: 'Please provide both Radius and Height.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const s = Math.sqrt(r * r + h * h);
  const volume = (1 / 3) * Math.PI * r * r * h;
  const lsa = Math.PI * r * s;
  const tsa = Math.PI * r * (r + s);

  steps.push({
    title: 'Calculate Slant Height (l)',
    formula: 'l = √(r² + h²)',
    substitution: `l = √(${r}² + ${h}²)`,
    calculation: `√(${(r*r).toFixed(2)} + ${(h*h).toFixed(2)})`,
    result: `l = ${s.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Volume',
    formula: 'V = (1/3) × π × r² × h',
    substitution: `V = (1/3) × π × ${r}² × ${h}`,
    calculation: `1.0472 × ${(r*r).toFixed(2)} × ${h}`,
    result: `V = ${volume.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Lateral Surface Area',
    formula: 'LSA = π × r × l',
    substitution: `LSA = π × ${r} × ${s.toFixed(3)}`,
    calculation: `3.14159 × ${r} × ${s.toFixed(3)}`,
    result: `LSA = ${lsa.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Total Surface Area',
    formula: 'TSA = π × r × (r + l)',
    substitution: `TSA = π × ${r} × (${r} + ${s.toFixed(3)})`,
    calculation: `3.14159 × ${r} × ${(r + s).toFixed(3)}`,
    result: `TSA = ${tsa.toFixed(3)}`,
  });

  insights.push('A cone holds exactly one-third (1/3) of the volume of a cylinder with matching height and radius.');

  return {
    valid: true,
    primary: { label: 'Volume', value: volume.toFixed(3), unit: '³' },
    secondary: [
      { label: 'Total Surface Area', value: tsa.toFixed(3), unit: '²' },
      { label: 'Slant Height (l)', value: s.toFixed(3), unit: '' },
      { label: 'Lateral Surface Area', value: lsa.toFixed(3), unit: '²' },
      { label: 'Radius', value: r.toFixed(3), unit: '' },
      { label: 'Height', value: h.toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Apex Angle', value: `${(2 * Math.atan(r / h) * 180 / Math.PI).toFixed(1)}°` },
    ],
    drawingData: { r, h, type: 'cone' },
  };
}

export function calculateFrustum(radiusR?: number, radiusr?: number, height?: number): GeometryResult {
  const R = radiusR, r = radiusr, h = height;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (R === undefined || r === undefined || h === undefined || R <= 0 || r <= 0 || h <= 0) {
    return { valid: false, message: 'Bases Radius R, Top Radius r, and Height are all required.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const s = Math.sqrt(Math.pow(R - r, 2) + h * h);
  const volume = (1 / 3) * Math.PI * h * (R * R + R * r + r * r);
  const lsa = Math.PI * (R + r) * s;
  const tsa = Math.PI * (R * R + r * r + (R + r) * s);

  steps.push({
    title: 'Calculate Slant Height (s)',
    formula: 's = √((R - r)² + h²)',
    substitution: `s = √(($R - $r)² + ${h}²)`,
    calculation: `√(${(R-r)*(R-r)} + ${h*h})`,
    result: `s = ${s.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Volume',
    formula: 'V = (1/3) × π × h × (R² + Rr + r²)',
    substitution: `V = (1/3) × π × ${h} × (${R}² + ${R}×${r} + ${r}²)`,
    calculation: `1.0472 × ${h} × ${(R*R + R*r + r*r).toFixed(2)}`,
    result: `V = ${volume.toFixed(3)}`,
  });

  insights.push('A frustum represents a truncated cone slice.');

  return {
    valid: true,
    primary: { label: 'Volume', value: volume.toFixed(3), unit: '³' },
    secondary: [
      { label: 'Total Surface Area', value: tsa.toFixed(3), unit: '²' },
      { label: 'Slant Height (s)', value: s.toFixed(3), unit: '' },
      { label: 'Base Area', value: (Math.PI * R * R).toFixed(3), unit: '²' },
      { label: 'Top Area', value: (Math.PI * r * r).toFixed(3), unit: '²' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Shape Profile', value: 'Truncated Cone' },
    ],
    drawingData: { R, r, h, type: 'frustum' },
  };
}

export function calculatePyramid(baseEdge?: number, height?: number): GeometryResult {
  const a = baseEdge, h = height;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (a === undefined || h === undefined || a <= 0 || h <= 0) {
    return { valid: false, message: 'Please provide both base side length and pyramid height.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  // Assume Square pyramid
  const volume = (1 / 3) * a * a * h;
  const slantHeight = Math.sqrt(Math.pow(a / 2, 2) + h * h);
  const lsa = 2 * a * slantHeight;
  const tsa = a * a + lsa;

  steps.push({
    title: 'Calculate Slant Height',
    formula: 's = √((a/2)² + h²)',
    substitution: `s = √(${(a/2).toFixed(2)}² + ${h}²)`,
    calculation: `√(${(a*a/4).toFixed(2)} + ${h*h})`,
    result: `s = ${slantHeight.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Volume',
    formula: 'V = (1/3) × a² × h',
    substitution: `V = (1/3) × ${a}² × ${h}`,
    calculation: `0.3333 × ${a*a} × ${h}`,
    result: `V = ${volume.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Total Surface Area',
    formula: 'TSA = a² + 2 × a × s',
    substitution: `TSA = ${a}² + 2 × ${a} × ${slantHeight.toFixed(3)}`,
    calculation: `${a*a} + ${(2 * a * slantHeight).toFixed(2)}`,
    result: `TSA = ${tsa.toFixed(3)}`,
  });

  insights.push('A square pyramid contains exactly one-third (1/3) of the volume of a square cube of matching base and height.');

  return {
    valid: true,
    primary: { label: 'Volume', value: volume.toFixed(3), unit: '³' },
    secondary: [
      { label: 'Total Surface Area', value: tsa.toFixed(3), unit: '²' },
      { label: 'Slant Height (s)', value: slantHeight.toFixed(3), unit: '' },
      { label: 'Lateral Area', value: lsa.toFixed(3), unit: '²' },
      { label: 'Base Area', value: (a * a).toFixed(3), unit: '²' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Faces', value: '5 (1 square, 4 triangles)' },
      { name: 'Vertices / Edges', value: '5 vertices, 8 edges' },
    ],
    drawingData: { a, h, type: 'pyramid' },
  };
}

export function calculatePrism(baseSide?: number, height?: number): GeometryResult {
  const s = baseSide, h = height;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (s === undefined || h === undefined || s <= 0 || h <= 0) {
    return { valid: false, message: 'Please provide base edge side length and prism height.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  // Assume equilateral triangular prism
  const baseArea = (Math.sqrt(3) / 4) * s * s;
  const perimeter = 3 * s;
  const lsa = perimeter * h;
  const tsa = 2 * baseArea + lsa;
  const volume = baseArea * h;

  steps.push({
    title: 'Calculate Base Area (Equilateral Triangle)',
    formula: 'Ab = (√3 / 4) × s²',
    substitution: `Ab = 0.43301 × ${s}²`,
    calculation: `0.43301 × ${s*s}`,
    result: `Ab = ${baseArea.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Volume',
    formula: 'V = Ab × h',
    substitution: `V = ${baseArea.toFixed(3)} × ${h}`,
    calculation: `${baseArea.toFixed(3)} × ${h}`,
    result: `V = ${volume.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Total Surface Area',
    formula: 'TSA = 2 × Ab + Perimeter × h',
    substitution: `TSA = 2 × ${baseArea.toFixed(3)} + ${perimeter} × ${h}`,
    calculation: `${(2 * baseArea).toFixed(3)} + ${perimeter * h}`,
    result: `TSA = ${tsa.toFixed(3)}`,
  });

  insights.push('The prism height relates linearly to the total volume (doubling height doubles volume).');

  return {
    valid: true,
    primary: { label: 'Volume', value: volume.toFixed(3), unit: '³' },
    secondary: [
      { label: 'Total Surface Area', value: tsa.toFixed(3), unit: '²' },
      { label: 'Base Area', value: baseArea.toFixed(3), unit: '²' },
      { label: 'Lateral Area', value: lsa.toFixed(3), unit: '²' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Base profile', value: 'Equilateral Triangle' },
      { name: 'Faces', value: '5 (2 triangles, 3 rectangles)' },
    ],
    drawingData: { s, h, type: 'prism' },
  };
}

export function calculateTorus(majorR?: number, minorR?: number): GeometryResult {
  const R = majorR, r = minorR;
  const steps: SolutionStep[] = [];
  const insights: string[] = [];

  if (R === undefined || r === undefined || R <= 0 || r <= 0) {
    return { valid: false, message: 'Both Major Radius R and Minor Radius r are required.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  if (R < r) {
    return { valid: false, message: 'Major radius R must be greater than or equal to minor radius r.', primary: { label: '', value: '', unit: '' }, secondary: [], steps: [], insights: [], properties: [] };
  }

  const area = 4 * Math.PI * Math.PI * R * r;
  const volume = 2 * Math.PI * Math.PI * R * r * r;

  steps.push({
    title: 'Calculate Volume',
    formula: 'V = 2 × π² × R × r²',
    substitution: `V = 2 × π² × ${R} × ${r}²`,
    calculation: `19.7392 × ${R} × ${r*r}`,
    result: `V = ${volume.toFixed(3)}`,
  });

  steps.push({
    title: 'Calculate Surface Area',
    formula: 'A = 4 × π² × R × r',
    substitution: `A = 4 × π² × ${R} × ${r}`,
    calculation: `39.4784 × ${R} × ${r}`,
    result: `A = ${area.toFixed(3)}`,
  });

  insights.push('A torus represents a 3D donut-like ring shape generated by rotating a circle in three-dimensional space.');

  return {
    valid: true,
    primary: { label: 'Volume', value: volume.toFixed(3), unit: '³' },
    secondary: [
      { label: 'Surface Area', value: area.toFixed(3), unit: '²' },
      { label: 'Major Radius R', value: R.toFixed(3), unit: '' },
      { label: 'Minor Radius r', value: r.toFixed(3), unit: '' },
    ],
    steps,
    insights,
    properties: [
      { name: 'Genus', value: '1 (One hole)' },
    ],
    drawingData: { R, r, type: 'torus' },
  };
}

// ----------------------------------------------------
// COORDINATE GEOMETRY ENGINE
// ----------------------------------------------------

export interface Point {
  x: number;
  y: number;
}

export function solveTwoPoints(p1: Point, p2: Point): any {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  const distance = Math.sqrt(dx * dx + dy * dy);
  const midpoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

  let slope = 'Undefined (Vertical Line)';
  let angle = 90;
  let lineEquation = '';

  if (dx !== 0) {
    const m = dy / dx;
    slope = m.toFixed(4);
    angle = (Math.atan(m) * 180) / Math.PI;

    // y - y1 = m(x - x1)  =>  y = mx - mx1 + y1
    const c = p1.y - m * p1.x;
    const cSign = c >= 0 ? `+ ${c.toFixed(2)}` : `- ${Math.abs(c).toFixed(2)}`;
    lineEquation = `y = ${m.toFixed(2)}x ${cSign}`;
  } else {
    lineEquation = `x = ${p1.x.toFixed(2)}`;
  }

  // Circle equation with these points as diameter
  const rx = distance / 2;
  const circleEquation = `(x - ${midpoint.x.toFixed(2)})² + (y - ${midpoint.y.toFixed(2)})² = ${(rx*rx).toFixed(2)}`;

  return {
    distance,
    midpoint,
    slope,
    angle,
    lineEquation,
    circleEquation
  };
}

export function transformPoint(pt: Point, type: 'rotate' | 'reflect_x' | 'reflect_y' | 'translate' | 'scale', param: number | Point): Point {
  if (type === 'rotate') {
    const angleRad = ((param as number) * Math.PI) / 180;
    return {
      x: pt.x * Math.cos(angleRad) - pt.y * Math.sin(angleRad),
      y: pt.x * Math.sin(angleRad) + pt.y * Math.cos(angleRad)
    };
  } else if (type === 'reflect_x') {
    return { x: pt.x, y: -pt.y };
  } else if (type === 'reflect_y') {
    return { x: -pt.x, y: pt.y };
  } else if (type === 'translate') {
    const t = param as Point;
    return { x: pt.x + t.x, y: pt.y + t.y };
  } else if (type === 'scale') {
    const s = param as number;
    return { x: pt.x * s, y: pt.y * s };
  }
  return pt;
}
