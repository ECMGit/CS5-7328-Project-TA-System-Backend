/* eslint-disable max-len */
import * as MessageService from './message.service';
import { Request, Response, NextFunction } from 'express';


export const getMessagesByApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = await MessageService.getMessagesByApplication(Number(req.params.appID));
    if (!message) {
      return res.status(404).json({message: 'Messages not found'});
    }
    res.json(message);
  }catch (error){
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
    const message = await MessageService.getMessagesBySenderId(Number(req.params.sID));
    if (!message) {
      return res.status(404).json({message: 'Messages not found'});
    }
    res.json(message);
  }catch (error){
    console.log(error);
    next(error); 
  }
};

export const getMessagesByReceicerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = await MessageService.getMessagesBySenderId(Number(req.params.sID));
    if (!message) {
      return res.status(404).json({message: 'Message not found'});
    }
    res.json(message);
  }catch (error){
    console.log(error);
    next(error); 
  }
};

export const markMessageAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const exists = await MessageService.markMessageAsRead(Number(req.params.messageID));
    if (!exists) {
      return res.status(404).json({message: 'Message not found'});
    }
    return res.status(200).json({message: 'Marked message as read'});
  } catch (error) {
    console.log(error);
    next(error);
  }
};
