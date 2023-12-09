import { Router } from 'express'; 
import * as MessageService from './message.service';
import * as MessageController from './message.controller';

const router = Router();

router.get('/:app', MessageService.getMessagesByApplication);
router.get('/:senderID', MessageService.getMessagesBySenderId);
router.get('/:receiverID', MessageService.getMessagesByReceiverId);
router.post('/mark-read/:messageID', MessageController.markMessageAsRead);

export default router; 