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
const UserService = __importStar(require("../modules/tajobs/tajob.service")); // Import the TA job service
const taApplicationService = __importStar(require("../modules/taApplication/taApplication.service"));
// Remove the verifyToken function in the routes when running these test cases
// The test cases work only when the tokens are not a part of the equation
describe('TA Job Service Tests', () => {
    // Create mockup job positions to test against
    const mockTAJobs = [
        {
            id: 1,
            title: 'Teaching Assistant for Computer Science',
            courseId: 101,
            course: {
                id: 101,
                name: 'Introduction to Computer Science',
            },
            courseSchedule: 'Mondays and Wednesdays, 10-12 AM',
            totalHoursPerWeek: 10,
            maxNumberOfTAs: 3,
            requiredCourses: 'CS101, CS102',
            requiredSkills: 'Programming in Python, Basic Algorithms',
            TAStats: 'Undergraduate',
            notes: 'Prior teaching experience preferred',
            deadlineToApply: new Date('2023-12-31').toISOString(),
            facultyId: 10,
            faculty: {
                userId: 10,
                name: 'Dr. Smith',
            },
            applications: [],
        },
        {
            id: 2,
            title: 'Teaching Assistant for Computers',
            courseId: 103,
            course: {
                id: 104,
                name: 'Introduction to Computers',
            },
            courseSchedule: 'Tuesdays, 10-12 AM',
            totalHoursPerWeek: 5,
            maxNumberOfTAs: 2,
            requiredCourses: 'CS103',
            requiredSkills: 'Programming in Java',
            TAStats: 'Graduate',
            notes: 'experience preferred',
            deadlineToApply: new Date('2023-12-31').toISOString(),
            facultyId: 10,
            faculty: {
                userId: 10,
                name: 'Dr. Smith',
            },
            applications: [],
        },
    ];
    // show faculty jobs
    // jobs/faculty/:id
    // Test for getTAJobById endpoint
    describe('GET /jobs/:id', () => {
        // Test a success of the system
        it('should return a TA job by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockGetTAJobById = jest.fn().mockResolvedValue({
            /* mocked TA job data */
            });
            jest
                .spyOn(UserService, 'getTAJobById')
                .mockImplementation(mockGetTAJobById);
            const response = yield (0, supertest_1.default)(app_1.default).get('/jobs/1'); // Assuming 1 is the job ID
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
            /* expected TA job data */
            });
        }));
        // Test a failure of the system
        it('should return 404 if TA job not found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(UserService, 'getTAJobById').mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.default).get('/jobs/999'); // Assuming 999 is a non-existent job ID
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'TA job not found' });
        }));
    });
    // Test for getTAJobsByFacultyId endpoint
    describe('GET /jobs/faculty/:facultyId', () => {
        it('should return all TA jobs by faculty id', () => __awaiter(void 0, void 0, void 0, function* () {
            // const mockCreateUser = jest.fn().mockResolvedValue(mockUser);
            // const mockCreateFaculty = jest.fn().mockResolvedValue(mockFaculty);
            // jest.spyOn(UserService1, 'createUser').mockImplementation(mockCreateUser);
            // jest.spyOn(UserService1, 'createFaculty').mockImplementation(mockCreateFaculty);
            const mockGetTAJobsByFacultyId = jest.fn().mockResolvedValue(mockTAJobs);
            jest
                .spyOn(UserService, 'getTAJobsByFacultyId')
                .mockImplementation(mockGetTAJobsByFacultyId);
            const response = yield (0, supertest_1.default)(app_1.default).get('/jobs/faculty/10'); // Assuming faculty ID is 10
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTAJobs);
            console.log(response.body);
        }));
        it('should return 404 if user of faculty id is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(UserService, 'getTAJobsByFacultyId').mockResolvedValue([]);
            const response = yield (0, supertest_1.default)(app_1.default).get('/jobs/faculty/999'); // Assuming 999 is a non-existent faculty ID
            expect(response.status).toBe(404);
            expect(response.body.message).toEqual('No TA jobs found');
        }));
    });
});
// get applications
// get applications id
describe('TA Application Route Handlers', () => {
    // Mock data for TA applications
    const mockTaApplications = [
        {
            id: 1,
            courseId: 101,
            course: {
                id: 101,
                name: 'Introduction to Computer Science',
                // Add other Course model fields if necessary
            },
            studentId: 1001,
            student: {
                userId: 1001,
                name: 'John Doe',
                // Add other Student model fields if necessary
            },
            hoursCanWorkPerWeek: '10',
            coursesTaken: 'CS101, CS102',
            status: 'Pending',
            GPA: 3.5,
            requiredCourses: 'CS101, CS102',
            requiredSkills: 'Programming in Python, Basic Algorithms',
            resumeFile: 'path/to/resume1.pdf',
            taJobId: 1,
            taJob: {
                id: 1,
                title: 'Teaching Assistant for Computer Science',
                // Add other TAJob model fields if necessary
            },
            messages: [
            // Add UserMessage model mock data if necessary
            ],
        },
        {
            id: 2,
            courseId: 103,
            course: {
                id: 103,
                name: 'Advanced Programming',
                // Add other Course model fields if necessary
            },
            studentId: 1002,
            student: {
                userId: 1002,
                name: 'Alice Smith',
                // Add other Student model fields if necessary
            },
            hoursCanWorkPerWeek: '15',
            coursesTaken: 'CS103, CS104',
            status: 'Approved',
            GPA: 3.8,
            requiredCourses: 'CS103, CS104',
            requiredSkills: 'Web Development, Database Management',
            resumeFile: 'path/to/resume2.pdf',
            taJobId: 2,
            taJob: {
                id: 2,
                title: 'Teaching Assistant for Databases',
                // Add other TAJob model fields if necessary
            },
            messages: [
            // Add UserMessage model mock data if necessary
            ],
        },
        // More mock applications can be added as needed
    ];
    const mockTaApplication = mockTaApplications[0];
    // Test for get a ta app by id
    describe('GET /ta-application/:id', () => {
        // Test a success of the system
        it('should return a TA applications by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockGetApplication = jest.fn().mockResolvedValue({
                mockTaApplication
            });
            jest
                .spyOn(taApplicationService, 'getApplication')
                .mockImplementation(mockGetApplication);
            const response = yield (0, supertest_1.default)(app_1.default).get('/ta-application/1'); // Assuming 1 is the job ID
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                mockTaApplication
            });
        }));
        // Test a failure of the system
        it('should return 404 if application not found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(taApplicationService, 'getApplication').mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.default).get('/ta-application/999'); // Assuming 999 is a non-existent job ID
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Application not found' });
        }));
    });
    // Test for get all ta apps
    describe('GET /ta-application', () => {
        it('should return all TA applications', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockGetTaApplications = jest
                .fn()
                .mockResolvedValue(mockTaApplications);
            jest
                .spyOn(taApplicationService, 'getTaApplications')
                .mockImplementation(mockGetTaApplications);
            const response = yield (0, supertest_1.default)(app_1.default).get('/ta-application/');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTaApplications);
            console.log(response.body);
        }));
        it('should return 404 if no applications are found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            jest.spyOn(taApplicationService, 'getTaApplications').mockResolvedValue([]);
            const response = yield (0, supertest_1.default)(app_1.default).get('/ta-application/');
            expect(response.status).toBe(404);
            expect(response.body.message).toEqual('Applications not found');
        }));
    });
});
