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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Import your Express app
const UserService = __importStar(require("../modules/user/user.service"));
const taApplicationService = __importStar(require("../modules/taApplication/taApplication.service"));
// import { User } from '@prisma/client';
// import {faker} from '@faker-js/faker';
// import { jobData } from 'src/modules/job/job.types';
describe('GET /', () => {
    it('should return "Hello, World!"', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello World!');
    }));
});
describe('POST /signUp', () => {
    it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCreateUser = jest.fn().mockResolvedValue({ id: 4, username: 'newuser' });
        jest.spyOn(UserService, 'findUserByUsername').mockResolvedValue(null);
        jest.spyOn(UserService, 'createUser').mockImplementation(mockCreateUser);
        jest.spyOn(UserService, 'createStudent').mockImplementation(mockCreateUser);
        const response = yield (0, supertest_1.default)(app_1.default).post('/user/signUp').send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'password123',
            smuNo: '12345678',
            firstName: 'John',
            lastName: 'Doe',
            userType: 'student',
            year: 2,
            // other required fields
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    }));
    it('should return 409 if username already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockFindUser = jest.fn().mockResolvedValue({ username: 'existinguser' });
        jest.spyOn(UserService, 'findUserByUsername').mockImplementation(mockFindUser);
        const response = yield (0, supertest_1.default)(app_1.default).post('/user/signUp').send({
            username: 'existinguser',
            // other fields...
        });
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({
            error: 'Username already taken'
        });
    }));
});
beforeEach(() => {
    jest.clearAllMocks();
});
describe('POST /ta-application', () => {
    const mockData = {
        courseId: 3,
        studentId: 1,
        taJobId: 3,
        hoursCanWorkPerWeek: "10",
        gpa: 3.8,
        requiredCourses: 'Math 101',
        requiredSkills: 'Python',
        coursesTaken: 'Math 101',
    };
    const mockFile = {
        fieldname: 'mockFieldName',
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        mimetype: 'mockMimeType',
        destination: '/mock/destination',
        filename: 'mockFileName',
        path: '/path/to/mock/file',
        size: 12345,
    };
    it('should create a new application if no existing record is found', () => __awaiter(void 0, void 0, void 0, function* () {
        const existingRecord = null; // Simulating no existing record
        const expectedResult = {
            id: 19,
            courseId: mockData.courseId,
            studentId: mockData.studentId,
            taJobId: mockData.taJobId,
            hoursCanWorkPerWeek: mockData.hoursCanWorkPerWeek,
            GPA: mockData.gpa,
            requiredCourses: mockData.requiredCourses,
            requiredSkills: mockData.requiredSkills,
            resumeFile: mockFile.path,
            coursesTaken: mockData.coursesTaken,
            status: null
        };
        const result = yield taApplicationService.saveApplication(mockData, mockFile);
        expect(result).toEqual(expectedResult); // Check if the result matches the expected result
    }));
    it('should return null if application already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield taApplicationService.saveApplication(mockData, mockFile);
        expect(result).toEqual(null); // Check if the result matches the expected result
    }));
    /**
     * using faker.js
     */
    // describe('POST /user/signup', () => {
    //   it('should create a new user', async () => {
    //     // Generate fake user data
    //     const fakeUser = {
    //       smuNo: faker.number.int(),
    //       username: faker.internet.userName(),
    //       email: faker.internet.email(),
    //       firstName: faker.person.firstName(),
    //       lastName: faker.person.lastName(),
    //       password: faker.internet.password(),
    //     };
    //     const response = await request(app)
    //       .post('/user/signup')
    //       .send(fakeUser);
    //     expect(response.status).toBe(201);
    //     expect(response.body.message).toBe('User created!');
    //     // Additional assertions...
    //     // For instance, check if user is in the database
    //   });
});
