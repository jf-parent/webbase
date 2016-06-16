import React from 'react'
import { Link } from 'react-router'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'

import SecureFormStyle from 'components/ux/SecureFormStyle.postcss'
import SecureForm from 'components/ux/SecureForm'
import BaseComponent from 'core/BaseComponent'
import ErrorMsg from 'components/ux/ErrorMsg'
import ValidatedInput from 'components/ux/Input'
import PasswordInput from 'components/ux/PasswordInput'
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

class Login extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'enableButton',
      'disableButton',
      'onSubmit'
    )
  }

  onSubmit (event) {
    event.preventDefault()
    this.debug('onSubmit()')

    let nextPath = '/dashboard'
    if (this.props.state.router.locationBeforeTransitions.state) {
      nextPath = this.props.state.router.locationBeforeTransitions.state.nextPath
    }

    this.props.actions.doLogin(this.refs.form.getModel(), nextPath)
  }

  componentWillUnmount () {
    this.debug('componentWillUnmount')
    this.props.actions.resetLoginState()
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

    const { formatMessage } = this.props.intl
    const errorMsg = this.props.state.login.errorMsgId ? <ErrorMsg msgId={this.props.state.login.errorMsgId} /> : null
    const emailPlaceholder = formatMessage(loginMessages.emailPlaceholder)
    const passwordPlaceholder = formatMessage(loginMessages.passwordPlaceholder)

    return (
      <center>
        <SecureForm ref='form' onValid={this.enableButton} onInvalid={this.disableButton} session={this.props.state.session}>
          <h2 className={SecureFormStyle['form-signin-heading']}>
            <FormattedMessage
              id='login.PleaseLogin'
              defaultMessage='Please log in'
            />
          </h2>
          <ValidatedInput type='email' name='email' placeholder={emailPlaceholder} validations='isEmail' required autoFocus />
          <PasswordInput type='password' name='password' placeholder={passwordPlaceholder} quiet required />
          <LaddaButton ref='button' isDisabled isLoading={this.props.state.login.loading} onSubmit={this.onSubmit}>
            <FormattedMessage
              id='login.SubmitBtn'
              defaultMessage='Login'
            />
          </LaddaButton>
          <center>{errorMsg}</center>
        </SecureForm>
        <p>
          <Link to='/register'>
            <FormattedMessage
              id='login.RegisterRedirect'
              defaultMessage="Don't have an account yet? Register here"
            />
          </Link>
        </p>
        <p>
          <Link to='/forgottenpassword'>
            <FormattedMessage
              id='login.ForgottenPassword-btn'
              defaultMessage='Forgot password?'
            />
          </Link>
        </p>
      </center>
    )
  }
}

export default injectIntl(Login)
