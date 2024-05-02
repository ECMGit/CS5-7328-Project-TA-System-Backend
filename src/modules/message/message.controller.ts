/* eslint-disable max-len */
import * as MessageService from './message.service';
import { Request, Response, NextFunction } from 'express';

/**
 * Handles GET requests to retrieve messages by application ID.
 *
 * @param {Request} req - The request object, expects an application ID in the URL parameter.
 * @param {Response} res - The response object used to send back the fetched data.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const getMessagesByApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve messages by application ID
    const messages = await MessageService.getMessagesByApplication(
      Number(req.params.app)
    );
    res.json(messages);
  } catch (error) {
    // Log and pass the error to the error handler middleware
    console.error('Failed to retrieve messages by application:', error);
    next(error);
  }
};

/**
 * Handles GET requests to retrieve messages by sender ID.
 *
 * @param {Request} req - The request object, expects a sender ID in the URL parameter.
 * @param {Response} res - The response object used to send back the fetched data.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const getMessagesBySenderId = async (
  // Retrieve messages by sender ID
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messages = await MessageService.getMessagesBySenderId(
      // Retrieve messages by sender ID
      Number(req.params.sID)
    );
    res.json(messages);
  } catch (error) {
    // Log and pass the error to the error handler middleware
    console.error('Failed to retrieve messages by sender ID:', error);
    next(error);
  }
};

/**
 * Handles GET requests to retrieve messages by receiver ID.
 *
 * @param {Request} req - The request object, expects a receiver ID in the URL parameter.
 * @param {Response} res - The response object used to send back the fetched data.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const getMessagesByReceiverId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messages = await MessageService.getMessagesByReceiverId(
      Number(req.params.rID)
    );
    res.json(messages);
  } catch (error) {
    console.error('Failed to retrieve messages by receiver ID:', error);
    next(error);
  }
};

/**
 * Handles POST requests to mark a specific message as read.
 *
 * @param {Request} req - The request object, expects a message ID in the URL parameter.
 * @param {Response} res - The response object used to return the result.
 * @returns {Response} Returns a status 200 with success message or 404 if message not found.
 */
export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    // Mark message as read
    const success = await MessageService.markMessageAsRead(
      Number(req.params.messageID)
    );
    if (!success) {
      return res.status(404).json({ message: 'Message not found' });
    }
    // Return success message
    return res.status(200).json({ message: 'Marked message as read' });
  } catch (error) {
    // Log and return an error message
    console.error('Failed to mark message as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Handles POST requests to add a new message.
 *
 * @param {Request} req - The request object, expects message details in the body (senderId, receiverId, content, applicationId).
 * @param {Response} res - The response object used to return the newly created message.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Response} Returns a status 201 with the newly created message or an error message.
 */
export const addMessage = async (
  // Add a new message
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract message details from the request body
    const { senderId, receiverId, content, applicationId } = req.body;
    console.log('senderId:', senderId);
    console.log('receiverId:', receiverId);
    console.log('content:', content);
    console.log('applicationId:', applicationId);
    // Add the message
    const newMessage = await MessageService.addMessage(
      senderId,
      receiverId,
      content,
      applicationId
    );
    res.status(201).json(newMessage);
  } catch (error) {
    // Log and pass the error to the error handler middleware
    console.error('Error in controller while adding message:', error);
    next(error);
  }
};
