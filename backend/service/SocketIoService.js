const chatServiceInterface = require('../interfaces/ChatServiceInterface')
const ChatRoom = require('../observers/ChatRoom.js')
const Client = require('../observers/Client.js')
const { getMessages, saveMessage } = require('../utils/messageStore.js')
const { Server } = require('socket.io')
const dotenv = require('dotenv')

dotenv.config()

const allowedOrigins = process.env.ORIGINS?.split('|') || [
  'http://localhost:5173',
  'https://current-bridie-nakul-384e1fc1.koyeb.app',
  'https://nakulprasad.github.io/ChatX/',
  'https://chat-x-dun.vercel.app'
]

/**
 * Service for Socket.IO that implements the chatServiceInterface.
 * Handles socket events and communication within the chat application.
 * @extends {chatServiceInterface}
 */
class SocketIoService extends chatServiceInterface {
  /**
   * Creates an instance of SocketIoService.
   * @param {http.Server} httpServer - The HTTP server to attach Socket.IO to.
   */
  constructor (httpServer) {
    super()
    this.io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
      }
    })
    this.chatRoom = new ChatRoom()
    this.setupListeners()
  }

  /**
   * Sets up listeners for socket events.
   * @private
   */
  setupListeners () {
    this.io.on('connection', (socket) => {
      this.client = new Client(socket.id)
      this.handleConnection(socket)
    })
  }

  /**
   * Handles socket connection events and sets up event handlers.
   * @param {Socket} socket - The socket instance representing the connected client.
   */
  handleConnection (socket) {
    socket.on('join_room', (data, cb) => this.handleJoinRoom(socket, data, cb))
    socket.on('disconnect', () => this.handleDisconnect(socket))
    socket.on('requestChatroomUsers', (data, cb) => this.handleGetChatroomUsers(data, cb))
    socket.on('sendMessage', (data, cb) => this.handleSendMessage(socket, data, cb))
  }

  /**
   * Handles a socket joining a room.
   * @param {Socket} socket - The socket instance representing the connected client.
   * @param {object} data - The data provided by the client when joining a room.
   * @param {Function} [cb] - The callback function to be executed after the join room operation.
   */
  handleJoinRoom (socket, data, cb = () => { }) {
    if (!data) {
      cb({ success: false, message: 'Invalid data' })
      console.error('Failed to join roomId:', data)
      return
    }

    const { username, roomId } = data

    if (!username || !roomId) {
      cb({ success: false, message: 'Invalid username or roomId' })
      console.error('Invalid username or roomId:', data)
      return
    }

    if (this.chatRoom.getRoomUsers(roomId).some(user => user.username === username)) {
      cb({ success: false, message: 'Username already taken' })
      console.info('Username already taken:', username)
      return
    }

    this.client.joinRoom(roomId, username)
    this.chatRoom.subscribe(this.client)
    this.chatRoom.addUser(this.client)

    this.chatRoom.joinRoomMessage(roomId, {
      message: `${username} joined`,
      username
    }, this.io)

    const previousMessages = getMessages(roomId)
    socket.emit('previousMessages', previousMessages)

    cb({ success: true, message: `Joined ${roomId} successfully!`, user: { id: socket.id, username, roomId } })
  }

  /**
   * Handles the disconnection of a socket.
   * @param {Socket} socket - The socket instance representing the disconnected client.
   */
  handleDisconnect (socket) {
    const disconnectedUser = this.chatRoom.unsubscribe(socket.id)
    if (disconnectedUser) {
      this.chatRoom.userDisconnect(disconnectedUser.roomId, {
        message: `${disconnectedUser.username} Disconnected`
      }, this.io)
    }
  }

  /**
   * Handles a request for chatroom users.
   * @param {object} data - The data containing chatroom information.
   * @param {Function} [cb] - Callback executed with the list of users.
   */
  handleGetChatroomUsers (data, cb = () => { }) {
    if (!data) {
      cb({ success: false, message: 'Invalid Request' })
      console.error('Invalid Request:', data)
      return
    }

    const { roomId } = data

    if (!roomId) {
      cb({ success: false, message: 'Room Invalid' })
      console.error('Invalid roomId:', roomId)
      return
    }

    const chatRoomUsers = this.chatRoom.getRoomUsers(roomId)
    cb({ success: true, users: chatRoomUsers })
  }

  /**
   * Handles sending a message through the socket.
   * @param {Socket} socket - The socket instance representing the connected client.
   * @param {object} data - The data containing the message information.
   * @param {Function} [cb] - Callback executed after the message is sent.
   */
  handleSendMessage (socket, data, cb = () => { }) {
    if (!data) {
      cb({ success: false, message: 'Invalid data' })
      console.error('Failed to send message:', data)
      return
    }

    const { sender_name, content, roomId, createdAt } = data

    if (!sender_name || !content || !roomId || !createdAt) {
      cb({ success: false, message: 'Missing data fields' })
      console.error('Missing data fields:', data)
      return
    }

    this.chatRoom.sendMessages(roomId, { sender_name, content, roomId, createdAt }, this.io, socket.id)
    saveMessage(roomId, { sender_name, content, roomId, createdAt })
    cb({ success: true, message: 'Message sent successfully!' })
  }
}

module.exports = SocketIoService
