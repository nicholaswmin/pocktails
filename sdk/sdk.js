'use strict'

class Pocktails {
  constructor(url) {
    this.socket = io(url)
    this.models = {}
    this.listeners = {}

    this.socket.on('handshake', models => {
      this.models = models

      this.fireListener('handshake')
    })

    this.socket.on('operation', operation => {
      this.applyOperation(operation, true)
      this.fireListener('update')
    })
  }

  applyOperation(operation, doNotPublish) {
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

    if (doNotPublish) return

    this._publishOperation(operation)
  }

  set(modelName, path, value) {
    this.applyOperation({ type: 'set', modelName, path, value })
  }

  push(modelName, path, value) {
    this.applyOperation({ type: 'push', modelName, path, value })
  }

  splice(modelName, path, fromIndex, toIndex) {
    this.applyOperation({ type: 'splice', modelName, path, fromIndex, toIndex })
  }

  addEventListener(name, callback) {
    const existing = this.listeners[name]

    if (existing) {
      existing.push(callback)
    } else {
      this.listeners[name] = [callback]
    }
  }

  fireListener(name, data) {
    const listeners = this.listeners[name]

    if (listeners) {
      listeners.forEach(listener => listener(data))
    }
  }

  _publishOperation(operation) {
    this.socket.emit('operation', operation)
    this.fireListener('update')
  }
}
