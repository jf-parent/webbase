import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

import MaterialInput from 'components/ux/MaterialInput'
import Form from 'components/ux/Form'
import SuccessMsg from 'components/ux/SuccessMsg'
import ErrorMsg from 'components/ux/ErrorMsg'
import LaddaButton from 'components/ux/LaddaButton'
import BaseComponent from 'core/BaseComponent'
import Loading from 'components/ux/Loading'

class ResetPassword extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'onSubmit'
    )

    this.state = {
      resetPasswordToken: this.props.location.query['resetPasswordToken']
    }
  }

  onSubmit (event) {
    event.preventDefault()
    let data = {
      token: this.props.state.session.token,
      reset_password_token: this.state.resetPasswordToken,
      password: this.refs.form.state.values.password
    }
    this.props.actions.doResetPassword(data)
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
      const errorMsg = this.props.state.resetpassword.errorMsgId ? <ErrorMsg msgId={this.props.state.resetpassword.errorMsgId} /> : null

      return (
        <div style={{"{{"}}marginTop: '1em'{{"}}"}}>
          <Form ref='form' intl={this.props.intl}>
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
                  label='general.PasswordPlaceholder'
                  type='password'
                  name='password'
                  validationMsgId='general.PasswordValidation'
                  validate
                  isRequired
                  isLongerThan={5}
                />
              </div>
            </div>
            <div className='row'>
              <div className='medium-6 columns'>
                <LaddaButton type='submit' isLoading={this.props.state.resetpassword.loading} onSubmit={this.onSubmit}>
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

module.exports = injectIntl(ResetPassword)
