const express = require('express')
const ejs = require('ejs');
const bodyParser = require('body-parser')

const app = express()

const port = process.env.NODE_DOCKER_PORT || 8080;

const controllers = require('./src/controllers')

app.set('view engine', 'ejs');
app.set("views", "./src/views")
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(mongoSanitize())

app.use('/', controllers)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})