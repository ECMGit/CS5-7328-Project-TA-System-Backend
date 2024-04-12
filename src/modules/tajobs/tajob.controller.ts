import * as JobService from "./tajob.service";
import { makeTAService } from "./tajob.service";
//do we have to import the TA service?
import { Request, Response, NextFunction } from "express";

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */

//this get function returns all available TA jobs
export const getAllTAJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("in get all");

  try {
    // return all jobs that have been published
    const taJobs = await JobService.getAllTAJobs();
    if (taJobs.length == 0) {
      console.log("No job listings found.");
      // if there are no jobs found, return message that no jobs are found
      return res.status(404).json({ message: "No job listings found." });
    }
    res.json(taJobs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// this GET function searches for a TA job by job ID that the user passes in
export const getTAJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // return jobs with matching job ID
    const taJob = await JobService.getTAJobById(Number(req.params.id));
    if (!taJob) {
      // if no TA job is found with the required ID, return message indicating issue
      return res.status(404).json({ message: "TA job not found" });
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
  console.log("in controller");

  try {
    console.log(req.params);

    // Extract query parameters from the request. These will be your filters.
    const queryParams = req.query;

    // Call the service function, passing in the filters.
    const filteredTAJobs = await JobService.getTAJobsWithFilters(queryParams);

    // Send back the filtered data.
    res.json(filteredTAJobs);
  } catch (error) {
    console.error("Error fetching TA jobs with filters:", error);
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
//this function returns a list of jobs posted by the faculty member with the passed-in ID
export const getTAJobsByFacultyId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // return jobs with matching faculty ID
    const taJobs = await JobService.getTAJobsByFacultyId(
      Number(req.params.facultyId)
    );
    // if (taJobs.length == 0) {
    //   //const user = await JobService.getTAJobsByFacultyId(Number(req.params.facultyId));
    //   //if (!user) {
    //   // if there are no jobs posted by the faculty member or if the faculty is not found, return this message
    //   return res.status(404).json({ message: 'No TA jobs found' });
    // }
    res.json(taJobs);
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
    console.log("in create ", req.body);
    const newJob = await JobService.createJob(req.body);
    res.status(201).json(newJob);
  } catch (error) {
    next(error);
  }
};

export const makeStudentTA = async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.studentId, 10); 
  const courseId = parseInt(req.params.courseId, 10);

  console.log("Attempting to make student into TA", { studentId, courseId });

  if (isNaN(studentId) || isNaN(courseId)) {
    console.log("Invalid input: ", req.params);
    return res.status(400).json({ message: "Invalid studentId or courseId" });
  }

  try {
    await makeTAService(studentId, courseId);
    console.log("Student has been made a TA successfully", {
      studentId,
      courseId,
    });
    res
      .status(200)
      .json({ message: "Student has been made a TA successfully" });
  } catch (error: unknown) {

    console.error("Failed to make the student a TA", {
      studentId,
      courseId,
      error,
    });

    if (error instanceof Error) {
      res.status(500).json({
        message: "Failed to make the student a TA",
        error: error.message,
      });
    } else {

      res.status(500).json({
        message: "Failed to make the student a TA",
        error: "An unknown error occurred",
      });
    }
  }
};

//update job by id passed as param
/**
 * @param req
 * @param res
 * @param next
 */
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
