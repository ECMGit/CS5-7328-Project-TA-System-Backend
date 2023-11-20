import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma';
import { generateRandomNumber, generateRandomString } from 'utils/index';

const JWT_SECRET = 'my-secret-key';

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
});