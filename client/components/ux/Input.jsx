import React, { PropTypes } from 'react'
import Formsy from 'formsy-react'

const ValidatedInput = React.createClass({

  propTypes: {
    type: PropTypes.string,
    className: PropTypes.string
  },

  mixins: [Formsy.Mixin],

  changeValue (event) {
    this.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value'])
  },

  render () {
    const className = 'form-group' + (this.props.className || ' ') +
      (this.showRequired() ? ' has-warning' : this.showError() ? ' has-error' : ' has-success')

    // const errorMessage = this.getErrorMessage()

    return (
      <div className={className}>
        <input
          className='form-control'
          {...this.props}
          type={this.props.type || 'text'}
          onChange={this.changeValue}
          value={this.getValue()}
          checked={this.props.type === 'checkbox' && this.getValue() ? 'checked' : null}
        />
      </div>
    )
  }
})

export default ValidatedInput
