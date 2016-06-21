import React from 'react'
import { Link } from 'react-router'

import Modal from 'components/ux/Modal'
import BaseComponent from 'core/BaseComponent'
import { FormattedMessage } from 'react-intl'
// import NotificationPopupStyle from './NotificationPopupStyle'

class NotificationPopup extends BaseComponent {

  constructor (props) {
    super(props)

    this._initLogger()
    this._bind('show', 'renderNotification', 'navToTarget')
  }

  show () {
    this.refs.modal.setState({isOpen: true})
  }

  navToTarget (event) {
    this.refs.modal.setState({isOpen: false})
    // TODO mark has seen
  }

  renderNotification (value, index) {
    return (
      <div key={index}>
        <li>
          <FormattedMessage
            id={value.message}
            defaultMessage={value.message}
            values={value.template_data}
          />
        </li>
      </div>
    )
  }

  render () {
    let overlayStyle = {
      height: '80%',
      width: '80%',
      top: '20px',
      left: '20px',
      marginTop: '10px',
      marginLeft: '10px'
    }
    return (
      <Modal ref='modal' overlayStyle={overlayStyle} title='Notification'>
        <p><a href='#'>Mark all as read</a></p>
        <ul>
        {this.props.notifications.map((value, index) => {
          if (value.target_url !== '') {
            return (
              <Link onClick={this.navToTarget} to={value.target_url}>
                {this.renderNotification(value, index)}
              </Link>
            )
          } else {
            return this.renderNotification(value, index)
          }
        })}
        </ul>
        <p><a href='#'>See More...</a></p>
      </Modal>
    )
  }
}

export default NotificationPopup
