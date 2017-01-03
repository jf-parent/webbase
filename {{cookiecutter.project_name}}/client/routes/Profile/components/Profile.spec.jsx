import React from 'react'
import { expect } from 'chai'

import { injectRequiredReducer, mountWithContext, store } from 'helpers/TestHelper'
import Container from '../containers/Container'

import reducer from '../modules/reducer'

injectRequiredReducer('profile', reducer)

const USER = {
  email: 'test@test.com',
  name: 'Test',
  locale: 'en',
  email_confirmed: false
}

describe('<Profile />', () => {
  let wrapper

  beforeEach(() => {
    store.dispatch({type: 'UPDATE_SESSION_USER', data: USER})
    wrapper = mountWithContext(
      <Container />
    )
    wrapper.props().store.dispatch({type: 'PROFILE_RESET_STATE'})
  })

  it('has the email input with the store state value of email', () => {
    let emailInput = wrapper.find({name: 'email'})
    expect(emailInput.props().value).to.be.equal(USER.email)
  })

  it('has the name input with the store state value of name', () => {
    let nameInput = wrapper.find({name: 'name'})
    expect(nameInput.props().value).to.be.equal(USER.name)
  })

  it('has the locale dropdown with the store state value of locale', () => {
    let selectLocale = wrapper.find('Select')
    expect(selectLocale.props().value).to.be.equal(USER.locale)
  })

  it('has the old password input empty in the warning state', () => {
    let oldPasswordInput = wrapper.find({name: 'oldPassword'})
    expect(oldPasswordInput.hasClass('wb-input_field_warning')).to.be.true
  })

  it('has the new password input empty in the warning state', () => {
    let newPasswordInput = wrapper.find({name: 'newPassword'})
    expect(newPasswordInput.hasClass('wb-input_field_warning')).to.be.true
  })

  it('has the new confirm password input empty in the warning state', () => {
    let newConfirmPasswordInput = wrapper.find({name: 'newPasswordConfirm'})
    expect(newConfirmPasswordInput.hasClass('wb-input_field_warning')).to.be.true
  })

  it('has the submit button in a valid state', () => {
    let submitButton = wrapper.find('LaddaButton').get(1)
    expect(submitButton.props.disabled).to.be.false
  })

  it('has the submit button in a invalid state if the form is invalid', () => {
    let submitButton = wrapper.find('LaddaButton').get(1)
    let oldPasswordInput = wrapper.find({name: 'oldPassword'})

    oldPasswordInput.simulate('change', {target: {name: 'oldPassword', value: '1'}})

    expect(submitButton.props.disabled).to.be.true
  })

  it('has the submit button in a loading state if the form is submitting', () => {
    store.dispatch({type: 'PROFILE_LOADING'})
    let submitButton = wrapper.find('LaddaButton').get(1)
    expect(submitButton.props.loading).to.be.true
  })

  it('has the old password in a success state if the input is valid', () => {
    let oldPasswordInput = wrapper.find({name: 'oldPassword'})

    oldPasswordInput.simulate('change', {target: {name: 'oldPassword', value: '123456'}})

    expect(oldPasswordInput.hasClass('wb-input_field_success')).to.be.true
  })

  it('has the new password in a success state if the input is valid', () => {
    let newPasswordInput = wrapper.find({name: 'newPassword'})
    let newConfirmPasswordInput = wrapper.find({name: 'newPasswordConfirm'})

    newPasswordInput.simulate('change', {target: {name: 'newPassword', value: '123456'}})
    newConfirmPasswordInput.simulate('change', {target: {name: 'newPasswordConfirm', value: '123456'}})

    expect(newPasswordInput.hasClass('wb-input_field_success')).to.be.true
  })

  it('has the new confirm password in a success state if the input is valid', () => {
    let newConfirmPasswordInput = wrapper.find({name: 'newPasswordConfirm'})
    let newPasswordInput = wrapper.find({name: 'newPassword'})

    newPasswordInput.simulate('change', {target: {name: 'newPassword', value: '123456'}})
    newConfirmPasswordInput.simulate('change', {target: {name: 'newPasswordConfirm', value: '123456'}})

    expect(newConfirmPasswordInput.hasClass('wb-input_field_success')).to.be.true
  })

  it('has the old password in an error state if the input is invalid', () => {
    let oldPasswordInput = wrapper.find({name: 'oldPassword'})

    oldPasswordInput.simulate('change', {target: {name: 'oldPassword', value: '1'}})

    expect(oldPasswordInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('has the new password in an error state if the input is invalid', () => {
    let newPasswordInput = wrapper.find({name: 'newPassword'})

    newPasswordInput.simulate('change', {target: {name: 'newPassword', value: '1'}})

    expect(newPasswordInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('has the new confirm password in an error state if the input is invalid', () => {
    let newConfirmPasswordInput = wrapper.find({name: 'newPasswordConfirm'})

    newConfirmPasswordInput.simulate('change', {target: {name: 'newPasswordConfirm', value: '1'}})

    expect(newConfirmPasswordInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('has the new confirm password in an error state if the input is different from the new password', () => {
    let newConfirmPasswordInput = wrapper.find({name: 'newPasswordConfirm'})
    let newPasswordInput = wrapper.find({name: 'newPassword'})

    newPasswordInput.simulate('change', {target: {name: 'newPassword', value: '123456'}})
    newConfirmPasswordInput.simulate('change', {target: {name: 'newPasswordConfirm', value: '1234567'}})

    expect(newConfirmPasswordInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('has the label "you email is not verified" if the store state session.user.email_confirmed is equal to false', () => {
    let emailNotVerified = wrapper.find({name: 'email-not-verified'})
    let emailVerified = wrapper.find({name: 'email-verified'})
    expect(emailNotVerified.node).to.not.be.undefined
    expect(emailVerified.node).to.be.undefined
  })

  it('has the label "you email is verified" if the store state session.user.email_confirmed is equal to true', () => {
    let user = USER
    user.email_confirmed = true
    store.dispatch({type: 'UPDATE_SESSION_USER', data: user})
    let emailNotVerified = wrapper.find({name: 'email-not-verified'})
    let emailVerified = wrapper.find({name: 'email-verified'})
    expect(emailNotVerified.node).to.be.undefined
    expect(emailVerified.node).to.not.be.undefined
  })

  it('has an error message when the store state profile errorMsgId is not set to null', () => {
    store.dispatch({type: 'PROFILE_ERROR', errorMsgId: 'error.test'})
    let errorMsg = wrapper.find('ErrorMsg')
    expect(errorMsg.props().msgId).to.be.equal('error.test')
  })

  it('has success message when the store state profile successMsgId is not set to null', () => {
    store.dispatch({type: 'PROFILE_SUCCESS', successMsgId: 'success.test'})
    let successMsg = wrapper.find('SuccessMsg')
    expect(successMsg.props().msgId).to.be.equal('success.test')
  })
})
