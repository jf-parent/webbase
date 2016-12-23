import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

import MaterialInput from 'components/ux/MaterialInput'
import ErrorMsg from 'components/ux/ErrorMsg'
import SuccessMsg from 'components/ux/SuccessMsg'
import LaddaButton from 'components/ux/LaddaButton'
import BaseComponent from 'core/BaseComponent'
import Loading from 'components/ux/Loading'
import Form from 'components/ux/Form'

class ForgottenPassword extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'onSubmit',
      'validateResetPasswordToken'
    )

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
      email: this.refs.form.state.values.email
    }
    this.props.actions.doSendResetPasswordToken(data)
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
      const errorMsg = this.props.state.forgottenpassword.errorMsgId ? <ErrorMsg msgId={this.props.state.forgottenpassword.errorMsgId} /> : null

      return (
        <div style={{"{{"}}marginTop: '1em'{{"}}"}}>
          <Form ref='form' intl={this.props.intl}>
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
                  label='general.EmailPlaceholder'
                  type='text'
                  validate
                  name='email'
                  isEmail
                  isRequired
                  validationMsgId='general.EmailValidation'
                />
              </div>
            </div>
            <div className='row'>
              <div className='medium-6 columns'>
                <LaddaButton type='submit' isLoading={this.props.state.forgottenpassword.loading} onSubmit={this.onSubmit}>
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
          </Form>
        </div>
      )
    }
  }
}

module.exports = injectIntl(ForgottenPassword)
