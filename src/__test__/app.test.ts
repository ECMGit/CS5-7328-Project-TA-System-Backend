import request from 'supertest';
import app from '../app'; // Import your Express app
import * as UserService from '../modules/user/user.service';
// import { User } from '@prisma/client';
// import {faker} from '@faker-js/faker';
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











// import request from "supertest";
// import app from "../app"; // Import your Express app
// import * as UserService from '../modules/user/user.service';
// import * as  getUserRoleById from '../modules/user/user.service';
// import * as  getRole from '../modules/user/user.controller';
// import { createRequest, createResponse } from 'node-mocks-http';



// // Mocking Prisma functions
// jest.mock('prisma', () => ({
//   prisma: {
//     user: {
//       findUnique: jest.fn(),
//     },
//   },
// }));

// describe('getRole function', () => {

//   it('should return 200 and user role for valid user', async () => {

//     const userId = 123;
//     const userRole = 'faculty';

//     jest.spyOn(UserService, 'getUserRoleById')
//       .mockResolvedValueOnce(userRole);

//     const req = createRequest({
//       params: {
//         id: userId
//       }
//     });

//     const res = createResponse();
//     res.status = jest.fn().mockReturnThis();
//     res.json = jest.fn();

//     await getRole.getUserById(req, res, jest.fn());

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       role: userRole
//     });

//   });

// });

// describe('signUp function', () => {
//   it('should return 201 and token on successful signup', async () => {
//     const userData = {
//       id: 1,
//       smuNo: 123456789,
//       username: 'test',
//       email: 'test@example.com',
//       firstName: 'Test',
//       lastName: 'User',
//       password: 'password123',
//       resetToken: null,
//       resetTokenExpiry: null,
//       role: 'student',
//       faculty: null,
//       student: {
//         userId: 1,
//         year: 2022
//       },
//       admin: null,
//       updatedAt: null,
//       userType: null,
//       // other required fields
//     };

//     jest.spyOn(UserService, 'findUserByUsername').mockResolvedValueOnce(null);
//     jest.spyOn(UserService, 'createUser').mockResolvedValueOnce(userData);

//     const res = await request(app)
//       .post('/api/auth/signup')
//       .send(userData);

//     expect(res.statusCode).toBe(201);
//     expect(res.body.token).toBeDefined();
//     expect(UserService.createUser).toHaveBeenCalledWith(userData);
//   });

//   it('should return 409 if username is taken', async () => {
//     jest.spyOn(UserService, 'findUserByUsername').mockResolvedValueOnce({
//       id: 1,
//       smuNo: 123456789,
//       username: 'test',
//       email: 'test@example.com',
//       firstName: 'Test',
//       lastName: 'User',
//       password: 'password123',
//       resetToken: null,
//       resetTokenExpiry: null,
//       role: 'student',
//       faculty: null,
//       student: {
//         userId: 1,
//         year: 2022
//       },
//       admin: null,
//       updatedAt: null,
//       userType: null,
//       // include other properties as required
//     });

//     const res = await request(app)
//       .post('/api/auth/signup')
//       .send({
//         username: 'test'
//       });

//     expect(res.statusCode).toBe(409);
//   });

// });