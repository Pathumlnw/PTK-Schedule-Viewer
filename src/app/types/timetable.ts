export interface SelectOption {
  id: number;
  name: string;
}

export interface ClassInfo {
  grade: string;
  room: string;
}

export interface SpecialClass {
  modes: SelectOption[];
  ruse: string;
}

export interface SpecialPeriod {
  type: "lunch" | "activity";
  text: string;
}

export interface SubjectInfo {
  subject: string;
  teacher?: string;
  room?: string | null;
}