import React from 'react'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'

import MaterialInput from 'components/ux/MaterialInput'
import SuccessMsg from 'components/ux/SuccessMsg'
import ErrorMsg from 'components/ux/ErrorMsg'
import LaddaButton from 'components/ux/LaddaButton'
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
    this._bind(
      'isFormValid',
      'onPasswordChange',
      'onSubmit'
    )

    this.state = {
      resetPasswordToken: this.props.location.query['resetPasswordToken'],
      passwordValidationState: 'warning',
      passwordValue: '',
      isFormValid: false
    }
  }

  isFormValid (passwordValidationState) {
    if (passwordValidationState === 'success') {
      return true
    } else {
      return false
    }
  }

  onSubmit (event) {
    event.preventDefault()
    let data = {
      token: this.props.state.session.token,
      reset_password_token: this.state.resetPasswordToken,
      password: this.state.passwordValue
    }
    this.props.actions.doResetPassword(data)
  }

  onPasswordChange (event) {
    const passwordValue = event.target.value
    let passwordValidationState
    if (passwordValue === '') {
      passwordValidationState = 'warning'
    } else {
      if (passwordValue.length >= 6) {
        passwordValidationState = 'success'
      } else {
        passwordValidationState = 'error'
      }
    }

    let isFormValid = this.isFormValid(passwordValidationState)
    this.setState({isFormValid, passwordValidationState, passwordValue})
  }

  render () {
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
      const { formatMessage } = this.props.intl
      const errorMsg = this.props.state.resetpassword.errorMsgId ? <ErrorMsg msgId={this.props.state.resetpassword.errorMsgId} /> : null
      const passwordPlaceholder = formatMessage(resetPasswordMessages.passwordPlaceholder)

      return (
        <div style={{marginTop: '1em'}}>
          <form>
            <div className='row'>
              <div className='medium-6 columns'>
                <h2>
                  <FormattedMessage
                    id='resetpassword.ResetPasswordHeader'
                    defaultMessage='New password'
                  />
                </h2>
              </div>
            </div>
            <div className='row'>
              <div className='medium-6 columns'>
                <MaterialInput
                  label={passwordPlaceholder}
                  type='password'
                  validationState={this.state.passwordValidationState}
                  onChange={this.onPasswordChange}
                />
              </div>
            </div>
            <div className='row'>
              <div className='medium-6 columns'>
                <LaddaButton isDisabled={!this.state.isFormValid} isLoading={this.props.state.resetpassword.loading} onSubmit={this.onSubmit}>
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

module.exports = injectIntl(ResetPassword)
