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
    const generateChatBotMessage = (username) => { `${username} joined` }

    io.on('connection', (socket) => {
        socket.on('join_room', (data, cb) => {
            const { username, room } = data
            if (allUsers.find(user => user.username === username && user.room === room)) {
                cb({ sucess: false, message: 'Username already taken' })
                return
            }
            socket.join(room)

            const createdAt = Date.now();
            const chatBotMessage = generateChatBotMessage(username)
            socket.to(room).emit('receive_message', { chatBotName, chatBotMessage, room, createdAt })

            socket.to(room).emit('join_room_greet', {
                message: `${username} joined`,
                username: username,
            })

            const previousMessages = getMessages(room)
            socket.to(room).emit('previousMessages', previousMessages)



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
            } else {
                console.log("No user found with the given socket id.");
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
            socket.to(room).emit('receive_message', { sender_name, content, room, createdAt })
            saveMessage(room, { sender_name, content, room, createdAt })
            cb({ success: true, message: "Message sent sucessfully!" })
        })
    })
    return io
}
module.exports = getSocketIo
