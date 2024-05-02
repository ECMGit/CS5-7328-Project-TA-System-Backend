import { prisma } from 'prisma'; // Singleton instance of PrismaClient
import { UserMessage } from '@prisma/client';

/**
 * Retrieves all messages associated with a specific application ID.
 * @param {number} appID - The unique identifier for the application.
 * @returns {Promise<UserMessage[]>} A promise that resolves to an array of UserMessage instances.
 */

export const getMessagesByApplication = async (
  appID: number
): Promise<UserMessage[]> => {
  try {
    // Fetch all messages associated with the given application ID
    return await prisma.userMessage.findMany({
      where: { applicationId: appID },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { username: true } },
        receiver: { select: { username: true } },
      },
    });
  } catch (error) {
    console.log(error);
    return []; // Return an empty array in case of an error
  }
};

/**
 * Fetches all messages sent by a specific sender.
 * @param {number} sID - The unique identifier of the sender.
 * @returns {Promise<UserMessage[]>} A promise that resolves to an array of UserMessage instances.
 */
export const getMessagesBySenderId = async (
  sID: number
): Promise<UserMessage[]> => {
  try {
    return await prisma.userMessage.findMany({ where: { senderId: sID } });
  } catch (error) {
    console.log('Error fetching messages by sender ID:', error);
    return [];
  }
};

/**
 * Retrieves all messages received by a specific receiver.
 * @param {number} rID - The unique identifier of the receiver.
 * @returns {Promise<UserMessage[]>} A promise that resolves to an array of UserMessage instances.
 */

export const getMessagesByReceiverId = async (
  rID: number
): Promise<UserMessage[]> => {
  try {
    // Fetch all messages received by the receiver
    return await prisma.userMessage.findMany({ where: { receiverId: rID } });
  } catch (error) {
    // Log and return an empty array in case of an error
    console.log('Error fetching messages by receiver ID:', error);
    return [];
  }
};

/**
 * Marks a message as read based on the message ID.
 * @param {number} messageID - The unique identifier of the message to be marked as read.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating success or failure.
 */
export const markMessageAsRead = async (
  messageID: number
): Promise<boolean> => {
  try {
    await prisma.userMessage.update({
      // Update the message with the given ID
      where: { id: messageID },
      data: { isRead: true },
    });
    return true;
  } catch (error) {
    // Log and return false in case of an error
    console.error('Error marking message as read:', error);
    return false;
  }
};

/**
 * Creates a new message with given details.
 * @param {number} senderId - The unique identifier of the sender.
 * @param {number} receiverId - The unique identifier of the receiver.
 * @param {number} applicationId - The unique identifier of the application context.
 * @param {string} content - The content of the message.
 * @returns {Promise<UserMessage>} A promise that resolves to the newly created UserMessage instance.
 */

export const createMessage = async (
  senderId: number,
  receiverId: number,
  applicationId: number,
  content: string
): Promise<UserMessage> => {
  // Create a new message in the database
  return await prisma.userMessage.create({
    data: {
      senderId,
      receiverId,
      applicationId,
      content,
    },
  });
};

/**
 * Service function to add a new message to the database with complete details including senders and receivers' usernames.
 * @param {number} senderId - Sender's user ID.
 * @param {number} receiverId - Receiver's user ID.
 * @param {string} content - Content of the message.
 * @param {number} applicationId - Application context ID.
 * @returns {Promise<UserMessage>} A promise that resolves to the newly added UserMessage with detailed information.
 */
export const addMessage = async (
  senderId: number,
  receiverId: number,
  content: string,
  applicationId: number
): Promise<UserMessage> => {
  try {
    // Add the message to the database
    const newMessage = await prisma.userMessage.create({
      data: {
        senderId,
        receiverId,
        content,
        applicationId,
      },
      include: {
        // Include sender and receiver details in the response
        sender: { select: { username: true } },
        receiver: { select: { username: true } },
      },
    });
    return newMessage;
  } catch (error) {
    // Log and throw the error in case of an error
    console.error('Error adding message to database', error);
    console.log('Error adding message:', error);
    throw error;
  }
};
