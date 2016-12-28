import React from 'react'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'

class Home extends BaseComponent {

  render () {
    return (
      <div className='row'>
        <div className='small-1 columns'>
          <h1>
            <FormattedMessage
              id='nav.Home'
              defaultMessage='Home'
            />
          </h1>
        </div>
      </div>
    )
  }
}

export default Home
