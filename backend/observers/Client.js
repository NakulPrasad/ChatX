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

    joinRoom(roomId, username) {
        this.roomId = roomId;  // Set the client's current room
        this.username = username
    }

    /**
     * Updates the client with a new notification.
     * @param {Object} notification - The notification to be processed.
     * @param {string} notification.message - The message contained in the notification.
     * @param {string} notification.roomId - The room ID associated with the notification.
     */
    update(event, notification) {
        const { message, roomId } = notification;
        if (this.roomId === roomId) {
            if (event === 'receive_message') {

                try {
                    console.log(`Received new message: ${message}`);
                    this.socket.emit(event, message);
                } catch (error) {
                    console.error(`Error emitting event ${event}:`, error);
                }
            }
            else if (event === 'join_room_message') {

                try {
                    console.log(`Received new message: ${message}`);
                    this.socket.emit(event, message);
                } catch (error) {
                    console.error(`Error emitting event ${event}:`, error);
                }
            }

        }
    }
}

module.exports = Client;
