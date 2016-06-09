import React, { Component } from 'react'
import { Link } from 'react-router'
import activeComponent from 'react-router-active-component'
import { FormattedMessage } from 'react-intl'

import SocialMedia from './SocialMedia'

class UnAuthenticatedNav extends Component {

  render () {
    let NavItem = activeComponent('li')
    return (
      <div className='container'>
        <nav id='nav-bar' className='navbar navbar-default' role='navigation'>
          <div className='container-fluid'>
            <div className='navbar-header'>
              <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='#navbar-collapse' aria-expanded='false'>
                <span className='sr-only'>Toggle navigation</span>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
              </button>
              <Link className='navbar-brand' to='/'>
                <FormattedMessage
                  id='nav.home'
                  defaultMessage='Home'
                />
              </Link>
            </div>
            <div id='navbar-collapse' className='navbar-collapse collapse'>
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
