import * as TaskService from './tasks.service';
import { Request, Response, NextFunction } from 'express';

/**
 * @param req
 * @param res
 * @param next
 * @returns
 */

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    console.log("In create tasks");
    try {
        const taskInfo = req.body; // Assuming task information is sent in the request body
        const newTask = await TaskService.createTask(taskInfo);
        res.status(201).json(newTask);
    } catch (error) {
        console.log("error")
        next(error); // Pass the error to the error handling middleware
    }
};

/**
 * Controller function to view completed tasks for a faculty member.
 * @param req The HTTP request containing faculty ID.
 * @param res The HTTP response to be sent back.
 * @param next The next function to be called in the middleware chain.
 */
export const viewCompleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const facultyId = parseInt(req.params.facultyId); // Assuming faculty ID is passed as a route parameter
        const completedTasks = await TaskService.viewCompleted(facultyId);
        res.json(completedTasks);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

/**
 * Controller function to view pending tasks for a faculty member.
 * @param req The HTTP request containing faculty ID.
 * @param res The HTTP response to be sent back.
 * @param next The next function to be called in the middleware chain.
 */
export const viewPending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const facultyId = req.params.facultyId; // Assuming faculty ID is passed as a route parameter
        const pendingTasks = await TaskService.viewPending(parseInt(facultyId));
        res.json(pendingTasks);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

/**
 * Controller function to check off a task as completed by a student.
 * @param req The HTTP request containing student ID and task ID.
 * @param res The HTTP response to be sent back.
 * @param next The next function to be called in the middleware chain.
 */
export const checkoff = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId = req.body.studentId; // Assuming student ID is sent in the request body
        const taskId = req.body.taskId; // Assuming task ID is sent in the request body
        const result = await TaskService.checkoff(studentId, taskId);
        if (result) {
            res.json({ success: true, message: 'Task completion status updated successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'Task with the specified ID not found.' });
        }
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

/**
 * Controller function to view current tasks for a student.
 * @param req The HTTP request containing student ID.
 * @param res The HTTP response to be sent back.
 * @param next The next function to be called in the middleware chain.
 */
export const viewCurrent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId = req.params.studentId; // Assuming student ID is passed as a route parameter
        const currentTasks = await TaskService.viewCurrent(parseInt(studentId));
        res.json(currentTasks);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

/**
 * Controller function to view completed tasks for a student.
 * @param req The HTTP request containing student ID.
 * @param res The HTTP response to be sent back.
 * @param next The next function to be called in the middleware chain.
 */
export const viewCompletedByStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId = req.params.studentId; // Assuming student ID is passed as a route parameter
        const completedTasks = await TaskService.viewCompletedByStudent(parseInt(studentId));
        res.json(completedTasks);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};
