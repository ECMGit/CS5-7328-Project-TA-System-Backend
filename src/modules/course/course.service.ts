import { courseData } from './course.types';
import { prisma } from 'prisma';

/**
 * get all courses information
 * @returns list of courses
 */
export const getAllCourses = async () => {
  try {
    return await prisma.course.findMany();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * just get one course information by course id
 * @param id 
 * @returns 
 */
export const getOneCourse = async (id: number) => {
  try {
    return await prisma.course.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * add course to database
 * @param courseData
 * @returns
 */
export const addCourse = async (course: courseData) => {
  try {
    return await prisma.course.create({
      data: course,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * add batch of courses to database
 * @param courseDataList
 * @returns
 */
export const addCourses = async (courseDataList: courseData[]) => {
  try {
    return await prisma.course.createMany({
      data: courseDataList,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
