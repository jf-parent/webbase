import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'

import BaseComponent from 'core/BaseComponent'

class MaterialInput extends BaseComponent {

  render () {
    const { formatMessage } = this.props.intl
    return (
      <label className='wb-input'>
        <input
          className={'wb-input_field wb-input_field_' + this.props.validationState}
          name={this.props.name}
          type={this.props.type}
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
          placeholder=' '
          value={this.props.value}
        />
        <span className='wb-input_name'>{formatMessage({id: this.props.label})}</span>
      </label>
    )
  }
}

MaterialInput.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  validationState: PropTypes.string, // warning || error || success
  type: PropTypes.string.isRequired,
  onBlur: PropTypes.func
}

MaterialInput.defaultProps = {
  validationState: 'warning'
}

export default injectIntl(MaterialInput)
