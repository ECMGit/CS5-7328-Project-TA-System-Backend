import { Request, Response } from 'express';
import * as TaPerformanceService from './taPerformance.service';

/**
 * Handles the request to create a new TA evaluation
 * @param req The HTTP request object containing TA evaluation data
 * @param res The HTTP response object
 * @returns A JSON response with the newly created TA evaluation record
 */
export async function createTaEvaluation(req: Request, res: Response) {
    try {
        const evaluationData = req.body;
        const newEvaluation = await TaPerformanceService.createEvaluation(evaluationData);
        res.status(201).json(newEvaluation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Handles the request to retrieve all TA performance evaluations
 * @param req The HTTP request object
 * @param res The HTTP response object
 * @returns A JSON response with all TA performance evaluation records
 */
export async function getAllTaEvaluations(req: Request, res: Response) {
    try {
        const evaluations = await TaPerformanceService.getAllEvaluations();
        res.json(evaluations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Handles the request to retrieve all TA performance evaluations
 * @param req The HTTP request object
 * @param res The HTTP response object
 * @returns A JSON response with all TA performance evaluation records
 */
// 在 taPerformance.controller.ts 中

export async function getFacultyCoursesAndTAs(req: Request, res: Response) {
    try {
        const facultyUserId = parseInt(req.params.facultyUserId);
        const coursesAndTAs = await TaPerformanceService.getCoursesAndTAsForFaculty(facultyUserId);
        res.json(coursesAndTAs);
    } catch (error) {
        // check the 'unknown' type
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            // if there not an Error entity，return
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}