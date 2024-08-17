const { Server } = require('socket.io')


const getSocketIo = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        },
    })
    return io
}
module.exports = getSocketIo