import { prisma } from 'prisma';

export const createNewFeedback = async ({
  content,
  userId,
}: {
  content: string;
  userId: string;
}) => {
  return await prisma.feedback.create({
    data: {
      content: content,
      complete: false,
      leftBy: {
        connect: {
          id: parseInt(userId),
        },
      },
    },
  });
};

export const getAllFeedback = async () => {
  return await prisma.feedback.findMany();
};
