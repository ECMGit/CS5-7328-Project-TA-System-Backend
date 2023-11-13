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


// describe('GET /user', () => {
//   it('should return all users', async () => {
//     const mockGetUsers = jest.fn().mockResolvedValue([{ id: 1, username: 'testuser' }]);
//     jest.spyOn(UserService, 'getUsers').mockImplementation(mockGetUsers);

//     const response = await request(app).get('/user');
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toEqual([{ id: 1, username: 'testuser' }]);
//   });

//   it('should handle errors', async () => {
//     const mockGetUsers = jest.fn().mockRejectedValue(new Error('Failed to retrieve users'));
//     jest.spyOn(UserService, 'getUsers').mockImplementation(mockGetUsers);

//     const response = await request(app).get('/users');
//     expect(response.statusCode).toBe(500);
//   });
// });

describe('POST /signUp', () => {
  it('should create a new user', async () => {
    const mockCreateUser = jest.fn().mockResolvedValue({ id: 1, username: 'newuser' });
    jest.spyOn(UserService, 'createUser').mockImplementation(mockCreateUser);

    const response = await request(app).post('user/signUp').send({
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      userType: 'student',
      smuNo: 12345678,
      // other required fields
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });
});

// const mockFindUnique = jest.fn();

// jest.mock('../../prisma/index', () => ({
//   user: {
//     findUnique: mockFindUnique,
//   },
// }));

// describe('POST /user/login', () => {
//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   it('should log in successfully with valid credentials', async () => {
//     mockFindUnique.mockResolvedValue({
//       username: 'junhaos',
//       password: 'junhaos123',
//     } as User);

//     const response = await request(app).post('/user/login').send({
//       username: 'junhaos',
//       password: 'junhaos123',
//     });

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Login successful');
//     expect(response.body.user.username).toBe('junhaos');
//   });

//   it('should return 401 if username is not found', async () => {
//     const response = await request(app)
//       .post('/user/login')
//       .send({ username: 'unknown', password: 'password' });
//     expect(response.status).toBe(401);
//     expect(response.body).toEqual({ error: 'Invalid username or password' });
//   });
// });

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