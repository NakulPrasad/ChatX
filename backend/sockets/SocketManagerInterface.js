class SocketManagerInterface {
    handleJoinRoom(socket, data, cb) {
        throw new Error('Method not implemented');
    }

    handleDisconnect(socket) {
        throw new Error('Method not implemented');
    }

    handleRequestChatroomUsers(data, cb) {
        throw new Error('Method not implemented');
    }

    handleSendMessage(socket, data, cb) {
        throw new Error('Method not implemented');
    }
}

module.exports = SocketManagerInterface;
