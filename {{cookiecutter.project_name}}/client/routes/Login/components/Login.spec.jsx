import React from 'react'
import { expect } from 'chai'

import { injectRequiredReducer, mountWithContext } from 'helpers/TestHelper'
import Container from '../containers/Container'

import reducer from '../modules/reducer'

injectRequiredReducer('login', reducer)

describe('<Login />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountWithContext(
      <Container />
    )
    wrapper.props().store.dispatch({type: 'LOGIN_RESET_STATE'})
  })

  it('Have a submit button loading when the store state is loading', () => {
    wrapper.props().store.dispatch({type: 'LOGIN_LOADING'})
    let submitBtn = wrapper.find('LaddaButton').get(0)
    expect(submitBtn.props.isLoading).to.be.true
  })

  it('Have a submit button not loading when the store state is not loading', () => {
    let submitBtn = wrapper.find('LaddaButton').get(0)
    expect(submitBtn.props.isLoading).to.be.false
  })

  it('Have an error message when the store state have an error', () => {
    wrapper.props().store.dispatch({type: 'LOGIN_ERROR', errorMsgId: 'test.testId'})
    let errorMsg = wrapper.find('[name="test.testId"]')
    expect(errorMsg.hasClass('alert')).to.be.true
  })

  it('Have a required password input field', () => {
    let passwordInput = wrapper.find('MaterialInput').get(1)
    expect(passwordInput.props.isRequired).to.be.true
  })

  it('Have a required email input field', () => {
    let emailInput = wrapper.find('MaterialInput').get(0)
    expect(emailInput.props.isRequired).to.be.true
  })

  it('Have a disabled submit button', () => {
    let submitBtn = wrapper.find('LaddaButton').get(0)
    expect(submitBtn.props.isDisabled).to.be.true
  })

  it('Have the empty email field with the "error" class', () => {
    let emailInput = wrapper.find('input[name="email"]')
    expect(emailInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('Have the email field with the "success" class after typing a valid email', () => {
    let emailInput = wrapper.find('input[name="email"]')
    emailInput.simulate('change', {target: {name: 'email', value: 'test@test.com'}})
    expect(emailInput.hasClass('wb-input_field_success')).to.be.true
  })

  it('Have the email field with the "error" class after typing a invalid email', () => {
    let emailInput = wrapper.find('input[name="email"]')
    emailInput.simulate('change', {target: {name: 'email', value: 'test#test.com'}})
    expect(emailInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('Have the password field with the "success" class after typing a valid password', () => {
    let passwordInput = wrapper.find('input[name="password"]')
    passwordInput.simulate('change', {target: {name: 'password', value: '123456'}})
    expect(passwordInput.hasClass('wb-input_field_success')).to.be.true
  })

  it('Have the password field with the "error" class after typing a invalid password', () => {
    let passwordInput = wrapper.find('input[name="password"]')
    passwordInput.simulate('change', {target: {name: 'password', value: '123'}})
    expect(passwordInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('Have the submit button enabled when every field are valid', () => {
    let emailInput = wrapper.find('input[name="email"]')
    let passwordInput = wrapper.find('input[name="password"]')
    let submitBtn = wrapper.find('LaddaButton').get(0)

    emailInput.simulate('change', {target: {name: 'email', value: 'test@test.com'}})
    passwordInput.simulate('change', {target: {name: 'password', value: '123456'}})

    expect(submitBtn.props.isDisabled).to.be.false
  })

  it('Have the submit button stay disable when every field have value but some value are invalid', () => {
    let emailInput = wrapper.find('input[name="email"]')
    let passwordInput = wrapper.find('input[name="password"]')
    let submitBtn = wrapper.find('LaddaButton').get(0)

    emailInput.simulate('change', {target: {name: 'email', value: 'test#test.com'}})
    passwordInput.simulate('change', {target: {name: 'password', value: '123'}})

    expect(submitBtn.props.isDisabled).to.be.true
  })

  it('Have the forgotten password link', () => {
    let forgottenPasswordLink = wrapper.find('Link').get(1)
    expect(forgottenPasswordLink.props.to).to.be.equal('/forgottenpassword')
  })

  {%- if cookiecutter.include_registration == 'y' %}
  it('Have the register account link', () => {
    let registerLink = wrapper.find('Link').get(0)
    expect(registerLink.props.to).to.be.equal('/register')
  })
  {%- endif %}
})
