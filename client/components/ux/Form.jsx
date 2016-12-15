import React, { PropTypes } from 'react'
import validator from 'validator'

import BaseComponent from 'core/BaseComponent'

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
    const init = function (component, children, index) {
      let injectedProps = {}

      // Validated Input
      if (component.props.validate) {
        const componentName = component.props.name

        injectedProps['onChange'] = this.setValue

        // TODO what if it is not a string?
        values[componentName] = component.props['value'] || ''

        // name validation
        if (componentName === undefined) {
          this.error('Missing props "name" for component:', component)
          throw new Error('Fatal error in <Form />')
        }

        validatorsByName[componentName] = []
        // isRequired
        if (component.props.isRequired) {
          let effectiveValidator = this.getValidator('isRequired')
          validatorsByName[componentName].push(effectiveValidator)
          validators.push({
            name: componentName,
            validator: effectiveValidator
          })
        }

        // isLongerThan
        if (component.props.isLongerThan) {
          let effectiveValidator = (value) => { return value.length > component.props.isLongerThan }
          validatorsByName[componentName].push(effectiveValidator)
          validators.push({
            name: componentName,
            validator: effectiveValidator
          })
        }

        // isEmail
        if (component.props.isEmail) {
          let effectiveValidator = this.getValidator('isEmail')
          validatorsByName[componentName].push(effectiveValidator)
          validators.push({
            name: componentName,
            validator: effectiveValidator
          })
        }

        let validationState = this.validateField(validatorsByName[componentName], component.props['value'] || '')
        validationsState[componentName] = validationState
        injectedProps['validationState'] = validationState
      }

      const clonedComponent = <component.type key={index} {...component.props} {...injectedProps}>
        {children}
      </component.type>
      return clonedComponent
    }.bind(this)

    const children = this.traverseChildren(this.props.children, init)

    this.state = {
      validators,
      validationsState,
      validatorsByName,
      values,
      children
    }
  }

  getValidator (validatorName) {
    if (validatorName === 'isRequired') {
      return (value) => { return !validator.isEmpty(value) }
    } else {
      return validator[validatorName]
    }
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

  validateField (validators, value) {
    if (value === '') {
      if (validators.indexOf('isRequired')) {
        return 'error'
      } else {
        return 'warning'
      }
    } else {
      let results = validators.map((validator) => {
        return validator(value)
      })

      let result = results.reduce((a, b) => { return a && b })
      if (result) {
        return 'success'
      } else {
        return 'error'
      }
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
      return validatorConfig.validator(this.state.values[validatorConfig.name])
    })
    const isValid = validations.reduce((a, b) => { return a && b })
    return !isValid
  }

  render () {
    // eslint-disable-next-line
    const init = function (component, children, index) {
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
    let children = this.traverseChildren(this.state.children, init)

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
