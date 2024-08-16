const messageStore = {}

const saveMessage = (roomId, message) => {
    if (!messageStore[roomId]) {
        messageStore[roomId] = []
    }
    messageStore[roomId].push(message)
}

const getMessages = (roomId) => {
    return messageStore[roomId] || []
}

module.exports = { saveMessage, getMessages };