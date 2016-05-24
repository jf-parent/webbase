import React, { Component } from "react"
import { Link } from "react-router"
import { Form } from "formsy-react"
import ErrorMsg from "components/ux/ErrorMsg"
import ValidatedInput from "components/ux/Input"
import LaddaButton from "components/ux/LaddaButton"
import PasswordInput from "components/ux/PasswordInput"
import axios from "axios"

class Register extends Component {
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

    axios.post("/api/register", data)
      .then((response) => {
        console.log("register", response);

        let errorMsg;
        this.refs.button.setState({isLoading: false});

        if (!response.data.success) {
          errorMsg = "An error has occured: " + response.data.error;
          this.setState({errorMsg: errorMsg});
        } else {
          errorMsg = false;
          this.setState({errorMsg: errorMsg});
          window.iapp.Auth.onLogin(response.data.user);
        }

      })
      .catch((response) => {
        this.setState({
          errorMsg: "An error has occured: " + response.data.error
        });
        this.refs.button.setState({isLoading: false});
        console.log("register error", response);
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
          <h2 className="form-signin-heading">Registration</h2>
          <ValidatedInput type="email" name="email" placeholder="Email address" validations="isEmail" required autoFocus/>
          <ValidatedInput type="text" name="name" placeholder="Name" required validations="minLength:2" maxLength="60" />
          <PasswordInput type="password" name="password" placeholder="Password" type="password" required/>
          <LaddaButton ref="button" isDisabled={true} isLoading={this.state.isLoading} onSubmit={this.onSubmit}>Register</LaddaButton>
          <center>{errorMsg}</center>
        </Form>
        <p>
          <Link to="/login">Already have an account? Log in here</Link>
        </p>
      </center>
    );
  }
}

module.exports = Register
