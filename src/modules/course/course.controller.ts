import * as CourseService from './course.service';
import { Request, Response, NextFunction } from 'express';

/**
 * Controller function to import courses in batch.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next Controller function
 */
export const importCoursesBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coursesBatch = req.body;
    const courses = await CourseService.addCourses(coursesBatch);
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all courses without detail, for showing the list of courses in dropdowns
 * @param req
 * @param res 
 * @param next 
 */
export const getAllCoursesWithoutDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await CourseService.getAllCourses();

    // Map into courseCode - title format
    const formattedCourses = courses.map((course: any) => ({
      courseID: course.id,
      courseCode: course.courseCode,
      title: course.title
    }));

    res.json(formattedCourses);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * Controller function to handle getting a single course by ID.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next Controller function
 */
export const getOneCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await CourseService.getOneCourse(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller function to handle adding a new course.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next Controller function
 */
export const addCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newCourseData = req.body;
    const newCourse = await CourseService.addCourse(newCourseData);
    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller function to handle updating a course.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next Controller function
 */
export const editCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = parseInt(req.params.id);
    const newCourseData = req.body;
    const updatedCourse = await CourseService.editCourse(courseId, newCourseData);
    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller function to handle getting all courses.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next Controller function
 */
export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await CourseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    next(error);
  }
};
