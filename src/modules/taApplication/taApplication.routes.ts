import { Router } from 'express';
import * as TaApplicationController from './taApplication.controller';

const router = Router();

router.post( '/', TaApplicationController.save );
router.get('/', TaApplicationController.getTaApplications); // route is not protected by authentication middleware
router.get( '/:id', TaApplicationController.getTaApplication );
router.post('/:id', TaApplicationController.updateTaApplication);
router.delete('/:id', TaApplicationController.deleteTaApplication);

export default router;