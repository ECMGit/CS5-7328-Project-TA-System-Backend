import { prisma } from 'prisma';

//get all Ta jobs
export const getAllTAJobs = async () => {
  //using Prisma's findMany() method to retrieve all TA jobs from the database.

  return await prisma.tAJob.findMany({
    include: {
      course: true,
      faculty: true,
    },
  });
};
//Update student TA assignment
export const makeTAService = async (studentId: number, courseId: number) => {
  const taAssignment = await prisma.courseTA.create({
    data: {
      student: { connect: { userId: studentId } },
      course: { connect: { id: courseId } },
    },
  });

  return taAssignment;
};

//find TA Job by job id
export const getTAJobById = async (id: number) => {
  //using Prisma's findMany() method to retrieve all TA jobs from the database.
  try {
    return await prisma.tAJob.findUnique({
      where: { id },
      include: {
        course: true,
        faculty: true,
      },
    });
  } catch (err) {
    return null;
  }
};

type FilterParams = {
  title?: string;
  courseId?: number;
  course?: string;
  totalHoursPerWeek?: number;
  faculty?: string;
};

export const getTAJobsWithFilters = async (filters: FilterParams) => {
  try {
    // TODO: above'any' could be replaced with more specific types based on your conditions
    // 'any' could be replaced with more specific types based on your conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryConditions: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        // Check if the value is one of the properties that need to be converted to a number
        if (
          (key === 'courseId' || key === 'totalHoursPerWeek') &&
          typeof value === 'string'
        ) {
          const number = parseInt(value, 10);

          // Check if the conversion was successful before adding to queryConditions
          if (!isNaN(number)) {
            queryConditions[key] = number;
          } else {
            // If the conversion results in NaN and you prefer to not include it in the query,
            // you can decide either to skip this condition or handle it appropriately, maybe by logging an error.
            console.error(`Invalid number received for ${key}`);
            // You can continue to the next iteration if you don't want this property to be part of your query
            continue;
          }
        } else {
          // For other values, no conversion is needed
          queryConditions[key] = value;
        }
      }
    }

    console.log('Query conditions:', queryConditions);

    // Now 'queryConditions' will have the right types for the values
    const jobs = await prisma.tAJob.findMany({
      where: queryConditions,
      include: {
        course: true,
        faculty: {
          include: {
            user: true, // Include the user associated with the faculty
          },
        },
      },
    });

    return jobs;
  } catch (error) {
    console.error('Error querying TA jobs with filters:', error);
    throw error;
  }
};

export const getTAJobsByFacultyId = async (facultyId: number) => {
  return await prisma.tAJob.findMany({ where: { facultyId } });
};


// setting jobData type for use in createJob and updateJob route functions
export type jobData = {
  title: string;
  courseId: number;
  courseSchedule: string;
  totalHoursPerWeek: number;
  maxNumberOfTAs: number;
  requiredCourses: string;
  requiredSkills: string;
  TAStats: string;
  notes?: string;
  deadlineToApply: Date; // should be formatted as ISO date
  facultyId: number;
};
/**
 * @param jobData Job data to be stored
 * @returns The job that was created
 * @throws Error if job could not be created
 */
export const createJob = async (jobData: jobData) => {
  console.log(jobData);
  
  
  try {
    return await prisma.tAJob.create({
      data: jobData,
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

