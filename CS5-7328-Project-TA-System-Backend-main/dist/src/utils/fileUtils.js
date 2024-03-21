"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const configurationManager_1 = require("../config/configurationManager");
// Create the multer instance with the diskStorage configuration from ConfigurationManager
exports.upload = (0, multer_1.default)({ storage: configurationManager_1.configManager.diskStorage });
