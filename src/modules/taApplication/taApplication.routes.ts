import express from 'express';
import * as TaApplicationController from './taApplication.controller';

const router = express.Router();

router.post( '/', TaApplicationController.save );
router.get('/', TaApplicationController.getTaApplications); // route is not protected by authentication middleware
router.get( '/:id', TaApplicationController.getTaApplication );

export default router;