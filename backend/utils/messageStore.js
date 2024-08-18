/**
 * @module messageStore
 * Handles saving and retrieving messages in an in-memory store.
 */

/**
 * Stores messages by room ID.
 * @type {Object.<string, Array<{ sender_name: string, content: string, roomId: string, createdAt: number }>>}
 */
let messageStore = {};

/**
 * Saves a message in the store for a specific room.
 * @param {string} roomId - Room ID to save the message under.
 * @param {Object} message - Message details.
 * @param {string} message.sender_name - Name of the sender.
 * @param {string} message.content - Content of the message.
 * @param {string} message.roomId - Room ID where the message was sent.
 * @param {number} message.createdAt - Timestamp when the message was created.
 */
const saveMessage = (roomId, message) => {
    if (!messageStore[roomId]) {
        messageStore[roomId] = [];
    }
    messageStore[roomId].push(message);
};

/**
 * Retrieves messages from the store for a specific room.
 * @param {string} roomId - Room ID to get messages from.
 * @returns {Array<Object>} - List of messages.
 * @returns {string} return.sender_name - Name of the sender.
 * @returns {string} return.content - Content of the message.
 * @returns {string} return.roomId - Room ID where the message was sent.
 * @returns {number} return.createdAt - Timestamp when the message was created.
 */
const getMessages = (roomId) => {
    return messageStore[roomId] || [];
};

module.exports = { saveMessage, getMessages };
