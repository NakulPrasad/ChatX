/**
 * @module messageStore
 * Handles saving and retrieving messages in an in-memory store.
 */

/**
 * Stores messages by room ID.
 * @type {object}
 */
const messageStore = {}

/**
 * Saves a message in the store for a specific room.
 * @param {string} roomId - Room ID to save the message under.
 * @param {object} message - Message details.
 * @param {string} message.sender_name - Name of the sender.
 * @param {string} message.content - Content of the message.
 * @param {string} message.roomId - Room ID where the message was sent.
 * @param {number} message.createdAt - Timestamp when the message was created.
 */
const saveMessage = (roomId, message) => {
  if (!messageStore[roomId]) {
    messageStore[roomId] = []
  }
  messageStore[roomId].push(message)
}

/**
 * Retrieves messages from the store for a specific room.
 * @param {string} roomId - Room ID to get messages from.
 * @returns {Array<object>} - List of messages.
 */
const getMessages = (roomId) => {
  return messageStore[roomId] || []
}

module.exports = { saveMessage, getMessages }
