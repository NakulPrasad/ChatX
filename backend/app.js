const express = require('express')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const { createServer } = require('node:http')
const { getMessages } = require('./utils/messageStore.js')
const SocketManagerAdapter = require('./sockets/SocketManagerAdapter.js')

const app = express()

dotenv.config()
const PORT = process.env.PORT || 5000

//middlewares
app.use(helmet())
const ORIGINS = process.env.ORIGINS.split('|');
const corsOptions = {
    origin: ORIGINS,

}
app.use(cors(corsOptions))
app.use(morgan('dev'));

//socket.io
const httpServer = createServer(app)
const socketManagerAdapter = new SocketManagerAdapter(httpServer);

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {

    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Development mode: Server is running but not serving static files');
    });
}


app.get('/rooms/:roomId/messages', (req, res) => {
    const roomId = req.params.roomId
    const messages = getMessages(roomId)
    res.json(messages)
})


httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${isProduction ? 'production' : 'development'} mode`);
})