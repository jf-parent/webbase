import React, { PropTypes } from 'react'

import BaseComponent from 'core/BaseComponent'

class MaterialInput extends BaseComponent {

  render () {
    return (
      <label className='wb-input'>
        <input
          className={'wb-input_field wb-input_field_' + this.props.validationState}
          type={this.props.type}
          onChange={this.props.onChange}
          placeholder=' '
          value={this.props.value}
        />
        <span className='wb-input_name'>{this.props.label}</span>
      </label>
    )
  }
}

MaterialInput.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  validationState: PropTypes.string.isRequired, // warning || error || success
  type: PropTypes.string.isRequired
}

export default MaterialInput
