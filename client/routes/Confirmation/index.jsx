import { injectReducer } from 'store/reducers'
import { requireAuth } from 'Auth'

export default (store) => ({
  path: 'confirmation',
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Confirmation = require('./containers/ConfirmationContainer').default
      const reducer = require('./modules/reducer').default
      injectReducer(store, { key: 'confirmation', reducer })
      cb(null, Confirmation)
    }, 'confirmation')
  }
})
