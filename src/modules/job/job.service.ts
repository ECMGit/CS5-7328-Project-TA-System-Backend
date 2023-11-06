import { jobData } from './job.types';
// custom path issue, need to fix, for now use this import
import { prisma } from 'prisma';


//TODO: add comments to all functions
/**
 * 
 * @returns all the job available
 */
export const getJobs = async () => {
  try {
    // return all jobs from database
    return await prisma.tAJob.findMany();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
//get one job with route /:id
/**
 * @param id id of the job to be returned
 * @returns the job that was found
 * @throws Error if job could not be found
 */
export const getOneJob = async (id: number) => {
  try {
    // return one job from database
    return await prisma.tAJob.findUnique({
      where: {
        id: id
      }
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
//udpate job by id passed as param
/**
 * @param id id of the job to be updated
 * @param jobData data to be updated
 * @returns the job that was updated
 * @throws Error if job could not be updated
 */  
export const updateJob = async (id: number, jobData: jobData) => {
  try {
    // update one job from database
    return await prisma.tAJob.update({
      where: {
        id: id
      },
      //update partial data from body request
      data: jobData
    });
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
