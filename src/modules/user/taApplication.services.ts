import { prisma } from '../../../prisma/index';

/**
 * This file is for containing all the operation directly to database
 * You can use this file to create, update, delete, or get data from database
 * And you can use the value returned from this file to do complex logic in the controller
 */


export const getTaApplications = async () => {
    console.log('getUsers');
    //return await prisma.user.findMany();
    return await prisma.tAApplication.findMany();
};
