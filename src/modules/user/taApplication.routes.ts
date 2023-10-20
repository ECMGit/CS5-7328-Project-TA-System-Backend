import { Router } from 'express';
import * as UserController from './taApplication.controller';
// import { authenticate } from 'middleware/authentication';

const router = Router();

router.get('/', UserController.getTaApplications); // route is not protected by authentication middleware

// router.get('/detail', authenticate, UserController.getUserDetailById); // route is protected by authentication middleware
// ... other user-related routes

export default router;