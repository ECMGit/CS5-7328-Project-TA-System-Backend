import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// setting createTask type for createTask function 
export type TaskInfo = {
    studentId: string;
    facultyId: string;
    title: string;
    description: string;
    courseId: number | null;
    
};
/**
 * @param TaskInfo Task Info to be stored
 * @returns The taks was created
 * @throws Error if task could not be created
 */

// create a new task 
export const createTask = async (taskInfo: TaskInfo) => {
    console.log(taskInfo);

    try {
        if (taskInfo.courseId == 0) { // If the user did not enter a course id
            taskInfo.courseId = null;
        }

        return await prisma.task.create({
            data: taskInfo,
            
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
};
    
// View completed tasks as faculty member for tasks they assigned 
export const viewCompleted = async (facultyId: string) => {
    try {
        const completedTasks = await prisma.task.findMany({
            where: {
                completed: true,
                facultyId: facultyId,
            },
        });
        return completedTasks;
    } catch (error) {
        console.error('Error fetching completed tasks:', error);
    }
}

// View pending tasks(non-complete tasks) as faculty member for tasks they assigned
export const viewPending = async (facultyId: string) => {
    try {
        const pendingTasks = await prisma.task.findMany({
            where: {
                completed: false,
                facultyId: facultyId,
            },
        });
        return pendingTasks;
    } catch (error) {
        console.error('Error fetching pending tasks:', error);
    }
}

// Check off tasks as student who is assigned tasks
export const checkoff = async (studentId: string, taskId: number) => {
    try {
        // Update completion status of the task
        const updatedTask = await prisma.task.update({
            where: {
                TaskId: taskId,
                studentId: studentId,
            },
            data: {
                completed: true,
            },
        });
        // Check if the task was updated successfully
        if (updatedTask) {
            return true; //Task was updated successfully
        } else {
            return false; //Task with specified ID not found
        }   
    } catch (error) {
        console.error('Error updating task completion status:', error);
    }
}

// View current tasks as a student based on their Id
export const viewCurrent = async (studentId: string) => {
    try {
        const currentTasks = await prisma.task.findMany({
            where: {
                studentId: studentId,
                completed: false,
            },
        });
        return currentTasks;
    } catch (error) {
        console.error('Error fetching current tasks:', error);
    }
}

// View completed tasks as a student based on their Id
export const viewCompletedByStudent = async (studentId: string) => {
    try {
        const completedTasks = await prisma.task.findMany({
            where: {
                studentId: studentId,
                completed: true,
            },
        });
        return completedTasks;
    } catch (error) {
        console.error('Error fetching completed tasks:', error);
    }
}

// View tasks based on their course Id
export const viewByCourse = async (courseId: number) => {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                courseId: courseId,
                
            },
        });
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}