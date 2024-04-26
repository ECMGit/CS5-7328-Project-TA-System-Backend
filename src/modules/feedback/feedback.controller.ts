import { Request, Response } from 'express';
import { createNewComment, createNewFeedback, getAllFeedback, getUserFeedback, getUserComment, getAllComments } from './feedback.service';
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

/**
 * Creates a new comment report
 * @param req the content of the comment
 * @param res the comment item you created
 * @returns void
 */
export const createCommentRoute = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as CustomJwtPayload;
    const feedbackComment = await createNewComment({
  
      feedbackId: req.body.feedbackId,
      leftById: user.userId,
      content: req.body.content
    });

    res.json(feedbackComment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * Gets the comment for a specific user
 * @param req nothing
 * @param res array of comment items
 * @returns void
 */
export const getMyCommentRoute = async (_req: Request, res: Response) => {
  const user = res.locals.user as CustomJwtPayload;
  const userFeedback = await getUserComment(user.userId);
  console.log(userFeedback);
  res.json(userFeedback);
};

/**
 * Gets ALL comment for admins
 * @param req nothing
 * @param res array of comment items
 * @returns void
 */
export const getAllUserComments = async (_req: Request, res: Response) => {
  const allFeedback = await getAllComments();
  console.log(allFeedback);
  res.json(allFeedback);
};
