import { Client, Databases, ID } from 'node-appwrite';

// Initialize Appwrite
const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69722da4002667601dd7'); // Correct Project ID

const databases = new Databases(client);
const DATABASE_ID = '69722e890013ea3ea3ba';
const TRAINERS_COLLECTION_ID = 'trainers';

const TRAINERS = [
    { id: "admin-t1", name: "SHREE PATIL", courtId: "court-1", passcode: "0000" },
    { id: "admin-t2", name: "SHREE PATIL", courtId: "court-2", passcode: "0000" },
    { id: "admin-t3", name: "SHREE PATIL", courtId: "court-3", passcode: "0000" },
    { id: "admin-t4", name: "SHREE PATIL", courtId: "court-4", passcode: "0000" },
    { id: "admin-t5", name: "SHREE PATIL", courtId: "court-5", passcode: "0000" },
    { id: "t1", name: "Rishikesh Shukla", courtId: "court-1", passcode: "7241" },
    { id: "t2", name: "Ravi Kanu", courtId: "court-1", passcode: "8356" },
    { id: "t3", name: "Vinit Vaidya", courtId: "court-2", passcode: "5892" },
    { id: "t4", name: "Abhishek Gupta", courtId: "court-2", passcode: "4673" },
    { id: "t5", name: "Veknis Swami", courtId: "court-3", passcode: "9184" },
    { id: "t6", name: "Rishikesh Shukla", courtId: "court-3", passcode: "7241" },
    { id: "t7", name: "Praful Kamble", courtId: "court-4", passcode: "3527" },
    { id: "t8", name: "Saurabh Gosai", courtId: "court-4", passcode: "6849" },
    { id: "t9", name: "Saurabh Gupta", courtId: "court-4", passcode: "2915" },
    { id: "t10", name: "Rahul Verma", courtId: "court-5", passcode: "5738" },
];

async function setupAndMigrateTrainers() {
    console.log('🚀 Starting Trainer Migration...\n');

    // Just migrate Trainers since collection exists
    console.log(`👟 Migrating ${TRAINERS.length} trainers...`);
    let trainerSuccess = 0;

    for (const trainer of TRAINERS) {
        try {
            await databases.createDocument(
                DATABASE_ID,
                TRAINERS_COLLECTION_ID,
                ID.unique(),
                trainer
            );
            trainerSuccess++;
            console.log(`✅ Added: ${trainer.name} (${trainer.courtId})`);
        } catch (error) {
            console.log(`ℹ️ Skipped: ${trainer.name} - ${error.message}`);
        }
    }

    console.log(`\n✨ TRAINER MIGRATION COMPLETE!`);
    console.log(`👟 Trainers Processed: ${trainerSuccess}`);
}

setupAndMigrateTrainers().catch(console.error);
