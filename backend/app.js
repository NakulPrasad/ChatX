const express = require('express')
const dotenv = require('dotenv')
const helmet = require('helmet')

const app = express()

dotenv.config()
const PORT = process.env.PORT || 5000

app.use(helmet())

app.get('/', (req, res) => {
    res.send('server working fine')
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})