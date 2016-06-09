import React, { PropTypes } from 'react'
import ReactModal from 'react-modal'

import BaseComponent from 'core/BaseComponent'
import ModalStyle from './ModalStyle.postcss'

class Modal extends BaseComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    children: PropTypes.any
  }

  constructor (props) {
    super(props)

    this._initLogger()
    this._bind('onAfterOpen', 'onRequestClose', 'onClose')

    this.state = {
      isOpen: false
    }
  }

  onRequestClose () {
    this.debug('onRequestClose')
  }

  onAfterOpen () {
    this.debug('onAfterOpen')
  }

  onClose () {
    this.debug('onClose')

    this.setState({isOpen: false})
  }

  render () {
    return (
      <ReactModal
        isOpen={this.state.isOpen}
        onAfterOpen={this.props.onAfterOpen}
        onRequestClose={this.props.onRequestClose}
        overlayClassName={ModalStyle.overlay}
        className={ModalStyle.content} >

        <h2 ref='title'>{this.props.title}</h2>
        <a className={ModalStyle.close} href='#close' onClick={this.onClose}></a>
        <div>{this.props.children}</div>
      </ReactModal>
    )
  }
}

Modal.defaultProps = {
  onAfterOpen: Modal.onAfterOpen,
  onRequestClose: Modal.onRequestClose
}

/* Examples
  openModal () {
    this.refs.modal.setState({'isOpen': true})
  }

  render () {
    return (
      <Modal ref='modal' title='modal'>
        <content />
        <content />
      </Modal>
      <button onClick={this.openModal}>OpenModal</button>
    )
  }
*/

export default Modal
