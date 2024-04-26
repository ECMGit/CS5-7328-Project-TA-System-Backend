import { Router } from 'express';
import { createFeedbackRoute, getAdminFeedback, getMyFeedbackRoute, createCommentRoute, getMyCommentRoute } from './feedback.controller';
import { verifyToken } from '../../middleware/authentication';

const feedbackRouter = Router();

// Route to create a new piece of feedback
feedbackRouter.post('/', verifyToken, createFeedbackRoute);

// Get all of the feedback to show to the student
feedbackRouter.get('/', verifyToken, getMyFeedbackRoute);

// Route to create a comment
feedbackRouter.post('/comment', verifyToken, createCommentRoute);

// Get all of the feedback to show to the student
feedbackRouter.get('/comment', verifyToken, getMyCommentRoute);

//Get all feedback for the admin
feedbackRouter.get('/admin', verifyToken, getAdminFeedback);

export default feedbackRouter;
