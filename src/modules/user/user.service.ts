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

  return user;

};

interface CreateStudentData {
  userId: number;
  year: number;
}

export const createStudent = async (data: CreateStudentData) => {
  return await prisma.student.create({
    data: {
      year: data.year,
      user: {
        connect: {
          id: data.userId
        }
      }
    }
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
          id: data.userId
        }
      }
    }
  });
};


export const createAdmin = async (data: any) => {
  return await prisma.admin.create({
    data,
  });
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
  // console.log('user', user);
  if (user === null || user === undefined) {
    return null;
  }
  //TODO: set default role to student for now
  let role = 'student';

  if (user.admin) {
    role = 'admin';
  } else if (user.faculty) {
    role = 'faculty';
  } else if (user.student) {
    role = 'student';
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

export const getUserRoleById = async (userId: number): Promise<string | null> => {
  const adminUser = await prisma.admin.findUnique({ where: { userId } });
  const facultyUser = await prisma.faculty.findUnique({ where: { userId } });
  const studentUser = await prisma.student.findUnique({ where: { userId } });

  if (adminUser) {
    return 'admin';// User is a admin
  }
  else if (facultyUser) {
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
