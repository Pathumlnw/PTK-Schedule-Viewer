import { SubjectInfo, SpecialPeriod } from '@/app/types/timetable';
import Image from 'next/image';

interface DayTimetableProps {
  periods: string[];
  data: any[];
  getSpecialPeriod: (content: string) => SpecialPeriod | null;
  parseSubjectCell: (content: string) => SubjectInfo | null;
  grade: string;
  room: string;
  roomName: string;
  mode: string;
}

export default function DayTimetable({
  periods,
  data,
  getSpecialPeriod,
  parseSubjectCell,
  grade,
  room,
  roomName,
  mode
}: DayTimetableProps) {
  // Fix the date and time format
  const currentDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  // Limit to maximum 10 periods
  const maxPeriods = 10;
  
  // Fixed timeslots for the 10 periods
  const timeSlots = [
    "08:30-09:20", "09:20-10:10", "10:10-11:00", "11:00-11:50",
    "11:50-12:40", "12:40-13:30", "13:30-14:20", "14:20-15:10",
    "15:10-16:00", "16:00-16:50"
  ];
  
  // Day names in Thai
  const dayNames = {
    'monday': 'จันทร์',
    'tuesday': 'อังคาร',
    'wednesday': 'พุธ',
    'thursday': 'พฤหัสบดี',
    'friday': 'ศุกร์'
  };
  
  // Map of day prefixes
  const dayPrefixes = {
    'monday': 'S1',
    'tuesday': 'S2',
    'wednesday': 'S3',
    'thursday': 'S4',
    'friday': 'S5'
  };
  
  // Days of the week in order
  const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
  type DayKey = typeof daysOrder[number];
  
  return (
    <div className="w-full max-w-6xl mx-auto mb-10">
      <div className="flex items-center mb-4 bg-blue-50 p-3 rounded-t-lg border-b-2 border-blue-500">
        <div className="w-16 h-16 mr-4">
          <Image 
            src="/logo.png" 
            alt="School Logo" 
            width={64} 
            height={64}
            className="rounded-full"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-blue-800">
            ตารางเรียน ชั้น ม. {grade}/{room} {roomName ? `${roomName}` : ""} {mode !== "รวม" ? mode : ""}
          </h2>
          <p className="text-sm text-blue-600">
            ภาคเรียนที่ 1/2567 โรงเรียนปทุมเทพวิทยาคาร
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-2 text-center">ชั่วโมงที่</th>
              {Array.from({ length: maxPeriods }, (_, i) => (
                <th key={i} className="border border-gray-300 bg-gray-100 p-2 text-center">
                  {i + 1}
                </th>
              ))}
            </tr>
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-2 text-center">เวลา</th>
              {timeSlots.map((time, i) => (
                <th key={i} className="border border-gray-300 bg-gray-100 p-2 text-center text-sm">
                  {time}
                </th>
              ))}
            </tr>
          </thead>
            <tbody>
              {daysOrder.map((day) => (
                <tr key={day}>
                  <td className="border border-gray-300 bg-gray-50 p-2 text-center font-medium">
                    {dayNames[day as DayKey]}
                  </td>
                  
                  {Array.from({ length: maxPeriods }, (_, periodIndex: number) => {
                    // Construct period code like S101, S201, etc.
                    const periodNum = (periodIndex + 1).toString().padStart(2, '0');
                    const periodCode = `${dayPrefixes[day as DayKey]}${periodNum}`;
                  
                  // Find matching data for this period
                  const cellData = data.find(row => row[periodCode]);
                  const cellContent = cellData ? cellData[periodCode] : null;
                  
                  // Handle lunch period (usually period 5)
                  if (periodIndex === 4) {  // 5th period (0-indexed)
                    return (
                      <td 
                        key={`${day}-${periodIndex}`}
                        className="border border-gray-300 p-2 text-center bg-amber-50 text-amber-800"
                      >
                        <div className="text-center font-medium">พักกลางวัน</div>
                      </td>
                    );
                  }
                  
                  // Handle special periods
                  const specialPeriod = getSpecialPeriod(cellContent);
                  if (specialPeriod) {
                    return (
                      <td 
                        key={`${day}-${periodIndex}`}
                        className={`border border-gray-300 p-2 text-center ${
                          specialPeriod.type === 'lunch' 
                            ? 'bg-amber-50 text-amber-800' 
                            : 'bg-green-50 text-green-800'
                        }`}
                      >
                        <div className="text-center font-medium">{specialPeriod.text}</div>
                      </td>
                    );
                  }
                  
                  // Handle regular subjects
                  const subjectInfo = parseSubjectCell(cellContent);
                  if (!subjectInfo) {
                    return (
                      <td 
                        key={`${day}-${periodIndex}`}
                        className="border border-gray-300 p-2 text-gray-400 text-center"
                      >
                        -
                      </td>
                    );
                  }
                  
                  return (
                    <td 
                      key={`${day}-${periodIndex}`}
                      className="border border-gray-300 p-2 text-center bg-white"
                    >
                      <div className="text-center">
                        <div className="font-medium text-blue-700">{subjectInfo.subject}</div>
                        {subjectInfo.teacher && (
                          <div className="text-sm">ครู{subjectInfo.teacher}</div>
                        )}
                        {subjectInfo.room && (
                          <div className="text-sm text-gray-500">{subjectInfo.room}</div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 flex justify-between">
        <div>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDateTime}</div>
        <div>Current User's Login: Jesselpetry</div>
      </div>
    </div>
  );
}