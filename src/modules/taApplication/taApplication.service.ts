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
    // // Create a user for John
    // const johnUser = await prisma.user.create({
    //   data: {
    //     smuNo: 123457, // Make sure this is unique
    //     username: 'johnsmith',
    //     email: 'john.smith@example.com',
    //     firstName: 'John',
    //     lastName: 'Smith',
    //     password: "lol password",
    //     // You can add other fields as required
    //   },
    // });

    // // Create a student instance for John
    // const johnStudent = await prisma.student.create({
    //   data: {
    //     userId: johnUser.id,
    //     year: 2,
    //     // You can add other fields as required
    //   },
    // });



    // const courses = [
    //   { courseCode: 'CSC101', title: 'Introduction to Computer Science' },
    //   { courseCode: 'CSC102', title: 'Data Structures' },
    //   { courseCode: 'CSC103', title: 'Algorithms' },
    //   // Add more courses as needed
    // ];
  
    // for (const course of courses) {
    //   const createdCourse = await prisma.course.create({
    //     data: course,
    //   });
    //   console.log(`Created course: ${createdCourse.title}`);
    // }



    // // Array of faculty details
    // const facultyMembers = [
    //   {
    //     userInfo: {
    //       smuNo: 10001,
    //       username: 'jdoe',
    //       email: 'john.doe@university.edu',
    //       firstName: 'John',
    //       lastName: 'Doe',
    //       password: bcrypt.hashSync('johnsSecurePassword', 10),
    //     },
    //     facultyInfo: {
    //       designation: 'Professor',
    //       department: 'Computer Science',
    //     },
    //   },
    //   {
    //     userInfo: {
    //       smuNo: 10002,
    //       username: 'asmith',
    //       email: 'anna.smith@university.edu',
    //       firstName: 'Anna',
    //       lastName: 'Smith',
    //       password: bcrypt.hashSync('annasSecurePassword', 10),
    //     },
    //     facultyInfo: {
    //       designation: 'Assistant Professor',
    //       department: 'Mathematics',
    //     },
    //   },
    //   // Add more faculty members as needed
    // ];

    // for (const member of facultyMembers) {
    //   const user = await prisma.user.create({
    //     data: member.userInfo,
    //   });

    //   await prisma.faculty.create({
    //     data: {
    //       userId: user.id,
    //       ...member.facultyInfo,
    //     },
    //   });
    // }



    // // Assuming you've already created courses and faculty members
    // // Fetch a course and a faculty member to associate with the TA job
    // const course = await prisma.course.findFirst({
    //   where: { courseCode: 'CSC101' } // Example, ensure this course exists
    // });

    // const facultyMember = await prisma.faculty.findFirst({
    //   where: { /* some condition to fetch a specific faculty member */ }
    // });

    // if (course && facultyMember) {
    //   // Create a TA job for the fetched course and faculty member
    //   const taJob = await prisma.tAJob.create({
    //     data: {
    //       title: "Intro to CS TA",
    //       courseId: course.id,
    //       courseSchedule: "Wednesdays, 2-4 PM",
    //       totalHoursPerWeek: 6,
    //       maxNumberOfTAs: 3,
    //       requiredCourses: "CSC100, CSC101",
    //       requiredSkills: "Programming in Python, Basic Algorithms",
    //       TAStats: "Undergraduate",
    //       notes: "Prefer students who've scored A in CSC100",
    //       deadlineToApply: new Date('2023-12-01'),
    //       facultyId: facultyMember.userId
    //     },
    //   });
    //   console.log(`Created TA job: ${taJob.title}`);
    // } else {
    //   console.log("Required course or faculty member not found!");
    // }





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
