import React, { PropTypes } from 'react'
import validator from 'validator'

import BaseComponent from 'core/BaseComponent'

/* *********************************************************
[*] Real example => client/routes/Login/components/Component.jsx
EXAMPLE:
  <Form ref='form'>
    <div className='row'>
      <div className='medium-6 columns'>
        <MaterialInput
          label={emailPlaceholder}
->          validate // tell the Form that this field need to be validated
->          isEmail // validator
->          isRequired // validator
->          name='email' // name is required
          type='text'
        />
      </div>
    </div>
    <div className='row'>
      <div className='medium-6 columns'>
        <LaddaButton
          name='login-btn'
->          type='submit' // tell the Form that this button need to be disabled if the form is invalid
          isLoading={this.props.state.login.loading}
          onSubmit={this.onSubmit}
        >
          <FormattedMessage
            id='login.SubmitBtn'
            defaultMessage='Login'
          />
        </LaddaButton>
      </div>
    </div>
  </Form>
**********************************************************/

// VALIDATORS CONFIG
// Don't reinvent the wheel => https://github.com/chriso/validator.js
// Add validators here
// VVVVVVVVVVVVVVVVVVV
const VALIDATORS = {
  'isRequired': (value, args) => { return !validator.isEmpty(value || '') },
  'isLongerThan': (value, args) => { return (value || '').length > args[0] },
  'isEmail': (value, args) => { return validator.isEmail(value || '') }
}

class Form extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'getValidator',
      'isFormInvalid',
      'traverseChildren',
      'validateField',
      'setValue'
    )

    // validators
    let validators = []
    let validatorsByName = {}
    let validationsState = {}
    let values = {}
    const injectPropsFunc = function (component, children, index) {
      let injectedProps = {}

      // Validated Input
      // TODO walk the props object and if one props
      // is satisfaying the regex /is{1}[A-Z]{1}/
      // then inject the props
      if (component.props.validate) {
        const componentName = component.props.name

        // Inject our on onChange event handler
        injectedProps['onChange'] = this.setValue

        // TODO what if it is not a string?
        values[componentName] = component.props['value'] || ''

        // the props `name` is required in order to do the mapping
        if (componentName === undefined) {
          this.error('Missing props "name" for component:', component)
          throw new Error('Fatal error in <Form />')
        }

        // Init the validators configs
        validatorsByName[componentName] = []
        Object.keys(component.props).map((key, index) => {
          // Match only props that start with 'is' followed by a capital letter
          if (key.match(/is{1}[A-Z]{1}/)) {
            let effectiveValidator = this.getValidator(key)
            let validatorConfig = {
              componentName: componentName,
              name: key,
              func: effectiveValidator,
              extraArgs: [
                component.props[key]
              ]
            }
            validatorsByName[componentName].push(validatorConfig)
            validators.push(validatorConfig)
          }
        })

        // Set the initial validation state of the component
        let validationState = this.validateField(validatorsByName[componentName], component.props['value'] || '')
        validationsState[componentName] = validationState
        injectedProps['validationState'] = validationState
      }

      // Clone the component with the new injected props
      const clonedComponent = <component.type key={index} {...component.props} {...injectedProps}>
        {children}
      </component.type>

      return clonedComponent
    }.bind(this)

    const children = this.traverseChildren(this.props.children, injectPropsFunc)
    this.state = {
      validators,
      validationsState,
      validatorsByName,
      values,
      children
    }
  }

  getValidator (validatorName) {
    return VALIDATORS[validatorName]
  }

  traverseChildren (component, func, index = 0) {
    if (Array.isArray(component)) {
      return component.map((c, index) => {
        return this.traverseChildren(c, func, index)
      })
    } else {
      if (component.props.children) {
        return func(component, this.traverseChildren(component.props.children, func, index), index)
      // Leaf of the tree
      } else {
        return func(component, null, index)
      }
    }
  }

  validateField (validatorConfigs, value) {
    let isRequired = false
    let results = validatorConfigs.map((validatorConfig) => {
      if (validatorConfig.name === 'isRequired') {
        isRequired = true
      }
      return validatorConfig.func(value, validatorConfig.extraArgs)
    })

    // NOTE special case for isRequired
    if (value === '') {
      if (isRequired) {
        return 'error'
      } else {
        return 'warning'
      }
    }

    let result = results.reduce((a, b) => { return a && b })
    if (result) {
      return 'success'
    } else {
      return 'error'
    }
  }

  setValue (event) {
    let targetName = event.target.name
    let targetValue = event.target.value
    let { values, validationsState } = this.state
    values[targetName] = targetValue
    validationsState[targetName] = this.validateField(this.state.validatorsByName[targetName], targetValue)
    this.setState({values, validationsState})
  }

  isFormInvalid () {
    const validations = this.state.validators.map((validatorConfig) => {
      return validatorConfig.func(this.state.values[validatorConfig.componentName], validatorConfig.extraArgs)
    })
    const isValid = validations.reduce((a, b) => { return a && b })
    return !isValid
  }

  render () {
    // eslint-disable-next-line
    const mapStateToProps = function (component, children, index) {
      let injectedProps = {}

      // Validation button
      if (component.props.type === 'submit') {
        injectedProps['isDisabled'] = this.isFormInvalid()
      }

      // Validated Input
      if (component.props.validate) {
        const componentName = component.props.name
        injectedProps['value'] = this.state['values'][componentName]
        injectedProps['validationState'] = this.state['validationsState'][componentName]
      }

      const clonedComponent = <component.type key={index} {...component.props} {...injectedProps}>
        {children}
      </component.type>
      return clonedComponent
    }.bind(this)

    let children = this.traverseChildren(this.state.children, mapStateToProps)

    return (
      <form>
        {children}
      </form>
    )
  }
}

Form.PropTypes = {
  children: PropTypes.array.isRequired
}

export default Form
