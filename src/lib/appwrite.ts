import { Client, Databases, ID } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1') // API Endpoint
    .setProject('69722da4002667601dd7'); // Correct Project ID

// Initialize Databases
export const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = '69722e890013ea3ea3ba';
export const COLLECTIONS = {
    STUDENTS: 'students',
    ATTENDANCE: 'attendance',
    TRAINERS: 'trainers',
};

// Helper function to generate unique IDs
export const generateId = () => ID.unique();

export default client;
