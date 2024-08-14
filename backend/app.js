const express = require('express')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const { createServer } = require('node:http')
const handleSocketIO = require('./sockets/socketHandler.js')

const app = express()

dotenv.config()
const PORT = process.env.PORT || 5000

//middlewaares
app.use(helmet())
const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],

}
app.use(cors(corsOptions))
app.use(morgan('dev'))

//socket.io
const httpServer = createServer(app)
handleSocketIO(httpServer)


app.get('/', (req, res) => {
    res.send('server working fine')
})

httpServer.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})