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
