import React, { Component } from 'react'
import Loading from 'components/ux/Loading'
import ErrorMsg from 'components/ux/ErrorMsg'
import axios from 'axios'

class Logout extends Component {
  constructor (props) {
    super(props)

    this._initLogger()

    this.state = {
      errorMsg: false
    }

    this.logout()
  }

  logout () {
    this.debug('logout')

    axios.get('/api/logout')
      .then((response) => {
        this.debug('/api/logout (response)', response)
        let errorMsg

        if (!response.data.success) {
          errorMsg = 'An error has occured: ' + response.data.error
        } else {
          errorMsg = false
        }
        this.setState({errorMsg: errorMsg})

        window.iapp.Auth.onLogout()
      })
      .catch((response) => {
        this.debug('/api/logout erro (response)', response)
        this.setState({
          errorMsg: 'An error has occured: ' + response.data.error
        })
      })
  }

  render () {
    this.debug('render')
    if (this.state.errorMsg) {
      return (
        <ErrorMsg msg={this.state.errorMsg} />
      )
    } else {
      return (
        <Loading />
      )
    }
  }
}

module.exports = Logout
