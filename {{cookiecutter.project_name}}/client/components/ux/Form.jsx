import React, { PropTypes } from 'react'
import validator from 'validator'
import { Tooltip } from 'antd'

import BaseComponent from 'core/BaseComponent'

/* *********************************************************
[*] Real example => client/routes/Profile/components/Component.jsx
EXAMPLE:
  <Form ref='form'>
    <div className='row'>
      <div className='medium-6 columns'>
        <MaterialInput
          label={emailPlaceholder}
->        validate // tell the Form that this field need to be validated
->        validationMsgId='email.EmailValidationMsg' // message shown when the input is invalid
->        isEmail // validator
->        isRequired // validator
->        name='email' // name is required
          type='text'
        />
      </div>
    </div>
    <div className='row'>
      <div className='medium-6 columns'>
        <LaddaButton
          name='login-btn'
->        type='submit' // tell the Form that this button need to be disabled if the form is invalid
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
// |||||||||||||||||||
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
    let validatorsByName = {}
    let validationsState = {}
    let values = {}
    let joinWith = {}
    const initValidators = function (component, children, index) {
      // Validated Input
      // TODO walk the props object and if one props
      // is satisfaying the regex /is{1}[A-Z]{1}/
      // then inject the props
      if (component.props.validate) {
        const componentName = component.props.name

        // the props `name` is required in order to do the mapping
        if (componentName === undefined) {
          this.error('Missing props "name" for component:', component)
          throw new Error('Fatal error in <Form />')
        }

        // TODO what if it is not a string?
        values[componentName] = component.props['value'] || ''

        // JoinWith state
        if (component.props.joinWith) {
          joinWith[componentName] = component.props.joinWith
        }

        // Init the validators configs
        validatorsByName[componentName] = []
        Object.keys(component.props).map((key, index) => {
          // is the key a validators
          if (Object.keys(VALIDATORS).indexOf(key) !== -1) {
            const effectiveValidator = this.getValidator(key)
            const validatorConfig = {
              componentName,
              name: key,
              func: effectiveValidator,
              extraArgs: [
                component.props[key]
              ]
            }
            validatorsByName[componentName].push(validatorConfig)
          }
        })

        if (component.props['validatorFunc']) {
          const validatorConfig = {
            name: 'validatorFunc',
            componentName,
            func: component.props.validatorFunc,
            extraArgs: []
          }
          validatorsByName[componentName].push(validatorConfig)
        }

        // Set the initial validation state of the component
        const validationState = this.validateField(validatorsByName[componentName], component.props['value'] || '')
        validationsState[componentName] = validationState
      }
    }.bind(this)

    this.traverseChildren(this.props.children, initValidators)

    this.state = {
      validationsState,
      validatorsByName,
      joinWith,
      values
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
      if (component === null) {
        return component
      } else if (component.props === undefined) {
        return component
      } else {
        if (component.props.children) {
          return func(component, this.traverseChildren(component.props.children, func, index), index)
        // Leaf of the tree
        } else {
          return func(component, null, index)
        }
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
    if (this.state.joinWith[targetName]) {
      let joinedWithComponentName = this.state.joinWith[targetName]
      validationsState[joinedWithComponentName] = this.validateField(this.state.validatorsByName[joinedWithComponentName], this.state.values[joinedWithComponentName])
    }
    this.setState({values, validationsState})
  }

  isFormInvalid () {
    const validations = Object.keys(this.state.validatorsByName).map((componentName) => {
      return this.validateField(this.state.validatorsByName[componentName], this.state.values[componentName]) !== 'error'
    })
    const isValid = validations.reduce((a, b) => { return a && b })
    return !isValid
  }

  render () {
    // eslint-disable-next-line
    const mapStateToProps = function (component, children, index) {
      let injectedProps = {}

      // Set the state of the button
      if (component.props.type === 'submit') {
        injectedProps['isDisabled'] = this.isFormInvalid()
      }

      // Validated Input
      if (component.props.validate) {
        const componentName = component.props.name

        // Update the component state and add the listener
        injectedProps['value'] = this.state['values'][componentName]
        injectedProps['validationState'] = this.state['validationsState'][componentName]
        injectedProps['onChange'] = this.setValue

        // Add the validation Tooltip if necessary
        if (component.props.validationMsgId) {
          const { formatMessage } = this.props.intl
          return (
            <Tooltip title={formatMessage({'id': component.props.validationMsgId})}>
              <div>
                <component.type key={index} {...component.props} {...injectedProps}>
                  {children}
                </component.type>
              </div>
            </Tooltip>
          )
        }
      }

      // default cloned component
      return (
        <component.type key={index} {...component.props} {...injectedProps}>
          {children}
        </component.type>
      )
    }.bind(this)

    const children = this.traverseChildren(this.props.children, mapStateToProps)

    return (
      <form>
        {children}
      </form>
    )
  }
}

Form.PropTypes = {
  children: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired
}

export default Form
