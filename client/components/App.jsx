import React, { Component } from "react"
import Loading from "./ux/Loading"
import AuthenticatedNav from "./AuthenticatedNav"
import UnAuthenticatedNav from "./UnAuthenticatedNav"
import Home from "./Home"
import Observer from "Observer"

class App extends Component {
  constructor(props, context) {
    super(props, context);

    window.iapp.Auth.isAuthenticated();
    this.state = {
      isLoading: true,
      isAuthenticated: false
    };

    this.updateAuth = this.updateAuth.bind(this);
  }

  componentDidMount() {
    Observer.on("updateAuth", this.updateAuth);
  }

  componentDidUnMount() {
    Observer.un("updateAuth", this.updateAuth);
  }

  updateAuth() {
    this.setState({
      isLoading: false,
      isAuthenticated: window.iapp.Auth.getUser()
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
