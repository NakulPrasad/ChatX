const SocketManagerInterface = require('./SocketManagerInterface.js');
const SocketIoSingleton = require('./SocketIoSingleton.js');


class SocketManagerAdapter extends SocketManagerInterface {
    constructor(httpServer) {
        super();
        this.socketIoInstance = SocketIoSingleton.getInstance(httpServer)
    }

    handleJoinRoom(socket, data, cb) {
        this.socketIoInstance.socketManager.handleJoinRoom(socket, data, cb);
    }

    handleDisconnect(socket) {
        this.socketIoInstance.socketManager.handleDisconnect(socket);
    }

    handleRequestChatroomUsers(data, cb) {
        this.socketIoInstance.socketManager.handleRequestChatroomUsers(data, cb);
    }

    handleSendMessage(socket, data, cb) {
        this.socketIoInstance.socketManager.handleSendMessage(socket, data, cb);
    }
}

module.exports = SocketManagerAdapter;
