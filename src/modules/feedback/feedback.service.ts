import { prisma } from 'prisma';

/**
 * Creates a new feedback entry in the database.
 * @param content - The content of the feedback.
 * @param userId - The user ID of the person leaving the feedback.
 * @param type - The type of feedback (e.g., 'bug', 'comment', 'suggestion').
 * @returns The newly created feedback object.
 */
export const createNewFeedback = async ({
  content,
  userId,
  type,
}: {
  content: string;
  userId: number;
  type: string,
}) => {
  return await prisma.feedback.create({
    data: {
      content: content,
      type: type,
      complete: false,
      leftBy: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

/**
 * Retrieves all feedback items left by a specific user.
 * @param userId - The ID of the user whose feedback is to be retrieved.
 * @returns An array of feedback items.
 */
export const getUserFeedback = async (userId: number) => {
  return await prisma.feedback.findMany({
    where: {
      leftById: userId,
    },
  });
};

/**
 * Retrieves all feedback items from the database.
 * @returns An array of all feedback items.
 */
export const getAllFeedback = async () => {
  return await prisma.feedback.findMany();
};

/**
 * Creates a new comment in the database, similar to creating feedback.
 * @param content - The content of the comment.
 * @param userId - The user ID of the person leaving the comment.
 * @param type - The type of comment (consistent with feedback types for simplicity).
 * @returns The newly created comment object.
 */
export const createNewComment = async ({
  content,
  userId,
  type,
}: {
  content: string;
  userId: number;
  type: string,
}) => {
  return await prisma.feedback.create({
    data: {
      content: content,
      type: type,
      complete: false,
      leftBy: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

/**
 * Retrieves all comments left by a specific user.
 * @param userId - The ID of the user whose comments are to be retrieved.
 * @returns An array of comment items.
 */
export const getUserComment = async (userId: number) => {
  return await prisma.feedback.findMany({
    where: {
      leftById: userId,
    },
  });
};

/**
 * Retrieves all comments from the database.
 * @returns An array of all comment items.
 */
export const getAllComments = async () => {
  return await prisma.feedback.findMany();
};
