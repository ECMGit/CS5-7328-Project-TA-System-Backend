import exp from 'constants';
import * as JobService from './job.service';
import { Request, Response, NextFunction } from 'express';

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
//get one job with route /:id
export const getOneJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await JobService.getOneJob(parseInt(req.params.id));
    res.json(job);
  } catch (error) {
    next(error);
  }
};
//udpate job by id passed as param
export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await JobService.updateJob(parseInt(req.params.id), req.body);
    res.json(job);
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
