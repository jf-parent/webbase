import React from 'react'
import { expect } from 'chai'
import sinon from 'sinon'

import { mountWithContext, intl } from 'helpers/TestHelper'
import Form from './Form'
import MaterialInput from 'components/ux/MaterialInput'

describe('<Form />', () => {
  it('has a validation helper popover if the validationMsgId is set', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput
          type='text'
          label='general.Login'
          validate
          name='test'
          validationMsgId='general.Login'
        />
      </Form>
    )
    let tooltip = wrapper.find('Tooltip').get(1)
    expect(tooltip.props.title).to.be.equal('Login')
  })

  it('has no validation helper popover if the validationMsgId is not set', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput
          type='text'
          label='general.Login'
          validate
          name='test'
        />
      </Form>
    )
    let tooltip = wrapper.find('Tooltip')
    expect(tooltip.nodes).to.be.empty
  })

  it('does not care about un-validate component', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='test' name='test' />
      </Form>
    )
    expect(wrapper.state().validationsState).to.be.empty
    expect(wrapper.state().joinWith).to.be.empty
    expect(wrapper.state().validatorsByName).to.be.empty
    expect(wrapper.state().values).to.be.empty
  })

  it('does care about validate component', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='test' name='test' validate isRequired />
      </Form>
    )
    expect(wrapper.state().validationsState).to.deep.equal({test: 'success'})
    expect(wrapper.state().joinWith).to.be.empty
    expect(wrapper.state().validatorsByName).to.not.empty
    expect(wrapper.state().values).to.deep.equal({test: 'test'})
  })

  it('has a valid form state when the form is valid', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='1' name='test1' validate isRequired />
        <MaterialInput type='text' label='general.Login' value='2' name='test2' validate isRequired />
        <MaterialInput type='text' label='general.Login' value='3' name='test3' validate isRequired />
        <MaterialInput type='text' label='general.Login' value='4' name='test4' validate isRequired />
      </Form>
    )
    expect(wrapper.instance().isFormInvalid()).to.be.false
  })

  it('has an invalid form state when the form is invalid', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='1' name='test1' validate isRequired />
        <MaterialInput type='text' label='general.Login' value='2' name='test2' validate isRequired />
        <MaterialInput type='text' label='general.Login' value='3' name='test3' validate isRequired />
        <MaterialInput type='text' label='general.Login' value='4' name='test4' validate isRequired isEmail />
      </Form>
    )
    expect(wrapper.instance().isFormInvalid()).to.be.true
  })

  it('initialize the validation state using the provided value from the prop', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' name='test' validate isRequired />
      </Form>
    )
    expect(wrapper.state().validationsState).to.deep.equal({test: 'error'})
    wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='test' name='test' validate isRequired />
      </Form>
    )
    expect(wrapper.state().validationsState).to.deep.equal({test: 'success'})
    wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' name='test' validate isEmail />
      </Form>
    )
    expect(wrapper.state().validationsState).to.deep.equal({test: 'warning'})
  })

  it('use the value provided by the component prop to initialize the value of the input', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='test' name='test' validate isRequired />
      </Form>
    )
    let input = wrapper.find({name: 'test'})
    expect(input.props().value).to.be.equal('test')
  })

  it('support the isEmail validator', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='test$test.com' name='test' validate isEmail />
      </Form>
    )
    expect(wrapper.state().validationsState).to.deep.equal({test: 'error'})
    wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='test@test.com' name='test' validate isEmail />
      </Form>
    )
    expect(wrapper.state().validationsState).to.deep.equal({test: 'success'})
  })

  it('support the isRequired validator', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' name='test' validate isRequired />
      </Form>
    )
    expect(wrapper.state().validationsState).to.deep.equal({test: 'error'})
    wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='test' name='test' validate isRequired />
      </Form>
    )
    expect(wrapper.state().validationsState).to.deep.equal({test: 'success'})
  })

  it('update the state when the value change', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='test' name='test' validate isEmail />
      </Form>
    )
    expect(wrapper.state().validationsState).to.deep.equal({test: 'error'})

    let input = wrapper.find({name: 'test'})
    input.simulate('change', {target: {name: 'test', value: 'test@test.com'}})
    expect(wrapper.state().validationsState).to.deep.equal({test: 'success'})
  })

  it('support the isLongerThan validator', () => {
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='test' name='test' validate isLongerThan={10} />
      </Form>
    )
    expect(wrapper.state().validationsState).to.deep.equal({test: 'error'})
    wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' label='general.Login' value='12345678901' name='test' validate isLongerThan={10} />
      </Form>
    )
    expect(wrapper.state().validationsState).to.deep.equal({test: 'success'})
  })

  it('raise an exception when a validated component do not have the name prop', () => {
    expect(
      () => {
        mountWithContext(
          <Form intl={intl}>
            <MaterialInput type='text' label='general.Login' validate isRequired />
          </Form>
        )
      }
    ).to.throw(Error)
  })

  it('support the validatorFunc', () => {
    let spy = sinon.spy()
    let wrapper = mountWithContext(
      <Form intl={intl}>
        <MaterialInput type='text' name='test' label='general.Login' validate isRequired validatorFunc={spy} />
      </Form>
    )
    let input = wrapper.find({name: 'test'})
    input.simulate('change', {target: {name: 'test', value: 'test@test.com'}})
    expect(spy.called).to.be.true
  })

  /*
  // TODO
  it('support the joinWith another component validation state', () => {
  })

  */
})
