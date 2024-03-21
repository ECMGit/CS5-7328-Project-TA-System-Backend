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
describe('TA Job API', () => {
    let token;
    let facultyId;
    let taJobId;
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
        const faculty = yield prisma_1.prisma.faculty.create({
            data: {
                designation: (0, index_1.generateRandomString)(),
                department: (0, index_1.generateRandomString)(),
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
        facultyId = faculty.userId;
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
    }));
    describe('GET /faculty/:id', () => {
        it('should return a list of TA jobs that the faculty posted', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/jobs/faculty/${facultyId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    facultyId: facultyId
                })
            ]));
        }));
        it('should return empty when invalid facultyId was given', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidId = 9999999;
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/jobs/faculty/${invalidId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(0);
        }));
    });
});
