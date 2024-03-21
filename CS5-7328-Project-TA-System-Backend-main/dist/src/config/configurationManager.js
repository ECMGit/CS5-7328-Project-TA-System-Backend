"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configManager = void 0;
const client_1 = require("@prisma/client");
const multer = __importStar(require("multer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ConfigurationManager {
    constructor() {
        this._prismaClient = new client_1.PrismaClient();
        this._diskStorage = multer.diskStorage({
            destination: function (req, file, cb) {
                const uploadFolder = 'uploads/';
                if (!fs.existsSync(uploadFolder)) {
                    fs.mkdirSync(uploadFolder, { recursive: true });
                }
                cb(null, 'uploads/');
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });
    }
    static getInstance() {
        if (this._instance === null) {
            this._instance = new ConfigurationManager();
        }
        return this._instance;
    }
    get prismaClient() {
        return this._prismaClient;
    }
    get diskStorage() {
        return this._diskStorage;
    }
}
ConfigurationManager._instance = null;
// Usage
exports.configManager = ConfigurationManager.getInstance();
// PrismaClient instance
exports.configManager.prismaClient.$connect()
    .then(() => {
    console.log('Successfully connected to the database.');
})
    .catch((error) => {
    console.error('Error connecting to the database:', error);
});
// multer disk storage configuration
console.log(exports.configManager.diskStorage);
