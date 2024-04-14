import { Router } from 'express';
import * as MessageService from './message.service';
import * as MessageController from './message.controller';

const router = Router();

/**
 * GET /application/:app
 * Retrieves all messages associated with a specific application.
 * @param {string} app - The application identifier to filter messages by.
 * @returns {Array} Array of messages associated with the given application.
 */
router.get('/application/:app', MessageService.getMessagesByApplication);

/**
 * GET /sender/:senderID
 * Fetches all messages sent by a specific sender.
 * @param {string} senderID - The unique identifier of the message sender.
 * @returns {Array} Array of messages sent by the specified sender.
 */
router.get('/sender/:senderID', MessageService.getMessagesBySenderId);

/**
 * GET /receiver/:receiverID
 * Retrieves all messages received by a specific receiver.
 * @param {string} receiverID - The unique identifier of the message receiver.
 * @returns {Array} Array of messages received by the specified receiver.
 */
router.get('/receiver/:receiverID', MessageService.getMessagesByReceiverId);


/**
 * POST /mark-read/:messageID
 * Marks a specific message as read.
 * @param {string} messageID - The unique identifier of the message to mark as read.
 * @returns {Object} An object indicating the result of the operation (e.g., success or error message).
 */
router.post('/mark-read/:messageID', MessageController.markMessageAsRead);


/**
 * POST /
 * Adds a new message to the database.
 * @param {Object} message - The message object to be added.
 * @returns {Object} An object containing the added message.
 */
router.post('/', MessageController.addMessage);
// Export the router

export default router;
