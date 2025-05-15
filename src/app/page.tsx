"use client"; // Add this directive at the top to make it a client component

import { useState, useEffect } from "react";
import Papa from "papaparse";
import SearchForm from "./components/SearchForm";
import TimetableView from "./components/TimetableView";
import { SelectOption, ClassInfo, SpecialClass } from "./types/timetable";

export default function Home() {
  // Define basic grades
  const grades: SelectOption[] = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
    { id: 6, name: "6" },
  ];

  // State management
  const [rooms, setRooms] = useState<SelectOption[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<SelectOption>(grades[0]);
  const [selectedRoom, setSelectedRoom] = useState<SelectOption | null>(null);
  const [selectedMode, setSelectedMode] = useState<SelectOption>({ id: 1, name: "รวม" });
  const [showTimetable, setShowTimetable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timetableData, setTimetableData] = useState<any[] | null>(null);
  const [specialClasses, setSpecialClasses] = useState<Record<string, SpecialClass>>({});
  const [availableModes, setAvailableModes] = useState<SelectOption[]>([
    { id: 1, name: "รวม" }
  ]);

  // Load CSV file on mount
  useEffect(() => {
    loadCSVData();
  }, []);

  // Update rooms when grade changes
  useEffect(() => {
    if (timetableData) {
      updateRoomsForGrade(selectedGrade.name);
    }
  }, [selectedGrade, timetableData]);

  // Load CSV data from public folder
  const loadCSVData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/schedule.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
          setTimetableData(data);
          
          // Identify special classes (Gifted program etc.)
          identifySpecialClasses(data);
          
          // Set rooms based on the default selected grade
          updateRoomsForGrade(selectedGrade.name);
          
          setIsLoading(false);
        },
        error: (error : any) => {
          console.error("Error parsing CSV:", error);
          alert("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV");
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching CSV file:", error);
      alert("ไม่สามารถโหลดไฟล์ CSV ได้");
      setIsLoading(false);
    }
  };

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

  // Identify classes with special programs like Gifted
  const identifySpecialClasses = (data: any[]) => {
    const specialClassesMap: Record<string, SpecialClass> = {};
    
    // Extract class information from each row
    data.forEach(row => {
      if (!row.NAME_STUD && !row.GROUP) return;
      
      const classInfo = extractClassInfo(row.NAME_STUD || row.GROUP || '');
      if (!classInfo) return;
      
      const { grade, room } = classInfo;
      const key = `${grade}/${room}`;
      
      // Get the RUSE value if available
      const ruse = row.RUSE || '';
      
      // Check if this is a special class based on notes or RUSE field
      const isGiftedThai = ruse.includes('G.Thai') || 
                          (row.NOTESTUD && row.NOTESTUD.includes('G.Thai'));
      const isGiftedEng = ruse.includes('G.Eng') || 
                         (row.NOTESTUD && row.NOTESTUD.includes('G.Eng'));
      
      if (isGiftedThai || isGiftedEng) {
        if (!specialClassesMap[key]) {
          specialClassesMap[key] = {
            modes: [{ id: 1, name: "รวม" }],
            ruse: ruse
          };
        }
        
        // Add special modes if not already added
        if (isGiftedThai && !specialClassesMap[key].modes.some(m => m.name === "G-Thai")) {
          specialClassesMap[key].modes.push({ id: 2, name: "G-Thai" });
        }
        
        if (isGiftedEng && !specialClassesMap[key].modes.some(m => m.name === "G-Eng")) {
          specialClassesMap[key].modes.push({ id: 3, name: "G-Eng" });
        }
      } else if (!specialClassesMap[key]) {
        // Regular class with just the standard mode
        specialClassesMap[key] = {
          modes: [{ id: 1, name: "รวม" }],
          ruse: ruse
        };
      }
    });
    
    setSpecialClasses(specialClassesMap);
  };

  // Update the rooms dropdown based on selected grade
  const updateRoomsForGrade = (grade: string) => {
    if (!timetableData) return;
    
    // Find all rooms for the selected grade
    const availableRooms = new Map<string, SelectOption>();
    
    timetableData.forEach(row => {
      if (!row.NAME_STUD && !row.GROUP) return;
      
      const classInfo = extractClassInfo(row.NAME_STUD || row.GROUP || '');
      if (!classInfo || classInfo.grade !== grade) return;
      
      const { room } = classInfo;
      const ruse = row.RUSE || '';
      
      // Use the room number and RUSE from the data
      const roomKey = `${room} - ${ruse}`;
      if (!availableRooms.has(room)) {
        availableRooms.set(room, {
          id: parseInt(room),
          name: roomKey
        });
      }
    });
    
    // Convert to array and sort by room number
    const roomsArray = Array.from(availableRooms.values())
      .sort((a, b) => a.id - b.id);
    
    setRooms(roomsArray);
    
    // Set first room as selected or reset if no rooms
    if (roomsArray.length > 0) {
      setSelectedRoom(roomsArray[0]);
      
      // Update available modes for this class
      updateAvailableModes(grade, roomsArray[0].id.toString());
    } else {
      setSelectedRoom(null);
      setAvailableModes([{ id: 1, name: "รวม" }]);
    }
  };

  // Update available modes when room changes
  const updateAvailableModes = (grade: string, room: string) => {
    const key = `${grade}/${room}`;
    if (specialClasses[key] && specialClasses[key].modes) {
      setAvailableModes(specialClasses[key].modes);
      setSelectedMode(specialClasses[key].modes[0]);
    } else {
      setAvailableModes([{ id: 1, name: "รวม" }]);
      setSelectedMode({ id: 1, name: "รวม" });
    }
  };

  // Handle grade change
  const handleGradeChange = (grade: SelectOption) => {
    setSelectedGrade(grade);
  };

  // Handle room change
  const handleRoomChange = (room: SelectOption) => {
    setSelectedRoom(room);
    if (selectedGrade && room) {
      updateAvailableModes(selectedGrade.name, room.id.toString());
    }
  };

  // Handle mode change
  const handleModeChange = (mode: SelectOption) => {
    setSelectedMode(mode);
  };

  // Handle search button click
  const handleSearch = () => {
    if (!selectedGrade || !selectedRoom) {
      alert("กรุณาเลือกระดับชั้นและห้องเรียน");
      return;
    }
    
    setShowTimetable(true);
  };

  // Return to search interface
  const handleBackToSearch = () => {
    setShowTimetable(false);
  };

  return (
    <div className="min-h-screen grid place-items-center p-8 bg-gradient-to-b from-[#191919] to-[#0f0f0f]">
      {!showTimetable ? (
        <SearchForm
          grades={grades}
          rooms={rooms}
          modes={availableModes}
          selectedGrade={selectedGrade}
          selectedRoom={selectedRoom}
          selectedMode={selectedMode}
          isLoading={isLoading}
          onGradeChange={handleGradeChange}
          onRoomChange={handleRoomChange}
          onModeChange={handleModeChange}
          onSearch={handleSearch}
        />
      ) : (
        <TimetableView
          timetableData={timetableData || []}
          selectedGrade={selectedGrade}
          selectedRoom={selectedRoom}
          selectedMode={selectedMode}
          availableModes={availableModes}
          onBack={handleBackToSearch}
          onModeChange={handleModeChange}
        />
      )}
    </div>
  );
}