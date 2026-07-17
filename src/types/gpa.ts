export interface Course {
  id: string;
  name: string;
  credits: string; // Keeps input truly empty
  grade: string; // Grade letter/percentage/value
  weightType: 'none' | 'honors' | 'ap' | 'ib' | 'college' | 'custom';
  customWeightPoints: string;
  category: string;
  notes: string;
}

export interface Semester {
  id: string;
  name: string;
  year: string;
  courses: Course[];
}

export interface GradeScalePoint {
  label: string;
  value: number;
  minPercent?: number;
  maxPercent?: number;
}

export interface GradeScale {
  id: string;
  name: string;
  max: number;
  grades: GradeScalePoint[];
}
