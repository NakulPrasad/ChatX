/**
 * @interface ChatServiceInterface
 */
class ChatServiceInterface {
    /**
     * Handle user join event.
     * @throws {Error} If not implemented.
     */
    handleJoinRoom() {
        throw new Error('Method not implemented');
    }

    /**
     * Handle user disconnect event.
     * @throws {Error} If not implemented.
     */
    handleDisconnect() {
        throw new Error('Method not implemented');
    }

    /**
    * Handle user disconnect event.
    * @throws {Error} If not implemented.
    */
    handleSendMessage() {
        throw new Error('Method not implemented');
    }

    /**
     * Get users in the chat room.
     * @param {string} roomId - Chat room ID.
     * @throws {Error} If not implemented.
     * @returns {Array<Object>} List of users.
     */
    getChatRoomUsers(roomId) {
        throw new Error('Method not implemented');
    }
}

module.exports = ChatServiceInterface;
