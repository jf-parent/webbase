import React, { PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { addLocaleData } from 'react-intl'
import enLocaleData from 'react-intl/locale-data/en'
import frLocaleData from 'react-intl/locale-data/fr'

import Loading from 'components/ux/Loading'
import ConnectedIntlProvider from 'locales/ConnectedIntlProvider'
import { actions as AuthActions } from 'reducers/session'
import BaseComponent from 'core/BaseComponent'

addLocaleData(enLocaleData)
addLocaleData(frLocaleData)

class AppContainer extends BaseComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    routerKey: PropTypes.number,
    store: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this._bind('onReady')
    this.state = {
      loading: true
    }
  }

  onReady () {
    this.setState({loading: false})
  }

  componentDidMount () {
    this.props.store.dispatch(AuthActions.getSession(false, this.onReady))
  }

  render () {
    const { history, routes, routerKey, store } = this.props

    if (this.state.loading) {
      return <Loading />
    } else {
      return (
        <Provider store={store}>
          <ConnectedIntlProvider>
            <div style={{"{{"}} height: '100%' {{"}}"}}>
              <Router history={history} children={routes} key={routerKey} />
            </div>
          </ConnectedIntlProvider>
        </Provider>
      )
    }
  }
}

export default AppContainer
