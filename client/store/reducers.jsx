import { routerReducer as router } from 'react-router-redux'
import { combineReducers } from 'redux'

import locales from '../locales/reducer'
import session from '../reducers'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    locales,
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
