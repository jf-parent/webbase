import React, { Component } from "react"
import Loading from "components/ux/Loading"
import ErrorMsg from "components/ux/ErrorMsg"
import axios from "axios"

class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: false
    }
  }

  logout() {
    axios.get("/api/logout")
      .then((response) => {
        let errorMsg;

        if (!response.data.success) {
          errorMsg = "An error has occured: " + response.data.error;
        } else {
          errorMsg = false;
        }

        this.setState({errorMsg: errorMsg});
        console.log("logout", response);
      })
      .catch((response) => {
        this.setState({
          errorMsg: "An error has occured: " + response.data.error
        });
        console.log("logout error", response);
      });
  }

  render() {
    if (this.state.errorMsg) {
      return (
        <ErrorMsg msg={this.state.errorMsg} />
      );
    } else {
      return (
        <Loading />
      );
    }
  }
}

module.exports = Logout
