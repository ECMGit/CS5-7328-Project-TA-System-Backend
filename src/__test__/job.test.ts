import request from 'supertest';
import app from '../app'; // Import your Express app
import { jobData } from '../modules/job/job.types';
import { prisma } from 'prisma';
import {faker} from '@faker-js/faker';

// mock the prisma methods used in the controller
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();
const mockCreate = jest.fn();

jest.mock('../../prisma/index', () => ({
  tAJob: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    update: mockUpdate,
    create: mockCreate,
  },
}));

// generate some fake job data using faker
const fakeJobData: jobData = {
  title: 'aker.name.title()',
  courseId: faker.datatype.number(),
  courseSchedule: faker.date.future().toISOString(),
  totalHoursPerWeek: faker.datatype.number({ min: 1, max: 10 }),
  maxNumberOfTAs: faker.datatype.number({ min: 1, max: 5 }),
  requiredCourses: faker.lorem.words(3),
  requiredSkills: faker.lorem.words(5),
  TAStats: faker.lorem.words(3),
  notes: faker.lorem.sentence(),
  deadlineToApply: faker.date.future(),
  facultyId: faker.datatype.number(),
};

// generate some fake job id using faker
const fakeJobId = faker.datatype.number();

describe('GET /', () => {
  it('should return all the jobs available', async () => {
    // mock the prisma findMany method to return an array of fake job data
    mockFindMany.mockResolvedValue([fakeJobData, fakeJobData]);

    // make a GET request to the / route
    const response = await request(app).get('/');

    // expect the response status to be 200
    expect(response.status).toBe(200);

    // expect the response body to be an array of fake job data
    expect(response.body).toEqual([fakeJobData, fakeJobData]);
  });
});

describe('POST /', () => {
  it('should create a new job and return it', async () => {
    // mock the prisma create method to return the fake job data
    mockCreate.mockResolvedValue(fakeJobData);

    // make a POST request to the / route with the fake job data as body
    const response = await request(app).post('/').send(fakeJobData);

    // expect the response status to be 201
    expect(response.status).toBe(201);

    // expect the response body to be the fake job data
    expect(response.body).toEqual(fakeJobData);
  });
});

describe('GET /:id', () => {
  it('should return the job with the given id', async () => {
    // mock the prisma findUnique method to return the fake job data
    mockFindUnique.mockResolvedValue(fakeJobData);

    // make a GET request to the /:id route with the fake job id as param
    const response = await request(app).get(`/${fakeJobId}`);

    // expect the response status to be 200
    expect(response.status).toBe(200);

    // expect the response body to be the fake job data
    expect(response.body).toEqual(fakeJobData);
  });

  it('should return 404 if the job with the given id does not exist', async () => {
    // mock the prisma findUnique method to return null
    mockFindUnique.mockResolvedValue(null);

    // make a GET request to the /:id route with the fake job id as param
    const response = await request(app).get(`/${fakeJobId}`);

    // expect the response status to be 404
    expect(response.status).toBe(404);

    // expect the response body to be an error message
    expect(response.body).toEqual({ message: 'Job not found' });
  });
});

describe('PUT /edit/:id', () => {
  it('should update the job with the given id and return it', async () => {
    // mock the prisma update method to return the fake job data
    mockUpdate.mockResolvedValue(fakeJobData);

    // make a PUT request to the /edit/:id route with the fake job id as param and the fake job data as body
    const response = await request(app).put(`/edit/${fakeJobId}`).send(fakeJobData);

    // expect the response status to be 200
    expect(response.status).toBe(200);

    // expect the response body to be the fake job data
    expect(response.body).toEqual(fakeJobData);
  });

  it('should return 404 if the job with the given id does not exist', async () => {
    // mock the prisma update method to throw an error
    mockUpdate.mockRejectedValue(new Error('Job not found'));

    // make a PUT request to the /edit/:id route with the fake job id as param and the fake job data as body
    const response = await request(app).put(`/edit/${fakeJobId}`).send(fakeJobData);

    // expect the response status to be 404
    expect(response.status).toBe(404);

    // expect the response body to be an error message
    expect(response.body).toEqual({ message: 'Job not found' });
  });
});
