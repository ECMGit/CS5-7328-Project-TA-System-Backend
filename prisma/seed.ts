const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a new user in the 'User' table

  const newUser = await prisma.user.create({
    data: {
      smuNo: 123456, // or another unique number
      username: 'johndoe',
      email: 'johndoe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securepassword', // make sure to properly hash this in a real scenario
      // other required fields...
    },
  });

  // Create a new faculty related to the user
  const newFaculty = await prisma.faculty.create({
    data: {
      userId: newUser.id, // this links the faculty to the previously created user
      designation: 'Professor',
      department: 'Computer Science',
      // other required fields...
    },
  });

  // Create a new course
  const newCourse = await prisma.course.create({
    data: {
      courseCode: 'CS101',
      title: 'Introduction to Computer Science',
      // other required fields...
    },
  });

  // Create a new TA Job
  const newTAJob = await prisma.tAJob.create({
    data: {
      title: 'Assistant for CS101',
      courseSchedule: 'Mon, Wed, Fri',
      totalHoursPerWeek: 20,
      maxNumberOfTAs: 3,
      requiredCourses: 'CS100,CS101',
      requiredSkills: 'Programming, Tutoring',
      TAStats: 'Undergrad', // assuming this is a string field, not an enum
      notes: 'Prior experience preferred.',
      deadlineToApply: new Date('2023-11-30'), // adjust the date as needed
      courseId: newCourse.id, // link to the created course
      facultyId: newFaculty.userId, // link to the faculty member
      // other required fields...
    },
  });

  console.log({ newUser, newFaculty, newCourse, newTAJob });
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
