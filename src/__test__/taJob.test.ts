import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma';
import { generateRandomNumber, generateRandomString } from 'utils/index';

let JWT_SECRET = 'my-secret-key';
if (process.env.JWT_SECRET) {
  JWT_SECRET = process.env.JWT_SECRET;
}

describe('TA Job API', () => {
  let token: string;
  let facultyId: number;
  let taJobId: number;
  beforeAll(async () => {
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
      
    const faculty = await prisma.faculty.create({
      data: {
        designation: generateRandomString()
        , department: generateRandomString()
        , user: {
          connect: {
            id: userId
          }
        }
      }
    });
    facultyId = faculty.userId;
      
      
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
    taJobId = taJob.id;
    
  });

  describe('GET /faculty/:id', () => { 
    it('should return a list of TA jobs that the faculty posted', async () => { 
      const response = await request(app)
        .get(`/jobs/faculty/${facultyId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
          facultyId: facultyId
        })
      ]));
    });
      
    it('should return empty when invalid facultyId was given', async () => {
      const invalidId: number = 9999999;
      const response = await request(app)
        .get(`/jobs/faculty/${invalidId}`)
        .set('Authorization', `Bearer ${token}`);
        
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });
});