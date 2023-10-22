import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create users, faculty, courses, and TA positions here
  const users = [];
  const faculties = [];
  const courses = [];
  const taJobs = [];

  // Loop to create multiple faculty members
  for (let i = 0; i < 3; i++) {
    const newUser = await prisma.user.create({
      data: {
        smuNo: 123456 + i, // Unique number for each user
        username: `johndoe${i}`,
        email: `johndoe${i}@example.com`,
        firstName: 'John',
        lastName: `Doe${i}`,
        password: 'securepassword', // Make sure to hash this properly in a real scenario
        // other required fields...
      },
    });

    const newFaculty = await prisma.faculty.create({
      data: {
        userId: newUser.id,
        designation: 'Professor',
        department: 'Computer Science',
        // other required fields...
      },
    });

    users.push(newUser);
    faculties.push(newFaculty);
  }

  // Loop to create multiple courses
  for (let i = 0; i < 3; i++) {
    const newCourse = await prisma.course.create({
      data: {
        courseCode: `CS101${i}`,
        title: `Introduction to Computer Science ${i}`,
        // other required fields...
      },
    });

    courses.push(newCourse);
  }

  // Loop to create multiple TA positions
  for (let i = 0; i < 3; i++) {
    const newTAJob = await prisma.tAJob.create({
      data: {
        title: `Assistant for ${courses[i].courseCode}`,
        courseSchedule: 'Mon, Wed, Fri',
        totalHoursPerWeek: 20,
        maxNumberOfTAs: 3,
        requiredCourses: 'CS100,CS101',
        requiredSkills: 'Programming, Tutoring',
        TAStats: 'Undergrad', // Assuming this is a string field, not an enum
        notes: 'Prior experience preferred.',
        deadlineToApply: new Date('2023-11-30'), // Adjust the date as needed
        courseId: courses[i].id,
        facultyId: faculties[i].userId,
        // other required fields...
      },
    });

    taJobs.push(newTAJob);
  }

  console.log({ users, faculties, courses, taJobs });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
