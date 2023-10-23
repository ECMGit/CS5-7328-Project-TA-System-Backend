import { jobData } from './job.types';
// custom path issue, need to fix, for now use this import
import { prisma } from '../../../prisma';


//TODO: add comments to all functions
export const getJobs = async () => {
  try {
    // return all jobs from database
    return await prisma.tAJob.findMany();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @param jobData Job data to be stored
 * @returns The job that was created
 * @throws Error if job could not be created
 */
export const createJob = async (jobData: jobData) => {
  try {
    // add one job to database
    return await prisma.tAJob.create({
      data: jobData,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
