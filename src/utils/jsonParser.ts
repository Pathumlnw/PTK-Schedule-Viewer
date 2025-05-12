import fs from 'fs';
import path from 'path';
import { TimetableData, TimetableEntry, TimetableByDayResponse, TimetableJsonData } from '@/types/timetable';

/**
 * Parse a JSON timetable file
 * @param filePath Path to the JSON file
 * @returns Parsed timetable data
 */
export function parseTimetableJson(filePath: string): TimetableJsonData | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const timetableData: TimetableJsonData = JSON.parse(fileContent);
    return timetableData;
  } catch (error) {
    console.error(`Error parsing JSON timetable: ${error}`);
    return null;
  }
}

/**
 * Extract grade and class number from the class string (e.g., "6/14" -> { grade: 6, classNumber: 14 })
 */
export function extractGradeAndClass(classString: string): { grade: number; classNumber: number } | null {
  const match = classString.match(/^(\d+)\/(\d+)$/);
  if (!match) return null;
  
  return {
    grade: parseInt(match[1], 10),
    classNumber: parseInt(match[2], 10)
  };
}

/**
 * Get timetable data for a specific grade and class
 */
export function getTimetableJsonForClass(grade: number, classNumber: number): TimetableJsonData | null {
  const filePath = path.join(process.cwd(), 'public', 'timetables', 'timetable.json');
  
  if (!fs.existsSync(filePath)) {
    console.error('Timetable JSON file not found');
    return null;
  }
  
  const timetableData = parseTimetableJson(filePath);
  if (!timetableData) return null;
  
  // Extract grade and class from the timetable data
  const classInfo = extractGradeAndClass(timetableData.class);
  if (!classInfo) return null;
  
  // Check if it matches the requested grade and class
  if (classInfo.grade === grade && classInfo.classNumber === classNumber) {
    return timetableData;
  }
  
  // If we have multiple timetables in the future, we could check them all
  return null;
}

/**
 * Convert the JSON timetable format to the API response format
 */
export function convertJsonToTimetableResponse(jsonData: TimetableJsonData): TimetableByDayResponse {
  const timetable: TimetableByDayResponse = {};
  
  Object.entries(jsonData.days).forEach(([day, periods]) => {
    timetable[day] = periods.map((period, index) => {
      // Handle lunch break or null periods
      if (period === null || period === 'พักกลางวัน') {
        return {
          period: index,
          subject: period === 'พักกลางวัน' ? 'พักกลางวัน' : '',
          teacher: '',
          room: ''
        };
      }
      
      return {
        period: index,
        subject: period.subject || '',
        teacher: period.teacher || '',
        room: period.room || ''
      };
    });
  });
  
  return timetable;
}
