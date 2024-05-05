import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTAApplications() {
    const applications = [
        {
            courseId: 1, // ID of the course; make sure this exists in your Course table
            studentId: 4, // ID of the student; make sure this exists in your Student table
            hoursCanWorkPerWeek: "20",
            coursesTaken: "COMP101, COMP102",
            status: "pending",
            GPA: 3.5,
            requiredCourses: "COMP101, COMP102",
            requiredSkills: "Java, Python",
            resumeFile: "resumes/student1.pdf",
            taJobId: 2, // Make sure the TA Job ID exists in your TAJob table
        }
    ];

    for (const application of applications) {
        await prisma.tAApplication.create({
            data: application
        });
    }

    console.log('TA Applications seeded successfully.');
}

seedTAApplications()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
