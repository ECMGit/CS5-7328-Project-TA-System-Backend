import { Prisma } from '@prisma/client';
import { error } from 'console';
import { prisma } from 'prisma';
import app from 'src/app';


//TODO: add comments to all functions
/**
 * 
 * @returns all the job available
 */

// TODO: check that these functions work
/**
 * getMessagesByApplication
    getMessagesByReceiverId
    getMessagesBySenderId
 */

export const getMessagesByApplication = async (appID: number) => {
  try{
    return await prisma.userMessage.findMany(
      {
        where: {
          applicationId: appID
        },
      }
    );
  } catch (error) {
    console.log(error); 
  }
};

export const getMessagesByReceiverId = async (rID: number) => {
  try{
    return await prisma.userMessage.findMany({where: { receiverId: rID },});
  } catch (error){
    console.log(error);
  }
};

export const getMessagesBySenderId = async (sID: number) => {
  try{
    return await prisma.userMessage.findMany({where: {senderId: sID},}); 
  } catch (error){
    console.log(error); 
  }
};

export const markMessageAsRead = async (messageID: number) => {
  try {
    await prisma.userMessage.update({
      where: {
        id: messageID,
      },
      data: {
        isRead: true,
      },
    });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      // No message found with messageID
      return false;
    } else {
      throw error;
    }
  }
};

export const createMessage =async (senderId: number, 
  receiverId: number, 
  applicationId: number,
  content: string) => {

  return await prisma.userMessage.create({
    data: {
      senderId: senderId,
      receiverId: receiverId,
      applicationId: applicationId,
      content: content
    }}
  )
}
