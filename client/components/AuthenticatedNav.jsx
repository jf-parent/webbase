import React, { Component } from "react"
import { Link } from "react-router"
import SocialMedia from "components/SocialMedia"
import activeComponent from "react-router-active-component"

class AuthenticatedNav extends Component {

  constructor(props, context) {
    super(props, context)
  }

  render() {
    let NavItem = activeComponent("li")
    return (
        <div className="container">
            <nav id="nav-bar" className="navbar navbar-default" role="navigation">
              <div className="container-fluid">
                <div className="navbar-header">
                      <Link className="navbar-brand" to="/">Home</Link>
                </div>
                <div className="navbar-collapse collapse">
                    <ul className="nav navbar-nav">
                      <NavItem to="/profile">Profile</NavItem>
                      <NavItem to="/logout">Logout</NavItem>
                    </ul>
                    <SocialMedia />
                </div>
              </div>
            </nav>
        </div>
    )
  }
}

export default AuthenticatedNav
