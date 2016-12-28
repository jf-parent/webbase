import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { defineMessages, injectIntl } from 'react-intl'
import { Pagination } from 'antd'

import Modal from 'components/ux/Modal'
import BaseComponent from 'core/BaseComponent'
import { actions } from 'reducers/notification'

const notificationMessages = defineMessages({
  markAllAsRead: {
    id: 'notification.MarkAllAsRead',
    defaultMessage: 'Mark all as read'
  }
})

class NotificationPopup extends BaseComponent {

  constructor (props) {
    super(props)

    this._initLogger()
    this._bind(
      'renderNotification',
      'navToTarget',
      'closePopup',
      'fetchNotificaton',
      'markAllNotificationAsSeen'
      )
  }

  fetchNotificaton (skip) {
    this.props.actions.getNotifications(this.props.state.session, (skip - 1))
  }

  markAllNotificationAsSeen (event) {
    this.props.actions.doMarkAllNotificationHasSeen(this.props.state.session)
    this.props.actions.doCloseNotificationPopup()
  }

  navToTarget (event) {
    let el = event.target.closest('a')
    let uid = el.dataset.uid
    let seen = el.dataset.seen
    this.props.actions.doCloseNotificationPopup()
    if (seen === 'false') {
      this.props.actions.doMarkNotificationHasSeen(this.props.state.session, uid)
    }
  }

  closePopup () {
    this.props.actions.doCloseNotificationPopup()
  }

  renderNotification (value, index) {
    const { formatMessage } = this._reactInternalInstance._context.intl
    const messageConfig = {
      id: value.message,
      defaultMessage: value.message
    }
    const message = formatMessage(messageConfig, value.template_data)
    const className = value.seen ? 'wb-notification-seen' : 'wb-notification-unseen'

    return (
      <div className={className}>
        <li>
          <span>
            {message}
          </span>
        </li>
      </div>
    )
  }

  render () {
    const { formatMessage } = this._reactInternalInstance._context.intl

    let overlayStyle = {
      height: '80%',
      width: '80%',
      top: '20px',
      left: '20px',
      marginTop: '10px',
      marginLeft: '10px'
    }
    let isPopupOpen = this.props.state.notification.notificationPopupOpened
    const markAllAsRead = formatMessage(notificationMessages.markAllAsRead)

    return (
      <Modal ref='modal' isOpen={isPopupOpen} onClose={this.closePopup} overlayStyle={overlayStyle} title='Notifications'>
        <p>
          <a className='button' onClick={this.markAllNotificationAsSeen}>
            <span>
              {markAllAsRead}
            </span>
          </a>
        </p>
        <ul style={{"{{"}}listStyle: 'none'{{"}}"}}>
          {this.props.state.notification.notifications.map((value, index) => {
            if (value.target_url !== '') {
              return (
                <Link
                  data-seen={value.seen}
                  data-uid={value.uid}
                  key={index}
                  className='wb-notification-anchor'
                  onClick={this.navToTarget}
                  to={value.target_url}
                >
                  {this.renderNotification(value, index)}
                </Link>
              )
            } else {
              return (
                <a
                  data-seen={value.seen}
                  data-uid={value.uid}
                  key={index}
                  className='wb-notification-anchor'
                  onClick={this.navToTarget}
                >
                  {this.renderNotification(value, index)}
                </a>
              )
            }
          })}
        </ul>
        <Pagination
          total={this.props.state.notification.totalNotifications}
          size='small'
          current={this.props.state.notification.skip + 1}
          onChange={this.fetchNotificaton}
          pageSize={this.props.state.notification.limit}
        />
      </Modal>
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(NotificationPopup))
