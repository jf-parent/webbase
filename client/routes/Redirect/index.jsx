import { injectReducer } from 'store/reducers'
import { requireAuth } from 'Auth'

export default (store) => ({
  path: 'redirect',
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Redirect = require('./containers/RedirectContainer').default
      const reducer = require('./modules/reducer').default
      injectReducer(store, { key: 'redirect', reducer })
      cb(null, Redirect)
    }, 'redirect')
  }
})
