import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'

class Navbar extends BaseComponent {
  constructor (props) {
    super(props)
    this._bind('onClick')
  }

  onClick (event) {
    this.refs['menu-checkbox'].checked = false
  }

  render () {
    return (
      <div className='top-bar'>
        <label htmlFor='show-menu' className='wb-show-menu'>Menu &#9660;</label>
        <input ref='menu-checkbox' className='wb-navbar-input' type='checkbox' id='show-menu' role='button' />
        <ul className='wb-navbar-ul' id='menu'>
          {(() => {
            return this.props.routes.map((route, index) => {
              let alignment = route.alignment ? route.alignment : 'left'
              return (
                <li key={index} className={'wb-navbar-li-' + alignment}>
                  {(() => {
                    if (route.component !== undefined) {
                      return (<span className='wb-navbar-a'>{route.component}</span>)
                    } else {
                      const onClick = route.onClick ? route.onClick : this.onClick
                      return (
                        <Link onClick={onClick} className='wb-navbar-a' name='login-link' to={route.href}>
                          <FormattedMessage
                            id={'nav.' + route.name}
                            defaultMessage={route.text}
                          />
                        </Link>
                      )
                    }
                  })()}
                </li>
              )
            })
          })()}
        </ul>
      </div>
    )
  }
}

Navbar.propTypes = {
  routes: PropTypes.array.isRequired
}

export default Navbar
