import React from 'react'
import { Link } from 'react-router'
import activeComponent from 'react-router-active-component'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'
import CoreLayoutStyle from 'layouts/CoreLayout/CoreLayoutStyle.postcss'
import UserNav from 'components/UserNav'

class AuthenticatedNav extends BaseComponent {

  render () {
    let NavItem = activeComponent('li')
    return (
      <div className='container'>
        <nav className={'navbar navbar-default ' + CoreLayoutStyle['nav-bar']} role='navigation'>
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
                  id='nav.Home'
                  defaultMessage='Home'
                />
              </Link>
            </div>
            <div id='navbar-collapse' className='navbar-collapse collapse'>
              <ul className='nav navbar-nav'>
                <NavItem to='/dashboard'>
                  <FormattedMessage
                    id='nav.Dashboard'
                    defaultMessage='Dashboard'
                  />
                </NavItem>
                <NavItem to='/settings'>
                  <FormattedMessage
                    id='nav.Settings'
                    defaultMessage='Settings'
                  />
                </NavItem>
              </ul>
              <UserNav />
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default AuthenticatedNav
