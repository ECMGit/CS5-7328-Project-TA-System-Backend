import { PrismaClient } from "@prisma/client";
import { jobData } from "./job.types";
const prisma = new PrismaClient();

//TODO: add comments to all functions
export const getJobs = async () => {
  try {
    // return all jobs from database
    return await prisma.tAJob.findMany();
  } catch (error) {
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
    throw error;
  }
};
