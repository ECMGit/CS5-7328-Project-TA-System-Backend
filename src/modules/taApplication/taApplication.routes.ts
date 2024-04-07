import { Router } from 'express';
import * as TaApplicationController from './taApplication.controller';

const router = Router();

router.post('/', TaApplicationController.save);
router.get('/', TaApplicationController.getTaApplications); // route is not protected by authentication middleware
router.get('/:id', TaApplicationController.getTaApplication);
router.get('/faculty/:facultyId', TaApplicationController.getTaApplicationsByFacultyId);
//faculty only see applications of their courses
router.get('/student/:studentId', TaApplicationController.getTaApplicationsByStudentId);
router.get('/:courseId', TaApplicationController.getTaApplicationByCourseId);
router.post('/:id', TaApplicationController.updateTaApplication);
router.delete('/:id', TaApplicationController.deleteTaApplication);

export default router;