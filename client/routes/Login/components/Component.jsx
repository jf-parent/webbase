import React from 'react'
import { Link } from 'react-router'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'

import MaterialInput from 'components/ux/MaterialInput'
import BaseComponent from 'core/BaseComponent'
import ErrorMsg from 'components/ux/ErrorMsg'
import LaddaButton from 'components/ux/LaddaButton'

const loginMessages = defineMessages({
  emailPlaceholder: {
    id: 'general.EmailPlaceholder',
    defaultMessage: 'Email address'
  },
  passwordPlaceholder: {
    id: 'general.PasswordPlaceholder',
    defaultMessage: 'Password'
  }
})

export const RE_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class Login extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'isFormValid',
      'onEmailChange',
      'onPasswordChange',
      'onSubmit'
    )

    this.state = {
      emailValidationState: 'warning',
      emailValue: '',
      passwordValidationState: 'warning',
      passwordValue: '',
      isFormValid: false
    }
  }

  componentWillUnmount () {
    this.props.actions.resetLoginState()
  }

  isFormValid (emailValidationState, passwordValidationState) {
    if (emailValidationState === 'success' && passwordValidationState === 'success') {
      return true
    } else {
      return false
    }
  }

  onSubmit (event) {
    event.preventDefault()

    let nextPath = '/dashboard'
    if (this.props.state.router.locationBeforeTransitions.state) {
      nextPath = this.props.state.router.locationBeforeTransitions.state.nextPath
    }

    let data = {
      email: this.state.emailValue,
      password: this.state.passwordValue,
      token: this.props.state.session.token
    }
    this.props.actions.doLogin(data, nextPath)
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

    let isFormValid = this.isFormValid(emailValidationState, this.state.passwordValidationState)
    this.setState({isFormValid, emailValidationState, emailValue})
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

    let isFormValid = this.isFormValid(this.state.emailValidationState, passwordValidationState)
    this.setState({isFormValid, passwordValidationState, passwordValue})
  }

  render () {
    const { formatMessage } = this.props.intl
    const errorMsg = this.props.state.login.errorMsgId ? <ErrorMsg msgId={this.props.state.login.errorMsgId} /> : null
    const emailPlaceholder = formatMessage(loginMessages.emailPlaceholder)
    const passwordPlaceholder = formatMessage(loginMessages.passwordPlaceholder)

    return (
      <div style={{marginTop: '1em'}}>
        <form>
          <div className='row'>
            <div className='medium-6 columns'>
              <h2>
                <FormattedMessage
                  id='login.PleaseLogin'
                  defaultMessage='Login'
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
              <LaddaButton name='login-btn' isDisabled={!this.state.isFormValid} isLoading={this.props.state.login.loading} onSubmit={this.onSubmit}>
                <FormattedMessage
                  id='login.SubmitBtn'
                  defaultMessage='Login'
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
        <div className='row'>
          <div className='medium-6 columns'>
            <Link name='dont-have-account-link' to='/register'>
              <FormattedMessage
                id='login.RegisterRedirect'
                defaultMessage="Don't have an account yet? Register here"
              />
            </Link>
          </div>
        </div>
        <div className='row'>
          <div className='medium-6 columns'>
            <Link name='forgottenpassword-link' to='/forgottenpassword'>
              <FormattedMessage
                id='login.ForgottenPassword-btn'
                defaultMessage='Forgot password?'
              />
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(Login)
