import React, { PropTypes } from 'react'
import Formsy from 'formsy-react'

import ErrorMsg from './ErrorMsg'
import PasswordInputStyle from './PasswordInputStyle.postcss'

const PasswordInput = React.createClass({

  mixins: [Formsy.Mixin],

  propTypes: {
    quiet: PropTypes.bool,
    name: PropTypes.string,
    className: PropTypes.string
  },

  getInitialState () {
    return {
      _value: '',
      showErrMsg: false,
      quiet: this.props.quiet,
      showPassword: false
    }
  },

  changeValue (event) {
    this.setValue(event.currentTarget.value)
  },

  validate () {
    let value = this.getValue()
    if (value.length >= 1 & value.length < 6) {
      this.setState({errorMessage: 'PasswordTooShort'})
      return false
    }
    return true
  },

  getCustomErrorMessage () {
    return this.showError() ? this.state.errorMessage : ''
  },

  onFocus () {
    this.setState({showErrMsg: false})
  },

  onBlur () {
    this.setState({showErrMsg: true})
  },

  onValueChange (event) {
    this.setValue(event.target.value)
  },

  toggleShowPassword () {
    this.setState({showPassword: !this.state.showPassword})
  },

  render () {
    const errorMessage = this.getCustomErrorMessage()

    let className = ['form-group']

    // User defined class
    if (this.props.className) {
      className.push(this.props.className)
    }

    // Input state class
    if (this.showRequired()) {
      className.push('has-warning')
    } else if (this.showError()) {
      className.push('has-error')
    } else {
      className.push('has-success')
    }

    let errorMsg = null

    if (!this.state.quiet) {
      if (this.state.showErrMsg) {
        errorMsg = errorMessage ? <ErrorMsg msgId={errorMessage} name={'errorMsg-' + this.props.name} /> : null
      }
    }
    let type = this.state.showPassword ? 'text' : 'password'

    return (
      <div className={className.join(' ')} name={'form-control-' + this.props.name}>
        <input
          className='form-control'
          {...this.props}
          type={type}
          onChange={this.onValueChange}
          value={this.getValue()}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
        <div
          onMouseOver={this.toggleShowPassword}
          onMouseOut={this.toggleShowPassword}
          onTouchStart={this.toggleShowPassword}
          onTouchEnd={this.toggleShowPassword}
          className={PasswordInputStyle['show-password']}
        >
          <span className='glyphicon glyphicon-eye-open' />
        </div>
        <center>{errorMsg}</center>
      </div>
    )
  }
})

export default PasswordInput
