import { useState } from 'react';
import Image from 'next/image';
import { ClassInfo, SubjectInfo, SelectOption } from '@/app/types/timetable';

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
  onModeChange,
}: TimetableViewProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const fixedDateTime = "2025-05-15 15:04:10";
  const username = "Jesselpetry";

  const filteredData = timetableData.filter((row) => {
    if (!selectedGrade || !selectedRoom) return false;
    const roomMatch = row['Room']?.toString() === selectedRoom.name;
    const programMatch =
      selectedMode.name === 'รวม' || row['Program'] === selectedMode.name;
    return roomMatch && programMatch;
  });

  const timeSlots = [
    '08:30-09:20',
    '09:20-10:10',
    '10:10-11:00',
    '11:00-11:50',
    '11:50-12:40',
    '12:40-13:30',
    '13:30-14:20',
    '14:20-15:10',
    '15:10-16:00',
    '16:00-16:50',
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      alert('บันทึกภาพสำเร็จ');
      setIsCapturing(false);
    }, 500);
  };

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
            <p className="text-white text-opacity-70">
              เช็คตารางเรียนโรงเรียนปทุมเทพวิทยาคาร
            </p>
            <p className="text-xs text-white text-opacity-50">
              by Pathumlnw TechCommu
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-800">
        <div className="p-4 pb-0">
          <h2 className="text-2xl font-bold text-white mb-1">
            ตารางเรียน ม.{selectedGrade?.name || ''}/{selectedRoom?.id || ''}
          </h2>
          <p className="text-gray-400 text-sm mb-1">
            ห้อง {selectedRoom?.name || ''}
          </p>
          <p className="text-gray-400 text-sm mb-4">
            โหมด: {selectedMode.name}
          </p>
        </div>

        <div className="bg-white p-4 m-4 rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-gray-100 p-2 text-center">
                    วัน/เวลา
                  </th>
                  {Array.from({ length: 10 }, (_, i) => (
                    <th
                      key={i}
                      className="border border-gray-300 bg-gray-100 p-2 text-center"
                    >
                      {i + 1}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="border border-gray-300 bg-gray-100 p-2 text-center">
                    เวลา
                  </th>
                  {timeSlots.map((time, i) => (
                    <th
                      key={i}
                      className="border border-gray-300 bg-gray-100 p-2 text-center text-sm"
                    >
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day}>
                    <td className="border border-gray-300 bg-gray-50 p-2 text-center font-medium">
                      {day}
                    </td>
                    {Array.from({ length: 10 }, (_, i) => (
                      <td
                        key={i}
                        className="border border-gray-300 bg-white p-2 text-center"
                      >
                        {filteredData[0]?.[`${day} ${i + 1}`] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center gap-2 p-4">
          {availableModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode)}
              className={`px-4 py-1 rounded-full text-sm ${
                selectedMode.id === mode.id
                  ? 'bg-white text-black font-medium'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {mode.name}
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
          บันทึกภาพ
        </button>
        <button
          onClick={onBack}
          className="flex items-center bg-transparent border border-white text-white px-6 py-2 rounded-full font-medium"
        >
          ปิด
        </button>
      </div>

      <div className="mt-6 text-xs text-white text-opacity-50 text-center">
        <div>
          Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):{' '}
          {fixedDateTime}
        </div>
        <div>Current User's Login: {username}</div>
      </div>
    </div>
  );
}