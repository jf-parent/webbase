import { routerReducer as router } from 'react-router-redux'
import { combineReducers } from 'redux'

import locales from 'locales/reducer'
import notification from 'reducers/notification'
import session from 'reducers/session'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    locales,
    notification,
    session,
    router,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
