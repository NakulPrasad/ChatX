const Observable = require('./Observable')

class ChatServer extends Observable {
    constructor() {
        super()
    }

    sendMessages(roomId, message) {
        this.notify({ roomId, message })
    }
}

module.exports = ChatServer