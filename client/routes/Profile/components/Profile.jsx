import React, { Component } from 'react'

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
        Profile
      </div>
    )
  }
}

module.exports = Profile
