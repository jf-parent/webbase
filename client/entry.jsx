'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore, push } from 'react-router-redux'

import createBrowserHistory from 'history/lib/createBrowserHistory'
import createStore from 'store/createStore'
import AppContainer from 'containers/AppContainer'
import log from 'loglevel'

require('ladda/dist/ladda-themeless.min.css')
require('bootstrap-webpack!./bootstrap.config.js')
require('font-awesome-webpack')
require('jquery')

// ========================================================
// Logger
// ========================================================

let logger = log.getLogger('entry')

const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: ''
})

// ========================================================
// Store and History Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__
const store = createStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
})

// ========================================================
// Developer Tools Setup
// ========================================================
if (__DEBUG__) {
  logger.setLevel('debug')
  if (window.devToolsExtension) {
    window.devToolsExtension.open()
  }
}

// ========================================================
// AUTH SUBSCRIBERS
// ========================================================

let previousUser = null
function loginLogoutHandler () {
  const state = store.getState()
  let currentUser = state.session.user
  logger.debug('[Entry] currentUser (', currentUser, ') previousUser(', previousUser, ')')
  if (previousUser !== currentUser) {
    let routerState = state.router.locationBeforeTransitions.state
    let nextPath = '/profile'
    if (routerState) {
      nextPath = routerState.nextPathname ? routerState.nextPathname : '/profile'
    }
    previousUser = currentUser
    // Login
    if (currentUser) {
      logger.debug(`[Entry] Redirect to /${nextPath}`)
      store.dispatch(push(nextPath))
    // Logout
    } else {
      logger.debug('[Entry] Redirect to /')
      store.dispatch(push('/'))
    }
  }
}

store.subscribe(loginLogoutHandler)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = (routerKey = null) => {
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <AppContainer
      store={store}
      history={history}
      routes={routes}
      routerKey={routerKey}
    />,
    MOUNT_NODE
  )
}

if (__DEV__ && module.hot) {
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react')

    ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
  }
  render = () => {
    try {
      renderApp(Math.random())
    } catch (error) {
      renderError(error)
    }
  }
  module.hot.accept(['./routes/index'], () => render())
}

render()
