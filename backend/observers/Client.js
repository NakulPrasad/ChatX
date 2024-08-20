const ObserverInterface = require('../interfaces/ObserverInterface');

/**
 * A client that follows the ObserverInterface.
 * @extends ObserverInterface
 */
class Client extends ObserverInterface {
    /**
     * Creates a new client.
     * @param {string} socketId - The client's unique socket ID.
     */
    constructor(socketId) {
        super();

        /**
         * Client's unique socket ID.
         * @type {string}
         * @private
         */
        this.socketId = socketId;

        /**
         * Current room ID the client is in.
         * @type {?string}
         * @private
         */
        this.roomId = null;

        /**
         * Client's username.
         * @type {?string}
         * @private
         */
        this.username = null;

        /**
         * Client's sessionId. - when using HTTP
         * @type {?string}
         * @private
         */
        this.sessionID = null;
    }

    /**
     * Joins the client to a room.
     * @param {string} roomId - The room ID to join.
     * @param {string} username - The client's username.
     */
    joinRoom(roomId, username) {
        this.roomId = roomId;
        this.username = username;
    }

    /**
     * Sends an update to the client. - HTTP
     * @param {string} event - The event name.
     * @param {Object} message - The data to send.
     */
    updateHTTP(event, message) {
        // send update to their session id
    }
    /**
     * Sends an update to the client.
     * @param {string} event - The event name.
     * @param {Object} message - The data to send.
     * @param {SocketIO.Server} io - The Socket.IO server instance.
     */
    update(event, message, io) {
        io.to(this.socketId).emit(event, message);
    }
}

module.exports = Client;
