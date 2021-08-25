const express = require('express')
const morgan = require('morgan')
const app = express()
// morgan config
app.use(morgan('dev'))
// dotenv config
require('dotenv').config()
// port config
const port = 3000

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' })
})
app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`)
})

