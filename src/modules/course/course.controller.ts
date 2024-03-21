import * as CourseService from './course.service';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
const JWT_SECRET = 'your-secret-key'; // 在生产环境中，这应该存储在环境变量中

// 验证JWT令牌的中间件
interface CustomJwtPayload extends JwtPayload {
  userId: number; // 假设userId是数字类型
}
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }
  try {
    // 使用类型断言告诉TypeScript，我们知道decoded是CustomJwtPayload类型
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    req.body.userId = decoded.userId; // 现在可以安全地访问userId属性
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};
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
