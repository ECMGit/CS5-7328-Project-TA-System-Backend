import { Router } from 'express';
import * as UserController from './user.controller';
// import { authenticate } from 'middleware/authentication';

const router = Router();

router.get('/', UserController.getUsers); // route is not protected by authentication middleware
router.get('/:id', UserController.getUserById);

//get all the job post
// router.get('/detail', authenticate, UserController.getUserDetailById); // route is protected by authentication middleware
// ... other user-related routes

export default router;