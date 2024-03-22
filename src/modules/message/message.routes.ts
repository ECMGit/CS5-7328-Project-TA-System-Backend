import { Router } from 'express';
import * as MessageService from './message.service';
import * as MessageController from './message.controller';

const router = Router();


router.get('/application/:app', MessageService.getMessagesByApplication);
router.get('/sender/:senderID', MessageService.getMessagesBySenderId);
router.get('/receiver/:receiverID', MessageService.getMessagesByReceiverId);
router.post('/mark-read/:messageID', MessageController.markMessageAsRead);
router.post('/', MessageController.addMessage);
// router.get('/:recieverID', MessageService.getMessagesByReceiverId);

export default router; 