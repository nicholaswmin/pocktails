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

    this.socket.on('diff', diff => {
      jsondiffpatch.patch(this.models[diff.modelName], diff.delta)
      this.fireListener('update')
    })
  }

  set(modelName, path, value) {
    pathval.setPathValue(this.models[modelName], path, value)

    this._publishOperation({ type: 'set', modelName, path, value })
  }

  push(modelName, path, value) {
    const model = this.models[modelName]
    const arr = pathval.getPathValue(model, path)

    arr.push(value)

    this._publishOperation({ type: 'push', modelName, path, value })
  }

  splice(modelName, path, fromIndex, toIndex) {
    const model = this.models[modelName]
    const arr = pathval.getPathValue(model, path)

    arr.splice(fromIndex, toIndex)

    this._publishOperation({
      type: 'splice',
      modelName,
      path,
      fromIndex,
      toIndex
    })
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
