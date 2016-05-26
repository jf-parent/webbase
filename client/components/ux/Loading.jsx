import React, { Component } from 'react'
import Loader from 'halogen/ScaleLoader'

class Loading extends Component {
  render () {
    return (
      <Loader id='loader' color='#000' size='16px' margin='4px' />
    )
  }
}

module.exports = Loading
