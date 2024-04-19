export type TAEvaluationData = {
    taUserId: number;
    facultyUserId: number;
    courseId: number;
    teachingSkill: number;
    mentoringSkill: number;
    effectiveCommunication: number;
    comments: string;
};



export interface FacultyCourseTAInfo {
    courseId: number;
    courseCode: string;
    title: string;
    username: string;
    smuNo: number;
    userId: number;
    facultyUserId: number;
}

