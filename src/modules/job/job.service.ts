import { jobData } from './job.types';
// custom path issue, need to fix, for now use this import
import { prisma } from 'prisma';


//TODO: add comments to all functions
/**
 * 
 * @returns all the job available
 */
export const getJobs = async () => {
  try {
    // return all jobs from database
    return await prisma.tAJob.findMany();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
//get one job with route /:id
/**
 * @param id id of the job to be returned
 * @returns the job that was found
 * @throws Error if job could not be found
 */
export const getOneJob = async (id: number) => {
  try {
    // return one job from database
    return await prisma.tAJob.findUnique({
      where: {
        id: id
      }
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
//udpate job by id passed as param
/**
 * @param id id of the job to be updated
 * @param jobData data to be updated
 * @returns the job that was updated
 * @throws Error if job could not be updated
 */  
export const updateJob = async (id: number, jobData: jobData) => {
  try {
    // update one job from database
    return await prisma.tAJob.update({
      where: {
        id: id
      },
      //update partial data from body request
      data: jobData
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
/**
 * @param jobData Job data to be stored
 * @returns The job that was created
 * @throws Error if job could not be created
 */
export const createJob = async (jobData: jobData) => {
  // try {
  //   const courseData = {
  //         courseCode: 'CS1234',
  //         title: 'Introduction to Programming',
  //         description: 'This course teaches students how to program in JavaScript.',
  //         // add more course fields as needed
  //     };
      
  //     const taJobData = {
  //         title: 'TA for Intro to Programming',
  //         courseSchedule: 'Tuesdays and Thursdays, 1-2 PM',
  //         totalHoursPerWeek: 10,
  //         maxNumberOfTAs: 2,
  //         requiredCourses: 'CS1234',
  //         requiredSkills: 'Programming, Tutoring',
  //         TAStats: 'Available',
  //         notes: 'Urgently needed',
  //         deadlineToApply: new Date('2023-12-31'),
  //         facultyId: 1 // Replace with valid facultyId
  //     };

  //   // Check if the course already exists
  //   try {
  //       let course = await prisma.course.findUnique({
  //         where: {
  //             courseCode: courseData.courseCode
  //         }
  //     });

  //     // If the course doesn't exist, create it
  //     if (!course) {
  //         course = await prisma.course.create({
  //             data: {
  //                 courseCode: courseData.courseCode,
  //                 title: courseData.title,
  //                 description: courseData.description
  //             }
  //         });
  //     }

  //     // Now, create the TAJob
  //     const taJob = await prisma.tAJob.create({
  //         data: {
  //             title: taJobData.title,
  //             courseId: course.id,
  //             courseSchedule: taJobData.courseSchedule,
  //             totalHoursPerWeek: taJobData.totalHoursPerWeek,
  //             maxNumberOfTAs: taJobData.maxNumberOfTAs,
  //             requiredCourses: taJobData.requiredCourses,
  //             requiredSkills: taJobData.requiredSkills,
  //             TAStats: taJobData.TAStats,
  //             notes: taJobData.notes,
  //             deadlineToApply: taJobData.deadlineToApply,
  //             facultyId: taJobData.facultyId
  //         }
  //     });

  //     return taJob;
  //   } catch (error) {
  //     throw new Error(`Failed to create course or TA Job: ${error}`);
  //   }

  // // add one job to database
  // const newCourse = await prisma.course.create({
  //   data: courseData
  // });

  try {
    return await prisma.tAJob.create({
      data: jobData,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
