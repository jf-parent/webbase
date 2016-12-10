import React from 'react'

import Navbar from 'components/Navbar'
import BaseComponent from 'core/BaseComponent'

class UnAuthenticatedNav extends BaseComponent {

  render () {
    const routes = [
      {
        name: 'Home',
        text: 'Home',
        href: '/'
      }, {
        name: 'Register',
        text: 'Register',
        href: '/register'
      }, {
        name: 'Login',
        text: 'Login',
        href: '/login'
      }
    ]
    return (
      <Navbar routes={routes} />
    )
  }
}

export default UnAuthenticatedNav
