import request from 'supertest';
import app from '../app'; // Import your Express app
import { User } from '@prisma/client';
import {faker} from '@faker-js/faker';
import * as UserService from '../modules/user/user.service';

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