import multer from 'multer';
import { configManager } from 'src/config/configurationManager';

// Create the multer instance with the diskStorage configuration from ConfigurationManager
export const upload = multer({ storage: configManager.diskStorage });