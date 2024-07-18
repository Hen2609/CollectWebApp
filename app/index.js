const express = require('express')
let ejs = require('ejs');

const app = express()

const port = process.env.NODE_DOCKER_PORT || 8080;

const controllers = require('./src/controllers')

app.set('view engine', 'ejs');
app.set("views", "./src/views")
app.use('/', controllers)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})