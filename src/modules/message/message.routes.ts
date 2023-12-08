import { Router } from 'express'; 
import * as MessageService from './message.service';

const router = Router();

router.get('/:app', MessageService.getMessagesByApplication);
router.get('/:senderID', MessageService.getMessagesBySenderId);
router.get('/:recieverID', MessageService.getMessagesByReceiverId);

export default router; 