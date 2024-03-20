import * as AdminService from './admin.service';
//do we have to import the TA service?
import { Request, Response, NextFunction } from 'express';

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */

//this get function returns all available student 
export const getAllStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('in get all');

  try {
    // return all jobs that have been published
    const students = await AdminService.getAllStudent();
    if (students.length == 0) {
      console.log('No student listings found.');
      // if there are no jobs found, return message that no jobs are found
      return res.status(404).json({ message: 'No student listings found.' });
    }
    res.json(students);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */

//this get function returns all available course
export const getAllCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('in get all');

  try {
    // return all Course
    const course = await AdminService.getAllCourse();
    if (course.length == 0) {
      console.log('No Course listings found.');
      
      return res.status(404).json({ message: 'No Course listings found.' });
    }
    res.json(course);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */

//this get function returns all available Faculty
export const getAllFaculty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('in get all');

  try {
    // return all Faculty
    const faculty = await AdminService.getAllFaculty();
    if (faculty.length == 0) {
      console.log('No Faculty listings found.');
      
      return res.status(404).json({ message: 'No Faculty listings found.' });
    }
    res.json(faculty);
  } catch (error) {
    console.log(error);
    next(error);
  }
};