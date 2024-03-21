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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = exports.markMessageAsRead = exports.getMessagesByReceicerId = exports.getMessagesBySenderId = exports.getMessagesByApplication = void 0;
/* eslint-disable max-len */
const MessageService = __importStar(require("./message.service"));
const getMessagesByApplication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield MessageService.getMessagesByApplication(Number(req.params.app));
        if (!message) {
            return res.status(404).json({ message: 'Messages not found' });
        }
        res.json(message);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getMessagesByApplication = getMessagesByApplication;
const getMessagesBySenderId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield MessageService.getMessagesBySenderId(Number(req.params.sID));
        if (!message) {
            return res.status(404).json({ message: 'Messages not found' });
        }
        res.json(message);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getMessagesBySenderId = getMessagesBySenderId;
const getMessagesByReceicerId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield MessageService.getMessagesBySenderId(Number(req.params.sID));
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json(message);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getMessagesByReceicerId = getMessagesByReceicerId;
const markMessageAsRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exists = yield MessageService.markMessageAsRead(Number(req.params.messageID));
        if (!exists) {
            return res.status(404).json({ message: 'Message not found' });
        }
        return res.status(200).json({ message: 'Marked message as read' });
    }
    catch (error) {
        console.log(error);
    }
});
exports.markMessageAsRead = markMessageAsRead;
// Controller function to handle adding a message
const addMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, receiverId, content, applicationId } = req.body;
        const newMessage = yield MessageService.addMessage(senderId, receiverId, content, applicationId);
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error("Error in controller while adding message", error);
        next(error);
    }
});
exports.addMessage = addMessage;
