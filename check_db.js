import { Client, Databases } from 'node-appwrite';

// Initialize Appwrite
const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69722da4002667601dd7');

const databases = new Databases(client);
const DATABASE_ID = '69722e890013ea3ea3ba';
const ATTENDANCE_COLLECTION_ID = 'attendance';

async function checkAttendanceCollection() {
    console.log('🔍 Checking Attendance Collection...');
    try {
        const collection = await databases.getCollection(DATABASE_ID, ATTENDANCE_COLLECTION_ID);
        console.log('✅ Collection exists:', collection.name);

        // List attributes
        const attributes = await databases.listAttributes(DATABASE_ID, ATTENDANCE_COLLECTION_ID);
        console.log('📋 Attributes:', attributes.attributes.map(a => a.key).join(', '));

        // Check for 'date' index
        const indexes = await databases.listIndexes(DATABASE_ID, ATTENDANCE_COLLECTION_ID);
        console.log('📑 Indexes:', indexes.indexes.map(i => i.key).join(', '));

        const dateIndex = indexes.indexes.find(i => i.key === 'date');
        if (!dateIndex) {
            console.log('⚠️ Missing index for "date". Creating one...');
            // Need index for sorting/filtering
            await databases.createIndex(DATABASE_ID, ATTENDANCE_COLLECTION_ID, 'date_idx', 'key', ['date'], ['DESC']);
            console.log('✅ Created index: date_idx');
        } else {
            console.log('✅ Index "date" exists.');
        }

    } catch (e) {
        console.error('❌ Error checking collection:', e.message);
        if (e.code === 404) {
            console.log('💡 You might need to create the "attendance" collection manually!');
        }
    }
}

checkAttendanceCollection().catch(console.error);
