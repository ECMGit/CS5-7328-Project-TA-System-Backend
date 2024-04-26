import { Router } from 'express';
import * as TaPerformanceController from './taPerformance.controller';

const router = Router();

// try to fetch the information to display the box
router.get('/faculty/:facultyUserId/courses-tas', TaPerformanceController.getFacultyCoursesAndTAs);


// Define a POST route for creating a new TA evaluation
router.post('/ta-evaluation', TaPerformanceController.createTaEvaluation);

// Define a GET route for retrieving all TA evaluations
router.get('/performance-results', TaPerformanceController.getAllTaEvaluations);




export default router;
