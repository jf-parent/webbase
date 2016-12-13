import React from 'react'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'

import MaterialInput from 'components/ux/MaterialInput'
import ErrorMsg from 'components/ux/ErrorMsg'
import SuccessMsg from 'components/ux/SuccessMsg'
import LaddaButton from 'components/ux/LaddaButton'
import BaseComponent from 'core/BaseComponent'
import Loading from 'components/ux/Loading'
import { RE_EMAIL } from 'routes/Login/components/Component'

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
    this._bind(
      'isFormValid',
      'onEmailChange',
      'onSubmit',
      'validateResetPasswordToken'
    )

    this.state = {
      isFormValid: false,
      emailValidationState: 'warning',
      emailValue: ''
    }

    const resetPasswordToken = this.props.location.query['resetPasswordToken']
    if (resetPasswordToken) {
      this.validateResetPasswordToken(resetPasswordToken)
    }
  }

  componentWillUnmount () {
    this.props.actions.resetForgottenPasswordState()
  }

  validateResetPasswordToken (resetPasswordToken) {
    this.debug('resetPasswordToken:', resetPasswordToken)
    this.props.actions.doValidateResetPasswordToken({
      token: this.props.state.session.token,
      reset_password_token: resetPasswordToken
    })
  }

  onSubmit (event) {
    event.preventDefault()
    let data = {
      token: this.props.state.session.token,
      email: this.state.emailValue
    }
    this.props.actions.doSendResetPasswordToken(data)
  }

  isFormValid (emailValidationState) {
    if (emailValidationState === 'success') {
      return true
    } else {
      return false
    }
  }

  onEmailChange (event) {
    const emailValue = event.target.value
    let emailValidationState
    if (emailValue === '') {
      emailValidationState = 'warning'
    } else {
      if (RE_EMAIL.test(emailValue)) {
        emailValidationState = 'success'
      } else {
        emailValidationState = 'error'
      }
    }

    let isFormValid = this.isFormValid(emailValidationState)
    this.setState({isFormValid, emailValidationState, emailValue})
  }

  render () {
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
      const { formatMessage } = this.props.intl
      const emailPlaceholder = formatMessage(forgottenPasswordMessages.emailPlaceholder)
      const errorMsg = this.props.state.forgottenpassword.errorMsgId ? <ErrorMsg msgId={this.props.state.forgottenpassword.errorMsgId} /> : null

      return (
        <div style={{marginTop: '1em'}}>
          <form>
            <div className='row'>
              <div className='medium-6 columns'>
                <h2 name='forgotten-password-page'>
                  <FormattedMessage
                    id='forgottenPassword.SubmitSendResetPasswordToken'
                    defaultMessage='Reset my password'
                  />
                </h2>
              </div>
            </div>
            <div className='row'>
              <div className='medium-6 columns'>
                <MaterialInput
                  label={emailPlaceholder}
                  type='text'
                  validationState={this.state.emailValidationState}
                  onChange={this.onEmailChange}
                />
              </div>
            </div>
            <div className='row'>
              <div className='medium-6 columns'>
                <LaddaButton isDisabled={!this.state.isFormValid} isLoading={this.props.state.forgottenpassword.loading} onSubmit={this.onSubmit}>
                  <FormattedMessage
                    id='general.SubmitBtn'
                    defaultMessage='Submit'
                  />
                </LaddaButton>
              </div>
            </div>
            <div className='row'>
              <div className='medium-6 columns'>
                {errorMsg}
              </div>
            </div>
          </form>
        </div>
      )
    }
  }
}

module.exports = injectIntl(ForgottenPassword)
