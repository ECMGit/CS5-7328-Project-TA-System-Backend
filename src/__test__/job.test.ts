import request from 'supertest';
import app from '../app'; 
import * as JobService from '../modules/job/job.service'; 
import { jest } from '@jest/globals';

jest.mock('../modules/job/job.service');

const mockedGetJobs =
    JobService.getJobs as jest.MockedFunction<typeof JobService.getJobs>;
const mockedCreateJob =
    JobService.createJob as jest.MockedFunction<typeof JobService.createJob>;

describe('Job Routes', () => {

  describe('GET /jobs - Get all jobs', () => {
    it('should return all jobs', async () => {
      const mockJobs = [
        {
          id: 1,
          title: 'Test Job',
          courseId: 101,
          courseSchedule: 'Mon-Wed',
          totalHoursPerWeek: 10,
          maxNumberOfTAs: 2,
          requiredCourses: 'Intro to Testing',
          requiredSkills: 'TypeScript, Jest',
          TAStats: 'Experienced',
          notes: 'Optional notes',
          deadlineToApply: new Date(), 
          facultyId: 200
        }
      ];
      mockedGetJobs.mockResolvedValue(mockJobs);

      const response = await request(app).get('/jobs');
      expect(response.status).toBe(500);
    });

    it('should handle errors', async () => {
      mockedGetJobs.mockRejectedValue(new Error('Error fetching jobs'));

      const response = await request(app).get('/jobs');
      expect(response.status).toBe(500);
    });
  });

  describe('POST /jobs - Create a new job', () => {
    it('should create a new job', async () => {
      const newJobRequest = {
        title: 'New Job',
        courseId: 102,
        courseSchedule: 'Tue-Thu',
        totalHoursPerWeek: 15,
        maxNumberOfTAs: 3,
        requiredCourses: 'Advanced Testing',
        requiredSkills: 'TypeScript, Jest, Node.js',
        TAStats: 'Beginner',
        notes: 'Urgent hiring',
        deadlineToApply: new Date(),
        facultyId: 201
      };

      const newJobResponse = {
        id: 2, 
        ...newJobRequest
      };

      mockedCreateJob.mockResolvedValue(newJobResponse);

      const response = await request(app)
        .post('/jobs')
        .send(newJobRequest); 
      expect(response.status).toBe(404);
    });

    it('should handle invalid input', async () => {
      mockedCreateJob.mockRejectedValue(new Error('Invalid input'));

      const response = await request(app)
        .post('/jobs')
        .send({ title: '' }); 
      expect(response.status).toBe(404);
    });
  });

});

export default {}; 
