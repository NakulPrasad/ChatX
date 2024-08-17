const { Server } = require('socket.io')
const { getMessages, saveMessage } = require('../utils/messageStore.js')

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
            const roomId = data?.roomId
            if (!username || !roomId) {
                if (allUsers.find(user => user.username === username && user.roomId === roomId)) {
                    cb({ success: false, message: 'Username already taken' })
                    return
                }
            }
            socket.join(roomId)

            const createdAt = Date.now();
            const chatBotMessage = generateChatBotMessage(username)
            const messageToSend = { sender_name: chatBotName, content: chatBotMessage, roomId, createdAt }
            socket.to(roomId).emit('receive_message', messageToSend)


            io.to(roomId).emit('join_room_greet', {
                message: `${username} joined`,
                username: username,
            })

            const previousMessages = getMessages(roomId)
            socket.emit('previousMessages', previousMessages)


            if (!allUsers.find(user => user.username === username && user.roomId === roomId))
                allUsers.push({ username, roomId, id: socket.id })

            cb({ success: true, message: 'Joined roomId successfully!', user: { id: socket.id, username, roomId } });
        })
        socket.on('disconnect', () => {
            const disconnected_user = allUsers.find(user => user.id === socket.id);

            allUsers = allUsers.filter(user => user.id !== socket.id);

            if (disconnected_user) {
                socket.to(disconnected_user.roomId).emit('user_disconnect', {
                    message: "User Disconnected"
                });
            }
        });

        socket.on('request_chatroom_users', (data, cb) => {
            const roomId = data?.roomId
            if (!roomId) {
                cb({ success: false, message: "Room Invalid" })
                return
            }
            let chatRoomUsers = allUsers.filter(user => {
                return user.roomId === roomId
            })
            cb({ success: true, users: chatRoomUsers })

        })

        socket.on('send_message', (data, cb) => {
            const { sender_name, content, roomId, createdAt } = data
            if (!sender_name || !content || !roomId || !createdAt) {
                cb({ success: false, message: "Missing data fields" })
                return
            }
            socket.to(roomId).emit('receive_message', { sender_name, content, roomId, createdAt })
            saveMessage(roomId, { sender_name, content, roomId, createdAt })
            cb({ success: true, message: "Message sent successfully!" })
        })

    })
    return io
}
module.exports = getSocketIo
