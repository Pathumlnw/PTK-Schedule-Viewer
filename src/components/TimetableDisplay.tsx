import React from "react";
import { useTimetable, useTimetableOverview } from "@/hooks/useTimetable";
import { TimetableDisplayProps } from "@/types/timetable";

/**
 * Example component that uses our timetable hooks
 */
export const TimetableDisplay: React.FC<TimetableDisplayProps> = ({
  grade,
  classNumber,
}) => {
  // Using the timetable hook to fetch data
  const { data, error, loading } = useTimetable(grade, classNumber);

  if (loading) {
    return <div>Loading timetable...</div>;
  }

  if (error) {
    return <div>Error loading timetable: {error}</div>;
  }

  if (!data) {
    return <div>No timetable data available.</div>;
  }

  return (
    <div>
      <h1>
        Timetable for Grade {data.grade}, Class {data.classNumber}
      </h1>

      {Object.entries(data.timetable).map(([day, periods]) => (
        <div key={day}>
          <h2>{day}</h2>
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr key={period.period}>
                  <td>{period.period}</td>
                  <td>{period.subject}</td>
                  <td>{period.teacher}</td>
                  <td>{period.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

/**
 * Example component that shows all available grades and classes
 */
export const TimetableOverviewDisplay: React.FC = () => {
  // Using the overview hook
  const { data, error, loading } = useTimetableOverview();

  if (loading) {
    return <div>Loading overview...</div>;
  }

  if (error) {
    return <div>Error loading overview: {error}</div>;
  }

  if (!data) {
    return <div>No overview data available.</div>;
  }

  return (
    <div>
      <h1>School Timetables Overview</h1>

      <h2>Junior High School (Grades 1-3)</h2>
      <p>{data.juniorHighSchool.classesPerGrade} classes per grade</p>

      <h2>Senior High School (Grades 4-6)</h2>
      <p>{data.seniorHighSchool.classesPerGrade} classes per grade</p>

      <h2>Available Timetables</h2>
      {Object.entries(data.gradeClassMap).map(([grade, classes]) => (
        <div key={grade}>
          <h3>Grade {grade}</h3>
          <ul>
            {classes.map((classNum) => (
              <li key={`${grade}-${classNum}`}>Class {classNum}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
