const express = require('express')
const ejs = require('ejs');
const bodyParser = require('body-parser')
const mongoSanitize = require('express-mongo-sanitize')
const app = express()

const controllers = require("./src/controllers")

const port = process.env.NODE_DOCKER_PORT || 8080;


app.set('view engine', 'ejs');
app.set("views", "./src/views")
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(mongoSanitize())

app.use('/', controllers)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})