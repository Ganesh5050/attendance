import { Client, Databases } from 'node-appwrite';

// Initialize Appwrite
const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69722da4002667601dd7');

// Use the API Key if you have one, otherwise we hope the "Any" permission allows this.
// Ideally, this needs an API Key with 'collections.write' permission.
// If this fails, you MUST do it manually in the console.

const databases = new Databases(client);
const DATABASE_ID = '69722e890013ea3ea3ba';
const ATTENDANCE_COLLECTION = 'attendance';

async function fixSchema() {
    console.log('🔧 Fixing Attendance Collection Schema...');

    const attributes = [
        { key: 'courtId', size: 50, required: true },
        { key: 'groupId', size: 50, required: true },
        { key: 'trainerId', size: 50, required: true },
        { key: 'trainerName', size: 100, required: true },
        { key: 'date', size: 20, required: true },
        { key: 'id', size: 50, required: true },
        { key: 'submittedAt', size: 50, required: false },
        { key: 'eventName', size: 100, required: false },
        { key: 'presentStudentIds', size: 5000, required: true, array: true }
    ];

    for (const attr of attributes) {
        try {
            console.log(`Adding attribute: ${attr.key}...`);
            if (attr.array) {
                await databases.createStringAttribute(DATABASE_ID, ATTENDANCE_COLLECTION, attr.key, attr.size, attr.required, undefined, true);
            } else {
                await databases.createStringAttribute(DATABASE_ID, ATTENDANCE_COLLECTION, attr.key, attr.size, attr.required);
            }
            console.log(`✅ Created: ${attr.key}`);
            // Wait a bit because Appwrite takes time to process schema changes
            await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
            if (e.code === 409) {
                console.log(`ℹ️ Attribute '${attr.key}' already exists.`);
            } else if (e.code === 401 || e.code === 403) {
                console.error(`❌ PERMISSION ERROR: Cannot create attribute '${attr.key}'.`);
                console.log(`👉 SOLUTION: Go to Appwrite Console -> Database -> Attendance -> Attributes`);
                console.log(`   and create '${attr.key}' manually.`);
            } else {
                console.error(`❌ Error creating '${attr.key}':`, e.message);
            }
        }
    }
    console.log('\n✨ Schema update attempts finished.');
}

fixSchema();
