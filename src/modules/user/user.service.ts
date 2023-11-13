// custom path issue, need to fix, for now use this import
import { prisma } from 'prisma';

/**
 * This file is for containing all the operation directly to database
 * You can use this file to create, update, delete, or get data from database
 * And you can use the value returned from this file to do complex logic in the controller
 */


export const createUser = async (data: any) => {
  //First create the user
  const user = await prisma.user.create({
    data,
  });
    
  //TODO: should create student or faculty accordingly
    
  return user;  
    
};

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const findUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique(
    {
      where: { username }
      , include: {
        faculty: true
        , student: true
        , admin: true
      }
    }
  );
  if (!user) {
    return null;
  }
  //TODO: set default role to student for now
  let role = 'student';

  if (user.admin) {
    role = 'admin';
  } else if (user.faculty) {
    role = 'faculty';
  } else if (user.student) {
    role ='student';
  }
  // Add user role according to joiner table
  return {
    ...user
    , role: role
  };
};

export const getUserDetailById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const createUserBatch = async (data: any) => {
  return await prisma.user.createMany({
    data: data,
    skipDuplicates: true,
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const findUserByResetToken = async (token: string) => {
  return await prisma.user.findUnique({ where: { resetToken: token } });
};

export const updateUserWithResetToken = async (
  email: string,
  token: string,
  hashedPassword?: string
) => {
  const updateData: {
    resetToken?: string | null;
    resetTokenExpiry?: number | null;
    password?: string;
  } = {
    resetToken: token,
    resetTokenExpiry: Date.now() + 3600000, // 1 hour from now
  };

  // If hashedPassword is provided, use it to update the password and clear the resetToken fields
  if (hashedPassword) {
    updateData.password = hashedPassword;
    updateData.resetToken = null;
    updateData.resetTokenExpiry = null;
  }

  return await prisma.user.update({
    where: { email: email },
    data: updateData,
  });
};
