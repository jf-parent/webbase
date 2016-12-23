import React from 'react'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'

class BrowserNotSupported extends BaseComponent {
  render () {
    return (
      <div>
        <h2>
          <FormattedMessage
            id='browserNotSupported.Header'
            defaultMessage='Unsupported browser'
          />
        </h2>
      </div>
    )
  }
}

module.exports = BrowserNotSupported
