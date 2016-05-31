import React, { Component } from 'react'
import Loader from 'halogen/ScaleLoader'

import LoadingStyle from './Loading.css'

class Loading extends Component {
  render () {
    return (
      <Loader className={LoadingStyle.loader} color='#000' size='16px' margin='4px' />
    )
  }
}

module.exports = Loading
