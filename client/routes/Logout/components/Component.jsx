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

    this.props.actions.doLogout(this.props.state.session.token)
  }

  render () {
    this.debug('render')

    const errorMsgId = this.props.state.logout.errorMsgId

    if (errorMsgId) {
      return (
        <ErrorMsg msgId={errorMsgId} />
      )
    } else {
      return (
        <Loading />
      )
    }
  }
}

module.exports = Logout
