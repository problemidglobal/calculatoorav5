import { CalcMode, LengthUnit, VolumeUnit } from './types';

// Convert length unit to meters
export function toMeters(value: number, unit: LengthUnit): number {
  if (isNaN(value) || value <= 0) return 0;
  switch (unit) {
    case 'mm': return value * 0.001;
    case 'cm': return value * 0.01;
    case 'm': return value;
    case 'in': return value * 0.0254;
    case 'ft': return value * 0.3048;
    case 'yd': return value * 0.9144;
    default: return 0;
  }
}

// Convert volume in cubic meters to other units
export function fromM3(valM3: number, targetUnit: VolumeUnit): number {
  if (isNaN(valM3) || valM3 <= 0) return 0;
  switch (targetUnit) {
    case 'L': return valM3 * 1000;
    case 'm³': return valM3;
    case 'ft³': return valM3 * 35.314666721;
    case 'yd³': return valM3 * 1.3079506193;
    default: return 0;
  }
}

// Convert weight in kg to other weight units
export function convertWeight(kg: number, targetUnit: 'kg' | 'lb'): number {
  if (targetUnit === 'lb') {
    return kg * 2.2046226218;
  }
  return kg;
}

export interface CalculationResult {
  volumeM3: number;
  formula: string;
  substitution: string;
  calculation: string;
  resultStr: string;
}

export function runCalculation(
  mode: CalcMode,
  inputs: Record<string, string>,
  units: Record<string, LengthUnit>
): CalculationResult {
  let volumeM3 = 0;
  let formula = '';
  let substitution = '';
  let calculation = '';
  let resultStr = '';

  const parseVal = (key: string) => {
    const val = parseFloat(inputs[key]);
    return isNaN(val) ? 0 : val;
  };

  const getUnitSymbol = (key: string) => units[key] || 'ft';

  switch (mode) {
    case 'slab': {
      const length = parseVal('length');
      const width = parseVal('width');
      const thickness = parseVal('thickness');
      const lM = toMeters(length, getUnitSymbol('length'));
      const wM = toMeters(width, getUnitSymbol('width'));
      const tM = toMeters(thickness, getUnitSymbol('thickness'));

      volumeM3 = lM * wM * tM;

      formula = 'Volume = Length × Width × Thickness';
      substitution = `Volume = ${length} ${getUnitSymbol('length')} × ${width} ${getUnitSymbol('width')} × ${thickness} ${getUnitSymbol('thickness')}\n` +
                     `In meters: ${lM.toFixed(3)} m × ${wM.toFixed(3)} m × ${tM.toFixed(3)} m`;
      calculation = `${lM.toFixed(3)} × ${wM.toFixed(3)} × ${tM.toFixed(3)} = ${volumeM3.toFixed(4)} m³`;
      resultStr = `${volumeM3.toFixed(3)} m³ (${(volumeM3 * 1.308).toFixed(3)} yd³)`;
      break;
    }

    case 'footing': {
      const length = parseVal('length');
      const width = parseVal('width');
      const depth = parseVal('depth');
      const lM = toMeters(length, getUnitSymbol('length'));
      const wM = toMeters(width, getUnitSymbol('width'));
      const dM = toMeters(depth, getUnitSymbol('depth'));

      volumeM3 = lM * wM * dM;

      formula = 'Volume = Length × Width × Depth';
      substitution = `Volume = ${length} ${getUnitSymbol('length')} × ${width} ${getUnitSymbol('width')} × ${depth} ${getUnitSymbol('depth')}\n` +
                     `In meters: ${lM.toFixed(3)} m × ${wM.toFixed(3)} m × ${dM.toFixed(3)} m`;
      calculation = `${lM.toFixed(3)} × ${wM.toFixed(3)} × ${dM.toFixed(3)} = ${volumeM3.toFixed(4)} m³`;
      resultStr = `${volumeM3.toFixed(3)} m³ (${(volumeM3 * 1.308).toFixed(3)} yd³)`;
      break;
    }

    case 'column': {
      const colType = inputs['columnType'] || 'square';
      const height = parseVal('height');
      const hM = toMeters(height, getUnitSymbol('height'));

      if (colType === 'square') {
        const side = parseVal('side');
        const sM = toMeters(side, getUnitSymbol('side'));
        volumeM3 = sM * sM * hM;

        formula = 'Volume = Side² × Height';
        substitution = `Volume = (${side} ${getUnitSymbol('side')})² × ${height} ${getUnitSymbol('height')}\n` +
                       `In meters: (${sM.toFixed(3)} m)² × ${hM.toFixed(3)} m`;
        calculation = `(${sM.toFixed(3)} × ${sM.toFixed(3)}) × ${hM.toFixed(3)} = ${volumeM3.toFixed(4)} m³`;
      } else if (colType === 'rectangular') {
        const sideA = parseVal('sideA');
        const sideB = parseVal('sideB');
        const saM = toMeters(sideA, getUnitSymbol('sideA'));
        const sbM = toMeters(sideB, getUnitSymbol('sideB'));
        volumeM3 = saM * sbM * hM;

        formula = 'Volume = Side A × Side B × Height';
        substitution = `Volume = ${sideA} ${getUnitSymbol('sideA')} × ${sideB} ${getUnitSymbol('sideB')} × ${height} ${getUnitSymbol('height')}\n` +
                       `In meters: ${saM.toFixed(3)} m × ${sbM.toFixed(3)} m × ${hM.toFixed(3)} m`;
        calculation = `${saM.toFixed(3)} × ${sbM.toFixed(3)} × ${hM.toFixed(3)} = ${volumeM3.toFixed(4)} m³`;
      } else {
        // Circular
        const diameter = parseVal('diameter');
        const dM = toMeters(diameter, getUnitSymbol('diameter'));
        const radiusM = dM / 2;
        volumeM3 = Math.PI * Math.pow(radiusM, 2) * hM;

        formula = 'Volume = π × (Diameter / 2)² × Height';
        substitution = `Volume = π × (${diameter} ${getUnitSymbol('diameter')} / 2)² × ${height} ${getUnitSymbol('height')}\n` +
                       `In meters: π × (${radiusM.toFixed(3)} m)² × ${hM.toFixed(3)} m`;
        calculation = `3.14159 × ${Math.pow(radiusM, 2).toFixed(4)} × ${hM.toFixed(3)} = ${volumeM3.toFixed(4)} m³`;
      }
      resultStr = `${volumeM3.toFixed(3)} m³ (${(volumeM3 * 1.308).toFixed(3)} yd³)`;
      break;
    }

    case 'wall': {
      const length = parseVal('length');
      const height = parseVal('height');
      const thickness = parseVal('thickness');
      const lM = toMeters(length, getUnitSymbol('length'));
      const hM = toMeters(height, getUnitSymbol('height'));
      const tM = toMeters(thickness, getUnitSymbol('thickness'));

      volumeM3 = lM * hM * tM;

      formula = 'Volume = Length × Height × Thickness';
      substitution = `Volume = ${length} ${getUnitSymbol('length')} × ${height} ${getUnitSymbol('height')} × ${thickness} ${getUnitSymbol('thickness')}\n` +
                     `In meters: ${lM.toFixed(3)} m × ${hM.toFixed(3)} m × ${tM.toFixed(3)} m`;
      calculation = `${lM.toFixed(3)} × ${hM.toFixed(3)} × ${tM.toFixed(3)} = ${volumeM3.toFixed(4)} m³`;
      resultStr = `${volumeM3.toFixed(3)} m³`;
      break;
    }

    case 'stair': {
      const numSteps = parseVal('numSteps');
      const rise = parseVal('rise');
      const run = parseVal('run');
      const width = parseVal('width');
      const landingL = parseVal('landingL');
      const landingW = parseVal('landingW');
      const landingT = parseVal('landingT');

      const rM = toMeters(rise, getUnitSymbol('rise'));
      const runM = toMeters(run, getUnitSymbol('run'));
      const wM = toMeters(width, getUnitSymbol('width'));

      // Steps volume: Solid steps modeled as stacked rectangular blocks
      // Step i has volume = width × rise × run × i.
      // Total volume for n steps = width × rise × run × n × (n + 1) / 2
      const stepsVolM3 = numSteps > 0 ? (wM * rM * runM * (numSteps * (numSteps + 1)) / 2) : 0;

      // Landing (optional)
      let landingVolM3 = 0;
      if (landingL > 0 && landingW > 0 && landingT > 0) {
        const llM = toMeters(landingL, getUnitSymbol('landingL'));
        const lwM = toMeters(landingW, getUnitSymbol('landingW'));
        const ltM = toMeters(landingT, getUnitSymbol('landingT'));
        landingVolM3 = llM * lwM * ltM;
      }

      volumeM3 = stepsVolM3 + landingVolM3;

      formula = 'Volume = (Width × Rise × Run × N × (N + 1) / 2) + LandingVolume';
      substitution = `Steps count = ${numSteps}, Step dimensions = ${rise} ${getUnitSymbol('rise')} × ${run} ${getUnitSymbol('run')} × ${width} ${getUnitSymbol('width')}\n` +
                     `Landing dimensions = ${landingL || 0} × ${landingW || 0} × ${landingT || 0}\n` +
                     `Steps: ${wM.toFixed(3)}m × ${rM.toFixed(3)}m × ${runM.toFixed(3)}m × ${numSteps} × (${numSteps}+1) / 2 = ${stepsVolM3.toFixed(4)} m³\n` +
                     `Landing: ${landingVolM3.toFixed(4)} m³`;
      calculation = `${stepsVolM3.toFixed(4)} m³ + ${landingVolM3.toFixed(4)} m³ = ${volumeM3.toFixed(4)} m³`;
      resultStr = `${volumeM3.toFixed(3)} m³`;
      break;
    }

    case 'beam': {
      const length = parseVal('length');
      const width = parseVal('width');
      const depth = parseVal('depth');
      const lM = toMeters(length, getUnitSymbol('length'));
      const wM = toMeters(width, getUnitSymbol('width'));
      const dM = toMeters(depth, getUnitSymbol('depth'));

      volumeM3 = lM * wM * dM;

      formula = 'Volume = Length × Width × Depth';
      substitution = `Volume = ${length} ${getUnitSymbol('length')} × ${width} ${getUnitSymbol('width')} × ${depth} ${getUnitSymbol('depth')}\n` +
                     `In meters: ${lM.toFixed(3)} m × ${wM.toFixed(3)} m × ${dM.toFixed(3)} m`;
      calculation = `${lM.toFixed(3)} × ${wM.toFixed(3)} × ${dM.toFixed(3)} = ${volumeM3.toFixed(4)} m³`;
      resultStr = `${volumeM3.toFixed(3)} m³`;
      break;
    }

    case 'cylinder': {
      const diameter = parseVal('diameter');
      const height = parseVal('height');
      const dM = toMeters(diameter, getUnitSymbol('diameter'));
      const hM = toMeters(height, getUnitSymbol('height'));
      const radiusM = dM / 2;

      volumeM3 = Math.PI * Math.pow(radiusM, 2) * hM;

      formula = 'Volume = π × (Diameter / 2)² × Height';
      substitution = `Volume = π × (${diameter} ${getUnitSymbol('diameter')} / 2)² × ${height} ${getUnitSymbol('height')}\n` +
                     `In meters: π × (${radiusM.toFixed(3)} m)² × ${hM.toFixed(3)} m`;
      calculation = `3.14159 × ${Math.pow(radiusM, 2).toFixed(4)} × ${hM.toFixed(3)} = ${volumeM3.toFixed(4)} m³`;
      resultStr = `${volumeM3.toFixed(3)} m³`;
      break;
    }

    case 'tube':
    case 'ring': {
      const outerDia = parseVal('outerDia');
      const innerDia = parseVal('innerDia');
      const height = parseVal('height');
      const odM = toMeters(outerDia, getUnitSymbol('outerDia'));
      const idM = toMeters(innerDia, getUnitSymbol('innerDia'));
      const hM = toMeters(height, getUnitSymbol('height'));

      const rOuterM = odM / 2;
      const rInnerM = idM / 2;

      volumeM3 = Math.PI * (Math.pow(rOuterM, 2) - Math.pow(rInnerM, 2)) * hM;

      formula = 'Volume = π × ((Outer Diameter / 2)² - (Inner Diameter / 2)²) × Height';
      substitution = `Volume = π × ((${outerDia} ${getUnitSymbol('outerDia')}/2)² - (${innerDia} ${getUnitSymbol('innerDia')}/2)²) × ${height} ${getUnitSymbol('height')}\n` +
                     `In meters: π × ((${rOuterM.toFixed(3)} m)² - (${rInnerM.toFixed(3)} m)²) × ${hM.toFixed(3)} m`;
      calculation = `3.14159 × (${Math.pow(rOuterM, 2).toFixed(4)} - ${Math.pow(rInnerM, 2).toFixed(4)}) × ${hM.toFixed(3)} = ${volumeM3.toFixed(4)} m³`;
      resultStr = `${volumeM3.toFixed(3)} m³`;
      break;
    }

    case 'hole': {
      const depth = parseVal('depth');
      const diameter = parseVal('diameter');
      const numHoles = parseVal('numHoles') || 1;
      const dM = toMeters(depth, getUnitSymbol('depth'));
      const diaM = toMeters(diameter, getUnitSymbol('diameter'));
      const radiusM = diaM / 2;

      const singleVolM3 = Math.PI * Math.pow(radiusM, 2) * dM;
      volumeM3 = singleVolM3 * numHoles;

      formula = 'Volume = Number of Holes × π × (Diameter / 2)² × Depth';
      substitution = `Holes = ${numHoles}, Diameter = ${diameter} ${getUnitSymbol('diameter')}, Depth = ${depth} ${getUnitSymbol('depth')}\n` +
                     `In meters: ${numHoles} × π × (${radiusM.toFixed(3)} m)² × ${dM.toFixed(3)} m`;
      calculation = `${numHoles} × 3.14159 × ${Math.pow(radiusM, 2).toFixed(4)} × ${dM.toFixed(3)} = ${volumeM3.toFixed(4)} m³`;
      resultStr = `${volumeM3.toFixed(3)} m³`;
      break;
    }

    case 'curb': {
      const length = parseVal('length');
      const curbHeight = parseVal('curbHeight');
      const curbWidth = parseVal('curbWidth');
      const gutterWidth = parseVal('gutterWidth');
      const gutterThickness = parseVal('gutterThickness');

      const lM = toMeters(length, getUnitSymbol('length'));
      const chM = toMeters(curbHeight, getUnitSymbol('curbHeight'));
      const cwM = toMeters(curbWidth, getUnitSymbol('curbWidth'));
      const gwM = toMeters(gutterWidth, getUnitSymbol('gutterWidth'));
      const gtM = toMeters(gutterThickness, getUnitSymbol('gutterThickness'));

      // Combined cross-sectional area: Curb body + Gutter apron
      const areaM2 = (chM * cwM) + (gwM * gtM);
      volumeM3 = areaM2 * lM;

      formula = 'Volume = Length × ((Curb Height × Curb Width) + (Gutter Width × Gutter Thickness))';
      substitution = `Length = ${length}, Curb = ${curbHeight} × ${curbWidth}, Gutter = ${gutterWidth} × ${gutterThickness}\n` +
                     `Area = (${chM.toFixed(3)} m × ${cwM.toFixed(3)} m) + (${gwM.toFixed(3)} m × ${gtM.toFixed(3)} m) = ${areaM2.toFixed(4)} m²`;
      calculation = `${lM.toFixed(3)} m × ${areaM2.toFixed(4)} m² = ${volumeM3.toFixed(4)} m³`;
      resultStr = `${volumeM3.toFixed(3)} m³`;
      break;
    }

    case 'block': {
      const numBlocks = parseVal('numBlocks');
      const blockSize = inputs['blockSize'] || '8x8x16';
      
      let fillVolM3PerBlock = 0.00623; // default for 8x8x16 (0.22 cu ft)
      let blockLabel = '8" x 8" x 16"';

      if (blockSize === '6x8x16') {
        fillVolM3PerBlock = 0.00481; // 0.17 cu ft
        blockLabel = '6" x 8" x 16"';
      } else if (blockSize === '12x8x16') {
        fillVolM3PerBlock = 0.00934; // 0.33 cu ft
        blockLabel = '12" x 8" x 16"';
      } else if (blockSize === 'custom') {
        const customVolCuFt = parseVal('customFillVol');
        fillVolM3PerBlock = customVolCuFt * 0.0283168; // convert cu ft to m³
        blockLabel = `Custom block (${customVolCuFt} ft³)`;
      }

      volumeM3 = numBlocks * fillVolM3PerBlock;

      formula = 'Volume = Number of Blocks × Core Fill Volume per Block';
      substitution = `Blocks = ${numBlocks}, Size = ${blockLabel}, Volume per block = ${(fillVolM3PerBlock * 35.315).toFixed(3)} ft³ (${fillVolM3PerBlock.toFixed(5)} m³)`;
      calculation = `${numBlocks} × ${fillVolM3PerBlock.toFixed(5)} = ${volumeM3.toFixed(4)} m³`;
      resultStr = `${volumeM3.toFixed(3)} m³`;
      break;
    }

    default:
      break;
  }

  return {
    volumeM3: isNaN(volumeM3) ? 0 : volumeM3,
    formula,
    substitution,
    calculation,
    resultStr
  };
}
