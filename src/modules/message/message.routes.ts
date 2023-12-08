import { Router } from 'express'; 
import * as MessageController from './message.controller';

const router = Router();

router.get('/:app', MessageController.getMessagesByApplication);
router.get('/:senderID', MessageController.getMessagesBySenderId);
// router.get('/:recieverID', MessageService.getMessagesByReceiverId);

export default router; 