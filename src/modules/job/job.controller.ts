import * as JobService from "./job.service";
import { Request, Response, NextFunction } from "express";

/**
 * @param req
 * @param res
 * @param next
 */
export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobs = await JobService.getJobs();
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

/**
 * @param req
 * @param res
 * @param next
 */
export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newJob = await JobService.createJob(req.body);
    res.status(201).json(newJob);
  } catch (error) {
    next(error);
  }
};
