import React, { PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { addLocaleData } from 'react-intl'
import enLocaleData from 'react-intl/locale-data/en'
import frLocaleData from 'react-intl/locale-data/fr'

import ConnectedIntlProvider from 'locales/ConnectedIntlProvider'
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

  render () {
    const { history, routes, routerKey, store } = this.props

    return (
      <Provider store={store}>
        <ConnectedIntlProvider>
          <div style={{ height: '100%' }}>
            <Router history={history} children={routes} key={routerKey} />
          </div>
        </ConnectedIntlProvider>
      </Provider>
    )
  }
}

export default AppContainer
