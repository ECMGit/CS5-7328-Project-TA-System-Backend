import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './modules/user/user.routes';
import taApplicationRoutes from './modules/taApplication/taApplication.routes';
import tajobRoutes from './modules/tajobs/tajob.routes';
import messageRoutes from './modules/message/message.routes';
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
app.use('/admin', verifyToken, adminRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

export default app;
