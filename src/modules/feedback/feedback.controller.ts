import { Request, Response } from 'express';
import { createNewFeedback, getAllFeedback } from './feedback.service';

// Creates a new feedback item
export const createFeedbackRoute = (req: Request, res: Response) => {
  try {
    const feedback = createNewFeedback({
      content: req.body.content,
      userId: req.body.userId,
    });

    res.json(feedback);
  } catch (err) {
    res.status(500).json(err);
  }
};

// TODO: Only return the feedback created by the user
export const getMyFeedbackRoute = (req: Request, res: Response) => {
  const allFeedback = getAllFeedback();
  res.json(allFeedback);
};
