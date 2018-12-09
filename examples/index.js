'use strict'

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const Pocktails = require('../index.js')
const pocktails = new Pocktails(io)

pocktails
.defineModel('todos', {
  items: [
    { id: '64bbd83a-b1ed-4254-9aee-1e4e6d85fdb7', content: 'Get Milk' }
  ]
})
.defineModel('chat', {
  persons: [],
  messages: []
})
.reviveAll()

app.use('/sdk', express.static(__dirname + '/../sdk'))
app.use('/examples', express.static(__dirname + '/../examples/'))

http.listen(3000, () => console.log('Visit: http://localhost:3000/examples'))
