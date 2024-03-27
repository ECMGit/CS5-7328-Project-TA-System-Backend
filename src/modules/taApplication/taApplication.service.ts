import { TAApplication } from '@prisma/client';
import { TAApplicationData } from './taApplication.types';
// custom path issue, need to fix, for now use this import
import { prisma } from '../../../prisma';

/**
 * Generate message from applicant to all faculty in course
 * @param data  TAApplicationData
 * @param appId The ID of the TAApplication the message should be associated with
 */

async function createMessagesForFaculty(data: TAApplicationData, appId: number) {
  // Retrieve the course faculties
  const faculties = await prisma.facultyCourse.findMany({
    where: {
      courseId: data.courseId,
    },
    include: {
      faculty: {
        include: {
          user: true, // To get facultyName
        },
      },
    },
  });

  // Retrieve the student's name and TA job title
  const student = await prisma.student.findUnique({
    where: {
      userId: data.studentId,
    },
    include: {
      user: true,
    },
  });

  const taJob = await prisma.tAJob.findUnique({
    where: {
      id: data.taJobId,
    },
  });

  if (!student || !student.user || !taJob) {
    throw new Error('Student or TA Job not found');
  }

  const studentName = `${student.user.firstName} ${student.user.lastName}`;
  const taJobTitle = taJob.title;

  // Create messages for each faculty member
  await Promise.all(
    faculties.map(async (fc) => {
      const facultyName = `${fc.faculty.user.firstName} ${fc.faculty.user.lastName}`;
      const personalizedMessage = `This is an automated message.\nDear ${facultyName}, ${studentName} just submitted an application for ${taJobTitle}. View it here.`;

      await prisma.userMessage.create({
        data: {
          content: personalizedMessage,
          senderId: student.userId,
          receiverId: fc.faculty.userId,
          applicationId: appId
        },
      });
    })
  );
}

/**
 * Save application with associated courses and tajob
 * @param data  Ta application data
 * @param file  resume file
 */

export const saveApplication =

//   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
//   async (data: TAApplicationData, file: Express.Multer.File)
//     : Promise<TAApplication | null> => {
//     const filePath = file.path;
//     const result = await prisma.tAApplication.create({
//       data: {
//         course: { connect: { id: data.courseId } },
//         student: { connect: { userId: data.studentId } },
//         taJob: { connect: { id: data.taJobId } },
//         hoursCanWorkPerWeek: data.hoursCanWorkPerWeek,
//         // eslint-disable-next-line @typescript-eslint/naming-convention
//         GPA: data.gpa,
//         requiredCourses: data.requiredCourses,
//         requiredSkills: data.requiredSkills,
//         resumeFile: filePath,
//         coursesTaken: data.coursesTaken,
//       },
//     });
//     await createMessagesForFaculty(data, result.id);
//     return result;
//   };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async (data: TAApplicationData, file: Express.Multer.File)
        : Promise<TAApplication | null> => {
      const filePath = file.path;
      
      // Check if there is already a record with the same studentId and taJobId
      const existingRecord = await prisma.tAApplication.findFirst({
        where: {
          studentId: data.studentId,
          taJobId: data.taJobId,
        },
      });
      console.log('existingRecord', existingRecord);
      // If there is no such record, create a new one
      if (!existingRecord) {
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
      }
      
      // If there is such a record, return null or an error message
      else {
        console.log('Application already exists');
        //return proper error message 400
        
        return null;
      }
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
  return await prisma.tAApplication.findMany();
};


export const getTaApplicationsByStudentId = async (
  studentId: number
) => {
  return await prisma.tAApplication.findMany(
    {
      where: {
        studentId: studentId
      },
    }
  );
};

export const getTaApplicationsByCourseId = async (
  courseId: number
) => {
  return await prisma.tAApplication.findMany(
    {
      where: {
        courseId: courseId
      },
    }
  )
};

export const updateApplication = async (
  id: number
  , updateData: Partial<TAApplicationData>
): Promise<TAApplication> => {
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
