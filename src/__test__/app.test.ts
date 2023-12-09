import request from 'supertest';
import app from '../app'; // Import your Express app
import * as UserService from '../modules/user/user.service';
import * as taApplicationService from "../modules/taApplication/taApplication.service"
import { TAApplicationData } from 'src/modules/taApplication/taApplication.types';
import React, {useState, useEffect} from 'react';
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


describe('POST /ta-application', () => {
  const mockData: TAApplicationData = {
    courseId: 1,
    studentId: 11,
    taJobId: 2,
    hoursCanWorkPerWeek: "10",
    gpa: 3.8,
    requiredCourses: 'Math 101',
    requiredSkills: 'Python',
    coursesTaken: 'Math 101',
  };

  
  const mockFile: Express.Multer.File = {
    fieldname: 'mockFieldName',
    originalname: 'mockOriginalName',
    encoding: 'mockEncoding',
    mimetype: 'mockMimeType',
    destination: '/mock/destination',
    filename: 'mockFileName',
    path: '/path/to/mock/file',
    size: 12345,
  } as Express.Multer.File;

  it('should create a new application if no existing record is found', async () => {
    const existingRecord = null; // Simulating no existing record
    const expectedResult = {
      id: 1, // Assuming the ID of the newly created application
      course: { connect: { id: mockData.courseId } },
      student: { connect: { userId: mockData.studentId } },
      taJob: { connect: { id: mockData.taJobId } },
      hoursCanWorkPerWeek: mockData.hoursCanWorkPerWeek,
      GPA: mockData.gpa,
      requiredCourses: mockData.requiredCourses,
      requiredSkills: mockData.requiredSkills,
      resumeFile: mockFile,
      coursesTaken: mockData.coursesTaken,
    };

    const result = await taApplicationService.saveApplication(mockData, mockFile);

    expect(result).toEqual(expectedResult); // Check if the result matches the expected result
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
});