interface TimetableHeaderProps {
  grade: string;
  room: string;
  roomName: string;
  mode: string;
  onBack: () => void;
  currentDateTime: string;
  username: string;
}

export default function TimetableHeader({
  grade,
  room,
  roomName,
  mode,
  onBack,
  currentDateTime,
  username
}: TimetableHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h2 className="text-xl font-bold">
          ตารางเรียน ม.{grade}/{room} {roomName ? `(${roomName})` : ""}
          {mode !== "รวม" ? ` - ${mode}` : ""}
        </h2>
        <button 
          onClick={onBack}
          className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700 transition-colors text-sm"
        >
          ย้อนกลับ
        </button>
      </div>

      <div className="p-2 bg-gray-100 text-xs text-gray-500 flex justify-between">
        <span>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDateTime}</span>
        <span>Current User's Login: {username}</span>
      </div>
    </>
  );
}