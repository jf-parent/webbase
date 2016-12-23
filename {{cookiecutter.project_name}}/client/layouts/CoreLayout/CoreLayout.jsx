import React from 'react'
import { connect } from 'react-redux'
import CookieBanner from 'react-cookie-banner'
import { notification } from 'antd'
import { injectIntl } from 'react-intl'

import BrowserSupport from 'helpers/BrowserSupport'
import BaseComponent from 'core/BaseComponent'
import AuthenticatedNav from 'components/AuthenticatedNav'
import UnAuthenticatedNav from 'components/UnAuthenticatedNav'
import Home from 'components/Home'
import LocalesMenu from 'locales/LocalesMenu'
import SocialMedia from 'components/SocialMedia'

function mapStateToProps (state) {
  return {
    state
  }
}

class CoreLayout extends BaseComponent {

  constructor (props, context) {
    super(props, context)

    this._initLogger()
    this._bind(
      'getPrivacyBanner'
    )
  }

  componentDidMount () {
    const { formatMessage } = this.props.intl

    this.props.state.session.notifications.map((notif, index) => {
      const message = formatMessage({id: notif.message})
      const description = formatMessage({id: notif.description})
      notification[notif.type]({
        message,
        duration: notif.duration,
        description
      })
    })
  }

  getPrivacyBanner () {
    // ref: https://github.com/buildo/react-cookie-banner
    return (
      <CookieBanner
        message='Webbase is using '
        link={{"{{"}}msg: 'cookie', url: '/privacy-policy'{{"}}"}}
        className='wb-privacy-banner'
        dismissOnScroll={false}
        cookie='user-has-accepted-cookies'
      />
    )
  }

  render () {
    let Nav
    if (this.props.state.session.user) {
      Nav = <AuthenticatedNav />
    } else if (!BrowserSupport()) {
      Nav = <div style={{"{{"}}marginTop: 20{{"}}"}}></div>
    } else {
      Nav = <UnAuthenticatedNav />
    }
    return (
      <div>
        {this.getPrivacyBanner()}
        <div id='wb-sidemenu'>
          {Nav}
        </div>
        <div id='wb-root-container'>
          <div style={{"{{"}}minHeight: '20em', margin: '2em'{{"}}"}} className='row'>
              {this.props.children || <Home />}
          </div>
          <footer>
            <div className='row'>
              <div className='medium-1 columns'>
                <h2>Webbase</h2>
              </div>
              <div className='medium-11 columns'>
                <SocialMedia />
              </div>
            </div>
            <LocalesMenu />
          </footer>
        </div>
      </div>
    )
  }
}
export default injectIntl(connect(mapStateToProps)(CoreLayout))
