import { Client, Databases, ID, Query } from 'node-appwrite';

// Initialize Appwrite
const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69722da4002667601dd7');

const databases = new Databases(client);
const DATABASE_ID = '69722e890013ea3ea3ba';
const STUDENTS_COLLECTION = 'students';
const ATTENDANCE_COLLECTION = 'attendance';

async function fixDuplicatesAndTest() {
    console.log('🧹 Starting Cleanup & Diagnostic...');

    // 1. Deduplicate Students
    try {
        console.log('\n--- 1. Deduplicating Students ---');
        let allStudents = [];
        let offset = 0;
        let limit = 100; // Fetch in chunks

        // Fetch all students
        while (true) {
            const res = await databases.listDocuments(DATABASE_ID, STUDENTS_COLLECTION, [
                Query.limit(limit),
                Query.offset(offset)
            ]);
            allStudents.push(...res.documents);
            if (res.documents.length < limit) break;
            offset += limit;
        }

        console.log(`Found ${allStudents.length} total student records.`);

        const seenIds = new Set();
        const duplicates = [];

        for (const doc of allStudents) {
            if (seenIds.has(doc.id)) { // doc.id is our custom ID 'gkp-1'
                duplicates.push(doc);
            } else {
                seenIds.add(doc.id);
            }
        }

        console.log(`Found ${duplicates.length} duplicates to remove.`);

        if (duplicates.length > 0) {
            console.log('Deleting duplicates...');
            for (const doc of duplicates) {
                await databases.deleteDocument(DATABASE_ID, STUDENTS_COLLECTION, doc.$id);
                console.log(`❌ Deleted duplicate: ${doc.name} (${doc.id})`);
            }
            console.log('✅ Deduplication Complete!');
        } else {
            console.log('✅ No duplicates found.');
        }

    } catch (e) {
        console.error('⚠️ Deduplication Error:', e.message);
    }

    // 2. Test Attendance Write
    console.log('\n--- 2. Testing Attendance Write ---');
    try {
        const testRecord = {
            date: '2025-01-01', // ISO string
            courtId: 'test-court',
            groupId: 'test-group',
            trainerId: 'test-trainer',
            trainerName: 'Test Trainer',
            presentStudentIds: ['test-s1', 'test-s2'] // This MUST be supported as array
        };

        console.log('Attempting to create a test attendance record...');
        const doc = await databases.createDocument(
            DATABASE_ID,
            ATTENDANCE_COLLECTION,
            ID.unique(),
            testRecord
        );
        console.log('✅ SUCCESS! Attendance record created.');

        // Clean up test record
        await databases.deleteDocument(DATABASE_ID, ATTENDANCE_COLLECTION, doc.$id);
        console.log('✅ Test record deleted.');

    } catch (e) {
        console.error('❌ FAILED to save attendance:', e.message);
        console.log('\n🚨 DIAGNOSIS 🚨');
        if (e.message.includes('Attribute not found')) {
            console.log('👉 You are MISSING an attribute in the "attendance" collection.');
            console.log('   Check if "presentStudentIds", "date", or "trainerName" exists.');
        } else if (e.message.includes('Invalid attribute value')) {
            console.log('👉 Attribute Type Mismatch!');
            console.log('   Specifically check "presentStudentIds". Is it an ARRAY? (Icon should be list, not text)');
        }
        console.log('Please fix the Schema in Appwrite Console -> Database -> Attendance.');
    }
}

fixDuplicatesAndTest();
