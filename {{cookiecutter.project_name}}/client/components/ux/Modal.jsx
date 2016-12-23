import React, { PropTypes } from 'react'
import ReactModal from 'react-modal'

import BaseComponent from 'core/BaseComponent'

/* Examples
  render () {
    return (
      <Modal ref='modal' isOpen={false} onClose={this.onClosePopup} title='modal'>
        <content />
      </Modal>
      <button onClick={this.openModal}>OpenModal</button>
    )
  }
*/

class Modal extends BaseComponent {
  render () {
    return (
      <ReactModal
        className='wb-modal-dialog'
        isOpen={this.props.isOpen}
        contentLabel=''
        onRequestClose={this.props.onClose}
      >
        <div className='wb-modal-content'>
          <div className='wb-modal-header'>
            <button type='button' className='wb-modal-close' onClick={this.props.onClose}>&times;</button>
            <h4 className='wb-modal-title'>{this.props.title}</h4>
          </div>
          <div className='wb-modal-body'>
            {this.props.children}
          </div>
        </div>
      </ReactModal>
    )
  }
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.any
}

export default Modal
