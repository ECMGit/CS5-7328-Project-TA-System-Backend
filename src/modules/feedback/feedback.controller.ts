import { Request, Response } from 'express';
import { createNewFeedback, getAllFeedback, getUserFeedback } from './feedback.service';
import { CustomJwtPayload } from 'middleware/authentication';

/**
 * Creates a new feedback/bug report
 * @param req the content of the feedback and the type
 * @param res the feedback item you created
 * @returns void
 */
export const createFeedbackRoute = async (req: Request, res: Response) => {
  try {
    const feedback = await createNewFeedback({
      type: req.body.type,
      content: req.body.content,
      userId: req.body.userId
    });

    res.json(feedback);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * Gets the feedback for a specific user
 * @param req nothing
 * @param res array of feedback items
 * @returns void
 */
export const getMyFeedbackRoute = async (_req: Request, res: Response) => {
  const user = res.locals.user as CustomJwtPayload;
  const userFeedback = await getUserFeedback(user.userId);
  console.log(userFeedback);
  res.json(userFeedback);
};

/**
 * Gets ALL feedback for admins
 * @param req nothing
 * @param res array of feedback items
 * @returns void
 */
export const getAdminFeedback = async (_req: Request, res: Response) => {
  const allFeedback = await getAllFeedback();
  console.log(allFeedback);
  res.json(allFeedback);
};
