import {
  ApiEndpoints,
  TimetableService,
  TimetableResponse,
  TimetableOverviewResponse,
  ValidationResponse,
} from "@/types/timetable";

// API endpoints
export const API_ENDPOINTS: ApiEndpoints = {
  TIMETABLE_BASE: "/api/timetable",
  TIMETABLE_BY_GRADE_CLASS: (grade: number, classNumber: number) =>
    `/api/timetable/${grade}/${classNumber}`,
  VALIDATE_GRADE_CLASS: (grade: number, classNumber: number) =>
    `/api/validate/${grade}/${classNumber}`,
};

/**
 * API Service for the School Timetable application
 */
export const timetableService: TimetableService = {
  /**
   * Get general information about available timetables
   */
  getTimetableOverview: async (): Promise<TimetableOverviewResponse> => {
    const response = await fetch(API_ENDPOINTS.TIMETABLE_BASE);

    if (!response.ok) {
      throw new Error(`Failed to fetch overview: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Get timetable for a specific grade and class
   */
  getTimetableByGradeAndClass: async (
    grade: number,
    classNumber: number
  ): Promise<TimetableResponse> => {
    const response = await fetch(
      API_ENDPOINTS.TIMETABLE_BY_GRADE_CLASS(grade, classNumber)
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch timetable: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Validate if a grade and class combination is valid
   */
  validateGradeAndClass: async (
    grade: number,
    classNumber: number
  ): Promise<ValidationResponse> => {
    const response = await fetch(
      API_ENDPOINTS.VALIDATE_GRADE_CLASS(grade, classNumber)
    );

    if (!response.ok) {
      throw new Error(`Validation request failed: ${response.statusText}`);
    }

    return await response.json();
  },
};
