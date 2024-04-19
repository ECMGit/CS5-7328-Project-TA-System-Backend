const prisma = new PrismaClient();

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { csCoursesObject } from '../prisma/data/CSCourseData';

async function seedTAJobsAndApplications(courses: any, faculties: any) {
  const students = await prisma.student.findMany();
  if (students.length === 0) {
    console.log('Please seed students first.');
    return;
  }

  const taJobs = [];
  const taApplications = [];
  const statusOptions = ['Pending', 'Approved', 'Rejected'];
  const hoursOptions = ['10', '15', '20'];
  const totalHoursOptions = [10, 15, 20];
  const requiredCoursesOptions = [['CS101', 'CS102'], ['CS201', 'CS202'], ['CS301', 'CS302']];
  const requiredSkillsOptions = [['Programming', 'Debugging'], ['Data Analysis', 'Machine Learning'], ['Web Development', 'UI/UX Design']];

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const faculty = faculties[i % faculties.length];
    const totalHoursPerWeek = faker.helpers.arrayElement(totalHoursOptions);
    const requiredCourses = faker.helpers.arrayElement(requiredCoursesOptions).join(', ');
    const requiredSkills = faker.helpers.arrayElement(requiredSkillsOptions).join(', ');

    const newTAJob = await prisma.tAJob.create({
      data: {
        title: `Assistant for ${course.courseCode}`,
        courseSchedule: 'Mon, Wed, Fri',
        totalHoursPerWeek: totalHoursPerWeek,
        maxNumberOfTAs: 3,
        requiredCourses: requiredCourses,
        requiredSkills: requiredSkills,
        TAStats: 'Graduate',
        notes: 'Prior experience preferred.',
        deadlineToApply: new Date('2024-11-30'),
        courseId: course.id,
        facultyId: faculty.userId,
      },
    });
    taJobs.push(newTAJob);


    for (let j = 0; j < 5; j++) {
      const student = faker.helpers.arrayElement(students);
      const GPA = parseFloat(faker.finance.amount(2.0, 4.0, 2));
      const status = faker.helpers.arrayElement(statusOptions);
      const hoursCanWorkPerWeek = faker.helpers.arrayElement(hoursOptions);

      const newTAApplication = await prisma.tAApplication.create({
        data: {
          courseId: course.id,
          studentId: student.userId,
          hoursCanWorkPerWeek: hoursCanWorkPerWeek,
          coursesTaken: requiredCourses,
          status: status,
          GPA: GPA,
          requiredCourses: requiredCourses,
          requiredSkills: requiredSkills,
          resumeFile: 'https://TA_Application.com/resume.pdf',
          taJobId: newTAJob.id,
        },
      });
      taApplications.push(newTAApplication);
    }
  }

  return { taJobs, taApplications };
}

async function main() {
  try {
    const users = [];
    const faculties = [];
    const courses = [];

    // Check if any users already exist
    const number_of_users = await prisma.user.count();

    // Loop to create multiple faculty members and students
    for (let i = 1; i <= 5; i++) {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          smuNo: 123456 + i + number_of_users, // Unique number for each user
          username: `johndoe${i + number_of_users}`,
          email: `johndoe${i + number_of_users}@example.com`,
          firstName: 'John',
          lastName: `Doe${i + number_of_users}`,
          password: 'securepassword', // Make sure to hash this properly in a real scenario
          userType: faker.helpers.arrayElement(['faculty', 'student', 'admin'])// Assuming this is a string field, not an enum
        },
      });
      users.push(newUser);

      // Depending on the userType, create faculty or student
      const userType = faker.helpers.arrayElement(['faculty', 'student', 'admin']);
      if (userType === 'faculty') {
        const newFaculty = await prisma.faculty.create({
          data: {
            userId: newUser.id,
            designation: 'Professor',
            department: 'Computer Science',
            // other required fields...
          },
        });
        faculties.push(newFaculty);
      } else if (userType === 'student') {
        const newStudent = await prisma.student.create({
          data: {
            userId: newUser.id,
            year: 2023,
            // other required fields...
          },
        });
      } else if (userType === 'admin') {
        const newAdmin = await prisma.admin.create({
          data: {
            userId: newUser.id,
            role: 'admin',
          },
        });

        console.log({ newAdmin });
      }
    }

    // Create courses
    for (const courseData of csCoursesObject) {
      const course = await prisma.course.upsert({
        where: { courseCode: courseData.courseCode },
        update: {
          title: courseData.title,
          description: courseData.courseDescription,
        },
        create: {
          courseCode: courseData.courseCode,
          title: courseData.title,
          description: courseData.courseDescription,
        },
      });
      courses.push(course);
    }
    // Seed TA jobs and applications
    await seedTAJobsAndApplications(courses, faculties);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the main function to start the seeding process
main();
