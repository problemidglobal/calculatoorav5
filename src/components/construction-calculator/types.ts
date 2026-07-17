export type UnitSystem = 'metric' | 'imperial';

export type LengthUnit = 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft' | 'yd';
export type AreaUnit = 'sq_m' | 'sq_ft';
export type VolumeUnit = 'cu_m' | 'cu_yd' | 'liter';

export type ProjectType =
  | 'residential_house'
  | 'apartment'
  | 'garage'
  | 'driveway'
  | 'patio'
  | 'foundation'
  | 'wall'
  | 'roof'
  | 'floor'
  | 'room'
  | 'custom_project';

export interface RoomData {
  id: string;
  name: string;
  length: string; // starts empty
  width: string;  // starts empty
  height: string; // starts empty
}

export interface CalculatorState {
  unitSystem: UnitSystem;
  projectType: ProjectType;
  
  // Module 1: Area Calculator
  areaLength: string;
  areaWidth: string;
  areaLengthUnit: LengthUnit;
  areaWidthUnit: LengthUnit;

  // Module 2: Volume Calculator
  volumeLength: string;
  volumeWidth: string;
  volumeHeight: string;
  volumeLengthUnit: LengthUnit;
  volumeWidthUnit: LengthUnit;
  volumeHeightUnit: LengthUnit;

  // Module 3: Material Quantity Estimator
  materialType: string; // concrete, brick, etc.
  
  // Project Cost Estimator inputs
  materialCost: string;
  laborCostInput: string;
  equipmentCost: string;
  transportationCost: string;
  wastePercent: string;
  taxPercent: string;
  otherCosts: string;

  // Material Waste Estimator
  wasteEstPercent: string;

  // Labor Estimator inputs
  workersCount: string;
  workingHoursPerDay: string;
  hourlyRate: string;

  // Project Timeline inputs
  workingDaysPerWeek: string;
  crewSize: string;
  estimatedDailyProgress: string; // in sq m or sq ft depending on unit

  // Rooms list
  rooms: RoomData[];
}
