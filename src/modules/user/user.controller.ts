import * as UserService from "./user.service";
//do we have to import the TA service?
import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import the JWT library

const JWT_SECRET = "my-secret-key";

/**
 * Demo code for showing how to use the service layer and CRUD operations
 *
 */

// Helper function to convert all BigInt properties to strings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bigIntToString(obj: any) {
  for (const prop in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === "bigint") {
        obj[prop] = obj[prop].toString();
      } else if (typeof obj[prop] === "object" && obj[prop] !== null) {
        bigIntToString(obj[prop]);
      }
    }
  }
}

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
    const users = await UserService.getUsers();

    // Convert BigInt to Stringio.ebean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users.forEach((user: any) => bigIntToString(user));

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
  try {
    const user = await UserService.getUserById(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert BigInt to String
    bigIntToString(user);

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
      return res.status(404).json({ message: "User not found" });
    }

    // Convert BigInt to String
    bigIntToString(user);

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
  const {
    username,
    email,
    password,
    smuNo,
    firstName,
    lastName,
    year,
    userType,
  } = req.body;

  // Convert number to integer
  const smuNo_int = parseInt(smuNo);

  try {
    // Check if username is already taken
    const existingUser = await UserService.findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await UserService.createUser({
      username,
      email,
      password: hashedPassword,
      userType,
      smuNo: smuNo_int,
      firstName,
      lastName
    });


    if (!user) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (userType === "student") {
      await UserService.createStudent({
        userId: user.id,
        year: year,
      });
    } else if (userType === "faculty") {
      await UserService.createFaculty({
        userId: user.id,
        designation: "",
        department: "cs",
      });
    } else if (userType === "admin") {
      await UserService.createAdmin({
        userId: user.id,
        role: "admin",
      });
    }

    // Create and send a JWT token
    // TODO: Replace JWT_SECRET with process.env.JWT_SECRET and update .env accordingly
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.status(201).json({
      message: "User registered successfully",
      token, // Include the token in the response
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
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
  console.log(username, password);
  try {
    // Find the user in the database
    const user = await UserService.findUserByUsername(username);
    // console.log("user", user); // for testing purposes
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare the provided password with the stored password

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(402).json({ error: "Invalid username or password" });
    }
    // if (password !== user.password) {
    //   return res.status(401).json({ error: 'Invalid username or password' });
    // }

    // Exclude password and other sensitive fields before sending
    // and before generating the jwt token
    // console.log(user);
    const { password: _, ...safeUser } = user;
    console.log(safeUser);

    // TODO: Replace JWT_SECRET with process.env.JWT_SECRET and update .env accordingly
    const token = jwt.sign({ userId: user.id }, JWT_SECRET); // Replace 'your-secret-key' with your actual secret key
    res.status(200).json({
      message: "Login successful",
      user: safeUser,
      token, // Include the token in the response
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Get user's role by userId
 * @param req
 * @param res
 * @returns
 */
export async function getRole(req: Request, res: Response) {
  const { id } = req.params; // Get the userId from the URL parameter
  const userId = parseInt(id, 10); // Convert id to a number if needed
  // console.log('getrole' + id, "userID"+userId);

  try {
    // Find the user's role
    const userRole = await UserService.getUserRoleById(userId);
    // console.log(userRole);
    if (!userRole) {
      return res.status(401).json({ error: "Invalid userId" });
    }

    res.status(200).json({ role: userRole });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
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
  console.log(users);
  // Validate that the input is an array
  if (!Array.isArray(users)) {
    return res.status(400).json({ error: "Input should be an array of users" });
  }

  // Validate each user object
  for (const user of users) {
    if (!user.username || !user.email || !user.password) {
      return res.status(400).json({
        error: "Each user object should have a username, email, and password",
      });
    }
  }

  try {
    // Batch create users
    const createdUsers = await UserService.createUserBatch(users);
    return res
      .status(201)
      .json({ message: `${createdUsers.count} users imported successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

//TODO: test following function
/**
 * get password reset link for user
 * send reset link to a email
 * @param req
 * @param res
 * @returns
 */

export const sendPasswordResetLink = async (req: Request, res: Response) => {
  const { email } = req.body; //, old_password, new_password } = req.body;
  const user = await UserService.findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: "Invalid email" });
  }

  const timestamp = Date.now();
  const currentDate = new Date(timestamp);

  console.log(email, currentDate.toLocaleString());

  const token = crypto.randomBytes(20).toString("hex");
  const resetLink = process.env.FRONTEND_URL + `/password-reset/${token}`;
  // Validate the email (make sure it's registered, etc.)

  // Create a reset token and expiry date for the user
  await UserService.updateUserWithResetToken(email, token);

  // Alert the user if EMAIL_USER or EMAIL_PASS are not set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(
      "ERROR: EMAIL_USER or EMAIL_PASS environment variables not set. Set it in .env\n"
    );
  }

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your preferred email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `Click the link below to reset your password:\n${resetLink}\nIf you did not request a password reset, please ignore this email.`,
    // You'd typically generate a unique link for the user to reset their password
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Reset email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ error: "Failed to send reset email." });
  }
};

/**
 * confirm a user's password reset
 * @param req
 * @param res
 * @returns
 */
export const confirmResetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  // 1. Find the user by the token
  const user = await UserService.findUserByResetToken(token);
  if (!user) {
    return res.status(401).json({ error: "User is null" });
  }

  // 2. Verify that the token hasn't expired (assuming you have an expiry date in your DB)
  // If you have a resetTokenExpiry field in your User model:
  if (!user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
    return res.status(400).json({ error: "The access token has expired" });
  }

  // 3. Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Update the user's password in the database
  await UserService.updateUserWithResetToken(user.email, token, hashedPassword);

  // 6. Send a response to the frontend
  res.status(200).json({ message: "Password reset successful" });
};

/**
 * this get function returns all available student
 * @param req
 * @param res
 * @param next
 * @returns
 */

//this get function returns all available student
export const getAllStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("in get all");

  try {
    // return all jobs that have been published
    const students = await UserService.getAllStudent();
    if (students.length == 0) {
      console.log("No student listings found.");
      // if there are no jobs found, return message that no jobs are found
      return res.status(404).json({ message: "No student listings found." });
    }
    res.json(students);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */

//this get function returns all available course
export const getAllCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("in get all");

  try {
    // return all Course
    const course = await UserService.getAllCourse();
    if (course.length == 0) {
      console.log("No Course listings found.");

      return res.status(404).json({ message: "No Course listings found." });
    }
    res.json(course);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */

//this get function returns all available Faculty
export const getAllFaculty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("in get all");

  try {
    // return all Faculty
    const faculty = await UserService.getAllFaculty();
    if (faculty.length == 0) {
      console.log("No Faculty listings found.");

      return res.status(404).json({ message: "No Faculty listings found." });
    }
    res.json(faculty);
  } catch (error) {
    console.log(error);
    next(error);
  }
};


/**
 * Admin user get course details by course id
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const getCourseDetailsByCourseId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = Number(req.params.id);
    const course = await UserService.getCourseDetails(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};
