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
    const className = 'form-group' + (this.props.className || ' ') +
      (this.showRequired() ? ' has-warning' : this.showError() ? ' has-error' : ' has-success')
    const name = 'form-control-' + this.props.name

    // const errorMessage = this.getErrorMessage()
    return (
      <div className={className} name={name}>
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
