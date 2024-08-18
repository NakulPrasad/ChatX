const ObserverInterface = require('./ObserverInterface');

/**
 * Represents a client that implements the ObserverInterface.
 * @extends ObserverInterface
 */
class Client extends ObserverInterface {
    /**
     * Creates an instance of the Client.
     * @param {object} socket - The socket identifier for the client.
     */
    constructor(socketId) {
        super();
        /**
         * @type {object}
         * @private
         */
        this.socketId = socketId;

        /**
         * @type {?string}
         * @private
         */
        this.roomId = null;
        /**
         * @type {?string}
         * @private
         */
        this.username = null;
    }

    joinRoom(roomId, username, socket) {
        this.roomId = roomId;  // Set the client's current room
        this.username = username
        socket.join(roomId)

    }

    /**
     * Updates the client with a new notification.
     */
    update(event, message, io) {
        //No need to implement as socket.id changes on each reload, handle by ChatRoom notify method
        io.to(this.socketId).emit(event, message)
    }
}

module.exports = Client;
