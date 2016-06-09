import React from 'react'
import { Link } from 'react-router'
import activeComponent from 'react-router-active-component'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'
import SocialMedia from './SocialMedia'

class AuthenticatedNav extends BaseComponent {

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
                <NavItem to='/profile'>
                  <FormattedMessage
                    id='nav.profile'
                    defaultMessage='Profile'
                  />
                </NavItem>
                <NavItem to='/settings'>
                  <FormattedMessage
                    id='nav.settings'
                    defaultMessage='Settings'
                  />
                </NavItem>
                <NavItem to='/logout'>
                  <FormattedMessage
                    id='nav.logout'
                    defaultMessage='Logout'
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

export default AuthenticatedNav
