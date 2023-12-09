// import request from 'supertest';
// import app from '../app'; // Import your Express app
// import { TAJob } from '@prisma/client';
// import * as JobService from '../modules/tajobs/tajob.service';

// describe('GET /faculty-jobs', () => {
//   it('should return all jobs', async () => {
//     const mockGetJobs = jest.fn().mockResolvedValue([{ id: 1, title: 'Job1' }, { id: 2, title: 'Job2' }]);
//     jest.spyOn(JobService, 'getJobs').mockImplementation(mockGetJobs);

//     const response = await request(app).get('/faculty-jobs');
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual([{ id: 1, title: 'Job1' }, { id: 2, title: 'Job2' }]);
//   });
//   it('should return 500 if jobs could not be retrieved', async () => {
//     const mockGetJobs = jest.fn().mockRejectedValue(new Error('Could not retrieve jobs'));
//     jest.spyOn(JobService, 'getJobs').mockImplementation(mockGetJobs);

//     const response = await request(app).get('/faculty-jobs');
//     expect(response.status).toBe(500);
//     expect(response.body).toEqual({});
//   });
// });

// describe('GET /faculty-jobs/:id', () => {
//   it('should return a job by id', async () => {
//     const mockGetOneJob = jest.fn().mockResolvedValue({ id: 1, title: 'Job1' });
//     jest.spyOn(JobService, 'getOneJob').mockImplementation(mockGetOneJob);

//     const response = await request(app).get('/faculty-jobs/1');
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({ id: 1, title: 'Job1' });
//   });

//   it('should return 200 but null if job does not exist', async () => {
//     const mockGetOneJob = jest.fn().mockResolvedValue(null);
//     jest.spyOn(JobService, 'getOneJob').mockImplementation(mockGetOneJob);

//     const response = await request(app).get('/faculty-jobs/999');
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(null);
//   });
// });
// //update job by id passed as param
// describe('PUT /faculty-jobs/edit/:id', () => {
  
//   it('should update a job by id', async () => {
//     const mockUpdateJob = jest.fn().mockResolvedValue({ id: 1, title: 'Job1' });
//     jest.spyOn(JobService, 'updateJob').mockImplementation(mockUpdateJob);

//     const response = await request(app).put('/faculty-jobs/edit/1').send({ title: 'Job1' });
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({ id: 1, title: 'Job1' });
//   });
//   it('should return 200 but null if job does not exist', async () => {
//     const mockUpdateJob = jest.fn().mockResolvedValue(null);
//     jest.spyOn(JobService, 'updateJob').mockImplementation(mockUpdateJob);

//     const response = await request(app).put('/faculty-jobs/edit/999').send({ title: 'Job1' });
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(null);
//   });
// });
// //post one job
// describe('POST /faculty-jobs', () => {
//   it('should create a new job', async () => {
//     const mockCreateJob = jest.fn().mockResolvedValue({ id: 1, title: 'Job1' });
//     jest.spyOn(JobService, 'createJob').mockImplementation(mockCreateJob);

//     const response = await request(app).post('/faculty-jobs').send({ title: 'Job1' });
//     expect(response.status).toBe(201);
//     expect(response.body).toEqual({ id: 1, title: 'Job1' });
//   });
//   it('should return 500 if job could not be created', async () => {
//     const mockCreateJob = jest.fn().mockRejectedValue(new Error('Could not create job'));
//     jest.spyOn(JobService, 'createJob').mockImplementation(mockCreateJob);

//     const response = await request(app).post('/faculty-jobs').send({ title: 'Job1' });
//     expect(response.status).toBe(500);
//     expect(response.body).toEqual({});
//   });
// });