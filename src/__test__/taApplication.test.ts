import request from 'supertest';
import app from '../app'; // Import your Express app
import * as UserService from '../modules/tajobs/tajob.service'; // Import the TA job service

//still have some errors need to find

describe('TA Job Service Tests', () => {
    const mockTAJobs = [
        {
            id: 1,
            title: "Teaching Assistant for Computer Science",
            courseId: 101,
            course: {
                id: 101,
                name: "Introduction to Computer Science",
            },
            courseSchedule: "Mondays and Wednesdays, 10-12 AM",
            totalHoursPerWeek: 10,
            maxNumberOfTAs: 3,
            requiredCourses: "CS101, CS102",
            requiredSkills: "Programming in Python, Basic Algorithms",
            TAStats: "Undergraduate",
            notes: "Prior teaching experience preferred",
            deadlineToApply: new Date('2023-12-31').toISOString(),
            facultyId: 10,
            faculty: {
                userId: 10,
                name: "Dr. Smith",
            },
            applications: [
            ]
        },
    ];

    // Test for getAllTAJobs endpoint
    describe('GET /jobs', () => {
        it('should return all TA jobs', async () => {
            //create a mock fucnion. Used ti specify what this mock function should return when it is called.
            const mockGetAllTAJobs = jest.fn().mockResolvedValue(mockTAJobs);
            jest.spyOn(UserService, 'getAllTAJobs').mockImplementation(mockGetAllTAJobs);

            const response = await request(app).get('/jobs');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTAJobs);
        });

        it('should return 404 if no TA jobs are found', async () => {
            jest.spyOn(UserService, 'getAllTAJobs').mockResolvedValue([]);

            const response = await request(app).get('/jobs');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'No job listings found.' });
        });
    });

    // Test for getTAJobById endpoint
    describe('GET /jobs/:id', () => {
        it('should return a TA job by id', async () => {
            const mockGetTAJobById = jest.fn().mockResolvedValue({/* mocked TA job data */ });
            jest.spyOn(UserService, 'getTAJobById').mockImplementation(mockGetTAJobById);

            const response = await request(app).get('/jobs/1'); // Assuming 1 is the job ID
            expect(response.status).toBe(200);
            expect(response.body).toEqual({/* expected TA job data */ });
        });

        it('should return 404 if TA job not found', async () => {
            jest.spyOn(UserService, 'getTAJobById').mockResolvedValue(null);

            const response = await request(app).get('/jobs/999'); // Assuming 999 is a non-existent job ID
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'TA job not found' });
        });
    });


    // Test for getTAJobByFacultyID endpoint
    describe('GET /jobs/:facultyId', () => {
        it('should return TA jobs by faculty id', async () => {
            const mockGetTAJobByFacultyId = jest.fn().mockResolvedValue({
                //mocked TA job data
            });

            const response = await request(app).get('/jobs/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                //expected TA job data
            })
        });

        it('should return 404 if Faculty not found', async () => {
            jest.spyOn(UserService, 'getTAJobsByFacultyId').mockResolvedValue(null);

            const response = await request(app).get('/jobs/999');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Faculty not found' });
        });
    });

});

