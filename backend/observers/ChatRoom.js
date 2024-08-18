const ObservableInterface = require('../interfaces/ObservableInterface');

/**
 * Chat room that users can join, leave, and send messages in.
 * @extends ObservableInterface
 */
class ChatRoom extends ObservableInterface {
    /**
     * Initializes a new chat room.
     */
    constructor() {
        super();
        /**
         * List of all users.
         * @type {Array<Client>}
         */
        this.allUsers = [];

        /**
         * Users grouped by room.
         * @type {Object<string, Array<Client>>}
         */
        this.roomUsers = {};
    }

    /**
     * Adds a user to the chat room.
     * @param {Client} user
     */
    subscribe(user) {
        if (!this.allUsers.find(u => u.username === user.username && u.roomId === user.roomId)) {
            this.allUsers.push(user);
        }
    }

    /**
     * Adds a user to a specific room.
     * @param {Client} user 
     */
    addUser(user) {
        if (!this.roomUsers[user.roomId]) {
            this.roomUsers[user.roomId] = [];
        }
        if (!this.roomUsers[user.roomId].find(u => u.username === user.username && u.roomId === user.roomId)) {
            this.roomUsers[user.roomId].push(user);
        }
    }

    /**
     * Removes a user based on socket ID.
     * @param {string} socketId 
     * @returns {?Client} Removed user or null.
     */
    unsubscribe(socketId) {
        const user = this.allUsers.find(user => user.socketId === socketId);
        if (!user) return null;

        this.allUsers = this.allUsers.filter(user => user.socketId !== socketId);
        this.roomUsers[user.roomId] = this.roomUsers[user.roomId].filter(user => user.socketId !== socketId);

        if (this.roomUsers[user.roomId].length === 0) {
            delete this.roomUsers[user.roomId];
        }

        return user;
    }

    /**
     * Notifies all users in a room.
     * @param {string} event 
     * @param {SocketIO.Server} io 
     * @param {string} roomId 
     * @param {Object} message 
     * @param {string} senderSocketId 
     */
    notify(event, io, roomId, message, senderSocketId) {
        const usersInRoom = this.roomUsers[roomId] || [];
        usersInRoom.forEach(user => {
            if (senderSocketId !== user.socketId) {
                user.update(event, message, io);
            }
        });
    }

    /**
     * Gets users in a room.
     * @param {string} roomId 
     * @returns {Array<Client>}
     */
    getRoomUsers(roomId) {
        return this.roomUsers[roomId] || [];
    }

    /**
     * Gets all users.
     * @returns {Array<Client>}
     */
    getAllUsers() {
        return this.allUsers;
    }

    /**
     * Sends a message to all users in a room.
     * @param {string} roomId 
     * @param {Object} message 
     * @param {SocketIO.Server} io 
     * @param {string} senderSocketId 
     */
    sendMessages(roomId, message, io, senderSocketId) {
        this.notify('receiveMessage', io, roomId, message, senderSocketId);
    }

    /**
     * Notifies about a new user joining.
     * @param {string} roomId 
     * @param {Object} message 
     * @param {SocketIO.Server} io 
     */
    joinRoomMessage(roomId, message, io) {
        this.notify('joinRoomMsg', io, roomId, message);
    }

    /**
     * Notifies about a user disconnecting.
     * @param {string} roomId 
     * @param {Object} message 
     * @param {SocketIO.Server} io 
     */
    userDisconnect(roomId, message, io) {
        this.notify('userDisconnect', io, roomId, message);
    }
}

module.exports = ChatRoom;
