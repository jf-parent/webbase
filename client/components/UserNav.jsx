import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'
import UserNavStyle from './UserNavStyle.postcss'

class UserNav extends BaseComponent {

  render () {
    return (
      <ul className='nav navbar-nav navbar-right nav-pills'>
        <li role='presentation' className='dropdown'>
          <a className='dropdown-toggle small' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false'>
            {this.props.state.session.user.name}
            <div className={'pull-right ' + UserNavStyle['profile-img']}>
              <img className='img-responsive img-circle' src={this.props.state.session.user.gravatar_url} />
            </div>
          </a>
          <ul className='dropdown-menu'>
            <li>
              <Link to='/profile'>
                <FormattedMessage
                  id='nav.Profile'
                  defaultMessage='Profile'
                />
              </Link>
            </li>
            <li>
              <Link to='/settings'>
                <FormattedMessage
                  id='nav.Settings'
                  defaultMessage='Settings'
                />
              </Link>
            </li>
            <li>
              <Link to='/logout'>
                <FormattedMessage
                  id='nav.Logout'
                  defaultMessage='Logout'
                />
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    )
  }
}

function mapStateToProps (state) {
  return {
    state
  }
}

export default connect(mapStateToProps)(UserNav)
