import React, { Component } from "react"

class ErrorMsg extends Component {

  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
        <div className="alert alert-danger err-msg" role="alert">
            <strong>Error:</strong> {this.props.msg}
        </div>
    )
  }
}

export default ErrorMsg
