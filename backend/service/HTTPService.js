/**
 * Service for HTTP to handle events and communcation with other users
 */
class HTTPService {
  postNotification(roomId, notification) {
    console.log(`HTTP: Sent notification to room ${roomId}: ${notification}`)
  }

  postMessage(roomId, message, senderName) {
    console.log(`HTTP: Sent message to room ${roomId}: ${message}`)
    // res.send(`Message from ${senderName} sent to room ${roomId}`)
  }

  fetchUsers(roomId) {
    console.log(`HTTP: Fetching users in room ${roomId}`)
    return []
  }
}

module.exports = HTTPService
