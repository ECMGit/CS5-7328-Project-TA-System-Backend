import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// setting createTask type for createTask function 
export type TaskInfo = {
    studentId: number;
    facultyId: number;
    title: string;
    description: string;

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
        return await prisma.tAJob.create({
            data: taskInfo,
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
};
    
// View completed tasks as faculty member for tasks they assigned 
export const viewCompleted = async (facultyId: number) => {
    try {
        const completedTasks = await prisma.Task.findMany({
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
export const viewPending = async (facultyId: number) => {
    try {
        const pendingTasks = await prisma.Task.findMany({
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
export const checkoff = async (studentId: number, taskId: number) => {
    try {
        // Update completion status of the task
        const updatedTask = await prisma.Task.update({
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
export const viewCurrent = async (studentId: number) => {
    try {
        const currentTasks = await prisma.Task.findMany({
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
export const viewCompletedByStudent = async (studentId: number) => {
    try {
        const completedTasks = await prisma.Task.findMany({
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