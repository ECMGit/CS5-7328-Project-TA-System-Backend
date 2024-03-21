import { Router } from 'express';
import * as TaskController from './tasks.controller';

const router = Router();

// Create task
router.post('/tasks', TaskController.createTask);

// Get Tasks
router.get('/tasks/completed/:facultyId', TaskController.viewCompleted);
router.get('/tasks/pending/:facultyId', TaskController.viewPending);
router.get('/tasks/current/:studentId', TaskController.viewCurrent);
router.get('/tasks/completed/:studentId', TaskController.viewCompletedByStudent);

// Update Tasks
router.put('/tasks/checkoff/:studentId/:taskId', TaskController.checkoff);

export default router;