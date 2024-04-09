const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");
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
    try {
      const course = faker.helpers.arrayElement(courses);
      const student = faker.helpers.arrayElement(students);
      const taJob = faker.helpers.arrayElement(taJobs);

      const newTaApplications = await prisma.tAApplication.create({
        data: {
          courseId: course.id,
          studentId: student.userId,
          hoursCanWorkPerWeek: faker.helpers.arrayElement(["10", "15", "20"]),
          coursesTaken: faker.lorem.words(3),
          status: faker.helpers.arrayElement([
            "Pending",
            "Approved",
            "Rejected",
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
      console.error("Error creating TA application:", error);
    }
  }
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

  for (let i = 1; i < 6; i++) {
    const userType = faker.helpers.arrayElement([
      "faculty",
      "student",
      "admin",
    ]);
    const newUser = await prisma.user.create({
      data: {
        smuNo: 123456 + i + number_of_users,
        username: `johndoe${i + number_of_users}`,
        email: `johndoe${i + number_of_users}@example.com`,
        firstName: "John",
        lastName: `Doe${i + number_of_users}`,
        password: "securepassword",
        userType: userType,
      },
    });

    users.push(newUser);

    // Create student record if userType is 'student'
    if (userType === "student") {
      const newStudent = await prisma.student.create({
        data: {
          userId: newUser.id,
          year: 2023,
          // other required fields...
        },
      });
      console.log({ newStudent });
      students.push(newStudent);
    }

    if (userType === "faculty") {
      const newFaculty = await prisma.faculty.create({
        data: {
          userId: newUser.id,
          designation: "Professor",
          department: "Computer Science",
          // other required fields...
        },
      });
      console.log({ newFaculty });
      faculties.push(newFaculty);
    }

    if (newUser.userType === "admin") {
      const newAdmin = await prisma.admin.create({
        data: {
          userId: newUser.id,
          role: "admin",
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
  for (let i = 0; i < 3; i++) {
    const newTAJob = await prisma.tAJob.create({
      data: {
        title: `Assistant for ${courses[i].courseCode}`,
        courseSchedule: "Mon, Wed, Fri",
        totalHoursPerWeek: 20,
        maxNumberOfTAs: 3,
        requiredCourses: "CS100,CS101",
        requiredSkills: "Programming, Tutoring",
        TAStats: "Undergrad", // Assuming this is a string field, not an enum
        notes: "Prior experience preferred.",
        deadlineToApply: new Date("2023-11-30"), // Adjust the date as needed
        courseId: courses[i].id,
        facultyId: faculties[i].userId,
        // other required fields...
      },
    });
    taJobs.push(newTAJob);
    console.log(newTAJob);
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
