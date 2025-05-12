"use client"; // Add this directive at the top to make it a client component

import { useState } from "react";
import Image from "next/image";
import Dropdown from "./components/Dropdown";

export default function Home() {
  const grades = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
  ];

  const rooms = [
    { id: 1, name: "1 - SMEP" },
    { id: 2, name: "2 - Arts" },
    { id: 3, name: "3 - Science" },
  ];

  const [selectedGrade, setSelectedGrade] = useState(grades[0]);
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen grid place-items-center p-8">
      <div className="text-center max-w-lg w-full">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="PTK Logo"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-white">PTK Schedule Viewer</h1>
        <p className="mt-2 text-white font-light opacity-60">
          ระบบเช็คตารางเรียน โรงเรียนปทุมเทพวิทยาคาร
        </p>
        <div className="mt-6 space-y-4">
          {/* Grade Dropdown with School Icon */}
          <div>
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-300">มัธยม</span>
            </div>
            <Dropdown
              label=""
              options={grades}
              selected={selectedGrade}
              onChange={setSelectedGrade}
            />
          </div>

          {/* Room Dropdown with Graduation Cap Icon */}
          <div>
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-300">ห้อง</span>
            </div>
            <Dropdown
              label=""
              options={rooms}
              selected={selectedRoom}
              onChange={setSelectedRoom}
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full rounded-lg bg-white py-2 text-[#191919] hover:bg-gray-300 transition-colors"
          >
            ค้นหา
          </button>
        </div>

        {/* MIT License Copyright */}
        <div className="mt-12 text-xs font-light text-white opacity-50">
          <p>สงวนลิขสิทธิ์ PTK TechCommu © {currentYear}</p>
          <p className="mt-1">
            ซอร์สโค้ดเผยแพร่ภายใต้สัญญาอนุญาต{" "}
            <a
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white hover:opacity-75 transition-opacity"
            >
              MIT License
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
