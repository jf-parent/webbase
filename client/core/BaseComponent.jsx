import { Component } from 'react'

class BaseComponent extends Component {

  _bind (...methods) {
    // eslint-disable-next-line
    methods.forEach((method) => this[method] = this[method].bind(this))
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

  _initLogger (level = 'debug') {
    this._loggerName = this.constructor.name
    this._logger = require('loglevel').getLogger(this._loggerName)

    if (__DEV__) {
      this._logger.setLevel(level)
    } else {
      this._logger.setLevel('error')
    }
  }
}

module.exports = BaseComponent
