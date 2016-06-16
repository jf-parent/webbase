import React from 'react'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'

const url = require('../assets/images/404.png')

class ErrorPage extends BaseComponent {
  render () {
    return (
      <div className='container-fluid'>
        <h1 className='text-center'>
          <FormattedMessage
            id='errorPage.PageNotFound'
            defaultMessage='Page Not Found!'
          />
        </h1>
        <img className='img-responsive center-block' src={url} />
      </div>
    )
  }
}

module.exports = ErrorPage
