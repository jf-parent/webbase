import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

import ErrorMsgStyle from './ErrorMsgStyle.postcss'

class ErrorMsg extends Component {

  static propTypes = {
    msgId: PropTypes.string.isRequired,
    name: PropTypes.string
  }

  render () {
    return (
      <div className={'alert alert-danger ' + ErrorMsgStyle['err-msg']} role='alert' name={this.props.name} >
        <FormattedMessage
          id='errorMsg.Error'
          defaultMessage='{error}'
          values={{
            error: <strong>Error: </strong>
          }}
        />
        <FormattedMessage
          id={this.props.msgId}
          defaultMessage={this.props.msgId}
        />
      </div>
    )
  }
}

export default ErrorMsg
