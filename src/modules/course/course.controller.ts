import * as CourseService from './course.service';
import { Request, Response, NextFunction } from 'express';

/**
 * @param req
 * @param res
 * @param next
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
