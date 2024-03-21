import { Router } from 'express';
import * as CourseController from './course.controller';

const router: Router = Router();
router.get('/', CourseController.getAllCourses);
router.post('/import', CourseController.importCoursesBatch);
router.post('/add', CourseController.addCourse);
router.get('/:id', CourseController.getOneCourse);
router.put('/edit/:id', CourseController.editCourse);

export default router;
