const express = require('express')
const app = express()

const port = process.env.NODE_DOCKER_PORT || 8080;

const api = require('./src/endpoints','/api')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', api)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})