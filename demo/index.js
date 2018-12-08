'use strict'

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const Pocktails = require('../index.js')

const pocktails = new Pocktails(io)

pocktails.defineModel('todos', {
  items: [
    { id: '64bbd83a-b1ed-4254-9aee-1e4e6d85fdb7', content: 'Get Milk' }
  ]
})

// Revive model from previous disk-persisted operations
pocktails.revive()

app.use('/sdk', express.static(__dirname + '/../sdk'))

app.get('/demo', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

http.listen(3000, () => {
  console.log('Success! Visit *:3000/demo')
})
