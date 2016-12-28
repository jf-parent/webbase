import { Component } from 'react'

class BaseComponent extends Component {

  _bind (...methods) {
    methods.map((method) => {
      try {
        this[method] = this[method].bind(this)
      } catch (e) {
        this.error(`the method("${method}") is not defined in the class; See the _bind method in the constructor of ${this.constructor.name}.`)
      }
    })
  }

  trace (...msg) {
    this._logger.trace(`[${this._loggerName}] `, ...msg)
  }

  debug (...msg) {
    this._logger.debug(`[${this._loggerName}] `, ...msg)
  }

  info (...msg) {
    this._logger.info(`[${this._loggerName}] `, ...msg)
  }

  warn (...msg) {
    this._logger.warn(`[${this._loggerName}] `, ...msg)
  }

  error (...msg) {
    this._logger.error(`[${this._loggerName}] `, ...msg)
  }

  _initLogger () {
    this._loggerName = this.constructor.name
    this._logger = require('loglevel').getLogger(this._loggerName)

    this._logger.setLevel(__LOGLEVEL__)
  }
}

module.exports = BaseComponent
