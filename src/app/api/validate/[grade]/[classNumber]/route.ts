import { NextRequest, NextResponse } from "next/server";
import { validateTimetableParams } from "@/utils/validation";
// import { ValidationResponse } from "@/types/timetable";

/**
 * API route handler for validating a grade and class combination
 * Route: /api/validate/[grade]/[classNumber]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { grade: string; classNumber: string } }
) {
  // Parse parameters
  const grade = parseInt(params.grade, 10);
  const classNumber = parseInt(params.classNumber, 10);
  
  // Validate parameters
  const validation = validateTimetableParams(grade, classNumber);
  
  return NextResponse.json({
    valid: validation.isValid,
    grade,
    classNumber,
    message: validation.isValid 
      ? `Grade ${grade}, Class ${classNumber} is valid` 
      : validation.errorMessage
  });
}
