import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const getAllStudent = async () => {
  //using Prisma's findMany() method to retrieve all student from the database.

  return await prisma.student.findMany({
    include: {
      user: true
    },
  });
};


export const getAllCourse = async () => {
  try {
    const course = await prisma.course.findMany();
    return course;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const getAllFaculty = async () => {
  try {
    const faculty = await prisma.faculty.findMany();
    return faculty;
  } catch (error) {
    console.error('Error fetching faculty:', error);
    throw error;
  }
};