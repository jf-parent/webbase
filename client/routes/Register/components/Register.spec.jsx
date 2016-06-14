import React from 'react'
import { expect } from 'chai'

import TestHelper from 'helpers/TestHelper'
import Container from '../containers/Container'
import reducer from '../modules/reducer'

describe('<Register />', () => {
  let wrapper

  beforeEach(() => {
    TestHelper.injectRequiredReducer('register', reducer)
    wrapper = TestHelper.mountWithContext(
      <Container />
    )
  })

  it('Have a required password input field', () => {
    let passwordInput = wrapper.find('input[name="password"]')
    expect(passwordInput.props().required).to.be.true
  })

  it('Have a required email input field', () => {
    let emailInput = wrapper.find('input[name="email"]')
    expect(emailInput.props().required).to.be.true
  })

  it('Have a required name input field', () => {
    let nameInput = wrapper.find('input[name="name"]')
    expect(nameInput.props().required).to.be.true
  })

  it('Have a disabled submit button', () => {
    let submitBtn = wrapper.find('button')
    expect(submitBtn.props().disabled).to.be.true
    expect(submitBtn.props().isDisabled).to.be.true
  })

  it('Have a submit button not loading', () => {
    let submitBtn = wrapper.find('button')
    expect(submitBtn.props().loading).to.be.false
    expect(submitBtn.props().isLoading).to.be.false
  })

  it('Have the empty email field with the has-warning class', () => {
    let emailFormGroup = wrapper.find('div[name="form-control-email"]')
    expect(emailFormGroup.hasClass('has-warning')).to.be.true
  })

  it('Have the email field with the has-success class after typing a valid email', () => {
    let emailInput = wrapper.find('input[name="email"]')
    emailInput.simulate('change', {target: {value: 'test@test.com'}})
    let emailFormGroup = wrapper.find('div[name="form-control-email"]')
    expect(emailFormGroup.hasClass('has-success')).to.be.true
  })

  it('Have the email field with the has-error class after typing a invalid email', () => {
    let emailInput = wrapper.find('input[name="email"]')
    emailInput.simulate('change', {target: {value: 'test'}})
    let emailFormGroup = wrapper.find('div[name="form-control-email"]')
    expect(emailFormGroup.hasClass('has-error')).to.be.true
  })

  it('Have the empty name field with the has-warning class', () => {
    let nameFormGroup = wrapper.find('div[name="form-control-name"]')
    expect(nameFormGroup.hasClass('has-warning')).to.be.true
  })

  it('Have the name field with the has-success class after typing a valid name', () => {
    let nameInput = wrapper.find('input[name="name"]')
    nameInput.simulate('change', {target: {value: 'test'}})
    let nameFormGroup = wrapper.find('div[name="form-control-name"]')
    expect(nameFormGroup.hasClass('has-success')).to.be.true
  })

  it('Have the empty password field with the has-warning class', () => {
    let passwordFormGroup = wrapper.find('div[name="form-control-password"]')
    expect(passwordFormGroup.hasClass('has-warning')).to.be.true
  })

  it('Have the password field with the has-success class after typing a valid password', () => {
    let passwordInput = wrapper.find('input[name="password"]')
    passwordInput.simulate('change', {target: {value: 'test@test.com'}})
    let passwordFormGroup = wrapper.find('div[name="form-control-password"]')
    expect(passwordFormGroup.hasClass('has-success')).to.be.true
  })

  it('Have the password field with the has-error class after typing a invalid password', () => {
    let passwordInput = wrapper.find('input[name="password"]')
    passwordInput.simulate('change', {target: {value: 'test'}})
    let passwordFormGroup = wrapper.find('div[name="form-control-password"]')
    expect(passwordFormGroup.hasClass('has-error')).to.be.true
    expect(wrapper.find('div[name="error-msg-password"]')).to.exist
  })

  it('Have the submit button enabled when every field are valid', () => {
    let emailInput = wrapper.find('input[name="email"]')
    let nameInput = wrapper.find('input[name="name"]')
    let passwordInput = wrapper.find('input[name="password"]')
    let submitBtn = wrapper.find('button')

    emailInput.simulate('change', {target: {value: 'test@test.com'}})
    nameInput.simulate('change', {target: {value: 'test'}})
    passwordInput.simulate('change', {target: {value: '1234567'}})

    expect(submitBtn.props().disabled).to.be.false
  })

  it('Have the submit button stay disable when every field have value but some value are invalid', () => {
    let emailInput = wrapper.find('input[name="email"]')
    let nameInput = wrapper.find('input[name="name"]')
    let passwordInput = wrapper.find('input[name="password"]')
    let submitBtn = wrapper.find('button')

    emailInput.simulate('change', {target: {value: 'test@test.com'}})
    nameInput.simulate('change', {target: {value: 'test'}})
    passwordInput.simulate('change', {target: {value: '123'}})

    expect(submitBtn.props().disabled).to.be.true
  })

  // TODO debug
  /*
  it('Contains 3 input fields', () => {
    expect(wrapper.find('input:not([type="hidden"])')).to.have.lengthOf(3)
  })
  */
})
