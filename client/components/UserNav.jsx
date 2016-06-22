import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import NotificationPopup from './NotificationPopup'
import BaseComponent from 'core/BaseComponent'
import UserNavStyle from './UserNavStyle.postcss'
import { actions } from 'actions/NotificationActions'

class UserNav extends BaseComponent {

  constructor (props) {
    super(props)

    this._initLogger()
    this._bind('onOpenNotification')
  }

  onOpenNotification (event) {
    this.props.actions.doOpenNotificationPopup()
  }

  render () {
    let notificationNumber = null
    if (this.props.state.notification.newNotificationNumber > 0) {
      notificationNumber = <span className={'badge ' + UserNavStyle['badge-notify']}>{this.props.state.notification.newNotificationNumber}</span>
    }

    return (
      <div>
        <NotificationPopup />
        <ul className='nav navbar-nav navbar-right nav-pills'>
          <span className={'pull-left ' + UserNavStyle['bell']}>
            <button className='btn btn-default btn-lg btn-link' onClick={this.onOpenNotification} style={{'fontSize': '24px'}}>
              <span className='glyphicon glyphicon-bell'></span>
            </button>
            {notificationNumber}
          </span>
          <li role='presentation' className='dropdown'>
            <a className='dropdown-toggle small' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false'>
              {this.props.state.session.user.name}
              <i className='fa fa-caret-down' aria-hidden='true'></i>
              <div className={'pull-right ' + UserNavStyle['profile-img']}>
                <img className='img-responsive img-circle' src={this.props.state.session.user.gravatar_url} />
              </div>
            </a>
            <ul className='dropdown-menu'>
              <li>
                <Link to='/profile'>
                  <FormattedMessage
                    id='nav.Profile'
                    defaultMessage='Profile'
                  />
                </Link>
              </li>
              <li>
                <Link to='/settings'>
                  <FormattedMessage
                    id='nav.Settings'
                    defaultMessage='Settings'
                  />
                </Link>
              </li>
              <li>
                <Link to='/logout'>
                  <FormattedMessage
                    id='nav.Logout'
                    defaultMessage='Logout'
                  />
                </Link>
              </li>
            </ul>
          </li>
        </ul>
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
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserNav)
