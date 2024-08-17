const ObservableInterface = require('./ObservableInterface')

class ChatRoom extends ObservableInterface {
    constructor() {
        super()
        this.allUsers = []
        this.roomUsers = {}
    }
    subscribe(user) {
        if (!this.allUsers.find(u => u.username === user.username && u.room === user.room))
            this.allUsers.push(user)
    }
    addUser(user) {
        // console.log(user);
        if (!this.roomUsers[user.room]) {
            this.roomUsers[user.room] = []
        }
        if (!this.roomUsers[user.room].find(u => u.username === user.username && u.room === user.room))
            this.roomUsers[user.room].push(user)
    }
    unsubscribe(socketId) {
        const user = this.allUsers.find(user => user.id === socketId);
        if (!user) return;

        // Remove user from allUsers
        this.allUsers = this.allUsers.filter(user => user.id !== socketId);

        // Remove user from roomUsers
        this.roomUsers[user.room] = this.roomUsers[user.room].filter(user => user.id !== socketId);

        // Clean up room if empty
        if (this.roomUsers[user.room].length === 0) {
            delete this.roomUsers[user.room];
        }

        return user;
    }
    notify(event, notification) {
        const { roomId } = notification
        const usersInRoom = this.roomUsers[roomId] || []
        // console.log(usersInRoom);
        usersInRoom.forEach(user => {

            user.update(event, notification)
        })

    }
    getRoomUsers(roomId) {
        return this.roomUsers[roomId] || [];
    }
    getAllUsers() {
        return this.allUsers || [];
    }

    sendMessages(roomId, message) {
        this.notify('receive_message', { roomId, message })

    }
    joinRoomMessage(roomId, message) {
        this.notify('join_room_message', { roomId, message })

    }
}

module.exports = ChatRoom