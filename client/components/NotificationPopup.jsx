import React from 'react'

import Modal from 'components/ux/Modal'
import BaseComponent from 'core/BaseComponent'
// import NotificationPopupStyle from './NotificationPopupStyle'

class NotificationPopup extends BaseComponent {

  constructor (props) {
    super(props)

    this._initLogger()
    this._bind('show')
  }

  show () {
    this.refs.modal.setState({isOpen: true})
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
        {this.props.notifications.map((value, index) => {
          return (
            <div key={index}>
              <p>{value.message}</p>
            </div>
          )
        })}
        <p><a href='#'>See More...</a></p>
      </Modal>
    )
  }
}

export default NotificationPopup
