// Fuel Calculator mathematical helper functions and unit conversions

export interface FuelUnits {
  distance: 'km' | 'mi';
  volume: 'L' | 'gal_us' | 'gal_uk';
  economy: 'L_100km' | 'km_L' | 'mpg_us' | 'mpg_uk';
}

// Conversion Constants
export const MILE_TO_KM = 1.609344;
export const KM_TO_MILE = 0.621371192;
export const US_GAL_TO_L = 3.785411784;
export const L_TO_US_GAL = 0.264172052;
export const UK_GAL_TO_L = 4.54609;
export const L_TO_UK_GAL = 0.219969248;
export const US_GAL_TO_UK_GAL = 0.832674184;
export const UK_GAL_TO_US_GAL = 1.20095;

/**
 * Convert distance values
 */
export function convertDistance(val: number, from: 'km' | 'mi', to: 'km' | 'mi'): number {
  if (from === to) return val;
  return from === 'km' ? val * KM_TO_MILE : val * MILE_TO_KM;
}

/**
 * Convert fuel volume values
 */
export function convertVolume(val: number, from: 'L' | 'gal_us' | 'gal_uk', to: 'L' | 'gal_us' | 'gal_uk'): number {
  if (from === to) return val;
  
  // Convert from source to Liters first
  let liters = val;
  if (from === 'gal_us') liters = val * US_GAL_TO_L;
  else if (from === 'gal_uk') liters = val * UK_GAL_TO_L;

  // Convert from Liters to target
  if (to === 'L') return liters;
  if (to === 'gal_us') return liters * L_TO_US_GAL;
  if (to === 'gal_uk') return liters * L_TO_UK_GAL;
  return liters;
}

/**
 * Convert fuel economy values
 */
export function convertEconomy(val: number, from: 'L_100km' | 'km_L' | 'mpg_us' | 'mpg_uk', to: 'L_100km' | 'km_L' | 'mpg_us' | 'mpg_uk'): number {
  if (val <= 0) return 0;
  if (from === to) return val;

  // Convert source to L/100km first
  let l100 = 0;
  if (from === 'L_100km') {
    l100 = val;
  } else if (from === 'km_L') {
    l100 = 100 / val;
  } else if (from === 'mpg_us') {
    l100 = 235.214583 / val;
  } else if (from === 'mpg_uk') {
    l100 = 282.480936 / val;
  }

  if (l100 <= 0) return 0;

  // Convert L/100km to target
  if (to === 'L_100km') return l100;
  if (to === 'km_L') return 100 / l100;
  if (to === 'mpg_us') return 235.214583 / l100;
  if (to === 'mpg_uk') return 282.480936 / l100;
  
  return l100;
}

/**
 * Apply advanced adjustments to Fuel Economy
 * Optional inputs can degrade the fuel efficiency.
 */
export function getAdjustedEconomy(
  baseEco: number,
  ecoType: 'L_100km' | 'km_L' | 'mpg_us' | 'mpg_uk',
  options: {
    vehicleType?: string;
    fuelType?: string;
    cityPct?: number; // 0 to 100
    trafficLevel?: 'low' | 'medium' | 'high';
    acUsage?: boolean;
    trailerTowing?: boolean;
    cargoWeight?: number; // in lbs
    avgSpeed?: number; // mph
  }
): { adjusted: number; percentageDrop: number; factors: string[] } {
  if (baseEco <= 0) return { adjusted: baseEco, percentageDrop: 0, factors: [] };

  // Work in MPG US for adjustment calculations, as standard coefficients are defined there
  const mpgUsBase = convertEconomy(baseEco, ecoType, 'mpg_us');
  let adjustedMpg = mpgUsBase;
  let penaltyTotal = 0;
  const factors: string[] = [];

  // AC Penalty (~8%)
  if (options.acUsage) {
    adjustedMpg *= 0.92;
    penaltyTotal += 8;
    factors.push('A/C active (-8% efficiency)');
  }

  // Trailer Towing Penalty (~25%)
  if (options.trailerTowing) {
    adjustedMpg *= 0.75;
    penaltyTotal += 25;
    factors.push('Towing a trailer (-25% efficiency)');
  }

  // Cargo Penalty (~1% per 100 lbs / 45kg)
  if (options.cargoWeight && options.cargoWeight > 0) {
    const cargoPenalty = Math.min(20, (options.cargoWeight / 100) * 1);
    adjustedMpg *= (1 - cargoPenalty / 100);
    penaltyTotal += cargoPenalty;
    factors.push(`Extra cargo weight of ${options.cargoWeight} lbs (-${cargoPenalty.toFixed(1)}% efficiency)`);
  }

  // Traffic Level Penalty
  if (options.trafficLevel === 'medium') {
    adjustedMpg *= 0.95;
    penaltyTotal += 5;
    factors.push('Medium city traffic (-5% efficiency)');
  } else if (options.trafficLevel === 'high') {
    adjustedMpg *= 0.85;
    penaltyTotal += 15;
    factors.push('Heavy congestion traffic (-15% efficiency)');
  }

  // City vs Highway Driving Mixture
  // If City % is higher than 55% (standard mix is 55/45), degrade efficiency
  if (options.cityPct !== undefined) {
    const cityDelta = options.cityPct - 55;
    if (cityDelta > 0) {
      // 100% city gets ~20% worse economy than mixed
      const cityPenalty = (cityDelta / 45) * 12;
      adjustedMpg *= (1 - cityPenalty / 100);
      penaltyTotal += cityPenalty;
      factors.push(`High city driving ratio of ${options.cityPct}% (-${cityPenalty.toFixed(1)}% efficiency)`);
    } else if (cityDelta < 0) {
      // 100% highway gets ~15% better economy
      const highwayBonus = (Math.abs(cityDelta) / 55) * 10;
      adjustedMpg *= (1 + highwayBonus / 100);
      factors.push(`High highway driving ratio (-${highwayBonus.toFixed(1)}% fuel consumption)`);
    }
  }

  // Speed Penalty: Optimal is around 50-60 mph.
  if (options.avgSpeed && options.avgSpeed > 0) {
    if (options.avgSpeed > 65) {
      // Efficiency drops rapidly above 65 mph (approx 1.5% drop per mph)
      const overSpeed = options.avgSpeed - 65;
      const speedPenalty = Math.min(40, overSpeed * 1.5);
      adjustedMpg *= (1 - speedPenalty / 100);
      penaltyTotal += speedPenalty;
      factors.push(`Excess speed of ${options.avgSpeed} mph (-${speedPenalty.toFixed(1)}% efficiency)`);
    } else if (options.avgSpeed < 40 && options.avgSpeed > 0) {
      // Low speed stop & go penalty
      const underSpeed = 40 - options.avgSpeed;
      const speedPenalty = Math.min(25, underSpeed * 0.8);
      adjustedMpg *= (1 - speedPenalty / 100);
      penaltyTotal += speedPenalty;
      factors.push(`Slow start-stop speed of ${options.avgSpeed} mph (-${speedPenalty.toFixed(1)}% efficiency)`);
    }
  }

  // Convert back to original unit system
  const finalAdjusted = convertEconomy(adjustedMpg, 'mpg_us', ecoType);
  const percentageDrop = ((mpgUsBase - adjustedMpg) / mpgUsBase) * 100;

  return {
    adjusted: finalAdjusted,
    percentageDrop: Math.max(0, percentageDrop),
    factors
  };
}

/**
 * Calculate Carbon Dioxide (CO2) emissions based on fuel consumed.
 * Standard factors:
 * - Gasoline: 2.31 kg CO2 per Liter (~8.887 kg / 19.6 lbs per US gallon)
 * - Diesel: 2.68 kg CO2 per Liter (~10.180 kg / 22.4 lbs per US gallon)
 */
export function getCarbonEmissions(litersUsed: number, fuelType = 'gasoline'): { kg: number; lbs: number } {
  const factor = fuelType.toLowerCase() === 'diesel' ? 2.68 : 2.31; // kg CO2 per liter
  const kg = litersUsed * factor;
  const lbs = kg * 2.20462262;
  return { kg, lbs };
}

/**
 * Calculate Fuel Efficiency Score (1 to 100)
 */
export function getEfficiencyScore(mpgUs: number): { score: number; label: string; color: string } {
  if (mpgUs <= 0) return { score: 0, label: 'N/A', color: 'neutral' };
  
  // Exponential scoring where 50 MPG is 100 points, 10 MPG is 20 points
  let score = Math.round((mpgUs / 50) * 100);
  score = Math.max(5, Math.min(100, score));

  if (score >= 90) return { score, label: 'Excellent (Eco-Leader) ✅', color: 'emerald' };
  if (score >= 75) return { score, label: 'Good (Very Efficient) 🟢', color: 'teal' };
  if (score >= 50) return { score, label: 'Average (Standard) 🟡', color: 'amber' };
  return { score, label: 'Low Efficiency (Fuel Guzzler) 🔴', color: 'rose' };
}
