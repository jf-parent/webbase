// ========================================================
// Store and History Instantiation
// ========================================================
import { useRouterHistory } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { syncHistoryWithStore } from 'react-router-redux'

import createStore from 'store/createStore'

const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: ''
})
const initialState = window.___INITIAL_STATE__
const store = createStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
})

export default {
  store,
  history
}
