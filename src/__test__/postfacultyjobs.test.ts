import request from 'supertest';
import app from '../app'; // Import your Express app

import * as JobService from '../modules/job/job.service';

 
describe('POST /faculty-jobs', () => {
  it('should post a job', async () => {
    // Get the current date
    const today = new Date();
 
    // Add 1 day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
 
    const jobData = {
      id: 0,
      title: 'Best Job Ever!',
      courseId: 0,
      courseSchedule: 'this is a schedule',
      totalHoursPerWeek: 10,
      maxNumberOfTAs: 10,
      requiredCourses: 'Pascal',
      requiredSkills: 'basic literacy',
      TAStats: 'here are some statistics',
      notes: 'here are some notes',
      deadlineToApply: tomorrow,
      facultyId: 0
    };
 
 
    jest.spyOn(JobService, 'createJob').mockResolvedValue(jobData);
 
    const response = await request(app).post('/faculty-jobs').send(jobData);
    expect(response.status).toBe(201);
    expect(response.text).toBe('{"id":0}');
  });
 
});
