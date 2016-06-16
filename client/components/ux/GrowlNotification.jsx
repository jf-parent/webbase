import React, { PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import { updateSessionNotifications } from 'actions/AuthActions'

import BaseComponent from 'core/BaseComponent'
import GrowlNotificationStyle from './GrowlNotificationStyle.postcss'

const actions = {
  updateSessionNotifications
}

/*
  Examples of notification:
  notifications = [{
      type: 'warning',
      msgId: 'errorMsg.warning'
    },{
      type: 'success',
      msgId: 'success.success',
      delay: 3000
  }]

  Default:
    type: 'info' // 'danger' | 'warning' |  'success'
    delay: 1000 // not sticky only
*/

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

class GrowlNotification extends BaseComponent {
  static propTypes: {
    notifications: PropTypes.array.isRequired,
    onDismiss: PropTypes.func
  }

  constructor (props) {
    super(props)

    this._initLogger()

    this._bind('closeNotification', 'onCloseNotification')
  }

  closeNotification (index) {
    this.debug('closeNotification')
    let notifications = this.props.state.session.notifications
    notifications.splice(index, 1)
    this.props.actions.updateSessionNotifications(notifications)
  }

  onCloseNotification (event) {
    this.debug('onCloseNotification')
    this.closeNotification(event.target.dataset.index)
  }

  render () {
    this.debug('render')
    if (this.props.state.session.notifications.length) {
      return (
        <div className={GrowlNotificationStyle['notification-container']}>
          <ReactCSSTransitionGroup transitionName='alert' transitionEnterTimeout={500} transitionLeaveTimeout={300}>
            {this.props.state.session.notifications.map((item, index) => {
              if (['success', 'info', 'warning', 'danger'].indexOf(item.type) < 0) {
                item.type = 'info'
              }

              if (!item.sticky) {
                let delay = 1000
                if (item.delay) {
                  delay = item.delay
                }
                setTimeout(() => {
                  this.closeNotification(index)
                }, delay)
              }

              let css = 'alert alert-dismissible alert-' + item.type

              return (
                <div className={css} key={index}>
                  <button type='button' className='close' title='Dismiss' data-index={index} onClick={this.onCloseNotification}>&times;</button>
                  <FormattedMessage
                    id={item.msgId}
                    defaultMessage={item.msgId}
                  />
                </div>
              )
            })}
          </ReactCSSTransitionGroup>
        </div>
      )
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GrowlNotification)
