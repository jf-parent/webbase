import React from 'react'
import { FormattedMessage } from 'react-intl'

import Sidemenu from 'components/Sidemenu'
import BaseComponent from 'core/BaseComponent'

class UnAuthenticatedNav extends BaseComponent {

  render () {
    const links = [
      <span to='/'>
        <i className='fa fa-home' aria-hidden='true'></i>
        {' '}
        <FormattedMessage
          id='nav.Home'
          defaultMessage='Home'
        />
      </span>,
{%- if cookiecutter.include_registration == 'y' %}
      <span to='/register'>
        <i className='fa fa-id-card-o' aria-hidden='true'></i>
        {' '}
        <FormattedMessage
          id='nav.Register'
          defaultMessage='Register'
        />
      </span>,
{%- endif %}
      <span to='/login'>
        <i className='fa fa-sign-in' aria-hidden='true'></i>
        {' '}
        <FormattedMessage
          id='nav.Login'
          defaultMessage='Login'
        />
      </span>
    ]
    return (
      <Sidemenu links={links} />
    )
  }
}

export default UnAuthenticatedNav
