import React from 'react'
import { Link } from 'react-router'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'

import MaterialInput from 'components/ux/MaterialInput'
import BaseComponent from 'core/BaseComponent'
import ErrorMsg from 'components/ux/ErrorMsg'
import Form from 'components/ux/Form'
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
      'onSubmit'
    )
  }

  componentWillUnmount () {
    this.props.actions.resetLoginState()
  }

  onSubmit (event) {
    event.preventDefault()

    let nextPath = '/dashboard'
    if (this.props.state.router.locationBeforeTransitions.state) {
      nextPath = this.props.state.router.locationBeforeTransitions.state.nextPath
    }

    let data = {
      email: this.refs.form.state.values['email'],
      password: this.refs.form.state.values['password'],
      token: this.props.state.session.token
    }
    this.props.actions.doLogin(data, nextPath)
  }

  render () {
    const { formatMessage } = this.props.intl
    const errorMsg = this.props.state.login.errorMsgId ? <ErrorMsg msgId={this.props.state.login.errorMsgId} /> : null
    const emailPlaceholder = formatMessage(loginMessages.emailPlaceholder)
    const passwordPlaceholder = formatMessage(loginMessages.passwordPlaceholder)

    return (
      <div style={{marginTop: '1em'}}>
        <Form ref='form'>
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
                validate
                isEmail
                isRequired
                name='email'
                type='text'
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label={passwordPlaceholder}
                validate
                name='password'
                isRequired
                isLongerThan={5}
                type='password'
               />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <LaddaButton name='login-btn' type='submit' isLoading={this.props.state.login.loading} onSubmit={this.onSubmit}>
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
        </Form>
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
