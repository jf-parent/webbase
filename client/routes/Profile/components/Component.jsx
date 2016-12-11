import React from 'react'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'
import Select from 'react-select'
import 'layouts/react-select.css'

import { RE_EMAIL } from 'routes/Login/components/Component'
import MaterialInput from 'components/ux/MaterialInput'
import ErrorMsg from 'components/ux/ErrorMsg'
import SuccessMsg from 'components/ux/SuccessMsg'
import LaddaButton from 'components/ux/LaddaButton'
import BaseComponent from 'core/BaseComponent'

const profileMessages = defineMessages({
  emailPlaceholder: {
    id: 'general.EmailPlaceholder',
    defaultMessage: 'Email address'
  },
  namePlaceholder: {
    id: 'general.NamePlaceholder',
    defaultMessage: 'Name'
  },
  oldPasswordPlaceholder: {
    id: 'profile.OldPasswordPlaceholder',
    defaultMessage: 'Old password'
  },
  newPasswordPlaceholder: {
    id: 'profile.NewPasswordPlaceholder',
    defaultMessage: 'New password'
  }
})

class Profile extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'onSubmit',
      'onLocaleChange',
      'isFormValid',
      'onEmailChange',
      'onNameChange',
      'onOldPasswordChange',
      'onNewPasswordChange',
    )

    const user = this.props.state.session.user
    this.state = {
      locale: user.locale,
      emailValidationState: 'success',
      emailValue: user.email,
      nameValidationState: 'success',
      nameValue: user.name,
      oldPasswordValidationState: 'success',
      oldPasswordValue: '',
      newPasswordValidationState: 'success',
      newPasswordValue: '',
      isFormValid: true
    }
  }

  componentWillUnmount () {
    this.props.actions.resetProfileState()
  }

  onLocaleChange (locale) {
    this.setState({locale: locale.value})
  }

  isFormValid (emailValidationState, oldPasswordValidationState, newPasswordValidationState, nameValidationState) {
    if (emailValidationState === 'success' &&
        newPasswordValidationState === 'success' &&
        oldPasswordValidationState === 'success' &&
        nameValidationState === 'success'
        ) {
      return true
    } else {
      return false
    }
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

    let isFormValid = this.isFormValid(emailValidationState, this.state.oldPasswordValidationState, this.state.newPasswordValidationState, this.state.nameValidationState)
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

    let isFormValid = this.isFormValid(this.state.emailValidationState, this.state.oldPasswordValidationState, this.state.newPasswordValidationState, nameValidationState)
    this.setState({isFormValid, nameValidationState, nameValue})
  }

  onOldPasswordChange (event) {
    const oldPasswordValue = event.target.value
    let oldPasswordValidationState
    if (oldPasswordValue === '') {
      oldPasswordValidationState = 'warning'
    } else {
      if (oldPasswordValue.length >= 6) {
        oldPasswordValidationState = 'success'
      } else {
        oldPasswordValidationState = 'error'
      }
    }

    let isFormValid = this.isFormValid(this.state.emailValidationState, oldPasswordValidationState, this.state.newPasswordValidationState, this.state.nameValidationState)
    this.setState({isFormValid, oldPasswordValidationState, oldPasswordValue})
  }

  onNewPasswordChange (event) {
    const newPasswordValue = event.target.value
    let newPasswordValidationState
    if (newPasswordValue === '') {
      newPasswordValidationState = 'warning'
    } else {
      if (newPasswordValue.length >= 6) {
        newPasswordValidationState = 'success'
      } else {
        newPasswordValidationState = 'error'
      }
    }

    let isFormValid = this.isFormValid(this.state.emailValidationState, this.state.oldPasswordValidationState, newPasswordValidationState, this.state.nameValidationState)
    this.setState({isFormValid, newPasswordValidationState, newPasswordValue})
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
          old_password: this.state.oldPasswordValue,
          new_password: this.state.newPasswordValue,
          name: this.state.nameValue,
          email: this.state.emailValue
        }
      }
    }
    this.props.actions.doSave(data)
  }

  render () {
    const { formatMessage } = this._reactInternalInstance._context.intl
    const errorMsg = this.props.state.profile.errorMsgId ? <ErrorMsg msgId={this.props.state.profile.errorMsgId} /> : null
    const successMsg = this.props.state.profile.successMsgId ? <SuccessMsg msgId={this.props.state.profile.successMsgId} /> : null
    const emailPlaceholder = formatMessage(profileMessages.emailPlaceholder)
    const namePlaceholder = formatMessage(profileMessages.namePlaceholder)
    const oldPasswordPlaceholder = formatMessage(profileMessages.oldPasswordPlaceholder)
    const newPasswordPlaceholder = formatMessage(profileMessages.newPasswordPlaceholder)
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
      <div style={{marginTop: '1em'}}>
        <form>
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
              {emailConfirmed}
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label={emailPlaceholder}
                type='text'
                validationState={this.state.emailValidationState}
                value={this.state.emailValue}
                onChange={this.onEmailChange}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label={namePlaceholder}
                type='text'
                validationState={this.state.nameValidationState}
                value={this.state.nameValue}
                onChange={this.onNameChange}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label={oldPasswordPlaceholder}
                type='password'
                validationState={this.state.oldPasswordValidationState}
                value={this.state.oldPasswordValue}
                onChange={this.onOldPasswordChange}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <MaterialInput
                label={newPasswordPlaceholder}
                type='password'
                validationState={this.state.newPasswordValidationState}
                value={this.state.newPasswordValue}
                onChange={this.onNewPasswordChange}
              />
            </div>
          </div>
          <div className='row'>
            <div className='medium-6 columns'>
              <Select
                style={{marginBottom: 10}}
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
              <LaddaButton ref='button' name='profile-btn' isDisabled={!this.state.isFormValid} isLoading={this.props.state.profile.loading} onSubmit={this.onSubmit}>
                <FormattedMessage
                  id='profile.SubmitBtn'
                  defaultMessage='Save'
                />
              </LaddaButton>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default injectIntl(Profile)
