import * as CourseService from './course.service';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function to import courses in batch.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next middleware function
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
 * Middleware function to handle getting a single course by ID.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next middleware function
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
 * Middleware function to handle adding a new course.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next middleware function
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
 * Middleware function to handle updating a course.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next middleware function
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
 * Middleware function to handle getting all courses.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next middleware function
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
