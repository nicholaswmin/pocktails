'use strict'

const fs = require('fs')
const pathval = require('pathval')

class Pocktails {
  constructor(io) {
    this.models = {}
    this.io = io
    this.filename = '.operations.pocktails'

    this.io.on('connection', socket => {
      socket.emit('handshake', this.models)

      socket.on('operation', operation => {
        this._applyOperation(operation)

        socket.broadcast.emit('operation', operation)
      })
    })
  }

  defineModel(name, model) {
    Object.assign(this.models, {
      [name]: model
    })

    return this
  }

  revive() {
    if (!fs.existsSync(this.filename)) return

    fs.readFileSync(this.filename, { encoding: 'utf8' })
      .split('\n')
      .filter(str => str)
      .map(JSON.parse)
      .forEach(operation => {
        this._applyOperation(operation, true)
      })
  }

  _applyOperation(operation, doNotPersist) {
    const model = this.models[operation.modelName]

    // @TODO Use `.defineOperation(type: Operation)`, see Open/Closed OOP princ.
    switch (operation.type) {
      case 'set': {
        pathval.setPathValue(model, operation.path, operation.value)
        break;
      }

      case 'push': {
        const arr = pathval.getPathValue(model, operation.path)

        arr.push(operation.value)
        break;
      }

      case 'splice': {
        const model = this.models[operation.modelName]
        const arr = pathval.getPathValue(model, operation.path)

        arr.splice(operation.fromIndex, operation.toIndex)
        break;
      }

      default:
        console.error('Unrecognized operation type:', operation.type)
    }

    if (doNotPersist) return

    this._persistOperation(operation)
  }

  _persistOperation(operation) {
    fs.appendFileSync(this.filename, JSON.stringify(operation) + '\n')
  }
}

module.exports = Pocktails
