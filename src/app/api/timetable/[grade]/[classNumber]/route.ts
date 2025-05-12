import { NextRequest, NextResponse } from "next/server";
import { getTimetableForClass } from "@/utils/csvParser"; // Keep for backwards compatibility
import { getTimetableJsonForClass, convertJsonToTimetableResponse } from "@/utils/jsonParser";
import { validateTimetableParams } from "@/utils/validation";
import { TimetableEntry, TimetableByDayResponse } from "@/types/timetable";
import path from "path";
import fs from "fs";

/**
 * API route handler for fetching timetables by grade and class number
 * Route: /api/timetable/[grade]/[classNumber]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { grade: string; classNumber: string } }
) {
  // Parse and validate parameters
  const grade = parseInt(params.grade, 10);
  const classNumber = parseInt(params.classNumber, 10);
  
  // Validate parameters
  const validation = validateTimetableParams(grade, classNumber);
  if (!validation.isValid) {
    return NextResponse.json(
      { error: validation.errorMessage },
      { status: 400 }
    );
  }
  // Check if JSON timetable file exists
  const jsonFilePath = path.join(process.cwd(), 'public', 'timetables', 'timetable.json');
  
  // Try to get data from JSON first, fall back to CSV if needed
  if (fs.existsSync(jsonFilePath)) {
    const timetableJson = getTimetableJsonForClass(grade, classNumber);
    
    if (timetableJson) {
      // Convert JSON data to API response format
      const formattedData = convertJsonToTimetableResponse(timetableJson);
      
      return NextResponse.json({
        grade,
        classNumber,
        timetable: formattedData,
        semester: timetableJson.semester,
        school: timetableJson.school,
        program: timetableJson.program,
        periods: timetableJson.periods
      });
    }
  }
  
  // Fall back to CSV if JSON doesn't exist or doesn't have data for this grade/class
  const csvFilePath = path.join(process.cwd(), 'public', 'timetables', 'mocking.csv');
  if (!fs.existsSync(csvFilePath)) {
    return NextResponse.json(
      { error: "Timetable data not found" }, 
      { status: 404 }
    );
  }

  // Get timetable data from CSV
  const timetableData = getTimetableForClass(grade, classNumber);
  
  if (!timetableData || timetableData.data.length === 0) {
    return NextResponse.json(
      { 
        message: `No timetable found for grade ${grade}, class ${classNumber}`,
        data: []
      }, 
      { status: 404 }
    );
  }

  // Format CSV timetable data for response
  const formattedData = formatTimetableResponse(timetableData.data);

  return NextResponse.json({
    grade,
    classNumber,
    timetable: formattedData
  });
}

// Using TimetableEntry type from '@/types/timetable'

/**
 * Format the timetable data into a more structured response
 */
function formatTimetableResponse(data: Record<string, string>[]): TimetableByDayResponse {
  // Group by day
  const groupedByDay: TimetableByDayResponse = {};
  
  data.forEach(entry => {
    const day = entry.day;
    
    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }
    
    groupedByDay[day].push({
      period: parseInt(entry.period, 10),
      subject: entry.subject,
      teacher: entry.teacher,
      room: entry.room
    });
  });
  
  // Sort periods for each day
  Object.keys(groupedByDay).forEach(day => {
    groupedByDay[day].sort((a: TimetableEntry, b: TimetableEntry) => a.period - b.period);
  });
  
  return groupedByDay;
}
