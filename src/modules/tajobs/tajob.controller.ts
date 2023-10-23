import * as UserService from './tajob.service';
//do we have to import the TA service?
import { Request, Response, NextFunction } from 'express';
//TODO: Add comments to functions, using given example as format

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const getAllTAJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('in get all');

  try {
    const taJobs = await UserService.getAllTAJobs();
    if (taJobs.length == 0) {
      return res.status(404).json({ message: 'Np job listings found.' });
    }
    res.json(taJobs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getTAJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taJob = await UserService.getTAJobById(Number(req.params.id));
    if (!taJob) {
      return res.status(404).json({ message: 'TA job not found' });
    }
    res.json(taJob);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// New function to handle querying with filters.
export const getTAJobsWithFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('in controller');

  try {
    console.log(req.params);

    // Extract query parameters from the request. These will be your filters.
    const queryParams = req.query;

    // Call the service function, passing in the filters.
    const filteredTAJobs = await UserService.getTAJobsWithFilters(queryParams);

    // Send back the filtered data.
    res.json(filteredTAJobs);
  } catch (error) {
    console.error('Error fetching TA jobs with filters:', error);
    next(error); // Pass errors to the next middleware.
  }
};

/**
 * get user by id
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const getTAJobsByFacultyId = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const user = await UserService.getTAJobsByFacultyId(Number(req.params.facultyId));
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      next(error);
  }
};