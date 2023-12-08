import { prisma } from 'prisma';


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
    return await prisma.userMessage.findMany ({where: { applicationId: appID },});
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