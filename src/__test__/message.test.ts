import request from 'supertest';
import app from '../app';
import * as MessageService from '../modules/message/message.service';

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
