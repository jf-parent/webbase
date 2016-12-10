import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import NotificationPopup from './NotificationPopup'
import BaseComponent from 'core/BaseComponent'
import Navbar from 'components/Navbar'
import { actions } from 'reducers/notification'
import { actions as AuthActions } from 'reducers/session'

class AuthenticatedNav extends BaseComponent {

  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'onOpenNotification',
      'doLogout'
    )
  }

  doLogout () {
    this.props.authActions.doLogout(this.props.state.session.token)
  }

  onOpenNotification (event) {
    this.props.actions.doOpenNotificationPopup()
  }

  render () {
    let notificationNumber = null
    if (this.props.state.notification.newNotificationNumber > 0) {
      notificationNumber = <span className='wb-notification-number'>{this.props.state.notification.newNotificationNumber}</span>
    }
    const notification = <span>
      <button onClick={this.onOpenNotification} style={{'fontSize': '24px'}}>
        <i className='fa fa-bell-o'></i>
      </button>
      {notificationNumber}
    </span>

    const routes = [
      {
        name: 'Home',
        text: 'Home',
        href: '/'
      }, {
        name: 'Dashboard',
        text: 'Dashboard',
        href: '/dashboard'
      }, {
        name: 'ComponentLibrary',
        text: 'Library',
        href: '/component-library'
      }, {
      // RIGHT first is last
        alignment: 'right',
        component: notification
      }, {
        name: 'Logout',
        text: 'Logout',
        alignment: 'right',
        onClick: this.doLogout
      }, {
        name: 'Profile',
        text: 'Profile',
        alignment: 'right',
        href: '/profile'
      }
    ]
    return (
      <div>
        <NotificationPopup />
        <Navbar routes={routes} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    state
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    authActions: bindActionCreators(AuthActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedNav)
