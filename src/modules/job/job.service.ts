import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getJobs = async () => {
  try {
    return await prisma.tAJob.findMany();
  } catch (error) {
    throw error;
  }
};

/**
 * @param jobData Job data to be stored
 */
export const createJob = async (jobData: {
  title: string;
  courseId: number;
  courseSchedule: string;
  totalHoursPerWeek: number;
  maxNumberOfTAs: number;
  requiredCourses: string;
  requiredSkills: string;
  TAStats: string;
  notes?: string;
  deadlineToApply: Date;
  facultyId: number;
}) => {
  try {
    return await prisma.tAJob.create({
      data: jobData,
    });
  } catch (error) {
    throw error;
  }
};
