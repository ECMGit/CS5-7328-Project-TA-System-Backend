import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
// Used to make the request accept the user property without errors
import { UserAuthInfoRequest } from "./requestDefinitions";

// TODO: Replace JWT_SECRET with process.env.JWT_SECRET and update .env accordingly
const JWT_SECRET = 'my-secret-key';

/**
 * demo code for implementing authentication middleware
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const verifyToken = (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    // If the token is valid, add the decoded data to the request object
    req.user = decoded;
    next();
  });
};
