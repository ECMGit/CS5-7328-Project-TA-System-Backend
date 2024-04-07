import { Course } from "@prisma/client";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');
// const courseData = require("src/modules/course/course.types")
const { csCoursesObject } = require("../prisma/data/CSCourseData");


async function seedTAApplications() {
  // Assuming you already have some courses and students in your database
  const courses = await prisma.course.findMany();
  const students = await prisma.student.findMany();
  const taJobs = await prisma.tAJob.findMany();
  const taApplications = [];
  if (courses.length === 0 || students.length === 0 || taJobs.length === 0) {
    console.log("Please seed courses, students, and TA jobs first.");
    return;
  }

  for (let i = 0; i < 20; i++) {

    const course = faker.helpers.arrayElement(courses);
    const student = faker.helpers.arrayElement(students);
    const taJob = faker.helpers.arrayElement(taJobs);

    const newTaApplications = await prisma.tAApplication.create({
      data: {
        courseId: course.id,
        studentId: student.userId,
        hoursCanWorkPerWeek: faker.helpers.arrayElement(['10', '15', '20']),
        coursesTaken: faker.lorem.words(3),
        status: faker.helpers.arrayElement(['Pending', 'Approved', 'Rejected']),
        GPA: parseFloat(faker.finance.amount(2.0, 4.0, 2)),
        requiredCourses: faker.lorem.words(2),
        requiredSkills: faker.lorem.words(3),
        resumeFile: faker.internet.url(),
        taJobId: taJob.id,
      },
    });
    taApplications.push(newTaApplications);
  }
  return taApplications;
}

async function main() {
  // Create users, faculty, courses, and TA positions here
  const users = [];
  const faculties = [];
  const taJobs = [];
  const number_of_users = await prisma.user.count();
  let courses: Course[] = [];
  // Loop to create multiple faculty members
  for (let i = 1; i <= 10; i++) {
    const userType = faker.helpers.arrayElement(['faculty', 'student', 'admin']);
    const newUser = await prisma.user.create({
      data: {
        smuNo: 123456 + i + number_of_users, // Unique number for each user
        username: `johndoe${i + number_of_users}`,
        email: `johndoe${i + number_of_users}@example.com`,
        firstName: 'John',
        lastName: `Doe${i + number_of_users}`,
        password: 'securepassword', // Make sure to hash this properly in a real scenario
        userType: userType
        //userType: faker.helpers.arrayElement(['faculty', 'student', 'admin'])// Assuming this is a string field, not an enum
        // other required fields...
      },
    });
    for (let i = 0; i < csCoursesObject.length; i++) {
      const course = csCoursesObject[i];
      // check the course is unique or not
      const existingCourse = await prisma.course.findUnique({
        where: {
          courseCode: course.courseCode,
        },
      });
      if (existingCourse) {
        console.log(`Course with code ${course.courseCode} already exists. Skipping creation...`);
        continue; // If the same course code exists, skip
      }
      // create new course
      const newCourse = await prisma.course.create({
        data: {
          courseCode: course.courseCode,
          title: course.title,
          description: course.courseDescription,
        }
      });
      courses.push(newCourse);
    }
    /** //These code creates the users without the relationship with ID
       const newFaculty = await prisma.faculty.create({
         data: {
           userId: newUser.id,
           designation: 'Professor',
           department: 'Computer Science',
           // other required fields...
         },
       });
   
       const newStudent = await prisma.student.create({
         data: {
           userId: newUser.id,
           year: 2023,
           // other required fields...
         },
       });
       users.push(newUser);
       faculties.push(newFaculty);
   
       // Create admin if the user type is 'admin'
       if (newUser.userType === 'admin') {
         const newAdmin = await prisma.admin.create({
           data: {
             userId: newUser.id,
             role: 'dmin',
           },
         });
   
         console.log({ newAdmin });
       }
       */
    // Check user type and create corresponding records
    if (userType === 'faculty') {
      // Create a Faculty instance for this user
      const newFaculty = await prisma.faculty.create({
        data: {
          userId: newUser.id,
          designation: 'Professor',
          department: 'Computer Science',
          // other required fields...
        },
      });
      faculties.push(newFaculty);

      //Create the relationship with faculty ID and course ID
      const coursesToAssign = faker.datatype.number({ min: 1, max: 4 });
      // shuffle and choose the course
      const shuffledCourses = courses.sort(() => 0.5 - Math.random());
      const selectedCourses = shuffledCourses.slice(0, coursesToAssign);

      for (const course of selectedCourses) {
        await prisma.facultyCourse.create({
          data: {
            facultyId: newFaculty.userId,
            courseId: course.id,
          },
        });
      }
    } else if (userType === 'student') {
      // Create a Student instance for this user
      const newStudent = await prisma.student.create({
        data: {
          userId: newUser.id,
          year: 2023,
          // other required fields...
        },
      });
      // Add to students array if needed
    } else if (userType === 'admin') {
      // Create an Admin instance for this user
      const newAdmin = await prisma.admin.create({
        data: {
          userId: newUser.id,
          role: 'admin',
        },
      });
      // Log or handle the new admin record
      console.log({ newAdmin });
    }

    users.push(newUser);

  }

  // // Loop to create multiple courses
  // for (let i = 0; i < 3; i++) {
  //   const newCourse = await prisma.course.create({
  //     data: {
  //       courseCode: `CS101${i}`,
  //       title: `Introduction to Computer Science ${i}`,
  //       // other required fields...
  //     },
  //   });

  //   courses.push(newCourse);
  // }




  // Loop to create multiple TA positions
  /** for (let i = 0; i < 3; i++) {
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
  
  */
  // Loop to create multiple TA positions
  // Make sure the TAjob table is connected with facultyCourse table
  for (let i = 0; i < faculties.length; i++) {
    const facultyId = faculties[i].userId;
    // Find courses taught by this faculty
    const facultyCourses = await prisma.facultyCourse.findMany({
      where: {
        facultyId: facultyId,
      },
      select: {
        courseId: true,
      },
    });

    // Create TA jobs for each course taught by the faculty
    // Create TA jobs for each course taught by the faculty
    for (const facultyCourse of facultyCourses) {
      const courseId = facultyCourse.courseId;
      const course = courses.find(course => course.id === courseId); // find the course by ID
      if (!course) {
        console.error(`Course with ID ${courseId} not found.`);
        continue;
      }
      const courseTitle = course.title;
      const newTAJob = await prisma.tAJob.create({
        data: {
          title: `Assistant for ${courseTitle}`,
          courseSchedule: 'Mon, Wed, Fri',
          totalHoursPerWeek: 20,
          maxNumberOfTAs: 3,
          requiredCourses: 'CS100,CS101',
          requiredSkills: 'Programming, Tutoring',
          TAStats: 'Undergrad',
          notes: 'Prior experience preferred.',
          deadlineToApply: new Date('2023-11-30'),
          courseId: courseId,
          facultyId: facultyId,
        },
      });
      taJobs.push(newTAJob);
    }
  }




  const taApplications = await seedTAApplications();

  console.log({ users, faculties, courses, taJobs, taApplications });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });