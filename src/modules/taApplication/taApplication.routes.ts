import express from 'express';
import * as taApplicationController from './taApplication.controller';

const router = express.Router();

router.post( '/', taApplicationController.save );
router.get( '/:id', taApplicationController.getApplication );

export default router;