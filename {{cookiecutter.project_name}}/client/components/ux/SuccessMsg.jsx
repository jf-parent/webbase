import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

class SuccessMsg extends Component {

  static propTypes = {
    msgId: PropTypes.string.isRequired,
    name: PropTypes.string
  }

  render () {
    return (
      <div className='callout success' style={{"{{"}}margin: '2px'{{"}}"}} role='alert' name={this.props.name || this.props.msgId} >
        <i className='fa fa-thumbs-up' aria-hidden='true'></i>
        {' '}
        <FormattedMessage
          id={this.props.msgId}
          defaultMessage={this.props.msgId}
        />
      </div>
    )
  }
}

export default SuccessMsg
