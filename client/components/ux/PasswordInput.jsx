import React from "react";
import Formsy from "formsy-react";
import ErrorMsg from "components/ux/ErrorMsg";

const PasswordInput = React.createClass({

  mixins: [Formsy.Mixin],

  getInitialState() {
    return {
      _value: "",
      showErrMsg: false,
      quiet: this.props.quiet,
      showPassword: false
    };
  },

  changeValue(event) {
    this.setValue(event.currentTarget.value);
  },

  validate() {
    let value = this.getValue();
    if (value.length >= 1 & value.length < 6) {
      this.setState({errorMessage: "password too short!"});
      return false;
    }
    return true;
  },

  getCustomErrorMessage() {
    return this.showError() ? this.state.errorMessage : "";
  },

  onFocus() {
    this.setState({showErrMsg: false});
  },

  onBlur() {
    this.setState({showErrMsg: true});
  },

  toggleShowPassword() {
    this.setState({showPassword: !this.state.showPassword})
  },

  render() {

    let className = "form-group" + (this.props.className || " ") +
      (this.showRequired() ? " has-warning" : this.showError() ? " has-error" : " has-success");
    let errorMessage = this.getCustomErrorMessage();
    let errorMsg = null;

    if (!this.state.quiet) {
      if (this.state.showErrMsg) {
        errorMsg = errorMessage ? <ErrorMsg msg={errorMessage} /> : null;
      }
    }
    let type = this.state.showPassword ? "text" : "password";

    return (

      <div className={className}>
        <input
          className="form-control"
          {...this.props}
          type={type}
          onChange={this.changeValue}
          value={this.getValue()}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
        <span
          onMouseOver={this.toggleShowPassword}
          onMouseOut={this.toggleShowPassword}
          onTouchStart={this.toggleShowPassword}
          onTouchEnd={this.toggleShowPassword}
          id="show-password"
          className="glyphicon glyphicon-eye-open"
        />
        <center>{errorMsg}</center>
      </div>
    );
  }
});

export default PasswordInput;
