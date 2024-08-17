const { Server } = require('socket.io')
const { getMessages, saveMessage } = require('../utils/messageStore.js')
const ChatRoom = require('../observers/ChatRoom.js')
const Client = require('../observers/Client.js')

const chatRoom = new ChatRoom()

const getSocketIo = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        },
        connectionStateRecovery: {}
    })

    const chatBotName = 'ChatBot'
    const generateChatBotMessage = (username) => { return `${username} joined` }

    io.on('connection', (socket) => {
        const client = new Client(socket.id)
        console.log("Client", client);

        socket.on('join_room', (data, cb) => {
            if (!data) {
                cb({ success: false, message: 'Invalid data' });
                console.error("Failed to join room:", data);
                return;
            }
            const { username, room } = data;
            if (!username || !room) {
                cb({ success: false, message: 'Invalid username or room' });
                console.error('Invalid username or room:', data);
                return;
            }
            // Check if username is already taken in the room
            if (chatRoom.getRoomUsers(room).find(user => user.username === username)) {
                cb({ success: false, message: 'Username already taken' })
                console.info('Username already taken')
                return
            }

            // Set client's room and subscribe to the chat room
            client.joinRoom(room, username)
            console.log("Client added to room", client);
            chatRoom.subscribe(client)
            console.log("Client subscribed to room", chatRoom.getAllUsers());

            // Add user to the chat room
            chatRoom.addUser(client);
            console.log('Client added as user in current room', chatRoom.getRoomUsers(client.room));

            // Geet the user
            const createdAt = Date.now();
            const chatBotMessage = generateChatBotMessage(username)
            const messageToSend = { sender_name: chatBotName, content: chatBotMessage, room, createdAt }
            chatRoom.sendMessages(room, messageToSend)
            // io.to(room).emit('join_room_greet', {
            //     message: `${username} joined`,
            //     username: username,
            // })
            // console.log("Greet User,", messageToSend);

            // Save the message to db
            // saveMessage(room, messageToSend)
            // console.log('Greet Message Saved to db', getMessages(room));


            // Send previous messages to the user
            const previousMessages = getMessages(room)
            socket.emit('previousMessages', previousMessages)
            console.log("Send Previous Messages", previousMessages);

            cb({ success: true, message: 'Joined room successfully!', user: { id: socket.id, username, room } });
        })

        socket.on('disconnect', () => {
            const disconnected_user = chatRoom.unsubscribe(socket.id)
            console.log("Disconnected User", disconnected_user);

            if (disconnected_user) {
                // Notify others in the room about the disconnection
                chatRoom.sendMessages(disconnected_user.room, {
                    sender_name: chatBotName,
                    content: "User Disconnected",
                    room: disconnected_user.room,
                    createdAt: Date.now(),
                });
            }

        });

        socket.on('request_chatroom_users', (data, cb) => {
            if (!data) {
                cb({ success: false, message: "Invalid Request" })
                console.error("Invalid Request")
                return
            }

            const { room } = data
            if (!room) {
                cb({ success: false, message: "Room Invalid" })
                console.error("Invalid Room")
                return
            }
            // Fetch users in the room
            const chatRoomUsers = chatRoom.getRoomUsers(room);
            cb({ success: true, users: chatRoomUsers })

        })

        socket.on('send_message', (data, cb) => {
            const { sender_name, content, room, createdAt } = data
            if (!sender_name || !content || !room || !createdAt) {
                cb({ success: false, message: "Missing data fields" })
                return
            }

            // Notify others in the room about the message
            chatRoom.sendMessages(room, { sender_name, content, room, createdAt })

            // Save Message to db
            saveMessage(room, { sender_name, content, room, createdAt })
            cb({ success: true, message: "Message sent successfully!" })
        })


    })
    return io
}
module.exports = getSocketIo
