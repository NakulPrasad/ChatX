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

    io.on('connection', (socket) => {
        socket.on('join_room', (data, cb) => {
            const { username, room } = data
            if (allUsers.find(user => user.username === username && user.room === room)) {
                cb({ sucess: false, message: 'Username already taken' })
                return
            }
            socket.join(room)


            socket.to(room).emit('join_room_greet', {
                message: `${username} joined`,
                username: username,
            })

            if (!allUsers.find(user => user.username === username && user.room === room))
                allUsers.push({ username, room, id: socket.id })

            cb({ success: true, message: 'Joined room successfully!', user: { id: socket.id, username, room } });
        })
        socket.on('disconnect', () => {
            console.log("disconnect", socket.id);

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
            console.log(room);
            if (!room) {
                cb({ success: false, message: "Room Invalid" })
                return
            }
            console.log(allUsers);
            console.log(allUsers[0]);
            let chatRoomUsers = allUsers.filter(user => {
                return user.room === room
            })
            console.log(chatRoomUsers)
            cb({ success: true, users: chatRoomUsers })

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
