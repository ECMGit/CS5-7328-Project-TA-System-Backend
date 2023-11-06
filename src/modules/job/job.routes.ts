import { Router } from 'express';
import * as JobController from './job.controller';

const router = Router();

// get all jobs
router.get('/', JobController.getJobs);

// post one job
router.post('/', JobController.createJob);

//get job by id
router.get('/:id', JobController.getOneJob);

//udpate job by id passed as param
router.put('/edit/:id', JobController.updateJob);

export default router;
