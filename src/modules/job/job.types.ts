export type jobData = {
    title: string;
    courseId: number;
    courseSchedule: string;
    totalHoursPerWeek: number;
    maxNumberOfTAs: number;
    requiredCourses: string;
    requiredSkills: string;
    TAStats: string;
    notes?: string;
    deadlineToApply: Date; // should be formatted as ISO date
    facultyId: number;
};