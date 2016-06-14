import React from 'react'

import BaseComponent from 'core/BaseComponent'
import Loading from 'components/ux/Loading'
import ErrorMsg from 'components/ux/ErrorMsg'
import SuccessMsg from 'components/ux/SuccessMsg'

class Confirmation extends BaseComponent {
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

    const errorMsgId = this.props.state.confirmation.errorMsgId
    const successMsgId = this.props.state.confirmation.successMsgId

    if (errorMsgId) {
      return (
        <ErrorMsg msgId={errorMsgId} />
      )
    } else if (successMsgId) {
      return (
        <SuccessMsg msgId={successMsgId} />
      )
    } else {
      return (
        <Loading />
      )
    }
  }
}

module.exports = Confirmation
