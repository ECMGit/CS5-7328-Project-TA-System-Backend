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


export const getAllCoursesWithoutDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await CourseService.getAllCourses();
    
    // Map into courseCode - title format
    const formattedCourses = courses.map((course: any) => ({
      courseCode: course.courseCode,
      title: course.title
    }));

    res.json(formattedCourses);
  }catch (error){
    console.log(error);
    next(error); 
  }
};
