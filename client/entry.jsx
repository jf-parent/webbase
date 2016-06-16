'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { push } from 'react-router-redux'
import log from 'loglevel'

require('./polyfills')

import { notAuthRoutes, createRoutes } from 'routes/index'

// ========================================================
// Developer Tools Setup
// ========================================================

if (__DEBUG__) {
  if (window.devToolsExtension) {
    window.devToolsExtension.open()
  }
}

import InitStoreHistory from 'helpers/InitStoreHistory'

const store = InitStoreHistory.store
const history = InitStoreHistory.history

import AppContainer from './containers/AppContainer'

// ========================================================
// IMAGES
// ========================================================

require.context('./images', true, /^\.\//)

// ========================================================
// BOOTSTRAP
// ========================================================

import 'expose?$!expose?jQuery!jquery'
import 'bootstrap-webpack'

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
    // Enforce NotAuthRoute
    let nextPath = state.router.locationBeforeTransitions
    let nextPathname
    if (currentUser) {
      if (notAuthRoutes.indexOf(nextPath.pathname) !== -1) {
        if (nextPath.state) {
          nextPathname = nextPath.state.nextPath
          logger.debug(`[Entry] Redirect to state /${nextPathname}`)
          store.dispatch(push(nextPathname))
        } else {
          nextPathname = '/dashboard'
          logger.debug(`[Entry] Redirect to /${nextPathname}`)
          store.dispatch(push(nextPathname))
        }
      }
    }
  }
}

store.subscribe(loginLogoutHandler)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = (routerKey = null) => {
  const routes = createRoutes(store)

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
