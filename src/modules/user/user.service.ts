// custom path issue, need to fix, for now use this import
import { prisma } from '../../../prisma';

/**
 * This file is for containing all the operation directly to database
 * You can use this file to create, update, delete, or get data from database
 * And you can use the value returned from this file to do complex logic in the controller
 */


export const createUser = async (data: any) => {
  return await prisma.user.create({
      data
  });
}

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({ where: { username } });
};

export const getUserDetailById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};