import React, { Component } from "react"
import Loading from "./ux/Loading"
import AuthenticatedNav from "./AuthenticatedNav"
import UnAuthenticatedNav from "./UnAuthenticatedNav"
import axios from "axios"
import Home from "./Home"

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoading: true
    };

    this.state.isAuthenticated = false;
    this.get_session();
  }

  get_session() {

    axios.get("/api/get_session")
      .then((response) => {
        this.setState({
          "isAuthenticated": response.data.success,
          "isLoading": false
        });
        console.log("get_session", response);
      })
      .catch((response) => {
          this.setState({
            "isLoading": false
          });
        console.log("get_session error", response);
      });
    }

  render() {
    if (this.state.isLoading) {
      return <Loading />
    } else {
      let Nav;
      if (this.state.isAuthenticated) {
        Nav = <AuthenticatedNav />;
      } else {
        Nav = <UnAuthenticatedNav />;
      }

      return (
          <div>
              {Nav}
              <div className="container">
                  <div className="jumbotron" id="jumbotron">
                      {this.props.children || <Home />}
                  </div>
              </div>
              <footer className="footer">
                  <div className="containter">
                      <p className="text-muted">WebBase 2016</p>
                  </div>
              </footer>
        </div>
      )
    }
  }
}

module.exports = App
