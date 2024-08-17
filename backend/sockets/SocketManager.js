const { getMessages, saveMessage } = require('../utils/messageStore.js')
const SocketManagerInterface = require('./SocketManagerInterface.js')
class SocketManager extends SocketManagerInterface {
    constructor(io) {
        super()
        this.io = io;
        this.allUsers = [];
        this.setupListeners();
    }

    setupListeners() {
        this.io.on('connection', (socket) => {
            this.handleConnection(socket);
        });
    }

    handleConnection(socket) {
        socket.on('join_room', (data, cb) => this.handleJoinRoom(socket, data, cb));
        socket.on('disconnect', () => this.handleDisconnect(socket));
        socket.on('requestChatroomUsers', (data, cb) => this.handleRequestChatroomUsers(data, cb));
        socket.on('sendMessage', (data, cb) => this.handleSendMessage(socket, data, cb));
    }

    handleJoinRoom(socket, data, cb) {
        if (!data) {
            cb({ success: false, message: 'Invalid data' });
            console.error("Failed to join roomId:", data);
            return;
        }
        const { username, roomId } = data;
        if (!username || !roomId) {
            cb({ success: false, message: 'Invalid username or roomId' });
            console.error('Invalid username or roomId:', data);
            return;
        }

        socket.join(roomId);

        this.io.to(roomId).emit('joinRoomMsg', {
            message: `${username} joined`,
            username: username,
        });

        // Send previous messages to the user
        const previousMessages = getMessages(roomId);
        socket.emit('previousMessages', previousMessages);

        if (!this.allUsers.find(user => user.username === username && user.roomId === roomId)) {
            this.allUsers.push({ username, roomId, id: socket.id });
        }

        cb({ success: true, message: `Joined ${roomId} successfully!`, user: { id: socket.id, username, roomId } });
    }

    handleDisconnect(socket) {
        const disconnectedUser = this.allUsers.find(user => user.id === socket.id);

        this.allUsers = this.allUsers.filter(user => user.id !== socket.id);

        if (disconnectedUser) {
            this.io.to(disconnectedUser.roomId).emit('userDisconnect', {
                message: `${disconnectedUser.username} Disconnected`
            });
        }
    }

    handleRequestChatroomUsers(data, cb) {
        const roomId = data?.roomId;

        if (!roomId) {
            cb({ success: false, message: "Room Invalid" });
            console.error('RoomId not valid : requestchatroomusers', roomId)
            return;
        }

        const chatRoomUsers = this.allUsers.filter(user => user.roomId === roomId);
        cb({ success: true, users: chatRoomUsers });
    }

    handleSendMessage(socket, data, cb) {
        if (!data) {
            cb({ success: false, message: 'Invalid data' });
            console.error("Failed to send message:", data);
            return;
        }
        const { sender_name, content, roomId, createdAt } = data;

        if (!sender_name || !content || !roomId || !createdAt) {
            cb({ success: false, message: "Missing data fields" });
            return;
        }

        socket.to(roomId).emit('receiveMessage', { sender_name, content, roomId, createdAt });
        saveMessage(roomId, { sender_name, content, roomId, createdAt });
        cb({ success: true, message: "Message sent successfully!" });
    }
}

module.exports = SocketManager;
