const { Server } = require('socket.io')
const handleSocketIO = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        },
        connectionStateRecovery: {}
    })

    let allUsers = []
    let chatRoomUsers = []

    io.on('connection', (socket) => {
        socket.on('join_room', (data, cb) => {
            const { username, room } = data
            socket.join(room)

            socket.to(room).emit('join_room_greet', {
                message: `${username} joined`,
                username: username,
            })

            // socket.on('getUser', (data, cb) => {
            //     const { username, room, id } = data
            //     const user = chatRoomUsers.find({ id: id, room: room, username: username })
            //     socket.emit(user)
            //     console.log(user);
            //     cb({ success: true, message: "user fetch sucess" })
            // })

            allUsers.push({ id: socket.id, username, room })
            chatRoomUsers = allUsers.filter(user => {
                return user.room === room
            })
            // console.log(chatRoomUsers);
            socket.to(room).emit('chatroom_users', chatRoomUsers)



            cb({ success: true, message: 'Joined room successfully!', user: { id: socket.id, username, room } });
        })
        socket.on('send_message', (data) => {
            console.log(data);
            const { sender_name, content, room, created_time } = data
            // console.log(sender_name);
            socket.to(room).emit('receive_message', data)
        })
    })
}
module.exports = handleSocketIO
