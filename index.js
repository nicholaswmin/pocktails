'use strict'

const fs = require('fs')
const pathval = require('pathval')
const jsondiffpatch = require('jsondiffpatch')

class Pocktails {
  constructor(io) {
    this.models = {}
    this.io = io
    this.filename = '.diffs.pocktails'

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

  revive() {
    fs.readFileSync(this.filename, { encoding: 'utf8' })
      .split('\n')
      .filter(str => str)
      .map(JSON.parse)
      .forEach(diff => {
        jsondiffpatch.patch(this.models[diff.modelName], diff.delta)
      })
  }

  applyOperation({ type, modelName, path, value }) {
    const model = this.models[modelName]
    const current = this._deepCloneObject(model)

    // @TODO Use `.defineOperation(type: Operation)`, see Open/Closed OOP princ.
    switch (type) {
      case 'set':
        pathval.setPathValue(model, path, value)
        break;

      case 'push':
        const arr = pathval.getPathValue(model, path)

        arr.push(value)
        break;

      default:
        console.error('Unrecognized operation type:', operation.type)
    }


    const diff = this._getDiff(modelName, current, model)

    this._persistDiff(diff)

    return diff
  }

  _getDiff(modelName, prevModel, newModel) {
    const delta = jsondiffpatch.diff(prevModel, newModel)

    return { modelName, delta }
  }

  _persistDiff(diff) {
    fs.appendFileSync(this.filename, JSON.stringify(diff) + '\n')
  }

  _deepCloneObject(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}

module.exports = Pocktails
