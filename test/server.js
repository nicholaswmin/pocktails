'use strict'

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const Pocktails = require('../index.js')

const pocktails = new Pocktails(io)

pocktails.defineModel('person', {
  name: 'John Doe',
  age: 13,
  children: [
    'Foo',
    'Bar'
  ]
})

app.use('/sdk', express.static(__dirname + '/../sdk'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
