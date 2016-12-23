import React from 'react'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'

import Form from 'components/ux/Form'
import MaterialInput from 'components/ux/MaterialInput'
import BaseComponent from 'core/BaseComponent'
import ErrorMsg from 'components/ux/ErrorMsg'
import LaddaButton from 'components/ux/LaddaButton'

class Register extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'onSubmit',
      'validatePasswordEqual',
      'onEmailBlur'
    )
  }

  componentWillUnmount () {
    this.props.actions.resetRegisterState()
  }

  onEmailBlur (event) {
    this.props.actions.doCheckEmailDisponibility(
      this.refs.form.state.values.email
    )
  }

  validatePasswordEqual (value) {
    if (this.refs.form) {
      return value === this.refs.form.state.values['password']
    }
  }

  onSubmit (event) {
    event.preventDefault()

    let nextPath = '/dashboard'
    if (this.props.state.router.locationBeforeTransitions.state) {
      nextPath = this.props.state.router.locationBeforeTransitions.state.nextPath
    }

    let data = {
      token: this.props.state.session.token,
      email: this.refs.form.state.values.email,
      name: this.refs.form.state.values.name,
      password: this.refs.form.state.values.password
    }
    this.props.actions.doRegister(data, nextPath)
  }

  render () {
    const errorMsg = this.props.state.register.errorMsgId ? <ErrorMsg msgId={this.props.state.register.errorMsgId} /> : null

    return (
      <div style={{"{{"}}marginTop: '1em'{{"}}"}}>
        <Form ref='form' intl={this._reactInternalInstance._context.intl}>
          <div className='row'>
            <div className='medium-6 columns'>
              <h2>
                <FormattedMessage
                  id='register.Registration'
                  defaultMessage='Registration'
                />
              </h2>
            </div>
          </div>
          {(() => {
            const emailIsAvailable = this.props.state.register.emailIsAvailable
            let divStyle = {
              position: 'relative',
              bottom: '-1em',
              left: '5em'
            }
            if (emailIsAvailable === false) {
              divStyle['color'] = 'red'
              return (
                <div style={divStyle}>
                  <FormattedMessage
                    id='register.EmailNotAvailable'
                    defaultMessage='This email is not available!'
                  />
                </div>
              )
            } else if (emailIsAvailable === true) {
              divStyle['color'] = 'green'
              return (
                <div style={divStyle}>
                  <FormattedMessage
                    id='register.EmailNotAvailable'
                    defaultMessage='This email is available!'
                  />
                </div>
              )
            } else {
              return null
            }
          })()}
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label='general.EmailPlaceholder'
                validate
                type='text'
                name='email'
                isEmail
                isRequired
                onBlur={this.onEmailBlur}
                validationMsgId='general.EmailValidation'
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label='general.NamePlaceholder'
                validationMsgId='general.NameValidation'
                name='name'
                validate
                isRequired
                isLongerThan={1}
                type='text'
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label='general.PasswordPlaceholder'
                validationMsgId='general.PasswordValidation'
                name='password'
                validate
                isRequired
                joinWith='passwordConfirm'
                isLongerThan={5}
                type='password'
               />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label='general.ConfirmPasswordPlaceholder'
                validationMsgId='general.ConfirmPasswordValidation'
                name='passwordConfirm'
                joinWith='password'
                validate
                isRequired
                isLongerThan={5}
                validatorFunc={this.validatePasswordEqual}
                type='password'
               />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <LaddaButton name='login-btn' type='submit' isLoading={this.props.state.register.loading} onSubmit={this.onSubmit}>
                <FormattedMessage
                  id='register.RegisterBtn'
                  defaultMessage='Register'
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
