'use strict'

const pathval = require('pathval')
const jsondiffpatch = require('jsondiffpatch')

class Pocktails {
  constructor(io) {
    this.models = {}
    this.io = io

    this.io.on('connection', socket => {
      socket.emit('handshake', this.models)

      socket.on('operation', operation => {
        const diff = this.applyOperation(operation)

        socket.broadcast.emit('diff', diff)
      })
    })
  }

  defineModel(name, model) {
    Object.assign(this.models, {
      [name]: model
    })
  }

  applyOperation({ type, modelName, path, value }) {
    const model = this.models[modelName]
    const current = this._deepCloneObject(model)

    // @TODO Use `.defineOperation(type: Operation)`, see Open/Closed OOP princ.
    switch (type) {
      case 'set':
        pathval.setPathValue(model, path, value)

        return this._getDiff(modelName, current, model)
        break;

      case 'push':
        const arr = pathval.getPathValue(model, path)

        arr.push(value)

        return this._getDiff(modelName, current, model)
        break;

      default:
        console.error('Unrecognized operation type:', operation.type)
    }
  }

  _getDiff(modelName, prevModel, newModel) {
    const delta = jsondiffpatch.diff(prevModel, newModel)

    return { modelName, delta }
  }

  _deepCloneObject(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}

module.exports = Pocktails
