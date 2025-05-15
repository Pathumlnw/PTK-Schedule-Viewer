import { useState, useEffect } from 'react';

interface TimeDisplayProps {
  username: string;
}

export default function TimeDisplay({ username }: TimeDisplayProps) {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  // Update time every minute
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = formatDateUTC(now);
      setCurrentDateTime(formattedDate);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Format date to UTC YYYY-MM-DD HH:MM:SS
  const formatDateUTC = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="text-xs text-white opacity-50">
      <p>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDateTime}</p>
      <p>Current User's Login: {username}</p>
    </div>
  );
}