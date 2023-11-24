import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma';
import { generateRandomNumber, generateRandomString } from 'utils/index';

let JWT_SECRET = 'my-secret-key';
if (process.env.JWT_SECRET) {
  JWT_SECRET = process.env.JWT_SECRET;
}

describe('TA Application API', () => {
  let token: string;
  let courseId: number;
  let studentId: number;
  let taJobId: number;
  beforeAll(async() => {
    // Create associated test resources
    const user = await prisma.user.create({
      data: {
        smuNo: generateRandomNumber()
        , username: generateRandomString()
        , email: generateRandomString()
        , firstName: generateRandomString()
        , lastName: generateRandomString()
        , password: generateRandomString()
      }
  
    });
      
    const userId = user.id; 
    token = jwt.sign({ userId }, JWT_SECRET);
      
    const course = await prisma.course.create({
      data: {
        title: 'Test Course'
        , description: 'Test Course Description'
        , courseCode: generateRandomString()
      }
    });
    courseId = course.id;
      
    const student = await prisma.student.create({
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
      
    const faculty = await prisma.faculty.create({
      data: {
        designation: generateRandomString(),
        department: generateRandomString(),
        user: {
          connect: {
            id: user.id
          }
        },
      }
    });
      
    const taJob = await prisma.tAJob.create({
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
    taJobId  = taJob.id;
      
  });
  describe('POST /', () => {
    it('should successfully upload a file and save application data', async () => {
      const applicationData = {
        'courseId': courseId
        , 'studentId': studentId
        , 'hoursCanWorkPerWeek': 'Above 10 hours'
        , 'coursesTaken': 'CS101,CS102'
        , 'gpa': 3.5
        , 'requiredCourses': 'CS201,CS202'
        , 'requiredSkills': 'JavaScript,TypeScript'
        , 'taJobId': taJobId
      };
      const response = await request(app)
        .post('/ta-application/')
        .set('Authorization', `Bearer ${token}`)
        .field('data', JSON.stringify(applicationData))
        .attach('resumeFile', 'src/__test__/testFile.pdf');
        
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return an error when no file is uploaded', async () => {
      const applicationData = {
        'courseId': courseId
        , 'studentId': studentId
        , 'hoursCanWorkPerWeek': 'Above 10 hours'
        , 'coursesTaken': 'CS101,CS102'
        , 'gpa': 3.5
        , 'requiredCourses': 'CS201,CS202'
        , 'requiredSkills': 'JavaScript,TypeScript'
        , 'taJobId': taJobId
      };
      const response = await request(app)
        .post('/ta-application/')
        .set('Authorization', `Bearer ${token}`)
        .field('data', JSON.stringify(applicationData));
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual(expect.objectContaining({
        message: 'No file uploaded'
      }));
    }); 
  });


      // Get a list of TA applications of a course
  describe('GET /', () => {
    it('should get a list of TA applications', async () => {
      const response = await request(app)
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
    });
  });

  // In this test case, we assume set the filter of student name to John 
  // and there is no applications related to John so no result will be shown
  describe('GET /:id', () => {
    it('should return a 404 status for a non-existing TA application', async () => {
      const name = generateRandomString(); 
      // const nonExistingId = 'non-existing-id'; // Replace with an actual non-existing ID
      const response = await request(app)
        .get(`/ta-application/${name}`)
        // .get(`/ta-application/${nonExistingId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      // expect(response.body.error).toBe("Application not found");
      // expect(response.body.error).toMatch("/application not found/i");
      // expect(response.body).toEqual("Application not found");
      expect(response.body).toEqual(expect.objectContaining({
        message: 'Application not found'
      }));
    });
  });
});
