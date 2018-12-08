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
}).defineModel('todo', {
  owner: 'John Doe',
  todos: [
    { id: 'lxgiis23', content: 'Get Milk' }
  ]
})

pocktails.revive()

app.use('/sdk', express.static(__dirname + '/../sdk'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/todo', (req, res) => {
  res.sendFile(__dirname + '/todo.html')
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
