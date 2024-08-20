/**
 * @fileoverview This script sets up and configures an Express server with middleware, 
 * serves static files in production mode, and sets up a Socket.IO server for real-time communication.
 */

const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('node:path');
const cors = require('cors');
const { createServer } = require('node:http');
const { getMessages } = require('./utils/messageStore.js');
const HTTPAdapter = require('./adapters/HTTPAdapter.js');
const SocketIoService = require('./service/SocketIoService.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());

const allowedOrigins = process.env.ORIGINS?.split('|') || ['*'];
const corsOptions = {
    origin: allowedOrigins,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));

// middleware to set Content Security Policy
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' blob:;");
    next();
});

// Socket.IO setup
const httpServer = createServer(app);
const chatApp = new SocketIoService(httpServer);

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    // Serve static files in production mode
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'), (err) => {
            if (err) {
                console.error('Error sending index.html:', err);
                res.status(500).send('Server Error');
            }
        });
    });
} else {
    // Development mode response
    // Serve static files from the "docs" directory
    app.use(express.static(path.join(__dirname, 'docs')));
    app.get('/', (req, res) => {
        // res.send('Development mode: Server is running but not serving static files');
        res.sendFile(path.join(__dirname, 'docs', 'index.html'));
    });
}

/**
 * Route to get messages from a specific room.
 * 
 * @route GET /rooms/:roomId/messages
 * @param {string} roomId - The ID of the chat room.
 * @returns {Array<Object>} - The messages in the specified room.
 */
app.get('/rooms/:roomId/messages', (req, res) => {
    const roomId = req.params.roomId;

    try {
        const messages = getMessages(roomId);

        if (!messages) {
            console.warn(`No messages found for room: ${roomId}`);
            return res.status(404).json({ error: 'No messages found for this room' });
        }

        res.json(messages);
    } catch (error) {
        console.error(`Error fetching messages for room ${roomId}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${isProduction ? 'production' : 'development'} mode`);
});
