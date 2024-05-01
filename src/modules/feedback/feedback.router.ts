import { Router } from 'express';
import {
  createFeedbackRoute,
  getAdminFeedback,
  getMyFeedbackRoute,
  createCommentRoute,
  getMyCommentRoute,
  getFeedbackItemById,
  setStatus,
} from './feedback.controller';
import { verifyToken } from '../../middleware/authentication';

const feedbackRouter = Router();

// Route to create a new piece of feedback
feedbackRouter.post('/', verifyToken, createFeedbackRoute);

// Get all of the feedback to show to the student
feedbackRouter.get('/', verifyToken, getMyFeedbackRoute);

// Route to create a comment
feedbackRouter.post('/comment', verifyToken, createCommentRoute);

// Get all of the feedback comments to show to the student
feedbackRouter.get('/comment', verifyToken, getMyCommentRoute);

//Get all feedback for the admin
feedbackRouter.get('/admin', verifyToken, getAdminFeedback);

// Get a single feedback item
feedbackRouter.get('/single/:id', verifyToken, getFeedbackItemById);

// Route to set status
feedbackRouter.post('/status', verifyToken, setStatus);

export default feedbackRouter;
