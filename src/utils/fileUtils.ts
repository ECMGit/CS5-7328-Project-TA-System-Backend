import path from 'path';
import multer from 'multer';
import fs from 'fs';

/**
 * create multer storage instance
 * make sure it is singleton
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = 'uploads/';

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

export const upload = multer({ storage });