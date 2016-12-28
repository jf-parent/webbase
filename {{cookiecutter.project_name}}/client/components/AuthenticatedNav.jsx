import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import Sidemenu from 'components/Sidemenu'
import NotificationPopup from './NotificationPopup'
import { actions } from 'reducers/notification'
import { actions as AuthActions } from 'reducers/session'
import BaseComponent from 'core/BaseComponent'

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

    const links = [
      <div onClick={this.onOpenNotification} style={{"{{"}}marginBottom: '3em'{{"}}"}}>
        <div className='row'>
          <div className='small-3 columns'>
            <img name='user-icon' style={{"{{"}}borderRadius: '50%'{{"}}"}} src={this.props.state.session.user.gravatar_url} />
          </div>
          <div className='small-1 columns'>
            <b>{this.props.state.session.user.email}</b>
          </div>
          <div className='small-1 columns'>
            <button style={{"{{"}}'fontSize': '24px'{{"}}"}}>
              <i className='fa fa-bell-o'></i>
            </button>
            {notificationNumber}
          </div>
        </div>
      </div>,
      <span to='/'>
        <i className='fa fa-home' aria-hidden='true'></i>
        {' '}
        <FormattedMessage
          id='nav.Home'
          defaultMessage='Home'
        />
      </span>,
      <span to='/dashboard'>
        <i className='fa fa-bar-chart' aria-hidden='true'></i>
        {' '}
        <FormattedMessage
          id='nav.Dashboard'
          defaultMessage='Dashboard'
        />
      </span>,
      <span to='/component-library'>
        <i className='fa fa-sliders' aria-hidden='true'></i>
        {' '}
        <FormattedMessage
          id='nav.ComponentLibrary'
          defaultMessage='Component Library'
        />
      </span>,
      <span to='/profile'>
        <i className='fa fa-user' aria-hidden='true'></i>
        {' '}
        <FormattedMessage
          id='nav.Profile'
          defaultMessage='Profile'
        />
      </span>,
      <span onClick={this.doLogout}>
        <i className='fa fa-sign-out' aria-hidden='true'></i>
        {' '}
        <FormattedMessage
          id='nav.Logout'
          defaultMessage='Logout'
        />
      </span>
    ]
    return (
      <div>
        <Sidemenu links={links} />
        <NotificationPopup />
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
