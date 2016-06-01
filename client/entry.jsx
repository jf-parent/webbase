'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { push } from 'react-router-redux'
import log from 'loglevel'

require('./polyfills')

// ========================================================
// Developer Tools Setup
// ========================================================

global.debugLevel = 'error'

if (__DEBUG__) {
  global.debugLevel = 'debug'
  if (window.devToolsExtension) {
    window.devToolsExtension.open()
  }
}

import InitStoreHistory from 'helpers/InitStoreHistory'

const store = InitStoreHistory.store
const history = InitStoreHistory.history

import AppContainer from './containers/AppContainer'

// NOTE needed by bootstrap
require('jquery')

global.bootstrap = require('bootstrap/dist/css/bootstrap.css')

// ========================================================
// Logger
// ========================================================

let logger = log.getLogger('entry')

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
