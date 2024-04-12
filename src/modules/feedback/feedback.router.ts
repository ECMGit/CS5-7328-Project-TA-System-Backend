import { Router } from 'express';
import { createFeedbackRoute, getAdminFeedback, getMyFeedbackRoute, createCommentRoute, getMyCommentRoute } from './feedback.controller';
import { verifyToken } from '../../middleware/authentication';

const feedbackRouter = Router();

// Route to create a new piece of feedback
feedbackRouter.post('/', verifyToken, createFeedbackRoute);

// Get all of the feedback to show to the student
feedbackRouter.get('/', verifyToken, getMyFeedbackRoute);

feedbackRouter.post('/', verifyToken, createCommentRoute);

// Get all of the feedback to show to the student
feedbackRouter.get('/', verifyToken, getMyCommentRoute);

feedbackRouter.get('/admin', verifyToken, getAdminFeedback);

export default feedbackRouter;
