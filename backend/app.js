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
const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],

}
app.use(cors(corsOptions))
app.use(morgan('dev'));

//socket.io
const httpServer = createServer(app)
const socketManagerAdapter = new SocketManagerAdapter(httpServer);

app.get('/', (req, res) => {
    res.send('server working fine')
})

app.get('/rooms/:roomId/messages', (req, res) => {
    const roomId = req.params.roomId
    const messages = getMessages(roomId)
    res.json(messages)
})


httpServer.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})