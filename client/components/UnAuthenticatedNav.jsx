import React, { Component } from 'react'
import { Link } from 'react-router'
import activeComponent from 'react-router-active-component'
import { FormattedMessage } from 'react-intl'
import bootstrap from 'bootstrap/dist/css/bootstrap.css'

import SocialMedia from './SocialMedia'

class UnAuthenticatedNav extends Component {

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
            <div className={bootstrap['navbar-collapse'] + ' ' + bootstrap.collapse}>
              <ul className={bootstrap.nav + ' ' + bootstrap['navbar-nav']}>
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
