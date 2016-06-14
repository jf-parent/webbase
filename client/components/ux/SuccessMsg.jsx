import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

import SuccessMsgStyle from './SuccessMsgStyle.postcss'

class SuccessMsg extends Component {

  static propTypes = {
    msgId: PropTypes.string.isRequired,
    name: PropTypes.string
  }

  render () {
    return (
      <div className={'alert alert-success ' + SuccessMsgStyle['success-msg']} role='alert' name={this.props.name} >
        <FormattedMessage
          id={this.props.msgId}
          defaultMessage={this.props.msgId}
        />
      </div>
    )
  }
}

export default SuccessMsg
