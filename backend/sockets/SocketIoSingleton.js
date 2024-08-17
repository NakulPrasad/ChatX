const { Server } = require('socket.io');
const SocketManager = require('./SocketManager');
class SocketIoSingleton {
    constructor(httpServer) {
        if (SocketIoSingleton.instance) {
            return SocketIoSingleton.instance;
        }

        this.io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"]
            },
        });

        this.socketManager = new SocketManager(this.io);

        SocketIoSingleton.instance = this;
    }

    static getInstance(httpServer) {
        if (!SocketIoSingleton.instance) {
            new SocketIoSingleton(httpServer);
        }
        return SocketIoSingleton.instance;
    }
}

module.exports = SocketIoSingleton;
