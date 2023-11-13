import { PrismaClient } from '@prisma/client';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

class ConfigurationManager {
  private static _instance: ConfigurationManager | null = null;
  private _prismaClient: PrismaClient;
  private _diskStorage: multer.StorageEngine;

  private constructor() {
    this._prismaClient = new PrismaClient();
    this._diskStorage = multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadFolder = 'uploads/';

        if (!fs.existsSync(uploadFolder)) {
          fs.mkdirSync(uploadFolder, { recursive: true });
        }
						
        cb(null, 'uploads/');
      },
      filename: function (req, file, cb) {
        cb(
          null,
          file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
      }
    });
  }

  public static getInstance(): ConfigurationManager {
    if (this._instance === null) {
      this._instance = new ConfigurationManager();
    }
    return this._instance;
  }

  public get prismaClient(): PrismaClient {
    return this._prismaClient;
  }

  public get diskStorage(): multer.StorageEngine {
    return this._diskStorage;
  }
}

// Usage
export const configManager = ConfigurationManager.getInstance();

// PrismaClient instance
configManager.prismaClient.$connect()
  .then(() => {
    console.log('Successfully connected to the database.');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// multer disk storage configuration
console.log(configManager.diskStorage); 