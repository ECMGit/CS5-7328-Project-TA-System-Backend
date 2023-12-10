import request from 'supertest';
import app from '../app'; // Import your Express app
import * as UserService from '../modules/tajobs/tajob.service'; // Import the TA job service
import * as taApplicationService from '../modules/taApplication/taApplication.service';

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
    it('should return a TA job by id', async () => {
      const mockGetTAJobById = jest.fn().mockResolvedValue({
        /* mocked TA job data */
      });
      jest
        .spyOn(UserService, 'getTAJobById')
        .mockImplementation(mockGetTAJobById);

      const response = await request(app).get('/jobs/1'); // Assuming 1 is the job ID
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        /* expected TA job data */
      });
    });

    // Test a failure of the system
    it('should return 404 if TA job not found', async () => {
      jest.spyOn(UserService, 'getTAJobById').mockResolvedValue(null);

      const response = await request(app).get('/jobs/999'); // Assuming 999 is a non-existent job ID
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'TA job not found' });
    });
  });

  // Test for getTAJobsByFacultyId endpoint
  describe('GET /jobs/faculty/:facultyId', () => {
    it('should return all TA jobs by faculty id', async () => {
      // const mockCreateUser = jest.fn().mockResolvedValue(mockUser);
      // const mockCreateFaculty = jest.fn().mockResolvedValue(mockFaculty);
      // jest.spyOn(UserService1, 'createUser').mockImplementation(mockCreateUser);
      // jest.spyOn(UserService1, 'createFaculty').mockImplementation(mockCreateFaculty);
      const mockGetTAJobsByFacultyId = jest.fn().mockResolvedValue(mockTAJobs);
      jest
        .spyOn(UserService, 'getTAJobsByFacultyId')
        .mockImplementation(mockGetTAJobsByFacultyId);

      const response = await request(app).get('/jobs/faculty/10'); // Assuming faculty ID is 10
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTAJobs);
      console.log(response.body);
    });

    it('should return 404 if user of faculty id is not found', async () => {
      jest.spyOn(UserService, 'getTAJobsByFacultyId').mockResolvedValue([]);

      const response = await request(app).get('/jobs/faculty/999'); // Assuming 999 is a non-existent faculty ID
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('No TA jobs found');
    });
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
    it('should return a TA applications by id', async () => {
      const mockGetApplication = jest.fn().mockResolvedValue({
        mockTaApplication
      });
      jest
        .spyOn(taApplicationService, 'getApplication')
        .mockImplementation(mockGetApplication);

      const response = await request(app).get('/ta-application/1'); // Assuming 1 is the job ID
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        mockTaApplication
      });
    });

    // Test a failure of the system
    it('should return 404 if application not found', async () => {
      jest.spyOn(taApplicationService, 'getApplication').mockResolvedValue(null);

      const response = await request(app).get('/ta-application/999'); // Assuming 999 is a non-existent job ID
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Application not found' });
    });
  });

  // Test for get all ta apps
  describe('GET /ta-application', () => {
    it('should return all TA applications', async () => {
      const mockGetTaApplications = jest
        .fn()
        .mockResolvedValue(mockTaApplications);
      jest
        .spyOn(taApplicationService, 'getTaApplications')
        .mockImplementation(mockGetTaApplications);

      const response = await request(app).get('/ta-application/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTaApplications);
      console.log(response.body);
    });

    it('should return 404 if no applications are found', async () => {
      jest.clearAllMocks();
      jest.spyOn(taApplicationService, 'getTaApplications').mockResolvedValue([]);

      const response = await request(app).get('/ta-application/');
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Applications not found');
    });
  });
});
