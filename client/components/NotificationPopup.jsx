import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { defineMessages } from 'react-intl'

import Pager from 'components/ux/Pager'
import Modal from 'components/ux/Modal'
import BaseComponent from 'core/BaseComponent'
import { actions } from 'actions/NotificationActions'
import NotificationPopupStyle from './NotificationPopupStyle.postcss'

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
      'getCurrentPage',
      'renderNotification',
      'navToTarget',
      'closePopup',
      'markAllNotificationAsSeen',
      'onFirstClick',
      'onPreviousClick',
      'onNextClick',
      'onLastClick'
      )
  }

  onFirstClick () {
    this.debug('onFirstClick')
    this.props.actions.getNotifications(
      this.props.state.session,
      0
    )
  }

  onLastClick () {
    this.debug('onLastClick')
    let limit = this.props.state.notification.limit
    let lastPage = this.props.state.notification.totalNotifications - limit
    this.props.actions.getNotifications(
      this.props.state.session,
      lastPage
    )
  }

  onNextClick () {
    this.debug('onNextClick')
    let limit = this.props.state.notification.limit
    let nextPage = (this.getCurrentPage() + 1) * limit
    this.props.actions.getNotifications(
      this.props.state.session,
      nextPage
    )
  }

  onPreviousClick () {
    this.debug('onPreviousClick')
    let limit = this.props.state.notification.limit
    let previousPage = this.props.state.notification.skip - limit
    this.props.actions.getNotifications(
      this.props.state.session,
      previousPage
    )
  }

  getCurrentPage () {
    return this.props.state.notification.skip / this.props.state.notification.limit
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
    const className = value.seen ? NotificationPopupStyle['seen'] : NotificationPopupStyle['unseen']

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

    let pager = null
    if (this.props.state.notification.totalNotifications > 10) {
      let totalPage = this.props.state.notification.totalNotifications / this.props.state.notification.limit
      let currentPage = this.getCurrentPage()
      pager = <Pager totalPage={totalPage} currentPage={currentPage} onFirstClick={this.onFirstClick} onLastClick={this.onLastClick} onNextClick={this.onNextClick} onPreviousClick={this.onPreviousClick} />
    }
    const markAllAsRead = formatMessage(notificationMessages.markAllAsRead)

    return (
      <Modal ref='modal' isOpen={isPopupOpen} onClose={this.closePopup} overlayStyle={overlayStyle} title='Notifications'>
        <p>
          <a className='btn btn-default btn-link' onClick={this.markAllNotificationAsSeen}>
            <span>
              {markAllAsRead}
            </span>
          </a>
        </p>
        <ul className='list-unstyled'>
          {this.props.state.notification.notifications.map((value, index) => {
            if (value.target_url !== '') {
              return (
                <Link data-seen={value.seen} data-uid={value.uid} key={index} className={NotificationPopupStyle['anchor']} onClick={this.navToTarget} to={value.target_url}>
                  {this.renderNotification(value, index)}
                </Link>
              )
            } else {
              return (
                <a data-seen={value.seen} data-uid={value.uid} key={index} className={NotificationPopupStyle['anchor']} onClick={this.navToTarget}>
                  {this.renderNotification(value, index)}
                </a>
              )
            }
          })}
        </ul>
        {pager}
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationPopup)
