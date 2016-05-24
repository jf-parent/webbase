import React from "react";
import Formsy from "formsy-react";
import ErrorMsg from "components/ux/ErrorMsg";

const PasswordInput = React.createClass({

  mixins: [Formsy.Mixin],

  getInitialState() {
    return {
      type: "password",
      _value: ""
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

  render() {

    const className = "form-group" + (this.props.className || " ") +
      (this.showRequired() ? " has-warning" : this.showError() ? " has-error" : " has-success");

    const errorMessage = this.getCustomErrorMessage();
    let errorMsg = errorMessage ? <ErrorMsg msg={errorMessage} /> : null;

    return (
      <div className={className}>
        <input
          className="form-control"
          {...this.props}
          type={this.state.type}
          onChange={this.changeValue}
          value={this.getValue()}
        />
        <center>{errorMsg}</center>
      </div>
    );
  }
});

export default PasswordInput;

