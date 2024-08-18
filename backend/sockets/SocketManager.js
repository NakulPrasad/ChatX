const { getMessages, saveMessage } = require('../utils/messageStore.js')
const SocketManagerInterface = require('./SocketManagerInterface.js')
const ChatRoom = require('../observers/ChatRoom.js')
const Client = require('../observers/Client.js')

const chatRoom = new ChatRoom()

class SocketManager extends SocketManagerInterface {
    constructor(io) {
        super()
        this.io = io;
        this.allUsers = [];
        this.setupListeners();
    }

    setupListeners() {
        this.io.on('connection', (socket) => {
            this.client = new Client(socket.id)
            // console.log("Client", this.client);
            this.handleConnection(socket);
        });
    }

    handleConnection(socket) {
        socket.on('join_room', (data, cb) => this.handleJoinRoom(socket, data, cb));
        socket.on('disconnect', () => this.handleDisconnect(socket));
        socket.on('requestChatroomUsers', (data, cb) => this.handleRequestChatroomUsers(data, cb));
        socket.on('sendMessage', (data, cb) => this.handleSendMessage(socket, data, cb));
    }

    handleJoinRoom(socket, data, cb = () => { }) {
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

        // Check if username is already taken in the roomId
        if (chatRoom.getRoomUsers(roomId).find(user => user.username === username)) {
            cb({ success: false, message: 'Username already taken' })
            console.info('Username already taken')
            return
        }

        // Set this.client's roomId and subscribe to the chat roomId
        this.client.joinRoom(roomId, username, socket)
        // console.log("Client added to roomId", this.client);
        chatRoom.subscribe(this.client)
        // console.log("Client subscribed to roomId", chatRoom.getAllUsers());

        // Add user to the chat roomId
        chatRoom.addUser(this.client);
        // console.log('Client added as user in current roomId', chatRoom.getRoomUsers(this.client.roomId));

        chatRoom.joinRoomMessage(roomId, {
            message: `${username} joined`,
            username: username,
        }, this.io)

        // Send previous messages to the user
        const previousMessages = getMessages(roomId);
        socket.emit('previousMessages', previousMessages);
        // console.log("Send Previous Messages", previousMessages);

        cb({ success: true, message: `Joined ${roomId} successfully!`, user: { id: socket.id, username, roomId } });
    }

    handleDisconnect(socket) {
        const disconnectedUser = chatRoom.unsubscribe(socket.id)
        // console.log("Disconnected User", disconnectedUser);
        if (disconnectedUser) {
            chatRoom.userDisconnect(disconnectedUser.roomId, {
                message: `${disconnectedUser.username} Disconnected`
            }, this.io)
        }
    }

    handleRequestChatroomUsers(data, cb = () => { }) {
        if (!data) {
            cb({ success: false, message: "Invalid Request" })
            console.error("Invalid Request")
            return
        }
        const { roomId } = data

        if (!roomId) {
            cb({ success: false, message: "Room Invalid" });
            console.error('RoomId not valid : requestchatroomusers', roomId)
            return;
        }
        // Fetch users in the roomId
        const chatRoomUsers = chatRoom.getRoomUsers(roomId);
        cb({ success: true, users: chatRoomUsers });
    }

    handleSendMessage(socket, data, cb = () => { }) {
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
        // Notify others in the roomId about the message
        chatRoom.sendMessages(roomId, { sender_name, content, roomId, createdAt }, this.io, socket.id)

        // socket.to(roomId).emit('receiveMessage', { sender_name, content, roomId, createdAt });
        saveMessage(roomId, { sender_name, content, roomId, createdAt });
        cb({ success: true, message: "Message sent successfully!" });
    }
}

module.exports = SocketManager;
