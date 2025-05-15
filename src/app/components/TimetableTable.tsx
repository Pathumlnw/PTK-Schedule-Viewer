import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ClassInfo, SpecialPeriod, SubjectInfo, SelectOption } from '@/app/types/timetable';

interface TimetableViewProps {
  timetableData: any[];
  selectedGrade: { id: number; name: string };
  selectedRoom: { id: number; name: string } | null;
  selectedMode: { id: number; name: string };
  availableModes: SelectOption[];
  onBack: () => void;
  onModeChange: (mode: SelectOption) => void;
}

export default function TimetableView({
  timetableData,
  selectedGrade,
  selectedRoom,
  selectedMode,
  availableModes,
  onBack,
  onModeChange
}: TimetableViewProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  // Fixed date and time as requested
  const fixedDateTime = "2025-05-15 13:42:41";
  const username = "Jesselpetry";

  // Extract grade and room information from a text string
  const extractClassInfo = (text: string): ClassInfo | null => {
    if (!text) return null;
    
    // Look for common patterns like "6/3", "ม.6/3", etc.
    const match1 = text.match(/(\d+)\/(\d+)/);
    if (match1) {
      return { grade: match1[1], room: match1[2] };
    }
    
    const match2 = text.match(/ม\.(\d+)\/(\d+)/);
    if (match2) {
      return { grade: match2[1], room: match2[2] };
    }
    
    return null;
  };

  // Extract special periods (lunch, activities, etc.)
  const getSpecialPeriod = (content: string): SpecialPeriod | null => {
    if (!content || !content.trim()) return null;
    
    if (content.includes("กลางวัน")) {
      return { type: "lunch", text: "พักกลางวัน" };
    } else if (content.includes("กิจกรรม")) {
      return { type: "activity", text: "กิจกรรม" };
    }
    return null;
  };

  // Parse cell content for regular subjects
  const parseSubjectCell = (content: string): SubjectInfo | null => {
    if (!content || !content.trim()) return null;
    
    const parts = content.trim().split(/\s+/);
    if (parts.length < 2) return { subject: content };
    
    return {
      subject: parts[0],
      teacher: parts.find(p => p.startsWith('7')) 
        ? parts.find(p => p.startsWith('7'))!.substring(1) 
        : parts[1],
      room: parts.filter(p => !p.startsWith('7') && parts.indexOf(p) > 1).join(' ') || null
    };
  };

  // Handle screenshot capture
  const handleCapture = () => {
    setIsCapturing(true);
    
    setTimeout(() => {
      // This is where we would add actual screenshot functionality
      // For now, just show an alert
      alert("บันทึกภาพสำเร็จ");
      setIsCapturing(false);
    }, 500);
  };

  // Filter data and prepare for rendering
  const getFilteredData = () => {
    if (!timetableData || timetableData.length === 0 || !selectedGrade || !selectedRoom) {
      return [];
    }

    const grade = selectedGrade.name;
    const room = selectedRoom.id.toString();
    const mode = selectedMode.name;
    
    // Filter based on selected grade and room
    return timetableData.filter(row => {
      if (!row.NAME_STUD && !row.GROUP) return false;
      
      const nameText = row.NAME_STUD || row.GROUP || '';
      const classInfo = extractClassInfo(nameText);
      
      if (!classInfo) return false;
      
      // Basic grade/room matching
      const basicMatch = classInfo.grade === grade && classInfo.room === room;
      
      // For special modes (Gifted Thai, Gifted English)
      if (mode === "รวม") {
        return basicMatch;
      } else if (mode === "G-Thai") {
        return basicMatch && 
               ((row.NOTESTUD && row.NOTESTUD.includes("G.Thai")) || 
                (row.RUSE && row.RUSE.includes("G.Thai")));
      } else if (mode === "G-Eng") {
        return basicMatch && 
               ((row.NOTESTUD && row.NOTESTUD.includes("G.Eng")) || 
                (row.RUSE && row.RUSE.includes("G.Eng")));
      }
      
      return basicMatch;
    });
  };

  // Get all period columns
  const getPeriodColumns = () => {
    if (!timetableData || timetableData.length === 0) return [];
    
    return Object.keys(timetableData[0]).filter(key => 
      key.startsWith('S') && key.length === 4 && !isNaN(parseInt(key.substring(1))));
  };

  const filteredData = getFilteredData();
  const periodColumns = getPeriodColumns();
  const grade = selectedGrade?.name || '';
  const room = selectedRoom?.id.toString() || '';
  const roomName = selectedRoom?.name.includes(' - ') 
    ? selectedRoom.name.split(' - ')[1] 
    : '';

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center mb-2">
          <Image 
            src="/logo.png" 
            alt="School Logo" 
            width={80} 
            height={80}
            className="rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-white">PTK Schedule Viewer</h1>
            <p className="text-white text-opacity-70">เช็คตารางเรียนโรงเรียนปทุมเทพวิทยาคาร</p>
            <p className="text-xs text-white text-opacity-50">by Pathumlnw TechCommu</p>
          </div>
        </div>
      </div>
      
      <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-800">
        <div className="p-4 pb-0">
          <h2 className="text-2xl font-bold text-white mb-1">
            ตารางเรียน ม.{grade}/{room}
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            ห้อง {roomName}
          </p>
        </div>
        
        <div className="bg-white p-4 m-4 rounded-lg">
          <table className="w-full">
            {/* Insert your timetable rendering logic here using filteredData, 
                periodColumns, getSpecialPeriod, parseSubjectCell, and gradeLevel */}
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {periodColumns.map((period) => (
                    <td key={period}>{row[period]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-center gap-2 p-4">
          {availableModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode)}
              className={`px-4 py-1 rounded-full text-sm ${
                selectedMode.id === mode.id 
                  ? 'bg-white text-black font-medium' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {mode.name === 'รวม' ? 'รวม' : mode.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={handleCapture}
          className="flex items-center bg-white text-black px-6 py-2 rounded-full font-medium"
          disabled={isCapturing}
        >
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="12" cy="13" r="4"></circle>
              <circle cx="19" cy="7" r="1"></circle>
            </svg>
          </span>
          บันทึกภาพ
        </button>
        
        <button
          onClick={onBack}
          className="flex items-center bg-transparent border border-white text-white px-6 py-2 rounded-full font-medium"
        >
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </span>
          ปิด
        </button>
      </div>
      
      <div className="mt-6 text-xs text-white text-opacity-50 text-center">
        <div>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {fixedDateTime}</div>
        <div>Current User's Login: {username}</div>
      </div>
    </div>
  );
}