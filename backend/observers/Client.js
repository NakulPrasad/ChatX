const Observer = require('./Observer')

class Client extends Observer {
    constructor(socket) {
        super()
        this.socket = socket
    }

    update(notification) {
        const { message, roomId } = notification
        if (this.socket.roomId === roomId) {
            console.log(`Received new message: ${message}`);

        }
    }
}

module.exports = Client;
