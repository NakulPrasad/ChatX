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
        console.log("notify :", event, message);
        // const usersInRoom = this.roomUsers[roomId] || []
        // console.log(usersInRoom);
        // usersInRoom.forEach(user => {

        //     user.update(event, socket, notification)
        // })
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
        this.notify('receive_message', socket, roomId, message)

    }
    joinRoomMessage(roomId, message) {
        this.notify('join_room_message', { roomId, message })

    }
}

module.exports = ChatRoom