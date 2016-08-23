import React, { PropTypes, Component } from 'react'
import Ladda from 'react-ladda'
import 'ladda/dist/ladda-themeless.min.css'

class LaddaButton extends Component {
  static propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    btnClass: PropTypes.string,
    children: PropTypes.any
  }

  constructor (props) {
    super(props)

    this.state = {
      isDisabled: props.isDisabled,
      isLoading: props.isLoading
    }
  }

  render () {
    let btnClass = this.props.btnClass
    if (this.state.isDisabled) {
      btnClass = btnClass + ' btn-danger'
    } else {
      btnClass = btnClass + ' btn-success'
    }

    return (
      <center>
        <Ladda
          disabled={this.state.isDisabled}
          className={btnClass}
          onClick={this.props.onSubmit}
          loading={this.props.isLoading}
          buttonStyle='zoom-out'
          {...this.props}
        >
          {this.props.children}
        </Ladda>
      </center>
    )
  }
}

LaddaButton.defaultProps = {
  btnClass: 'btn btn-lg btn-primary btn-block'
}

module.exports = LaddaButton
