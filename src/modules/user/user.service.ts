// custom path issue, need to fix, for now use this import
import { prisma } from 'prisma';

/**
 * This file is for containing all the operation directly to database
 * You can use this file to create, update, delete, or get data from database
 * And you can use the value returned from this file to do complex logic in the controller
 */


export const createUser = async (data: any) => {
  return await prisma.user.create({
      data,
  });
}

export const createStudent = async (data: any) => {
  return await prisma.student.create({
      data,
  });
}

interface CreateFacultyData {
    userId: number; // Adjust the data type as needed
    designation: string;
    department: string;
  }
  
export const createFaculty = async (data: CreateFacultyData) => {
  return await prisma.faculty.create({
    data: {
      userId: data.userId,
      designation: data.designation,
      department: data.department
    }
  });
};


export const createAdmin = async (data: any) => {
  return await prisma.admin.create({
      data,
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

export const getUserRoleById = async (userId: number): Promise<string | null>=>{
  const facultyUser = await prisma.faculty.findUnique({ where: { userId } });
  const studentUser = await prisma.student.findUnique({ where: { userId } });
    
  if (facultyUser) {
    return 'faculty'; // User is a faculty member
  } else if (studentUser) {
    return 'student'; // User is a student
  }

  return null; // User not found or has no specific role
};

export const createUserBatch = async (data: any) => {
  return await prisma.user.createMany({
    data: data,
    skipDuplicates: true,
  });
}

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
}

export const findUserByResetToken = async (token: string) => {
  return await prisma.user.findUnique({ where: { resetToken: token } });
}

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
