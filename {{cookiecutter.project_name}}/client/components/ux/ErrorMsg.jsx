import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

class ErrorMsg extends Component {

  static propTypes = {
    msgId: PropTypes.string.isRequired,
    name: PropTypes.string
  }

  render () {
    return (
      <div className='callout alert' style={{"{{"}}margin: '2px'{{"}}"}} role='alert' name={this.props.name || this.props.msgId} >
        <i className='fa fa-exclamation-triangle' aria-hidden='true'></i>
        {' '}
        <FormattedMessage
          id='errorMsg.Error'
          defaultMessage='{error}'
          values={{"{{"}}error: <strong>Error: </strong>{{"}}"}}
        />
        <i>
          <FormattedMessage
            id={this.props.msgId}
            defaultMessage={this.props.msgId}
          />
        </i>
      </div>
    )
  }
}

export default ErrorMsg
