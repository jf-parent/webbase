import React from 'react'
import { Link } from 'react-router'
import { Form } from 'formsy-react'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'
import ErrorMsg from 'components/ux/ErrorMsg'
import ValidatedInput from 'components/ux/Input'
import PasswordInput from 'components/ux/PasswordInput'
import LaddaButton from 'components/ux/LaddaButton'

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

  onSubmit () {
    this.debug('onSubmit()')

    this.props.actions.doLogin(this.refs.form.getModel())
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

    let errorMsg = this.props.login.error ? <ErrorMsg msg={this.props.login.error} /> : null

    return (
      <center>
        <Form ref='form' onValid={this.enableButton} onInvalid={this.disableButton} className='form-signin'>
          <h2 className='form-signin-heading'>Please log in</h2>
          <ValidatedInput type='email' name='email' placeholder='Email address' validations='isEmail' required autoFocus />
          <PasswordInput type='password' name='password' placeholder='Password' quiet required />
          <LaddaButton ref='button' isDisabled isLoading={this.props.login.loading} onSubmit={this.onSubmit}>Login</LaddaButton>
          <center>{errorMsg}</center>
        </Form>
        <p>
          <Link to='/register'>
            <FormattedMessage
              id='login.register_redirect'
              defaultMessage="Don't have an account yet? Register here"
            />
          </Link>
        </p>
        <p>
          <Link to='/forgotten-password'>Forgot password?</Link>
        </p>
      </center>
    )
  }
}

export default Login
