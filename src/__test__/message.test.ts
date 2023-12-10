import request from 'supertest';
import app from '../app';
import * as MessageService from '../modules/message/message.service';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();


const JWT_SECRET = 'my-secret-key';

describe('POST /message/mark-read/:messageID', () => {
  it('should mark a message as read', async () => {
    jest.spyOn(MessageService, 'markMessageAsRead').mockResolvedValue(true);
    const response = await request(app).post('/message/mark-read/0').send();
    expect(response.statusCode).toBe(200);
  });

  it('should return 404 if message does not exist', async () => {
    jest.spyOn(MessageService, 'markMessageAsRead').mockResolvedValue(false);
    const response = await request(app).post('/message/mark-read/0').send();
    expect(response.statusCode).toBe(404);
  });
});
  



describe('GET /:app', () => {
  let appID = 19999;

  it('should return messages for a valid application ID', async () => {
    const token = jwt.sign({ userId: 1, role: 'user' }, JWT_SECRET);
    const response = await request(app).get(`/message/${appID}`).set('Authorization', `${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should return 404 for an invalid application ID', async () => {
    const invalidAppID = 9999;
    const response = await request(app).get(`/message/${invalidAppID}`);
    expect(response.statusCode).toBe(401);
  });
});




describe('GET /:senderID', () => {
  it('should return messages for a valid sender ID', async () => {
    const senderID = 1000; // example sender ID
    const token = jwt.sign({ userId: 1000, role: 'user' }, JWT_SECRET);
    const response = await request(app).get(`/message/${senderID}`).set('Authorization', `${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should return 404 for an invalid sender ID', async () => {
    const senderID = 9999;
    const response = await request(app).get(`/message/${senderID}`);
    expect(response.statusCode).toBe(401);
  });
});


describe('POST /', () => {
  it('should add a message for valid data', async () => {
    const newMessage = {
      senderId: 1,
      receiverId: 2,
      content: 'Test message content',
      applicationId: 1,
      id: 1,
      createdAt: new Date(),
    };

    // Create a spy on the MessageService.addMessage function
    const addMessageSpy = jest.spyOn(MessageService, 'addMessage').mockResolvedValue(newMessage);

    const token = jwt.sign({ userId: 1000, role: 'user' }, JWT_SECRET);

    const response = await request(app)
      .post('/message/')
      .send(newMessage)
      .set('Authorization', `${token}`);

    expect(response.statusCode).toBe(201);
    // Check if the spy was called
    expect(addMessageSpy).toHaveBeenCalled();
    expect(addMessageSpy).toHaveBeenCalledWith(newMessage.senderId, newMessage.receiverId, newMessage.content, newMessage.applicationId);

    // Restore the original implementation
    addMessageSpy.mockRestore();
  });

  it('should return an error for invalid data', async () => {
    const invalidMessage = {
      senderId: 'invalid',
      receiverId: 2,
      content: 'Hello, World!',
      applicationId: 1
    };
    const response = await request(app).post('/message/').send(invalidMessage);
    expect(response.statusCode).toBe(401); // or whichever status code your app returns for bad requests
  });
});
