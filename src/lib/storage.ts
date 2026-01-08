
// Types
export interface Student {
  id: string;
  name: string;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  groupId: string;
  eventName?: string; // For "Others" category
  presentStudentIds: string[];
}

// Initial Data
const INITIAL_GROUPS: Group[] = [
  { id: "4-5", name: "4 to 5" },
  { id: "5-6", name: "5 to 6" },
];

const INITIAL_STUDENTS: Student[] = [
  { id: "s1", name: "Alice Johnson", groupId: "4-5" },
  { id: "s2", name: "Bob Wilson", groupId: "4-5" },
  { id: "s3", name: "Charlie Brown", groupId: "5-6" },
  { id: "s4", name: "David Lee", groupId: "5-6" },
  { id: "s5", name: "Emily Davis", groupId: "4-5" },
  { id: "s6", name: "Frank Miller", groupId: "5-6" },
  { id: "s7", name: "Grace Taylor", groupId: "4-5" },
  { id: "s8", name: "Henry White", groupId: "5-6" },
];

// Storage Keys
const STORAGE_KEYS = {
  STUDENTS: "attendance_hub_students",
  GROUPS: "attendance_hub_groups",
  ATTENDANCE: "attendance_hub_records",
};

// Storage Helpers
export const storage = {
  getGroups: (): Group[] => {
    // Return hardcoded initial groups if we want to enforce them, 
    // or merge with local storage if we want them editable.
    // For this request, we'll force the initial groups if none exist, 
    // but if we want to ensure "4 to 5" and "5 to 6" are always there, 
    // we might want to just return them or reset. 
    // Given the user specifically requested these groups, let's prioritize them.
    const data = localStorage.getItem(STORAGE_KEYS.GROUPS);
    if (!data) return INITIAL_GROUPS;

    // Optional: Check if the stored groups match our requirement. 
    // For simplicity, let's just use what's stored if it exists, otherwise initial.
    // However, since we are changing the requirement mid-stream, the user might have old data.
    // Let's force a "migration" or just return INITIAL_GROUPS if we detect old structure/names?
    // The safest is to rely on localStorage but if we are "developing", maybe we should reset.
    // I will write a small check to inject the new defaults if they are missing.
    const groups = JSON.parse(data);
    if (groups.length !== 2 || groups[0].name !== "4 to 5") {
      // logic to "reset" for this specific user request context
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_GROUPS));
      return INITIAL_GROUPS;
    }
    return groups;
  },

  getStudents: (): Student[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    // similar reset logic if needed, but for now let's respect storage
    return data ? JSON.parse(data) : INITIAL_STUDENTS;
  },

  getAttendance: (): AttendanceRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },

  saveStudent: (student: Student) => {
    const students = storage.getStudents();
    const newStudents = [...students, student];
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(newStudents));
    return newStudents;
  },

  deleteStudent: (studentId: string) => {
    const students = storage.getStudents();
    const newStudents = students.filter((s) => s.id !== studentId);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(newStudents));
    return newStudents;
  },

  saveAttendance: (record: AttendanceRecord) => {
    const records = storage.getAttendance();
    // Remove existing record for same date and group if exists (update)
    const filteredRecords = records.filter(
      (r) => !(r.date === record.date && r.groupId === record.groupId)
    );
    const newRecords = [...filteredRecords, record];
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(newRecords));
    return newRecords;
  },
};

export const PASSCODES = {
  ATTENDANCE: "1234",
  ADMIN: "0000",
};
