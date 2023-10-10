import express from 'express';
import * as taApplicationController from './taApplication.controller';

const router = express.Router();

router.post( '/', taApplicationController.save );

export default router;