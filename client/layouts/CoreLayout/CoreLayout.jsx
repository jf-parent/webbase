import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import BaseComponent from 'core/BaseComponent'
import Loading from 'components/ux/Loading'
import AuthenticatedNav from 'components/AuthenticatedNav'
import UnAuthenticatedNav from 'components/UnAuthenticatedNav'
import Home from 'components/Home'
import LocalesMenu from 'locales/LocalesMenu'

import * as AuthActions from '../../actions/AuthActions'

function mapStateToProps (state) {
  return {
    session: state.session
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(AuthActions, dispatch)
  }
}

class CoreLayout extends BaseComponent {

  constructor (props, context) {
    super(props, context)

    this._initLogger()
  }

  componentDidMount () {
    this.debug('componentDidMount')

    this.props.actions.getSession()
  }

  render () {
    this.debug('render')

    if (this.props.session.loading) {
      return <Loading />
    } else {
      let Nav
      if (this.props.session.user) {
        Nav = <AuthenticatedNav />
      } else {
        Nav = <UnAuthenticatedNav />
      }

      return (
        <div>
          <h1>
            <FormattedMessage
              id='test'
              defaultMessage='DEfault messag'
            />
          </h1>
          {Nav}
          <div className='container'>
            <div className='jumbotron' id='jumbotron'>
                {this.props.children || <Home />}
            </div>
          </div>
          <footer >
            <div className='container'>
              <div className='jumbotron'>
                <LocalesMenu />
              </div>
            </div>
          </footer>
        </div>
      )
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)
