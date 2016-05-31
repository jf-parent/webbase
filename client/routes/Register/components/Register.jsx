import React from 'react'
import { Link } from 'react-router'
import { Form } from 'formsy-react'
import { defineMessages, FormattedMessage } from 'react-intl'

import BaseComponent from '../../../core/BaseComponent'
import ErrorMsg from '../../../components/ux/ErrorMsg'
import ValidatedInput from '../..//../components/ux/Input'
import LaddaButton from '../../..//components/ux/LaddaButton'
import PasswordInput from '../../../components/ux/PasswordInput'

const registerMessages = defineMessages({
  emailPlaceholder: {
    id: 'register.emailPlaceholder',
    defaultMessage: 'Email address'
  },
  namePlaceholder: {
    id: 'register.namePlaceholder',
    defaultMessage: 'Name'
  },
  passwordPlaceholder: {
    id: 'register.passwordPlaceholder',
    defaultMessage: 'Password'
  }
})

class Register extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind('enableButton', 'disableButton', 'onSubmit')
  }

  onSubmit () {
    this.debug('onSubmit')

    this.props.actions.doRegister(this.refs.form.getModel())
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

    const { formatMessage } = this._reactInternalInstance._context.intl
    const errorMsg = this.props.register.error ? <ErrorMsg msg={this.props.register.error} /> : null
    const emailPlaceholder = formatMessage(registerMessages.emailPlaceholder)
    const namePlaceholder = formatMessage(registerMessages.namePlaceholder)
    const passwordPlaceholder = formatMessage(registerMessages.passwordPlaceholder)

    return (
      <center>
        <Form ref='form' onValid={this.enableButton} onInvalid={this.disableButton} className='form-signin'>
          <h2 className='form-signin-heading'>

            <FormattedMessage
              id='register.registration'
              defaultMessage='Registration'
            />
          </h2>
          <ValidatedInput type='email' name='email' placeholder={emailPlaceholder} validations='isEmail' required autoFocus />
          <ValidatedInput type='text' name='name' placeholder={namePlaceholder} required validations='minLength:2' maxLength='60' />
          <PasswordInput type='password' name='password' placeholder={passwordPlaceholder} required />
          <LaddaButton ref='button' isDisabled isLoading={this.props.register.loading} onSubmit={this.onSubmit}>
            <FormattedMessage
              id='register.register-btn'
              defaultMessage='Register'
            />
          </LaddaButton>
          <center>{errorMsg}</center>
        </Form>
        <p>
          <Link to='/login'>
            <FormattedMessage
              id='register.already-have-an-account'
              defaultMessage='Already have an account? Log in here'
            />
          </Link>
        </p>
      </center>
    )
  }
}

export default Register
