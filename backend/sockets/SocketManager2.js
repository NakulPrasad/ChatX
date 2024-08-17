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

            // Set client's roomId and subscribe to the chat roomId
            client.joinRoom(roomId, username)
            console.log("Client added to roomId", client);
            chatRoom.subscribe(client)
            console.log("Client subscribed to roomId", chatRoom.getAllUsers());

            // Add user to the chat roomId
            chatRoom.addUser(client);
            console.log('Client added as user in current roomId', chatRoom.getRoomUsers(client.roomId));

            // Geet the user
            const createdAt = Date.now();
            const chatBotMessage = generateChatBotMessage(username)
            const messageToSend = { sender_name: chatBotName, content: chatBotMessage, roomId, createdAt }
            chatRoom.sendMessages(roomId, messageToSend, socket)

            io.to(roomId).emit('join_room_greet', {
                message: `${username} joined`,
                username: username,
            })
            // console.log("Greet User,", messageToSend);

            // Save the message to db
            // saveMessage(roomId, messageToSend)
            // console.log('Greet Message Saved to db', getMessages(roomId));


            // Send previous messages to the user
            const previousMessages = getMessages(roomId)
            socket.emit('previousMessages', previousMessages)
            console.log("Send Previous Messages", previousMessages);

            cb({ success: true, message: 'Joined roomId successfully!', user: { id: socket.id, username, roomId } });
        })

        socket.on('disconnect', () => {
            const disconnected_user = chatRoom.unsubscribe(socket.id)
            console.log("Disconnected User", disconnected_user);

            if (disconnected_user) {
                // Notify others in the roomId about the disconnection
                const msgToSend = {
                    sender_name: chatBotName,
                    content: `${disconnected_user.username} Disconnected`,
                    roomId: disconnected_user.roomId,
                    createdAt: Date.now(),
                }
                chatRoom.sendMessages(disconnected_user.roomId, msgToSend, socket);
                console.log("Disconnect Event", msgToSend);
            }

        });

        socket.on('request_chatroom_users', (data, cb) => {
            if (!data) {
                cb({ success: false, message: "Invalid Request" })
                console.error("Invalid Request")
                return
            }

            const { roomId } = data
            if (!roomId) {
                cb({ success: false, message: "Room Invalid" })
                console.error("Invalid Room")
                return
            }
            // Fetch users in the roomId
            const chatRoomUsers = chatRoom.getRoomUsers(roomId);
            cb({ success: true, users: chatRoomUsers })

        })

        socket.on('send_message', (data, cb) => {
            const { sender_name, content, roomId, createdAt } = data
            if (!sender_name || !content || !roomId || !createdAt) {
                cb({ success: false, message: "Missing data fields" })
                return
            }

            // Notify others in the roomId about the message
            chatRoom.sendMessages(roomId, { sender_name, content, roomId, createdAt }, socket)

            // Save Message to db
            saveMessage(roomId, { sender_name, content, roomId, createdAt })
            cb({ success: true, message: "Message sent successfully!" })
        })
        // socket.on('send_message', (data, cb) => {
        //     console.log("Receive Message by user", data);
        //     const { sender_name, content, roomId, createdAt } = data
        //     if (!sender_name || !content || !roomId || !createdAt) {
        //         cb({ success: false, message: "Missing data fields" })
        //         return
        //     }
        //     console.log(roomId);
        //     socket.to(roomId).emit('receive_message', { sender_name, content, roomId, createdAt })
        //     saveMessage(roomId, { sender_name, content, roomId, createdAt })
        //     cb({ success: true, message: "Message sent successfully!" })
        // })



    })
    return io
}
module.exports = getSocketIo
