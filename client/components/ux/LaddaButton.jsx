import React, { PropTypes, Component } from 'react'
import Ladda from 'react-ladda'
// import laddaStyle from 'ladda/dist/ladda-themeless.min.css'

class LaddaButton extends Component {
  static propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
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
    let buttonClass = [bootstrap['btn'], bootstrap['btn-lg'], bootstrap['btn-primary'], bootstrap['btn-block']]
    if (this.state.isDisabled) {
      buttonClass.push(bootstrap['btn-danger'])
    } else {
      buttonClass.push(bootstrap['btn-success'])
    }

    return (
      <center>
        <Ladda
          disabled={this.state.isDisabled}
          className={buttonClass.join(' ')}
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
