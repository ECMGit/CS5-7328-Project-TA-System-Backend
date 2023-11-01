import multer from 'multer';
import { configManager } from '../config/configurationManager';

// Create the multer instance with the diskStorage configuration from ConfigurationManager
export const upload = multer({ storage: configManager.diskStorage });