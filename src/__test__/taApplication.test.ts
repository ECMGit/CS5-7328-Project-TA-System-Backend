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
  let applicationId: number;
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

    /* TA Application */
    const taApplication = await prisma.tAApplication.create({
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
      
    it('should return a 401 error for unauthenticated user', async () => {
      const response = await request(app)
        .get('/ta-application/')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /:id', () => {
    it('should return a TA application', async () => {
      const response = await request(app)
        .get(`/ta-application/${applicationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('courseId');
      expect(response.body).toHaveProperty('studentId');
    });
      
    it('should return a 404 status for a non-existing TA application', async () => {
      const nonExistingId = 'non-existing-id';
      const response = await request(app)
        .get(`/ta-application/${nonExistingId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual(expect.objectContaining({
        message: 'Application not found'
      }));
    });
  });

  describe('POST /ta-application/:id', () => {
    it('should successfully update a TA application', async () => {
      const updateData = {  
        GPA: 3.7
      };
      const response = await request(app)
        .post(`/ta-application/${applicationId}`)
        .send(updateData)
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(updateData);
    });
      
    it('should return error when invalid applicationId was given', async () => {
      const invalidId: number = 9999999;
      const updateData = {  
        GPA: 3.7
      };
      const response = await request(app)
        .post(`/ta-application/${invalidId}`)
        .send(updateData)
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.statusCode).not.toBe(200);
    });
  });
});
