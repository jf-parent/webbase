import React, { Component } from 'react'
import { Link } from 'react-router'
import activeComponent from 'react-router-active-component'
import { FormattedMessage } from 'react-intl'

import SocialMedia from './SocialMedia'

class AuthenticatedNav extends Component {

  render () {
    let NavItem = activeComponent('li')
    return (
      <div className={bootstrap.container}>
        <nav id='nav-bar' className={bootstrap.navbar + ' ' + bootstrap['navbar-default']} role='navigation'>
          <div className={bootstrap['container-fluid']}>
            <div className={bootstrap['navbar-header']}>
              <Link className={bootstrap['navbar-brand']} to='/'>
                <FormattedMessage
                  id='nav.home'
                  defaultMessage='Home'
                />
              </Link>
            </div>
            <div className={bootstrap['navbar-collapse'] + ' ' + bootstrap['collapse']}>
              <ul className={bootstrap['nav'] + ' ' + bootstrap['navbar-nav']}>
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
