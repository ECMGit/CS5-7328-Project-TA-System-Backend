import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './modules/user/user.routes';
import jobRoutes from './modules/job/job.routes';
import taApplicationRoutes from './modules/taApplication/taApplication.routes';
import tajobRoutes from './modules/tajobs/tajob.routes';
import passwordRoutes from './modules/user/password.routes';

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
app.use('/job', jobRoutes);
app.use('/ta-application', taApplicationRoutes);
app.use('/jobs', tajobRoutes);
app.use('/api', passwordRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

export default app;
