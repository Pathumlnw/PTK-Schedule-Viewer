import * as fs from 'fs';
import { ValidationResult } from '@/types/timetable';

/**
 * Validate grade and class parameters
 * 
 * @param grade Grade level (1-6)
 * @param classNumber Class number
 * @returns Object containing validation result and error message if any
 */
export function validateTimetableParams(grade: number, classNumber: number): ValidationResult{
  // Check if grade is valid (1-6)
  if (isNaN(grade) || grade < 1 || grade > 6) {
    return {
      isValid: false,
      errorMessage: 'Grade must be a number between 1 and 6'
    };
  }

  // Check class number based on grade level
  if (grade <= 3) { // Junior high school (1-3)
    if (isNaN(classNumber) || classNumber < 1 || classNumber > 17) {
      return {
        isValid: false,
        errorMessage: 'For junior high school (grade 1-3), class number must be between 1 and 17'
      };
    }
  } else { // Senior high school (4-6)
    if (isNaN(classNumber) || classNumber < 1 || classNumber > 16) {
      return {
        isValid: false,
        errorMessage: 'For senior high school (grade 4-6), class number must be between 1 and 16'
      };
    }
  }

  return { isValid: true };
}

/**
 * Check if the timetable CSV file exists and is accessible
 * 
 * @param filePath Path to the CSV file
 * @returns Boolean indicating if the file is accessible
 */
export function isTimetableFileAccessible(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error('Error checking timetable file:', error);
    return false;
  }
}
