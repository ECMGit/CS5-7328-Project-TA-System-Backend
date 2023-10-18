import { log } from 'console';
import * as UserService from './user.service';
//do we have to import the TA service? 
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
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('getting user')
        const users = await UserService.getUsers();
        res.json(users);
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
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserById(Number(req.params.id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * get user detail by id
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const getUserDetailById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserDetailById(Number(req.params.id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const getAllTAJobs = async (req: Request, res: Response, next: NextFunction) => {
    console.log('in get all');
    
    try {
        const taJobs = await UserService.getAllTAJobs();     
        if (taJobs.length == 0) {
            return res.status(404).json({ message: 'Np job listings found.' });
        }
        res.json(taJobs);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getTAJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taJob = await UserService.getTAJobById(Number(req.params.id));
        if (!taJob) {
            return res.status(404).json({ message: 'TA job not found' });
        }
        res.json(taJob);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// New function to handle querying with filters.
export const getTAJobsWithFilters = async (req: Request, res: Response, next: NextFunction) => {
    console.log('in controller');
    
    try {
        console.log(req.params);
        
        // Extract query parameters from the request. These will be your filters.
        const queryParams = req.query;

        // Call the service function, passing in the filters.
        const filteredTAJobs = await UserService.getTAJobsWithFilters(queryParams);

        // Send back the filtered data.
        res.json(filteredTAJobs);
    } catch (error) {
        console.error('Error fetching TA jobs with filters:', error);
        next(error); // Pass errors to the next middleware.
    }
};
