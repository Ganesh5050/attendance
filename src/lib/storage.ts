import { supabase, generateId } from './supabase';

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
  submittedAt?: string; // Full ISO timestamp when attendance was marked
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

// Storage API - NOW ASYNC FOR SUPABASE
export const storage = {
  // Students
  getStudents: async (): Promise<Student[]> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .limit(5000);

      if (error) throw error;

      return (data || []).map(doc => ({
        id: doc.id,
        name: doc.name,
        groupId: doc.groupId,
        $id: doc.id
      }));
    } catch (error) {
      console.error("Failed to fetch students:", error);
      return [];
    }
  },

  saveStudent: async (student: Student) => {
    const { data, error } = await supabase
      .from('students')
      .insert([{
        id: student.id || generateId(),
        name: student.name,
        groupId: student.groupId
      }])
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  },

  deleteStudent: async (studentId: string) => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);

    if (error) throw error;
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
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false })
        .limit(5000);

      if (error) throw error;

      return (data || []).map(doc => ({
        id: doc.id,
        date: doc.date,
        submittedAt: doc.submittedAt || doc.created_at,
        courtId: doc.courtId,
        groupId: doc.groupId,
        trainerId: doc.trainerId,
        trainerName: doc.trainerName,
        eventName: doc.eventName,
        presentStudentIds: doc.presentStudentIds || [],
        $id: doc.id
      }));
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      return [];
    }
  },

  saveAttendance: async (record: AttendanceRecord) => {
    const { data, error } = await supabase
      .from('attendance')
      .insert([{
        id: record.id || generateId(),
        date: record.date,
        "submittedAt": new Date().toISOString(),
        "courtId": record.courtId,
        "groupId": record.groupId,
        "trainerId": record.trainerId,
        "trainerName": record.trainerName,
        "eventName": record.eventName,
        "presentStudentIds": record.presentStudentIds || []
      }])
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  },

  // Trainers
  getTrainers: async (): Promise<Trainer[]> => {
    try {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .limit(100);

      if (error) throw error;

      return (data || []).map(doc => ({
        id: doc.id,
        name: doc.name,
        courtId: doc.courtId,
        passcode: doc.passcode,
        $id: doc.id
      }));
    } catch (error) {
      console.error("Failed to fetch trainers:", error);
      return [];
    }
  },

  saveTrainer: async (trainer: Trainer) => {
    const { data, error } = await supabase
      .from('trainers')
      .insert([{
        id: trainer.id || generateId(),
        name: trainer.name,
        "courtId": trainer.courtId,
        passcode: trainer.passcode
      }])
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  },

  updateTrainer: async (id: string, updates: Partial<Trainer>) => {
    const updateData: any = { ...updates };
    delete updateData.id;
    delete updateData.$id;

    // Ensure case matching for supabase
    if (updateData.courtId) {
      updateData["courtId"] = updateData.courtId;
    }

    const { data, error } = await supabase
      .from('trainers')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data && data[0] ? data[0] : null;
  },

  deleteTrainer: async (id: string) => {
    const { error } = await supabase
      .from('trainers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  validateTrainer: async (courtId: string, passcode: string): Promise<Trainer | null> => {
    try {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('courtId', courtId)
        .eq('passcode', passcode);

      if (error) throw error;

      if (data && data.length > 0) {
        const doc = data[0];
        return {
          id: doc.id,
          name: doc.name,
          courtId: doc.courtId,
          passcode: doc.passcode,
          $id: doc.id
        };
      }
    } catch (e) {
      console.error("Validation error", e);
    }
    return null;
  },

  PASSCODES,
};
