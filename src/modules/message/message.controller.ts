/* eslint-disable max-len */
import * as MessageService from './message.service';
import { Request, Response, NextFunction } from 'express';

export const getMessagesByApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messages = await MessageService.getMessagesByApplication(
      Number(req.params.app)
    );
    res.json(messages);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getMessagesBySenderId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messages = await MessageService.getMessagesBySenderId(
      Number(req.params.sID)
    );
    res.json(messages);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

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
    console.log(error);
    next(error);
  }
};

export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const exists = await MessageService.markMessageAsRead(
      Number(req.params.messageID)
    );
    if (!exists) {
      return res.status(404).json({ message: 'Message not found' });
    }
    return res.status(200).json({ message: 'Marked message as read' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to handle adding a message
export const addMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { senderId, receiverId, content, applicationId } = req.body;
    const newMessage = await MessageService.addMessage(
      senderId,
      receiverId,
      content,
      applicationId
    );
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error in controller while adding message', error);
    next(error);
  }
};
