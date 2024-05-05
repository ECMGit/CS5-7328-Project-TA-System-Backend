const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");
// const courseData = require("src/modules/course/course.types")
const { csCoursesObject } = require("../prisma/data/CSCourseData");

async function seedTasks() {
  const students = await prisma.student.findMany();
  const faculties = await prisma.faculty.findMany();
  const courses = await prisma.course.findMany();
  const tasks = [];

  for (const student of students) {
    for (const faculty of faculties) {
      const course = faker.helpers.arrayElement(courses);
      const task = await prisma.task.create({
        data: {
          facultyId: faculty.userId,
          studentId: student.userId,
          title: `Task for ${course.title}`, // Example task title
          description: `Complete assignment for ${course.title}`, // Example task description
          completed: false, // Example task completion status
          courseId: course.id,
        },
      });
      tasks.push(task);
    }
  }

  console.log("Tasks seeded successfully:", tasks);
}

async function main() {
  try {
    await seedTasks();
  } catch (error) {
    console.error("Error seeding tasks:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
