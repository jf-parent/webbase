import React from 'react'
import { Link } from 'react-router'
import { defineMessages, FormattedMessage } from 'react-intl'

import MaterialInput from 'components/ux/MaterialInput'
import BaseComponent from 'core/BaseComponent'
import ErrorMsg from 'components/ux/ErrorMsg'
import LaddaButton from 'components/ux/LaddaButton'
import { RE_EMAIL } from 'routes/Login/components/Component'

const registerMessages = defineMessages({
  emailPlaceholder: {
    id: 'general.EmailPlaceholder',
    defaultMessage: 'Email address'
  },
  namePlaceholder: {
    id: 'general.NamePlaceholder',
    defaultMessage: 'Name'
  },
  passwordPlaceholder: {
    id: 'general.PasswordPlaceholder',
    defaultMessage: 'Password'
  }
})

class Register extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'isFormValid',
      'onEmailChange',
      'onPasswordChange',
      'onNameChange',
      'onSubmit'
    )

    this.state = {
      emailValidationState: 'warning',
      emailValue: '',
      passwordValidationState: 'warning',
      passwordValue: '',
      nameValidationState: 'warning',
      nameValue: '',
      isFormValid: false
    }
  }

  componentWillUnmount () {
    this.props.actions.resetRegisterState()
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

    let isFormValid = this.isFormValid(emailValidationState, this.state.passwordValidationState, this.state.nameValidationState)
    this.setState({isFormValid, emailValidationState, emailValue})
  }

  onNameChange (event) {
    const nameValue = event.target.value
    let nameValidationState
    if (nameValue === '') {
      nameValidationState = 'warning'
    } else {
      if (nameValue.length >= 2) {
        nameValidationState = 'success'
      } else {
        nameValidationState = 'error'
      }
    }

    let isFormValid = this.isFormValid(this.state.emailValidationState, this.state.passwordValidationState, nameValidationState)
    this.setState({isFormValid, nameValidationState, nameValue})
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

    let isFormValid = this.isFormValid(this.state.emailValidationState, passwordValidationState, this.state.nameValidationState)
    this.setState({isFormValid, passwordValidationState, passwordValue})
  }

  onSubmit (event) {
    event.preventDefault()

    let nextPath = '/dashboard'
    if (this.props.state.router.locationBeforeTransitions.state) {
      nextPath = this.props.state.router.locationBeforeTransitions.state.nextPath
    }

    let data = {
      token: this.props.state.session.token,
      email: this.state.emailValue,
      name: this.state.nameValue,
      password: this.state.passwordValue
    }
    this.props.actions.doRegister(data, nextPath)
  }

  isFormValid (emailValidationState, passwordValidationState, nameValidationState) {
    if (emailValidationState === 'success' &&
        passwordValidationState === 'success' &&
        nameValidationState === 'success'
        ) {
      return true
    } else {
      return false
    }
  }

  render () {
    const { formatMessage } = this._reactInternalInstance._context.intl
    const errorMsg = this.props.state.register.errorMsgId ? <ErrorMsg msgId={this.props.state.register.errorMsgId} /> : null
    const emailPlaceholder = formatMessage(registerMessages.emailPlaceholder)
    const namePlaceholder = formatMessage(registerMessages.namePlaceholder)
    const passwordPlaceholder = formatMessage(registerMessages.passwordPlaceholder)

    return (
      <div style={{marginTop: '1em'}}>
        <form>
          <div className='row'>
            <div className='medium-6 medium-offset-4 columns'>
              <h2>
                <FormattedMessage
                  id='register.Registration'
                  defaultMessage='Registration'
                />
              </h2>
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 medium-offset-4 columns'>
              <MaterialInput
                label={emailPlaceholder}
                type='text'
                validationState={this.state.emailValidationState}
                onChange={this.onEmailChange}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 medium-offset-4 columns'>
              <MaterialInput
                label={namePlaceholder}
                type='text'
                validationState={this.state.nameValidationState}
                onChange={this.onNameChange}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 medium-offset-4 columns'>
              <MaterialInput
                label={passwordPlaceholder}
                type='password'
                validationState={this.state.passwordValidationState}
                onChange={this.onPasswordChange}
               />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 medium-offset-4 columns'>
              <LaddaButton name='login-btn' isDisabled={!this.state.isFormValid} isLoading={this.props.state.register.loading} onSubmit={this.onSubmit}>
                <FormattedMessage
                  id='register.RegisterBtn'
                  defaultMessage='Register'
                />
              </LaddaButton>
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 medium-offset-4 columns'>
              {errorMsg}
            </div>
          </div>
        </form>
        <div className='row'>
          <div className='medium-6 medium-offset-4 columns'>
            <Link name='already-having-account-link' to='/login'>
              <FormattedMessage
                id='register.AlreadyHaveAnAccount'
                defaultMessage='Already have an account? Log in here'
              />
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Register
