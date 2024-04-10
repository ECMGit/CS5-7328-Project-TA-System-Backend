import { prisma } from 'prisma';

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

export const getUserFeedback = async (userId: number) => {
  return await prisma.feedback.findMany({
    where: {
      leftById: userId,
    },
  });
};

export const getAllFeedback = async () => {
  return await prisma.feedback.findMany();
};
