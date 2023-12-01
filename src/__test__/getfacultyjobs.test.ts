import request from 'supertest';
import app from '../app'; // Import your Express app

import * as JobService from '../modules/job/job.service';

describe('GET /faculty-jobs', () => {
  it('should return all jobs', async () => {
    // const mockJob = jest.fn().mockResolvedValue();
    const mockJobApplications = [
      {
        id: 101,
        title: 'Computer Science 101 TA',
        courseId: 3456,
        courseSchedule: 'MWF 10:00-11:00 AM',
        totalHoursPerWeek: 15,
        maxNumberOfTAs: 3,
        requiredCourses: 'Introduction to Programming, Data Structures',
        requiredSkills: 'Java, Teaching, Communication',
        TAStats: 'Average student rating: 4.5/5',
        notes: 'Preference for upperclassmen',
        deadlineToApply: new Date('2023-12-15'),
        facultyId: 202,
      },
      {
        id: 102,
        title: 'Algorithms TA',
        courseId: 7890,
        courseSchedule: 'TuTh 2:00-3:30 PM',
        totalHoursPerWeek: 10,
        maxNumberOfTAs: 2,
        requiredCourses: 'Data Structures, Algorithms',
        requiredSkills: 'C++, Problem Solving, Peer Review',
        TAStats: 'Average assignment grade: 90%',
        notes: null,
        deadlineToApply: new Date('2023-11-30'),
        facultyId: 205,
      }
    ];
    
    jest.spyOn(JobService, 'getJobs').mockResolvedValue(mockJobApplications);
    const response = await request(app).get('/faculty-jobs');
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual(
      mockJobApplications.map(job => ({
        ...job,
        deadlineToApply: job.deadlineToApply.toISOString()
      }))
    );
  });
});
 
describe('GET /faculty-jobs/:id', () => {
  it('should return one job', async () => {
 
    const mockJob = {
      id: 101,
      title: 'Computer Science 101 TA',
      courseId: 3456,
      courseSchedule: 'MWF 10:00-11:00 AM',
      totalHoursPerWeek: 15,
      maxNumberOfTAs: 3,
      requiredCourses: 'Introduction to Programming, Data Structures',
      requiredSkills: 'Java, Teaching, Communication',
      TAStats: 'Average student rating: 4.5/5',
      notes: 'Preference for upperclassmen',
      deadlineToApply: new Date('2023-12-15'),
      facultyId: 202,
    };
 
    jest.spyOn(JobService, 'getOneJob').mockResolvedValue(mockJob);
    const mockJobWithString = {
      ...mockJob,
      deadlineToApply: mockJob.deadlineToApply.toISOString()
    };
    const response = await request(app).get('/faculty-jobs/101');
 
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual(mockJobWithString);
  });
 
  it('should yield 404 when requesting a non-existent job', async () => {
    jest.spyOn(JobService, 'getOneJob').mockResolvedValue(null);
    const response = await request(app).get('/faculty-jobs/382765894761');
    expect(response.status).toBe(404);
  });
});
