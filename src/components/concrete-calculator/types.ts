export type CalcMode =
  | 'slab'
  | 'footing'
  | 'column'
  | 'wall'
  | 'stair'
  | 'beam'
  | 'cylinder'
  | 'tube'
  | 'ring'
  | 'hole'
  | 'curb'
  | 'block';

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'yd';
export type VolumeUnit = 'L' | 'm³' | 'ft³' | 'yd³';
export type WeightUnit = 'kg' | 'lb';

export interface UnitOption {
  value: LengthUnit;
  label: string;
}

export interface VolumeUnitOption {
  value: VolumeUnit;
  label: string;
}

export interface BagSizeOption {
  id: string;
  label: string;
  weight: number; // in kg or lb depending on context
  weightUnit: WeightUnit;
  volumeYieldM3: number; // in cubic meters
}

export interface StepByStepStep {
  title: string;
  formula: string;
  substitution: string;
  calculation: string;
  result: string;
}
