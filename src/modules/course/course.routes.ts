import { Router } from 'express'; 
import * as CourseService from './course.service';
import * as CourseController from './course.controller';

const router = Router();

router.get('/', CourseController.getAllCoursesWithoutDetail);

export default router; 