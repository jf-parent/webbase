import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

import ErrorMsg from 'components/ux/ErrorMsg'
import SuccessMsg from 'components/ux/SuccessMsg'
import LaddaButton from 'components/ux/LaddaButton'
import ValidatedInput from 'components/ux/Input'
import SecureFormStyle from 'components/ux/SecureFormStyle.postcss'
import SecureForm from 'components/ux/SecureForm'
import BaseComponent from 'core/BaseComponent'
import Loading from 'components/ux/Loading'

const forgottenPasswordMessages = defineMessages({
  emailPlaceholder: {
    id: 'general.EmailPlaceholder',
    defaultMessage: 'Email address'
  }
})

class ForgottenPassword extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind('enableButton', 'disableButton', 'onSubmit', 'validateResetPasswordToken')

    const resetPasswordToken = this.props.location.query['resetPasswordToken']
    if (resetPasswordToken) {
      this.validateResetPasswordToken(resetPasswordToken)
    }
  }

  validateResetPasswordToken (resetPasswordToken) {
    this.debug('resetPasswordToken:', resetPasswordToken)
    this.props.actions.doValidateResetPasswordToken({ token: this.props.state.session.token, reset_password_token: resetPasswordToken })
  }

  componentWillUnmount () {
    this.debug('componentWillUnmount')
    this.props.actions.resetForgottenPasswordState()
  }

  onSubmit (event) {
    event.preventDefault()
    this.debug('onSubmit')

    this.props.actions.doSendResetPasswordToken(this.refs.form.getModel())
  }

  enableButton () {
    this.debug('enableButton')
    this.refs.button.setState({ isDisabled: false })
  }

  disableButton () {
    this.debug('disableButton')
    this.refs.button.setState({ isDisabled: true })
  }

  render () {
    this.debug('render')

    // SUCCESS
    if (this.props.state.forgottenpassword.successMsgId) {
      return (
        <SuccessMsg msgId={this.props.state.forgottenpassword.successMsgId} />
      )

    // LOADING
    } else if (this.props.state.forgottenpassword.loading) {
      return (
        <Loading />
      )

    // SEND RESET PASSWORD TOKEN
    } else {
      const { formatMessage } = this._reactInternalInstance._context.intl
      const emailPlaceholder = formatMessage(forgottenPasswordMessages.emailPlaceholder)
      const errorMsg = this.props.state.forgottenpassword.errorMsgId ? <ErrorMsg msgId={this.props.state.forgottenpassword.errorMsgId} /> : null

      return (
        <SecureForm ref='form' onValid={this.enableButton} onInvalid={this.disableButton} session={this.props.state.session}>
          <h2 className={SecureFormStyle['form-signin-heading']}>

            <FormattedMessage
              id='forgottenPassword.SubmitSendResetPasswordToken'
              defaultMessage='Reset my password'
            />
          </h2>
          <ValidatedInput type='email' name='email' placeholder={emailPlaceholder} validations='isEmail' required autoFocus />
          <LaddaButton ref='button' isDisabled isLoading={this.props.state.forgottenpassword.loading} onSubmit={this.onSubmit}>
            <FormattedMessage
              id='general.SubmitBtn'
              defaultMessage='Submit'
            />
          </LaddaButton>
          <center>{errorMsg}</center>
        </SecureForm>
      )
    }
  }
}

module.exports = ForgottenPassword
