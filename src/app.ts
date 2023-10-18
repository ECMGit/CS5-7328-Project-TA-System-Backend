import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './modules/user/user.routes';
import * as UserController from './modules/user/user.controller'

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight request. 
  // By default, send a 200 status for OPTIONS requests.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// import routes which are defined in modules
app.use('/user', userRoutes);

app.get('/jobs', UserController.getAllTAJobs);
app.get('/jobs/:id', UserController.getTAJobById);

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});


export default app;