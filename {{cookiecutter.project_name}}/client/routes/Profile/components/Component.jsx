import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'
import Select from 'react-select'
import 'layouts/react-select.css'

import MaterialInput from 'components/ux/MaterialInput'
import Form from 'components/ux/Form'
import ErrorMsg from 'components/ux/ErrorMsg'
import SuccessMsg from 'components/ux/SuccessMsg'
import LaddaButton from 'components/ux/LaddaButton'
import BaseComponent from 'core/BaseComponent'

class Profile extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'onSubmit',
      'onLocaleChange',
      'validatePasswordEqual',
      'validateConfirmPasswordEqual'
    )

    const user = this.props.state.session.user
    this.state = {
      locale: user.locale
    }
  }

  componentWillUnmount () {
    this.props.actions.resetProfileState()
  }

  validateConfirmPasswordEqual (value) {
    if (this.refs.form) {
      return value === this.refs.form.state.values['newPasswordConfirm']
    }
  }

  validatePasswordEqual (value) {
    if (this.refs.form) {
      return value === this.refs.form.state.values['newPassword']
    }
  }

  onLocaleChange (locale) {
    this.setState({locale: locale.value})
  }

  onSubmit (event) {
    event.preventDefault()

    let data = {
      token: this.props.state.session.token,
      actions: {
        action: 'update',
        model: 'user',
        uid: this.props.state.session.user.uid,
        data: {
          locale: this.state.locale,
          old_password: this.refs.form.state.values.oldPassword,
          new_password: this.refs.form.state.values.newPassword,
          name: this.refs.form.state.values.name,
          email: this.refs.form.state.values.email
        }
      }
    }
    this.props.actions.doSave(data)
  }

  render () {
    const errorMsg = this.props.state.profile.errorMsgId ? <ErrorMsg msgId={this.props.state.profile.errorMsgId} /> : null
    const successMsg = this.props.state.profile.successMsgId ? <SuccessMsg msgId={this.props.state.profile.successMsgId} /> : null
    let localeOptions = [
      {
        value: 'en', label: 'English'
      }, {
        value: 'fr', label: 'Français'
      }
    ]
    const emailNotConfirmedStyle = {
      color: 'red',
      position: 'relative',
      top: '1em',
      left: '8em'
    }

    const emailConfirmedStyle = {
      color: 'green',
      position: 'relative',
      top: '1em',
      left: '8em'
    }

    // EMAIL CONFIRMATION
    let emailConfirmed = null
    if (this.props.state.session.user.email_confirmed) {
      emailConfirmed = <i name='email-verified' style={emailConfirmedStyle} className='fa fa-check-circle-o' aria-hidden='true'>i
        {' '}
        <FormattedMessage
          id='profile.EmailVerified'
          defaultMessage='your email is verified'
        />
      </i>
    } else {
      emailConfirmed = <i name='email-not-verified' style={emailNotConfirmedStyle} className='fa fa-times' aria-hidden='true'>
        {' '}
        <FormattedMessage
          id='profile.EmailNotVerified'
          defaultMessage='your email is not verified'
        />
      </i>
    }

    return (
      <div style={{"{{"}}marginTop: '1em'{{"}}"}}>
        <div className='row'>
          <div className='medium-6 columns'>
            <h2>
              <FormattedMessage
                id='profile.SaveSettingsHeader'
                defaultMessage='Settings'
              />
            </h2>
          </div>
        </div>
        <div className='row'>
          <div className='medium-2 columns'>
            <h5>
              <FormattedMessage
                id='profile.LocalTime'
                defaultMessage='Local time:'
              />
            </h5>
          </div>
          <div className='medium-4 columns end'>
            <h5>
              {moment(this.props.state.session.user.local_time).format('DD/MM/Y hh:mm:ss A')}
            </h5>
          </div>
        </div>
        <Form ref='form' intl={this.props.intl}>
          <div className='row'>
            <div className='medium-6 columns'>
              {emailConfirmed}
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label='general.EmailPlaceholder'
                type='text'
                value={this.props.state.session.user.email}
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
              <MaterialInput
                label='general.NamePlaceholder'
                validationMsgId='general.NameValidation'
                name='name'
                validate
                isRequired
                isLongerThan={1}
                type='text'
                value={this.props.state.session.user.name}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label='profile.OldPasswordPlaceholder'
                type='password'
                validationMsgId='general.PasswordValidation'
                name='oldPassword'
                validate
                isLongerThan={5}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label='profile.NewPasswordPlaceholder'
                type='password'
                validationMsgId='general.PasswordValidation'
                name='newPassword'
                validatorFunc={this.validateConfirmPasswordEqual}
                validate
                joinWith='newPasswordConfirm'
                isLongerThan={5}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label='profile.NewPasswordConfirmPlaceholder'
                type='password'
                validationMsgId='general.PasswordValidation'
                validatorFunc={this.validatePasswordEqual}
                name='newPasswordConfirm'
                validate
                joinWith='newPassword'
                isLongerThan={5}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <Select
                style={{"{{"}}marginBottom: 10{{"}}"}}
                name='locale'
                value={this.state.locale}
                options={localeOptions}
                clearable={false}
                onChange={this.onLocaleChange}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              {errorMsg}
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              {successMsg}
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <LaddaButton type='submit' name='profile-btn' isLoading={this.props.state.profile.loading} onSubmit={this.onSubmit}>
                <FormattedMessage
                  id='profile.SubmitBtn'
                  defaultMessage='Save'
                />
              </LaddaButton>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}

export default injectIntl(Profile)
