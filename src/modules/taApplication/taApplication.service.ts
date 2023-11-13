import { TAApplication } from '@prisma/client';
import { TAApplicationData } from './taApplication.types';
// custom path issue, need to fix, for now use this import
import { prisma } from 'prisma';
import bcrypt from 'bcrypt';

/**
 * Save application with associated courses and tajob
 * @param data  Ta application data
 * @param file  resume file
 */
export const saveApplication =
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async (data: TAApplicationData, file: Express.Multer.File) => {
    const filePath = file.path;
    return await prisma.tAApplication.create({
      data: {
        course: { connect: { id: data.courseId } },
        student: { connect: { userId: data.studentId } },
        taJob: { connect: { id: data.taJobId } },
        hoursCanWorkPerWeek: data.hoursCanWorkPerWeek,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        GPA: data.gpa,
        requiredCourses: data.requiredCourses,
        requiredSkills: data.requiredSkills,
        resumeFile: filePath,
        coursesTaken: data.coursesTaken,
      },
    });
  };

/**
 * Get a application by id
 * @param id application id
 */
export const getApplication = async (
  id: number
): Promise<TAApplication | null> => {
  const application = await prisma.tAApplication.findUnique({ where: { id } });

  if (!application) {
    return null;
  }

  return application;
};

/**
 * Get all applications
 */
export const getTaApplications = async () => {
  console.log('getUsers');
  return await prisma.tAApplication.findMany();
};


export const updateApplication = async (id: number, updateData: Partial<TAApplicationData>): Promise<TAApplication> => {
  return await prisma.tAApplication.update({
    where: { id },
    data: {
      ...updateData
      // Omit resumeFile here, handle it separately if you're allowing resume file updates
    },
  });
};


export const deleteApplication = async (id: number): Promise<TAApplication> => {
  return await prisma.tAApplication.delete({
    where: { id },
  });
};
