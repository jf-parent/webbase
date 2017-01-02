import React from 'react'
import { expect } from 'chai'

import { injectRequiredReducer, mountWithContext } from 'helpers/TestHelper'
import Container from '../containers/Container'
import reducer from '../modules/reducer'

injectRequiredReducer('register', reducer)

describe('<Register />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountWithContext(
      <Container />
    )
    wrapper.props().store.dispatch({type: 'REGISTER_RESET_STATE'})
  })

  it('Have a required email input field', () => {
    let emailInput = wrapper.find('MaterialInput').get(0)
    expect(emailInput.props.isRequired).to.be.true
  })

  it('Have a required name input field', () => {
    let nameInput = wrapper.find('MaterialInput').get(1)
    expect(nameInput.props.isRequired).to.be.true
  })

  it('Have a required password input field', () => {
    let passwordInput = wrapper.find('MaterialInput').get(2)
    expect(passwordInput.props.isRequired).to.be.true
  })

  it('Have a required confirm password input field', () => {
    let passwordConfirmInput = wrapper.find('MaterialInput').get(3)
    expect(passwordConfirmInput.props.isRequired).to.be.true
  })

  {%- if cookiecutter.closed_registration == 'y' %}
  it('Have a required token input field', () => {
    let tokenInput = wrapper.find('MaterialInput').get(4)
    expect(tokenInput.props.isRequired).to.be.true
  })
  {%- endif %}

  it('Have a disabled submit button when the form is invalid', () => {
    let submitBtn = wrapper.find('LaddaButton').get(0)
    expect(submitBtn.props.isDisabled).to.be.true
  })

  it('Have a submit button not loading when the store state is not loading', () => {
    let submitBtn = wrapper.find('LaddaButton').get(0)
    expect(submitBtn.props.isLoading).to.be.false
  })

  it('Have the empty email field with the "error" class', () => {
    let emailInput = wrapper.find('input[name="email"]')
    expect(emailInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('Have the empty name field with the "error" class', () => {
    let nameInput = wrapper.find('input[name="name"]')
    expect(nameInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('Have the empty password field with the "error" class', () => {
    let passwordInput = wrapper.find('input[name="password"]')
    expect(passwordInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('Have the empty confirm password field with the "error" class', () => {
    let passwordConfirmInput = wrapper.find('input[name="passwordConfirm"]')
    expect(passwordConfirmInput.hasClass('wb-input_field_error')).to.be.true
  })

  {%- if cookiecutter.closed_registration == 'y' %}
  it('Have the empty token field with the "error" class', () => {
    let tokenInput = wrapper.find('input[name="registration_token"]')
    expect(tokenInput.hasClass('wb-input_field_error')).to.be.true
  })
  {%- endif %}

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

  it('Have the name field with the "success" class after typing a valid name', () => {
    let nameInput = wrapper.find('input[name="name"]')
    nameInput.simulate('change', {target: {name: 'name', value: 'Test'}})
    expect(nameInput.hasClass('wb-input_field_success')).to.be.true
  })

  it('Have the name field with the "error" class after typing a invalid name', () => {
    let passwordInput = wrapper.find('input[name="name"]')
    passwordInput.simulate('change', {target: {name: 'name', value: '1'}})
    expect(passwordInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('Have the password field with the "success" class after typing a valid password', () => {
    let passwordInput = wrapper.find('input[name="password"]')
    passwordInput.simulate('change', {target: {name: 'password', value: '123456'}})
    expect(passwordInput.hasClass('wb-input_field_success')).to.be.true
  })

  it('Have the password field with the "error" class after typing a invalid password', () => {
    let nameInput = wrapper.find('input[name="password"]')
    nameInput.simulate('change', {target: {name: 'password', value: '1'}})
    expect(nameInput.hasClass('wb-input_field_error')).to.be.true
  })

  {%- if cookiecutter.closed_registration == 'y' %}
  it('Have the token field with the "success" class after typing a valid token', () => {
    let tokenInput = wrapper.find('input[name="registration_token"]')
    tokenInput.simulate('change', {target: {name: 'registration_token', value: 'test@test.com'}})
    expect(tokenInput.hasClass('wb-input_field_success')).to.be.true
  })

  it('Have the token field with the "error" class after typing a invalid token', () => {
    let tokenInput = wrapper.find('input[name="registration_token"]')
    tokenInput.simulate('change', {target: {name: 'registration_token', value: ''}})
    expect(tokenInput.hasClass('wb-input_field_error')).to.be.true
  })
  {%- endif %}

  it('Have the submit button enabled when every field are valid', () => {
    let emailInput = wrapper.find('input[name="email"]')
    let nameInput = wrapper.find('input[name="name"]')
    let passwordInput = wrapper.find('input[name="password"]')
    let passwordConfirmInput = wrapper.find('input[name="passwordConfirm"]')
    {%- if cookiecutter.closed_registration == 'y' %}
    let tokenInput = wrapper.find('input[name="registration_token"]')
    {%- endif %}
    let submitBtn = wrapper.find('LaddaButton').get(0)

    emailInput.simulate('change', {target: {name: 'email', value: 'test@test.com'}})
    nameInput.simulate('change', {target: {name: 'name', value: 'Test'}})
    passwordInput.simulate('change', {target: {name: 'password', value: '123456'}})
    passwordConfirmInput.simulate('change', {target: {name: 'passwordConfirm', value: '123456'}})
    {%- if cookiecutter.closed_registration == 'y' %}
    tokenInput.simulate('change', {target: {name: 'registration_token', value: '123456'}})
    {%- endif %}

    expect(submitBtn.props.isDisabled).to.be.false
  })

  it('Have the submit button stay disable when every field have value but some value are invalid', () => {
    let emailInput = wrapper.find('input[name="email"]')
    let nameInput = wrapper.find('input[name="name"]')
    let passwordInput = wrapper.find('input[name="password"]')
    let passwordConfirmInput = wrapper.find('input[name="passwordConfirm"]')
    {%- if cookiecutter.closed_registration == 'y' %}
    let tokenInput = wrapper.find('input[name="registration_token"]')
    {%- endif %}
    let submitBtn = wrapper.find('LaddaButton').get(0)

    emailInput.simulate('change', {target: {name: 'email', value: 'test#test.com'}})
    nameInput.simulate('change', {target: {name: 'name', value: 'T'}})
    passwordInput.simulate('change', {target: {name: 'password', value: '123'}})
    passwordConfirmInput.simulate('change', {target: {name: 'password', value: '123456'}})
    {%- if cookiecutter.closed_registration == 'y' %}
    tokenInput.simulate('change', {target: {name: 'registration_token', value: ''}})
    {%- endif %}

    expect(submitBtn.props.isDisabled).to.be.true
  })

  it('Have the confirm password input invalid when it value is different from the password', () => {
    let passwordInput = wrapper.find('input[name="password"]')
    let passwordConfirmInput = wrapper.find('input[name="passwordConfirm"]')

    passwordInput.simulate('change', {target: {name: 'password', value: '1234567'}})
    passwordConfirmInput.simulate('change', {target: {name: 'password', value: '123456'}})

    expect(passwordConfirmInput.hasClass('wb-input_field_error')).to.be.true
  })

  it('Have the div "email is available" when the store state emailIsAvailable is true', () => {
    wrapper.props().store.dispatch({type: 'REGISTER_CHECK_EMAIL_DISPONIBILITY_SUCCESS', data: {available: true}})
    let emailIsAvailable = wrapper.find('[name="emailAvailable"]')
    expect(emailIsAvailable.props().style.color).to.equal('green')
  })

  it('Have the div "email is not available" when the store state emailIsAvailable is false', () => {
    wrapper.props().store.dispatch({type: 'REGISTER_CHECK_EMAIL_DISPONIBILITY_SUCCESS', data: {available: false}})
    let emailNotAvailable = wrapper.find('[name="emailNotAvailable"]')
    expect(emailNotAvailable.props().style.color).to.equal('red')
  })

  it('Have the login link', () => {
    let loginLink = wrapper.find('Link').get(0)
    expect(loginLink.props.to).to.be.equal('/login')
  })
})

