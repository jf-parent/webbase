import React, { Component } from 'react'
import { Link } from 'react-router'
import activeComponent from 'react-router-active-component'
import { FormattedMessage } from 'react-intl'

import SocialMedia from 'components/SocialMedia'

class UnAuthenticatedNav extends Component {

  render () {
    let NavItem = activeComponent('li')
    return (
      <div className='container'>
        <nav id='nav-bar' className='navbar navbar-default' role='navigation'>
          <div className='container-fluid'>
            <div className='navbar-header'>
              <Link className='navbar-brand' to='/'>
                <FormattedMessage
                  id='nav.home'
                  defaultMessage='Home'
                />
              </Link>
            </div>
            <div className='navbar-collapse collapse'>
              <ul className='nav navbar-nav'>
                <NavItem to='/register'>
                  <FormattedMessage
                    id='nav.register'
                    defaultMessage='Register'
                  />
                </NavItem>
                <NavItem to='/login'>
                  <FormattedMessage
                    id='nav.login'
                    defaultMessage='Login'
                  />
                </NavItem>
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
