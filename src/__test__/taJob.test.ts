import request from "supertest";
import app from "../app"; // Import your Express app
import * as UserService from "../modules/tajobs/tajob.service"; // Import the TA job service

// Remove the verifyToken function in the routes when running these test cases
// The test cases work only when the tokens are not a part of the equation

describe("TA Job Service Tests", () => {
  // Create mockup job positions to test against
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
      deadlineToApply: new Date("2023-12-31").toISOString(),
      facultyId: 10,
      faculty: {
        userId: 10,
        name: "Dr. Smith",
      },
      applications: [],
    },
    {
      id: 2,
      title: "Teaching Assistant for Computers",
      courseId: 103,
      course: {
        id: 104,
        name: "Introduction to Computers",
      },
      courseSchedule: "Tuesdays, 10-12 AM",
      totalHoursPerWeek: 5,
      maxNumberOfTAs: 2,
      requiredCourses: "CS103",
      requiredSkills: "Programming in Java",
      TAStats: "Graduate",
      notes: "experience preferred",
      deadlineToApply: new Date("2023-12-31").toISOString(),
      facultyId: 10,
      faculty: {
        userId: 10,
        name: "Dr. Smith",
      },
      applications: [],
    },
  ];

  // Test for getAllTAJobs endpoint
  describe("GET /jobs", () => {
    it("should return all TA jobs", async () => {
      //create a mock fucnion. Used ti specify what this mock function should return when it is called.
      const mockGetAllTAJobs = jest.fn().mockResolvedValue(mockTAJobs);
      jest
        .spyOn(UserService, "getAllTAJobs")
        .mockImplementation(mockGetAllTAJobs);

      const response = await request(app).get("/jobs");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTAJobs);
    });

    it("should return 404 if no TA jobs are found", async () => {
      jest.spyOn(UserService, "getAllTAJobs").mockResolvedValue([]);

      const response = await request(app).get("/jobs");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "No job listings found." });
    });
  });

  // Test for getTAJobById endpoint
  describe("GET /jobs/:id", () => {
    // Test a success of the system
    it("should return a TA job by id", async () => {
      const mockGetTAJobById = jest.fn().mockResolvedValue({
        /* mocked TA job data */
      });
      jest
        .spyOn(UserService, "getTAJobById")
        .mockImplementation(mockGetTAJobById);

      const response = await request(app).get("/jobs/1"); // Assuming 1 is the job ID
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        /* expected TA job data */
      });
    });

    // Test a failure of the system
    it("should return 404 if TA job not found", async () => {
      jest.spyOn(UserService, "getTAJobById").mockResolvedValue(null);

      const response = await request(app).get("/jobs/999"); // Assuming 999 is a non-existent job ID
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "TA job not found" });
    });
  });

  // Test for getTAJobsByFacultyId endpoint
  describe("GET /jobs/faculty/:facultyId", () => {
    it("should return all TA jobs by faculty id", async () => {
      // const mockCreateUser = jest.fn().mockResolvedValue(mockUser);
      // const mockCreateFaculty = jest.fn().mockResolvedValue(mockFaculty);
      // jest.spyOn(UserService1, 'createUser').mockImplementation(mockCreateUser);
      // jest.spyOn(UserService1, 'createFaculty').mockImplementation(mockCreateFaculty);
      const mockGetTAJobsByFacultyId = jest.fn().mockResolvedValue(mockTAJobs);
      jest
        .spyOn(UserService, "getTAJobsByFacultyId")
        .mockImplementation(mockGetTAJobsByFacultyId);

      const response = await request(app).get("/jobs/faculty/10"); // Assuming faculty ID is 10
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTAJobs);
      console.log(response.body);
    });

    it("should return 404 if user of faculty id is not found", async () => {
      jest.spyOn(UserService, "getTAJobsByFacultyId").mockResolvedValue([]);

      const response = await request(app).get("/jobs/faculty/999"); // Assuming 999 is a non-existent faculty ID
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("No TA jobs found");
    });
  });
  
  describe('GET /jobs/filter', () => {

    // Test the filtering system
    it('should return filtered TA jobs', async () => {
      const mockFilter = { courseId: 1 };
      const mockFilteredTAJobs = [
        {
          id: 1,
          title: "Assistant for CS101",
          courseId: 1,
          courseSchedule: "Mon, Wed, Fri",
          totalHoursPerWeek: 20,
          maxNumberOfTAs: 3,
          requiredCourses: "CS100,CS101",
          requiredSkills: "Programming, Tutoring",
          TAStats: "Undergrad",
          notes: "Prior experience preferred.",
          deadlineToApply: new Date("2023-11-30"),
          facultyId: 1,
          course: {
            id: 1,
            courseCode: "CS101",
            title: "Introduction to Computer Science",
            description: null
          },
          faculty: {
            userId: 1,
            user: {
              id: 1,
              smuNo: 123456,
              username: "professor1",
              email: "professor1@example.com",
              firstName: "John",
              lastName: "Doe",
              password: "encryptedPassword",
              resetToken: null,
              resetTokenExpiry: null,
              updatedAt: null,
            },
            designation: "Professor",
            department: "Computer Science",
          },
        },
      ];

      // the system changes the deadline object from a date to a string, so its necessary
      const mockReturnedTAJobs = [
        {
          id: 1,
          title: "Assistant for CS101",
          courseId: 1,
          courseSchedule: "Mon, Wed, Fri",
          totalHoursPerWeek: 20,
          maxNumberOfTAs: 3,
          requiredCourses: "CS100,CS101",
          requiredSkills: "Programming, Tutoring",
          TAStats: "Undergrad",
          notes: "Prior experience preferred.",
          deadlineToApply: "2023-11-30T00:00:00.000Z",
          facultyId: 1,
          course: {
            id: 1,
            courseCode: "CS101",
            title: "Introduction to Computer Science",
            description: null
          },
          faculty: {
            userId: 1,
            user: {
              id: 1,
              smuNo: 123456,
              username: "professor1",
              email: "professor1@example.com",
              firstName: "John",
              lastName: "Doe",
              password: "encryptedPassword",
              resetToken: null,
              resetTokenExpiry: null,
              updatedAt: null,
            },
            designation: "Professor",
            department: "Computer Science",
          },
        },
      ];
  
      jest.spyOn(UserService, 'getTAJobsWithFilters').mockResolvedValue(mockFilteredTAJobs);
  
      const response = await request(app).get('/jobs/query').query(mockFilter);
  
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockReturnedTAJobs);
    });

    // Test for getTAJobById endpoint
    describe('GET /jobs/:id', () => {
        it('should return a TA job by id', async () => {
            const mockGetTAJobById = jest.fn().mockResolvedValue(mockTAJobs);
            jest.spyOn(UserService, 'getTAJobById').mockImplementation(mockGetTAJobById);

            const response = await request(app).get('/jobs/1'); // Assuming 1 is the job ID
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTAJobs);
        });

        it('should return 404 if TA job not found', async () => {
            jest.spyOn(UserService, 'getTAJobById').mockResolvedValue(null);

            const response = await request(app).get('/jobs/999'); // Assuming 999 is a non-existent job ID
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'TA job not found' });
        });
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
            jest.spyOn(UserService, 'getTAJobsByFacultyId').mockImplementation(mockGetTAJobsByFacultyId);

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


    // Second test for getTAJobsByFacultyId endpoint
    describe('GET /jobs/faculty/:facultyId', () => {
        it('should return all TA jobs by faculty id', async () => {
            // const mockCreateUser = jest.fn().mockResolvedValue(mockUser);
            // const mockCreateFaculty = jest.fn().mockResolvedValue(mockFaculty);
            // jest.spyOn(UserService1, 'createUser').mockImplementation(mockCreateUser);
            // jest.spyOn(UserService1, 'createFaculty').mockImplementation(mockCreateFaculty);
            const mockGetTAJobsByFacultyId = jest.fn().mockResolvedValue(mockTAJobs);
            jest.spyOn(UserService, 'getTAJobsByFacultyId').mockImplementation(mockGetTAJobsByFacultyId);

            const response = await request(app).get('/jobs/faculty/12'); // Assuming faculty ID is 10
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTAJobs);
            console.log(response.body);
        });

        it('should return 404 if user of faculty id is not found', async () => {
            jest.spyOn(UserService, 'getTAJobsByFacultyId').mockResolvedValue([]);

            const response = await request(app).get('/jobs/faculty/998'); // Assuming 999 is a non-existent faculty ID
            expect(response.status).toBe(404);
            expect(response.body.message).toEqual('No TA jobs found');
        });
    });

});
