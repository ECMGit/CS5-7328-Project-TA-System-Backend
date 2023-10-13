import { prisma } from 'prisma';

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
    return await prisma.TAJob.findMany();
}

//find TA Job by job id
export const getTAJobById = async (id: number) => {
    //using Prisma's findMany() method to retrieve all TA jobs from the database.
    return await prisma.TAJob.findUnique({
        where: { id }
    });
}