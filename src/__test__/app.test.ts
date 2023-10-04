import request from 'supertest';
import app from '../app'; // Import your Express app
import {User} from '@prisma/client';

describe('GET /', () => {
  it('should return "Hello, World!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});


const mockFindUnique = jest.fn();

jest.mock('../../prisma/index', () => ({
    user: {
      findUnique: mockFindUnique
    }
}));

describe('POST /user/login', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should log in successfully with valid credentials', async () => {
    mockFindUnique.mockResolvedValue({
      username: 'junhaos',
      password: 'junhaos123'
    } as User);

    const response = await request(app)
      .post('/user/login')
      .send({
        username: 'junhaos',
        password: 'junhaos123'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user.username).toBe("junhaos");
  });

  it('should return 401 if username is not found', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({ username: 'unknown', password: 'password' });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid username or password' });
  });

});
  
