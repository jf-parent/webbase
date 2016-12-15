import React, { PropTypes, Component } from 'react'
import Ladda from 'react-ladda'
import 'ladda/dist/ladda-themeless.min.css'

class LaddaButton extends Component {
  render () {
    let btnClass = this.props.btnClass
    if (this.props.isDisabled) {
      btnClass = btnClass + ' error'
    } else {
      btnClass = btnClass + ' success'
    }

    return (
      <center>
        <Ladda
          disabled={this.props.isDisabled}
          className={btnClass}
          onClick={this.props.onSubmit}
          loading={this.props.isLoading}
          buttonStyle='zoom-out'
        >
          <b>{this.props.children}</b>
        </Ladda>
      </center>
    )
  }
}

LaddaButton.propTypes = {
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  btnClass: PropTypes.string,
  children: PropTypes.any
}

LaddaButton.defaultProps = {
  btnClass: 'large button',
  isDisabled: false
}

module.exports = LaddaButton
