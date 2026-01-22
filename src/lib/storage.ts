
// Types
export interface Student {
  id: string;
  name: string;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
  days?: number[]; // 0=Sun, 1=Mon, etc.
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

// Court-specific schedules
export const COURT_SCHEDULES: Record<string, Group[]> = {
  "court-1": [ // GGK Club: Mon, Wed, Fri
    { id: "gkp-1", name: "4 to 5 PM (Beginner) - Evening", days: [1, 3, 5] },
    { id: "gkp-2", name: "5 to 6 PM (Advance) - Evening", days: [1, 3, 5] },
  ],
  "court-2": [ // Kalptaru: Different batch structure (TTS = Tue/Thu/Sat, SS = Sun/Sat)
    { id: "kalp-1", name: "4 to 5 PM (TTS-1)", days: [2, 4, 6] }, // Tuesday, Thursday, Saturday
    { id: "kalp-2", name: "5 to 6 PM (TTS-2)", days: [2, 4, 6] }, // Tuesday, Thursday, Saturday
    { id: "kalp-3", name: "8:30 to 9:30 AM (SS Morning-1)", days: [0, 6] }, // Sunday, Saturday
    { id: "kalp-4", name: "9:30 to 10:30 AM (SS Morning-2)", days: [0, 6] }, // Sunday, Saturday
  ],
  "court-3": [ // The Orchards: Tue, Thu
    { id: "orch-1", name: "5 to 6 PM (Beginner) - Evening", days: [2, 4] },
    { id: "orch-2", name: "6 to 7 PM (Intermediate) - Evening", days: [2, 4] },
    { id: "orch-3", name: "7 to 8 PM (Advance) - Evening", days: [2, 4] },
  ],
  "court-4": [ // The Address (Wadhwa): Different batch structure (MWF = Mon/Wed/Fri, SS = Sat/Sun)
    { id: "addr-1", name: "5 to 6 PM (MWF-1)", days: [1, 3, 5] }, // Monday, Wednesday, Friday
    { id: "addr-2", name: "6 to 7 PM (MWF-2)", days: [1, 3, 5] }, // Monday, Wednesday, Friday
    { id: "addr-3", name: "9 to 10 AM (SS Morning)", days: [0, 6] }, // Sunday, Saturday
  ],
  "court-5": [ // Aaradhya One MICL: Tue, Thu
    { id: "micl-1", name: "5 to 6 PM (Beginner) - Evening", days: [2, 4] },
    { id: "micl-2", name: "6 to 7 PM (Advance) - Evening", days: [2, 4] },
  ],
};

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
  // GKP Club Students (Alphabetically sorted) - All students available for both batches
  { id: "gkp-1", name: "AANIT JILLA", groupId: "gkp-all" },
  { id: "gkp-2", name: "AARUSH THAKKAR", groupId: "gkp-all" },
  { id: "gkp-3", name: "AARYA MOTA", groupId: "gkp-all" },
  { id: "gkp-4", name: "AYANSH PATEL", groupId: "gkp-all" },
  { id: "gkp-5", name: "DIVAM SHETH", groupId: "gkp-all" },
  { id: "gkp-6", name: "DOOSHYANT DEDHIA", groupId: "gkp-all" },
  { id: "gkp-7", name: "DVEEJ SANGVEKAR", groupId: "gkp-all" },
  { id: "gkp-8", name: "HEMI BHAGAT", groupId: "gkp-all" },
  { id: "gkp-9", name: "HEMANSH PATEL", groupId: "gkp-all" },
  { id: "gkp-10", name: "HENIL PATEL", groupId: "gkp-all" },
  { id: "gkp-11", name: "HITARTH BILAKHIA", groupId: "gkp-all" },
  { id: "gkp-12", name: "HRIDHAAN SHAH", groupId: "gkp-all" },
  { id: "gkp-13", name: "HRIISHI PATEL", groupId: "gkp-all" },
  { id: "gkp-14", name: "MAHIR PATEL", groupId: "gkp-all" },
  { id: "gkp-15", name: "MAYAAN VISRIYA", groupId: "gkp-all" },
  { id: "gkp-16", name: "MOKSH JAIN GARODIA", groupId: "gkp-all" },
  { id: "gkp-17", name: "MOKSH SHAH", groupId: "gkp-all" },
  { id: "gkp-18", name: "NITYA BHAGAT", groupId: "gkp-all" },
  { id: "gkp-19", name: "NYRA PATEL", groupId: "gkp-all" },
  { id: "gkp-20", name: "PRUTHVI RAJGOR", groupId: "gkp-all" },
  { id: "gkp-21", name: "RAMYA BHAGAT", groupId: "gkp-all" },
  { id: "gkp-22", name: "RISHAAN ARORA", groupId: "gkp-all" },
  { id: "gkp-23", name: "SAHAJ GALA", groupId: "gkp-all" },
  { id: "gkp-24", name: "SHUBH MEHTA", groupId: "gkp-all" },
  { id: "gkp-25", name: "VIHA GARODIA", groupId: "gkp-all" },
  { id: "gkp-26", name: "VIRANSH NARSANA", groupId: "gkp-all" },
  { id: "gkp-27", name: "VIVAAN SHAH", groupId: "gkp-all" },
  { id: "gkp-28", name: "YUKTI SHAH", groupId: "gkp-all" },

  // Kalptaru Aura Students (Alphabetically sorted) - Batch-specific assignments
  { id: "kal-1", name: "AANYA AGARWAL", groupId: "kalp-1" }, // TTS-1
  { id: "kal-2", name: "AARAV KAMRA", groupId: "kalp-2" }, // TTS-2
  { id: "kal-3", name: "AARAV LATH", groupId: "kalp-2" }, // TTS-2
  { id: "kal-4", name: "AKSHAY MOKIM", groupId: "kalp-1" }, // TTS-1
  { id: "kal-5", name: "ARYAV LAVTI", groupId: "kalp-1" }, // TTS-1
  { id: "kal-6", name: "ATHARVA AVASTI", groupId: "kalp-4" }, // SS Morning-2
  { id: "kal-7", name: "AVNI JYOTULA", groupId: "kalp-2" }, // TTS-2
  { id: "kal-8", name: "CLAIRE ELIZABETH", groupId: "kalp-1" }, // TTS-1
  { id: "kal-9", name: "DEMIRA S", groupId: "kalp-3" }, // SS Morning-1
  { id: "kal-10", name: "GEETANSH GARG", groupId: "kalp-2" }, // TTS-2
  { id: "kal-11", name: "GRANTH KHANDELWAL", groupId: "kalp-3" }, // SS Morning-1
  { id: "kal-12", name: "HEYANSH MEHTA", groupId: "kalp-2" }, // TTS-2
  { id: "kal-13", name: "KAVERI NAIDU", groupId: "kalp-3" }, // SS Morning-1
  { id: "kal-14", name: "LAKSHYA AGARWAL", groupId: "kalp-4" }, // SS Morning-2
  { id: "kal-15", name: "MIVAAN CHANDAK", groupId: "kalp-2" }, // TTS-2
  { id: "kal-16", name: "PREM SAKPALE", groupId: "kalp-2" }, // TTS-2
  { id: "kal-17", name: "PRITI", groupId: "kalp-3" }, // SS Morning-1
  { id: "kal-18", name: "SARANG SESHADRI", groupId: "kalp-3" }, // SS Morning-1
  { id: "kal-19", name: "SHAISH SADANA", groupId: "kalp-4" }, // SS Morning-2
  { id: "kal-20", name: "SHANAY JAIN", groupId: "kalp-4" }, // SS-2
  { id: "kal-21", name: "SHARVIL SRIVASTVA", groupId: "kalp-2" }, // TTS-2
  { id: "kal-22", name: "SHIVEN SHAH", groupId: "kalp-4" }, // SS-2

  // The Orchards Students (Alphabetically sorted) - All students available for all batches
  { id: "orch-1", name: "AARNA LAKOTIA", groupId: "orch-all" },
  { id: "orch-2", name: "AARNA THAKKAR", groupId: "orch-all" },
  { id: "orch-3", name: "AARAV SHINDE", groupId: "orch-all" },
  { id: "orch-4", name: "AAYUSHMAN OLD", groupId: "orch-all" },
  { id: "orch-5", name: "ABHIR SHETTY", groupId: "orch-all" },
  { id: "orch-6", name: "ABHISHA S", groupId: "orch-all" },
  { id: "orch-7", name: "ADITYA ARUN", groupId: "orch-all" },
  { id: "orch-8", name: "ADITYA RISBOOD", groupId: "orch-all" },
  { id: "orch-9", name: "AGASTYA ANAND", groupId: "orch-all" },
  { id: "orch-10", name: "AMAYRA ANAND", groupId: "orch-all" },
  { id: "orch-11", name: "AMIRAH KHAN", groupId: "orch-all" },
  { id: "orch-12", name: "AMY B", groupId: "orch-all" },
  { id: "orch-13", name: "ANSH B AMY", groupId: "orch-all" },
  { id: "orch-14", name: "ARSH TYAGI", groupId: "orch-all" },
  { id: "orch-15", name: "ARYAN GUPTA", groupId: "orch-all" },
  { id: "orch-16", name: "ARYNEIL BHANDARKAR", groupId: "orch-all" },
  { id: "orch-17", name: "ASHAR KHAN", groupId: "orch-all" },
  { id: "orch-18", name: "ASHRITA RAJPOPAT", groupId: "orch-all" },
  { id: "orch-19", name: "AVANTIKA ARUN", groupId: "orch-all" },
  { id: "orch-20", name: "AYANSH DAGA", groupId: "orch-all" },
  { id: "orch-21", name: "AYUSHMAN NEW", groupId: "orch-all" },
  { id: "orch-22", name: "DHRUV SHINDE", groupId: "orch-all" },
  { id: "orch-23", name: "DIVU SHEKHAWAT", groupId: "orch-all" },
  { id: "orch-24", name: "FAIZAN MOHMMAD", groupId: "orch-all" },
  { id: "orch-25", name: "GADIN PAREKH", groupId: "orch-all" },
  { id: "orch-26", name: "JANAV KHANCHANDANI", groupId: "orch-all" },
  { id: "orch-27", name: "JANOSH KHARAT", groupId: "orch-all" },
  { id: "orch-28", name: "KABIR NIGAM", groupId: "orch-all" },
  { id: "orch-29", name: "KABIR PANJWANI", groupId: "orch-all" },
  { id: "orch-30", name: "KRISH PANJWANI", groupId: "orch-all" },
  { id: "orch-31", name: "KSHITIJ KATYAL", groupId: "orch-all" },
  { id: "orch-32", name: "MANAN MOTWANI", groupId: "orch-all" },
  { id: "orch-33", name: "NACHIKET CHAUDHARY", groupId: "orch-all" },
  { id: "orch-34", name: "NAKSH PASPULA", groupId: "orch-all" },
  { id: "orch-35", name: "NAVYA PAWAR", groupId: "orch-all" },
  { id: "orch-36", name: "NEIL JAIN", groupId: "orch-all" },
  { id: "orch-37", name: "NICOLAS D", groupId: "orch-all" },
  { id: "orch-38", name: "NIRVAAN", groupId: "orch-all" },
  { id: "orch-39", name: "NIYAAN SIKARIYA", groupId: "orch-all" },
  { id: "orch-40", name: "OM PAWAR", groupId: "orch-all" },
  { id: "orch-41", name: "PARI S", groupId: "orch-all" },
  { id: "orch-42", name: "REYANSH SATRA", groupId: "orch-all" },
  { id: "orch-43", name: "RONIT GUPTA", groupId: "orch-all" },
  { id: "orch-44", name: "SAESHA VORA", groupId: "orch-all" },
  { id: "orch-45", name: "SHASHWAT AGARWAL", groupId: "orch-all" },
  { id: "orch-46", name: "SHIVANK SUBUDHI", groupId: "orch-all" },
  { id: "orch-47", name: "SOHAM MOTWANI", groupId: "orch-all" },
  { id: "orch-48", name: "SUVRAT VAIDYA", groupId: "orch-all" },
  { id: "orch-49", name: "TAPAS MODI", groupId: "orch-all" },
  { id: "orch-50", name: "UMRAN KHAN", groupId: "orch-all" },
  { id: "orch-51", name: "VANDITA S", groupId: "orch-all" },
  { id: "orch-52", name: "VANEESHA S", groupId: "orch-all" },
  { id: "orch-53", name: "VARNAN MAHROTA", groupId: "orch-all" },
  { id: "orch-54", name: "VED BRILLAIN", groupId: "orch-all" },
  { id: "orch-55", name: "VIAANSH MEHTA", groupId: "orch-all" },
  { id: "orch-56", name: "VIAN ARORA", groupId: "orch-all" },
  { id: "orch-57", name: "VIVAAN SHASTRI", groupId: "orch-all" },
  { id: "orch-58", name: "VYOM UPADHY", groupId: "orch-all" },
  { id: "orch-59", name: "ZAYD LAMBAY", groupId: "orch-all" },

  // The Address (Wadhwa) Students (Alphabetically sorted) - Batch-specific assignments
  { id: "addr-1", name: "AAHIL S", groupId: "addr-1" }, // MWF-1
  { id: "addr-2", name: "AAIRA S", groupId: "addr-2" }, // MWF-2
  { id: "addr-3", name: "AARYA BAID", groupId: "addr-3" }, // SS Morning
  { id: "addr-4", name: "ANVI SAXENA", groupId: "addr-1" }, // MWF-1
  { id: "addr-5", name: "ARIN PATIL", groupId: "addr-1" }, // MWF-1
  { id: "addr-6", name: "AVNI SHAH", groupId: "addr-2" }, // MWF-2
  { id: "addr-7", name: "DRAVYA PATEL", groupId: "addr-1" }, // MWF-1
  { id: "addr-8", name: "FIONA JAIN", groupId: "addr-1" }, // MWF-1
  { id: "addr-9", name: "HANNAH JOSHI", groupId: "addr-3" }, // SS Morning
  { id: "addr-10", name: "HARRY BAID", groupId: "addr-3" }, // SS Morning
  { id: "addr-11", name: "HARSHIT SAXENA", groupId: "addr-3" }, // SS Morning
  { id: "addr-12", name: "HIYA SINGH", groupId: "addr-2" }, // MWF-2
  { id: "addr-13", name: "HRIDAY DEODHAR", groupId: "addr-1" }, // MWF-1
  { id: "addr-14", name: "HRISHA SHAH", groupId: "addr-1" }, // MWF-1
  { id: "addr-15", name: "HRITVI KHURANA", groupId: "addr-3" }, // SS Morning
  { id: "addr-16", name: "JAIZVEEN KAUR", groupId: "addr-3" }, // SS Morning
  { id: "addr-17", name: "JIYANSHI PARWAL", groupId: "addr-2" }, // MWF-2
  { id: "addr-18", name: "MEDANSH", groupId: "addr-2" }, // MWF-2
  { id: "addr-19", name: "MISHIKA TOSHNIWAL", groupId: "addr-3" }, // SS Morning
  { id: "addr-20", name: "NILAYA GANESHAN", groupId: "addr-1" }, // MWF-1
  { id: "addr-21", name: "NIVIKA KALRA", groupId: "addr-1" }, // MWF-1
  { id: "addr-22", name: "PRANSHU PATEL", groupId: "addr-2" }, // MWF-2
  { id: "addr-23", name: "PRERITH S", groupId: "addr-3" }, // SS Morning
  { id: "addr-24", name: "RADHA NEHULKAR", groupId: "addr-1" }, // MWF-1
  { id: "addr-25", name: "REEDA SHAIKH", groupId: "addr-2" }, // MWF-2
  { id: "addr-26", name: "RISHIV MITHIYA", groupId: "addr-3" }, // SS Morning
  { id: "addr-27", name: "SAHAN PATIL", groupId: "addr-1" }, // MWF-1
  { id: "addr-28", name: "SAMARTH MADHUSUDHAN", groupId: "addr-1" }, // MWF-1
  { id: "addr-29", name: "SAMVED MADUSUDHAN", groupId: "addr-2" }, // MWF-2
  { id: "addr-30", name: "SHIKHAR CHAUDHRY", groupId: "addr-3" }, // SS Morning
  { id: "addr-31", name: "SRIESH WAGLE", groupId: "addr-1" }, // MWF-1
  { id: "addr-32", name: "TVARITA DESHORA", groupId: "addr-1" }, // MWF-1
  { id: "addr-33", name: "VIRAJ PAWAR", groupId: "addr-2" }, // MWF-2
  { id: "addr-34", name: "YUKT BHATIA", groupId: "addr-1" }, // MWF-1
  { id: "addr-35", name: "ZEEHAN", groupId: "addr-1" }, // MWF-1

  // Aaradhya One MICL Students (Alphabetically sorted) - All students available for all batches
  { id: "micl-1", name: "AAHANA ROHIRA", groupId: "micl-all" },
  { id: "micl-2", name: "AARNA DARDA", groupId: "micl-all" },
  { id: "micl-3", name: "ANSHWI HARIA", groupId: "micl-all" },
  { id: "micl-4", name: "DRISHA GANDHI", groupId: "micl-all" },
  { id: "micl-5", name: "GRIVA SHAH", groupId: "micl-all" },
  { id: "micl-6", name: "HETIKA JAIN", groupId: "micl-all" },
  { id: "micl-7", name: "JIYANA JHAVERI", groupId: "micl-all" },
  { id: "micl-8", name: "KASHISH SHAH", groupId: "micl-all" },
  { id: "micl-9", name: "MISHKA SHAH", groupId: "micl-all" },
  { id: "micl-10", name: "MYRA RUPAREL", groupId: "micl-all" },
  { id: "micl-11", name: "NAVYANAVELI SONI", groupId: "micl-all" },
  { id: "micl-12", name: "NIA SHAH", groupId: "micl-all" },
  { id: "micl-13", name: "PREITIKA GOHEL", groupId: "micl-all" },
  { id: "micl-14", name: "SHREYA JHAVERI", groupId: "micl-all" },
  { id: "micl-15", name: "VANYA SHAH", groupId: "micl-all" },
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
  // Force update students to ensure new GKP student list is present
  // This overwrites old student data with the new correct list
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  // Groups are now static configuration in code (COURT_SCHEDULES), not in localStorage

  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
  }

  // Force update trainers to ensure new passcodes and SHREE PATIL are present
  // This overwrites old trainer data with the new correct list
  localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(INITIAL_TRAINERS));
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
  getGroups: (courtId?: string): Group[] => {
    // If courtId provided, return specific schedule, otherwise return empty or all
    if (courtId && COURT_SCHEDULES[courtId]) {
      return COURT_SCHEDULES[courtId];
    }
    // Fallback for students who might have old group IDs
    return [];
  },

  // Attendance
  getAttendance: (): AttendanceRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },

  saveAttendance: (record: AttendanceRecord) => {
    const records = storage.getAttendance();
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
