import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

import ComponentStyle from './ComponentStyle.postcss'
import SecureFormStyle from 'components/ux/SecureFormStyle.postcss'
import SecureForm from 'components/ux/SecureForm'
import ErrorMsg from 'components/ux/ErrorMsg'
import SuccessMsg from 'components/ux/SuccessMsg'
import ValidatedInput from 'components/ux/Input'
import LaddaButton from 'components/ux/LaddaButton'
import PasswordInput from 'components/ux/PasswordInput'
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
    this._bind('enableButton', 'disableButton', 'onSubmit')
  }

  componentWillUnmount () {
    this.debug('componentWillUnmount')
    this.props.actions.resetProfileState()
  }

  getData () {
    let formData = this.refs.form.getModel()
    let token = formData.token
    delete formData.token
    let action = {
      action: 'update',
      model: 'user',
      uid: this.props.state.session.user.uid,
      data: formData
    }

    return {
      actions: action,
      token: token
    }
  }

  onSubmit (event) {
    this.debug('onSubmit')

    event.preventDefault()

    this.props.actions.doSave(this.getData())
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
    const { formatMessage } = this._reactInternalInstance._context.intl
    const errorMsg = this.props.state.profile.errorMsgId ? <ErrorMsg msgId={this.props.state.profile.errorMsgId} /> : null
    const successMsg = this.props.state.profile.successMsgId ? <SuccessMsg msgId={this.props.state.profile.successMsgId} /> : null
    const emailPlaceholder = formatMessage(profileMessages.emailPlaceholder)
    const namePlaceholder = formatMessage(profileMessages.namePlaceholder)
    const oldPasswordPlaceholder = formatMessage(profileMessages.oldPasswordPlaceholder)
    const newPasswordPlaceholder = formatMessage(profileMessages.newPasswordPlaceholder)

    // EMAIL CONFIRMATION
    let emailConfirmed = null
    if (this.props.state.session.user.email_confirmed) {
      emailConfirmed = <i className={'fa fa-check-circle-o ' + ComponentStyle['email-confirmed']} aria-hidden='true'></i>
    } else {
      emailConfirmed = <i className={'fa fa-times ' + ComponentStyle['email-not-confirmed']} aria-hidden='true'>
        &nbsp;<FormattedMessage
          id='profile.EmailNotVerified'
          defaultMessage='your email is not verified'
        />
      </i>
    }

    return (
      <center>
        <SecureForm ref='form' onValid={this.enableButton} onInvalid={this.disableButton} session={this.props.state.session}>
          <h2 className={SecureFormStyle['form-signin-heading']}>

            <FormattedMessage
              id='profile.SaveSettingsHeader'
              defaultMessage='Settings'
            />
          </h2>
          {emailConfirmed}
          <ValidatedInput type='email' name='email' placeholder={emailPlaceholder} validations='isEmail' autoFocus _value={this.props.state.session.user.email} />
          <ValidatedInput type='text' name='name' placeholder={namePlaceholder} validations='minLength:2' maxLength='60' _value={this.props.state.session.user.name} />
          <PasswordInput type='password' name='old_password' quiet placeholder={oldPasswordPlaceholder} />
          <PasswordInput type='password' name='new_password' placeholder={newPasswordPlaceholder} />
          <LaddaButton ref='button' isDisabled isLoading={this.props.state.profile.loading} onSubmit={this.onSubmit}>
            <FormattedMessage
              id='profile.SubmitBtn'
              defaultMessage='Save'
            />
          </LaddaButton>
          <center>{errorMsg}</center>
          <center>{successMsg}</center>
        </SecureForm>
      </center>
    )
  }
}

module.exports = Profile
