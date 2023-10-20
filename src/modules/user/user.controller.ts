import * as UserService from './user.service';
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
        console.log(users);
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