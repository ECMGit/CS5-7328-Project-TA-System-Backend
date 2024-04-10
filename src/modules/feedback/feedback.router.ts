import { Router } from 'express';
import { createFeedbackRoute, getMyFeedbackRoute } from './feedback.controller';

const feedbackRouter = Router();

// Route to create a new piece of feedback
feedbackRouter.post('/', createFeedbackRoute);

// Get all of the feedback to show to the student
feedbackRouter.get('/', getMyFeedbackRoute);

export default feedbackRouter;
