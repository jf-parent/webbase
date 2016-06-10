import React from 'react'

import BaseComponent from 'core/BaseComponent'
import Loading from 'components/ux/Loading'
import ErrorMsg from 'components/ux/ErrorMsg'

class Logout extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()

    this.logout()
  }

  logout () {
    this.debug('logout')

    this.props.actions.doLogout(this.props.session.token)
  }

  render () {
    this.debug('render')

    const errorMsg = this.props.logout.error

    if (errorMsg) {
      return (
        <ErrorMsg msgId={errorMsg} />
      )
    } else {
      return (
        <Loading />
      )
    }
  }
}

module.exports = Logout
