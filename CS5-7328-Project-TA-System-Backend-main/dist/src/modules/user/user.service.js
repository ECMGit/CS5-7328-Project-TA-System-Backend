"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserWithResetToken = exports.findUserByResetToken = exports.findUserByEmail = exports.createUserBatch = exports.getUserRoleById = exports.getUserDetailById = exports.findUserByUsername = exports.getUserById = exports.getUsers = exports.createAdmin = exports.createFaculty = exports.createStudent = exports.createUser = void 0;
// custom path issue, need to fix, for now use this import
const prisma_1 = require("prisma");
/**
 * This file is for containing all the operation directly to database
 * You can use this file to create, update, delete, or get data from database
 * And you can use the value returned from this file to do complex logic in the controller
 */
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    //First create the user
    const user = yield prisma_1.prisma.user.create({
        data,
    });
    return user;
});
exports.createUser = createUser;
const createStudent = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.student.create({
        data: {
            year: data.year,
            user: {
                connect: {
                    id: data.userId
                }
            }
        }
    });
});
exports.createStudent = createStudent;
const createFaculty = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.faculty.create({
        data: {
            designation: data.designation,
            department: data.department,
            user: {
                connect: {
                    id: data.userId
                }
            }
        }
    });
});
exports.createFaculty = createFaculty;
const createAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.admin.create({
        data,
    });
});
exports.createAdmin = createAdmin;
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findMany();
});
exports.getUsers = getUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findUnique({ where: { id } });
});
exports.getUserById = getUserById;
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: { username },
        include: {
            faculty: true,
            student: true,
            admin: true
        }
    });
    // console.log('user', user);
    if (user === null || user === undefined) {
        return null;
    }
    //TODO: set default role to student for now
    let role = 'student';
    if (user.admin) {
        role = 'admin';
    }
    else if (user.faculty) {
        role = 'faculty';
    }
    else if (user.student) {
        role = 'student';
    }
    // Add user role according to joiner table
    return Object.assign(Object.assign({}, user), { role: role });
});
exports.findUserByUsername = findUserByUsername;
const getUserDetailById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findUnique({
        where: { id },
    });
});
exports.getUserDetailById = getUserDetailById;
const getUserRoleById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const facultyUser = yield prisma_1.prisma.faculty.findUnique({ where: { userId } });
    const studentUser = yield prisma_1.prisma.student.findUnique({ where: { userId } });
    if (facultyUser) {
        return 'faculty'; // User is a faculty member
    }
    else if (studentUser) {
        return 'student'; // User is a student
    }
    return null; // User not found or has no specific role
});
exports.getUserRoleById = getUserRoleById;
const createUserBatch = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.createMany({
        data: data,
        skipDuplicates: true,
    });
});
exports.createUserBatch = createUserBatch;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findUnique({ where: { email } });
});
exports.findUserByEmail = findUserByEmail;
const findUserByResetToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findUnique({ where: { resetToken: token } });
});
exports.findUserByResetToken = findUserByResetToken;
const updateUserWithResetToken = (email, token, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = {
        resetToken: token,
        resetTokenExpiry: Date.now() + 3600000, // 1 hour from now
    };
    // If hashedPassword is provided, use it to update the password and clear the resetToken fields
    if (hashedPassword) {
        updateData.password = hashedPassword;
        updateData.resetToken = null;
        updateData.resetTokenExpiry = null;
    }
    return yield prisma_1.prisma.user.update({
        where: { email: email },
        data: updateData,
    });
});
exports.updateUserWithResetToken = updateUserWithResetToken;
