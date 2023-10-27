import * as UserService from './user.service';
//do we have to import the TA service?
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import {prisma} from '../../../prisma';
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
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('getting user');
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
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(Number(req.params.id));
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
export const getUserDetailById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

/**
 * Register a new user
 * @param req
 * @param res
 * @returns {Promise<Response>} <- this is just the error code
 */
export async function signUp(req: Request, res: Response) {
  const { username, email, password, smuNo, firstName, lastName } = req.body;
  console.log(req.body);
  
  // Convert number to integer
  const smuNo_int = parseInt(smuNo);

  try {
    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await UserService.createUser({ username, email, password: hashedPassword, smuNo: smuNo_int, firstName, lastName });
  //   await prisma.user.create({
  //     data: { username, email, password: hashedPassword, smuNo: smuNo_int, firstName, lastName }
  //   });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Login as a user
 * @param req
 * @param res
 * @returns {Promise<Response>} <- this is just the error code
 */
export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
      // Find the user in the database
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
          return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Compare the provided password with the stored password
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
          return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Exclude password and other sensitive fields before sending
      const { password: _, ...safeUser } = user;
      return res.status(200).json({ message: 'Login successful', user: safeUser });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Import all users
 * @param req
 * @param res
 * @returns {Promise<Response>} <- this is just the error code
 */
export async function importUsers(req: Request, res: Response) {
  const users = req.body;

  // Validate that the input is an array
  if (!Array.isArray(users)) {
      return res.status(400).json({ error: 'Input should be an array of users' });
  }

  // Validate each user object
  for (const user of users) {
      if (!user.username || !user.email || !user.password) {
          return res.status(400).json({ error: 'Each user object should have a username, email, and password' });
      }
  }

  try {
      // Batch create users
      const createdUsers = await prisma.user.createMany({
          data: users,
          skipDuplicates: true, // This will skip any users with duplicate usernames or emails
      });
      return res.status(201).json({ message: `${createdUsers.count} users imported successfully` });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
}
