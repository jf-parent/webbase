import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

class Profile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      errorMsg: false
    }
  }

  render () {
    return (
      <div>
        <FormattedMessage
          id='nav.profile'
          defaultMessage='Profile'
        />
      </div>
    )
  }
}

module.exports = Profile
