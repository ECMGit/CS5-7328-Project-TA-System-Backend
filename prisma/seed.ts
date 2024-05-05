const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');
// const courseData = require("src/modules/course/course.types")
const { csCoursesObject } = require('../prisma/data/CSCourseData');

async function seedTAApplications() {
  // Assuming you already have some courses and students in your database
  const courses = await prisma.course.findMany();
  const students = await prisma.student.findMany();
  const taJobs = await prisma.tAJob.findMany();
  const taApplications = [];
  if (courses.length === 0 || students.length === 0 || taJobs.length === 0) {
    console.log('Please seed courses, students, and TA jobs first.');
    return;
  }

  for (let i = 0; i < 20; i++) {
    try {
      const course = faker.helpers.arrayElement(courses);
      const student = faker.helpers.arrayElement(students);
      const taJob = faker.helpers.arrayElement(taJobs);

      const newTaApplications = await prisma.tAApplication.create({
        data: {
          courseId: course.id,
          studentId: student.userId,
          hoursCanWorkPerWeek: faker.helpers.arrayElement(['10', '15', '20']),
          coursesTaken: faker.lorem.words(3),
          status: faker.helpers.arrayElement([
            'Pending',
            'Approved',
            'Rejected',
          ]),
          GPA: parseFloat(faker.finance.amount(2.0, 4.0, 2)),
          requiredCourses: faker.lorem.words(2),
          requiredSkills: faker.lorem.words(3),
          resumeFile: faker.internet.url(),
          taJobId: taJob.id,
        },
      });
      taApplications.push(newTaApplications);
    } catch (error) {
      console.error('Error creating TA application:', error);
    }
  }
}

async function seedFacultyCourses(faculties: any[], courses: any[]) {
  const facultyCourses = [];
  for (const faculty of faculties) {
    const assignedCourses = faker.helpers.arrayElements(
      courses,
      faker.datatype.number({ min: 1, max: 3 })
    );
    for (const course of assignedCourses) {
      const facultyCourse = await prisma.facultyCourse.create({
        data: {
          facultyId: faculty.userId,
          courseId: course.id,
        },
      });
      facultyCourses.push(facultyCourse);
    }
  }
  return facultyCourses;
}

async function seedCourseTAs(students: any[], facultyCourses: any[]) {
  const courseTAs = [];
  const availableStudents = new Set(students.map((s) => s.userId));

  for (const facultyCourse of facultyCourses) {
    if (availableStudents.size === 0) {
      break; // if there is no available student, then stop
    }

    // choose one student
    const studentIdArray = Array.from(availableStudents);
    const studentId = faker.helpers.arrayElement(studentIdArray);

    const courseTA = await prisma.courseTA.create({
      data: {
        studentId: studentId,
        courseId: facultyCourse.courseId,
      },
    });
    courseTAs.push(courseTA);

    // delete the student from list
    availableStudents.delete(studentId);
  }

  return courseTAs;
}

async function main() {
  // Create users, faculty, courses, and TA positions here
  const users = [];
  const students = [];
  const faculties = [];
  const admin = [];
  const courses = [];
  const taJobs = [];
  const number_of_users = await prisma.user.count();

  // Make sure the numbers of different users' type for testing here;
  const userTypes = [
    'faculty',
    'faculty',
    'faculty',
    'student',
    'student',
    'admin',
  ];
  while (userTypes.length < 6) {
    userTypes.push(faker.helpers.arrayElement(['student', 'admin']));
  }

  for (let i = 1; i <= userTypes.length; i++) {
    const userType = userTypes[i - 1];
    const newUser = await prisma.user.create({
      data: {
        smuNo: 123456 + i + number_of_users,
        username: `johndoe${i + number_of_users}`,
        email: `johndoe${i + number_of_users}@example.com`,
        firstName: 'John',
        lastName: `Doe${i + number_of_users}`,
        password:
          '$2b$10$R0GU5NMN3hmAYM0fsnx4tuUS5x4oB9DIV4AT7lzWUUnarwdIXcnZe',
        userType: userType,
      },
    });

    users.push(newUser);

    // Create student record if userType is 'student'
    if (userType === 'student') {
      const newStudent = await prisma.student.create({
        data: {
          userId: newUser.id,
          year: 2023,
        },
      });
      console.log({ newStudent });
      students.push(newStudent);
    }

    if (userType === 'faculty') {
      const newFaculty = await prisma.faculty.create({
        data: {
          userId: newUser.id,
          designation: 'Professor',
          department: 'Computer Science',
        },
      });
      console.log({ newFaculty });
      faculties.push(newFaculty);
    }

    if (newUser.userType === 'admin') {
      const newAdmin = await prisma.admin.create({
        data: {
          userId: newUser.id,
          role: 'admin',
        },
      });
      admin.push(newAdmin);
      console.log({ newAdmin });
    }
  }

  // Create courses
  for (let i = 0; i < csCoursesObject.length; i++) {
    const course = csCoursesObject[i];
    const newCourse = await prisma.course.create({
      data: {
        courseCode: course.courseCode,
        title: course.title,
        description: course.courseDescription,
      },
    });
    courses.push(newCourse);
  }

  // Loop to create multiple TA positions
  for (let i = 0; i < 12; i++) {
    const facultyIndex = i % faculties.length; // make sure this function still work even faculty numbers < 3;
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
        facultyId: faculties[facultyIndex].userId,
        // other required fields...
      },
    });
    taJobs.push(newTAJob);
    console.log(newTAJob);
  }

  const taApplications = await seedTAApplications();

  console.log({ users, faculties, courses, taJobs, taApplications });

  // Create faculty-course relationships
  const facultyCourses = await seedFacultyCourses(faculties, courses);
  console.log({ facultyCourses });

  // Check if there are enough students and faculty courses
  if (students.length >= 2 && facultyCourses.length > 0) {
    // Create Course-TA relationships
    const courseTAs = await seedCourseTAs(students, facultyCourses);
    console.log({ courseTAs });
  } else {
    console.log(
      'Not enough students or faculty courses to create TA assignments.'
    );
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
