import React, { Component } from "react"
import {Link } from "react-router"
import { Form } from "formsy-react";
import ErrorMsg from "components/ux/ErrorMsg";
import ValidatedInput from "components/ux/Input";
import PasswordInput from "components/ux/PasswordInput"
import LaddaButton from "components/ux/LaddaButton"
import axios from "axios"

class Login extends Component {
  constructor(props) {
    super(props);

    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        errorMsg: false
    };
  }

  onSubmit() {
    this.refs.button.setState({isLoading: true});

    let data = this.refs.form.getModel();

    axios.post("/api/login", data)
      .then((response) => {
        console.log("login", response);

        let errorMsg;
        this.refs.button.setState({isLoading: false});

        if (!response.data.success) {
          errorMsg = "Wrong email or password!";
          this.setState({errorMsg: errorMsg});

        } else {
          errorMsg = false;
          this.setState({errorMsg: errorMsg});

          window.iapp.Auth.onLogin(response.data.user);
        }
      })
      .catch((response) => {
        this.setState({
          errorMsg: "Not such user or wrong password"
        });
        this.refs.button.setState({isLoading: false});
        console.log("login error", response);
      });
  }

  enableButton() {
    this.refs.button.setState({ isDisabled: false });
  }

  disableButton() {
    this.refs.button.setState({ isDisabled: true });
  }

  render() {
    let errorMsg = this.state.errorMsg ? <ErrorMsg msg={this.state.errorMsg} /> : null;

    return (
      <center>
        <Form ref="form" onValid={this.enableButton} onInvalid={this.disableButton} className="form-signin">
          <h2 className="form-signin-heading">Please log in</h2>
          <ValidatedInput type="email" name="email" placeholder="Email address" validations="isEmail" required autoFocus/>
          <PasswordInput type="password" name="password" placeholder="Password" type="password" quiet={true} required/>
          <LaddaButton ref="button" isDisabled={true} isLoading={this.state.isLoading} onSubmit={this.onSubmit}>Login</LaddaButton>
          <center>{errorMsg}</center>
        </Form>
        <p>
          <Link to="/register">Don't have an account yet? Register here</Link>
        </p>
        <p>
          <Link to="/forgotten-password">Forgot password?</Link>
        </p>
      </center>
    );
  }
}

module.exports = Login
