const CommunicationInterface = require("../interfaces/communicationInterface");

/**
 * Adapter for HTTP communication that implements the CommunicationInterface.
 * Handles room joining, disconnection, sending messages, and fetching chat room users via HTTP.
 * @extends {CommunicationInterface}
 */
class HTTPAdapter extends CommunicationInterface {
    /**
     * Creates an instance of HTTPAdapter.
     * @param {http.Server} httpServer - The HTTP server instance to handle communication.
     */
    constructor(httpServer) {
        super();
        this.httpServer = httpServer;
        // Initialize HTTP server to handle communication
    }

    /**
     * Handles joining a chat room via an HTTP request.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     */
    handleJoinRoom(req, res) {
        const { roomId, username } = req.body;
        console.log(`HTTP: User ${username} joining room ${roomId}`);
        res.send(`User ${username} joined room ${roomId}`);
    }

    /**
     * Handles disconnecting from a chat room via an HTTP request.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     */
    handleDisconnect(req, res) {
        const { roomId, username } = req.body;
        console.log(`HTTP: User ${username} disconnecting from room ${roomId}`);
        res.send(`User ${username} disconnected from room ${roomId}`);
    }

    /**
     * Handles sending a message via an HTTP request.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     */
    handleSendMessage(req, res) {
        const { roomId, message, senderName } = req.body;
        console.log(`HTTP: Sending message from ${senderName} to room ${roomId}: ${message}`);
        res.send(`Message from ${senderName} sent to room ${roomId}`);
    }

    /**
     * Fetches users in a chat room via an HTTP request.
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     */
    getChatRoomUsers(req, res) {
        const { roomId } = req.params;
        console.log(`HTTP: Fetching users for room ${roomId}`);
        res.send(`List of users in room ${roomId}`);
    }
}

module.exports = HTTPAdapter;
