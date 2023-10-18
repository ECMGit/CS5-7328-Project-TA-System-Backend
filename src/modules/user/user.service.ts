const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * This file is for containing all the operation directly to database
 * You can use this file to create, update, delete, or get data from database
 * And you can use the value returned from this file to do complex logic in the controller
 */
export const getUsers = async () => {
    return await prisma.user.findMany();
};

export const getUserById = async (id: number) => {
    return await prisma.user.findUnique({ where: { id } });
};

export const findUserByUsername = async (username: string) => {
    return await prisma.user.findUnique({ where: { username } });
}

export const getUserDetailById = async (id: number) => {
    return await prisma.user.findUnique({
        where: { id }
    });
}

//get all Ta jobs 
export const getAllTAJobs = async () => {
    //using Prisma's findMany() method to retrieve all TA jobs from the database.
    console.log(await prisma.user.findMany());
    console.log(await prisma.tAJob.findMany());
    
    return await prisma.tAJob.findMany();
}

//find TA Job by job id
export const getTAJobById = async (id: number) => {
    //using Prisma's findMany() method to retrieve all TA jobs from the database.
    console.log(await prisma.tAJob.findMany());

    return await prisma.tAJob.findUnique({
        where: { id }
    });
}

type FilterParams = {
    title?: string;
    courseId?: number;
    course?: string;
    totalHoursPerWeek?: number;
    faculty?: string;
  };
  
  export const getTAJobsWithFilters = async (filters: FilterParams) => {
      try {
          let queryConditions: Record<string, any> = {}; // 'any' could be replaced with more specific types based on your conditions
          for (const [key, value] of Object.entries(filters)) {
              if (value) {
                  queryConditions[key] = value;
              }
          }
  
          return await prisma.tAJob.findMany({
              where: queryConditions,
          });
      } catch (error) {
          console.error('Error querying TA jobs with filters:', error);
          throw error;
      }
  };
  
