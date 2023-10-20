import { Router } from "express";
import * as JobController from "./job.controller";

const router = Router();

// get all jobs
router.get("/", JobController.getJobs);

// post one job
router.post("/", JobController.createJob);

export default router;
