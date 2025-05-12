"use client";

import { useState } from "react";
import { useTimetableWithRefetch } from "@/hooks/useTimetable";
import { timetableService } from "@/services/timetableService";
import {
  fetchAndProcessTimetableData,
  exportTimetableToCSV,
} from "@/utils/timetableUtils";
import html2canvas from "html2canvas";

export default function TimetablePage() {
  const [grade, setGrade] = useState<number>(1);
  const [classNumber, setClassNumber] = useState<number>(1);
  const { data, loading, error, updateTimetable } = useTimetableWithRefetch();
  const [message, setMessage] = useState<string>("");

  const handleSearch = async () => {
    try {
      await updateTimetable(grade, classNumber);
      setMessage("");
    } catch (error) {
      setMessage(
        `Error: ${
          error instanceof Error ? error.message : "Failed to fetch timetable"
        }`
      );
    }
  };

  const handleExportCSV = () => {
    if (!data) return;

    const csv = exportTimetableToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `timetable_grade${grade}_class${classNumber}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = async () => {
    try {
      setMessage("Generating image...");
      const element = document.getElementById("timetableContainer");

      if (!element) {
        setMessage("Failed to find timetable element");
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Create image file
      const image = canvas.toDataURL("image/png");

      // Create download link
      const link = document.createElement("a");
      link.href = image;
      link.download = `timetable_grade${grade}_class${classNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage("Image downloaded successfully!");

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage(
        `Error generating image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleDirectServiceCall = async () => {
    try {
      setMessage("Fetching data directly using service...");
      const overview = await timetableService.getTimetableOverview();
      setMessage(
        `Successfully fetched overview! Available grades: ${overview.availableGrades.join(
          ", "
        )}`
      );
    } catch (error) {
      setMessage(
        `Error with direct service call: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleUtilityCall = async () => {
    try {
      setMessage("Processing data using utility...");
      const processedData = await fetchAndProcessTimetableData(
        grade,
        classNumber
      );
      if (processedData) {
        const { summary } = processedData;
        setMessage(
          `Data processed! Found ${summary.uniqueSubjects.length} unique subjects and ${summary.uniqueTeachers.length} teachers`
        );
      } else {
        setMessage("No data returned from utility");
      }
    } catch (error) {
      setMessage(
        `Error with utility call: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">School Timetable Explorer</h1>
      <div className="mb-6 bg-black p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Search Timetable</h2>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block mb-1">Grade (1-6)</label>
            <input
              type="number"
              min="1"
              max="6"
              value={grade}
              onChange={(e) => setGrade(parseInt(e.target.value, 10))}
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Class Number</label>
            <input
              type="number"
              min="1"
              max={grade <= 3 ? 17 : 16}
              value={classNumber}
              onChange={(e) => setClassNumber(parseInt(e.target.value, 10))}
              className="border p-2 rounded"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>

          <button
            onClick={handleDirectServiceCall}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loading}
          >
            Call Service Directly
          </button>

          <button
            onClick={handleUtilityCall}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            disabled={loading}
          >
            Use Utility
          </button>

          {data && (
            <button
              onClick={handleExportCSV}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Export to CSV
            </button>
          )}
        </div>

        {message && (
          <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">
            {message}
          </div>
        )}
      </div>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-500 rounded">
          Error: {error}
        </div>
      )}
      {data && (
        <div className="mb-6" id="timetableContainer">          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">ตารางเรียน</h1>
            <h3 className="text-lg">
              {data.semester ? data.semester : 'ภาคเรียนที่ 2 ปีการศึกษา 2567'}
            </h3>
            <h3 className="text-lg mt-2">
              ชั้น ม.{data.grade}/{data.classNumber}
              {data.program && <span className="ml-2">({data.program})</span>}
            </h3>
            {data.school && <h4 className="text-md mt-1">{data.school}</h4>}
          </div>
          <div className="table-responsive">
            <table className="w-full border-collapse" id="timetable">              <thead className="bg-black">
                <tr>
                  <th className="border p-2">คาบ</th>
                  {data.periods ? (
                    // Use periods from the API response if available
                    data.periods.map((period, index) => (
                      <th key={index} className="border p-2">
                        {index}<br/>{period}
                      </th>
                    ))
                  ) : (
                    // Fall back to default periods
                    <>
                      <th className="border p-2">0<br/>08:15-08:40</th>
                      <th className="border p-2">1<br/>08:40-09:30</th>
                      <th className="border p-2">2<br/>09:35-10:25</th>
                      <th className="border p-2">3<br/>10:30-11:20</th>
                      <th className="border p-2">4<br/>11:25-12:15</th>
                      <th className="border p-2">5<br/>12:20-13:10</th>
                      <th className="border p-2">6<br/>13:15-14:05</th>
                      <th className="border p-2">7<br/>14:10-15:00</th>
                      <th className="border p-2">8<br/>15:05-15:55</th>
                      <th className="border p-2">9<br/>16:00-16:50</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>                {Object.entries(data.timetable).map(([day, periods]) => (
                  <tr key={day} className="hover:bg-gray-50">
                    <td className="border p-2 font-semibold">{day}</td>
                    {Array.from({ length: data.periods?.length || 10 }, (_, i) => {
                      // Convert the array index to a number matching the period
                      const period = periods.find(p => p.period === i);
                      
                      return (
                        <td key={i} className="border p-2 text-center">
                          {period ? (
                            <>
                              {period.subject}
                              <br />
                              {period.teacher}
                              <br />
                              {period.room}
                            </>
                          ) : i === 4 ? (
                            <>
                              พัก
                              <br />
                              <br />
                            </>
                          ) : (
                            <>
                              <br />
                              <br />
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleDownloadImage}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2"
            >
              Download as Image
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mx-2"
            >
              Export to CSV
            </button>
          </div>{" "}
        </div>
      )}{" "}
      {/* Footer */}
    </div>
  );
}
