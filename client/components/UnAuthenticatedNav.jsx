import React, { Component } from 'react'
import { Link } from 'react-router'
import activeComponent from 'react-router-active-component'
import SocialMedia from 'components/SocialMedia'

class UnAuthenticatedNav extends Component {

  render () {
    let NavItem = activeComponent('li')
    return (
      <div className='container'>
        <nav id='nav-bar' className='navbar navbar-default' role='navigation'>
          <div className='container-fluid'>
            <div className='navbar-header'>
              <Link className='navbar-brand' to='/'>Home</Link>
            </div>
            <div className='navbar-collapse collapse'>
              <ul className='nav navbar-nav'>
                <NavItem to='/register'>Register</NavItem>
                <NavItem to='/login'>Login</NavItem>
              </ul>
              <SocialMedia />
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default UnAuthenticatedNav
