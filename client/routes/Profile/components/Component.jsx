import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

import SecureFormStyle from 'components/ux/SecureFormStyle.postcss'
import SecureForm from 'components/ux/SecureForm'
import ErrorMsg from 'components/ux/ErrorMsg'
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
    formData.uid = this.props.state.session.user.uid
    let token = formData.token
    delete formData.token

    for (let key in formData) {
      if (!formData.hasOwnProperty(key)) continue

      let obj = formData[key]
      if (obj === '') {
        delete formData[key]
      }
    }

    return {
      model: 'user',
      data: formData,
      token: token
    }
  }

  onSubmit (event) {
    event.preventDefault()

    this.debug('onSubmit')

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
    const emailPlaceholder = formatMessage(profileMessages.emailPlaceholder)
    const namePlaceholder = formatMessage(profileMessages.namePlaceholder)
    const oldPasswordPlaceholder = formatMessage(profileMessages.oldPasswordPlaceholder)
    const newPasswordPlaceholder = formatMessage(profileMessages.newPasswordPlaceholder)

    return (
      <center>
        <SecureForm ref='form' onValid={this.enableButton} onInvalid={this.disableButton} session={this.props.state.session}>
          <h2 className={SecureFormStyle['form-signin-heading']}>

            <FormattedMessage
              id='profile.SaveSettingsHeader'
              defaultMessage='Settings'
            />
          </h2>
          <ValidatedInput type='email' name='email' placeholder={emailPlaceholder} validations='isEmail' autoFocus />
          <ValidatedInput type='text' name='name' placeholder={namePlaceholder} validations='minLength:2' maxLength='60' />
          <PasswordInput type='password' name='old_password' quiet placeholder={oldPasswordPlaceholder} />
          <PasswordInput type='password' name='new_password' placeholder={newPasswordPlaceholder} />
          <LaddaButton ref='button' isDisabled isLoading={this.props.state.profile.loading} onSubmit={this.onSubmit}>
            <FormattedMessage
              id='profile.SubmitBtn'
              defaultMessage='Save'
            />
          </LaddaButton>
          <center>{errorMsg}</center>
        </SecureForm>
      </center>
    )
  }
}

module.exports = Profile
