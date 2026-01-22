import { databases, DATABASE_ID, COLLECTIONS, generateId } from './appwrite';
import { Query } from 'appwrite';

// Types
export interface Student {
  id: string;
  name: string;
  groupId: string;
  $id?: string;
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
  $id?: string;
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
  $id?: string;
}

// Court-specific schedules (Static Config - No need for database)
export const COURT_SCHEDULES: Record<string, Group[]> = {
  "court-1": [ // GGK Club: Mon, Wed, Fri
    { id: "gkp-1", name: "4 to 5 PM (Beginner) - Evening", days: [1, 3, 5] },
    { id: "gkp-2", name: "5 to 6 PM (Advance) - Evening", days: [1, 3, 5] },
  ],
  "court-2": [ // Kalptaru: Different batch structure (TTS = Tue/Thu/Sat, SS = Sun/Sat)
    { id: "kalp-1", name: "4 to 5 PM (TTS-1)", days: [2, 4, 6] },
    { id: "kalp-2", name: "5 to 6 PM (TTS-2)", days: [2, 4, 6] },
    { id: "kalp-3", name: "8:30 to 9:30 AM (SS Morning-1)", days: [0, 6] },
    { id: "kalp-4", name: "9:30 to 10:30 AM (SS Morning-2)", days: [0, 6] },
  ],
  "court-3": [ // The Orchards: Tue, Thu
    { id: "orch-1", name: "5 to 6 PM (Beginner) - Evening", days: [2, 4] },
    { id: "orch-2", name: "6 to 7 PM (Intermediate) - Evening", days: [2, 4] },
    { id: "orch-3", name: "7 to 8 PM (Advance) - Evening", days: [2, 4] },
  ],
  "court-4": [ // The Address (Wadhwa): Different batch structure (MWF = Mon/Wed/Fri, SS = Sat/Sun)
    { id: "addr-1", name: "5 to 6 PM (MWF-1)", days: [1, 3, 5] },
    { id: "addr-2", name: "6 to 7 PM (MWF-2)", days: [1, 3, 5] },
    { id: "addr-3", name: "9 to 10 AM (SS Morning)", days: [0, 6] },
  ],
  "court-5": [ // Aaradhya One MICL: Tue, Thu
    { id: "micl-1", name: "5 to 6 PM (Beginner) - Evening", days: [2, 4] },
    { id: "micl-2", name: "6 to 7 PM (Advance) - Evening", days: [2, 4] },
  ],
};

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

// Passcodes
export const PASSCODES = {
  ADMIN: "0000",
};

// Storage API - NOW ASYNC FOR APPWRITE
export const storage = {
  // Students
  getStudents: async (): Promise<Student[]> => {
    try {
      // Fetch maximum 5000 students (Appwrite limits default to 25)
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDENTS,
        [Query.limit(5000)]
      );
      return response.documents.map(doc => ({
        id: doc.id || doc.$id, // Handle both our manual ID and Appwrite's internal $id
        name: doc.name,
        groupId: doc.groupId,
        $id: doc.$id
      }));
    } catch (error) {
      console.error("Failed to fetch students:", error);
      return [];
    }
  },

  saveStudent: async (student: Student) => {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENTS,
      generateId(),
      {
        id: student.id || generateId(),
        name: student.name,
        groupId: student.groupId
      }
    );
  },

  deleteStudent: async (studentId: string) => {
    // We need to find the document by our custom 'id' attribute first if we don't have $id
    // But ideally we should use $id. For now, let's try to query by attribute 'id'
    const list = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.STUDENTS,
      [Query.equal('id', studentId)]
    );

    if (list.documents.length > 0) {
      return await databases.deleteDocument(DATABASE_ID, COLLECTIONS.STUDENTS, list.documents[0].$id);
    }
  },

  // Groups (No DB change needed - static)
  getGroups: (courtId?: string): Group[] => {
    if (courtId && COURT_SCHEDULES[courtId]) {
      return COURT_SCHEDULES[courtId];
    }
    return [];
  },

  // Attendance
  getAttendance: async (): Promise<AttendanceRecord[]> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ATTENDANCE,
        [Query.limit(5000), Query.orderDesc('date')]
      );

      // We need to parse 'presentStudentIds' as it might be stored as string array
      return response.documents.map(doc => ({
        id: doc.$id,
        date: doc.date,
        courtId: doc.courtId,
        groupId: doc.groupId,
        trainerId: doc.trainerId,
        trainerName: doc.trainerName,
        eventName: doc.eventName,
        presentStudentIds: doc.presentStudentIds, // Appwrite handles string arrays
        $id: doc.$id
      }));
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      return [];
    }
  },

  saveAttendance: async (record: AttendanceRecord) => {
    // Note context: Appwrite attributes must match exactly. 
    // presentStudentIds is an array of strings.
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ATTENDANCE,
      generateId(),
      {
        date: record.date,
        courtId: record.courtId,
        groupId: record.groupId,
        trainerId: record.trainerId,
        trainerName: record.trainerName,
        eventName: record.eventName,
        presentStudentIds: record.presentStudentIds
      }
    );
  },

  // Trainers
  getTrainers: async (): Promise<Trainer[]> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TRAINERS,
        [Query.limit(100)]
      );
      return response.documents.map(doc => ({
        id: doc.$id, // Using internal ID as primary
        name: doc.name,
        courtId: doc.courtId,
        passcode: doc.passcode,
        $id: doc.$id
      }));
    } catch (error) {
      console.error("Failed to fetch trainers:", error);
      return [];
    }
  },

  saveTrainer: async (trainer: Trainer) => {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.TRAINERS,
      generateId(),
      {
        name: trainer.name,
        courtId: trainer.courtId,
        passcode: trainer.passcode
      }
    );
  },

  updateTrainer: async (id: string, updates: Partial<Trainer>) => {
    // 'id' here assumes the document ID ($id)
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.TRAINERS,
      id,
      updates
    );
  },

  deleteTrainer: async (id: string) => {
    return await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TRAINERS, id);
  },

  validateTrainer: async (courtId: string, passcode: string): Promise<Trainer | null> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TRAINERS,
        [
          Query.equal('courtId', courtId),
          Query.equal('passcode', passcode)
        ]
      );
      if (response.documents.length > 0) {
        const doc = response.documents[0];
        return {
          id: doc.$id,
          name: doc.name,
          courtId: doc.courtId,
          passcode: doc.passcode,
          $id: doc.$id
        };
      }
    } catch (e) {
      console.error("Validation error", e);
    }
    return null;
  },

  PASSCODES,
};
