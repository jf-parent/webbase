// ========================================================
// Store and History Instantiation
// ========================================================
import { useRouterHistory } from 'react-router'

import createBrowserHistory from 'history/lib/createBrowserHistory'
import createHashHistory from 'history/lib/createHashHistory'
import { syncHistoryWithStore } from 'react-router-redux'

import createStore from 'store/createStore'

var browserHistory

if (__CORDOVA__) {
  browserHistory = useRouterHistory(createHashHistory)({
    basename: ''
  })
} else {
  browserHistory = useRouterHistory(createBrowserHistory)({
    basename: ''
  })
}
const initialState = window.___INITIAL_STATE__
const store = createStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
})

export default {
  store,
  history
}
