import React from 'react'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'

class Profile extends BaseComponent {
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
