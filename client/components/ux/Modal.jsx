import React, { PropTypes } from 'react'
import ReactModal from 'react-modal'
import './ModalStyle.css'

import BaseComponent from 'core/BaseComponent'
// import ModalStyle from './ModalStyle.postcss'

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

  static propTypes = {
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.any
  }

  constructor (props) {
    super(props)

    this._initLogger()
  }

  render () {
    return (
      <ReactModal
        className='modal-dialog'
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
      >
        <div className='modal-content'>
          <div className='modal-header'>
            <button type='button' className='close' onClick={this.props.onClose}>&times;</button>
            <h4 className='modal-title'>{this.props.title}</h4>
          </div>
          <div className='modal-body'>
            {this.props.children}
          </div>
        </div>
      </ReactModal>
    )
  }
}

export default Modal
