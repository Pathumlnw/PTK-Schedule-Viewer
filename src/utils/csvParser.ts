import fs from 'fs';
import path from 'path';
import { TimetableData } from '@/types/timetable';

/**
 * Parse a CSV file into a structured timetable object
 * @param filePath Path to the CSV file
 * @returns Parsed timetable data
 */
export function parseCSV(filePath: string): TimetableData {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const rows = fileContent.split('\n').map(row => row.trim()).filter(row => row.length > 0);
    
    // Extract headers
    const headers = rows[0].split(',').map(header => header.trim());
    
    // Parse content rows
    const data = rows.slice(1).map(row => {
      const columns = row.split(',').map(col => col.trim());
      const rowData: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        rowData[header] = columns[index] || '';
      });
      
      return rowData;
    });
    
    return {
      headers,
      data
    };
  } catch (error) {
    console.error(`Error parsing CSV: ${error}`);
    return {
      headers: [],
      data: []
    };
  }
}

/**
 * Get timetable data for a specific grade and class
 */
export function getTimetableForClass(grade: number, classNumber: number): TimetableData | null {
  // Validate input parameters
  if (grade < 1 || grade > 6 || 
      (grade <= 3 && (classNumber < 1 || classNumber > 17)) || 
      (grade >= 4 && (classNumber < 1 || classNumber > 16))) {
    return null;
  }

  const filePath = path.join(process.cwd(), 'public', 'timetables', 'mocking.csv');
  
  // For now, return all data - in a real implementation, we would filter by grade and class
  // This function would be enhanced to filter the specific data based on grade and class
  const allData = parseCSV(filePath);
  
  // Filter data for the specific grade and class (assuming CSV has columns for grade and class)
  const filteredData = {
    headers: allData.headers,
    data: allData.data.filter(row => {
      return Number(row.grade) === grade && Number(row.class) === classNumber;
    })
  };
  
  return filteredData;
}

// Note: TimetableData interface is now imported from '@/types/timetable'
