import React, { PropTypes } from 'react'
import Formsy from 'formsy-react'

const ValidatedInput = React.createClass({

  mixins: [Formsy.Mixin],

  propTypes: {
    type: PropTypes.string,
    _value: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string
  },

  getInitialState () {
    return {
      _value: this.props._value || ''
    }
  },

  onValueChange (event) {
    this.setValue(event.target.value)
  },

  render () {
    const name = 'form-control-' + this.props.name

    let className = ['form-group']

    // User defined class
    if (this.props.className) {
      className.push(this.props.className)
    }

    // Input state class
    if (this.showRequired()) {
      className.push('has-warning')
    } else if (this.showError()) {
      className.push('has-error')
    } else {
      className.push('has-success')
    }
    // const errorMessage = this.getErrorMessage()
    return (
      <div className={className.join([' '])} name={name}>
        <input
          className='form-control'
          {...this.props}
          onChange={this.onValueChange}
          type={this.props.type || 'text'}
          value={this.getValue()}
        />
      </div>
    )
  }
})

export default ValidatedInput
