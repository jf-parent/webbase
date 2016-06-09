import React, { Component, PropTypes } from 'react'

import ErrorMsgStyle from './ErrorMsgStyle.postcss'

class ErrorMsg extends Component {

  static propTypes = {
    msg: PropTypes.string.isRequired,
    name: PropTypes.string
  }

  render () {
    return (
      <div className={'alert alert-danger ' + ErrorMsgStyle['err-msg']} role='alert' name={this.props.name} >
        <strong>Error:</strong> {this.props.msg}
      </div>
    )
  }
}

export default ErrorMsg
