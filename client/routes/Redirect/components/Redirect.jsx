import React from 'react'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'
import Loading from 'components/ux/Loading'
import ErrorMsg from 'components/ux/ErrorMsg'

class Redirect extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind('confirmEmail')

    const confirmEmailToken = this.props.location.query['emailConfirmationToken']
    if (confirmEmailToken) {
      this.confirmEmail(confirmEmailToken)
    }
  }

  confirmEmail (token) {
    this.debug('ConfirmEmail token:', token)
    this.props.actions.doConfirmEmail(token)
  }

  render () {
    this.debug('render')

    const errorMsg = this.props.state.redirect.error
    const msgId = this.props.state.redirect.msgId

    if (errorMsg) {
      return (
        <ErrorMsg msgId={errorMsg} />
      )
    } else if (msgId) {
      return (
        <FormattedMessage
          id={msgId}
          defaultMessage={msgId}
        />
      )
    } else {
      return (
        <Loading />
      )
    }
  }
}

module.exports = Redirect
