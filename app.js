const express = require('express')
const app = express()
const port = 3000

var pictureController = require('./picture')

app.get('/', (req, res) => res.send('Hello sdf!'))

app.use('/picture', pictureController)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))