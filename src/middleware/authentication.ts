import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

// Used to make the request accept the user property without errors
import { UserAuthInfoRequest } from "./requestDefinitions";

// TODO: Replace JWT_SECRET with process.env.JWT_SECRET and update .env accordingly
const JWT_SECRET = "my-secret-key";


interface CustomJwtPayload extends JwtPayload {
  userId: number; // Assuming userId is a number type
}

// Please do not touch this file if you do not know what you are doing
/**
 * demo code for implementing authentication middleware
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    token = req.headers.authorization; //just in case if someone send token without Bearer
  }

  // console.log("token " + token);
  // console.log('req.headers.authorization '+req.headers.authorization);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    req.body.userId = decoded.userId; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  // Verify the token, legacy implementation
  // jwt.verify(token, JWT_SECRET, (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({ error: "Invalid token" });
  //   }
  //   console.log("valid token");
  //   next();
  // });

};
