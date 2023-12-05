import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//get all Ta jobs
export const getAllTAJobs = async () => {
  //using Prisma's findMany() method to retrieve all TA jobs from the database.
  console.log(
    await prisma.tAJob.findMany({
      include: {
        course: true,
        faculty: true,
      },
    })
  );

  return await prisma.tAJob.findMany({
    include: {
      course: true,
      faculty: true,
    },
  });
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
  return await prisma.tAJob.findMany({ where:{ facultyId } } );
};