import { addStudent, addTrainer } from './appwrite';
import { INITIAL_STUDENTS, INITIAL_TRAINERS } from './storage';

// Migration function to populate Appwrite database
export const migrateToAppwrite = async () => {
    console.log('🚀 Starting migration to Appwrite...');

    try {
        // Migrate Students
        console.log(`📚 Migrating ${INITIAL_STUDENTS.length} students...`);
        let studentCount = 0;
        for (const student of INITIAL_STUDENTS) {
            const result = await addStudent(student);
            if (result) {
                studentCount++;
                console.log(`✅ Added student: ${student.name} (${studentCount}/${INITIAL_STUDENTS.length})`);
            } else {
                console.log(`❌ Failed to add student: ${student.name}`);
            }
        }

        // Migrate Trainers
        console.log(`\n👨‍🏫 Migrating ${INITIAL_TRAINERS.length} trainers...`);
        let trainerCount = 0;
        for (const trainer of INITIAL_TRAINERS) {
            const result = await addTrainer(trainer);
            if (result) {
                trainerCount++;
                console.log(`✅ Added trainer: ${trainer.name} (${trainerCount}/${INITIAL_TRAINERS.length})`);
            } else {
                console.log(`❌ Failed to add trainer: ${trainer.name}`);
            }
        }

        console.log('\n✨ Migration complete!');
        console.log(`📊 Summary:`);
        console.log(`   Students: ${studentCount}/${INITIAL_STUDENTS.length}`);
        console.log(`   Trainers: ${trainerCount}/${INITIAL_TRAINERS.length}`);

        return { studentCount, trainerCount };
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
};

// Run migration if this file is executed directly
if (typeof window !== 'undefined') {
    (window as any).migrateToAppwrite = migrateToAppwrite;
    console.log('💡 Migration function available. Run: window.migrateToAppwrite()');
}
