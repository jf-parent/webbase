import { combineReducers } from 'redux'
import session from '../reducers'
import { routerReducer as router } from 'react-router-redux'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
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
