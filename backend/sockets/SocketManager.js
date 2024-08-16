const { Server } = require('socket.io')
const { getMessages, saveMessage } = require('../utils/messageStore.js')
const ChatServer = require('../observers/ChatServer.js')
const Client = require('../observers/Client.js')

const getSocketIo = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        },
        connectionStateRecovery: {}
    })

    let allUsers = []
    const chatBotName = 'ChatBot'
    const generateChatBotMessage = (username) => { return `${username} joined` }

    io.on('connection', (socket) => {
        socket.on('join_room', (data, cb) => {
            const username = data?.username
            const room = data?.room
            if (!username || !room) {
                if (allUsers.find(user => user.username === username && user.room === room)) {
                    cb({ success: false, message: 'Username already taken' })
                    return
                }
            }
            socket.join(room)

            const createdAt = Date.now();
            const chatBotMessage = generateChatBotMessage(username)
            const messageToSend = { sender_name: chatBotName, content: chatBotMessage, room, createdAt }
            socket.to(room).emit('receive_message', messageToSend)
            saveMessage(room, messageToSend)

            io.to(room).emit('join_room_greet', {
                message: `${username} joined`,
                username: username,
            })

            const previousMessages = getMessages(room)
            socket.emit('previousMessages', previousMessages)


            if (!allUsers.find(user => user.username === username && user.room === room))
                allUsers.push({ username, room, id: socket.id })

            cb({ success: true, message: 'Joined room successfully!', user: { id: socket.id, username, room } });
        })
        socket.on('disconnect', () => {
            const disconnected_user = allUsers.find(user => user.id === socket.id);

            allUsers = allUsers.filter(user => user.id !== socket.id);

            if (disconnected_user) {
                socket.to(disconnected_user.room).emit('user_disconnect', {
                    message: "User Disconnected"
                });
            }
        });

        socket.on('request_chatroom_users', (data, cb) => {
            const room = data?.room
            if (!room) {
                cb({ success: false, message: "Room Invalid" })
                return
            }
            let chatRoomUsers = allUsers.filter(user => {
                return user.room === room
            })
            cb({ success: true, users: chatRoomUsers })

        })

        socket.on('send_message', (data, cb) => {
            const { sender_name, content, room, createdAt } = data
            if (!sender_name || !content || !room || !createdAt) {
                cb({ success: false, message: "Missing data fields" })
                return
            }
            socket.to(room).emit('receive_message', { sender_name, content, room, createdAt })
            saveMessage(room, { sender_name, content, room, createdAt })
            cb({ success: true, message: "Message sent successfully!" })
        })

    })
    return io
}
module.exports = getSocketIo
