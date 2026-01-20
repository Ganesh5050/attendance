
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
  // Admin (Universal Coach - can mark attendance at any center when trainers are absent)
  { id: "admin-t1", name: "SHREE PATIL", courtId: "court-1", passcode: "0000" },
  { id: "admin-t2", name: "SHREE PATIL", courtId: "court-2", passcode: "0000" },
  { id: "admin-t3", name: "SHREE PATIL", courtId: "court-3", passcode: "0000" },
  { id: "admin-t4", name: "SHREE PATIL", courtId: "court-4", passcode: "0000" },
  { id: "admin-t5", name: "SHREE PATIL", courtId: "court-5", passcode: "0000" },

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
  { id: "s5", name: "Emma Davis", groupId: "4-5" },
  { id: "s6", name: "Frank Miller", groupId: "5-6" },
  { id: "s7", name: "Grace Taylor", groupId: "4-5" },
  { id: "s8", name: "Henry White", groupId: "5-6" },
];

// Court Names Mapping
export const COURT_NAMES: Record<string, string> = {
  "court-1": "GKP Club",
  "court-2": "Kalptaru Aura",
  "court-3": "The Orchards",
  "court-4": "The Address (Wadhwa)",
  "court-5": "Aaradhya One MICL",
};

// Helper function to get court name
export const getCourtName = (courtId: string): string => {
  return COURT_NAMES[courtId] || courtId;
};

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

// Initialize storage with default data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GROUPS)) {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_GROUPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
  }

  // Always ensure trainers include SHREE PATIL (admin)
  const existingTrainers = localStorage.getItem(STORAGE_KEYS.TRAINERS);
  if (!existingTrainers) {
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(INITIAL_TRAINERS));
  } else {
    const trainers = JSON.parse(existingTrainers);
    const hasAdmin = trainers.some((t: Trainer) => t.name === "SHREE PATIL");
    if (!hasAdmin) {
      // Add SHREE PATIL to all courts
      const adminTrainers = INITIAL_TRAINERS.filter(t => t.name === "SHREE PATIL");
      const updatedTrainers = [...trainers, ...adminTrainers];
      localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(updatedTrainers));
    }
  }
};

// Initialize on module load
initializeStorage();

// Storage API
export const storage = {
  // Students
  getStudents: (): Student[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  },

  saveStudent: (student: Student) => {
    const students = storage.getStudents();
    students.push(student);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  updateStudent: (id: string, updates: Partial<Student>) => {
    const students = storage.getStudents();
    const index = students.findIndex((s) => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
  },

  deleteStudent: (id: string) => {
    const students = storage.getStudents().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  // Groups
  getGroups: (): Group[] => {
    const data = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return data ? JSON.parse(data) : [];
  },

  // Attendance
  getAttendanceRecords: (): AttendanceRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },

  saveAttendanceRecord: (record: AttendanceRecord) => {
    const records = storage.getAttendanceRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  },

  // Trainers
  getTrainers: (): Trainer[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRAINERS);
    return data ? JSON.parse(data) : [];
  },

  saveTrainer: (trainer: Trainer) => {
    const trainers = storage.getTrainers();
    trainers.push(trainer);
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(trainers));
  },

  updateTrainer: (id: string, updates: Partial<Trainer>) => {
    const trainers = storage.getTrainers();
    const index = trainers.findIndex((t) => t.id === id);
    if (index !== -1) {
      trainers[index] = { ...trainers[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(trainers));
    }
  },

  deleteTrainer: (id: string) => {
    const trainers = storage.getTrainers().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(trainers));
  },

  validateTrainer: (courtId: string, passcode: string): Trainer | null => {
    const trainers = storage.getTrainers();
    return trainers.find((t) => t.courtId === courtId && t.passcode === passcode) || null;
  },

  PASSCODES,
};
