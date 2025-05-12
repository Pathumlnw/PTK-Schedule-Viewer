import { timetableService } from '@/services/timetableService';
import { 
  TimetableResponse, 
  TimetableSummary, 
  ProcessedTimetableData, 
  TimetableByDayResponse, 
  TimetableEntry 
} from '@/types/timetable';

/**
 * Example utility function showing how to use the timetable service directly 
 * (without React hooks) for components or utilities that don't need React state
 */
export async function fetchAndProcessTimetableData(grade: number, classNumber: number): Promise<ProcessedTimetableData | null> {
  try {
    // First validate the grade and class
    const validation = await timetableService.validateGradeAndClass(grade, classNumber);
    
    if (!validation.valid) {
      console.error(`Invalid grade/class combination: ${validation.message}`);
      return null;
    }
    
    // Then fetch the timetable
    const timetable = await timetableService.getTimetableByGradeAndClass(grade, classNumber);
    
    // Process the data in some way if needed
    const processedData: ProcessedTimetableData = {
      ...timetable,
      summary: generateTimetableSummary(timetable.timetable)
    };
    
    return processedData;
  } catch (error) {
    console.error('Error fetching timetable data:', error);
    return null;
  }
}

/**
 * Example function to generate a summary of the timetable
 */
function generateTimetableSummary(timetableByDay: TimetableByDayResponse): TimetableSummary {
  const days = Object.keys(timetableByDay);
  const subjects = new Set<string>();
  const teachers = new Set<string>();
  
  // Collect unique subjects and teachers
  days.forEach(day => {
    timetableByDay[day].forEach(period => {
      subjects.add(period.subject);
      teachers.add(period.teacher);
    });
  });
  
  return {
    days: days.length,
    totalPeriods: days.reduce((sum, day) => sum + timetableByDay[day].length, 0),
    uniqueSubjects: Array.from(subjects),
    uniqueTeachers: Array.from(teachers),
  };
}

/**
 * Function to export timetable data to CSV format
 */
export function exportTimetableToCSV(timetable: TimetableResponse): string {
  const { grade, classNumber, timetable: timetableByDay, semester, school, program } = timetable;
  
  // Create CSV header with additional metadata fields
  let csv = 'day,period,subject,teacher,room,grade,class';
  if (semester) csv += ',semester';
  if (school) csv += ',school';
  if (program) csv += ',program';
  csv += '\n';
  
  // Include the period time information if available
  let periodInfo = '';
  if (timetable.periods && timetable.periods.length > 0) {
    periodInfo = timetable.periods.join(',');
  }

  // Add the timetable data rows
  Object.entries(timetableByDay).forEach(([day, periods]) => {
    periods.forEach((period: TimetableEntry) => {
      let row = `${day},${period.period},${period.subject},${period.teacher},${period.room},${grade},${classNumber}`;
      if (semester) row += `,${semester}`;
      if (school) row += `,${school}`;
      if (program) row += `,${program}`;
      csv += row + '\n';
    });
  });
  
  return csv;
}
