import React from 'react'

import BaseComponent from 'core/BaseComponent'
import SuccessMsg from 'components/ux/SuccessMsg'

class Dashboard extends BaseComponent {
  constructor (props) {
    super(props)

    this._initLogger()
  }

  componentWillUnmount () {
    this.debug('componentWillUnmount')
    this.props.actions.resetDashboardState()
  }

  render () {
    let successMsg = this.props.state.dashboard.successMsgId ? <SuccessMsg msgId={this.props.state.dashboard.successMsgId} /> : null
    return (
      <div>
        <h1>Dashboard</h1>
        {successMsg}
        <p>Welcome to Webbase {this.props.state.session.user.name}</p>
      </div>
    )
  }
}

module.exports = Dashboard
