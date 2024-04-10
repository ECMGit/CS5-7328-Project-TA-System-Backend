import { prisma } from 'prisma';
import { TAEvaluationData } from './taPerformance.types';



/**
 * Create a new TA evaluation record in the database
 * @param evaluationData The data for the TA evaluation
 * @returns The newly created TA evaluation record
 */
export async function createEvaluation(evaluationData: TAEvaluationData) {
    return await prisma.tAEvaluation.create({
        data: evaluationData
    });
}

/**
 * Retrieve all TA performance evaluation results from the database
 * @returns An array of TA performance evaluation records
 */
export async function getAllEvaluations() {
    return await prisma.tAEvaluation.findMany({
        include: {
            taUser: {
                select: { username: true }
            },
            facultyUser: {
                select: { username: true }
            },
            course: {
                select: { title: true }
            }
        }
    });
}


export async function getCoursesAndTAsForFaculty(facultyUserId: number) {
    // get information base the facultyUserId
    const facultyCourses = await prisma.facultyCourse.findMany({
        where: { facultyId: facultyUserId },
        include: {
            course: {
                include: {
                    tas: {
                        include: {
                            student: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return facultyCourses.map(fc => ({
        courseId: fc.course.id,
        courseCode: fc.course.courseCode,
        courseTitle: fc.course.title,
        tas: fc.course.tas.map(ta => ({
            studentUsername: ta.student.user.username,
            smuNo: ta.student.user.smuNo
        }))
    }));
}