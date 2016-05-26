import React from 'react'
import { Link } from 'react-router'
import { Form } from 'formsy-react'

import BaseComponent from 'core/BaseComponent'
import ErrorMsg from 'components/ux/ErrorMsg'
import ValidatedInput from 'components/ux/Input'
import LaddaButton from 'components/ux/LaddaButton'
import PasswordInput from 'components/ux/PasswordInput'

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
    let errorMsg = this.props.register.error ? <ErrorMsg msg={this.props.register.error} /> : null

    return (
      <center>
        <Form ref='form' onValid={this.enableButton} onInvalid={this.disableButton} className='form-signin'>
          <h2 className='form-signin-heading'>Registration</h2>
          <ValidatedInput type='email' name='email' placeholder='Email address' validations='isEmail' required autoFocus />
          <ValidatedInput type='text' name='name' placeholder='Name' required validations='minLength:2' maxLength='60' />
          <PasswordInput type='password' name='password' placeholder='Password' required />
          <LaddaButton ref='button' isDisabled isLoading={this.props.register.loading} onSubmit={this.onSubmit}>Register</LaddaButton>
          <center>{errorMsg}</center>
        </Form>
        <p>
          <Link to='/login'>Already have an account? Log in here</Link>
        </p>
      </center>
    )
  }
}

module.exports = Register
