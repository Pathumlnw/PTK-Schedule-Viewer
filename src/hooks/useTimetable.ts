'use client';

import { useState, useEffect } from 'react';
import { timetableService } from '@/services/timetableService';
import { 
  TimetableResponse, 
  TimetableOverviewResponse, 
  ValidationResponse, 
  TimetableHookResult,
  TimetableOverviewHookResult,
  ValidationHookResult,
  TimetableRefetchHookResult
} from '@/types/timetable';

/**
 * Hook for fetching timetable overview data
 */
export function useTimetableOverview(): TimetableOverviewHookResult {
  const [data, setData] = useState<TimetableOverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await timetableService.getTimetableOverview();
        setData(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, error, loading };
}

/**
 * Hook for fetching a specific timetable by grade and class
 */
export function useTimetable(grade: number, classNumber: number): TimetableHookResult {
  const [data, setData] = useState<TimetableResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await timetableService.getTimetableByGradeAndClass(grade, classNumber);
        setData(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (grade && classNumber) {
      fetchData();
    }
  }, [grade, classNumber]);

  return { data, error, loading };
}

/**
 * Hook for validating a grade and class combination
 */
export function useValidateGradeClass(grade: number, classNumber: number): ValidationHookResult {
  const [data, setData] = useState<ValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await timetableService.validateGradeAndClass(grade, classNumber);
        setData(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (grade && classNumber) {
      fetchData();
    }
  }, [grade, classNumber]);

  return { data, error, loading };
}

/**
 * Utility hook for fetching timetable data with manual refetching
 */
export function useTimetableWithRefetch(initialGrade?: number, initialClass?: number): TimetableRefetchHookResult {
  const [grade, setGrade] = useState<number | undefined>(initialGrade);
  const [classNumber, setClassNumber] = useState<number | undefined>(initialClass);
  const [data, setData] = useState<TimetableResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchTimetable = async (gradeToFetch: number, classToFetch: number): Promise<TimetableResponse> => {
    try {
      setLoading(true);
      const response = await timetableService.getTimetableByGradeAndClass(gradeToFetch, classToFetch);
      setData(response);
      setError(null);
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMsg);
      setData(null);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Function to update the grade and class and fetch new data
  const updateTimetable = async (newGrade: number, newClass: number): Promise<TimetableResponse> => {
    setGrade(newGrade);
    setClassNumber(newClass);
    return await fetchTimetable(newGrade, newClass);
  };

  // Initial fetch if both grade and class are provided
  useEffect(() => {
    if (grade !== undefined && classNumber !== undefined) {
      fetchTimetable(grade, classNumber);
    }
  }, [grade, classNumber]); // Added dependency array

  return {
    data,
    error,
    loading,
    updateTimetable,
    grade,
    classNumber
  };
}
