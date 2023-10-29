import * as UserService from './tajob.service';
//do we have to import the TA service?
import { Request, Response, NextFunction } from 'express';
//TODO: Add comments to functions, using given example as format

/**
 * this function get all the ta job
 * @param req http request
 * @param res http response
 * @param next move to middleware and error handler 
 * @returns list of ta job
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

/**
 * this function return TA job given job ID 
 * @param req 
 * @param res 
 * @param next 
 * @returns TA job matching the ID
 */
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
/**
 * this function return TA job according to the filters. 
 * @param req 
 * @param res 
 * @param next 
 */
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
 * get the TA job by the faculty ID who posts the job
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