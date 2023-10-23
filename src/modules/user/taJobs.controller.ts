import * as UserService from './taJobs.services';
import { Request, Response, NextFunction } from 'express';

/**
 * get all users
 * @param req 
 * @param res 
 * @param next 
 */

//These files define the application's endpoint handling logic. They receive the incoming HTTP requests, invoke the necessary services, and send back the HTTP responses. 

//The `getTAJobs` function is an asynchronous endpoint handler that, when invoked, attempts to retrieve TA jobs using the `UserService.getTAJobs()` method and then sends the result as a JSON response. 
//If any error occurs during this process, it passes the error to the next middleware for handling.
export const getTAJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(String(req.params.TAStats))
        const app = await UserService.getTAJobs();
        console.log(app);
        res.json(app);
    } catch (error) {
        next(error);
    }
};
/**
 * get user by id
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const getTAJobsByFacultyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getTAJobsByFacultyId(Number(req.params.facultyId));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};
