import { useState, useEffect } from "react";
import Image from "next/image";
import Dropdown from "./Dropdown";
import TimeDisplay from "./TimeDisplay";
import { SelectOption } from "@/app/types/timetable";

interface DropdownProps {
  label: string;
  options: SelectOption[];
  selected: SelectOption | null;
  onChange: (option: SelectOption) => void;
}

interface SearchFormProps {
  grades: SelectOption[];
  rooms: SelectOption[];
  modes: SelectOption[];
  selectedGrade: SelectOption;
  selectedRoom: SelectOption | null;
  selectedMode: SelectOption;
  isLoading: boolean;
  onGradeChange: (grade: SelectOption) => void;
  onRoomChange: (room: SelectOption) => void;
  onModeChange: (mode: SelectOption) => void;
  onSearch: () => void;
}

export default function SearchForm({
  grades,
  rooms,
  modes,
  selectedGrade,
  selectedRoom,
  selectedMode,
  isLoading,
  onGradeChange,
  onRoomChange,
  onModeChange,
  onSearch,
}: SearchFormProps) {
  const currentYear = new Date().getFullYear();

  return (
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

      {isLoading ? (
        <div className="mt-6 p-8 bg-white bg-opacity-10 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">กำลังโหลดข้อมูล...</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {/* Grade Dropdown */}
          <div>
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-300">มัธยม</span>
            </div>
            <Dropdown
              label=""
              options={grades}
              selected={selectedGrade}
              onChange={onGradeChange}
            />
          </div>

          {/* Room Dropdown */}
          <div>
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-300">ห้อง</span>
            </div>
            <Dropdown
              label=""
              options={rooms}
              selected={selectedRoom || { id: 0, name: "กรุณาเลือกห้อง" }}
              onChange={onRoomChange}
            />
          </div>

          {/* Mode Dropdown (for special classes) */}
          {modes.length > 1 && (
            <div>
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium text-gray-300">
                  โปรแกรม
                </span>
              </div>
              <Dropdown
                label=""
                options={modes}
                selected={selectedMode}
                onChange={onModeChange}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            className="w-full rounded-lg bg-white py-2 text-[#191919] hover:bg-gray-300 transition-colors"
            onClick={onSearch}
            disabled={!selectedRoom}
          >
            ค้นหา
          </button>
        </div>
      )}

      {/* User and DateTime Info */}
      <div className="mt-6">
        <TimeDisplay username="Jesselpetry" />
      </div>

      {/* MIT License Copyright */}
      <div className="mt-6 text-xs font-light text-white opacity-50">
        <p>สงวนลิขสิทธิ์ Pathumlnw © {currentYear}</p>
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
  );
}
