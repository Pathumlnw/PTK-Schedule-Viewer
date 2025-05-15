// Types for the school timetable application

// Base types for timetable entries
export interface TimetableEntry {
  period: number;
  subject: string;
  teacher: string;
  room: string;
}

// JSON timetable format
export interface TimetablePeriodJson {
  subject: string;
  teacher: string;
  room: string;
}

export interface TimetableJsonData {
  class: string;
  program: string;
  semester: string;
  school: string;
  periods: string[];
  days: {
    [day: string]: (TimetablePeriodJson | string | null)[];
  };
}

export interface TimetableByDayResponse {
  [day: string]: TimetableEntry[];
}

export interface TimetableResponse {
  grade: number;
  classNumber: number;
  timetable: TimetableByDayResponse;
  // Additional properties from JSON file
  semester?: string;
  school?: string;
  program?: string;
  periods?: string[];
}

export interface ValidationResponse {
  valid: boolean;
  grade: number;
  classNumber: number;
  message: string;
}

export interface TimetableOverviewResponse {
  availableGrades: number[];
  gradeClassMap: Record<string, number[]>;
  juniorHighSchool: {
    grades: number[];
    classesPerGrade: number;
  };
  seniorHighSchool: {
    grades: number[];
    classesPerGrade: number;
  };
}

// Raw data from CSV
export interface TimetableData {
  headers: string[];
  data: Record<string, string>[];
}

// Hook return types
export interface TimetableHookResult {
  data: TimetableResponse | null;
  error: string | null;
  loading: boolean;
}

export interface TimetableOverviewHookResult {
  data: TimetableOverviewResponse | null;
  error: string | null;
  loading: boolean;
}

export interface ValidationHookResult {
  data: ValidationResponse | null;
  error: string | null;
  loading: boolean;
}

export interface TimetableRefetchHookResult extends TimetableHookResult {
  updateTimetable: (grade: number, classNumber: number) => Promise<TimetableResponse>;
  grade?: number;
  classNumber?: number;
}

// Utility function return types
export interface TimetableSummary {
  days: number;
  totalPeriods: number;
  uniqueSubjects: string[];
  uniqueTeachers: string[];
}

export interface ProcessedTimetableData extends TimetableResponse {
  summary: TimetableSummary;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// Component props
export interface TimetableDisplayProps {
  grade: number;
  classNumber: number;
}

// API endpoints configuration
export interface ApiEndpoints {
  TIMETABLE_BASE: string;
  TIMETABLE_BY_GRADE_CLASS: (grade: number, classNumber: number) => string;
  VALIDATE_GRADE_CLASS: (grade: number, classNumber: number) => string;
}

// Timetable service interface
export interface TimetableService {
  getTimetableOverview: () => Promise<TimetableOverviewResponse>;
  getTimetableByGradeAndClass: (grade: number, classNumber: number) => Promise<TimetableResponse>;
  validateGradeAndClass: (grade: number, classNumber: number) => Promise<ValidationResponse>;
}
