const ChatServiceInterface = require('../interfaces/ChatServiceInterface.js')
const { getMessages } = require('../utils/messageStore.js')
const ChatRoom = require('../observers/ChatRoom')
const Client = require('../observers/Client')
const HTTPService = require('../service/HTTPService.js')
/**
 * Adapter for HTTP communication that implements the ChatServiceInterface.
 * Handles room joining, disconnection, sending messages, and fetching chat room users via HTTP.
 * @extends {ChatServiceInterface}
 */
class HTTPAdapter extends ChatServiceInterface {
  /**
   * extends the ChatServiceInterface.
   * @constructor
   * @param {http.Server} httpServer - Accepts http server
   */
  constructor(httpServer) {
    super()
    this.httpServer = httpServer
    this.chatRoom = new ChatRoom()
    this.httpService = new HTTPService()
  }

  /**
   * Handles joining a chat room via an HTTP request.
   * @param {object} req - request object
   * @param {object} res - response object
   */
  handleJoinRoom(req, res) {
    const { roomId, username, sessionId } = req.body
    if (!username || !roomId) {
      console.error('Invalid username or roomId:', username)
      return
    }
    this.client = new Client(sessionId)
    this.client.joinRoom(roomId, username)
    this.chatRoom.subscribe(this.client)
    this.chatRoom.addUser(this.client)

    this.chatRoom.joinRoomMessageHttp(roomId, {
      message: `${username} joined`,
      username
    })
    const previousMessages = getMessages(roomId)
    // this.chatRoom.notifyHTTP('previousMessages', roomId, message, req.sessionId)
    this.httpService.postNotification(roomId, previousMessages)

    console.log(`HTTP: User ${username} joining room ${roomId}`)
    res.send(`User ${username} joined room ${roomId}`)
  }

  /**
   * Handles disconnecting from a chat room via an HTTP request.
   * @param {object} req -  request object
   * @param {object} res - response object
   */
  handleDisconnect(req, res) {
    const { roomId, username } = req.body
    console.log(`HTTP: User ${username} disconnecting from room ${roomId}`)
    res.send(`User ${username} disconnected from room ${roomId}`)
  }

  /**
   * Handles sending a message via an HTTP request.
   * @param {object} req -  request object
   */
  handleSendMessage(req) {
    const { roomId, message, senderName } = req.body
    this.httpService.postMessage(roomId, message, senderName)
    console.log(`HTTP: Sending message from ${senderName} to room ${roomId}: ${message}`)
  }

  /**
   * Fetches users in a chat room via an HTTP request.
   * @param {object} req - request object
   * @param {object} res - response object
   */
  getChatRoomUsers(req, res) {
    const { roomId } = req.params
    // console.log(`HTTP: Fetching users for room ${roomId}`);
    res.send(`List of users in room ${roomId}`)
  }
}

module.exports = HTTPAdapter
