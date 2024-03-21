"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmResetPassword = exports.sendPasswordResetLink = exports.importUsers = exports.getRole = exports.login = exports.signUp = exports.getUserDetailById = exports.getUserById = exports.getUsers = void 0;
const UserService = __importStar(require("./user.service"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Import the JWT library
const JWT_SECRET = 'my-secret-key';
/**
 * Demo code for showing how to use the service layer and CRUD operations
 *
 */
// Helper function to convert all BigInt properties to strings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bigIntToString(obj) {
    for (const prop in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(prop)) {
            if (typeof obj[prop] === 'bigint') {
                obj[prop] = obj[prop].toString();
            }
            else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
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
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserService.getUsers();
        // Convert BigInt to String
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        users.forEach((user) => bigIntToString(user));
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
/**
 * get user by id
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService.getUserById(Number(req.params.id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Convert BigInt to String
        bigIntToString(user);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserById = getUserById;
/**
 * get user detail by id
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getUserDetailById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService.getUserDetailById(Number(req.params.id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Convert BigInt to String
        bigIntToString(user);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserDetailById = getUserDetailById;
/**
 * Register a new user
 * @param req
 * @param res
 * @returns {Promise<Response>} <- this is just the error code
 */
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, email, password, smuNo, firstName, lastName, year, userType } = req.body;
        // Convert number to integer
        const smuNo_int = parseInt(smuNo);
        try {
            // Check if username is already taken
            const existingUser = yield UserService.findUserByUsername(username);
            if (existingUser) {
                return res.status(409).json({ error: 'Username already taken' });
            }
            // Hash password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Create a new user
            const user = yield UserService.createUser({
                username,
                email,
                password: hashedPassword,
                smuNo: smuNo_int,
                firstName,
                lastName
            });
            if (!user) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (userType === 'student') {
                yield UserService.createStudent({
                    userId: user.id,
                    year: year,
                });
            }
            else if (userType === 'faculty') {
                yield UserService.createFaculty({
                    userId: user.id,
                    designation: '',
                    department: 'cs'
                });
            }
            else if (userType === 'admin') {
                yield UserService.createAdmin({
                    userId: user.id,
                });
            }
            // Create and send a JWT token
            // TODO: Replace JWT_SECRET with process.env.JWT_SECRET and update .env accordingly
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
            res.status(201).json({
                message: 'User registered successfully',
                token, // Include the token in the response
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.signUp = signUp;
/**
 * Login as a user
 * @param req
 * @param res
 * @returns {Promise<Response>} <- this is just the error code
 */
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            // Find the user in the database
            const user = yield UserService.findUserByUsername(username);
            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            // Compare the provided password with the stored password
            //const result = await bcrypt.compare(password, user.password);
            //if (!result) {
            //  return res.status(402).json({ error: 'Invalid username or password' });
            //}
            if (password !== user.password) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            // Exclude password and other sensitive fields before sending
            // and before generating the jwt token
            // console.log(user);
            const { password: _ } = user, safeUser = __rest(user, ["password"]);
            console.log(safeUser);
            // TODO: Replace JWT_SECRET with process.env.JWT_SECRET and update .env accordingly
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET); // Replace 'your-secret-key' with your actual secret key
            res.status(200).json({
                message: 'Login successful',
                user: safeUser,
                token, // Include the token in the response
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.login = login;
function getRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params; // Get the userId from the URL parameter
        const userId = parseInt(id, 10); // Convert id to a number if needed
        // console.log('getrole' + id, "userID"+userId);
        try {
            // Find the user's role
            const userRole = yield UserService.getUserRoleById(userId);
            // console.log(userRole);
            if (!userRole) {
                return res.status(401).json({ error: 'Invalid userId' });
            }
            res.status(200).json({ role: userRole });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.getRole = getRole;
/**
 * Import all users
 * @param req
 * @param res
 * @returns {Promise<Response>} <- this is just the error code
 */
function importUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = req.body;
        console.log(users);
        // Validate that the input is an array
        if (!Array.isArray(users)) {
            return res.status(400).json({ error: 'Input should be an array of users' });
        }
        // Validate each user object
        for (const user of users) {
            if (!user.username || !user.email || !user.password) {
                return res.status(400).json({
                    error: 'Each user object should have a username, email, and password',
                });
            }
        }
        try {
            // Batch create users
            const createdUsers = yield UserService.createUserBatch(users);
            return res
                .status(201)
                .json({ message: `${createdUsers.count} users imported successfully` });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.importUsers = importUsers;
//TODO: test following function
/**
 * get password reset link for user
 * send reset link to a email
 * @param req
 * @param res
 * @returns
 */
const sendPasswordResetLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body; //, old_password, new_password } = req.body;
    const user = yield UserService.findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email' });
    }
    const timestamp = Date.now();
    const currentDate = new Date(timestamp);
    console.log(email, currentDate.toLocaleString());
    const token = crypto_1.default.randomBytes(20).toString('hex');
    const resetLink = process.env.FRONTEND_URL + `/password-reset/${token}`;
    // Validate the email (make sure it's registered, etc.)
    // Create a reset token and expiry date for the user
    yield UserService.updateUserWithResetToken(email, token);
    // Alert the user if EMAIL_USER or EMAIL_PASS are not set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('ERROR: EMAIL_USER or EMAIL_PASS environment variables not set. Set it in .env\n');
    }
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Click the link below to reset your password:\n${resetLink}\nIf you did not request a password reset, please ignore this email.`,
        // You'd typically generate a unique link for the user to reset their password
    };
    try {
        yield transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Reset email sent successfully.' });
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ error: 'Failed to send reset email.' });
    }
});
exports.sendPasswordResetLink = sendPasswordResetLink;
/**
 * confirm a user's password reset
 * @param req
 * @param res
 * @returns
 */
const confirmResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    // 1. Find the user by the token
    const user = yield UserService.findUserByResetToken(token);
    if (!user) {
        return res.status(401).json({ error: 'User is null' });
    }
    // 2. Verify that the token hasn't expired (assuming you have an expiry date in your DB)
    // If you have a resetTokenExpiry field in your User model:
    if (!user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
        return res.status(400).json({ error: 'The access token has expired' });
    }
    // 3. Hash the new password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // 4. Update the user's password in the database
    yield UserService.updateUserWithResetToken(user.email, token, hashedPassword);
    // 6. Send a response to the frontend
    res.status(200).json({ message: 'Password reset successful' });
});
exports.confirmResetPassword = confirmResetPassword;
