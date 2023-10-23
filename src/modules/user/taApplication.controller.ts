import * as UserService from './taApplication.services';
import { Request, Response, NextFunction } from 'express';
/**
 * Demo code for showing how to use the service layer and CRUD operations
 * 
 */

/**
 * get all users
 * @param req 
 * @param res 
 * @param next 
 */
//this is the controller for the taApplication
export const getTaApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // call the service layer function and pass req.query as the parameter
        const app = await UserService.getTaApplications();
        // send the response
        console.log(app);
        res.json(app);
    } catch (error) {
        next(error);
    }
};