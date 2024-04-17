import { prisma } from "prisma"; // singleton pattern, we initialized under prisma/index.ts
//import the presetted prisma from prisma/index.ts which I defined a shortcut in tsconfig.json

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
/**
 * This file is for containing all the operation directly to database
 * You can use this file to create, update, delete, or get data from database
 * And you can use the value returned from this file to do complex logic in the controller
 */

export const createUser = async (data: any) => {
  try {
    const user = await prisma.user.create({
      data,
    });
    // console.log('User created:', user); // Logging for debugging
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

interface CreateStudentData {
  userId: number;
  year: number;
}

/**
 * Create a student record in the database
 * @param data
 * @returns
 */
export const createStudent = async (data: CreateStudentData) => {
  return await prisma.student.create({
    data: {
      year: data.year,
      user: {
        connect: {
          id: data.userId,
        },
      },
    },
  });
};

interface CreateFacultyData {
  userId: number; // Adjust the data type as needed
  designation: string;
  department: string;
}

export const createFaculty = async (data: CreateFacultyData) => {
  return await prisma.faculty.create({
    data: {
      designation: data.designation,
      department: data.department,
      user: {
        connect: {
          id: data.userId,
        },
      },
    },
  });
};

interface CreateAdminData {
  userId: number;
  role: string;
}
export const createAdmin = async (data: CreateAdminData) => {
  return await prisma.admin.create({
    data: {
      role: data.role,
      user: {
        connect: {
          id: data.userId,
        },
      },
    },
  });
};

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const findUserByUsername = async (username: string) => {
  console.log("username", username);
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      faculty: true,
      student: true,
      admin: true,
    },
  });
  console.log("user", user);
  if (user === null || user === undefined) {
    return null;
  }
  //TODO: set default role to student for now
  let role = "student";

  if (user.admin) {
    role = "admin";
  } else if (user.faculty) {
    role = "faculty";
  } else if (user.student) {
    role = "student";
  }
  // Add user role according to joiner table
  return {
    ...user,
    role: role,
  };
};

export const getUserDetailById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const getUserRoleById = async (
  userId: number
): Promise<string | null> => {
  const facultyUser = await prisma.faculty.findUnique({ where: { userId } });
  const studentUser = await prisma.student.findUnique({ where: { userId } });
  const adminUser = await prisma.admin.findUnique({ where: { userId } });

  if (adminUser) {
    return "admin"; // User is a admin
  } else if (facultyUser) {
    return "faculty"; // User is a faculty member
  } else if (studentUser) {
    return "student"; // User is a student
  }

  return null; // User not found or has no specific role
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

/**
 * Get all students from the database
 * @returns
 */
export const getAllStudent = async () => {
  //using Prisma's findMany() method to retrieve all student from the database.

  return await prisma.student.findMany({
    include: {
      user: true,
    },
  });
};

/**
 * Get all courses from the database,
 * TODO: Add pagination
 * @returns
 */
export const getAllCourse = async () => {
  try {
    const course = await prisma.course.findMany();
    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

/**
 * Get all faculty from the database,
 * TODO: add pagination
 * @returns
 */
export const getAllFaculty = async () => {
  try {
    return await prisma.faculty.findMany({
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw error;
  }
};

export const getCourseDetails = async (courseId: number) => {
  try {
    return await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        TAJob: true,
        TAApplication: true,
      },
    });
  } catch (error) {
    console.log("Error fetching course details", error);
    throw error;
  }
};
