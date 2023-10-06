import { Router } from "express";
import * as JobController from "./job.controller";

const router = Router();

router.get("/", JobController.getJobs);

router.post("/", JobController.createJob);

export default router;
