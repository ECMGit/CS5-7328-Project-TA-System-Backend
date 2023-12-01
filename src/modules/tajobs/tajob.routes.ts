import { Router } from 'express';
import * as TajobController from './tajob.controller';

// import { authenticate } from 'middleware/authentication';

const router = Router();

router.get('/query', TajobController.getTAJobsWithFilters);
router.get('/:id', TajobController.getTAJobById);
router.get('/', TajobController.getAllTAJobs);
router.get("/faculty/:facultyId", TajobController.getTAJobsByFacultyId)

// post one job
router.post('/', JobController.createJob);

//udpate one job by id passed as param
router.put('/edit/:id', JobController.updateJob);

export default router;