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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../prisma");
const index_1 = require("utils/index");
let JWT_SECRET = 'my-secret-key';
if (process.env.JWT_SECRET) {
    JWT_SECRET = process.env.JWT_SECRET;
}
describe('TA Application API', () => {
    let token;
    let courseId;
    let studentId;
    let taJobId;
    let applicationId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create associated test resources
        const user = yield prisma_1.prisma.user.create({
            data: {
                smuNo: (0, index_1.generateRandomNumber)(),
                username: (0, index_1.generateRandomString)(),
                email: (0, index_1.generateRandomString)(),
                firstName: (0, index_1.generateRandomString)(),
                lastName: (0, index_1.generateRandomString)(),
                password: (0, index_1.generateRandomString)()
            }
        });
        const userId = user.id;
        token = jsonwebtoken_1.default.sign({ userId }, JWT_SECRET);
        const course = yield prisma_1.prisma.course.create({
            data: {
                title: 'Test Course',
                description: 'Test Course Description',
                courseCode: (0, index_1.generateRandomString)()
            }
        });
        courseId = course.id;
        const student = yield prisma_1.prisma.student.create({
            data: {
                year: 2020,
                user: {
                    connect: {
                        id: user.id
                    }
                },
            }
        });
        studentId = student.userId;
        const faculty = yield prisma_1.prisma.faculty.create({
            data: {
                designation: (0, index_1.generateRandomString)(),
                department: (0, index_1.generateRandomString)(),
                user: {
                    connect: {
                        id: user.id
                    }
                },
            }
        });
        const taJob = yield prisma_1.prisma.tAJob.create({
            data: {
                title: 'Test Job Title',
                requiredCourses: 'Test Required Courses',
                requiredSkills: 'Test Required Skills',
                deadlineToApply: '2023-01-01T09:00:00.000Z',
                TAStats: 'Test TA Stats',
                course: {
                    connect: {
                        id: course.id
                    }
                },
                courseSchedule: '2020-01-01 00:00:00',
                totalHoursPerWeek: 10,
                maxNumberOfTAs: 2,
                faculty: {
                    connect: {
                        userId: faculty.userId
                    }
                },
            }
        });
        taJobId = taJob.id;
        /* TA Application */
        const taApplication = yield prisma_1.prisma.tAApplication.create({
            data: {
                courseId: courseId,
                studentId: studentId,
                hoursCanWorkPerWeek: 'Above 10 hours',
                coursesTaken: 'CS101,CS102',
                GPA: 3.5,
                requiredCourses: 'CS201,CS202',
                requiredSkills: 'JavaScript,TypeScript',
                resumeFile: 'src/__test__/testFile.pdf',
                taJobId: taJobId,
            }
        });
        applicationId = taApplication.id;
    }));
    describe('POST /', () => {
        it('should successfully upload a file and save application data', () => __awaiter(void 0, void 0, void 0, function* () {
            const applicationData = {
                'courseId': courseId,
                'studentId': studentId,
                'hoursCanWorkPerWeek': 'Above 10 hours',
                'coursesTaken': 'CS101,CS102',
                'gpa': 3.5,
                'requiredCourses': 'CS201,CS202',
                'requiredSkills': 'JavaScript,TypeScript',
                'taJobId': taJobId
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/ta-application/')
                .set('Authorization', `Bearer ${token}`)
                .field('data', JSON.stringify(applicationData))
                .attach('resumeFile', 'src/__test__/testFile.pdf');
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('id');
        }));
        it('should return an error when no file is uploaded', () => __awaiter(void 0, void 0, void 0, function* () {
            const applicationData = {
                'courseId': courseId,
                'studentId': studentId,
                'hoursCanWorkPerWeek': 'Above 10 hours',
                'coursesTaken': 'CS101,CS102',
                'gpa': 3.5,
                'requiredCourses': 'CS201,CS202',
                'requiredSkills': 'JavaScript,TypeScript',
                'taJobId': taJobId
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/ta-application/')
                .set('Authorization', `Bearer ${token}`)
                .field('data', JSON.stringify(applicationData));
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(expect.objectContaining({
                message: 'No file uploaded'
            }));
        }));
    });
    describe('GET /', () => {
        it('should get a list of TA applications', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/ta-application/')
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            // Assuming the response body is an array
            expect(response.body).toBeInstanceOf(Array);
            // Assuming each element in the array has the 'id' property
            if (response.body.length > 0) {
                const firstApplication = response.body[0];
                expect(firstApplication).toHaveProperty('id');
                expect(firstApplication).toHaveProperty('courseId');
                expect(firstApplication).toHaveProperty('studentId');
            }
        }));
        it('should return a 401 error for unauthenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/ta-application/')
                .set('Authorization', 'Bearer invalidtoken');
            expect(response.statusCode).toBe(401);
        }));
    });
    describe('GET /:id', () => {
        it('should return a TA application', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/ta-application/${applicationId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('courseId');
            expect(response.body).toHaveProperty('studentId');
        }));
        it('should return a 404 status for a non-existing TA application', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistingId = 'non-existing-id';
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/ta-application/${nonExistingId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual(expect.objectContaining({
                message: 'Application not found'
            }));
        }));
    });
    describe('POST /ta-application/:id', () => {
        it('should successfully update a TA application', () => __awaiter(void 0, void 0, void 0, function* () {
            const updateData = {
                GPA: 3.7
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post(`/ta-application/${applicationId}`)
                .send(updateData)
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject(updateData);
        }));
        it('should return error when invalid applicationId was given', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidId = 9999999;
            const updateData = {
                GPA: 3.7
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post(`/ta-application/${invalidId}`)
                .send(updateData)
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).not.toBe(200);
        }));
    });
    describe('POST /ta-application/student/:studentId', () => {
        it('should successfully return all the applications that applied by this student', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/ta-application/student/${studentId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    studentId: studentId
                })
            ]));
        }));
        it('should return empty when invalid studentId was given', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidId = 9999999;
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/ta-application/student/${invalidId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(0);
        }));
    });
});
