"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.getTaApplicationsByStudentId = exports.getTaApplications = exports.getApplication = exports.saveApplication = void 0;
// custom path issue, need to fix, for now use this import
const prisma_1 = require("../../../prisma");
/**
 * Generate message from applicant to all faculty in course
 * @param data  TAApplicationData
 * @param appId The ID of the TAApplication the message should be associated with
 */
function createMessagesForFaculty(data, appId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Retrieve the course faculties
        const faculties = yield prisma_1.prisma.facultyCourse.findMany({
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
        const student = yield prisma_1.prisma.student.findUnique({
            where: {
                userId: data.studentId,
            },
            include: {
                user: true,
            },
        });
        const taJob = yield prisma_1.prisma.tAJob.findUnique({
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
        yield Promise.all(faculties.map((fc) => __awaiter(this, void 0, void 0, function* () {
            const facultyName = `${fc.faculty.user.firstName} ${fc.faculty.user.lastName}`;
            const personalizedMessage = `This is an automated message.\nDear ${facultyName}, ${studentName} just submitted an application for ${taJobTitle}. View it here.`;
            yield prisma_1.prisma.userMessage.create({
                data: {
                    content: personalizedMessage,
                    senderId: student.userId,
                    receiverId: fc.faculty.userId,
                    applicationId: appId
                },
            });
        })));
    });
}
/**
 * Save application with associated courses and tajob
 * @param data  Ta application data
 * @param file  resume file
 */
const saveApplication = 
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
(data, file) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = file.path;
    // Check if there is already a record with the same studentId and taJobId
    const existingRecord = yield prisma_1.prisma.tAApplication.findFirst({
        where: {
            studentId: data.studentId,
            taJobId: data.taJobId,
        },
    });
    console.log('existingRecord', existingRecord);
    // If there is no such record, create a new one
    if (!existingRecord) {
        return yield prisma_1.prisma.tAApplication.create({
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
});
exports.saveApplication = saveApplication;
/**
 * Get a application by id
 * @param id application id
 */
const getApplication = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield prisma_1.prisma.tAApplication.findUnique({ where: { id } });
    if (!application) {
        return null;
    }
    return application;
});
exports.getApplication = getApplication;
/**
 * Get all applications
 */
const getTaApplications = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.tAApplication.findMany();
});
exports.getTaApplications = getTaApplications;
const getTaApplicationsByStudentId = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.tAApplication.findMany({
        where: {
            studentId: studentId
        },
    });
});
exports.getTaApplicationsByStudentId = getTaApplicationsByStudentId;
const updateApplication = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.tAApplication.update({
        where: { id },
        data: Object.assign({}, updateData
        // Omit resumeFile here, handle it separately if you're allowing resume file updates
        ),
    });
});
exports.updateApplication = updateApplication;
const deleteApplication = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.tAApplication.delete({
        where: { id },
    });
});
exports.deleteApplication = deleteApplication;
