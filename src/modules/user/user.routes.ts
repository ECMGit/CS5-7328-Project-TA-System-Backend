import { Router } from 'express';
import * as UserController from './user.controller';
// import { authenticate } from 'middleware/authentication';

const router = Router();

router.get('/', UserController.getUsers); // route is not protected by authentication middleware
router.get('/:id', UserController.getUserById);
// router.get('/detail', authenticate, UserController.getUserDetailById); // route is protected by authentication middleware

// Newly added routes
router.post('/signup', UserController.register);
router.post('/login', UserController.login);
router.post('/import', UserController.importUsers);

// ... other user-related routes

export default router;





// import { Router } from 'express';
// import * as UserController from './user.controller';
// import { authenticate } from 'middleware/authentication';

// const router = Router();

// router.get('/', UserController.getUsers); // route is not protected by authentication middleware
// router.get('/:id', UserController.getUserById);
// router.get('/detail', authenticate, UserController.getUserDetailById); // route is protected by authentication middleware


// // // ... other user-related routes
// import express from 'express';
// import bcrypt from 'bcrypt';
// import {prisma} from '../../../prisma';

// const router = express.Router();
