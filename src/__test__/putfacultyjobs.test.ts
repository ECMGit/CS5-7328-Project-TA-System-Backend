import request from 'supertest';
import app from '../app'; // Import your Express app

import * as JobService from '../modules/job/job.service';

 
describe('PUT /faculty-jobs/edit/:id', () => {
  const id = 0;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  // const isoDate = tomorrow.toISOString().substring(0, 10);

  const jobData = {
    id: id,
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
  
  it('should update a job', async () => {
    jest.spyOn(JobService, 'updateJob').mockResolvedValue(jobData);
    const response = await request(app).put('/faculty-jobs/edit/'+String(id)).send(jobData); 
    expect(response.status).toBe(201);
    expect(JSON.parse(response.text)).toStrictEqual({'id': jobData.id}); //check 
    
  });
});
