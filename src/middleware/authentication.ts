// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';

// /**
//  * demo code for implementing authentication middleware
//  * @param req 
//  * @param res 
//  * @param next 
//  * @returns 
//  */
// export const authenticate = (req: Request, res: Response, next: NextFunction) => {
//     //TODO: fix the errors
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'Failed to authenticate token' });
//         }
//         req.userId = decoded.id;
//         next();
//     });
// };
