import React, { PropTypes } from 'react'
import Formsy from 'formsy-react'

const ValidatedInput = React.createClass({

  mixins: [Formsy.Mixin],

  propTypes: {
    type: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string
  },

  getInitialState () {
    return {
      _value: ''
    }
  },

  onValueChange (event) {
    this.setValue(event.target.value)
  },

  render () {
    const name = 'form-control-' + this.props.name

    let className = [bootstrap['form-group']]

    // User defined class
    if (this.props.className) {
      className.push(this.props.className)
    }

    // Input state class
    if (this.showRequired()) {
      className.push(bootstrap['has-warning'])
    } else if (this.showError()) {
      className.push(bootstrap['has-error'])
    } else {
      className.push(bootstrap['has-success'])
    }
    // const errorMessage = this.getErrorMessage()
    return (
      <div className={className.join([' '])} name={name}>
        <input
          className={bootstrap['form-control']}
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
