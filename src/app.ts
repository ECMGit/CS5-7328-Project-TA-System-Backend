import express from 'express';
import bodyParser from 'body-parser';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import userRoutes from './modules/user/user.routes';
import taApplicationRoutes from './modules/taApplication/taApplication.routes';
import tajobRoutes from './modules/tajobs/tajob.routes';
import messageRoutes from './modules/message/message.routes';
import taPerformanceRoute from './modules/taPerformance/taPerformance.routes';
import courseRoutes from './modules/course/course.routes';
import taskRoutes from './modules/tasks/tasks.routes';
import feedbackRouter from './modules/feedback/feedback.router';

// middleware
import { verifyToken } from './middleware/authentication';

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Enable CORS

app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request.
  // By default, send a 200 status for OPTIONS requests.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  // api log
  console.log('Incoming request:', req.method, req.originalUrl, req.query);

  next();
});

// import routes which are defined in modules
app.use('/user', userRoutes);
// routes that require middleware
app.use('/message', verifyToken, messageRoutes);
app.use('/ta-application', verifyToken, taApplicationRoutes);
app.use('/jobs', verifyToken, tajobRoutes);
app.use('/api/ta-performance', taPerformanceRoute);
app.use('/course', verifyToken, courseRoutes);
app.use('/api/courses', courseRoutes);
app.use('/tasks', verifyToken, taskRoutes);interface Sender {
  id: number;
  firstName: string;
  lastName: string;
}

interface Message {
  id: number;
  content: string;
  createdAt: string; // or Date if you prefer
  sender: Sender;
}

interface MessageThreadProps {
  messageId: number;
}
app.use('/feedback', feedbackRouter);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.get('/api/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const messages = await prisma.userMessage.findMany({
        where: { id: Number(messageId) }
    });
    res.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).send('An error occurred while fetching messages.');
  }
});


export default app;
