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
    try {
        const taJobs = await UserService.getAllTAJobs();
        if (taJobs.lenght == 0) {
            return res.status(404).json({ message: 'Np job listings found.' });
        }
        res.json(taJobs);
    } catch (error) {
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
        next(error);
    }
}
