const ObservableInterface = require('./ObservableInterface')

class ChatRoom extends ObservableInterface {
    constructor() {
        super()
        this.allUsers = []
        this.roomUsers = {}
    }
    subscribe(user) {
        if (!this.allUsers.find(u => u.username === user.username && u.roomId === user.roomId))
            this.allUsers.push(user)
    }
    addUser(user) {
        // console.log(user);
        if (!this.roomUsers[user.roomId]) {
            this.roomUsers[user.roomId] = []
        }
        if (!this.roomUsers[user.roomId].find(u => u.username === user.username && u.roomId === user.roomId))
            this.roomUsers[user.roomId].push(user)
    }
    unsubscribe(socketId) {
        const user = this.allUsers.find(user => user.socketId === socketId);
        if (!user) return;

        // Remove user from allUsers
        this.allUsers = this.allUsers.filter(user => user.socketId !== socketId);

        // Remove user from roomUsers
        this.roomUsers[user.roomId] = this.roomUsers[user.roomId].filter(user => user.socketId !== socketId);

        // Clean up roomId if empty
        if (this.roomUsers[user.roomId].length === 0) {
            delete this.roomUsers[user.roomId];
        }

        return user;
    }
    notify(event, socket, roomId, message) {
        // console.log("notify :", event, message);
        //Can't implement traditional notify method as socket.id changes on each reload, have to use socket.io's inbuild method to broadcast in room
        socket.to(roomId).emit(event, message)

    }
    getRoomUsers(roomId) {
        return this.roomUsers[roomId] || [];
    }
    getAllUsers() {
        return this.allUsers || [];
    }

    sendMessages(roomId, message, socket) {
        // console.log(roomId, message);
        this.notify('receiveMessage', socket, roomId, message)

    }
    joinRoomMessage(roomId, message, io) {
        this.notify('joinRoomMsg', io, roomId, message)

    }
    userDisconnect(roomId, message, io) {
        this.notify('userDisconnect', io, roomId, message)

    }
}

module.exports = ChatRoom