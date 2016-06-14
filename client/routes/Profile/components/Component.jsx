import React from 'react'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'

class Profile extends BaseComponent {
  render () {
    return (
      <div>
        <FormattedMessage
          id='nav.Profile'
          defaultMessage='Profile'
        />
      </div>
    )
  }
}

module.exports = Profile
