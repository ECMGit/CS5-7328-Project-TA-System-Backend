import request from 'supertest';
import app from '../app'; // Import your Express app
// import { User } from '@prisma/client';
// import {faker} from '@faker-js/faker';
import * as UserService from '../modules/user/user.service';
// import { jobData } from 'src/modules/job/job.types';

describe('GET /', () => {
  it('should return "Hello, World!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});

describe('POST /signUp', () => {
  it('should create a new user', async () => {
    const mockCreateUser = jest.fn().mockResolvedValue({ id: 4, username: 'newuser' });
    jest.spyOn(UserService, 'findUserByUsername').mockResolvedValue(null);
    jest.spyOn(UserService, 'createUser').mockImplementation(mockCreateUser);
    jest.spyOn(UserService, 'createStudent').mockImplementation(mockCreateUser);
    const response = await request(app).post('/user/signUp').send({
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
      smuNo: '12345678',
      firstName: 'John',
      lastName: 'Doe',
      userType: 'student',
      year: 2,
      // other required fields
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should return 409 if username already exists', async () => {
    const mockFindUser = jest.fn().mockResolvedValue({ username: 'existinguser' });
    jest.spyOn(UserService, 'findUserByUsername').mockImplementation(mockFindUser);

    const response = await request(app).post('/user/signUp').send({
      username: 'existinguser',
      // other fields...
    });
    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      error: 'Username already taken'
    });
  });
});



describe('GET /faculty-jobs', () => {
  it('should return all jobs', async () => {
    const response = await request(app).get('/faculty-jobs');
    expect(response.status).toBe(200);
    expect(response.text).toBe('[]');
  });
});

describe('POST /faculty-jobs', () => {
  it('should post a job', async () => {
    // Get the current date
    const today = new Date();

    // Add 1 day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Convert to ISO date string
    const isoDate = tomorrow.toISOString().substring(0, 10);

    const jobData = {
      title: 'Best Job Ever!',
      courseId: 0,
      courseSchedule: 'this is a schedule',
      totalHoursPerWeek: 10,
      maxNumberOfTAs: 10,
      requiredCourses: 'Pascal',
      requiredSkills: 'basic literacy',
      TAStats: 'here are some statistics',
      notes: 'here are some notes',
      deadlineToApply: isoDate,
      facultyId: 0
    };

    const response = await request(app).post('/faculty-jobs').send(jobData);
    expect(response.status).toBe(201);
    expect(response.text).toBe('[]');
  });

  it('should post nothing if the input is malformed', async () => {
    const jobData = {
      title: 0,
      courseId: 'Best Job Ever!', // int
      courseSchedule: 0,
      totalHoursPerWeek: 'this is a schedule', // int
      maxNumberOfTAs: 'this is a schedule', // int
      requiredCourses: 0,
      requiredSkills: 0,
      TAStats: 0,
      notes: 0,
      deadlineToApply: 'here are some statistics', // should be ISO formatted datestring
      facultyId: 'here are some notes' // int
    };

    const response = await request(app).post('/faculty-jobs').send(jobData);
    expect(response.status).toBe(400);
  });
});

describe('GET /faculty-jobs/:id', () => {
  it('should return one job', async () => {
    const response = await request(app).get('/faculty-jobs/0');
    expect(response.status).toBe(200);
    expect(response.text).toBe('[]'); // TODO: This should be checking if it conforms to the jobData object
  });

  it('should yield 404 when requesting a non-existent job', async () => {
    const response = await request(app).get('/faculty-jobs/382765894761');
    expect(response.status).toBe(404);
  });
});

describe('PUT /faculty-jobs/edit/:id', () => {
  const id = 0;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isoDate = tomorrow.toISOString().substring(0, 10);

  const jobData = {
    title: 'Best Job Ever!',
    courseId: 0,
    courseSchedule: 'this is a schedule',
    totalHoursPerWeek: 10,
    maxNumberOfTAs: 10,
    requiredCourses: 'Pascal',
    requiredSkills: 'basic literacy',
    TAStats: 'here are some statistics',
    notes: 'here are some notes',
    deadlineToApply: isoDate,
    facultyId: 0
  };
  
  it('should update a job', async () => {
    const response = await request(app).put('/faculty-jobs/edit/'+String(id)).send(jobData); 
    expect(response.status).toBe(201);
    expect(response.text).toBe(''); //check 
    
  });
});


/**
 * using faker.js
 */
// describe('POST /user/signup', () => {
//   it('should create a new user', async () => {
//     // Generate fake user data
//     const fakeUser = {
//       smuNo: faker.number.int(),
//       username: faker.internet.userName(),
//       email: faker.internet.email(),
//       firstName: faker.person.firstName(),
//       lastName: faker.person.lastName(),
//       password: faker.internet.password(),
//     };

//     const response = await request(app)
//       .post('/user/signup')
//       .send(fakeUser);

//     expect(response.status).toBe(201);
//     expect(response.body.message).toBe('User created!');
    
//     // Additional assertions...
//     // For instance, check if user is in the database
//   });
// });