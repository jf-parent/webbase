import React, { Component, PropTypes } from 'react'
import bootstrap from 'bootstrap/dist/css/bootstrap.css'

import ErrorMsgStyle from './ErrorMsg.css'

class ErrorMsg extends Component {

  static propTypes = {
    msg: PropTypes.string.isRequired,
    name: PropTypes.string
  }

  render () {
    return (
      <div className={bootstrap['alert'] + ' ' + bootstrap['alert-danger'] + ' ' + ErrorMsgStyle['err-msg']} role='alert' name={this.props.name} >
        <strong>Error:</strong> {this.props.msg}
      </div>
    )
  }
}

export default ErrorMsg
