"use strict";
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
exports.addMessage = exports.createMessage = exports.markMessageAsRead = exports.getMessagesBySenderId = exports.getMessagesByReceiverId = exports.getMessagesByApplication = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../../prisma");
//TODO: add comments to all functions
/**
 *
 * @returns all the job available
 */
// TODO: check that these functions work
/**
 * getMessagesByApplication
    getMessagesByReceiverId
    getMessagesBySenderId
 */
const getMessagesByApplication = (appID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_1.prisma.userMessage.findMany({
            where: {
                applicationId: appID
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                sender: {
                    select: {
                        username: true,
                    }
                },
                receiver: {
                    select: {
                        username: true,
                    }
                },
            },
        });
    }
    catch (error) {
        console.log(error);
        return []; // return an empty array in case of error
    }
});
exports.getMessagesByApplication = getMessagesByApplication;
const getMessagesByReceiverId = (rID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_1.prisma.userMessage.findMany({ where: { receiverId: rID }, });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getMessagesByReceiverId = getMessagesByReceiverId;
const getMessagesBySenderId = (sID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_1.prisma.userMessage.findMany({ where: { senderId: sID }, });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getMessagesBySenderId = getMessagesBySenderId;
const markMessageAsRead = (messageID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.prisma.userMessage.update({
            where: {
                id: messageID,
            },
            data: {
                isRead: true,
            },
        });
        return true;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            // No message found with messageID
            return false;
        }
        else {
            throw error;
        }
    }
});
exports.markMessageAsRead = markMessageAsRead;
const createMessage = (senderId, receiverId, applicationId, content) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.userMessage.create({
        data: {
            senderId: senderId,
            receiverId: receiverId,
            applicationId: applicationId,
            content: content
        }
    });
});
exports.createMessage = createMessage;
// Service function to add a message
const addMessage = (senderId, receiverId, content, applicationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newMessage = yield prisma_1.prisma.userMessage.create({
            data: {
                senderId,
                receiverId,
                content,
                applicationId,
            },
            include: {
                sender: {
                    select: {
                        username: true,
                    }
                },
                receiver: {
                    select: {
                        username: true,
                    }
                },
            }
        });
        return newMessage;
    }
    catch (error) {
        console.error("Error adding message to database", error);
        throw error;
    }
});
exports.addMessage = addMessage;
