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


            allUsers.push({ id: socket.id, username, room })
            chatRoomUsers = allUsers.filter(user => {
                return user.room === room
            })
            console.log(chatRoomUsers);
            socket.to(room).emit('chatroom_users', chatRoomUsers)



            cb({ success: true, message: 'Joined room successfully!', user: { id: socket.id, username, room } });
        })
        socket.on('disconnect', () => {
            console.log("disconnect", socket.id, socket.username);
        })
        socket.on('send_message', (data, cb) => {
            // console.log(data);
            const { sender_name, content, room, created_time } = data
            // console.log(sender_name);
            socket.to(room).emit('receive_message', data)
            cb({ success: true, message: "Message sent sucessfully!" })
        })
    })
}
module.exports = handleSocketIO
