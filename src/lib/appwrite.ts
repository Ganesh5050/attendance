import { databases, DATABASE_ID, COLLECTIONS, generateId } from './firebase';
import { Query } from 'appwrite';

// Student type
export interface Student {
    id: string;
    name: string;
    groupId: string;
}

// Attendance type
export interface AttendanceRecord {
    id: string;
    date: string;
    groupId: string;
    presentStudentIds: string[];
    trainerName?: string;
    submittedAt?: string;
}

// Trainer type
export interface Trainer {
    id: string;
    name: string;
    courtId: string;
    passcode: string;
}

// ==================== STUDENTS ====================

export const getAllStudents = async (): Promise<Student[]> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.STUDENTS,
            [Query.limit(500)] // Get up to 500 students
        );
        return response.documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            groupId: doc.groupId,
        }));
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
};

export const addStudent = async (student: Omit<Student, '$id'>): Promise<Student | null> => {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.STUDENTS,
            generateId(),
            {
                id: student.id,
                name: student.name,
                groupId: student.groupId,
            }
        );
        return {
            id: response.id,
            name: response.name,
            groupId: response.groupId,
        };
    } catch (error) {
        console.error('Error adding student:', error);
        return null;
    }
};

export const deleteStudent = async (documentId: string): Promise<boolean> => {
    try {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.STUDENTS, documentId);
        return true;
    } catch (error) {
        console.error('Error deleting student:', error);
        return false;
    }
};

// ==================== ATTENDANCE ====================

export const getAllAttendance = async (): Promise<AttendanceRecord[]> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.ATTENDANCE,
            [Query.limit(1000)]
        );
        return response.documents.map(doc => ({
            id: doc.id,
            date: doc.date,
            groupId: doc.groupId,
            presentStudentIds: JSON.parse(doc.presentStudentIds || '[]'),
            trainerName: doc.trainerName,
            submittedAt: doc.submittedAt,
        }));
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return [];
    }
};

export const saveAttendance = async (
    attendance: Omit<AttendanceRecord, 'id'>
): Promise<AttendanceRecord | null> => {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.ATTENDANCE,
            generateId(),
            {
                id: generateId(),
                date: attendance.date,
                groupId: attendance.groupId,
                presentStudentIds: JSON.stringify(attendance.presentStudentIds),
                trainerName: attendance.trainerName || '',
                submittedAt: attendance.submittedAt || new Date().toISOString(),
            }
        );
        return {
            id: response.id,
            date: response.date,
            groupId: response.groupId,
            presentStudentIds: JSON.parse(response.presentStudentIds),
            trainerName: response.trainerName,
            submittedAt: response.submittedAt,
        };
    } catch (error) {
        console.error('Error saving attendance:', error);
        return null;
    }
};

// ==================== TRAINERS ====================

export const getAllTrainers = async (): Promise<Trainer[]> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.TRAINERS,
            [Query.limit(100)]
        );
        return response.documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            courtId: doc.courtId,
            passcode: doc.passcode,
        }));
    } catch (error) {
        console.error('Error fetching trainers:', error);
        return [];
    }
};

export const addTrainer = async (trainer: Omit<Trainer, '$id'>): Promise<Trainer | null> => {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.TRAINERS,
            generateId(),
            {
                id: trainer.id,
                name: trainer.name,
                courtId: trainer.courtId,
                passcode: trainer.passcode,
            }
        );
        return {
            id: response.id,
            name: response.name,
            courtId: response.courtId,
            passcode: response.passcode,
        };
    } catch (error) {
        console.error('Error adding trainer:', error);
        return null;
    }
};

export const deleteTrainer = async (documentId: string): Promise<boolean> => {
    try {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TRAINERS, documentId);
        return true;
    } catch (error) {
        console.error('Error deleting trainer:', error);
        return false;
    }
};

export const updateTrainerPasscode = async (
    documentId: string,
    newPasscode: string
): Promise<boolean> => {
    try {
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.TRAINERS, documentId, {
            passcode: newPasscode,
        });
        return true;
    } catch (error) {
        console.error('Error updating trainer passcode:', error);
        return false;
    }
};
