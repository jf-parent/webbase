import React, { PropTypes, Component } from 'react'
import Ladda from 'react-ladda'

class LaddaButton extends Component {
  static propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      isDisabled: props.isDisabled,
      isLoading: props.isLoading
    }
  }

  render () {
    let buttonBaseCls = 'btn btn-lg btn-primary btn-block'
    let buttonCls = this.state.isDisabled ? buttonBaseCls + ' btn-danger' : buttonBaseCls + ' btn-success'

    return (
      <center>
        <Ladda
          disabled={this.state.isDisabled}
          className={buttonCls}
          onClick={this.props.onSubmit}
          loading={this.state.isLoading}
          buttonStyle='zoom-out'
          {...this.props}
        >
          {this.props.children}
        </Ladda>
      </center>
    )
  }
}

module.exports = LaddaButton
