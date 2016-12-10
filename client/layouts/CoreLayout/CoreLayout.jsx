import React from 'react'
import { connect } from 'react-redux'
import CookieBanner from 'react-cookie-banner'

import BrowserSupport from 'helpers/BrowserSupport'
import GrowlNotification from 'components/ux/GrowlNotification'
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

  getPrivacyBanner () {
    return (
      <CookieBanner
        message='Webbase is using cookie.'
        link={{msg: 'Here is the privacy policy', url: '/privacy-policy'}}
        cookie='user-has-accepted-cookies'
      />
    )
  }

  render () {
    let Nav
    if (this.props.state.session.user) {
      Nav = <AuthenticatedNav />
    } else if (!BrowserSupport()) {
      Nav = <div style={{marginTop: 20}}></div>
    } else {
      Nav = <UnAuthenticatedNav />
    }

    return (
      <div>
        {this.getPrivacyBanner()}
        <GrowlNotification notifications={this.props.state.session.notifications} />
        {Nav}
        <div style={{minHeight: '20em', margin: '2em'}} className='row'>
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
    )
  }
}
export default connect(mapStateToProps)(CoreLayout)
