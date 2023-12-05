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
    return await prisma.message.findMany ({where: { appID },});
  } catch (error) {
    console.log(error); 
  }
};

export const getMessagesByReceiverId = async (rID: number) => {
  try{
    return await prisma.message.findMany({where: { rID },});
  } catch (error){
    console.log(error);
  }
};

export const getMessagesBySenderId = async (sID: number) => {
  try{
    return await prisma.message.findMany({where: {sID},}); 
  } catch (error){
    console.log(error); 
  }
};