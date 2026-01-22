import { Client, Databases, ID } from 'node-appwrite';

// Initialize Appwrite
const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69722da4002667601dd7'); // Correct Project ID

const databases = new Databases(client);
const DATABASE_ID = '69722e890013ea3ea3ba';

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

const STUDENTS = [
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
    { id: "kal-1", name: "AANYA AGARWAL", groupId: "kalp-1" },
    { id: "kal-2", name: "AARAV KAMRA", groupId: "kalp-2" },
    { id: "kal-3", name: "AARAV LATH", groupId: "kalp-2" },
    { id: "kal-4", name: "AKSHAY MOKIM", groupId: "kalp-1" },
    { id: "kal-5", name: "ARYAV LAVTI", groupId: "kalp-1" },
    { id: "kal-6", name: "ATHARVA AVASTI", groupId: "kalp-4" },
    { id: "kal-7", name: "AVNI JYOTULA", groupId: "kalp-2" },
    { id: "kal-8", name: "CLAIRE ELIZABETH", groupId: "kalp-1" },
    { id: "kal-9", name: "DEMIRA S", groupId: "kalp-3" },
    { id: "kal-10", name: "GEETANSH GARG", groupId: "kalp-2" },
    { id: "kal-11", name: "GRANTH KHANDELWAL", groupId: "kalp-3" },
    { id: "kal-12", name: "HEYANSH MEHTA", groupId: "kalp-2" },
    { id: "kal-13", name: "KAVERI NAIDU", groupId: "kalp-3" },
    { id: "kal-14", name: "LAKSHYA AGARWAL", groupId: "kalp-4" },
    { id: "kal-15", name: "MIVAAN CHANDAK", groupId: "kalp-2" },
    { id: "kal-16", name: "PREM SAKPALE", groupId: "kalp-2" },
    { id: "kal-17", name: "PRITI", groupId: "kalp-3" },
    { id: "kal-18", name: "SARANG SESHADRI", groupId: "kalp-3" },
    { id: "kal-19", name: "SHAISH SADANA", groupId: "kalp-4" },
    { id: "kal-20", name: "SHANAY JAIN", groupId: "kalp-4" },
    { id: "kal-21", name: "SHARVIL SRIVASTVA", groupId: "kalp-2" },
    { id: "kal-22", name: "SHIVEN SHAH", groupId: "kalp-4" },
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
    { id: "addr-1", name: "AAHIL S", groupId: "addr-1" },
    { id: "addr-2", name: "AAIRA S", groupId: "addr-2" },
    { id: "addr-3", name: "AARYA BAID", groupId: "addr-3" },
    { id: "addr-4", name: "ANVI SAXENA", groupId: "addr-1" },
    { id: "addr-5", name: "ARIN PATIL", groupId: "addr-1" },
    { id: "addr-6", name: "AVNI SHAH", groupId: "addr-2" },
    { id: "addr-7", name: "DRAVYA PATEL", groupId: "addr-1" },
    { id: "addr-8", name: "FIONA JAIN", groupId: "addr-1" },
    { id: "addr-9", name: "HANNAH JOSHI", groupId: "addr-3" },
    { id: "addr-10", name: "HARRY BAID", groupId: "addr-3" },
    { id: "addr-11", name: "HARSHIT SAXENA", groupId: "addr-3" },
    { id: "addr-12", name: "HIYA SINGH", groupId: "addr-2" },
    { id: "addr-13", name: "HRIDAY DEODHAR", groupId: "addr-1" },
    { id: "addr-14", name: "HRISHA SHAH", groupId: "addr-1" },
    { id: "addr-15", name: "HRITVI KHURANA", groupId: "addr-3" },
    { id: "addr-16", name: "JAIZVEEN KAUR", groupId: "addr-3" },
    { id: "addr-17", name: "JIYANSHI PARWAL", groupId: "addr-2" },
    { id: "addr-18", name: "MEDANSH", groupId: "addr-2" },
    { id: "addr-19", name: "MISHIKA TOSHNIWAL", groupId: "addr-3" },
    { id: "addr-20", name: "NILAYA GANESHAN", groupId: "addr-1" },
    { id: "addr-21", name: "NIVIKA KALRA", groupId: "addr-1" },
    { id: "addr-22", name: "PRANSHU PATEL", groupId: "addr-2" },
    { id: "addr-23", name: "PRERITH S", groupId: "addr-3" },
    { id: "addr-24", name: "RADHA NEHULKAR", groupId: "addr-1" },
    { id: "addr-25", name: "REEDA SHAIKH", groupId: "addr-2" },
    { id: "addr-26", name: "RISHIV MITHIYA", groupId: "addr-3" },
    { id: "addr-27", name: "SAHAN PATIL", groupId: "addr-1" },
    { id: "addr-28", name: "SAMARTH MADHUSUDHAN", groupId: "addr-1" },
    { id: "addr-29", name: "SAMVED MADUSUDHAN", groupId: "addr-2" },
    { id: "addr-30", name: "SHIKHAR CHAUDHRY", groupId: "addr-3" },
    { id: "addr-31", name: "SRIESH WAGLE", groupId: "addr-1" },
    { id: "addr-32", name: "TVARITA DESHORA", groupId: "addr-1" },
    { id: "addr-33", name: "VIRAJ PAWAR", groupId: "addr-2" },
    { id: "addr-34", name: "YUKT BHATIA", groupId: "addr-1" },
    { id: "addr-35", name: "ZEEHAN", groupId: "addr-1" },
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

async function migrate() {
    console.log('🚀 Starting FULL migration...\n');

    // Migrate Students
    console.log(`📚 Migrating ${STUDENTS.length} students...`);
    let studentSuccess = 0;
    let studentFail = 0;

    for (const student of STUDENTS) {
        try {
            // Check if exists first to avoid duplicates
            await databases.createDocument(
                DATABASE_ID,
                'students',
                ID.unique(),
                student
            );
            studentSuccess++;
            // Only log every 10th success to avoid spamming console
            if (studentSuccess % 10 === 0) {
                console.log(`✅ [${studentSuccess}/${STUDENTS.length}] Added: ${student.name}`);
            }
        } catch (error) {
            // If duplicate, try to find existing and leave it
            // console.log(`ℹ️ [Info] ${student.name}: ${error.message}`);
            studentFail++;
        }
    }

    // Migrate Trainers
    console.log(`\n👟 Migrating ${TRAINERS.length} trainers...`);
    let trainerSuccess = 0;
    let trainerFail = 0;

    for (const trainer of TRAINERS) {
        try {
            await databases.createDocument(
                DATABASE_ID,
                'trainers',
                ID.unique(),
                trainer
            );
            trainerSuccess++;
            console.log(`✅ Added Trainer: ${trainer.name}`);
        } catch (error) {
            trainerFail++;
        }
    }

    console.log(`\n✨ MIGRATION COMPLETE!`);
    console.log(`🎓 Students: ${studentSuccess} added, ${studentFail} failed/existed`);
    console.log(`👟 Trainers: ${trainerSuccess} added, ${trainerFail} failed/existed`);
}

migrate().catch(console.error);
