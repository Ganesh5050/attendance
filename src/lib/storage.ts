
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

export interface Trainer {
  id: string;
  name: string;
  courtId: string;
  passcode: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  courtId: string;
  groupId: string;
  trainerId: string; // Who marked this attendance
  trainerName: string; // For easy display
  eventName?: string; // For "Others" category
  presentStudentIds: string[];
}

// Initial Data - 5 Courts
const INITIAL_GROUPS: Group[] = [
  { id: "4-5", name: "4 to 5" },
  { id: "5-6", name: "5 to 6" },
];

// Sample trainers - Real coaches with unique passcodes
const INITIAL_TRAINERS: Trainer[] = [
  // GKP Club (2 coaches)
  { id: "t1", name: "Rishikesh Shukla", courtId: "court-1", passcode: "7241" },
  { id: "t2", name: "Ravi Kanu", courtId: "court-1", passcode: "8356" },

  // Kalptaru Aura (2 coaches)
  { id: "t3", name: "Vinit Vaidya", courtId: "court-2", passcode: "5892" },
  { id: "t4", name: "Abhishek Gupta", courtId: "court-2", passcode: "4673" },

  // The Orchards (2 coaches - Rishikesh Shukla has access to both GKP Club and The Orchards)
  { id: "t5", name: "Veknis Swami", courtId: "court-3", passcode: "9184" },
  { id: "t6", name: "Rishikesh Shukla", courtId: "court-3", passcode: "7241" }, // Same passcode as court-1

  // The Address (3 coaches)
  { id: "t7", name: "Praful Kamble", courtId: "court-4", passcode: "3527" },
  { id: "t8", name: "Saurabh Gosai", courtId: "court-4", passcode: "6849" },
  { id: "t9", name: "Saurabh Gupta", courtId: "court-4", passcode: "2915" },

  // Aaradhya One MICL (1 coach)
  { id: "t10", name: "Rahul Verma", courtId: "court-5", passcode: "5738" },
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
  TRAINERS: "attendance_hub_trainers",
};

// Passcodes
export const PASSCODES = {
  ADMIN: "0000",
};

// Storage Helpers
export const storage = {
  getGroups: (): Group[] => {
    const data = localStorage.getItem(STORAGE_KEYS.GROUPS);
    if (!data) return INITIAL_GROUPS;

    const groups = JSON.parse(data);
    if (groups.length !== 2 || groups[0].name !== "4 to 5") {
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_GROUPS));
      return INITIAL_GROUPS;
    }
    return groups;
  },

  getStudents: (): Student[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : INITIAL_STUDENTS;
  },

  getAttendance: (): AttendanceRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },

  getTrainers: (): Trainer[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRAINERS);
    return data ? JSON.parse(data) : INITIAL_TRAINERS;
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
    const filteredRecords = records.filter(
      (r) => !(r.date === record.date && r.groupId === record.groupId && r.courtId === record.courtId)
    );
    const newRecords = [...filteredRecords, record];
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(newRecords));
    return newRecords;
  },

  saveTrainer: (trainer: Trainer) => {
    const trainers = storage.getTrainers();
    const newTrainers = [...trainers, trainer];
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(newTrainers));
    return newTrainers;
  },

  updateTrainer: (trainerId: string, updates: Partial<Trainer>) => {
    const trainers = storage.getTrainers();
    const newTrainers = trainers.map(t =>
      t.id === trainerId ? { ...t, ...updates } : t
    );
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(newTrainers));
    return newTrainers;
  },

  deleteTrainer: (trainerId: string) => {
    const trainers = storage.getTrainers();
    const newTrainers = trainers.filter((t) => t.id !== trainerId);
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(newTrainers));
    return newTrainers;
  },

  validateTrainer: (courtId: string, passcode: string): Trainer | null => {
    const trainers = storage.getTrainers();
    return trainers.find(t => t.courtId === courtId && t.passcode === passcode) || null;
  },

  PASSCODES: PASSCODES,
};
