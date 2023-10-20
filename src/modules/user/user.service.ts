import { log } from "console";

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
    console.log(await prisma.tAJob.findMany({
      include: {
      course: true,
      faculty: true,
    },}));
    
    return await prisma.tAJob.findMany({
      include: {
        course: true,
        faculty: true,
      },
    });
}

//find TA Job by job id
export const getTAJobById = async (id: number) => {
    //using Prisma's findMany() method to retrieve all TA jobs from the database.
    try{
        return await prisma.tAJob.findUnique({
            where: { id },
            include: {
              course: true,
              faculty: true,
            },
        });
    }
    catch (err) {
        return null;
    }
}

type FilterParams = {
    title?: string;
    courseId?: number;
    course?: string;
    totalHoursPerWeek?: number;
    faculty?: string;
    taStats?: string;
  };
  
  export const getTAJobsWithFilters = async (filters: FilterParams) => {
    try {
      let queryConditions: Record<string, any> = {}; // 'any' could be replaced with more specific types based on your conditions
  
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          // Check if the value is one of the properties that need to be converted to a number
          if ((key === 'courseId' || key === 'totalHoursPerWeek') && typeof value === 'string') {
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
  
      console.log("Query conditions:", queryConditions);
  
      // Now 'queryConditions' will have the right types for the values
      const jobs = await prisma.tAJob.findMany({
        where: queryConditions,
        include: {
            course: true,
            faculty: {
              include: {
                user: true // Include the user associated with the faculty
              }
            }
          },
      });
  
      return jobs;
    } catch (error) {
      console.error('Error querying TA jobs with filters:', error);
      throw error;
    }
  };
  
  
  
  
