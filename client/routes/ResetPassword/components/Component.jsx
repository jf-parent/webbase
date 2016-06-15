import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

import SuccessMsg from 'components/ux/SuccessMsg'
import ErrorMsg from 'components/ux/ErrorMsg'
import LaddaButton from 'components/ux/LaddaButton'
import PasswordInput from 'components/ux/PasswordInput'
import SecureFormStyle from 'components/ux/SecureFormStyle.postcss'
import SecureForm from 'components/ux/SecureForm'
import BaseComponent from 'core/BaseComponent'
import Loading from 'components/ux/Loading'

const resetPasswordMessages = defineMessages({
  passwordPlaceholder: {
    id: 'general.PasswordPlaceholder',
    defaultMessage: 'Password'
  }
})

class ResetPassword extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind('enableButton', 'disableButton', 'onSubmit')

    const resetPasswordToken = this.props.location.query['resetPasswordToken']
    this._resetPasswordToken = null
    if (resetPasswordToken) {
      this._resetPasswordToken = resetPasswordToken
    }
  }

  onSubmit (event) {
    event.preventDefault()
    this.debug('onSubmit')

    let data = this.refs.form.getModel()
    data.reset_password_token = this._resetPasswordToken

    this.props.actions.doResetPassword(data)
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
    if (this.props.state.resetpassword.successMsgId) {
      return (
        <SuccessMsg msgId={this.props.state.resetpassword.successMsgId} />
      )

    // LOADING
    } else if (this.props.state.resetpassword.loading) {
      return (
        <Loading />
      )

    // RESET PASSWORD
    } else {
      const errorMsg = this.props.state.resetpassword.errorMsgId ? <ErrorMsg msgId={this.props.state.resetpassword.errorMsgId} /> : null
      const { formatMessage } = this._reactInternalInstance._context.intl
      const passwordPlaceholder = formatMessage(resetPasswordMessages.passwordPlaceholder)

      return (
        <SecureForm ref='form' onValid={this.enableButton} onInvalid={this.disableButton} session={this.props.state.session}>
          <h2 className={SecureFormStyle['form-signin-heading']}>

            <FormattedMessage
              id='resetpassword.ResetPasswordHeader'
              defaultMessage='New password'
            />
          </h2>
          <PasswordInput type='password' name='password' placeholder={passwordPlaceholder} required />
          <LaddaButton ref='button' isDisabled isLoading={this.props.state.resetpassword.loading} onSubmit={this.onSubmit}>
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

module.exports = ResetPassword
