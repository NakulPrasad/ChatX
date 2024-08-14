const { Server } = require('socket.io')
const handleSocketIO = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        },
        connectionStateRecovery: {}
    })

    const allUsers = {}
    const chatRoomUsers = {}

    io.on('connection', (socket) => {
        socket.on('join_room', (data) => {
            const { username, room } = data
            socket.join(room)

            const joinTime = Date.now()
            socket.to(room).emit('join_room_greet', {
                message: `${username} joined`,
                username: username,
                room: room,
                joinTime
            })
            allUsers.push({ id: socket.id, username, room })
            chatRoomUsers = allUsers.filter(user => {
                return user.room === room
            })
            console.log(chatRoomUsers);
            socket.to(room).emit('chatroom_users', chatRoomUsers)
        })
    })
}
module.exports = handleSocketIO
