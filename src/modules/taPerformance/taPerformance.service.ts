import { prisma } from 'prisma';
import { TAEvaluationData , FacultyCourseTAInfo } from './taPerformance.types';



/**
 * Create a new TA evaluation record in the database
 * @param evaluationData The data for the TA evaluation
 * @returns The newly created TA evaluation record
 */
export async function createEvaluation(evaluationData: TAEvaluationData) {
    return await prisma.tAEvaluation.create({
        data: {
            taUserId: evaluationData.taUserId,
            facultyUserId: evaluationData.facultyUserId,
            courseId: evaluationData.courseId,
            teachingSkill: evaluationData.teachingSkill,
            mentoringSkill: evaluationData.mentoringSkill,
            effectiveCommunication: evaluationData.effectiveCommunication,
            comments: evaluationData.comments,
        }
    });
}


/**
 * Retrieve all TA performance evaluation results from the database
 * @returns An array of TA performance evaluation records
 */
export async function getAllEvaluations() {
    return await prisma.tAEvaluation.findMany({
        select: {
            taUserId: true,
            facultyUserId: true,
            courseId: true,
            teachingSkill: true,
            mentoringSkill: true,
            effectiveCommunication: true,
            comments: true
        }
    });
}






export async function getCoursesAndTAsForFaculty(facultyUserId: number) {
    console.log(`Retrieving courses for faculty with ID: ${facultyUserId}`);
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

    console.log(`Courses found: ${facultyCourses.length}`);

    let result: FacultyCourseTAInfo[] = [];

    facultyCourses.forEach(fc => {
        fc.course.tas.forEach(ta => {
            result.push({
                courseId: fc.course.id,
                courseCode: fc.course.courseCode,
                title: fc.course.title,
                username: ta.student.user.username,
                smuNo: ta.student.user.smuNo,
                userId: ta.student.userId, // Assuming studentId represents the TA's userId
                facultyUserId: fc.facultyId // Include facultyUserId
            });
            console.log(`Added TA: ${ta.student.user.username} for course ID: ${fc.course.id}`);
        });
    });

    console.log(`Total TAs found: ${result.length}`);
    return result;
}


